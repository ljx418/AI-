# M11 W2.A 行业方案 - 6 课 Prompt 模板 (L49-L54)

**使用方式**: `node /tmp/w2a/call_deepseek.mjs /tmp/w2a/l49_prompt.txt --max-tokens 24000`

---

## L49 大厂 LLM 训练全流程拆解 (DeepSeek-V3/Qwen3/Kimi K2)

```
# 任务: 写 L49 "大厂 LLM 训练全流程拆解 (DeepSeek-V3/Qwen3/Kimi K2)"

## 字数要求
≥ 14,000 中文字符

## 内容大纲
1. DeepSeek-V3 架构与训练 (≥ 3,000 字)
   - MLA (Multi-head Latent Attention) 原理
   - DeepSeekMoE 256 专家 + 6 激活
   - FP8 混合精度训练流水线
   - 公开数据: 14.8T tokens, 2,788K H800 GPU 小时
2. Qwen3 架构与训练 (≥ 2,500 字)
   - Qwen3-235B-A22B MoE 架构
   - 训练数据: 36T tokens
   - Qwen3 Technical Report (2025) 公开报告
3. Kimi K2 架构与训练 (≥ 2,500 字)
   - Moonshot AI Kimi K2
   - Muon 优化器论文 (Keller Jordan et al. 2024)
   - 训练成本与开源协议
4. 三大模型对比 (≥ 1,500 字)
   - 架构差异 (稠密 vs MoE)
   - 训练策略 (数据/优化器/并行)
   - 推理成本与吞吐
5. 工业实践启示 (≥ 2,000 字)
   - 训练流水线设计
   - 数据工程
   - 评估体系 (OpenCompass/MMLU/HumanEval)
6. 部署与运维 (≥ 1,500 字)
   - vLLM/TensorRT-LLM 推理优化
   - 多机多卡部署
   - 监控与告警

## 代码示例 (≥ 4 个, 含完整可运行代码)
- DeepSeek-V3 MLA 注意力实现
- MoE 路由 (TopK 门控)
- FP8 训练循环
- 模型对比脚本 (PyTorch + HuggingFace)

## 引用 (≥ 5 个, 真实 URL, 全部 arxiv 或官方文档)
- DeepSeek-V3 Technical Report (arxiv:2412.19437)
- Qwen3 Technical Report (https://qwenlm.github.io/blog/qwen3/)
- Muon Optimizer (arxiv:2402.18496, Keller Jordan 2024)
- HuggingFace DeepSeek-V3 仓库 (https://huggingface.co/deepseek-ai/DeepSeek-V3)
- OpenCompass 评测榜单 (https://opencompass.org.cn/)

## 数据模型字段
- id, title, week: "Week 23 W2.A", tags, image
- objectives: 6 条
- sections: 6-8 个
- codeExamples: 4-6 个
- references: 5-8 个
- **industryPractice: "DeepSeek / Qwen / Moonshot AI / HuggingFace"** (W2 新增)
- crossReferences: L25-L28, L29-L30, L40

## ⚠️ 严禁 (W1 教训)
- 标题/正文: 不能有 "--- 模拟数据 ---"
- 数据占位: 不能有 "XXX 亿美元" / "XXX 万"
- 注释: 不能有 "TODO 实际请替换"
- 占位符: 不能有 "FIXME" / "__PLACEHOLDER__"
- 不确定数据: 用 "据 X 公开报告" 表达, 不编造
```

---

## L50 真实 RAG 工业案例 (字节豆包/阿里通义/腾讯混元)

```
# 任务: 写 L50 "真实 RAG 工业案例 (字节豆包/阿里通义/腾讯混元)"

## 字数
≥ 13,000 中文字符

## 内容
1. 字节豆包 RAG 架构 (≥ 3,000 字)
   - Doubao 1.5 Pro + RAG
   - 公开材料: 字节技术博客 / Volcano Engine
2. 阿里通义 RAG (≥ 3,000 字)
   - 通义千问 + RAG
   - 阿里云百炼平台
3. 腾讯混元 RAG (≥ 3,000 字)
   - 混元大模型 + RAG
   - 腾讯云知识引擎
4. 工业 RAG vs 学术 RAG 差异 (≥ 2,000 字)
   - 规模 (亿级文档)
   - 延迟 (P99 < 200ms)
   - 成本 (向量库 + LLM API)
5. 工业 RAG 评测 (≥ 2,000 字)
   - 业务指标 (CTR/转化率)
   - RAGAS / TruLens / ARES
   - 人工评估

## 代码 (≥ 4)
- 工业级 RAG 检索
- 多路召回融合
- 重排序 (Rerank)
- 性能压测脚本

## 引用 (≥ 5)
- 字节火山引擎文档 (https://www.volcengine.com/)
- 阿里云百炼 (https://bailian.console.aliyun.com/)
- 腾讯云知识引擎 (https://cloud.tencent.com/product/tke)
- 字节技术博客 (https://tech.bytedance.net/)
- RAGAS 论文 (arxiv:2309.15217)

## 数据模型
- **industryPractice: "字节跳动 / 阿里云 / 腾讯云"** (W2 新增)
```

---

## L51 Agent 工业落地 (AutoGen/CrewAI/文心/Hermes)

```
# 任务: 写 L51 "Agent 工业落地 (AutoGen/CrewAI/文心/Hermes)"

## 字数
≥ 12,000 中文字符

## 内容
1. AutoGen 工业部署 (≥ 2,500 字)
   - Microsoft AutoGen v0.4+
   - 多 Agent 协作模式
   - 生产部署案例
2. CrewAI 工业落地 (≥ 2,500 字)
   - CrewAI 框架
   - 任务委派
   - 工业案例 (客户支持 / 数据分析)
3. 文心智能体 (≥ 2,000 字)
   - 百度文心 Agent
   - 千帆平台
4. Hermes Agent (≥ 2,000 字)
   - Nous Research Hermes
   - Function Calling
5. 工业部署共性 (≥ 2,000 字)
   - 错误恢复
   - 工具安全
   - 监控与限流
6. 工业案例对比 (≥ 1,000 字)

## 代码 (≥ 4)
- AutoGen 多 Agent
- CrewAI 任务编排
- 文心 API 集成
- Hermes Function Call

## 引用 (≥ 5)
- AutoGen GitHub (https://github.com/microsoft/autogen)
- CrewAI GitHub (https://github.com/joaomdmoura/crewAI)
- 百度千帆 (https://cloud.baidu.com/product/qianfan)
- Hermes GitHub (https://github.com/NousResearch/hermes)
- Anthropic Tool Use 文档

## 数据模型
- **industryPractice: "Microsoft / CrewAI Inc. / 百度 / Nous Research"**
```

---

## L52 行业面试高频真题精讲 (按公司分类)

```
# 任务: 写 L52 "行业面试高频真题精讲 (按公司分类)"

## 字数
≥ 13,000 中文字符

## 内容
1. 字节跳动面试题 (≥ 2,500 字)
   - 真实公开题目 (≥ 3 道)
   - 解题思路
2. 阿里/蚂蚁面试题 (≥ 2,500 字)
   - 真实公开题目 (≥ 3 道)
3. 腾讯面试题 (≥ 2,000 字)
   - 真实公开题目 (≥ 3 道)
4. 百度面试题 (≥ 1,500 字)
   - 真实公开题目 (≥ 2 道)
5. 美团/京东面试题 (≥ 1,500 字)
   - 真实公开题目 (≥ 2 道)
6. 面试方法论 (≥ 2,000 字)
   - STAR 法则
   - 系统设计答题模板
   - Coding 题准备

## 代码 (≥ 4)
- LRU 缓存 (高频)
- TopK 问题
- 注意力机制手写
- 系统设计示例

## 引用 (≥ 5)
- 牛客网 (https://www.nowcoder.com/)
- LeetCode (https://leetcode.cn/)
- 各公司官方招聘页
- 公开面经 (GitHub)
- 系统设计 primer (https://github.com/donnemartin/system-design-primer)

## 数据模型
- **industryPractice: "字节跳动 / 阿里 / 腾讯 / 百度 / 美团 / 京东"**
```

---

## L53 AI 产品方案设计 (PRD 模板 + 评测体系)

```
# 任务: 写 L53 "AI 产品方案设计 (PRD 模板 + 评测体系)"

## 字数
≥ 12,000 中文字符

## 内容
1. AI 产品 vs 传统产品差异 (≥ 2,000 字)
   - 概率性输出
   - 评测复杂性
   - 用户期望管理
2. PRD 模板 (≥ 2,500 字)
   - 真实 PRD 案例 (≥ 1 个)
   - 字段拆解
3. 评测体系 (≥ 3,000 字)
   - 离线评测 (benchmark)
   - 在线评测 (A/B test)
   - 人工评测 (众包/专家)
4. 关键指标 (≥ 2,000 字)
   - 业务指标 (CTR/转化率)
   - 体验指标 (延迟/满意度)
   - 风险指标 (幻觉率/有害率)
5. 上线流程 (≥ 1,500 字)
   - 灰度发布
   - 监控告警
   - 紧急回滚
6. 真实案例 (≥ 1,000 字)
   - Notion AI / Cursor / Coze

## 代码 (≥ 4)
- PRD 模板 (Markdown)
- 评测脚本
- A/B test 分析
- 监控仪表盘代码

## 引用 (≥ 5)
- Notion AI 公开博客
- Cursor 官方文档
- Coze 平台文档
- Anthropic Claude 评测
- OpenAI Evals GitHub

## 数据模型
- **industryPractice: "Notion / Cursor / Coze / Anthropic / OpenAI"**
```

---

## L54 行业 SDK 集成实战 (Coze/Dify/阿里百炼)

```
# 任务: 写 L54 "行业 SDK 集成实战 (Coze/Dify/阿里百炼)"

## 字数
≥ 12,000 中文字符

## 内容
1. Coze SDK 集成 (≥ 2,500 字)
   - 字节 Coze 平台
   - 智能体开发
   - 二次开发 API
2. Dify SDK 集成 (≥ 2,500 字)
   - Dify.AI 开源
   - Workflow / RAG / Agent
   - 私有化部署
3. 阿里百炼集成 (≥ 2,500 字)
   - 阿里云百炼
   - 模型市场 / 智能体
4. SDK 选型对比 (≥ 1,500 字)
   - 开源 vs 商业
   - 私有化 vs SaaS
   - 成本对比
5. 集成最佳实践 (≥ 2,000 字)
   - API 限流处理
   - 错误重试
   - 日志追踪
6. 真实集成案例 (≥ 1,000 字)

## 代码 (≥ 4)
- Coze API 调用
- Dify Workflow 编排
- 百炼 SDK
- 统一 SDK 封装

## 引用 (≥ 5)
- Coze 官方文档 (https://www.coze.cn/)
- Dify GitHub (https://github.com/langgenius/dify)
- 阿里云百炼 (https://bailian.console.aliyun.com/)
- 火山引擎 SDK
- 腾讯云 SDK

## 数据模型
- **industryPractice: "字节跳动 Coze / Dify.AI / 阿里云百炼"**
```

---

## W2.A 验收提醒

跑 `node scripts/inspect_lessons.mjs --topic "L4[9]|L5[0-4]"` 时, 每课应满足:
- 字数 ≥ 8,000
- codeExamples ≥ 4
- references ≥ 5
- sections ≥ 3
- placeholder = 0
- **industryPractice 字段非空 + 含真实公司名**

如果某课失败, 不要继续 W2.B/C, 先修复 W2.A 这一课。
