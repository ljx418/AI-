# AI 教案 — 验收门槛 & 出门条件 v3.0 (M11 W3-W8 通用)

| 字段 | 内容 |
|------|------|
| 文档版本 | **v3.0** (v2.1 升级) |
| 创建日期 | 2026-06-23 |
| 更新日期 | 2026-06-23 |
| 验收范围 | **W3-W8 通用** (W3-W7 各 1, W8 总验收) |
| 出门条件 | 满足全部 P0 + P1 + 9 主题分层门槛 + 工具/SPA/质量门槛 |
| 关联文档 | [PRD.md v3.0](./PRD.md) / [ARCHITECTURE.md v3.0](./ARCHITECTURE.md) / [MILESTONES.md v3.0](./MILESTONES.md) / [GAP_DRAWIO_V3.xml](./GAP_DRAWIO_V3.xml) |

---

## 0. 版本说明

| 维度 | v2.1 (W2 启动时) | **v3.0 (W3 启动前)** | 变化 |
|------|----------------|---------------------|------|
| 验收范围 | W1-W2 | **W3-W8 (6 月)** | 6 个 W |
| 9 主题门槛 | 30% 粗略 | **P0/P1/P2 分层** | 主题精细化 |
| 工具门槛 | 9 v0.1 维持 | **9 v1.0 + 5 项功能/工具** | 工具升级 |
| SPA 门槛 | 路由 200 | **路由 200 + Lighthouse ≥ 90 + 离线 + 移动** | 多维 |
| 质量门槛 | 字数 + 代码 + 引用 | **+ 链接健康 + 跨主题不双计 + 不重复 L01-L63** | 5 维 |
| 自动化 | inspect + curl | **+ gap_eval + verify_links + verify_routes + 7 步端到端** | 7 项 |

---

## 1. 验收流程 (W3-W8 通用)

```
代码合并 → 自动构建 → 自动化检查 (7 项) → 端到端截屏 (4 步) → 人工抽检 → 审计签字 → 出门
  ↓          ↓                  ↓                      ↓                ↓           ↓          ↓
  git       Vite build    inspect_lessons        snap.mjs × 4      3 课抽样    项目组    W 阶段
  commit    <4s, 0 错     gap_eval              0 page error      500 字/课   评审    ACCEPTANCE
            routes 200    verify_links (95%+)   抽 3 课 + 3 工具              签字     git push
                          verify_routes (200)
                          verify_no_duplicate
                          verify_theme_marker
                          verify_tools_linked
```

**W3 起新增自动化**:
- `gap_eval.mjs` 复算 9 主题覆盖率 (按 PRD v3.0 §2 公式)
- `verify_links.mjs` 链接健康 ≥ 95%
- `verify_routes.mjs` 路由 200 (W3 末: 91 课 + 9 工具 + 9 静态 = 109)
- `verify_no_duplicate.mjs` 跟 L01-L63 课程标题去重
- `verify_theme_marker.mjs` 跨主题课标记 `topics: []` + `primaryTopic`
- `verify_tools_linked.mjs` 每课关联工具页面 200

---

## 2. 9 主题分层门槛 (W3-W8 主题对标)

按 [PRD v3.0 §2 优先级](./PRD.md), 9 主题分 P0/P1/P2 三层, 每层验收门槛不同:

### 2.1 P0 主题 (T1/T2/T4/T6, 4 个) — W3-W4 重点

| 主题 | W2 覆盖 | W3 末 | W4 末 | W8 末 (100%) | 单课字数 | 工具对接 |
|------|--------:|------:|------:|-------------:|--------:|---------|
| **T1 基础** (ML/DL/Python) | 20.1% | 35% | 50% | 100% | ≥ 8K | TokenCounter + BenchmarkRunner |
| **T2 Transformer/NLP** | 17.2% | 35% | 50% | 100% | ≥ 8K | CodeEditor + TokenCounter |
| **T4 微调** (SFT/LoRA/DPO) | 32.7% | 45% | **65%** | 100% | ≥ 8K | BenchmarkRunner + ErrorBook |
| **T6 Agent** | 44.5% | 55% | **70%** | 100% | ≥ 8K | RAGBuilder + AITutor + SandboxPanel |

**P0 验收规则**:
- W3 末: T1+T2 达 35% (空心化修复)
- W4 末: T4+T6 达 65% (深化)
- W8 末: 全部 100%
- **任一 P0 主题不达标 → W 阶段不通过, 打回重写**

### 2.2 P1 主题 (T3/T7/T8, 3 个) — W5-W6 重点

| 主题 | W2 覆盖 | W5 末 | W6 末 | W8 末 (100%) | 单课字数 | 工具对接 |
|------|--------:|------:|------:|-------------:|--------:|---------|
| **T3 RAG** | 47.6% | **65%** | 78% | 100% | ≥ 8K | RAGBuilder + Search + AITutor |
| **T7 项目方案** | 39.7% | 50% | **70%** | 100% | ≥ 8K | SandboxPanel + KnowledgeGraph |
| **T8 行业落地** | 38.8% | 50% | **70%** | 100% | ≥ 8K | RAGBuilder + SandboxPanel |

**P1 验收规则**:
- W5 末: T3 RAG 达 65% (深化)
- W6 末: T7+T8 达 70% (项目 + 行业)
- W8 末: 全部 100%
- **任一 P1 主题不达标 → W 阶段末不通过, 打回 W+1 阶段重写**

### 2.3 P2 主题 (T5/T9, 2 个) — W5/W7 重点

| 主题 | W2 覆盖 | W5 末 | W7 末 | W8 末 (100%) | 单课字数 | 工具对接 |
|------|--------:|------:|------:|-------------:|--------:|---------|
| **T5 DeepSeek/前沿** | 37.1% | **70%** | 85% | 100% | ≥ 8K | TokenCounter + BenchmarkRunner |
| **T9 公司落地** | 28.6% | 40% | **75%** | 100% | ≥ 8K | ErrorBook + BenchmarkRunner |

**P2 验收规则**:
- W5 末: T5 DeepSeek 达 70%
- W7 末: T9 公司落地 达 75%
- W8 末: 全部 100%
- **任一 P2 主题不达标 → W 阶段末不通过, 打回 W+1 阶段重写**

### 2.4 9 主题总覆盖率门槛 (W3-W8 月度)

| W 阶段末 | 9 主题总覆盖率 (按字数) | 累计课数 | 累计字数 |
|---------|----------------------:|--------:|--------:|
| W3 (2026-07) | **≥ 50%** | 91 | 638K |
| W4 (2026-08) | **≥ 65%** | 116 | 838K |
| W5 (2026-09) | **≥ 78%** | 141 | 1,038K |
| W6 (2026-10) | **≥ 88%** | 166 | 1,238K |
| W7 (2026-11) | **≥ 95%** | 191 | 1,438K |
| W8 (2026-12) | **= 100%** | 200 | 1,498K |

---

## 3. 课程内容门槛 (W3 起强化)

### 3.1 单课门槛 (每课必达)

| 字段 | W2 后 | **W3-W8 门槛** | 验证 |
|------|------|--------------|------|
| 字数 | 4,973 (均) | **≥ 8,000** | inspect_lessons.mjs |
| 章节数 (H2/H3) | ≥ 3 | **≥ 5** | inspect_lessons.mjs |
| 代码示例 | ≥ 4 | **≥ 4** | inspect_lessons.mjs |
| 引用 | ≥ 5 | **≥ 6** | inspect_lessons.mjs |
| 配图 | ≥ 2 | **≥ 2** | inspect_lessons.mjs |
| 工具对接 (tools: []) | 弱 | **≥ 1** | verify_tools_linked.mjs |
| 主题归一化 (topics: []) | 无 | **≥ 1, 跨主题标 primaryTopic** | verify_theme_marker.mjs |
| 重复 (vs L01-L63) | 无检查 | **0 重复** | verify_no_duplicate.mjs |

### 3.2 占位检测 (W3 起零容忍)

```bash
grep -E "TODO|占位|模拟数据|待补充|TBD|占|XXX" src/data/lessons.json
# 通过条件: 0 命中
```

### 3.3 跨主题课标记规则

- `topics: ["T4", "T5"]` — 多主题
- `primaryTopic: "T4"` — 唯一主题 (验收按这个算)
- **不标 primaryTopic → 验收按 topics[0] 计**

---

## 4. 工具 v1.0 门槛 (W3-W8)

按 [PRD v3.0 §5.2 工具 v1.0 路线图](./PRD.md), 9 工具分 W 阶段完成 v1.0:

### 4.1 9 工具 v1.0 时间表

| 工具 | v0.1 (W2) | **v1.0 完成 W 阶段** | 关键功能 |
|------|:--------:|:------------------:|---------|
| TokenCounter | ✓ | W3 | + 成本估算 + 5 模型对比 |
| Search | ✓ | W3 | + 跨课搜索 + 知识图谱导航 |
| ErrorBook | ✓ | W4 | + SM-2 算法 + 同步 |
| PromptPlayground | ✓ | W4 | + 5 模型对比 + 版本管理 |
| RAGBuilder | ✓ | W5 | + 多模态 + 持久化 + 课程联动 |
| BenchmarkRunner | ✓ | W5 | + MMLU/HumanEval + 自定义 |
| KnowledgeGraph | ✓ | W6 | + D3 动态 + 200 课图谱 |
| Leaderboard | ✓ | W7 | + 云端同步 (可选) + 多维度 |
| AITutor | ✓ | W8 | + RAG over 200 课 + 多轮对话 |

### 4.2 单工具 v1.0 验收 (5 项功能必达)

每工具 v1.0 必含 5 项功能 (示例: TokenCounter v1.0):

| # | 功能 | 验证方法 |
|---|------|---------|
| 1 | 实时 token 计数 | 手动输入 100 字 → 显示 50 token |
| 2 | 成本估算 (5 模型) | 选 deepseek-v4-flash → 显示 $0.0001 |
| 3 | 5 模型对比 | 同一文本 5 模型 token 数对比 |
| 4 | 复制 token 数 | 一键复制 token 数到剪贴板 |
| 5 | 持久化偏好 | localStorage 保存"默认模型"选择 |

**工具 v1.0 通用 5 项** (按工具定制):
- TokenCounter: 计数 / 成本 / 对比 / 复制 / 持久化
- Search: 全文 / 跨课 / 知识图谱 / 高级筛选 / 持久化
- ErrorBook: 添加 / SM-2 复习 / 统计 / 导出 / 同步
- PromptPlayground: 单模型 / 多模型对比 / 版本管理 / 变量 / 导出
- RAGBuilder: 上传 / 检索 / 持久化 / 多模态 / 课程联动
- BenchmarkRunner: GSM8K / MMLU / HumanEval / 自定义 / 报告
- KnowledgeGraph: 静态 / D3 动态 / 200 课 / 关联点击 / 导出
- Leaderboard: 本地 / 云端同步 / 多维度 / 实名 (可选) / 排行
- AITutor: 单轮 / RAG / 多轮 / 代码生成 / 成本估算

**单工具 v1.0 不达标 → W 阶段不通过**

---

## 5. SPA 质量门槛 (W3-W8 通用)

按 [RUNTIME_QUALITY.md](../specs/RUNTIME_QUALITY.md) 14K 字规范, W3 起新增以下门槛:

### 5.1 性能门槛

| 检查项 | 工具 | W3-W8 门槛 |
|--------|------|-----------|
| Lighthouse 性能 | `lighthouse` CLI | **≥ 90** (W2 后 ~80) |
| Lighthouse 可访问性 | 同上 | **≥ 95** |
| Lighthouse 最佳实践 | 同上 | **≥ 90** |
| Lighthouse SEO | 同上 | **≥ 90** |
| FCP (First Contentful Paint) | 同上 | **≤ 1.5s** |
| LCP (Largest Contentful Paint) | 同上 | **≤ 2.5s** |
| TTI (Time to Interactive) | 同上 | **≤ 3.5s** |
| Bundle 大小 (gzip) | `ls -la dist/assets/index-*.js` | **≤ 1MB** (W2 末 240KB) |
| 主入口 JS (gzip) | 同上 | **≤ 500KB** (W2 末 240KB) |

### 5.2 兼容性门槛

| 检查项 | 工具 | 门槛 |
|--------|------|------|
| 路由 200 | `verify_routes.mjs` | **100%** (W8: 218 路由) |
| 移动端可用 | Playwright + 模拟器 | **100% 路由 200** |
| 离线可用 (PWA) | `sw.js` 测试 | **核心 5 路由 离线 200** |
| Dark mode | 视觉测试 | **所有页面支持** |
| 跨浏览器 | Chrome / Firefox / Safari | **核心 5 路由 200** |

### 5.3 安全门槛

| 检查项 | 工具 | 门槛 |
|--------|------|------|
| CSP 头 | curl -I | **有, 不含 unsafe-inline** |
| 依赖审计 | `npm audit` | **0 high/critical** |
| 密码进 git | `gitleaks` (可选) | **0 命中** |

---

## 6. 端到端验收 (4 步 + 0 error)

按 [PRD v3.0 §7.1 端到端验收](./PRD.md), 每个 W 阶段必跑:

### 6.1 4 步截屏

```bash
# 1. 首页
node scripts/snap.mjs http://localhost:3000/ /tmp/h.png
# 期望: ✅ 页面渲染 (50xxx+ chars, 1 children)

# 2-4. 抽样 3 课 + 3 工具 (新 W 阶段新增的)
node scripts/snap_wait.mjs http://localhost:3000/lesson/LXX /tmp/l.png  # 抽 3 课
node scripts/snap.mjs http://localhost:3000/tools/<tool> /tmp/t.png     # 抽 3 工具
# 期望: textLen: 8xxx+, errors: []
```

### 6.2 0 page error

7 次截屏 console 错误计数:
- 首页 / 3 课 / 3 工具 = 7 次
- **console 错误总和 ≤ 0** (RAG key 重复 warning 不算 error, 但需修)

---

## 7. 链接健康门槛 (W3 起新增)

```bash
node scripts/verify_links.mjs
# 通过条件: ≥ 95% HTTP 200/301/302
# 失败处理: 写 yuque_failed.json, 人工 review, 课程内降级为参考链接
```

**链接分类验证**:
- arXiv 链接: 100% curl
- 官方文档: 100% curl
- GitHub 仓库: 50% 抽样 + 浏览器人工
- 视频/博客: 100% curl

---

## 8. 出门条件清单 (W 阶段 ACCEPTANCE 必含)

W 阶段末必跑且全 PASS 才算"出门":

```
[ ] 1. 字数 (从 lessons.json 实测 ≥ W 阶段目标)
[ ] 2. 课数 (从 lessons_new.jsx 实测 ≥ W 阶段目标)
[ ] 3. 9 主题覆盖率 (按 gap_eval.mjs 重算 ≥ W 阶段门槛)
[ ] 4. 7 步端到端验收 (4 截屏 + 0 error)
[ ] 5. 工具对接 (每课关联的工具页面 200, verify_tools_linked.mjs)
[ ] 6. 链接健康 (verify_links.mjs 95%+)
[ ] 7. 路由 200 (verify_routes.mjs 100%)
[ ] 8. 跨主题课不重复计 (verify_theme_marker.mjs, primaryTopic 标记)
[ ] 9. 没有重复内容 (verify_no_duplicate.mjs 跟 L01-L63 课程标题去重)
[ ] 10. 工具 v1.0 进度 (按 W 阶段表, 不达标不允许走 W+1)
[ ] 11. Lighthouse ≥ 90 (性能 / 可访问性 / 最佳实践)
[ ] 12. 占位检测 (0 命中)
[ ] 13. 治理文档更新 (PRD/ARCH/MILESTONES 跟实际一致)
[ ] 14. git commit + push (ljx418/AI-)
[ ] 15. W 阶段 ACCEPTANCE.md 写完 (M11_W*_ACCEPTANCE.md)
```

**任一项不通过 → W 阶段不通过, 打回重写或 W+1 阶段补偿**

---

## 9. W 阶段出门文件

按 [MILESTONES v3.0 §6](./MILESTONES.md) 验收里程碑:

| W 阶段末 | 出门文件 | 关键指标 |
|---------|---------|---------|
| W3 (2026-07-31) | M11_W3_ACCEPTANCE.md | 9 主题 50% / 91 课 / 638K 字 / 2 工具 v1.0 |
| W4 (2026-08-31) | M11_W4_ACCEPTANCE.md | 9 主题 65% / 116 课 / 838K 字 / 4 工具 v1.0 |
| W5 (2026-09-30) | M11_W5_ACCEPTANCE.md | 9 主题 78% / 141 课 / 1,038K 字 / 6 工具 v1.0 + AI 助教 v0.5 |
| W6 (2026-10-31) | M11_W6_ACCEPTANCE.md | 9 主题 88% / 166 课 / 1,238K 字 / 7 工具 v1.0 + AI 助教 v0.8 |
| W7 (2026-11-30) | M11_W7_ACCEPTANCE.md | 9 主题 95% / 191 课 / 1,438K 字 / 8 工具 v1.0 + AI 助教 v1.0 |
| W8 (2026-12-31) | M11_W8_ACCEPTANCE.md | 9 主题 100% / 200 课 / 1,498K 字 / 9 工具 v1.0 + AI 助教 v1.0 |

**M11_W*_ACCEPTANCE.md 必含**:
1. 实测数据 (字数/课数/覆盖率, 7 步截屏)
2. PRD 规格检视 (逐条对照)
3. 工具 v1.0 进度
4. 链接健康 + 路由 200
5. 偏差说明 + 改进计划
6. git commit hash

---

## 10. 风险与应对 (验收相关)

| 风险 | 影响 | 应对 |
|------|------|------|
| 抓语雀 287 URL 不达标 | 课程线阻塞 | 接受 80% 偏差 (≥ 230 URL), 缺口走人工选题 |
| 写课 sub-agent 产能低 | 单课 < 8K 字 | sub-agent 必含扩写循环, 验收时不达标打回 |
| 工具 v1.0 跨 W 延期 | 形式线落后 | 工具 v0.1 即可, v1.0 收尾可在 W8 集中 |
| 主题归一化边界混淆 | 总字数虚高 | verify_theme_marker 强制 primaryTopic |
| 重复 L01-L63 内容 | 浪费时间 | verify_no_duplicate 强制 0 命中 |
| Lighthouse 难达 90 | SPA 质量不达标 | W3 启动前先做 1 次 Lighthouse 审计, 找瓶颈 |
| Chrome 库依赖 (WSL2) | 抓取失败 | 复用 playwright-libs, 写进 RESTORE.md §9 |

---

## 11. 附录

### 11.1 引用文档

- [PRD.md v3.0](./PRD.md) — 9 主题对标 + 阶段时间表
- [ARCHITECTURE.md v3.0](./ARCHITECTURE.md) — 9 主题课程架构 + 4 子模块
- [MILESTONES.md v3.0](./MILESTONES.md) — W3-W8 月度里程碑
- [GAP_DRAWIO_V3.xml](./GAP_DRAWIO_V3.xml) — 4 大区域图
- [M11_YUQUE_GAP_V2.md](./M11_YUQUE_GAP_V2.md) — W2 后基线
- [MASTER_PLAN_18M.md](./MASTER_PLAN_18M.md) — v2 历史
- [RUNTIME_QUALITY.md](../specs/RUNTIME_QUALITY.md) — 运行时质量 14K 字规范
- [VERIFY_LINKS.md](../specs/VERIFY_LINKS.md) — 链接验证 11K 字规范
- [RESTORE.md §9](../RESTORE.md) — 新电脑环境恢复

### 11.2 验收脚本清单 (W3 起新增)

```
scripts/
├── inspect_lessons.mjs          # 字数 (W1 起)
├── gap_eval.mjs                 # 9 主题覆盖率 (W2 起)
├── verify_links.mjs             # 链接健康 (W3 起, 升级)
├── verify_routes.mjs            # 路由 200 (W3 起, 新增)
├── verify_no_duplicate.mjs      # 跟 L01-L63 课程标题去重 (W3 起, 新增)
├── verify_theme_marker.mjs      # 跨主题课标记 (W3 起, 新增)
├── verify_tools_linked.mjs      # 每课工具对接 (W3 起, 新增)
├── snap.mjs                     # 端到端截屏 (W1 起)
├── snap_wait.mjs                # 异步数据后截屏 (W1 起)
├── snap_debug.mjs               # 详细调试 (W1 起)
├── lighthouse.mjs               # Lighthouse CLI 包装 (W3 起, 新增)
└── audit_lesson.py              # 课程审计 (W1 起)
```

### 11.3 修订历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-06-10 | 初版 |
| v2.0 | 2026-06-12 | W1 验收嵌入 |
| v2.1 | 2026-06-15 | W2 验收 + 自动化 (inspect_lessons) |
| **v3.0** | **2026-06-23** | **W3-W8 通用 + 9 主题分层 + 工具 v1.0 + SPA 质量 + 7 步端到端** |

---

*生成时间: 2026-06-23*
*生成人: M11 W3 规划 agent (Claude, 换机后首日)*
*下一阶段: W3 启动前需新增 6 个 verify_*.mjs 验收脚本, 配合 snap.mjs 跑 7 步端到端*
