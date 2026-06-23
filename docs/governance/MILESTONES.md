# AI 教案 — 项目里程碑 (Milestones) v3.0

| 字段 | 内容 |
|------|------|
| 文档版本 | **v3.0** (v2.0 升级) |
| 创建日期 | 2026-06-23 |
| 更新日期 | 2026-06-23 |
| 项目启动 | 2026-04 |
| 当前阶段 | **M11 W2 完成 (63 课), W3 启动** |
| 关联文档 | [PRD.md v3.0](./PRD.md) / [ARCHITECTURE.md v3.0](./ARCHITECTURE.md) / [M11_ACCEPTANCE_CRITERIA_V3.md](./M11_ACCEPTANCE_CRITERIA_V3.md) / [GAP_DRAWIO_V3.xml](./GAP_DRAWIO_V3.xml) |

---

## 0. 版本说明

| 维度 | v2.0 (W2 启动时) | **v3.0 (W3 启动前)** | 变化 |
|------|----------------|---------------------|------|
| 时间窗口 | 18 月 (M1-M14) | **W3-W8 加速 6 月** | 缩 3x |
| 目标 | 80+ 课 / 100 万字 / 9 主题 50% | **200 课 / 1.06M 字 / 9 主题 100%** | 升级 |
| W 阶段 | W1-W2 完成 | **W3-W8 规划** | 6 个 W |
| 治理文档 | 5 个 v2.x | **5 个 v3.0 (本批)** | 同步升级 |

---

## 1. 里程碑全景 (W3-W8 视角)

```
W2 (行业+微调+Agent) ✅ → W3 (T1+T2 空心化修复) → W4 (T4+T6 深化) → W5 (T3+T5)
6/15-6/22 完成                7月                       8月                 9月
   63 课 / 41 万字            91 课 / 64 万字           116 课 / 84 万字    141 课 / 104 万字
   9 主题 39%                 50%                       65%                 78%

   ↓
W6 (T7+T8) → W7 (T9 融合) → W8 (收尾 + 工具 v1.0) → M12+ (社区 + 商业化)
10月           11月             12月                     2027
166 课 / 124 万字   191 课 / 144 万字  200 课 / 150 万字   5K+ MAU
88%                  95%                100% (9 主题)
```

**W3-W8 全部完成时**: **200 课 / 1.06M 字 (9 主题 100%) / 9 工具 v1.0 / AI 助教 v1.0**

---

## 2. 已完成里程碑 (M1-M5 + M11 W1 + W2)

### M1 — 基础架构 (2026-04) ✅
| 任务 | 状态 | 交付 |
|------|:----:|------|
| 选型 React + Vite | ✓ | package.json |
| 24 课 MD 内容初版 | ✓ | AI教材_L*.md |
| 课程大纲静态页 | ✓ | AI教材详细课程大纲.html |
| 基础 UI 框架 | ✓ | components/* |

### M2 — 内容迁移到 Web (2026-05) ✅
| 任务 | 状态 | 交付 |
|------|:----:|------|
| MD → lessons.jsx | ✓ | src/data/lessons.jsx |
| React Router 单页 | ✓ | App.jsx + 8 routes |
| 配图整合 | ✓ | images/*.svg |
| 4 个静态页 iframe 嵌入 | ✓ | StaticPages.jsx |
| 测验题库 240 题 | ✓ | questions.json |
| 进度追踪 IndexedDB | ✓ | utils/storage.js |

### M3 — 代码执行集成 (2026-05 末) ✅
| 任务 | 状态 | 交付 |
|------|:----:|------|
| Pyodide WebWorker | ✓ | workers/pyodide.worker.js |
| Pyodide 加载器单例 | ✓ | utils/pyodide-loader.js |
| CodeEditor 重构 | ✓ | 集成 Pyodide + SyntaxHighlighter |
| 测验成绩持久化 | ✓ | QuizPanel saveProgress |

### M4 — 完善治理 (2026-06 初) ✅
| 任务 | 状态 | 交付 |
|------|:----:|------|
| 修复 L23 JSON 转义 | ✓ | lesson_L23_fixed.json |
| 合并 24 课到 lessons_new.jsx | ✓ | 24/24 |
| ID 统一 L01-L24 | ✓ | questions.json + id-normalizer.js |
| dark mode | ✓ | ThemeToggle.jsx + CSS variables |
| References 渲染兼容 5 种格式 | ✓ | LessonContent.jsx |
| 大纲页 topic-tag 可跳转 | ✓ | 96 个链接 |

### M5 — 内容深化与项目治理 (2026-06-10 → 06-30) ✅
| 任务 | 状态 | 交付 |
|------|:----:|------|
| PRD v2.1 | ✓ | PRD.md |
| 目标架构 v2.0 | ✓ | ARCHITECTURE.md |
| 项目里程碑 v1.0 | ✓ | MILESTONES.md (旧版) |
| 验收门槛 v2.0 | ✓ | ACCEPTANCE.md |
| drawio Gap v1.4 | ✓ | diagrams/GAP_DRAWIO.md |
| M6-M7 工具开发 (3+5) | ✓ | TokenCounter/Search/ErrorBook + Playground/RAG/KG/Leaderboard/Benchmark |
| M8 PWA + Vitest + CI/CD | ✓ | manifest.json + sw.js + vitest.config.js + .github/workflows/ci.yml |
| M9 AI Tutor (Mock) | ✓ | AITutor.jsx |

### M11 W1 — 基础 + RAG 优化策略 (2026-06-15) ✅
| 任务 | 状态 | 交付 |
|------|:----:|------|
| L37 Python 工程化基础 (NumPy/Pandas) | ✓ | 9,829 字, 26 代码, 8 引用 |
| L38 概率论与信息论 (Transformer 预备) | ✓ | 11,570 字, 10 代码, 8 引用 |
| L39-L48 10 个 RAG 优化策略 | ✓ | 10 课, ~50K 字, 30+ 代码 |
| **W1 小计** | ✓ | **48 课, 24.1 万字, 9 主题覆盖 16.8%** |

### M11 W2 — 行业 + 微调 + Agent 深化 (2026-06-15 → 06-22) ✅
| 任务 | 状态 | 交付 |
|------|:----:|------|
| W2.A 行业/项目方案/公司落地 6 课 (L49-L54) | ✓ | 76K 字 (P0 一次补齐 3 主题 24-40pp) |
| W2.B 微调深化 4 课 (L55-L58) | ✓ | ~50K 字 (微调 9% → 32.7%) |
| W2.C Agent 深化 5 课 (L59-L63) | ✓ | ~50K 字 (Agent 7% → 44.5%) |
| **W2 小计** | ✓ | **+15 课, +17 万字, 9 主题 39%** |

**W2 后实测 (2026-06-22)**:
- 课数: **63** (L01-L63)
- 中文字符: **413,252** (实测)
- 9 主题覆盖率: **39.0%** (按字数)
- 597 文档覆盖率: **29.1%** (按字数)
- 路由: 22 (13 工具 + 9 静态)
- 0 page error (snap 验证)

---

## 3. W3-W8 详细里程碑 (本 v3.0 重点)

按 [PRD v3.0 §3 阶段时间表](./PRD.md), W3-W8 月度里程碑:

### W3 — T1 基础 + T2 Transformer (空心化修复) (2026-07) ⏳ 待启动

| 任务 | 子任务 | 交付 | 验收 |
|------|--------|------|------|
| **W3.A T1 基础 (15 课)** | 升级 L01-L12 到 8K+ 字 | +15 课, +120K 字 | inspect_lessons + 单课 ≥ 8K |
| **W3.B T2 Transformer (13 课)** | L29-L41 Attention/Transformer 深化 | +13 课, +105K 字 | inspect_lessons + 单课 ≥ 8K |
| **工具 v1.0 (W3 阶段)** | TokenCounter v1.0 + Search v1.0 | 2 工具 v1.0 | snap.mjs + 功能清单 |
| **抓语雀 287 URL** | 滚动修 bug + 批量抓 | docs/yuque_raw/yuque_urls.json ≥ 287 | URL 计数 |
| **W3 ACCEPTANCE** | 字数/工具/链接/路由 4 维验收 | M11_W3_ACCEPTANCE.md | 4 步端到端 + 0 error |

**W3 末 (2026-07-31) 目标**:
- 课数: 91 (63 + 28)
- 中文字符: 638K (413K + 225K)
- 9 主题覆盖率: **50%** (空心化主题 20% → 50%+)
- 工具 v1.0: 2/9

### W4 — T4 微调 + T6 Agent 深化 (2026-08) ⏳ 待启动

| 任务 | 子任务 | 交付 | 验收 |
|------|--------|------|------|
| **W4.A T4 微调 (15 课)** | L76-L90 SFT/LoRA/DPO/MoE 进阶 | +15 课, +120K 字 | inspect_lessons + 单课 ≥ 8K |
| **W4.B T6 Agent 深化 (10 课)** | L118-L127 Production Agent | +10 课, +80K 字 | inspect_lessons + 单课 ≥ 8K |
| **工具 v1.0 (W4 阶段)** | ErrorBook v1.0 + PromptPlayground v1.0 | 2 工具 v1.0 | snap.mjs + SM-2 算法 |
| **Sandbox v1.0** | 多文件支持 (W3 → W4 持续) | sandbox-panel.jsx tabs | 端到端 |
| **W4 ACCEPTANCE** | 字数/工具/链接/路由 4 维验收 | M11_W4_ACCEPTANCE.md | 4 步端到端 + 0 error |

**W4 末 (2026-08-31) 目标**:
- 课数: 116 (91 + 25)
- 中文字符: 838K
- 9 主题覆盖率: **65%**
- 工具 v1.0: 4/9

### W5 — T3 RAG 深化 + T5 DeepSeek (2026-09) ⏳ 待启动

| 任务 | 子任务 | 交付 | 验收 |
|------|--------|------|------|
| **W5.A T3 RAG 深化 (16 课)** | L48-L63 Agentic RAG / 多模态 RAG | +16 课, +130K 字 | inspect_lessons + 单课 ≥ 8K |
| **W5.B T5 DeepSeek (9 课)** | L98-L106 DeepSeek-V3/R1/Qwen3/Kimi K2 | +9 课, +70K 字 | inspect_lessons + 单课 ≥ 8K |
| **工具 v1.0 (W5 阶段)** | RAGBuilder v1.0 + BenchmarkRunner v1.0 | 2 工具 v1.0 | snap.mjs + 多模态 |
| **AI 助教 v0.5** | RAG over 141 课 | tutor-ui.jsx + rag-index.bin | 端到端对话 |
| **W5 ACCEPTANCE** | 字数/工具/链接/路由 4 维验收 | M11_W5_ACCEPTANCE.md | 4 步端到端 + 0 error |

**W5 末 (2026-09-30) 目标**:
- 课数: 141 (116 + 25)
- 中文字符: 1,038K
- 9 主题覆盖率: **78%**
- 工具 v1.0: 6/9
- AI 助教 v0.5

### W6 — T7 项目方案 + T8 行业落地 (2026-10) ⏳ 待启动

| 任务 | 子任务 | 交付 | 验收 |
|------|--------|------|------|
| **W6.A T7 项目方案 (12 课)** | L138-L149 PRD / AI Native 产品 | +12 课, +100K 字 | inspect_lessons + 单课 ≥ 8K |
| **W6.B T8 行业落地 (13 课)** | L155-L167 智能客服/知识库/搜索/推荐 | +13 课, +100K 字 | inspect_lessons + 单课 ≥ 8K |
| **工具 v1.0 (W6 阶段)** | KnowledgeGraph v1.0 (D3 动态) | 1 工具 v1.0 | snap.mjs + 200 课图谱 |
| **AI 助教 v0.8** | RAG over 166 课 + 多轮对话 | tutor-store.js | 端到端 |
| **云端同步 (可选)** | sync-adapter.js | IndexedDB → 云端 | 跨设备 |
| **W6 ACCEPTANCE** | 字数/工具/链接/路由 4 维验收 | M11_W6_ACCEPTANCE.md | 4 步端到端 + 0 error |

**W6 末 (2026-10-31) 目标**:
- 课数: 166 (141 + 25)
- 中文字符: 1,238K
- 9 主题覆盖率: **88%**
- 工具 v1.0: 7/9
- AI 助教 v0.8

### W7 — T9 公司落地 + 跨主题融合 (2026-11) ⏳ 待启动

| 任务 | 子任务 | 交付 | 验收 |
|------|--------|------|------|
| **W7.A T9 公司落地 (14 课)** | L173-L186 字节/阿里/腾讯/百度/美团 + 海外 | +14 课, +115K 字 | inspect_lessons + 单课 ≥ 8K |
| **W7.B 跨主题融合 (11 课)** | L187-L197 跨主题项目 | +11 课, +85K 字 | inspect_lessons + 单课 ≥ 8K |
| **工具 v1.0 (W7 阶段)** | Leaderboard v1.0 (云端同步) | 1 工具 v1.0 | snap.mjs + 多维度 |
| **AI 助教 v1.0** | RAG over 191 课 + 代码生成 | tutor-ui.jsx v1.0 | 端到端 |
| **W7 ACCEPTANCE** | 字数/工具/链接/路由 4 维验收 | M11_W7_ACCEPTANCE.md | 4 步端到端 + 0 error |

**W7 末 (2026-11-30) 目标**:
- 课数: 191 (166 + 25)
- 中文字符: 1,438K
- 9 主题覆盖率: **95%**
- 工具 v1.0: 8/9
- AI 助教 v1.0

### W8 — 查缺补漏 + 工具 v1.0 收尾 (2026-12) ⏳ 待启动

| 任务 | 子任务 | 交付 | 验收 |
|------|--------|------|------|
| **W8.A 查缺补漏 (9 课)** | L192-L200 跨主题综合 + 查漏 | +9 课, +60K 字 | inspect_lessons + 单课 ≥ 8K |
| **W8.B 工具 v1.0 收尾** | AITutor v1.0 + 9 工具全 v1.0 | AITutor.jsx v1.0 | snap.mjs + RAG over 200 |
| **W8.C 整体验收** | 9 主题 100% + 200 课 + 9 工具 v1.0 | M11_W8_ACCEPTANCE.md | 4 步 + 多维验收 |

**W8 末 (2026-12-31) 目标** (W3-W8 全部完成):
- 课数: **200** (191 + 9)
- 中文字符: **1,498K** (≈ 1.06M 9 主题 + 0.4M 跨主题)
- 9 主题覆盖率: **100%** (按字数)
- 597 文档覆盖率: **75%+**
- 工具 v1.0: **9/9** (全 v1.0)
- AI 助教 v1.0: **RAG over 200 课**

---

## 4. 跨 W 阶段 (M12+ 2027 路线)

| 阶段 | 月份 | 目标 | 关键指标 |
|------|------|------|---------|
| **M12 社区** | 2027-01 ~ 02 | 5,000+ MAU | 月活 + 完课率 30%+ |
| **M13 商业化 (可选)** | 2027-02 ~ 03 | 企业版 + 付费 | 月营收 $5K+ |
| **M14 国际化** | 2027-03 ~ 04 | 英文版 + i18n | 100+ 国际用户 |

---

## 5. 关键路径 (Critical Path)

W3-W8 阶段的关键依赖链:

```
[抓语雀 287 URL] ─→ [分类 9 主题] ─→ [拆解重写 sub-agent] ─→ [W 阶段 ACCEPTANCE]
                                                                  ↓
[PRD/ARCH/MILESTONES/ACCEPTANCE/GAP v3.0] ─→ [W3 启动]    [W 阶段末 inspect_lessons + gap_eval]
                                                                  ↓
                                                        [git commit + push → ljx418/AI-]
                                                                  ↓
                                                        [M12 末 5K MAU 验证]
```

**关键风险点**:
1. **抓语雀 287 URL** (W3 启动前置, 当前 in_progress 修滚动 bug)
2. **写课 sub-agent 产能** (22 课/月, 单 sub-agent 1 主题 1-2 周)
3. **工具 v1.0 收尾** (W8 末 9/9, 跨 W 持续)
4. **AI 助教 v1.0** (RAG over 200 课, W8 末)

---

## 6. 验收里程碑 (W 阶段末)

按 [M11_ACCEPTANCE_CRITERIA_V3.md](./M11_ACCEPTANCE_CRITERIA_V3.md) 9 主题分层门槛 + 工具/SPA/质量门槛:

| W 阶段 | 出门文件 | 关键指标 |
|--------|---------|---------|
| W3 末 | M11_W3_ACCEPTANCE.md | 9 主题覆盖 50% / 91 课 / 638K 字 / 2 工具 v1.0 |
| W4 末 | M11_W4_ACCEPTANCE.md | 9 主题覆盖 65% / 116 课 / 838K 字 / 4 工具 v1.0 |
| W5 末 | M11_W5_ACCEPTANCE.md | 9 主题覆盖 78% / 141 课 / 1,038K 字 / 6 工具 v1.0 + AI 助教 v0.5 |
| W6 末 | M11_W6_ACCEPTANCE.md | 9 主题覆盖 88% / 166 课 / 1,238K 字 / 7 工具 v1.0 + AI 助教 v0.8 |
| W7 末 | M11_W7_ACCEPTANCE.md | 9 主题覆盖 95% / 191 课 / 1,438K 字 / 8 工具 v1.0 + AI 助教 v1.0 |
| W8 末 | M11_W8_ACCEPTANCE.md | 9 主题覆盖 100% / 200 课 / 1,498K 字 / 9 工具 v1.0 + AI 助教 v1.0 |

---

## 7. 度量指标 (W3-W8 季度 Review)

按 [MASTER_PLAN_18M §7](./MASTER_PLAN_18M.md) 北极星:

| 指标 | W2 后 | **W8 目标** | 路径 |
|------|------|------------|------|
| 课程数 | 63 | **200** | +137 |
| 总中文字符 | 413K | **1,498K** | +1,085K |
| 9 主题覆盖率 | 39% | **100%** | +61 pp |
| 工具 v1.0 | 0/9 | **9/9** | 全 v1.0 |
| AI 助教 | Mock | **v1.0** | RAG over 200 |
| Sandbox | Pyodide 单文件 | **多文件 + 课程联动** | 形式超越 |
| 月活跃 (北极星) | 0 | **5,000+** | M12 末验证 |
| 完课率 | 0 | **30%+** | SM-2 + 进度跟踪 |

---

## 8. 附录

### 8.1 引用文档 (本 v3.0 引用链)

- [PRD.md v3.0](./PRD.md) — 9 主题对标 + 阶段时间表
- [ARCHITECTURE.md v3.0](./ARCHITECTURE.md) — 9 主题课程架构 + 4 子模块 + yuque pipeline
- [M11_ACCEPTANCE_CRITERIA_V3.md](./M11_ACCEPTANCE_CRITERIA_V3.md) — 9 主题分层门槛
- [GAP_DRAWIO_V3.xml](./GAP_DRAWIO_V3.xml) — 4 大区域图
- [M11_YUQUE_GAP_V2.md](./M11_YUQUE_GAP_V2.md) — W2 后 9 主题 39% 覆盖率基线
- [MASTER_PLAN_18M.md](./MASTER_PLAN_18M.md) — v2 阶段 (M1-M5) 历史

### 8.2 关键里程碑文件

- `docs/governance/M11_W*_ACCEPTANCE.md` (W3-W8 各 1, 共 6 个)
- `docs/governance/M11_W*_PLAN.md` (W3-W8 各 1, 共 6 个)
- `docs/governance/M11_W*_REPORT.md` (按子阶段)

### 8.3 修订历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-06-10 | 初版 (M1-M8) |
| v2.0 | 2026-06-15 | 加入 M11 W1 + W2 |
| **v3.0** | **2026-06-23** | **W3-W8 加速 6 月 + 200 课 100% 目标** |

---

*生成时间: 2026-06-23*
*生成人: M11 W3 规划 agent (Claude, 换机后首日)*
*下一里程碑: W3.A 启动 (T1 基础 15 课) 在 PRD/ARCH/MILESTONES v3.0 + 287 URL 抓取完成后*
