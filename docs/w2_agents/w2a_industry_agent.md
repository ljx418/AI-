# M11 W2.A 行业方案 Agent 任务书

你是 M11 W2.A「行业案例/项目方案/公司落地」内容生成 Agent，负责向 AI 教案添加 L49-L54 六课。**使用 deepseek 写长文**（用 `scripts/call_deepseek.mjs`），**必要时用 minimax image 生成封面图**。

## ⚠️ W1 教训 (必读, 强约束)

1. **W1 L47 placeholder 污染事件**: L47 初始生成时 title 被设为 `"--- 模拟数据 ---"`, 后由人工修复。但**正文 2 处残留**未清 (W2 启动前已用 `scripts/inspect_lessons.mjs` 修)。**W2 你必须避免**：
   - 标题中不能出现 `---\s*模拟数据\s*---`
   - 代码示例中不能出现 `[为是]XXX(?![\w])` (如 "XXX 亿美元")
   - 不能出现 `TODO\s*[:：]?\s*实际请替换`
   - 不能出现 `FIXME` / `__PLACEHOLDER__` / `__TODO__`

2. **W1 prompt 教训**: 不要让 LLM 自由发挥编造数据。**所有公司名/产品名/数据必须可验证**。当不确定时, 使用 "据 X 公开报告" 而非编造具体数字。

## 目标

向 `src/data/lessons_new.jsx` 添加 6 个行业方案课, 覆盖语雀 dhluml 9 专题中缺口最大的「项目方案/行业落地/公司落地」(缺口 399.9K 字, 当前覆盖 2%):

| ID | 标题 | 目标字数 | 行业真实性硬要求 |
|----|------|--------:|------------------|
| L49 | 大厂 LLM 训练全流程拆解 (DeepSeek-V3/Qwen3/Kimi K2) | 14,000 | ≥ 2 个真实开源模型架构 |
| L50 | 真实 RAG 工业案例 (字节豆包/阿里通义/腾讯混元) | 13,000 | ≥ 1 个真实工业 RAG 系统 |
| L51 | Agent 工业落地 (AutoGen/CrewAI/文心/Hermes) | 12,000 | ≥ 1 个生产部署案例 |
| L52 | 行业面试高频真题精讲 (按公司分类) | 13,000 | ≥ 3 家大厂真实面试题 |
| L53 | AI 产品方案设计 (PRD 模板 + 评测体系) | 12,000 | ≥ 1 个真实 PRD 模板 |
| L54 | 行业 SDK 集成实战 (Coze/Dify/阿里百炼) | 12,000 | ≥ 2 个真实 SDK 集成 |

**总计约 76,000 字 (7.6 万字)**。

## 数据模型硬要求 (W2 新增)

每课必须包含以下字段 (这是 W2 验收硬门槛):

```javascript
{
  id: "L49",
  title: "...",
  // ... W1 已有字段 (objectives/sections/codeExamples/references) ...
  industryPractice: "本课涉及 ≥ 1 个真实公司名 (字节/阿里/腾讯/百度/美团/DeepSeek/Anthropic/OpenAI/Google/Meta 等)"
}
```

W2 验收脚本 (`scripts/inspect_lessons.mjs`) 会检查每课:
- 中文字符 ≥ 8,000
- codeExamples ≥ 4
- references ≥ 5
- sections ≥ 3
- placeholder 0 命中
- **industryPractice 字段存在且含真实公司名**

## 工作流

1. **读 L36 末尾字段结构** (作为格式模板, offset 5100-5168)
2. **为每课生成 prompt** 写入 `/tmp/w2a/l49_prompt.txt` ... `l54_prompt.txt`
3. **逐课调用 deepseek**:
   ```bash
   node /tmp/w2a/call_deepseek.mjs /tmp/w2a/l49_prompt.txt --max-tokens 24000
   ```
   输出保存到 `/tmp/w2a/l49_raw.md`
4. **md → JSX 转换**: 用 `scripts/md_to_lesson.mjs` (已部署在仓内)
5. **追加到 lessons_new.jsx**: 在 L48 的 `},` 之后插入 L49-L54
6. **校验**: `node scripts/inspect_lessons.mjs --topic "L4[9]|L5[0-4]"` (仅检查 L49-L54)
7. **构建验证**: `npm run build` (0 错, < 4s)
8. **报告**: `docs/governance/M11_W2A_INDUSTRY_REPORT.md`

## Prompt 模板 (L49 示例)

```markdown
# 任务: 写 L49 "大厂 LLM 训练全流程拆解 (DeepSeek-V3/Qwen3/Kimi K2)"

## 字数
≥ 14,000 中文字符

## 内容要求
1. **DeepSeek-V3 架构与训练** (≥ 3000 字)
   - MLA (Multi-head Latent Attention) 原理
   - DeepSeekMoE 256 专家 + 6 激活
   - FP8 混合精度训练
   - 公开数据: 14.8T tokens, 训练 2788K H800 小时
2. **Qwen3 架构与训练** (≥ 2500 字)
   - Qwen3-235B-A22B (MoE)
   - 训练数据: 36T tokens
   - 公开报告: Qwen3 Technical Report (2025)
3. **Kimi K2 架构与训练** (≥ 2500 字)
   - Moonshot AI Kimi K2
   - Muon 优化器
   - 训练成本数据
4. **三大模型对比** (≥ 1500 字)
   - 架构差异 / 训练策略 / 推理成本
5. **工业实践启示** (≥ 2000 字)
   - 训练流水线设计
   - 数据工程
   - 评估体系

## 代码示例 (≥ 4 个)
- MLA 实现
- MoE 路由
- FP8 训练循环
- 模型对比脚本

## 引用 (≥ 5 个, 必须真实)
- DeepSeek-V3 Technical Report (arxiv:2412.19437)
- Qwen3 Technical Report (官方)
- Muon Optimizer (arxiv 论文)
- HuggingFace DeepSeek-V3 仓库
- 公开评测数据 (OpenCompass / MMLU)

## ⚠️ 严禁
- 标题/正文中不能出现 "--- 模拟数据 ---"
- 不能用 "XXX 亿美元" 这样的占位符
- 公司数据用 "据 X 公开报告" 而非编造
- 不能写 "TODO 实际请替换"

## 数据模型输出要求
JSX lesson 对象必须包含:
- id, title, week, tags, image, objectives (沿用 L36)
- sections (≥ 5 个, 每节 ≥ 1500 字)
- codeExamples (≥ 4 个, 含完整可运行代码)
- references (≥ 5 个, 真实 arxiv/官方 URL)
- **industryPractice: "本课涉及 ≥ 1 个真实公司名"** (W2 新增)
- crossReferences (链接到 L25-L28 微调, L29-L30 部署, L40 RAG)
```

## 关键约束

- **不要**修改 L01-L48 任何内容
- **必须**保持 L18/L31/L36 crossReferences 链接
- **必须**用真实 arxiv/官方 URL, 不允许编造
- **必须**包含 industryPractice 字段 (W2 验收硬门槛)
- **如果构建失败立即停止**并报告, 不允许提交

## 验收门槛

- `npm run build` 成功
- `node scripts/inspect_lessons.mjs --topic "L4[9]|L5[0-4]"` 6 课全过
- `node scripts/inspect_lessons.mjs` placeholder 0 命中
- 6 课总字数 ≥ 60,000 (W2.A 目标 76K)
- 每课 industryPractice 字段非空
- 行业真实性: 至少 1 个真实公司名 + 1 个真实技术细节

## 工具脚本

- `node scripts/call_deepseek.mjs` (W1 部署在 /tmp/w2a, 待 W2 启动时拷)
- `node scripts/md_to_lesson.mjs` (已部署在 scripts/)
- `node scripts/inspect_lessons.mjs` (已部署在 scripts/)
- `node scripts/gap_eval.mjs` (已部署在 scripts/)

## 环境

- 工作目录: `/Users/Zhuanz/Desktop/workspace/1-AI教案`
- 现有课程: `src/data/lessons_new.jsx` (48 课, 24.1 万字, 6,000 行)
- 现有路由: L01-L48 全部 200, 9 工具路由 200
- L48 末尾结构参考 (lesson 字段): 沿用 L36 全部字段 + 新增 `industryPractice`
