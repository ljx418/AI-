# 内容扩充标准模板 (Content Enrichment Template)

| 字段 | 内容 |
|------|------|
| 任务 ID | M5-T8, M5-T10 |
| 文档版本 | v1.0 |
| 创建日期 | 2026-06-10 |
| 估计工时 | 每课 1h（4 课共 4h）|
| 优先级 | P1 |

---

## 1. 适用范围

需扩充的课程：
- L18 RAG与向量数据库（当前 3148 字，需扩到 ≥ 4500）
- L20 LLM应用开发（当前 1435 字，需扩到 ≥ 4500）
- L22 Claude Code生态与AI编程助手（当前 3109 字，达标，需扩到 ≥ 5000）
- L23 AI安全与伦理（当前 1348 字，需扩到 ≥ 4500）
- L19 RAG与向量数据库（JSON 损坏后重建，目标 ≥ 4500）

---

## 2. 内容质量标准

### 2.1 量化指标（必须满足）

| 指标 | 标准 | 测量 |
|------|------|------|
| 章节数 | ≥ 4 | `len(sections)` |
| 总字符 | ≥ 4500 | `sum(len(content))` |
| 平均章节字符 | ≥ 800 | 总字符 / 章节数 |
| 代码示例数 | ≥ 4 | `len(codeExamples)` |
| 参考资源数 | ≥ 6 | `len(references)` |
| 所有代码含 pip install | 100% | 字符串匹配 |
| 所有 URL 可访问 | ≥ 90% | curl 验证 |

### 2.2 质量指标（应满足）

| 指标 | 标准 |
|------|------|
| 数学直觉 | 关键公式有直观解释（不只推导）|
| 常见陷阱 | ≥ 3 个典型错误及避免方法 |
| 工业实践 | ≥ 1 个真实公司使用案例 |
| 配图描述 | 复杂概念配 1-2 张示意图描述（实际图可在 M6+ 添加）|
| 引用质量 | arXiv 优先 + 官方文档次之 + GitHub 示例 |

### 2.3 风格指标

- 第二人称 ("你" 而非 "用户")
- 段落结构：原理 → 示例 → 陷阱 → 实战
- 中文为主，必要术语保留英文
- 代码块用 ```python 包裹

---

## 3. 章节标准模板

每章节建议结构（1500 字左右）：

```markdown
## [章节标题]

### 核心概念
[2-3 段，直观解释是什么]

### 数学直觉（可选）
[关键公式 + 直觉图像，不只推导]

### 实现代码
```python
# pip install xxx
[完整可运行示例]
```

### 常见陷阱
- 陷阱 1：[描述] → 如何避免
- 陷阱 2：[描述] → 如何避免
- 陷阱 3：[描述] → 如何避免

### 工业实践
[1 个真实公司案例：name + 问题 + 解决方案 + 结果]

### 进一步阅读
- [paper/blog title 1](url)
- [paper/blog title 2](url)
```

---

## 4. 各课扩充指南

### L18 RAG与向量数据库
**已有章节** (7个): RAG工作原理 / 向量数据库详解 / 文档切分策略 / LangChain RAG组件 / LlamaIndex RAG实战 / RAG优化策略 / RAG生产部署

**扩充方向**：
- 添加"数学直觉"：cosine similarity 公式 + 几何意义
- 添加"工业实践"：Notion AI 用 RAG 索引 100M+ 文档、Pinecone 服务 ChatGPT Plugins
- 添加"常见陷阱"：chunk_size 太小/太大、embedding 模型选择、retrieval recall 评估
- 添加"扩展阅读"：REALM (arXiv:2002.08909), RAG Survey (arXiv:2312.10997)

### L20 LLM应用开发
**已有章节** (4个): LangChain核心用法 / 流式输出 / 多模型路由 / 生产部署

**扩充方向**：
- 章节扩充到 ≥ 6 个：拆分 LangChain 为 Models/Prompts/Chains/Agents
- 添加代码模式：Factory、Pipeline、Observer
- 添加"工业实践"：Replit 用 LangChain 实现 AI Agent 调试
- 添加"常见陷阱"：rate limit / token 超限 / context window 溢出

### L22 Claude Code生态
**已有章节** (6个): AI编程助手生态全景 / Claude Code核心用法 / Aider / Cursor / 最佳实践 / MCP生态

**扩充方向**：
- 添加"工业实践"：Anthropic 内部用 Claude Code 重构 80% 的代码库
- 添加"常见陷阱"：AI 代码上下文丢失、过度依赖、安全审查
- 添加"代码模式"：Tool Definition / MCP Server 编写

### L23 AI安全与伦理
**已有章节** (5个): Prompt注入 / AI对齐 / 隐私保护 / 对抗样本 / AI伦理框架

**扩充方向**：
- 扩充到 ≥ 4500 字
- 添加"工业实践"：OpenAI 的 Preparedness Framework、Anthropic 的 Constitutional AI
- 添加"常见陷阱"：过度依赖 RLHF、忽视 jailbreak
- 添加"扩展阅读"：Anthropic Sleeper Agents (arXiv:2401.05566)

### L19 RAG与向量数据库（重建）
**目标**：基于 L18 重建但内容更深
- ≥ 5 章节
- ≥ 4500 字符
- 含完整 Chroma / FAISS / Milvus / Qdrant / Weaviate 对比表
- 至少 1 个 RAGAS 评估代码示例

---

## 5. 实施流程

### Step 1: 调研（每课 0.5h）
- 搜索该主题最新论文（2024-2026）
- 收集真实 GitHub 仓库
- 找 1-2 个真实公司案例

### Step 2: 写作（每课 0.5h）
按 §3 模板写每个章节，确保量化指标达标

### Step 3: 验证（每课 0.1h）
```python
import re, json
with open('src/data/lessons_new.jsx') as f:
    content = f.read()

lid = 'L18'
m = re.search(rf'"{lid}":\s*\{{', content)
start = m.end() - 1
depth = 1
j = start + 1
while j < len(content) and depth > 0:
    if content[j] == '{': depth += 1
    elif content[j] == '}': depth -= 1
    j += 1

data = json.loads(content[start:j])
sections = data['sections']
codes = data['codeExamples']
refs = data['references']
total_chars = sum(len(s['content']) for s in sections)

print(f'{lid}: {len(sections)}章 {total_chars}字 {len(codes)}代码 {len(refs)}参考')

# 检查代码示例 pip install
for c in codes:
    if 'pip install' not in c['code']:
        print(f'  ⚠ 代码 "{c["title"]}" 缺 pip install')
```

### Step 4: 链接验证
```bash
python3 verify_links.py --lesson L18
```

### Step 5: 构建 + 截图
```bash
npx vite build 2>&1 | tail -3
CHROME=/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome
$CHROME --headless --disable-gpu --no-sandbox --window-size=1280,5000 \
  --screenshot=/tmp/L18_v2.png --virtual-time-budget=8000 \
  http://localhost:3000/lesson/L18 2>&1 | tail -1
ls -la /tmp/L18_v2.png  # 应 > 200KB
```

---

## 6. 验收（DoD）

- [ ] L18/L19/L20/L22/L23 总字符 ≥ 4500
- [ ] 每课 ≥ 4 章节、≥ 4 代码示例、≥ 6 参考
- [ ] 所有代码含 `pip install`
- [ ] 所有 URL 验证 200/302（GitHub 抽样 ≥ 50%）
- [ ] Vite build 无错
- [ ] Chrome 截图能完整看到内容（无白屏）

---

## 7. 风险

| 风险 | 应对 |
|------|------|
| LLM 生成内容引用虚假论文 | 必须人工核验 arXiv ID |
| 章节内引用嵌套引号破坏 JSON | 使用 Python raw string 包裹或转义 |
| 内容过长影响首屏 | 用 lazy load 或分章节路由（M6+）|