# Phase1 M6 子阶段 — 开发与验收计划

| 字段 | 内容 |
|------|------|
| 文档版本 | v1.0 |
| 创建日期 | 2026-06-12 |
| 周期 | M6（计划 2026-08-10 → 2026-09-10，4 周 / 20 工作日）|
| 交付 | L33 LLM Benchmark + L34 行业案例 + L35 面试高频题 + L36 高级 Multi-Agent |
| 累计完成后 | 本项目已 ship 36 课 |
| 上游 | W5-W8 ship 4 课（L29-L32）|
| 下游 | M7：L37-L44 进阶专题（多模态/Benchmark/行业/面试 已前置）|

---

## 1. M6 4 课详情

### 1.1 L33 — LLM Benchmark 与评测
- 来源：Yuque 评测专题
- 6 章节：评测方法论 / 通用能力 (MMLU/ARC) / 代码能力 (HumanEval/MBPP) / 数学推理 (GSM8K/MATH) / 长上下文 (Needle/Scrolls) / 安全性 (AdvBench/RedTeam)
- arXiv 真实 ID：2009.01352 (MMLU), 2107.03374 (LAMBADA), 2005.14165 (GPT-3 evals)
- 工业案例：HuggingFace Open LLM Leaderboard, LMSYS Chatbot Arena
- 风险：**评测结果数字容易编造**——必须 hedging "据榜单快照"

### 1.2 L34 — AI 大模型行业案例（Deepseek/字节/阿里/腾讯/百度）
- 来源：Yuque 公司落地专题
- 6 章节：DeepSeek 671B 实战 / 字节豆包 / 阿里 Qwen / 腾讯混元 / 百度文心 / 跨厂商对比
- 全部行业案例必须 hedging："据公开技术报告" / "据公司财报电话会"
- 风险：**商业数字最易编造**——只引用一手源（论文/财报/官方公告）

### 1.3 L35 — AI 面试高频题
- 来源：Yuque 面试专题
- 6 章节：ML 基础 50 题 / DL 50 题 / NLP 30 题 / LLM 50 题 / RAG/Agent 50 题 / 行为面 30 题
- 共 **260+ 面试题**
- 必须含"真题出处"：如 "来源：字节跳动 2024 春招" / "来源：阿里 2025 校招"
- 与 questions.json 联动：每道题加入 questions.json L33-L35

### 1.4 L36 — 高级 Multi-Agent
- 来源：Yuque Agent 专题
- 6 章节：Agent 通信协议 (ACP/A2A) / 记忆系统 (MemGPT/Mem0) / 规划算法 (ToT/GoT) / 多模态 Agent / Agent Bench (SWE-bench) / Agent 安全性
- arXiv 真实 ID：2310.11511 (Self-RAG), 2210.03629 (ReAct), 2308.08155 (SWE-Agent)
- 风险：**新工具/新协议名**容易编造——必须验证

---

## 2. 8 工具 v0.1（M6 末交付）

| 工具 | 优先级 | 工时 | 关键能力 |
|------|--------|------|----------|
| Token Counter | P0 | 8h | 实时显示 token |
| 全文搜索 | P0 | 16h | Fuse.js 全文检索 |
| Prompt Playground | P0 | 24h | 多模型对比 |
| 错题本 + 间隔重复 | P1 | 16h | SM-2 算法激活 |
| RAG Demo Builder | P1 | 32h | 上传→demo |
| 知识图谱可视化 | P1 | 24h | D3.js |
| 学习排行榜 | P2 | 8h | 完课率排行 |
| Benchmark Runner | P2 | 24h | GSM8K/MMLU 在线 |

**M6 末期望**：4 个 P0/P1 工具（Token Counter / 全文搜索 / Prompt Playground / 错题本）完成

---

## 3. 验收标准

### 3.1 自动化验收
- 4 课 JSON / arxiv / build / routes 全部通过
- 8 工具集成到 App.jsx，4 工具可用

### 3.2 双重审计
- 每课 7.5 门槛（L33 / L34 8.0 因为内容更偏 industry 真伪）
- 8 工具：每工具 Playwright 截图 + 端到端验证

---

## 4. 时间线

| 周 | 任务 |
|----|------|
| W1 | L33 Benchmark + Token Counter 工具 |
| W2 | L34 行业案例 + 全文搜索工具 |
| W3 | L35 面试 + Prompt Playground 工具 |
| W4 | L36 高级 Agent + 错题本工具 + M6 总结 |

---

## 5. 关键风险

1. **行业数字编造风险最高**——L34 是重灾区，审计门槛 8.0
2. **工具开发工时可能被低估**——24h/工具是经验值，实际可能 30-40h
3. **API Token 用量**——L32 已触 429，M6 需更小请求或分批

---

## 6. 停止条件（按用户要求"重大偏差停下找人"）

- L34 行业数字被审计发现 >1 处编造
- 任何工具 dev 后 Playwright 截图 >100KB 但内容空白
- 连续 2 轮 P0 失败