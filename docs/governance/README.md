# AI 教案 — Governance 文档索引

**生成时间**: 2026-06-15
**当前阶段**: M11 W2 (追赶语雀 dhluml 内容)
**总文档数**: 19 份 (含本索引)

---

## 📚 快速入口 (按角色)

### 🆕 第一次了解项目
1. [PRD.md](./PRD.md) — 产品需求
2. [ARCHITECTURE.md](./ARCHITECTURE.md) — 目标架构
3. [diagrams/GAP_DRAWIO.md](./diagrams/GAP_DRAWIO.md) — 6 张差距图

### 🛠️ 准备开发
1. [MILESTONES.md](./MILESTONES.md) — 进度节点
2. [ACCEPTANCE.md](./ACCEPTANCE.md) — 验收门槛
3. [M11_W2_PLAN.md](./M11_W2_PLAN.md) — 当前阶段开发计划
4. [M11_W2_GAP_REEVALUATION.md](./M11_W2_GAP_REEVALUATION.md) — 差距数据

### 🧪 准备验收
1. [ACCEPTANCE.md](./ACCEPTANCE.md) §9 — Quick Run 脚本
2. [scripts/inspect_lessons.mjs](../../scripts/inspect_lessons.mjs) — 课数据实测
3. [scripts/gap_eval.mjs](../../scripts/gap_eval.mjs) — 9 专题覆盖率

---

## 📋 文档全清单 (按用途分组)

### A. 核心规格 (4 份)

| 文档 | 路径 | 版本 | 用途 | 更新日期 |
|------|------|:----:|------|----------|
| PRD | [PRD.md](./PRD.md) | v2.2 | 产品需求 (含 M11 W2) | 2026-06-15 |
| 目标架构 | [ARCHITECTURE.md](./ARCHITECTURE.md) | v2.2 | 技术架构 (含 63 课路由) | 2026-06-15 |
| 里程碑 | [MILESTONES.md](./MILESTONES.md) | v2.0 | M1-M11 进度 | 2026-06-15 |
| 验收门槛 | [ACCEPTANCE.md](./ACCEPTANCE.md) | v2.1 | 出门条件 + Quick Run | 2026-06-15 |

### B. 视觉化差距 (2 份)

| 文件 | 路径 | 状态 | 用途 |
|------|------|:----:|------|
| Gap 说明 | [diagrams/GAP_DRAWIO.md](./diagrams/GAP_DRAWIO.md) | v2.0 | 6 张图含义 |
| M11 W2 图 | [diagrams/gap-drawio-m11w2.xml](./diagrams/gap-drawio-m11w2.xml) | 102 cells | W2 目标 vs 现状 |
| 旧 M5 图 | [diagrams/gap-drawio.xml](./diagrams/gap-drawio.xml) | 历史 | M5 24 课 |
| 旧 M5 图 v2 | [diagrams/gap-drawio-v2.xml](./diagrams/gap-drawio-v2.xml) | 历史 | M5-M8 8 工具 |
| 旧 M8 图 | [diagrams/phase2-gap-drawio.drawio](./diagrams/phase2-gap-drawio.drawio) | 历史 | M8 35 课 |

### C. M11 阶段报告 (5+ 份)

| 文档 | 路径 | 阶段 | 状态 |
|------|------|------|:----:|
| W1A 基础篇 | [M11_W1A_BASICS_REPORT.md](./M11_W1A_BASICS_REPORT.md) | M11 W1 | ✅ |
| W1B RAG 篇 | [M11_W1B_RAG_REPORT.md](./M11_W1B_RAG_REPORT.md) | M11 W1 | ✅ |
| W1 端到端 | [M11_W1_ACCEPTANCE.md](./M11_W1_ACCEPTANCE.md) | M11 W1 | ✅ |
| W2 计划 | [M11_W2_PLAN.md](./M11_W2_PLAN.md) | M11 W2 | ⏳ |
| W2 差距重评估 | [M11_W2_GAP_REEVALUATION.md](./M11_W2_GAP_REEVALUATION.md) | M11 W2 | ⏳ |
| W2A 行业 | [M11_W2A_INDUSTRY_REPORT.md](./M11_W2A_INDUSTRY_REPORT.md) | M11 W2 | ⏳ 待写 |
| W2B 微调 | [M11_W2B_FT_REPORT.md](./M11_W2B_FT_REPORT.md) | M11 W2 | ⏳ 待写 |
| W2C Agent | [M11_W2C_AGENT_REPORT.md](./M11_W2C_AGENT_REPORT.md) | M11 W2 | ⏳ 待写 |
| W2 端到端 | [M11_W2_ACCEPTANCE.md](./M11_W2_ACCEPTANCE.md) | M11 W2 | ⏳ 待写 |

### D. W2 Agent 任务书 (5 份, 在 docs/w2_agents/)

| 文档 | 路径 | 用途 |
|------|------|------|
| W2.A 行业 Agent 任务 | [w2_agents/w2a_industry_agent.md](../w2_agents/w2a_industry_agent.md) | 6 课生成 |
| W2.B 微调 Agent 任务 | [w2_agents/w2b_finetune_agent.md](../w2_agents/w2b_finetune_agent.md) | 4 课生成 |
| W2.C Agent Agent 任务 | [w2_agents/w2c_agent_agent.md](../w2_agents/w2c_agent_agent.md) | 5 课生成 |
| L49-L54 prompt | [w2_agents/prompts/l49-l54_industry.md](../w2_agents/prompts/l49-l54_industry.md) | 行业 6 课 prompt |
| L55-L58 prompt | [w2_agents/prompts/l55-l58_finetune.md](../w2_agents/prompts/l55-l58_finetune.md) | 微调 4 课 prompt |
| L59-L63 prompt | [w2_agents/prompts/l59-l63_agent.md](../w2_agents/prompts/l59-l63_agent.md) | Agent 5 课 prompt |

### E. 早期阶段 (4 份, 历史)

| 文档 | 路径 | 阶段 | 备注 |
|------|------|------|------|
| M8 课程 | [M8_COURSES_V1.md](./M8_COURSES_V1.md) | M8 | L01-L36 列表 |
| M8 阶段验收 | [M8_PHASE_ACCEPTANCE.md](./M8_PHASE_ACCEPTANCE.md) | M8 | ✅ |
| M8 工具 | [M8_TOOLS_V1.md](./M8_TOOLS_V1.md) | M8 | 8 工具 |
| M9 AI Tutor | [M9_AI_TUTOR.md](./M9_AI_TUTOR.md) | M9 | Mock 规格 |
| 文档评估 | [DOC_EVALUATION.md](./DOC_EVALUATION.md) | M5 | 早期审计 |
| 进展报告 | [PROGRESS_REPORT.md](./PROGRESS_REPORT.md) | M8 | 旧版 |

### F. 早期计划 (已废, 仅留档)

| 文档 | 路径 | 备注 |
|------|------|------|
| PHASE2_PLAN | [PHASE2_PLAN.md](./PHASE2_PLAN.md) | M8 计划 |
| EXECUTION_PLAN | [EXECUTION_PLAN.md](./EXECUTION_PLAN.md) | M5 执行 |
| PHASE_W2_W4_PLAN | [PHASE_W2_W4_PLAN.md](./PHASE_W2_W4_PLAN.md) | 已废 |
| PHASE_W5_W8_PLAN | [PHASE_W5_W8_PLAN.md](./PHASE_W5_W8_PLAN.md) | 已废 |

---

## 🛠️ 验收脚本 (scripts/)

| 脚本 | 用途 | 使用方法 |
|------|------|----------|
| [inspect_lessons.mjs](../../scripts/inspect_lessons.mjs) | 实测 48 课字数/代码/引用/sections/placeholder | `node scripts/inspect_lessons.mjs [--topic L37-L48] [--strict]` |
| [gap_eval.mjs](../../scripts/gap_eval.mjs) | 9 专题覆盖率 (按字数实测) | `node scripts/gap_eval.mjs [--json]` |
| [md_to_lesson.mjs](../../scripts/md_to_lesson.mjs) | Markdown → JSX lesson 转换 | (W1 内部工具) |
| [audit_lesson.py](../../scripts/audit_lesson.py) | 旧 M5 审计脚本 | (历史) |
| [verify_arxiv.py](../../scripts/verify_arxiv.py) | arxiv URL 验证 | (历史) |
| [fix-quiz-ids.py](../../scripts/fix-quiz-ids.py) | 测验 ID 修复 | (历史) |

---

## 📁 目录结构

```
1-AI教案/
├── docs/
│   ├── governance/                       # 本目录 (19 份治理文档)
│   │   ├── README.md                     # 本索引
│   │   ├── PRD.md                        # 产品需求 (v2.2)
│   │   ├── ARCHITECTURE.md               # 目标架构 (v2.2)
│   │   ├── MILESTONES.md                 # 里程碑 (v2.0)
│   │   ├── ACCEPTANCE.md                 # 验收 (v2.1)
│   │   ├── M11_W1A_BASICS_REPORT.md      # W1 基础篇
│   │   ├── M11_W1B_RAG_REPORT.md         # W1 RAG 篇
│   │   ├── M11_W1_ACCEPTANCE.md          # W1 端到端
│   │   ├── M11_W2_PLAN.md                # W2 计划
│   │   ├── M11_W2_GAP_REEVALUATION.md    # W2 差距
│   │   └── diagrams/
│   │       ├── GAP_DRAWIO.md             # 6 图说明
│   │       ├── gap-drawio-m11w2.xml      # W2 6 图 (102 cells)
│   │       ├── gap-drawio.xml            # 旧 M5
│   │       ├── gap-drawio-v2.xml         # 旧 M5-M8
│   │       └── phase2-gap-drawio.drawio  # 旧 M8
│   ├── w2_agents/                        # W2 Agent 任务书 (4 份)
│   │   ├── w2a_industry_agent.md
│   │   ├── w2b_finetune_agent.md
│   │   ├── w2c_agent_agent.md
│   │   └── prompts/
│   │       ├── l49-l54_industry.md       # 6 课
│   │       ├── l55-l58_finetune.md       # 4 课
│   │       └── l59-l63_agent.md          # 5 课
│   └── specs/                            # 早期规格 (M5)
├── scripts/                              # 验收脚本 (6 个)
│   ├── inspect_lessons.mjs               # W1/W2 核心验收
│   ├── gap_eval.mjs                      # 9 专题覆盖率
│   ├── md_to_lesson.mjs                  # md → JSX
│   ├── audit_lesson.py                   # M5 旧
│   ├── verify_arxiv.py                   # M5 旧
│   └── fix-quiz-ids.py                   # M5 旧
└── src/
    └── data/
        └── lessons_new.jsx               # 48 课 (W2 后 63)
```

---

## 🔄 阅读顺序建议

### 新成员加入 (3 阶段)

1. **理解项目** (1h): PRD → ARCHITECTURE → M11_W2_GAP_REEVALUATION
2. **理解当前** (30min): MILESTONES → M11_W1_ACCEPTANCE → M11_W2_PLAN
3. **理解验收** (30min): ACCEPTANCE → 跑 `node scripts/inspect_lessons.mjs` + `node scripts/gap_eval.mjs`

### M11 W2 启动 (3 步)

1. **读 W2 计划**: [M11_W2_PLAN.md](./M11_W2_PLAN.md)
2. **看 6 张图**: [diagrams/gap-drawio-m11w2.xml](./diagrams/gap-drawio-m11w2.xml) (在 draw.io 打开)
3. **按子 Agent 任务书执行**:
   - W2.A: [w2_agents/w2a_industry_agent.md](../w2_agents/w2a_industry_agent.md) + [prompts/l49-l54_industry.md](../w2_agents/prompts/l49-l54_industry.md)
   - W2.B: [w2_agents/w2b_finetune_agent.md](../w2_agents/w2b_finetune_agent.md) + [prompts/l55-l58_finetune.md](../w2_agents/prompts/l55-l58_finetune.md)
   - W2.C: [w2_agents/w2c_agent_agent.md](../w2_agents/w2c_agent_agent.md) + [prompts/l59-l63_agent.md](../w2_agents/prompts/l59-l63_agent.md)

---

## ⚠️ 已知不一致 (诚实标注)

1. **PRD/ARCH/MILE/ACC 的 "v2.x" 文档**写于 2026-06-15, 但反映的是 M11 W2 计划 (尚未开始)。W1 (48 课) 是事实, W2 (63 课) 是目标。
2. **scripts/ 中的 md_to_lesson.mjs** 是从 W1 临时目录 (/tmp/m11_tools/) 拷过来, 未必在 W2 直接可用, 启动时需验证。
3. **L01-L36 共 35 课字数 < 8K**: 这是历史问题, W2 验收脚本会标 ✗。W2.A/B/C 范围 (L49-L63) 才是 W2 重点, 不影响出门。
4. **语雀 9 专题权重是启发式分配** (按 287 文档按"热度"分), 不是逐文档实测。如需 100% 精准, W2 启动前需用 Puppeteer 抓取每专题实测字数替换。

---

## 📝 修订历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-06-15 | 初版, 19 份治理文档全索引 |
