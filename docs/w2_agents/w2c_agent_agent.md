# M11 W2.C Agent 深化 Agent 任务书

你是 M11 W2.C「Agent 篇深化」内容生成 Agent，负责向 AI 教案添加 L59-L63 五课。

## ⚠️ W1 教训 (强约束)

1. **不能出现 placeholder**: 标题/正文严禁 `---\s*模拟数据\s*---` / `[为是]XXX(?![\w])` / `TODO\s*[:：]?\s*实际请替换` / `FIXME`
2. **真实框架名**: AutoGen / CrewAI / LangGraph / AutoGPT / Hermes / Codex / ReAct / Reflexion / ReWOO 等, 必须用真实存在的开源框架

## 目标

向 `src/data/lessons_new.jsx` 添加 5 个 Agent 深化课, 把语雀 9 专题中"Agent 篇"覆盖从 7% 提升到 ≥ 30%:

| ID | 标题 | 目标字数 | 真实框架硬要求 |
|----|------|--------:|---------------|
| L59 | ReAct/Reflexion/ReWOO 模式对比 | 12,000 | ≥ 1 个推理模式论文 (arxiv) |
| L60 | Multi-Agent 协作 (AutoGen/CrewAI) | 13,000 | ≥ 1 个 Multi-Agent 框架 |
| L61 | Harness Engineering 实战 (MCP 集成) | 12,000 | ≥ 1 个 MCP 实现 (anthropics/mcp) |
| L62 | Hermes Agent / Codex 深度使用 | 12,000 | ≥ 1 个 Hermes/Codex 案例 |
| L63 | Agent 评估 + 安全防护 | 12,000 | ≥ 1 个 Agent 评估基准 (AgentBench) |

**总计约 61,000 字 (6.1 万字)**。

## 数据模型硬要求 (W2 新增)

每课必须包含 `agentFramework` 字段, 含 ≥ 1 个真实框架名:

```javascript
{
  id: "L59",
  // ... 沿用字段 ...
  agentFramework: "ReAct (arxiv:2210.03629) / Reflexion (arxiv:2303.11381) / ReWOO (arxiv:2305.18323)"
}
```

W2 验收脚本会检查:
- 中文字符 ≥ 8,000
- codeExamples ≥ 4
- references ≥ 5
- placeholder 0 命中
- **agentFramework 字段含真实框架名 (AutoGen/CrewAI/LangGraph/ReAct/Reflexion/ReWOO/Hermes/Codex/MCP/AgentBench 等任一)**

## 工作流 (同 W2.A)

1. 读 L36 字段结构
2. 写 5 个 prompt 到 `/tmp/w2c/l59_prompt.txt` ... `l63_prompt.txt`
3. 逐课调 deepseek (`--max-tokens 22000`)
4. md→JSX
5. 追加到 L58 之后
6. 校验: `node scripts/inspect_lessons.mjs --topic "L5[9]|L6[0-3]"`
7. 构建: `npm run build`
8. 报告: `docs/governance/M11_W2C_AGENT_REPORT.md`

## Prompt 模板 (L61 示例)

```markdown
# 任务: 写 L61 "Harness Engineering 实战 (MCP 集成)"

## 字数
≥ 12,000 中文字符

## 内容要求
1. **Harness Engineering 概念** (≥ 2000 字)
   - 工具调用沙箱
   - 上下文工程
   - Anthropic / OpenAI 实践
2. **MCP (Model Context Protocol) 原理** (≥ 3000 字)
   - 协议设计 (JSON-RPC 风格)
   - Server / Client 架构
   - 资源 / 工具 / 提示词 三大原语
3. **MCP 集成实战** (≥ 3000 字)
   - 实现 MCP Server (Python)
   - Claude Desktop 集成
   - 自定义工具注册
4. **Harness 模式对比** (≥ 2000 字)
   - Function Calling vs MCP vs Tool Use
   - Hermes 框架
   - 工业级 Harness 案例
5. **常见坑与最佳实践** (≥ 2000 字)
   - 沙箱逃逸防护
   - 工具错误处理
   - 性能优化

## 代码示例 (≥ 4 个)
- MCP Server (Python 实现)
- MCP Client 集成
- Claude Desktop 配置
- 自定义工具 (文件/网络/数据库)

## 引用 (≥ 5 个)
- MCP 官方文档 (modelcontextprotocol.io)
- anthropics/mcp GitHub
- Claude Desktop 文档
- Hermes 框架
- 工业案例 (Cursor / Continue)

## ⚠️ 严禁 placeholder
W1 教训: 标题/正文严禁 "--- 模拟数据 ---" / "XXX" / "TODO 实际请替换"

## 数据模型输出要求
JSX lesson 必须包含:
- 沿用字段
- **agentFramework: "MCP (Model Context Protocol) / Hermes / Function Calling"**
- crossReferences (链接 L19/L21/L22/L27/L36 + L59/L60/L62/L63)
```

## 关键约束

- **不修改** L01-L48
- **真实** 框架名 (不能编造)
- **真实** arxiv 论文 ID (ReAct: 2210.03629, Reflexion: 2303.11381, ReWOO: 2305.18323)
- **必须** 包含 `agentFramework` 字段
- **如果构建失败立即停止**并报告

## 验收门槛

- `npm run build` 成功
- `inspect_lessons.mjs --topic "L5[9]|L6[0-3]"` 5 课全过
- placeholder 0 命中
- 5 课总字数 ≥ 50,000 (W2.C 目标 61K)
- 每课 `agentFramework` 字段非空
- 框架可验证: arxiv ID 真实 / GitHub 仓库 200

## 工具/环境 (同 W2.A)
