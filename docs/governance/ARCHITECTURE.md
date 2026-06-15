# AI 教案 — 目标架构 (Target Architecture)

| 字段 | 内容 |
|------|------|
| 文档版本 | v2.2 |
| 创建日期 | 2026-06-10 |
| 更新日期 | 2026-06-15 |
| 适用范围 | 浏览器端纯前端项目 |
| 当前阶段 | M11 W2 (48 → 63 课) |
| 关联文档 | [PRD.md](./PRD.md) / [GAP_DRAWIO.md](./diagrams/GAP_DRAWIO.md) / [M11_W2_GAP_REEVALUATION.md](./M11_W2_GAP_REEVALUATION.md) |

---

## 1. 顶层架构图（文字版） - M11 W2

```
┌────────────────────────────────────────────────────────────────────┐
│              浏览器端 (Browser Only) - 纯前端零后端                │
├────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  React 18 SPA  (BrowserRouter / Routes)                      │  │
│  │  ┌────────────┐ ┌──────────────┐ ┌────────────────────────┐  │  │
│  │  │ HomePage   │ │ LessonContent│ │ CodeEditor             │  │  │
│  │  │ (63 lessons│ │ (MD render)  │ │ + Pyodide RunButton    │  │  │
│  │  │  网格)     │ │ + sections   │ │ + SyntaxHighlighter    │  │  │
│  │  │            │ │ + L49~L63 🆕 │ │ + Pyodide 沙箱          │  │  │
│  │  └────────────┘ └──────────────┘ └────────────────────────┘  │  │
│  │  ┌────────────┐ ┌──────────────┐ ┌────────────────────────┐  │  │
│  │  │ QuizPanel  │ │ Progress     │ │ StaticPages (iframe)   │  │  │
│  │  │ (240+题)   │ │ (IndexedDB)  │ │ Outline/Plan/Standalone│  │  │
│  │  │            │ │              │ │ Jupyter                │  │  │
│  │  └────────────┘ └──────────────┘ └────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                            ↓ ↑                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Utilities Layer                                             │  │
│  │  • pyodide-loader.js (Pyodide 单例 + Worker 池)              │  │
│  │  • storage.js      (IndexedDB: progress/quiz/code)           │  │
│  │  • id-normalizer.js (L01 ↔ L1)                               │  │
│  │  • spaced-repetition.js (SM-2 算法备用)                      │  │
│  │  • inspect_lessons.mjs 🆕 (实测验收脚本)                     │  │
│  │  • md_to_lesson.mjs 🆕 (md→JSX 转换器)                      │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                            ↓ ↑                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Data Layer (静态资源) - M11 W2 更新                         │  │
│  │  • lessons_new.jsx (63 课, ~6500 行, 44 万字) 🆕            │  │
│  │  • questions.json  (240+ 题测验题库)                          │  │
│  │  • public/static/*.html (4 个静态页面)                       │  │
│  │  • images/*.svg    (48+ 张配图, W2 +15 张) 🆕                │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                            ↓ ↑                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  External: Pyodide CDN (jsdelivr) — 仅首次加载              │  │
│  │  External: DeepSeek API (deepseek-v4-flash) — W2 写长文 🆕   │  │
│  │  External: MiniMax API (image-01) — W2 文生图 🆕            │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

### 1.1 M11 W2 阶段特性 (相比 Phase 2)

| 维度 | Phase 2 (旧) | M11 W2 (新) |
|------|--------|----------|
| 课程数 | 35 课 | **63 课** (+15 课: L49-L63) |
| 工具数 | 8 工具 | **9 工具** (含 AITutor) |
| 总字数 | ~21 万 (估) | **44 万** (实测) |
| 课程主题结构 | 12 周线性 | **12 周 + W2 三批主题冲刺** (基础/RAG/微调/Agent/行业) |
| 内容来源 | 人工编写 + 简单 LLM | **deepseek 自动化** (W1/W2 验证流程) |
| 验收方法 | 人工 spot-check | **inspect_lessons.mjs 自动化实测** |

---

## 2. 架构原则

| # | 原则 | 体现 |
|---|------|------|
| 1 | **纯前端零后端** | 静态托管即可部署 |
| 2 | **本地优先** | 进度/代码/测验全本地 IndexedDB |
| 3 | **代码沙箱** | Pyodide Worker 隔离 |
| 4 | **模块化** | components / utils / data 分层 |
| 5 | **类型宽容** | `ReferenceSection` 兼容 5 种引用格式 |
| 6 | **可降级** | Pyodide 失败时回退到代码高亮 + 复制 |
| 7 | **实测驱动验收** 🆕 | inspect_lessons.mjs 硬验收 (W1 教训) |
| 8 | **内容流水线可复现** 🆕 | deepseek 写 + md_to_lesson.mjs 转 (W1 验证) |

---

## 3. 模块拆分 (M11 W2 更新)

### 3.1 路由表 (63 课 + 9 工具 + 5 静态 = 77 路由)

| Path | Component | 状态 | 数据来源 |
|------|-----------|:----:|----------|
| `/` | HomePage | ✓ | LESSONS + WEEK_GROUPS (63 课) |
| `/lesson/:id` | LessonContent | ✓ | LESSONS[id] (L01-L63) |
| `/editor/:id` | CodeEditor | ✓ | 默认 snippet + Pyodide |
| `/quiz/:id` | QuizPanel | ✓ | questions.json[id] |
| `/progress` | Progress | ✓ | IndexedDB |
| `/outline` | OutlinePage (iframe) | ✓ | 静态页 |
| `/plan` | PlanReportPage (iframe) | ✓ | 静态页 |
| `/standalone` | StandalonePage (iframe) | ✓ | 静态页 |
| `/jupyter` | JupyterDemoPage (iframe) | ✓ | 静态页 |
| `/tools/token` | TokenCounter | ✓ | 工具页 |
| `/tools/search` | Search | ✓ | 工具页 |
| `/tools/errors` | ErrorBook | ✓ | 工具页 |
| `/tools/playground` | PromptPlayground | ✓ | 工具页 |
| `/tools/rag` | RAGBuilder | ✓ | 工具页 |
| `/tools/knowledge` | KnowledgeGraph | ✓ | 工具页 |
| `/tools/leaderboard` | Leaderboard | ✓ | 工具页 |
| `/tools/benchmark` | BenchmarkRunner | ✓ | 工具页 |
| `/tools/tutor` 🆕 | AITutor | ✓ (M9 完成) | 工具页 |

**课程路由细分 (W2 重点扩展)**:

| 周次 | 路由 | W2 后状态 |
|------|------|----------|
| Week 1-2 机器学习基础 | `/lesson/L01`-`/lesson/L04` | ✓ 不变 |
| Week 3-4 深度学习基础 | `/lesson/L05`-`/lesson/L08` | ✓ 不变 |
| Week 5-6 NLP 与词向量 | `/lesson/L09`-`/lesson/L12` | ✓ 不变 |
| Week 7-8 Transformer | `/lesson/L13`-`/lesson/L16` | ✓ 不变 |
| Week 9-10 大模型应用 | `/lesson/L17`-`/lesson/L20` | ✓ 不变 |
| Week 11-12 前沿专题 | `/lesson/L21`-`/lesson/L24` | ✓ 不变 |
| Week 13-14 前沿模型与微调 | `/lesson/L25`-`/lesson/L28` | ✓ 不变 |
| Week 15-16 工程化与分布式 | `/lesson/L29`-`/lesson/L32` | ✓ 不变 |
| Week 17 评测与行业案例 | `/lesson/L33`-`/lesson/L34` | ✓ 不变 |
| Week 18 面试与高级专题 | `/lesson/L35`-`/lesson/L36` | ✓ 不变 |
| Week 19 基础工程化补充 | `/lesson/L37`-`/lesson/L38` | ✓ W1 新增 |
| **Week 20-22 RAG 优化策略** 🆕 | `/lesson/L39`-`/lesson/L48` | ✓ W1 新增 (10 课) |
| **Week 23-25 W2 冲刺** 🆕 | `/lesson/L49`-`/lesson/L63` | **⏳ W2 待交付** (15 课) |

### 3.2 组件清单 (M11 W2 不变)

| 组件 | 职责 | W2 变化 |
|------|------|--------|
| `App.jsx` | 根 + Navigation + Footer + Routes | 无变化 |
| `HomePage` | 课程列表网格 + 进度条 | 自动适配 63 课 (WEEK_GROUPS 动态) |
| `LessonContent` | 章节/代码/习题/参考渲染 | 自动适配 63 课 |
| `CodeEditor` | 代码编辑 + Pyodide 运行 | 无变化 |
| `QuizPanel` | 题目渲染 + 评分 + 持久化 | 无变化 |
| `Progress` | 完成率/得分展示 | 无变化 |
| `StaticPages` | iframe 包装 | 无变化 |
| `ThemeToggle` | dark/light 切换 | 无变化 |
| 8 工具组件 (TokenCounter/Search/ErrorBook/PromptPlayground/RAGBuilder/KnowledgeGraph/Leaderboard/BenchmarkRunner) | 工具页 | 无变化 (W2 维持) |
| AITutor (M9 完成) | RAG 问答 | 无变化 |
| `Pyodide.worker.js` | Python 解释器 | 无变化 |
| `inspect_lessons.mjs` 🆕 | 实测验收 | **W1 新增, W2 沿用** |
| `md_to_lesson.mjs` 🆕 | md→JSX 转换 | **W1 新增, W2 沿用** |

### 3.3 数据模型 (M11 W2 更新)

#### Lesson (`lessons_new.jsx` → `LESSONS` 对象)
```typescript
interface Lesson {
  id: string;            // "L01" ~ "L63"
  title: string;
  week: string;          // "Week 1-2 基础" / "Week 20 RAG" / "Week 23 行业方案" / "Week 25 Agent"
  tags: string[];
  image: string;         // "/images/xxx.svg"
  objectives: string[];  // 3-7 条学习目标
  sections: Section[];   // 3-10 个章节 (W2 行业方案 5-8 章)
  codeExamples: CodeExample[];  // 4-10 个 (W2 行业方案 5-8 个)
  exercises: Exercise[];
  references: Reference[];      // 5-12 条 (W2 行业方案 8-12 条)
  // W1 增强字段:
  industryPractice?: string;    // W2.A 行业方案必填 (≥1 个真实公司案例)
  openSourceRepo?: string;      // W2.B 微调必填 (≥1 个开源仓库)
  agentFramework?: string;      // W2.C Agent 必填 (≥1 个真实框架)
}

interface Section {
  title: string;
  content: string;       // ≥1500 字符
}

interface CodeExample {
  title: string;
  code: string;
  language: string;
  repo?: string;
  install_cmd?: string;
}

interface Reference {     // 支持 5 种格式 (沿用)
  title?: string;
  name?: string;
  label?: string;
  url?: string;
  type?: 'paper'|'github'|'documentation'|'video'|'course'|'book'|'official'|'blog';
  authors?: string;
  description?: string;
}
```

**W2 数据模型新增校验**:
- `industryPractice` / `openSourceRepo` / `agentFramework` 至少一个必填, 视主题而定
- W2.A 课 `industryPractice` 必填 ≥ 1 个真实公司名
- W2.B 课 `openSourceRepo` 必填 ≥ 1 个 github.com 链接
- W2.C 课 `agentFramework` 必填 ≥ 1 个框架名 (AutoGen/CrewAI/LangGraph...)

#### Question (`questions.json`)
W2 不扩展 (240+ 题已覆盖, 后续 M12+ 考虑扩展)

---

## 4. 关键技术决策 (M11 W2 新增)

### 4.1 为什么 deepseek-v4-flash 写长文?
- **质量**: 13K 中文字符单课输出稳定 (W1 实测)
- **成本**: 比 GPT-4 便宜 50x
- **可控**: max_tokens 可调, prompt 可控
- **可降级**: minimax-text-01 备用 (W1 验证可行)

### 4.2 为什么 md_to_lesson.mjs?
- **可复现**: 同一 markdown 可重放生成 JSX
- **可审计**: 转换日志清晰, 便于回溯 placeholder 污染
- **W1 教训**: 必须在 prompt 中加 placeholder 检测, 转换器加 post-check

### 4.3 为什么 inspect_lessons.mjs 必跑?
- **W1 教训**: 估算覆盖率严重偏离实际 (16.5% vs 16.8% 估算, 单课字数估算偏离 2-3x)
- **W2 强制**: 每次构建后跑一次, 写入门条件 (DoD)
- **轻量**: < 2 秒, 不阻塞 CI

### 4.4 (沿用) Pyodide vs JupyterLite
- **上下文连贯**: 不跳出当前 React app
- **离线可用**: 缓存后可重载
- **可控**: 错误处理/超时/取消都可定制

### 4.5 (沿用) IndexedDB + localStorage
- **IndexedDB**: 测验/代码存档 (结构化)
- **localStorage**: 轻量布尔 (dark mode/checkbox)

### 4.6 (沿用) 单页 + iframe 静态页
- 4 个静态页是早期 MD 渲染产物
- iframe 隔离样式, 避免 React style 污染

### 4.7 (沿用) CSS 变量而非完整主题系统
- 当前内联 style 工作良好
- dark/light 切换最小成本

---

## 5. 部署架构 (M11 W2 不变)

```
[开发者]
  ↓ git push
[GitHub Repo]
  ↓ webhook
[Vite build → dist/]
  ↓ 自动部署
[静态托管]
  • Vercel / Netlify / Nginx
  • HTTPS + HTTP/2
  • Cache-Control: 静态资源 1y
```

**W2 新增监控**:
- 每次 push 后 CI 自动跑 `inspect_lessons.mjs`, 不达标 fail
- 监控 `dist/assets/index-*.js` 大小 (< 2MB, 拆分 chunk 列入 P1)

---

## 6. 安全模型 (M11 W2 不变)

| 层 | 措施 |
|----|------|
| 网络 | HTTPS only |
| 代码执行 | WebWorker 沙箱, 无 DOM 访问 |
| 数据存储 | localStorage/IndexedDB 仅本域 |
| 内容 | 引用外链 `rel="noopener noreferrer"` |
| 依赖 | npm audit + 锁定 package-lock |
| 🆕 API Key | DEEPSEEK_API_KEY / ANTHROPIC_AUTH_TOKEN 存 .env, 不入仓 |

---

## 7. 可观测性 (M11 W2 不变)

| 信号 | 实现 |
|------|------|
| 用户路径 | URL hash + localStorage events |
| 错误捕获 | window.onerror + console |
| 性能 | PerformanceObserver (手动埋点) |
| 🆕 课程数据 | inspect_lessons.mjs 输出 (63 课汇总) |

---

## 8. M11 W2 演进路径

| 维度 | 现状 (W1) | W2 目标 | 后续 (M12+) |
|------|----------|--------|-------------|
| 课程数 | 48 | **63** | 80+ (L64-L80) |
| 总字数 | 24.1 万 | **44 万** | 60 万+ |
| 9 专题总覆盖 | 16.8% | **~30%** | 50%+ |
| 行业方案专题 | 2% | **~15%** | 30%+ |
| 微调篇 | 9% | **~35%** | 50%+ |
| Agent 篇 | 7% | **~30%** | 50%+ |
| 工具数 | 9 | 9 (不变) | 10+ (Tutor API 集成) |
| 工具 v1.0 | v0.1 | **v0.1 (不变)** | v1.0 (Phase 3) |
| AI 助教 | Mock | Mock (不变) | API 集成 (Phase 3) |
| 云端同步 | 无 | 无 (不变) | 可选 (Phase 4) |
| PWA | 完整 | 完整 (不变) | 增强 (Phase 4) |

详见 `diagrams/GAP_DRAWIO.md` 视觉化差距。
