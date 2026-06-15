# 完整修复方案设计文档

**日期**: 2026-06-10
**目标**: 收掉 1-AI教案项目与方案B目标架构的全部 10 个 Gap
**总工作量**: ~16h (2 天)
**执行模式**: Workflow + Subagent-Driven

---

## 1. 范围

修复以下 7 个 Gap（复习提醒已按用户决策 C 跳过）：

| # | 等级 | 名称 | 工作量 |
|---|------|------|--------|
| 1 | P0 | 测验 ID 格式统一 (L01-L24) | 0.5h |
| 2 | P0 | Pyodide 嵌入式代码执行 | 6h |
| 3 | P1 | QuizPanel 成绩持久化 | 2h |
| 4 | P1 | Progress.jsx 路由接入 | 2h |
| 5 | P1 | CodeEditor 语法高亮 | 1h |
| 6 | P2 | dark mode 简单切换 | 2h |
| 7 | 验收 | Playwright 截图核心路径 | 2h |
| 8 | 验收 | 构建 + 全路由验证 | 0.5h |

---

## 2. 架构

### 代码执行层（新增）

```
用户点击 "运行代码"
    ↓
CodeEditor.jsx
    ↓ postMessage({code})
pyodide.worker.js (WebWorker)
    ↓ loadPyodide() + runPython()
    ↓ postMessage({stdout, stderr, error})
CodeEditor.jsx → 显示输出
```

### 数据持久化层（复用 + 扩展）

```
IndexedDB (idb)
├── progress store   ← 已实现,需新增 QuizPanel 写入
├── quizzes store    ← 已实现,需新增 QuizPanel 写入
├── code store       ← 已实现,需新增 CodeEditor 写入
└── settings store   ← dark mode 偏好
```

### 路由扩展

```
/                    首页 (新增 dark toggle, 进度区)
/lesson/:id          课程详情 (已有)
/editor/:id          代码编辑器 (Pyodide 集成) ← 升级
/quiz/:id            测验 (成绩持久化) ← 升级
/progress            学习进度 (新增, 复用 Progress.jsx)
/outline, /plan,
/standalone,
/jupyter             静态页 iframe (已有)
```

---

## 3. 文件清单

### 新增文件
- `src/workers/pyodide.worker.js` — Pyodide WebWorker 运行时
- `src/utils/pyodide-loader.js` — Pyodide 加载器（单例 + 进度回调）
- `src/utils/id-normalizer.js` — 课程 ID 格式化（L01 ↔ L1）
- `src/components/ThemeToggle.jsx` — dark/light 切换组件
- `scripts/fix-quiz-ids.py` — 一次性迁移 questions.json 键名
- `tests/screenshots.spec.js` — Playwright 核心路径截图

### 修改文件
- `src/components/CodeEditor.jsx` — Pyodide + 语法高亮
- `src/components/QuizPanel.jsx` — 成绩持久化 + ID 适配
- `src/components/LessonContent.jsx` — 进度展示
- `src/components/Progress.jsx` — 接入路由（如需微调）
- `src/App.jsx` — /progress 路由 + 导航 + dark toggle
- `src/utils/storage.js` — 暴露 themeStore
- `src/quiz/questions.json` — 键名迁移到 L01 格式
- `src/index.css` (如有) — CSS 变量支持 dark theme
- `package.json` — 新增 playwright dev dep

---

## 4. 关键设计决策

### 4.1 Pyodide 加载策略

- **CDN**: `https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js`
- **首次**: 浏览器下载 ~10MB + 解析,显示进度
- **缓存**: 浏览器 HTTP cache + localStorage 标志位
- **降级**: 检测 `typeof Worker === 'undefined'` 时用 main thread
- **限制**: 仅支持纯 Python + numpy（明确标注"环境限制"）

### 4.2 ID 格式统一

统一为 **L01-L24** 格式（zero-padded），涉及：
- `questions.json` 键名迁移
- `QuizPanel.jsx` 路由参数补零
- `lessons_new.jsx` 已用 L01（无需改）

### 4.3 dark mode 实现

```css
:root {
  --bg-primary: #f8fafc;
  --text-primary: #1e293b;
  --card-bg: #ffffff;
}
[data-theme="dark"] {
  --bg-primary: #0f172a;
  --text-primary: #e2e8f0;
  --card-bg: #1e293b;
}
```

- 内联 style → 逐步迁移到 CSS 变量（不强制一次性改完）
- 优先级 P2: 当前内联 style 工作良好,仅关键背景色用变量

### 4.4 Playwright 验证范围

5 个核心截图：
1. 首页（看进度区 + dark toggle）
2. 课程详情 L01（看代码高亮 + 操作按钮）
3. 代码编辑器（看 Pyodide 加载 + 运行按钮）
4. 测验页面（看题目渲染）
5. 进度页（看已完成课程列表）

---

## 5. 风险与降级

| 风险 | 降级方案 |
|------|----------|
| Pyodide CDN 不可达 | 显示"请检查网络"+ 重试按钮 |
| WebWorker 不支持 | main thread 同步执行（明确警告阻塞 UI） |
| QuizPanel 已有测验运行逻辑破坏 | 仅在 onSubmitComplete 时调用 saveProgress |
| dark mode 覆盖不全 | 仅迁移 4 个核心 CSS 变量，其余接受颜色不变 |

---

## 6. 验收标准

1. ✅ `npx vite build` 无错误
2. ✅ 全部 8 个路由返回 HTTP 200
3. ✅ Playwright 5 个截图全部生成且非空白
4. ✅ L01 课程代码运行：用户代码 `print("hello")` 显示 `hello`
5. ✅ 完成 L01 测验后 `/progress` 显示该课程得分
6. ✅ 切换 dark mode 后刷新页面主题保持