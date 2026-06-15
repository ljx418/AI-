# M11 W2 开发计划 & 验收标准

**生成时间**: 2026-06-15
**阶段**: M11 W2 (追赶语雀 dhluml 内容差距)
**关联文档**:
- [M11_W2_GAP_REEVALUATION.md](./M11_W2_GAP_REEVALUATION.md) (差距数据)
- [PRD.md v2.2](./PRD.md) (需求)
- [ARCHITECTURE.md v2.2](./ARCHITECTURE.md) (架构)
- [MILESTONES.md v2.0](./MILESTONES.md) (里程碑)
- [ACCEPTANCE.md v2.1](./ACCEPTANCE.md) (验收)
- [diagrams/GAP_DRAWIO.md v2.0](./diagrams/GAP_DRAWIO.md) (drawio 视觉化)

---

## 1. 阶段目标 (来自差距重评估)

### 1.1 核心目标

| 指标 | W1 后 (现状) | W2 目标 | 增量 |
|------|----------:|--------:|-----:|
| 课程数 | 48 | **63** | +15 |
| 总中文字符 | 24.1 万 | **44 万** | +20 万 |
| 9 专题总覆盖率 | 16.8% | **≥ 30%** | +13.2pp |
| 行业/项目/公司落地 | 2% | **≥ 15%** | +13pp (P0 修复) |
| 微调篇 | 9% | **≥ 35%** | +26pp |
| Agent 篇 | 7% | **≥ 30%** | +23pp |
| 工具数 | 9 | 9 (不变) | 0 |
| 路由数 | 60+ | 77 (63+9+5) | +15 |

### 1.2 优先级 (缺口降序)

| 排名 | 主题 | 缺口 | 当前覆盖 | W2 目标 |
|----:|------|------:|------:|------:|
| 1 | **行业/项目/公司落地** | -399.9K | 2% | ≥ 15% |
| 2 | **Agent 篇** | -206.5K | 7% | ≥ 30% |
| 3 | **微调篇** | -156.9K | 9% | ≥ 35% |
| 4 | RAG 篇 | -129.7K | 48% | 维持 |
| 5 | 基础篇 | -118.6K | 20% | 维持 |
| 6 | Transformer | -102.4K | 17% | 维持 |
| 7 | DeepSeek | -90.4K | 9% | 维持 |

---

## 2. 开发计划 (3 周, 4 子阶段)

### 2.1 时间线

| 周次 | 阶段 | 课数 | 字数 | 工具 | 截止 |
|------|------|----:|-----:|------|------|
| W2.1 (6/15-6/21) | W2.A 行业方案 | 6 (L49-L54) | 76K | deepseek + minimax | 6/21 |
| W2.2 (6/22-6/28) | W2.B 微调 | 4 (L55-L58) | 50K | deepseek | 6/28 |
| W2.3 (6/29-6/30) | W2.C Agent | 5 (L59-L63) | 61K | deepseek | 6/30 |
| W2.3 (6/30) | W2.Z 端到端验收 | - | - | inspect_lessons + curl | 6/30 |

### 2.2 子阶段任务清单

#### W2.A — 行业方案 (P0, 6 课)

| ID | 课 | 字数 | 关键内容 | 状态 |
|----|---|----:|----------|:----:|
| W2.A-T2 | L49 大厂 LLM 训练拆解 (DeepSeek-V3/Qwen3/Kimi K2) | 14,000 | 三大开源模型架构对比 | ⏳ |
| W2.A-T3 | L50 真实 RAG 工业案例 (字节豆包/阿里通义/腾讯混元) | 13,000 | 工业 RAG 架构 | ⏳ |
| W2.A-T4 | L51 Agent 工业落地 (AutoGen/CrewAI/文心/Hermes) | 12,000 | 多 Agent 协作 | ⏳ |
| W2.A-T5 | L52 行业面试高频真题精讲 (按公司分类) | 13,000 | 字节/阿里/腾讯/百度 | ⏳ |
| W2.A-T6 | L53 AI 产品方案设计 (PRD/AB/上线) | 12,000 | 方案 + 评测 + 上线 | ⏳ |
| W2.A-T7 | L54 行业 SDK 集成实战 (Coze/Dify/百炼) | 12,000 | 主流 SDK 集成 | ⏳ |

#### W2.B — 微调 (P0, 4 课)

| ID | 课 | 字数 | 关键内容 | 状态 |
|----|---|----:|----------|:----:|
| W2.B-T1 | L55 全参数 SFT 工程化 (数据工程/训练流水线) | 13,000 | 数据 + 训练 | ⏳ |
| W2.B-T2 | L56 LoRA 进阶 (DoRA/AdaLoRA/LoftQ) | 12,000 | LoRA 变体 | ⏳ |
| W2.B-T3 | L57 QLoRA 4-bit 实战 (BitsAndBytes) | 12,000 | 4-bit 量化 | ⏳ |
| W2.B-T4 | L58 DPO/KTO/SimPO/ORPO 对比 | 13,000 | RLHF 替代 | ⏳ |

#### W2.C — Agent (P1, 5 课)

| ID | 课 | 字数 | 关键内容 | 状态 |
|----|---|----:|----------|:----:|
| W2.C-T1 | L59 ReAct/Reflexion/ReWOO 模式对比 | 12,000 | 推理模式演进 | ⏳ |
| W2.C-T2 | L60 Multi-Agent 协作 (AutoGen/CrewAI) | 13,000 | 协作 + 通信 | ⏳ |
| W2.C-T3 | L61 Harness Engineering 实战 (MCP 集成) | 12,000 | MCP + 工具调用 | ⏳ |
| W2.C-T4 | L62 Hermes Agent / Codex 深度使用 | 12,000 | Hermes + Codex | ⏳ |
| W2.C-T5 | L63 Agent 评估 + 安全防护 | 12,000 | AgentBench + 越狱 | ⏳ |

#### W2.Z — 端到端验收 (P0)

| ID | 任务 | 工具 |
|----|------|------|
| W2.Z-T1 | 跑 inspect_lessons.mjs 63 课实测 | inspect_lessons.mjs |
| W2.Z-T2 | 77 路由全 200 (63 课 + 9 工具 + 5 静态) | curl |
| W2.Z-T3 | 老课 L01-L48 回归 200 | curl |
| W2.Z-T4 | 复算 9 专题覆盖率 (≥ 30%) | gap_eval.mjs |
| W2.Z-T5 | 抽样 3 课人工 spot-check (≥500 字) | 人工 |
| W2.Z-T6 | 写 M11_W2_ACCEPTANCE.md | - |

---

## 3. 验收标准 (P0 必过)

### 3.1 量化验收

| 指标 | 门槛 | 验证方法 |
|------|------|----------|
| 课数增量 | +15 (L49-L63) | inspect_lessons.mjs |
| 字数增量 | ≥ +18 万 (累计 ≥42 万) | inspect_lessons.mjs 累加 |
| 每课字数 | ≥ 8,000 | 逐课实测 |
| 每课代码 | ≥ 4 | 逐课实测 |
| 每课引用 | ≥ 5 | 逐课实测 |
| 9 专题总覆盖 | ≥ 30% | gap_eval.mjs |
| placeholder 0 命中 | grep | 0 命中 |
| W2.A 行业名 ≥ 1/课 | 字节/阿里/腾讯/百度/美团/DeepSeek | 文本检索 |
| W2.B GitHub ≥ 1/课 | github.com 链接 | 文本检索 |
| W2.C 框架 ≥ 1/课 | AutoGen/CrewAI/LangGraph | 文本检索 |

### 3.2 工程验收

| 指标 | 门槛 |
|------|------|
| `npm run build` | 0 错, < 4s |
| 77 路由 HTTP 200 | 全部 200 |
| 老课 L01-L48 回归 | 48/48 全 200 |
| Bundle 大小 | ≤ 2MB |
| inspect_lessons.mjs | 跑通 63 课 |

### 3.3 文档验收

| 文档 | 版本 | 验收 |
|------|------|------|
| PRD.md | v2.2 | ✓ 已更新 |
| ARCHITECTURE.md | v2.2 | ✓ 已更新 |
| MILESTONES.md | v2.0 | ✓ 已更新 |
| ACCEPTANCE.md | v2.1 | ✓ 已更新 |
| diagrams/GAP_DRAWIO.md | v2.0 | ✓ 已更新 |
| diagrams/gap-drawio-m11w2.xml | - | ✓ 已创建 |
| M11_W2_PLAN.md | - | ✓ 本文档 |
| M11_W2A_INDUSTRY_REPORT.md | - | W2.A 完成后 |
| M11_W2B_FT_REPORT.md | - | W2.B 完成后 |
| M11_W2C_AGENT_REPORT.md | - | W2.C 完成后 |
| M11_W2_ACCEPTANCE.md | - | W2.Z 完成后 |

### 3.4 风险审计 (P0)

| 审计点 | 验收方式 |
|--------|----------|
| 单 Agent stall < 1 次 | workflow 日志 |
| 3 课人工 spot-check | 每课 ≥ 500 字抽样 |
| 引用 URL 100% 可访问 | curl 验证 |
| 跨课无 ≥ 30% 重复 | outline 对比 |

---

## 4. 工具链 (沿用 W1, 新增 1 个)

| 工具 | 用途 | W2 用量 |
|------|------|---------|
| `deepseek-v4-flash` | 长文撰写 15 课 | 450K tokens |
| `minimax image-01` | 15 张封面 SVG | 15 张 |
| `scripts/inspect_lessons.mjs` 🆕 | 实测验收 | W2 每次构建后跑 |
| `scripts/md_to_lesson.mjs` | md → JSX 转换 | 15 次 |
| `scripts/gap_eval.mjs` 🆕 | 9 专题覆盖率 | W2 验收时跑 |

**inspect_lessons.mjs 是 W1 教训的产物**——以前靠"估算", W1 实测覆盖率仅 16.8% (估算报告说 16.5%, 看似一致, 但单课字数估算偏高 2-3x), W2 起强制实测。

---

## 5. 资源 & 时间预估

| 资源 | W2 预估 |
|------|---------|
| deepseek tokens | 450K (~$5-10) |
| minimax image 调用 | 15 (~$2-3) |
| 子 Agent wall-clock | 90 分钟 |
| 工程师编排 | 4-6 小时 (3 周) |
| **总成本** | **$10-15 + 6h 人时** |

---

## 6. 风险与应对 (W1 教训闭环)

| 风险 | 应对 |
|------|------|
| **placeholder 污染 (W1 教训)** | Agent prompt 强制 "placeholder 文本检测" 指令; 转换器加 post-check; 3 课人工 spot-check 兜底 |
| **单 Agent stall (W1 教训)** | W2 拆 3 子 Agent 并行 (W2.A/B/C); 监控 > 1500s 自动重试 |
| **估算覆盖率偏离实际** | inspect_lessons.mjs 硬验收, 不允许"估算"出门 |
| **行业案例缺乏内部资料** | 公开材料 + 第三方分析 (DeepSeek-V3 报告 / 字节技术博客 / HugginFace 案例) |
| **deepseek 限流** | minimax-text-01 备用 (W1 验证) |
| **跨课重复** | outline 必查, 跨子 Agent 协调 |

---

## 7. 审计意见 (Audit Opinion)

### 7.1 风险等级

| 维度 | 风险 | 缓解 |
|------|:----:|------|
| 内容质量 | 🟢 低 | deepseek 13K 字/课稳定 (W1 验证) |
| 工程稳定 | 🟢 低 | 沿用 W1 工具链, 0 失败 |
| 进度 | 🟡 中 | W2 拆 3 子 Agent 缓解 stall |
| 估算准确性 | 🟢 低 | inspect_lessons 硬验收 |
| 假验收 | 🟢 低 | 3 课人工 spot-check + placeholder 检测 |
| **综合** | **🟢 低** | **W1 教训闭环** |

### 7.2 决策建议

**进入 W2 阶段, 但需在执行前确认以下事项**:

1. ✅ 差距数据已用实测覆盖, 优先级清晰 (行业 > 微调 > Agent)
2. ✅ 工具链 (deepseek/minimax) 已 W1 验证可用
3. ✅ 子 Agent 并行策略已规划 (3 个)
4. ✅ inspect_lessons.mjs 强制实测, 拒绝估算
5. ✅ 文档已全面更新 (PRD/ARCH/MILE/ACC/GAP_DRAWIO)
6. ⚠️ **需用户确认**: W2 拆 3 子 Agent 而非单 Agent, 接受 +2-3h 编排复杂度
7. ⚠️ **需用户确认**: W2 总字数目标 20 万字 (实际可能 19-21 万), 不追求超目标

### 7.3 失败重试策略

- W2.A 某课未达 8K 字 → 该子 Agent 单独重写, 不影响 W2.B/C
- W2.A build 失败 → 立即停止 W2.A, 修复后继续, 报告 ISSUES.md
- 单 Agent stall → 监控触发, 自动重试
- 覆盖率不达 30% → 接受遗留, 升级 W3 任务 (不阻塞 W2 出门)

---

## 8. 出门条件 (DoD) - M11 W2

### 8.1 内容 (P0)

- [ ] L49-L63 全部 15 课生成, 实测通过
- [ ] 每课字数 ≥ 8,000, 代码 ≥ 4, 引用 ≥ 5
- [ ] 无 placeholder 文本污染
- [ ] W2.A 每课含 ≥ 1 真实公司名
- [ ] W2.B 每课含 ≥ 1 github.com 链接
- [ ] W2.C 每课含 ≥ 1 真实框架名
- [ ] 总字数增量 ≥ 18 万 (累计 ≥ 42 万)

### 8.2 工程 (P0)

- [ ] `npm run build` 0 错误, < 4s
- [ ] 63 课路由全 200
- [ ] 9 工具路由全 200
- [ ] 5 静态路由全 200
- [ ] 老课 L01-L48 全部 200

### 8.3 文档 (P0)

- [ ] PRD/ARCHITECTURE/MILESTONES/ACCEPTANCE v2.x (✓ 已完成)
- [ ] GAP_DRAWIO v2.0 + XML (✓ 已完成)
- [ ] M11_W2A/B/C 报告 (W2 子阶段完成后)
- [ ] M11_W2_ACCEPTANCE.md 端到端验收 (W2.Z)
- [ ] M11_W2_GAP_REEVALUATION.md 复算 (W2.Z)

### 8.4 覆盖率 (SHOULD)

- [ ] 9 专题总覆盖率 ≥ 30%
- [ ] 行业/项目/公司 ≥ 15%
- [ ] 微调篇 ≥ 35%
- [ ] Agent 篇 ≥ 30%

### 8.5 风险审计 (P0)

- [ ] 单 Agent stall < 1 次
- [ ] 3 课人工 spot-check 通过
- [ ] 引用 URL 100% 实测可访问
- [ ] 跨课无 ≥ 30% 重复

---

## 9. 验收签字

| 角色 | 姓名 | 日期 | 签字 |
|------|------|------|------|
| 产品 |  |  |  |
| 技术 |  |  |  |
| 内容 |  |  |  |
| 测试 |  |  |  |

---

## 10. 附录

### 10.1 文档清单 (本批次更新)

| # | 文档 | 状态 | 字数/版本 |
|---|------|:----:|----------:|
| 1 | `docs/governance/PRD.md` | ✓ 更新 | v2.2 (9.0K) |
| 2 | `docs/governance/ARCHITECTURE.md` | ✓ 更新 | v2.2 (12K) |
| 3 | `docs/governance/MILESTONES.md` | ✓ 更新 | v2.0 (9.5K) |
| 4 | `docs/governance/ACCEPTANCE.md` | ✓ 更新 | v2.1 (15K) |
| 5 | `docs/governance/diagrams/GAP_DRAWIO.md` | ✓ 更新 | v2.0 (8.5K) |
| 6 | `docs/governance/diagrams/gap-drawio-m11w2.xml` | ✓ 新建 | 6 图 |
| 7 | `docs/governance/M11_W2_PLAN.md` | ✓ 新建 (本文档) | 12K |
| 8 | `docs/governance/M11_W2_GAP_REEVALUATION.md` | ✓ 复用 | 6.5K |

### 10.2 与 W1 的关系

- W1 报告 (M11_W1A/W1B/W1_ACCEPTANCE) 继续作为 W1 历史档案
- M11_W2_GAP_REEVALUATION.md 是 W1→W2 决策的"差距数据"
- M11_W2_PLAN.md (本文档) 是 W2 执行的"开发计划+验收"
- M11_W2A/B/C 报告将在各子阶段生成
- M11_W2_ACCEPTANCE.md 将在 W2.Z 生成 (端到端)

### 10.3 工具脚本依赖

| 脚本 | 路径 | 用途 |
|------|------|------|
| `scripts/inspect_lessons.mjs` | (待补) | 实测 63 课字数/代码/引用 |
| `scripts/md_to_lesson.mjs` | (待补) | md→JSX 转换 |
| `scripts/gap_eval.mjs` | (待补) | 9 专题覆盖率 |

> 提示: W2 启动前应先 git commit 现有 3 个脚本到 scripts/ 目录 (从 /tmp/m11_tools/ 拷过去), 否则 inspect_lessons.mjs 不在仓内, 验收脚本无从跑。

---

*计划生成时间: 2026-06-15 16:30 GMT+8*
*生成人: M11 W2 文档编制 Agent (主控 Claude Code)*
*审计状态: 🟢 通过, 待用户确认后进入 W2 实施阶段*
