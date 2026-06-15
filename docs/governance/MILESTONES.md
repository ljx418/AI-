# AI 教案 — 项目里程碑 (Milestones)

| 字段 | 内容 |
|------|------|
| 文档版本 | v2.0 |
| 创建日期 | 2026-06-10 |
| 更新日期 | 2026-06-15 |
| 项目启动 | 2026-04 |
| 当前阶段 | **M11 W1 完成, W2 启动** |

---

## 1. 里程碑全景 (M11 视角)

```
M1(基础) → M2(Web迁移) → M3(代码执行) → M4(治理) → M5(深化) → M6-M7(工具)
                                                            ↓
M11 W1(基础+RAG) ✅ → M11 W2(行业+微调+Agent) ▶ 启动 → M11 W3(剩余专题) → M12+(持续追赶)
   6/15 完成            6/15-6/30                  7月+              持续
```

**M11 全部完成时**: 80+ 课, 100 万字, 9 专题覆盖 50%+

---

## 2. 已完成里程碑 (M1-M5 + M11 W1)

### M1 — 基础架构 (2026-04)
| 任务 | 状态 | 交付 |
|------|:----:|------|
| 选型 React + Vite | ✓ | package.json |
| 24 课 MD 内容初版 | ✓ | AI教材_L*.md |
| 课程大纲静态页 | ✓ | AI教材详细课程大纲.html |
| 基础 UI 框架 | ✓ | components/* |

### M2 — 内容迁移到 Web (2026-05)
| 任务 | 状态 | 交付 |
|------|:----:|------|
| MD → lessons.jsx | ✓ | src/data/lessons.jsx |
| React Router 单页 | ✓ | App.jsx + 8 routes |
| 配图整合 | ✓ | images/*.svg |
| 4 个静态页 iframe 嵌入 | ✓ | StaticPages.jsx |
| 测验题库 240 题 | ✓ | questions.json |
| 进度追踪 IndexedDB | ✓ | utils/storage.js |

### M3 — 代码执行集成 (2026-05 末)
| 任务 | 状态 | 交付 |
|------|:----:|------|
| Pyodide WebWorker | ✓ | workers/pyodide.worker.js |
| Pyodide 加载器单例 | ✓ | utils/pyodide-loader.js |
| CodeEditor 重构 | ✓ | 集成 Pyodide + SyntaxHighlighter |
| 测验成绩持久化 | ✓ | QuizPanel saveProgress |

### M4 — 完善治理 (2026-06 初)
| 任务 | 状态 | 交付 |
|------|:----:|------|
| 修复 L23 JSON 转义 | ✓ | lesson_L23_fixed.json |
| 合并 24 课到 lessons_new.jsx | ✓ | 24/24 |
| ID 统一 L01-L24 | ✓ | questions.json + id-normalizer.js |
| dark mode | ✓ | ThemeToggle.jsx + CSS variables |
| References 渲染兼容 5 种格式 | ✓ | LessonContent.jsx |
| 大纲页 topic-tag 可跳转 | ✓ | 96 个链接 |

### M5 — 内容深化与项目治理 (2026-06-10 → 2026-06-30)
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
| L39 Naive/Advanced/Modular RAG 三范式 | ✓ | 11,881 字, 10+ 代码, 10 引用 |
| L40 Query Rewriting & Multi-Query | ✓ | 11,409 字, 42 代码, 45 引用 |
| L41 HyDE 假想文档嵌入 | ✓ | 10,701 字, 38 代码, 40 引用 |
| L42 Self-RAG / CRAG | ✓ | 10,000 字, 8 代码, 10 引用 |
| L43 Agentic RAG 代理式 RAG | ✓ | 9,381 字, 28 代码, 30 引用 |
| L44 GraphRAG 知识图谱 RAG | ✓ | 10,097 字, 4 代码, 5 引用 |
| L45 RAG Fusion & RRF 倒数排序融合 | ✓ | 10,052 字, 20 代码, 20 引用 |
| L46 长上下文 RAG | ✓ | 12,097 字, 4 代码, 5 引用 |
| L47 多模态 RAG (ColPali / Late Interaction) | ✓ | 11,953 字 (含 W1 placeholder 修复) |
| L48 RAG 评估 (RAGAS / TruLens) | ✓ | 9,141 字, 6 代码, 5 引用 |
| **W1 累计** | **✓** | **+12 课 +10.6 万字, build 2.92s, 25 路由全 200** |

**W1 报告**:
- `docs/governance/M11_W1A_BASICS_REPORT.md` (基础篇)
- `docs/governance/M11_W1B_RAG_REPORT.md` (RAG 篇)
- `docs/governance/M11_W1_ACCEPTANCE.md` (端到端验收)
- `docs/governance/M11_W2_GAP_REEVALUATION.md` (差距重评估)

---

## 3. 当前阶段 — M11 W2 (2026-06-15 → 2026-06-30) ▶ 启动

### 3.1 阶段目标

**主题**: 行业案例/项目方案 + 微调深化 + Agent 深化 三批并行冲刺

**总目标**:
- +15 课 (L49-L63)
- +18 万字 (累计 44 万)
- 9 专题总覆盖率 16.8% → **~30%**
- 项目方案/公司落地 覆盖率 2% → **~15%** (P0 短板修复)
- 微调篇 9% → **~35%**
- Agent 篇 7% → **~30%**

### 3.2 子阶段任务清单

#### W2.A — 行业案例/项目方案/公司落地 (P0, L49-L54, 6 课)

| ID | 任务 | 字数 | 工具 | 状态 |
|----|------|-----:|------|:----:|
| W2.A-T1 | 启动/任务书/prompt 生成 | - | - | ⏳ |
| W2.A-T2 | L49 大厂 LLM 训练全流程拆解 | 14,000 | deepseek | ⏳ |
| W2.A-T3 | L50 真实 RAG 工业案例 | 13,000 | deepseek | ⏳ |
| W2.A-T4 | L51 Agent 工业落地 | 12,000 | deepseek | ⏳ |
| W2.A-T5 | L52 行业面试高频真题精讲 | 13,000 | deepseek | ⏳ |
| W2.A-T6 | L53 AI 产品方案设计 | 12,000 | deepseek | ⏳ |
| W2.A-T7 | L54 行业 SDK 集成实战 | 12,000 | deepseek | ⏳ |
| W2.A-T8 | md→JSX 转换 | - | md_to_lesson.mjs | ⏳ |
| W2.A-T9 | build 验证 + 路由 200 | - | Vite + curl | ⏳ |
| W2.A-T10 | **M11_W2A_INDUSTRY_REPORT.md** | - | - | ⏳ |

**W2.A 验收**:
- [ ] 6 课全部 ≥8K 字, 全部含 ≥1 真实公司名 (字节/阿里/腾讯/百度/美团/DeepSeek)
- [ ] 累计 +76K 字
- [ ] 6 路由全 200
- [ ] build 绿
- [ ] 报告写完

#### W2.B — 微调篇深化 (P0, L55-L58, 4 课)

| ID | 任务 | 字数 | 工具 | 状态 |
|----|------|-----:|------|:----:|
| W2.B-T1 | L55 全参数 SFT 工程化 | 13,000 | deepseek | ⏳ |
| W2.B-T2 | L56 LoRA 进阶 (DoRA/AdaLoRA/LoftQ) | 12,000 | deepseek | ⏳ |
| W2.B-T3 | L57 QLoRA 4-bit 实战 | 12,000 | deepseek | ⏳ |
| W2.B-T4 | L58 DPO/KTO/SimPO/ORPO 对比 | 13,000 | deepseek | ⏳ |
| W2.B-T5 | md→JSX 转换 + build + 路由 200 | - | md_to_lesson.mjs + Vite | ⏳ |
| W2.B-T6 | **M11_W2B_FT_REPORT.md** | - | - | ⏳ |

**W2.B 验收**:
- [ ] 4 课全部 ≥8K 字, 全部含 ≥1 github.com 链接 (trl/peft/unsloth)
- [ ] 累计 +50K 字
- [ ] 4 路由全 200
- [ ] build 绿
- [ ] 报告写完

#### W2.C — Agent 篇深化 (P1, L59-L63, 5 课)

| ID | 任务 | 字数 | 工具 | 状态 |
|----|------|-----:|------|:----:|
| W2.C-T1 | L59 ReAct/Reflexion/ReWOO 模式对比 | 12,000 | deepseek | ⏳ |
| W2.C-T2 | L60 Multi-Agent 协作 (AutoGen/CrewAI) | 13,000 | deepseek | ⏳ |
| W2.C-T3 | L61 Harness Engineering 实战 (MCP 集成) | 12,000 | deepseek | ⏳ |
| W2.C-T4 | L62 Hermes Agent / Codex 深度使用 | 12,000 | deepseek | ⏳ |
| W2.C-T5 | L63 Agent 评估 + 安全防护 | 12,000 | deepseek | ⏳ |
| W2.C-T6 | md→JSX + build + 路由 200 | - | md_to_lesson.mjs + Vite | ⏳ |
| W2.C-T7 | **M11_W2C_AGENT_REPORT.md** | - | - | ⏳ |

**W2.C 验收**:
- [ ] 5 课全部 ≥8K 字, 全部含 ≥1 真实框架名 (AutoGen/CrewAI/LangGraph)
- [ ] 累计 +61K 字
- [ ] 5 路由全 200
- [ ] build 绿
- [ ] 报告写完

#### W2.Z — 端到端验收 (P0)

| ID | 任务 | 工具 | 状态 |
|----|------|------|:----:|
| W2.Z-T1 | 跑 inspect_lessons.mjs 63 课实测 | inspect_lessons.mjs | ⏳ |
| W2.Z-T2 | 63 课路由 + 9 工具 + 5 静态 全 200 | curl | ⏳ |
| W2.Z-T3 | 老课 L01-L48 回归测试 | curl | ⏳ |
| W2.Z-T4 | 复算 9 专题覆盖率 (M11_W2_GAP_REEVALUATION.md) | gap_eval.mjs | ⏳ |
| W2.Z-T5 | 抽样 3 课人工 spot-check (≥500 字) | 人工 | ⏳ |
| W2.Z-T6 | 写 **M11_W2_ACCEPTANCE.md** | - | ⏳ |

**W2.Z 验收**:
- [ ] 63 课字数累计 ≥42 万
- [ ] 77 路由 (63+9+5) 全 200
- [ ] 9 专题总覆盖率 ≥ 30%
- [ ] 3 课人工抽样通过 (无 placeholder 污染)
- [ ] 报告写完

### 3.3 W2 资源与时间

| 资源 | 用途 | W2 预估 |
|------|------|---------|
| deepseek-v4-flash | 长文撰写 15 课 | 450K tokens |
| minimax image-01 | 15 张封面 SVG | 15 张 |
| 子 Agent | 3 个并行 (A/B/C) | 90 分钟 wall-clock |
| 工程师时间 | 编排/验收 | 4-6 小时 (3 周) |

### 3.4 W2 风险与决策记录

| 日期 | 决策 | 理由 |
|------|------|------|
| 2026-06-15 | W2 拆 3 子 Agent 并行 (A/B/C) | 避免 W1 单 Agent 处理 10 课的 stall 风险 |
| 2026-06-15 | W2.A 优先级 > W2.B > W2.C | 项目方案缺口最大 (399.9K) |
| 2026-06-15 | Agent prompt 强制 placeholder 检测 | W1 教训 (L47 污染) |
| 2026-06-15 | 跑 inspect_lessons.mjs 硬验收 | 估算覆盖率严重偏离实际 |

---

## 4. 未来里程碑 (M11 W3+)

### M11 W3 — 剩余专题追赶 (2026-07, 估)

| 任务 | 目标 | 估时 |
|------|------|------|
| DeepSeek/前沿模型篇 4-6 课 (L64-L69) | 覆盖 9% → 50% | 6h agent |
| 基础篇深化 3-5 课 (L70-L74) | 20% → 50% | 5h agent |
| Transformer 篇深化 3-5 课 (L75-L79) | 17% → 50% | 5h agent |
| M11_W3_ACCEPTANCE.md | - | - |

### M12 — 工具 v1.0 + AI 助教 API (2026-Q3, 估)

| 任务 | 目标 |
|------|------|
| Prompt Playground v1.0 | 模型市场 20+ / 参数调优 |
| RAG Builder v1.0 | 多文档/多模态/持久化 |
| Knowledge Graph v1.0 | 80+ 课图谱 |
| AI 助教 API 集成 | 替换 Mock |

### M13 — PWA 增强 + 公开发布 (2026-Q4, 估)

| 任务 | 目标 |
|------|------|
| Lighthouse ≥ 90 | 性能优化 |
| Lighthouse CI | 自动化 |
| 部署到 vercel.app | 公开发布 |
| GitHub README | 介绍页 |

---

## 5. 关键日期

| 日期 | 事件 | 状态 |
|------|------|:----:|
| 2026-04 | M1 启动 | ✓ |
| 2026-05 | M2-M3 | ✓ |
| 2026-06-10 | M4 完成 + M5 启动 | ✓ |
| 2026-06-15 | **M11 W1 完成 + W2 启动** | ✓ / ▶ |
| 2026-06-21 | W2.A 完成 (估) | ⏳ |
| 2026-06-28 | W2.B + W2.C 前 2 课完成 (估) | ⏳ |
| 2026-06-30 | **W2 验收 (63 课, 44 万字)** | ⏳ |
| 2026-07-31 | M11 W3 完成 (估) | ⏳ |
| 2026-Q3 | M12 工具 v1.0 (估) | ⏳ |
| 2026-Q4 | M13 公开发布 (估) | ⏳ |

---

## 6. 进度追踪

| 阶段 | 计划 | 完成 | 偏差 | 累计课数 | 累计字数 |
|------|------|------|------|----------|----------|
| M1 | 4 月初 | 4 月初 | 0 | 0 | 0 |
| M2 | 5 月中 | 5 月底 | +2 周 | 24 | 5.7 万 (估) |
| M3 | 5 月末 | 5 月末 | 0 | 24 | 5.7 万 |
| M4 | 6 月初 | 6 月 10 日 | +1 周 | 24 | 5.7 万 |
| M5 | 6 月中 | 6 月中 | 0 | 24 | 5.7 万 |
| M6-M7 | 6 月中 | 6 月中 | 0 | 24 | 5.7 万 |
| M8 | 6 月中 | 6 月中 | 0 | 24 | 5.7 万 |
| M9 | 6 月中 | 6 月中 | 0 | 24 | 5.7 万 |
| M11 W1 | 6 月 15 日 | 6 月 15 日 | 0 | 48 | 24.1 万 |
| **M11 W2** | 6 月 30 日 | **进行中** | - | **48→63** | **24.1→44 万** |
| M11 W3 | 7 月底 | ⏳ | - | 63→80 | 44→60 万 |

---

## 7. 风险与决策记录

| 日期 | 决策 | 理由 |
|------|------|------|
| 2026-04 | 选 React + Vite (而非 Vue/Nuxt) | 团队熟悉度 + 生态 |
| 2026-05 | 选 Pyodide (而非 JupyterLite iframe) | 上下文连贯 |
| 2026-06 | 暂不做复习提醒 (SM-2 算法备用) | P2, 按用户决策 C 跳过 |
| 2026-06 | 暂不做云同步 | 保持本地优先 |
| 2026-06 | 暂不做 How-to / Glossary / 任务路由 | M7+ 再做 |
| 2026-06-15 | M11 拆 W1/W2/W3 三波冲刺 | 单次 24 课太大, 拆 3 波更可控 |
| 2026-06-15 | W2 按缺口优先级: 行业 > 微调 > Agent | 缺口数据驱动 |
| 2026-06-15 | W2 拆 3 子 Agent 并行 | 避免 W1 单 Agent stall 风险 |
