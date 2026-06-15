# M11 W2.C Agent 深化 - 5 课 Prompt (L59-L63)

**使用**: `node /tmp/w2c/call_deepseek.mjs /tmp/w2c/l<XX>_prompt.txt --max-tokens 22000`

⚠️ **W1 强约束**: 严禁 placeholder, **必须**含 `agentFramework` 字段 (真实框架名)

---

## L59 ReAct/Reflexion/ReWOO 模式对比

**字数**: ≥ 12,000

**内容**:
1. ReAct 原理 (≥ 2,500 字): 推理 + 行动交错, arxiv:2210.03629
2. Reflexion 反思机制 (≥ 2,500 字): 自我反思 + 记忆, arxiv:2303.11381
3. ReWOO 减依赖 (≥ 2,500 字): 推理无观察, arxiv:2305.18323
4. 模式对比 (≥ 2,500 字): 性能 / Token 消耗 / 适用场景
5. 工业选型 (≥ 1,500 字)

**代码 (≥ 4)**: ReAct 循环 / Reflexion 反思 / ReWOO 工具编排 / 三模式对比

**引用 (≥ 5)**: arxiv:2210.03629 (ReAct) / arxiv:2303.11381 (Reflexion) / arxiv:2305.18323 (ReWOO) / langchain.com / Anthropic Tool Use

**agentFramework**: `ReAct / Reflexion / ReWOO`

---

## L60 Multi-Agent 协作 (AutoGen/CrewAI)

**字数**: ≥ 13,000

**内容**:
1. Multi-Agent 模式 (≥ 2,500 字): 协作/竞争/层级
2. AutoGen v0.4+ (≥ 3,000 字): Microsoft AutoGen, 异步消息, github.com/microsoft/autogen
3. CrewAI (≥ 3,000 字): 任务委派/角色扮演, github.com/joaomdmoura/crewAI
4. 通信协议 (≥ 2,000 字): 共享内存 / 消息总线
5. 工业案例 (≥ 2,000 字): 客户支持 / 数据分析 / 代码生成
6. 选型 (≥ 500 字)

**代码 (≥ 4)**: AutoGen 多 Agent / CrewAI 任务链 / 共享内存 / 工业案例

**引用 (≥ 5)**: github.com/microsoft/autogen / github.com/joaomdmoura/crewAI / LangGraph / arxiv:2308.00332 / Microsoft Research 博客

**agentFramework**: `Microsoft AutoGen / CrewAI / LangGraph`

---

## L61 Harness Engineering 实战 (MCP 集成)

**字数**: ≥ 12,000

**内容**:
1. Harness Engineering 概念 (≥ 2,000 字): 沙箱 / 上下文工程 / Anthropic & OpenAI 实践
2. MCP 协议原理 (≥ 3,000 字): JSON-RPC 风格, Server/Client, 资源/工具/提示词 三大原语
3. MCP 集成实战 (≥ 3,000 字): 实现 Server (Python), Claude Desktop 集成, 自定义工具
4. Harness 模式对比 (≥ 2,000 字): Function Calling vs MCP vs Tool Use, Hermes
5. 常见坑 (≥ 2,000 字): 沙箱逃逸 / 错误处理 / 性能

**代码 (≥ 4)**: MCP Server (Python) / MCP Client / Claude Desktop 配置 / 自定义工具

**引用 (≥ 5)**: modelcontextprotocol.io / github.com/anthropics/mcp / Claude Desktop 文档 / Hermes 框架 / Cursor 文档

**agentFramework**: `MCP (Model Context Protocol) / Hermes / Function Calling`

---

## L62 Hermes Agent / Codex 深度使用

**字数**: ≥ 12,000

**内容**:
1. Hermes 框架 (≥ 2,500 字): Nous Research Hermes, Function Calling
2. Hermes 训练 (≥ 2,500 字): 数据集, 训练流程
3. Codex 案例 (≥ 3,000 字): OpenAI Codex, code-davinci, GitHub Copilot 后端
4. 工业部署 (≥ 2,000 字): 推理性能 / 成本
5. 与 Claude/GPT 对比 (≥ 1,500 字)
6. 未来展望 (≥ 500 字)

**代码 (≥ 4)**: Hermes 推理 / Function Call 集成 / Codex API / 工业部署

**引用 (≥ 5)**: github.com/NousResearch/hermes / OpenAI Codex 论文 / GitHub Copilot / Anthropic Claude Tool Use / arxiv:2308.11432

**agentFramework**: `Hermes / OpenAI Codex / Function Calling`

---

## L63 Agent 评估 + 安全防护

**字数**: ≥ 12,000

**内容**:
1. Agent 评估指标 (≥ 2,500 字): 任务完成率 / 工具调用准确率 / 多步推理
2. AgentBench (≥ 2,500 字): THUDM AgentBench, arxiv:2308.03688
3. 越狱防护 (≥ 2,500 字): prompt injection / 工具滥用 / 沙箱逃逸
4. 红队测试 (≥ 2,000 字): Anthropic Red Team / OpenAI Red Team
5. 工业合规 (≥ 1,500 字): 内容过滤 / 审计日志 / 监管要求
6. 未来 (≥ 500 字)

**代码 (≥ 4)**: AgentBench 评测 / 越狱检测 / 沙箱 / 审计日志

**引用 (≥ 5)**: arxiv:2308.03688 (AgentBench) / Anthropic Red Team 博客 / OpenAI Red Team 报告 / NIST AI RMF / OWASP LLM Top 10

**agentFramework**: `AgentBench / Anthropic Red Team / OpenAI Red Team`

---

## W2.C 验收

```bash
node scripts/inspect_lessons.mjs --topic "L5[9]|L6[0-3]"
# 5 课全过, 每课 agentFramework 字段非空
# 真实 arxiv ID: 2210.03629 / 2303.11381 / 2305.18323 / 2308.03688 / 2305.18290
```
