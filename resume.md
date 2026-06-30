---
layout: page
---

<div class="resume-container">

<div class="resume-header">
  <h1 class="resume-name">周海龙</h1>
  <p class="resume-title">资深前端工程师</p>
  <div class="resume-contact">
    <span>本科</span>
    <span>山东济南</span>
    <a href="https://github.com/zhou0928" target="_blank">GitHub</a>
    <a href="https://www.liushuxiu.com" target="_blank">个人网站</a>
  </div>
</div>

<div class="resume-section">
  <h2>个人定位</h2>
  <div class="resume定位-content">
    <p>主导 <strong>工单流程系统、智慧社区巡检模块、物联网设备中台</strong> 等 ToG/ToB 项目核心功能开发</p>
    <p>专攻 <strong>复杂业务流程前端</strong>（审批流/工单流/权限控制），踩过接口加密、多引擎地图、视频集成、IoT 设备联动的坑</p>
    <p>覆盖 PC 管理后台 + H5 移动端 + uni-app 跨端 + 微信小程序多端</p>
  </div>
</div>

<div class="resume-section">
  <h2>工作经历</h2>
  <div class="timeline">
    <div class="timeline-item">
      <div class="timeline-date">2022.05 — 至今</div>
      <div class="timeline-content">
        <h3>山东铁通有限公司</h3>
        <p class="timeline-role">Web 前端开发工程师</p>
      </div>
    </div>
    <div class="timeline-item">
      <div class="timeline-date">2021.07 — 2022.05</div>
      <div class="timeline-content">
        <h3>北京昊恩星美科技有限公司</h3>
        <p class="timeline-role">Web 前端开发工程师</p>
      </div>
    </div>
    <div class="timeline-item">
      <div class="timeline-date">2021.03 — 2021.07</div>
      <div class="timeline-content">
        <h3>北京讯华信息科技有限公司</h3>
        <p class="timeline-role">Web 前端开发工程师</p>
      </div>
    </div>
  </div>
</div>

<div class="resume-section">
  <h2>专业技能</h2>
  <div class="skills-grid">
    <div class="skill-item"><span class="skill-label">前端框架</span><span class="skill-value">Vue 2/3 全栈生态（Element UI / Ant Design Vue / Avue / Pinia / Vuex / Vue Router）</span></div>
    <div class="skill-item"><span class="skill-label">构建工具</span><span class="skill-value">Vite / Webpack / ESLint 工程化规范，多环境配置</span></div>
    <div class="skill-item"><span class="skill-label">地图引擎</span><span class="skill-value">高德地图 + 百度地图双引擎集成，坐标转换、自定义覆盖物</span></div>
    <div class="skill-item"><span class="skill-label">视频集成</span><span class="skill-value">GB/T 28181 国标协议、HLS 视频流、云台 PTZ 控制</span></div>
    <div class="skill-item"><span class="skill-label">数据可视化</span><span class="skill-value">ECharts / ECharts-GL 3D 可视化，省市级 GIS 数据大屏</span></div>
    <div class="skill-item"><span class="skill-label">IoT 设备</span><span class="skill-value">门禁/道闸/充电桩/烟感/燃气/水浸等 10+ 设备告警联动</span></div>
    <div class="skill-item"><span class="skill-label">安全工程</span><span class="skill-value">AES/RSA 加密传输、按钮级权限控制、数据隔离</span></div>
    <div class="skill-item"><span class="skill-label">移动端</span><span class="skill-value">uni-app 跨端开发、微信小程序、H5 移动端适配</span></div>
    <div class="skill-item"><span class="skill-label">工程化部署</span><span class="skill-value">Docker Compose、CI/CD、Nginx、代码混淆加固</span></div>
    <div class="skill-item"><span class="skill-label">后端协作</span><span class="skill-value">RESTful API 设计、人脸识别系统集成、Python 自动化脚本</span></div>
  </div>
</div>

<div class="resume-section">
  <h2>重点项目</h2>

  <div class="project-block">
    <div class="project-header">
      <h3>智慧社区综合管理平台</h3>
      <span class="project-role">前端负责人</span>
    </div>
    <p class="project-desc">面向政府街道办的智慧社区一体化平台，覆盖物业管理、安防监控、AIoT 告警、政务服务、数据大屏等 20+ 业务模块</p>
    <div class="project-highlights">
      <div class="highlight-item">
        <strong>接口加密兼容</strong>
        <p>区分普通接口与文件上传接口的加密策略，普通请求走加密拦截器，上传接口走白名单，文件上传零故障率</p>
      </div>
      <div class="highlight-item">
        <strong>多社区 GIS 大屏</strong>
        <p>封装高德/百度双地图引擎适配层，设计动态经纬度配置表，一套代码覆盖多个区域</p>
      </div>
      <div class="highlight-item">
        <strong>国标视频监控</strong>
        <p>封装统一视频播放组件，自动判断 HLS/RTSP 格式，兼容多家厂商设备</p>
      </div>
      <div class="highlight-item">
        <strong>AIoT 告警联动</strong>
        <p>抽象设备告警基类 + 扩展机制，新设备类型只需扩展配置，无需改代码</p>
      </div>
    </div>
    <div class="project-tech">Vue 2 · Element UI · ECharts · 高德地图 · 百度地图 · 955 commits</div>
  </div>

  <div class="project-block">
    <div class="project-header">
      <h3>管局 OA</h3>
      <span class="project-role">核心前端开发</span>
    </div>
    <p class="project-desc">政府OA办公系统，覆盖公文流转、审批流程、文件管理、档案管理、移动办公等全模块</p>
    <div class="project-highlights">
      <div class="highlight-item">
        <strong>4 个子仓库</strong>
        <p>OAfront / oafront-transit / oa-qd / mobile，多端覆盖 PC + H5</p>
      </div>
      <div class="highlight-item">
        <strong>核心功能</strong>
        <p>公文收发、审批流程、档案盒管理、永中 Office 在线预览、青岛局定制版同步</p>
      </div>
    </div>
    <div class="project-tech">Vue 2 · Element UI · 2,026 commits</div>
  </div>

  <div class="project-block">
    <div class="project-header">
      <h3>总部智慧楼宇</h3>
      <span class="project-role">前端开发</span>
    </div>
    <p class="project-desc">综合性智慧楼宇管理平台，管理后台 + H5 移动端 + 访客端三端覆盖</p>
    <div class="project-highlights">
      <div class="highlight-item">
        <strong>管理后台</strong>
        <p>访客审核与通行记录、首页数据统计、设备管理</p>
      </div>
      <div class="highlight-item">
        <strong>H5 移动端</strong>
        <p>访客预约、积分记录、登录优化</p>
      </div>
      <div class="highlight-item">
        <strong>工单池</strong>
        <p>工单池管理、详情、审批人权限</p>
      </div>
    </div>
    <div class="project-tech">Vue 2 · Element UI · uni-app · 864 commits</div>
  </div>

  <div class="project-block">
    <div class="project-header">
      <h3>小b 商家运营三平台</h3>
      <span class="project-role">前端开发</span>
    </div>
    <p class="project-desc">零售端/运营端/供应商端三端分离架构</p>
    <div class="project-highlights">
      <div class="highlight-item">
        <strong>运营平台</strong>
        <p>采购订单/退货/调拨管理、营业厅审核</p>
      </div>
      <div class="highlight-item">
        <strong>零售平台</strong>
        <p>开卡结算（聚合支付/组合支付）、卡项管理</p>
      </div>
      <div class="highlight-item">
        <strong>供应商平台</strong>
        <p>调拨商品编号管理</p>
      </div>
    </div>
    <div class="project-tech">Vue 3 · Vite · Ant Design Vue · Element Plus · TypeScript · 429 commits</div>
  </div>

  <div class="project-block">
    <div class="project-header">
      <h3>铁塔能源</h3>
      <span class="project-role">前端开发</span>
    </div>
    <p class="project-desc">工单/合同/账单/充电站管理，全站页面缓存优化</p>
    <div class="project-highlights">
      <div class="highlight-item">
        <strong>工单管理</strong>
        <p>账单异议工单、待办事宜/我的请求/已办/办结</p>
      </div>
      <div class="highlight-item">
        <strong>充电站</strong>
        <p>充电站编号管理、充电端口管理、站址搜索缓存优化</p>
      </div>
    </div>
    <div class="project-tech">Vue 2 · Element UI · ECharts · 275 commits</div>
  </div>
</div>

<div class="resume-section">
  <h2>其他项目</h2>
  <div class="other-projects">
    <span class="other-tag">智慧工地 (94)</span>
    <span class="other-tag">tqw 小程序 (96)</span>
    <span class="other-tag">视联网平台 (83)</span>
    <span class="other-tag">舰艇项目 (76)</span>
    <span class="other-tag">考勤系统 (74)</span>
    <span class="other-tag">hyz uni-app (42)</span>
    <span class="other-tag">智慧校园 (41)</span>
    <span class="other-tag">云上山东数据大屏 (30)</span>
    <span class="other-tag">智慧社区迭代 (18)</span>
    <span class="other-tag">内蒙大屏 (11)</span>
    <span class="other-tag">养老系统 (10)</span>
    <span class="other-tag">万图地图可视化 (9)</span>
  </div>
</div>

<div class="resume-section">
  <h2>Git 贡献</h2>
  <div class="git-stats-resume">
    <div class="git-stat">
      <span class="git-number">4,700+</span>
      <span class="git-label">总 Commits</span>
    </div>
    <div class="git-stat">
      <span class="git-number">24+</span>
      <span class="git-label">子仓库</span>
    </div>
    <div class="git-stat">
      <span class="git-number">20+</span>
      <span class="git-label">项目</span>
    </div>
  </div>
</div>

</div>

<style>
.resume-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
}

.resume-header {
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid var(--vp-c-brand-1);
}

.resume-name {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--blog-gradient-from), var(--blog-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.resume-title {
  font-size: 1.2rem;
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
}

.resume-contact {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  font-size: 0.9rem;
  color: var(--vp-c-text-3);
}

.resume-contact a {
  color: var(--blog-accent);
  text-decoration: none;
}

.resume-contact a:hover {
  text-decoration: underline;
}

.resume-section {
  margin-bottom: 2.5rem;
}

.resume-section h2 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}

.resume定位-content p {
  color: var(--vp-c-text-2);
  line-height: 1.8;
  margin-bottom: 0.5rem;
}

.timeline {
  position: relative;
  padding-left: 1.5rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--vp-c-brand-1);
}

.timeline-item {
  position: relative;
  margin-bottom: 1.5rem;
  padding-left: 1rem;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -1.5rem;
  top: 0.5rem;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--blog-accent);
}

.timeline-date {
  font-size: 0.85rem;
  color: var(--blog-accent);
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.timeline-content h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.25rem;
}

.timeline-role {
  font-size: 0.9rem;
  color: var(--vp-c-text-3);
}

.skills-grid {
  display: grid;
  gap: 0.75rem;
}

.skill-item {
  display: flex;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: var(--blog-card-bg);
  border-radius: 8px;
  border: 1px solid var(--blog-card-border);
}

.skill-label {
  font-weight: 600;
  color: var(--blog-accent);
  min-width: 80px;
  white-space: nowrap;
}

.skill-value {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.project-block {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--blog-card-bg);
  border-radius: 12px;
  border: 1px solid var(--blog-card-border);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.project-header h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0;
}

.project-role {
  font-size: 0.8rem;
  padding: 0.25rem 0.75rem;
  background: var(--blog-accent-soft);
  color: var(--blog-accent);
  border-radius: 20px;
  font-weight: 500;
}

.project-desc {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.project-highlights {
  display: grid;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.highlight-item {
  padding: 0.75rem;
  background: var(--vp-c-bg-alt);
  border-radius: 8px;
}

.highlight-item strong {
  display: block;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
  margin-bottom: 0.25rem;
}

.highlight-item p {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  margin: 0;
  line-height: 1.5;
}

.project-tech {
  font-size: 0.8rem;
  color: var(--blog-accent);
  font-family: 'JetBrains Mono', monospace;
}

.other-projects {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.other-tag {
  padding: 0.4rem 0.8rem;
  background: var(--blog-card-bg);
  border: 1px solid var(--blog-card-border);
  border-radius: 6px;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.git-stats-resume {
  display: flex;
  gap: 2rem;
  justify-content: center;
}

.git-stat {
  text-align: center;
}

.git-number {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  color: var(--blog-accent);
  font-family: 'JetBrains Mono', monospace;
}

.git-label {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
}

@media (max-width: 640px) {
  .resume-name { font-size: 1.8rem; }
  .resume-contact { flex-direction: column; gap: 0.5rem; }
  .project-header { flex-direction: column; align-items: flex-start; }
  .skill-item { flex-direction: column; gap: 0.25rem; }
  .git-stats-resume { flex-direction: column; gap: 1rem; }
}
</style>
