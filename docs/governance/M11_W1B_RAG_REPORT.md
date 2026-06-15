# M11 W1.B RAG 篇 课程生成报告

**日期**: 2026-06-15
**Agent**: Agent-B (RAG 篇)
**任务**: 向 AI 教案添加 L39-L48 十课 RAG 优化策略
**状态**: ✅ 全部完成

---

## 1. 任务总览

| 任务 | 状态 | 备注 |
|------|------|------|
| L39 Naive/Advanced/Modular RAG | ✅ 完成 | 11881 字 |
| L40 Query Rewriting & Multi-Query | ✅ 完成 | 11409 字 |
| L41 HyDE 假想文档嵌入 | ✅ 完成 | 10701 字 |
| L42 Self-RAG / CRAG | ✅ 完成 | 10000 字 |
| L43 Agentic RAG | ✅ 完成 | 9381 字 |
| L44 GraphRAG 知识图谱 RAG | ✅ 完成 | 10097 字 |
| L45 RAG Fusion & RRF | ✅ 完成 | 10052 字 |
| L46 长上下文 RAG | ✅ 完成 | 12097 字 |
| L47 多模态 RAG (ColPali) | ✅ 完成 | 11909 字 |
| L48 RAG 评估 (RAGAS/TruLens) | ✅ 完成 | 9141 字 |

**总中文字数**: 106,668 (目标 101,000, 完成率 105.6%)

---

## 2. 验收门槛达成情况

| 验收项 | 阈值 | 实际 | 通过 |
|--------|------|------|------|
| 每课字数 | ≥ 9000 | 9141 - 12097 | ✅ 10/10 |
| 每课 codeExamples | ≥ 4 | 4 - 6 | ✅ 10/10 |
| 每课 references | ≥ 5 | 5 | ✅ 10/10 |
| 每课 SVG | ≥ 1 | 1 | ✅ 10/10 |
| 总字数 | ≥ 10万 | 106,668 | ✅ |
| npm run build | 成功 | 成功 | ✅ |
| 保留 L18/L31 cross-references | 保留 | 保留 | ✅ |
| 真实 arxiv / 官方文档 URL | 真实 | 全部真实可点击 | ✅ |

---

## 3. 工作流程

### 3.1 内容生成
- 使用 `deepseek-v4-flash` (通过 `/tmp/m11_tools/call_deepseek.mjs`)
- 每课首先生成基础版 (8-12K tokens)
- 对字数不足课程追加扩展 prompt 补足
- 全部使用简体中文

### 3.2 MD → JSX 转换
- 自研 `md_to_lesson.mjs` 转换器
- 解析 markdown 的 ## 章节、代码块、SVG
- 生成符合 L36 模板的 lesson 对象
- 注入到 `src/data/lessons_new.jsx`

### 3.3 构建验证
- `npm run build` 成功
- 最终产出: `dist/assets/index-*.js` 1.4MB
- gzip 后 ~700KB

---

## 4. 关键技术决策

### 4.1 范式对比 (L39)
采用 Gao et al. 2024 (arxiv:2312.10997) 的 Naive/Advanced/Modular 三分法, 通过决策树和迁移路径给出工业选型指引。

### 4.2 Self-RAG (L42)
- arxiv:2310.11511 (Asai et al. 2023)
- arxiv:2401.15884 (Yan et al. 2024) CRAG
- arxiv:2403.14403 (Jeong et al. 2024) Adaptive RAG

### 4.3 GraphRAG (L44)
- 微软 GraphRAG (arxiv:2404.16130)
- Neo4j + LLM 集成
- 实体抽取 / 子图检索 / 社区检测

### 4.4 ColPali (L47)
- arxiv:2407.01449 (Faysse et al. 2024)
- Late Interaction 多向量检索
- PLAID 索引

### 4.5 RAGAS (L48)
- arxiv:2309.15217 (Es et al. 2023)
- arxiv:2311.17276 (Saad-Falcon et al. 2023) ARES
- TruLens / LangSmith / Langfuse 对比

---

## 5. 与现有课程的衔接

### 5.1 跨课联动
- L18 (RAG 基础) → L31 (17 优化策略) → L39-L48 (RAG 深度专题)
- L43 (Agentic RAG) 与 L21 (Multi-Agent) 协同
- L44 (GraphRAG) 与 L36 (高级 Agent) 协同
- L48 (评估) 是 L18/L31/L39-L47 的反馈环

### 5.2 Week 划分
L39-L48 全部归入 "Week 19 RAG 优化策略", 形成 RAG 完整 10 课系列。

---

## 6. 工程指标

| 指标 | 数值 |
|------|------|
| lessons_new.jsx 总行数 | 5170 行 |
| L39-L48 lesson 对象 | 10 个 |
| 平均每课章节数 | 8-13 |
| 平均每课 codeExamples | 4.8 个 |
| 平均每课 references | 5 个 |
| build 时间 | 2.72s |
| 产出 bundle | 1403 KB |

---

## 7. 关键文件

- `/Users/Zhuanz/Desktop/workspace/1-AI教案/src/data/lessons_new.jsx` (含 L39-L48)
- `/tmp/m11_tools/l39_prompt.txt` ... `l48_prompt.txt` (生成 prompt)
- `/tmp/m11_tools/l39_raw.md` ... `l48_*.md` (生成结果)
- `/tmp/m11_tools/md_to_lesson.mjs` (md → JSX 转换器)
- `/tmp/m11_tools/call_deepseek.mjs` (deepseek 调用工具)

---

## 8. 经验教训

1. **DeepSeek 缓存影响**: 部分调用因 prompt_cache_hit 导致输出截断, 通过追加扩展 prompt 解决
2. **JSX 注入陷阱**: Python 字符串插入 JSON 后必须校验 `,` 和 `}` 配对
3. **regex 字符计数陷阱**: 单行 JSON 文件的 Chinese char 计数要用 Python 而不是 grep
4. **MD → JSON 转换器**: 编号章节 (1-14) + 字母章节 (A-D) 应分别处理

---

## 9. 后续建议

1. **L47 多模态**: 后续可加 ColQwen2、DocColBERT 等新进展
2. **L48 评估**: 补充 DeepEval、phoenix 等工具评测
3. **M11 W2**: GraphRAG 工程化与 LangGraph 实战

---

**报告生成**: 2026-06-15
**Agent**: M11 W1.B (RAG 篇)