# AI 教案 — 目标架构 (Target Architecture) v3.0

| 字段 | 内容 |
|------|------|
| 文档版本 | **v3.0** (v2.2 升级) |
| 创建日期 | 2026-06-23 |
| 更新日期 | 2026-06-23 |
| 适用范围 | 浏览器端纯前端项目 (W3-W8 加速版) |
| 当前阶段 | M11 W3 启动前规划 |
| 关联文档 | [PRD.md v3.0](./PRD.md) / [MILESTONES.md v3.0](./MILESTONES.md) / [M11_ACCEPTANCE_CRITERIA_V3.md](./M11_ACCEPTANCE_CRITERIA_V3.md) / [GAP_DRAWIO_V3.xml](./GAP_DRAWIO_V3.xml) |

---

## 0. 版本说明

| 维度 | v2.2 (W2 完成) | **v3.0 (W3-W8 加速版)** | 变化 |
|------|---------------|----------------------|------|
| 课数 | 63 | **200** (9 主题 100%) | +137 |
| 工具 | 9 v0.1 | **9 v1.0 + AI 助教** | 完整闭环 |
| 数据层 | lessons.json (2.6MB) | **lessons.json (8MB+) + yuque 抓取** | 拆解重写 |
| 沙箱 | Pyodide 单文件 | **多文件 + 课程联动** | 形式超越 |
| 进度 | IndexedDB | **+ SM-2 算法 + 跨设备同步** | 学习闭环 |
| 验收 | inspect_lessons.mjs | **+ 主题覆盖率 + 工具对接** | 多维 |
| 抓语雀 | 36 URL 启发式 | **287 URL 全量** | 8x |

---

## 1. 顶层架构图 (W3-W8 目标)

```
┌──────────────────────────────────────────────────────────────────────┐
│          浏览器端 (Browser Only) - 纯前端零后端 - W8 目标             │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  React 18 SPA (BrowserRouter / Routes) - 200 课 + 9 工具 v1.0 │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐    │  │
│  │  │HomePage  │ │Lesson    │ │CodeEditor│ │ SandboxPanel   │    │  │
│  │  │ 200 课   │ │Content   │ │Pyodide + │ │ 多文件 + 课程  │    │  │
│  │  │ 9 主题   │ │MD render │ │Worker 池 │ │ 联动 + 评测    │    │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────────────┘    │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐    │  │
│  │  │QuizPanel │ │Progress  │ │AITutor   │ │ ToolsHub (9 v1) │    │  │
│  │  │ 600+题   │ │SM-2 算法 │ │RAG over  │ │ 全部可用        │    │  │
│  │  │ 错题本   │ │ 同步     │ │ 200 课   │ │ 跨课搜索       │    │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────────────┘    │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐    │  │
│  │  │StaticPg  │ │Knowledge │ │Leaderb'd │ │BenchmarkRunner │    │  │
│  │  │9 静态页  │ │Graph D3  │ │云端同步  │ │ MMLU/HumanEval │    │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────────────┘    │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                            ↓ ↑                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  Utilities Layer (4 大子模块)                                  │  │
│  │  ┌──────────────────────────────────────────────────────────┐  │  │
│  │  │ tools/ (9 工具 v1.0 独立增强)                            │  │  │
│  │  │   token-counter / search / error-book / prompt-playground│  │  │
│  │  │   rag-builder / knowledge-graph / leaderboard / benchmark│  │  │
│  │  │   ai-tutor (RAG over 200 课)                              │  │  │
│  │  └──────────────────────────────────────────────────────────┘  │  │
│  │  ┌──────────────────────────────────────────────────────────┐  │  │
│  │  │ sandbox/ (Pyodide + 多文件 + 课程联动)                   │  │  │
│  │  │   pyodide-loader.js / worker-pool.js / sandbox-panel     │  │  │
│  │  │   sandbox-files.js (多文件管理) / sandbox-link.js (课→沙箱) │  │  │
│  │  └──────────────────────────────────────────────────────────┘  │  │
│  │  ┌──────────────────────────────────────────────────────────┐  │  │
│  │  │ progress/ (SM-2 间隔重复 + 跨设备同步)                   │  │  │
│  │  │   spaced-repetition.js (SM-2) / progress-store.js        │  │  │
│  │  │   sync-adapter.js (云端同步) / quiz-tracker.js            │  │  │
│  │  └──────────────────────────────────────────────────────────┘  │  │
│  │  ┌──────────────────────────────────────────────────────────┐  │  │
│  │  │ ai-tutor/ (RAG over 200 课)                              │  │  │
│  │  │   rag-indexer.js / rag-retriever.js / tutor-store.js     │  │  │
│  │  │   tutor-ui.jsx (多轮对话) / tutor-tokens.js (成本)       │  │  │
│  │  └──────────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                            ↓ ↑                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  Data Layer (W3-W8 升级)                                       │  │
│  │  • lessons.json (8MB+, 200 课, 1.06M 字)                      │  │
│  │  • questions.json (600+ 题)                                    │  │
│  │  • docs/yuque_raw/by_topic/ (287 doc 落盘)                    │  │
│  │  • public/static/*.html (9 静态页)                             │  │
│  │  • images/*.svg (200+ 张配图)                                  │  │
│  │  • rag-index.bin (200 课 embedding 索引)                       │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                            ↓ ↑                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  External (W3-W8)                                              │  │
│  │  • Pyodide CDN (jsdelivr) — 沙箱                               │  │
│  │  • DeepSeek API (v4-flash) — 写课 + AITutor                   │  │
│  │  • 语雀 dhluml (抓取入口) — W3 启动前抓 287                    │  │
│  │  • MiniMax API (image-01) — 配图                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  Build Pipeline (W3-W8 新增)                                    │  │
│  │  • 抓语雀 → 落盘 yuque_raw → 拆解重写 → lessons.json           │  │
│  │  • 写课 sub-agent (按主题) → 验收 (字数/工具/链接) → 落盘       │  │
│  │  • 工具 v1.0 sub-agent (独立) → 端到端验收 → 落盘               │  │
│  │  • W 阶段末 inspect_lessons + gap_eval + snap 全 200            │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 2. 9 主题课程架构

按 [PRD v3.0 §2](./PRD.md) 9 主题对标表, 课程结构按主题分布:

| 主题 ID | 主题 | W2 课 | W8 课 | 主要工具对接 | 关键依赖 |
|:------:|------|----:|-----:|------------|---------|
| T1 | 基础 (ML/DL/Python) | 13 | 28 | TokenCounter + BenchmarkRunner | 数学基础 + PyTorch |
| T2 | Transformer/NLP | 6 | 19 | CodeEditor + TokenCounter | Attention 机制 |
| T3 | RAG | 12 | 28 | RAGBuilder + Search + AITutor | Embedding + VectorDB |
| T4 | 微调 (SFT/LoRA/DPO) | 7 | 22 | BenchmarkRunner + ErrorBook | HuggingFace + PEFT |
| T5 | DeepSeek/前沿 | 4 | 12 | TokenCounter + BenchmarkRunner | DeepSeek-V3/R1 + Qwen3 |
| T6 | Agent | 12 | 28 | RAGBuilder + AITutor + SandboxPanel | LangChain + AutoGen |
| T7 | 项目方案 | 5 | 17 | SandboxPanel + KnowledgeGraph | PRD + 架构设计 |
| T8 | 行业落地 | 6 | 18 | RAGBuilder + SandboxPanel | Coze/Dify/SDK |
| T9 | 公司落地 | 4 | 18 | ErrorBook + BenchmarkRunner | 真题题库 + 模拟面试 |

### 2.1 主题归一化标记

每个 lesson 在 `lessons.json` 加 `topics: ["T1"]` 或 `["T4", "T5"]` (跨主题), 验收按唯一主题计避免双计。详见 [PRD v3.0 §2.3](./PRD.md)。

### 2.2 课程层级结构

```
src/data/lessons.json
├── L01-L28 (T1 基础)        ├── L01 概述 / L02 环境 / L03 数学 / L04 Python
│                             ├── ... 升级 L01-L12 到 8K+ 字
│                             └── L25-L28 (微调前置: 监督/无监督/过拟合/正则化)
├── L29-L47 (T2 Transformer) ├── L29 Attention / L30 Transformer
│                             ├── L31 Pre-Norm vs Post-Norm / L32 RoPE
│                             ├── L33 Flash Attention / L34 MQA/GQA
│                             └── L35-L47 (T2 深化)
├── L48-L75 (T3 RAG)         ├── L48-L52 (RAG 基础 5 课)
│                             ├── L53-L62 (RAG 10 优化策略)
│                             └── L63-L75 (RAG 深化: Agentic/可观测/多模态)
├── L76-L97 (T4 微调)        ├── L76-L82 (SFT/LoRA/QLoRA 7 课)
│                             ├── L83-L88 (DPO/RLHF/KTO 6 课)
│                             └── L89-L97 (MoE 训练/分布式 SFT 8 课)
├── L98-L109 (T5 DeepSeek)   ├── L98-L102 (DeepSeek-V3/R1 5 课)
│                             └── L103-L109 (Qwen3/Kimi K2 6 课)
├── L110-L137 (T6 Agent)     ├── L110-L117 (Agent 基础 8 课)
│                             ├── L118-L125 (Multi-Agent 8 课)
│                             └── L126-L137 (Production Agent 12 课)
├── L138-L154 (T7 项目方案)  ├── L138-L143 (PRD/技术方案 6 课)
│                             └── L144-L154 (AI Native 产品 11 课)
├── L155-L172 (T8 行业落地)  ├── L155-L162 (智能客服/知识库/搜索 8 课)
│                             └── L163-L172 (推荐/风控/医疗 10 课)
├── L173-L190 (T9 公司落地)  ├── L173-L182 (字节/阿里/腾讯/百度/美团 10 课)
│                             └── L183-L190 (海外 Google/OpenAI/Anthropic 8 课)
└── L191-L200 (跨主题融合)   ├── L191-L196 (跨主题项目 6 课)
                              └── L197-L200 (W8 查缺补漏 4 课)
```

> 注: 上表 L01-L63 标题沿用 W2 实际, L64-L200 是 W3-W8 规划目标 (W3 启动时细化)

---

## 3. 4 大子模块设计

### 3.1 tools/ (9 工具 v1.0 独立增强)

按 [PRD v3.0 §5.2](./PRD.md) 9 工具 v1.0 路线图:

| 文件 | 路径 | 状态 | 关键 API |
|------|------|:----:|---------|
| TokenCounter | `src/tools/TokenCounter.jsx` | v0.1 | `count(text, model)` |
| Search | `src/tools/Search.jsx` | v0.1 | `search(query, options)` |
| ErrorBook | `src/tools/ErrorBook.jsx` | v0.1 | `add(question) / review()` |
| PromptPlayground | `src/tools/PromptPlayground.jsx` | v0.1 | `run(prompt, model)` |
| RAGBuilder | `src/tools/RAGBuilder.jsx` | v0.1 | `build(docs, query)` |
| KnowledgeGraph | `src/tools/KnowledgeGraph.jsx` | v0.1 | `render(graphData)` |
| Leaderboard | `src/tools/Leaderboard.jsx` | v0.1 | `submit(score)` |
| BenchmarkRunner | `src/tools/BenchmarkRunner.jsx` | v0.1 | `run(model, dataset)` |
| AITutor | `src/tools/AITutor.jsx` | v0.1 | `chat(message, context)` |

**W8 目标**: 全部 v1.0, 详见 [PRD v3.0 §5.2 工具 v1.0 路线图](./PRD.md)。

### 3.2 sandbox/ (Pyodide + 多文件 + 课程联动)

```
src/sandbox/
├── pyodide-loader.js    # Pyodide 单例 + 缓存
├── worker-pool.js       # Worker 池 (3-5 个)
├── sandbox-panel.jsx    # 多文件 UI (tabs + 树)
├── sandbox-files.js     # 文件 CRUD (IndexedDB)
├── sandbox-link.js      # 课程代码 → 沙箱 (lessonId/fileId)
└── sandbox-runner.js    # 执行 + 输出 + 评测
```

**W3 目标**: 多文件支持 (tabs + 树)
**W5 目标**: 课程联动 (L37 课点击 "运行示例" → SandboxPanel 打开预置文件)
**W8 目标**: 评测 (BenchmarkRunner 调 sandbox-runner)

### 3.3 progress/ (SM-2 间隔重复 + 跨设备同步)

```
src/progress/
├── spaced-repetition.js # SM-2 算法 (W3)
├── progress-store.js    # IndexedDB 封装
├── sync-adapter.js      # 云端同步 (W6, 可选)
└── quiz-tracker.js      # 测验进度 + 错题统计
```

**W3 目标**: SM-2 算法替代固定间隔
**W5 目标**: 错题本 v1.0 (完整 SM-2 循环)
**W8 目标**: 云端同步 (可选, 用户登录)

### 3.4 ai-tutor/ (RAG over 200 课)

```
src/ai-tutor/
├── rag-indexer.js       # 200 课 embedding 索引 (构建期)
├── rag-retriever.js     # 检索 + 重排
├── tutor-store.js       # 多轮对话历史 (IndexedDB)
├── tutor-ui.jsx         # 对话 UI
└── tutor-tokens.js      # token 计数 + 成本估算
```

**W3 目标**: RAG over 91 课 (T1+T2+RAG 已有)
**W5 目标**: RAG over 141 课
**W8 目标**: RAG over 200 课, 多轮对话, 代码生成辅助

---

## 4. 数据流 (W3-W8 升级)

### 4.1 课程数据流 (抓语雀 → 拆解重写 → 落盘)

```
语雀 dhluml (URL 列表)
   ↓ fetch_yuque_urls_only.mjs
docs/yuque_raw/yuque_urls.json (287 URL)
   ↓ fetch_yuque_full.mjs (CDP 抓取, 800ms sleep, 50 轮)
docs/yuque_raw/pending_classify/<NNN>_<slug>.md (287 doc)
   ↓ classify_yuque.mjs (按 9 主题启发式)
docs/yuque_raw/by_topic/T1_基础/*.md ... T9_公司落地/*.md
   ↓ write_lesson_agent.mjs (sub-agent 按主题写课, 1 主题 1 sub-agent)
src/data/lessons.json (新增 137 课)
   ↓ inspect_lessons.mjs (字数验收)
✅ 落盘 + W 阶段 ACCEPTANCE
```

### 4.2 lessons.json 数据结构 (W3 起升级)

```json
{
  "L01": {
    "id": "L01",
    "title": "AI 概述与历史",
    "topics": ["T1"],
    "primaryTopic": "T1",
    "content": "...",
    "codeExamples": ["..."],
    "references": ["..."],
    "tools": ["token-counter"],
    "wordCount": 8000
  }
}
```

**新增字段**:
- `topics: string[]` — 多主题归一化 (避免双计)
- `primaryTopic: string` — 主主题 (验收按这个算)
- `tools: string[]` — 关联工具 (L01 必接 token-counter, L25 必接 benchmark-runner)
- `wordCount: number` — 验收时从 content 实测, 落盘时记录 (避免每次重算)

### 4.3 questions.json 升级 (W3-W8)

```
W2: 240+ 题
W3: + 60 题 (T1 基础)
W4: + 60 题 (T4 微调)
W5: + 60 题 (T3 RAG)
W6: + 60 题 (T7 项目方案)
W7: + 60 题 (T9 公司落地)
W8: + 60 题 (跨主题综合)
W8 末: 600+ 题
```

### 4.4 rag-index.bin (W3 新增)

```
src/data/rag-index.bin
├── 200 课 chunk (平均 200 chunk/课, 每 chunk 512 token)
├── embedding (text-embedding-3-small, 1536 dim)
└── metadata (lessonId, chunkIdx, topicId)
```

**构建时机**: W3 末 (91 课), W5 末 (141 课), W8 末 (200 课)

---

## 5. Yuque 抓取 Pipeline (W3 启动前置)

按用户 2026-06-17 规则 1, W3 启动前必须先抓完语雀 287 核心文档。

### 5.1 Pipeline 流程

```
[Phase 1: URL 收集]
scripts/fetch_yuque_urls_only.mjs
  ├── 连接 Chrome CDP 9222 (复用 user-data-dir 保持 cookies)
  ├── 登录 + 输入密码 ghkq
  ├── 展开 9 专题侧边栏
  ├── 滚动 aside 容器触发 IntersectionObserver lazy load
  ├── 收集 a[href*="/dhluml/"] (slug 14-22 字符)
  └── 落盘 docs/yuque_raw/yuque_urls.json (≥ 287 URL)

[Phase 2: 正文抓取]
scripts/fetch_yuque_full.mjs --limit 287
  ├── 逐个访问 URL
  ├── 抓 main article DOM innerText
  ├── CJK 字符计数
  ├── 落盘 docs/yuque_raw/pending_classify/<NNN>_<slug>.md
  └── 索引 docs/yuque_raw/yuque_index.json

[Phase 3: 9 主题分类]
scripts/classify_yuque.mjs (W3 新写)
  ├── 读 yuque_index.json
  ├── 启发式分配 (按 title/heading 关键词)
  ├── 人工校正 (输出 yuque_classification_review.md)
  └── 落盘 docs/yuque_raw/by_topic/T1_基础/*.md ... T9_公司落地/*.md

[Phase 4: 拆解重写]
sub-agent write_lesson_agent (按主题)
  ├── 读 by_topic/T*/ 目录
  ├── 拆解为 1-3 课大纲 (每课 8K 字)
  ├── 跟 L01-L63 课程标题去重
  ├── 写课 (深 seek API + 人工校对)
  ├── 验收 (字数 / 工具对接 / 链接)
  └── 落盘 src/data/lessons.json
```

### 5.2 抗反爬策略 (按用户 §6)

- 每轮 sleep 800ms
- 限制最大 50 轮
- 复用 `chrome-yuque-data` user-data-dir 保持 cookies (避免重复密码)
- 断点续抓: `fetch_yuque_full.mjs` 跳过已落盘 doc
- 失败 doc 写 `docs/yuque_raw/yuque_failed.json`, 人工 review

### 5.3 WSL2 抓取依赖 (新电脑特有)

按 [RESTORE.md §9](../RESTORE.md), WSL2 缺 libnspr/libnss:
```bash
export PUPPETEER_EXECUTABLE_PATH=/home/administrator/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell
export LD_LIBRARY_PATH=/mnt/c/workSpace/financial-asset-manager/.verification/playwright-libs/root/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH
```

---

## 6. Build Pipeline (W3-W8 新增)

按 [PRD v3.0 §4 资源模式](./PRD.md), W3-W8 引入 sub-agent 并行:

### 6.1 课程写 sub-agent (W3-W8 每月 2 个)

- **输入**: 主题 ID + 已落盘语雀 doc + L01-L63 课程列表
- **输出**: src/data/lessons.json 新增 N 课 + W 阶段 ACCEPTANCE 报告
- **循环**: 写 1 课 → 验收 (字数/工具/链接) → 不达标打回扩写
- **约束**: 不许重复 L01-L63 标题; 必须含 4 代码示例 + 2 图

### 6.2 工具 v1.0 sub-agent (W3-W8 持续)

- **输入**: 工具 ID + v0.1 现状 + PRD 规格
- **输出**: src/tools/<Tool>.jsx v1.0 + 端到端验收截屏
- **循环**: 实现 → snap.mjs 截屏 → console 0 error → 不达标打回

### 6.3 抓语雀 sub-agent (W3 启动前置)

- **输入**: scripts/fetch_yuque_*.mjs + Chrome CDP 9222
- **输出**: docs/yuque_raw/yuque_urls.json ≥ 287 + pending_classify/*.md 287
- **修复目标**: 修滚动 lazy load bug, 写 fetch_yuque_phase2.mjs 备选

### 6.4 治理文档主 agent (W3 启动前)

- **输入**: M11_YUQUE_GAP_V2.md (W2 基线)
- **输出**: PRD/ARCH/MILESTONES/ACCEPTANCE/GAP v3.0 (本批 5 个)
- **职责**: 保持 5 个文档交叉引用一致 + git commit

---

## 7. 验收 (W3-W8 通用)

按 [PRD v3.0 §7 出门条件](./PRD.md) + [M11_ACCEPTANCE_CRITERIA_V3.md](./M11_ACCEPTANCE_CRITERIA_V3.md) 9 主题分层门槛 + 工具/SPA/质量门槛, 每个 W 阶段必跑:

### 7.1 端到端 (4 步 + 0 error)

```bash
node scripts/snap.mjs http://localhost:3000/ /tmp/h.png
node scripts/snap_wait.mjs http://localhost:3000/lesson/LXX /tmp/l.png  # 抽 3 课
node scripts/snap.mjs http://localhost:3000/tools/<tool> /tmp/t.png     # 抽 3 工具
# 期望: 7 次截屏 console 错误 0
```

### 7.2 数据验收

```bash
node scripts/inspect_lessons.mjs         # 字数 (从 lessons.json 实测)
node scripts/gap_eval.mjs                # 9 主题覆盖率
node scripts/verify_links.mjs            # 链接健康 ≥ 95%
node scripts/verify_routes.mjs           # 路由 200 (新增)
```

### 7.3 工具 v1.0 验收

每工具必含 5 项功能验证 (按 [ACCEPTANCE_CRITERIA_V3](./M11_ACCEPTANCE_CRITERIA_V3.md))。

---

## 8. 风险与约束 (W3-W8 特有)

| 风险 | 影响 | 应对 |
|------|------|------|
| 9 主题归一化双计 | 总字数虚高 | `lessons.json` 加 `topics: []` + `primaryTopic` 字段, 验收按唯一 |
| 课程重复 (vs L01-L63) | 浪费时间 | 写课前先看 L01-L63 标题, 避免重复 |
| Pyodide 加载慢 | 沙箱体验差 | Worker 池 + 缓存 + 降级 |
| IndexedDB 容量 | 进度/沙箱文件丢失 | 容量监控 + 导出/导入 |
| DeepSeek API 限流 | 写课阻塞 | 限流退避 + 备用 API (MiniMax) |
| 语雀反爬 | 抓取失败 | sleep 800ms + 续抓 + 失败日志 |
| WSL2 Chrome 库 | 抓取失败 | 复用 playwright-libs LD_LIBRARY_PATH |
| 单课 < 8K 字 | W3 后不合格 | sub-agent 必含扩写循环 |

---

## 9. 附录

### 9.1 引用文档 (本 v3.0 引用链)

- [PRD.md v3.0](./PRD.md) — 战略 + 9 主题对标 + 阶段时间表
- [MILESTONES.md v3.0](./MILESTONES.md) — W3-W8 月度里程碑
- [M11_ACCEPTANCE_CRITERIA_V3.md](./M11_ACCEPTANCE_CRITERIA_V3.md) — 9 主题分层门槛 + 工具/SPA/质量门槛
- [GAP_DRAWIO_V3.xml](./GAP_DRAWIO_V3.xml) — 4 大区域图
- [M11_YUQUE_GAP_V2.md](./M11_YUQUE_GAP_V2.md) — W2 后 9 主题 39% 覆盖率基线
- [MASTER_PLAN_18M.md](./MASTER_PLAN_18M.md) — v2 历史规划
- [RESTORE.md §9](../RESTORE.md) — 新电脑环境恢复 (WSL2 修复)

### 9.2 关键模块文件清单 (W3-W8 目标)

```
src/
├── App.jsx                          # 路由 (W8: 200 课 + 9 工具)
├── data/
│   ├── lessons.json                 # 200 课, 1.06M 字
│   ├── lessons_new.jsx              # 元数据
│   ├── questions.json               # 600+ 题
│   └── rag-index.bin                # 200 课 embedding (W3 末)
├── tools/                           # 9 工具 v1.0
│   ├── TokenCounter.jsx
│   ├── Search.jsx
│   ├── ErrorBook.jsx
│   ├── PromptPlayground.jsx
│   ├── RAGBuilder.jsx
│   ├── KnowledgeGraph.jsx
│   ├── Leaderboard.jsx
│   ├── BenchmarkRunner.jsx
│   └── AITutor.jsx                  # v1.0: RAG over 200 课
├── sandbox/                         # Pyodide 多文件
│   ├── pyodide-loader.js
│   ├── worker-pool.js
│   ├── sandbox-panel.jsx
│   ├── sandbox-files.js
│   ├── sandbox-link.js
│   └── sandbox-runner.js
├── progress/                        # SM-2 + 同步
│   ├── spaced-repetition.js
│   ├── progress-store.js
│   ├── sync-adapter.js
│   └── quiz-tracker.js
└── ai-tutor/                        # RAG
    ├── rag-indexer.js
    ├── rag-retriever.js
    ├── tutor-store.js
    ├── tutor-ui.jsx
    └── tutor-tokens.js
```

### 9.3 修订历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v2.0 | 2026-06-10 | 初版 (48 课) |
| v2.1 | 2026-06-12 | W1 计划嵌入 |
| v2.2 | 2026-06-15 | W2 计划嵌入 (63 课) |
| **v3.0** | **2026-06-23** | **W3-W8 加速 6 月 + 200 课 100% + 4 子模块 + yuque pipeline** |

---

*生成时间: 2026-06-23*
*生成人: M11 W3 规划 agent (Claude, 换机后首日)*
*下一阶段: W3.A 启动 (T1 基础 15 课) 在 PRD/ARCH v3.0 + 287 URL 抓取完成后*
