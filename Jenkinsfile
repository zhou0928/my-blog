// my-blog (VitePress) 构建与部署流水线
// 顺序与 .github/workflows/deploy.yml 对齐：stats -> rss -> og -> build -> cleanUrls 修复 -> 推送 gh-pages
// 前置条件：Jenkins 全局凭据里配好 ID 为 github-blog-ssh 的 SSH Username with private key（GitHub deploy key）
pipeline {
    agent any

    environment {
        // Node 22 装在 Jenkins 数据卷里（容器重建不丢）
        NODE_HOME = '/var/jenkins_home/tools/node-22'
        PATH = "${NODE_HOME}/bin:${PATH}"
        // npm 缓存放数据卷，二次构建免重装依赖
        NPM_CONFIG_CACHE = '/var/jenkins_home/npm-cache'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    stages {
        stage('克隆代码') {
            steps {
                // 显式检出，确保工作区是完整仓库（SCM 流水线默认只做轻量检出来取 Jenkinsfile）
                checkout scm
            }
        }

        stage('安装依赖') {
            steps {
                sh 'node -v && npm -v'
                // 国内构建加速
                sh 'npm config set registry https://registry.npmmirror.com'
                sh 'npm ci'
            }
        }

        stage('生成数据') {
            steps {
                // GitHub 仓库统计（无 token 走匿名限额，仓库少够用）
                sh 'npm run stats'
                // RSS 订阅源
                sh 'npm run rss'
                // OG 分享图（纯 SVG 生成，无需浏览器）
                sh 'npm run og'
            }
        }

        stage('构建站点') {
            steps {
                sh 'npm run build'
                // cleanUrls 修复（与 deploy.yml 一致）：把 a.html 复制成 a/index.html
                sh '''
                    find dist -name "*.html" | while read -r f; do
                        dir="${f%.html}"
                        if [ "$(basename "$f")" = "index.html" ] && [ "$(dirname "$f")" = "$dir" ]; then
                            continue
                        fi
                        mkdir -p "$dir"
                        cp "$f" "$dir/index.html"
                    done
                '''
            }
        }

        stage('部署到 GitHub Pages') {
            steps {
                // 用 credentials-binding 把 GitHub SSH 私钥挂成临时文件推送（免 ssh-agent 插件）
                withCredentials([sshUserPrivateKey(
                        credentialsId: 'github-blog-ssh',
                        keyFileVariable: 'SSH_KEY_FILE',
                        knownHostsFileVariable: 'KNOWN_HOSTS_FILE')]) {
                    sh '''
                        set -e
                        export GIT_SSH_COMMAND="ssh -i ${SSH_KEY_FILE} -o UserKnownHostsFile=${KNOWN_HOSTS_FILE} -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new"
                        REMOTE=git@github.com:zhou0928/my-blog.git
                        rm -rf /tmp/gh-pages-deploy
                        # gh-pages 分支可能不存在（首次从 Actions 迁移），克隆失败就新建
                        if ! git clone --depth=1 --branch gh-pages "$REMOTE" /tmp/gh-pages-deploy; then
                            mkdir -p /tmp/gh-pages-deploy
                            cd /tmp/gh-pages-deploy
                            git init -b gh-pages
                            git remote add origin "$REMOTE"
                        fi

                        cd /tmp/gh-pages-deploy
                        # 清空旧内容（保留 .git），避免已删文章的页面残留
                        find . -mindepth 1 -path './.git' -prune -o -exec rm -rf {} +
                        cp -r "$WORKSPACE/dist/." .

                        git config user.name "Jenkins CI"
                        git config user.email "zhou0928@users.noreply.github.com"
                        git add -A
                        if ! git diff --cached --quiet; then
                            git commit -m "deploy: $(date +%Y-%m-%d\\ %H:%M:%S)"
                            git push origin gh-pages
                        else
                            echo "dist 无变化，跳过推送"
                        fi
                    '''
                }
            }
        }
    }

    post {
        success { echo '✅ 部署完成：https://000902.icu' }
        failure { echo '❌ 构建失败，请查看上方日志' }
        always {
            sh 'rm -rf /tmp/gh-pages-deploy'
        }
    }
}
