/**
 * fetch-github-stats.ts
 *
 * 在构建时调用 GitHub API 获取仓库统计数据，
 * 写入 .vitepress/github-stats.json 供前端组件引用。
 *
 * 用法：
 *   node --experimental-strip-types scripts/fetch-github-stats.ts
 *
 * 可选环境变量：
 *   GITHUB_TOKEN  — 用于提高 API 速率限制（CI 里通过 secrets 注入）
 *   GITHUB_USERNAME — 覆盖默认用户名（默认 zhou0928）
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const USERNAME = process.env.GITHUB_USERNAME || 'zhou0928'
const TOKEN = process.env.GITHUB_TOKEN || ''

const headers: Record<string, string> = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'fetch-github-stats-script',
}
if (TOKEN) {
  headers['Authorization'] = `Bearer ${TOKEN}`
}

async function githubFetch(url: string) {
  const res = await fetch(url, { headers })
  if (!res.ok) {
    console.warn(`[warn] GitHub API ${res.status}: ${url}`)
    return null
  }
  // 处理分页：如果请求返回了 Link header，但我们只需要 repos 列表
  return res.json()
}

async function run() {
  console.log(`[fetch-github-stats] Fetching stats for ${USERNAME}...`)

  // 1. 获取用户基本信息（含 public_repos 数）
  const user = (await githubFetch(
    `https://api.github.com/users/${USERNAME}`
  )) as { public_repos: number } | null

  const repoCount = user?.public_repos ?? 0

  // 2. 遍历所有仓库累计 commits
  //    GitHub API 没有直接的 "total commits" 接口，
  //    但每个 repo 的 default branch 有 commit count。
  //    策略：拉取所有 repo 列表，逐个获取 contributor stats（第一个就是总 commit 数）
  let totalCommits = 0
  let page = 1
  const perPage = 100

  while (true) {
    const repos = (await githubFetch(
      `https://api.github.com/users/${USERNAME}/repos?per_page=${perPage}&page=${page}&type=owner`
    )) as Array<{ name: string; fork: boolean }> | null

    if (!repos || repos.length === 0) break

    for (const repo of repos) {
      // 跳过 fork 仓库
      if (repo.fork) continue

      try {
        // contributors stats API 第一个条目就是主账号的 commit 数
        const stats = (await githubFetch(
          `https://api.github.com/repos/${USERNAME}/${repo.name}/contributors?per_page=1`
        )) as Array<{ total: number; login: string }> | null

        if (stats && stats.length > 0 && typeof stats[0].total === 'number') {
          totalCommits += stats[0].total
        }
      } catch {
        // 某些仓库可能会 404（已删除、私有等），跳过即可
      }
    }

    // 如果这页不满，说明已经是最后一页
    if (repos.length < perPage) break
    page++

    // 无 token 限流保护：每页之间暂停 1 秒
    if (!TOKEN) {
      await new Promise((r) => setTimeout(r, 1000))
    }
  }

  const result = {
    commits: totalCommits || 0,
    repos: repoCount || 0,
    fetchedAt: new Date().toISOString(),
  }

  console.log(`[fetch-github-stats] Result: ${result.commits} commits, ${result.repos} repos`)

  const outPath = resolve(__dirname, '..', '.vitepress', 'github-stats.json')
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, JSON.stringify(result, null, 2) + '\n')
  console.log(`[fetch-github-stats] Written to ${outPath}`)
}

run().catch((err) => {
  console.error('[fetch-github-stats] Error:', err)
  process.exit(1)
})
