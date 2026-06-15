# M11 W2.A 行业方案 - 6 课 Prompt (L49-L54)

**使用**: `node /tmp/w2a/call_deepseek.mjs /tmp/w2a/l<XX>_prompt.txt --max-tokens 24000`

⚠️ **W1 强约束**: 严禁 `---\s*模拟数据\s*---` / `[为是]XXX(?![\w])` / `TODO\s*[:：]?\s*实际请替换` / `FIXME`

---

## L49 大厂 LLM 训练全流程拆解 (DeepSeek-V3/Qwen3/Kimi K2)

**字数**: ≥ 14,000 中文字符

**内容**:
1. DeepSeek-V3 架构与训练 (≥ 3,000 字): MLA / DeepSeekMoE 256+6 / FP8 / 14.8T tokens / 2,788K H800 GPU 小时
2. Qwen3 架构与训练 (≥ 2,500 字): Qwen3-235B-A22B / 36T tokens / Qwen3 Technical Report (2025)
3. Kimi K2 架构与训练 (≥ 2,500 字): Moonshot AI / Muon Optimizer (Keller Jordan 2024 arxiv:2402.18496)
4. 三大模型对比 (≥ 1,500 字): 架构/训练/推理
5. 工业实践启示 (≥ 2,000 字): 训练流水线/数据工程/评估
6. 部署与运维 (≥ 1,500 字): vLLM/TensorRT-LLM

**代码 (≥ 4)**: MLA 实现 / MoE 路由 / FP8 训练循环 / 模型对比

**引用 (≥ 5)**: arxiv:2412.19437 (DeepSeek-V3) / qwenlm.github.io/blog/qwen3/ / arxiv:2402.18496 (Muon) / huggingface.co/deepseek-ai/DeepSeek-V3 / opencompass.org.cn

**数据模型**:
- sections: 6-8 个
- codeExamples: 4-6 个
- references: 5-8 个
- industryPractice: "DeepSeek / Qwen / Moonshot AI / HuggingFace"
- crossReferences: L25-L28, L29-L30, L40

---

## L50 真实 RAG 工业案例 (字节豆包/阿里通义/腾讯混元)

**字数**: ≥ 13,000

**内容**:
1. 字节豆包 RAG 架构 (≥ 3,000 字): Doubao 1.5 Pro + RAG, 字节技术博客
2. 阿里通义 RAG (≥ 3,000 字): 通义千问 + RAG, 阿里云百炼
3. 腾讯混元 RAG (≥ 3,000 字): 混元大模型 + RAG, 腾讯云知识引擎
4. 工业 vs 学术 RAG 差异 (≥ 2,000 字): 亿级文档 / P99 < 200ms
5. 工业 RAG 评测 (≥ 2,000 字): RAGAS / TruLens / 业务指标

**代码 (≥ 4)**: 工业 RAG 检索 / 多路召回 / Rerank / 性能压测

**引用 (≥ 5)**: volcengine.com / bailian.console.aliyun.com / cloud.tencent.com/product/tke / arxiv:2309.15217 (RAGAS) / tech.bytedance.net

**industryPractice**: "字节跳动 / 阿里云 / 腾讯云"

---

## L51 Agent 工业落地 (AutoGen/CrewAI/文心/Hermes)

**字数**: ≥ 12,000

**内容**:
1. AutoGen 工业部署 (≥ 2,500 字): Microsoft AutoGen v0.4+, 多 Agent 协作
2. CrewAI 工业落地 (≥ 2,500 字): 任务委派, 客户支持/数据分析案例
3. 文心智能体 (≥ 2,000 字): 百度文心 Agent, 千帆平台
4. Hermes Agent (≥ 2,000 字): Nous Research Hermes, Function Calling
5. 工业部署共性 (≥ 2,000 字): 错误恢复/工具安全/监控限流
6. 工业案例对比 (≥ 1,000 字)

**代码 (≥ 4)**: AutoGen 多 Agent / CrewAI 任务编排 / 文心 API / Hermes Function Call

**引用 (≥ 5)**: github.com/microsoft/autogen / github.com/joaomdmoura/crewAI / cloud.baidu.com/product/qianfan / github.com/NousResearch/hermes / Anthropic Tool Use

**industryPractice**: "Microsoft / CrewAI Inc. / 百度 / Nous Research"

---

## L52 行业面试高频真题精讲 (按公司分类)

**字数**: ≥ 13,000

**内容**:
1. 字节跳动面试题 (≥ 2,500 字): 真实公开题 ≥ 3 道
2. 阿里/蚂蚁面试题 (≥ 2,500 字): ≥ 3 道
3. 腾讯面试题 (≥ 2,000 字): ≥ 3 道
4. 百度面试题 (≥ 1,500 字): ≥ 2 道
5. 美团/京东面试题 (≥ 1,500 字): ≥ 2 道
6. 面试方法论 (≥ 2,000 字): STAR 法则 / 系统设计 / Coding 准备

**代码 (≥ 4)**: LRU 缓存 / TopK / 注意力手写 / 系统设计示例

**引用 (≥ 5)**: nowcoder.com / leetcode.cn / 各公司招聘 / 公开面经 / github.com/donnemartin/system-design-primer

**industryPractice**: "字节跳动 / 阿里 / 腾讯 / 百度 / 美团 / 京东"

---

## L53 AI 产品方案设计 (PRD 模板 + 评测体系)

**字数**: ≥ 12,000

**内容**:
1. AI 产品 vs 传统产品差异 (≥ 2,000 字): 概率性输出 / 评测复杂 / 期望管理
2. PRD 模板 (≥ 2,500 字): 真实 PRD 案例 ≥ 1 个
3. 评测体系 (≥ 3,000 字): 离线/在线/人工
4. 关键指标 (≥ 2,000 字): 业务/体验/风险
5. 上线流程 (≥ 1,500 字): 灰度/监控/回滚
6. 真实案例 (≥ 1,000 字): Notion AI / Cursor / Coze

**代码 (≥ 4)**: PRD 模板 (MD) / 评测脚本 / A/B test 分析 / 监控仪表盘

**引用 (≥ 5)**: Notion AI 博客 / Cursor 文档 / Coze 文档 / Anthropic 评测 / OpenAI Evals

**industryPractice**: "Notion / Cursor / Coze / Anthropic / OpenAI"

---

## L54 行业 SDK 集成实战 (Coze/Dify/阿里百炼)

**字数**: ≥ 12,000

**内容**:
1. Coze SDK 集成 (≥ 2,500 字): 字节 Coze 平台, 智能体, API
2. Dify SDK 集成 (≥ 2,500 字): Dify.AI 开源, Workflow/RAG/Agent, 私有化
3. 阿里百炼集成 (≥ 2,500 字): 阿里云百炼, 模型市场
4. SDK 选型对比 (≥ 1,500 字): 开源/商业/成本
5. 集成最佳实践 (≥ 2,000 字): 限流/重试/日志
6. 真实集成案例 (≥ 1,000 字)

**代码 (≥ 4)**: Coze API / Dify Workflow / 百炼 SDK / 统一封装

**引用 (≥ 5)**: coze.cn / github.com/langgenius/dify / bailian.console.aliyun.com / 火山引擎 SDK / 腾讯云 SDK

**industryPractice**: "字节跳动 Coze / Dify.AI / 阿里云百炼"

---

## W2.A 验收

```bash
node scripts/inspect_lessons.mjs --topic "L4[9]|L5[0-4]"
# 6 课全过 (字数/代码/引用/sections/placeholder/industryPractice)
```

如失败, 先修 W2.A 单课, 不要跳到 W2.B/C。
