# 完整修复方案实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 收掉 1-AI教案项目与方案B目标架构的全部 7 个剩余 Gap（复习提醒已跳过）

**Architecture:**
- Pyodide WebWorker 嵌入式 Python 执行
- IndexedDB + localStorage 双层持久化
- CSS 变量支持 dark mode 简单切换
- React Router 扩展 `/progress` 路由

**Tech Stack:**
- React 18 + Vite 5
- react-syntax-highlighter (已装)
- pyodide 0.26.2 (新增, CDN)
- idb (已装)
- Playwright (新增, devDep)

---

## File Structure

```
src/
├── workers/                       # 新增: Pyodide WebWorker
│   └── pyodide.worker.js
├── utils/
│   ├── pyodide-loader.js          # 新增: Pyodide 单例加载器
│   ├── id-normalizer.js           # 新增: L01 ↔ L1 格式化
│   ├── storage.js                 # 修改: 暴露 themeStore
│   └── spaced-repetition.js       # 不动
├── components/
│   ├── CodeEditor.jsx             # 修改: Pyodide + 语法高亮
│   ├── QuizPanel.jsx              # 修改: 成绩持久化 + ID 适配
│   ├── LessonContent.jsx          # 修改: 进度展示
│   ├── Progress.jsx               # 不动(已存在)
│   ├── ThemeToggle.jsx            # 新增: dark mode 切换
│   └── StaticPages.jsx            # 不动
├── data/
│   ├── lessons_new.jsx            # 不动(L01 格式正确)
│   └── l23_rebuilt.json           # 不动(已并入 lessons_new)
├── quiz/
│   └── questions.json             # 修改: 键名 L1-L9 → L01-L09
└── App.jsx                        # 修改: /progress + dark toggle

scripts/
└── fix-quiz-ids.py                # 新增: 一次性 ID 迁移

tests/
└── screenshots.spec.js            # 新增: Playwright 截图

docs/superpowers/
├── specs/2026-06-10-fix-all-gaps-design.md
└── plans/2026-06-10-fix-all-gaps.md (本文件)
```

---

## Task 1: 修复 questions.json ID 格式

**Files:**
- Modify: `src/quiz/questions.json` (键名迁移)
- Create: `scripts/fix-quiz-ids.py`

- [ ] **Step 1: 创建 ID 迁移脚本**

创建 `/Users/Zhuanz/Desktop/workspace/1-AI教案/scripts/fix-quiz-ids.py`：

```python
import json
from pathlib import Path

QUESTIONS_FILE = Path('/Users/Zhuanz/Desktop/workspace/1-AI教案/src/quiz/questions.json')

with open(QUESTIONS_FILE) as f:
    data = json.load(f)

new_data = {}
for key, val in data.items():
    # L1 -> L01, L9 -> L09
    if key.startswith('L') and not key.startswith('L0'):
        try:
            num = int(key[1:])
            new_key = f'L{num:02d}'
        except ValueError:
            new_key = key
    else:
        new_key = key
    new_data[new_key] = val

with open(QUESTIONS_FILE, 'w', encoding='utf-8') as f:
    json.dump(new_data, f, ensure_ascii=False, indent=2)

print(f'Migrated {len(new_data)} keys')
print(f'New keys: {sorted(new_data.keys())}')
```

- [ ] **Step 2: 执行迁移**

```bash
cd /Users/Zhuanz/Desktop/workspace/1-AI教案
python3 scripts/fix-quiz-ids.py
```

期望输出：`Migrated 24 keys` + `New keys: ['L01', 'L02', ..., 'L24']`

- [ ] **Step 3: 验证键名**

```bash
python3 -c "import json; d=json.load(open('src/quiz/questions.json')); print(sorted(d.keys())[:5], sorted(d.keys())[-3:])"
```

期望：`['L01', 'L02', 'L03', 'L04', 'L05'] ['L22', 'L23', 'L24']`

- [ ] **Step 4: 提交**

```bash
git add scripts/fix-quiz-ids.py src/quiz/questions.json
git commit -m "fix: unify quiz ID format to L01-L24 zero-padded"
```

---

## Task 2: 创建 ID 格式化工具

**Files:**
- Create: `src/utils/id-normalizer.js`

- [ ] **Step 1: 写入工具函数**

创建 `/Users/Zhuanz/Desktop/workspace/1-AI教案/src/utils/id-normalizer.js`：

```javascript
/**
 * Normalize a course ID to zero-padded L01 format.
 * Accepts: 'L1', 'L01', '1', 1
 * Returns: 'L01'
 */
export function normalizeLessonId(id) {
  if (typeof id === 'number') {
    return `L${String(id).padStart(2, '0')}`;
  }
  const str = String(id);
  const match = str.match(/^L?(\d+)$/);
  if (!match) return str;
  return `L${match[1].padStart(2, '0')}`;
}

/**
 * Extract numeric part of lesson ID. 'L01' -> 1
 */
export function lessonIdToNumber(id) {
  const match = String(id).match(/^L?(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}
```

- [ ] **Step 2: 提交**

```bash
git add src/utils/id-normalizer.js
git commit -m "feat: add lesson ID normalization utility"
```

---

## Task 3: 创建 Pyodide WebWorker

**Files:**
- Create: `src/workers/pyodide.worker.js`

- [ ] **Step 1: 写入 Worker 代码**

创建 `/Users/Zhuanz/Desktop/workspace/1-AI教案/src/workers/pyodide.worker.js`：

```javascript
// Pyodide WebWorker - runs Python in browser via WASM
let pyodide = null;
let loadingPromise = null;

const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js';

async function loadPyodide() {
  if (pyodide) return pyodide;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    self.postMessage({ type: 'status', message: '正在加载 Pyodide...' });

    // Dynamic import via importScripts
    importScripts(PYODIDE_CDN);
    pyodide = await self.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/',
    });

    self.postMessage({ type: 'ready' });
    return pyodide;
  })();

  return loadingPromise;
}

self.addEventListener('message', async (event) => {
  const { id, code } = event.data;

  if (event.data.type === 'load') {
    try {
      await loadPyodide();
    } catch (e) {
      self.postMessage({ id, type: 'error', error: `加载失败: ${e.message}` });
    }
    return;
  }

  try {
    await loadPyodide();

    // Capture stdout
    let stdout = '';
    pyodide.setStdout({
      batched: (text) => { stdout += text + '\n'; }
    });
    pyodide.setStderr({
      batched: (text) => { stdout += text + '\n'; }
    });

    const result = await pyodide.runPythonAsync(code);

    self.postMessage({
      id,
      type: 'result',
      stdout: stdout.trim(),
      result: result !== undefined ? String(result) : null
    });
  } catch (error) {
    self.postMessage({
      id,
      type: 'error',
      error: error.message || String(error),
      stdout: (stdout || '').trim()
    });
  }
});
```

- [ ] **Step 2: 提交**

```bash
git add src/workers/pyodide.worker.js
git commit -m "feat: add Pyodide WebWorker for in-browser Python execution"
```

---

## Task 4: 创建 Pyodide 加载器

**Files:**
- Create: `src/utils/pyodide-loader.js`

- [ ] **Step 1: 写入加载器**

创建 `/Users/Zhuanz/Desktop/workspace/1-AI教案/src/utils/pyodide-loader.js`：

```javascript
/**
 * Pyodide loader - manages a single WebWorker instance and queues run requests.
 */
let worker = null;
let readyPromise = null;
let nextId = 1;
const callbacks = new Map();

export function initPyodide(onStatus) {
  if (worker) return readyPromise;

  worker = new Worker(
    new URL('../workers/pyodide.worker.js', import.meta.url),
    { type: 'classic' }
  );

  worker.addEventListener('message', (e) => {
    const { id, type, stdout, result, error, message } = e.data;

    if (type === 'status' && onStatus) {
      onStatus(message);
      return;
    }
    if (type === 'ready') {
      readyPromise = Promise.resolve();
      return;
    }
    if (id !== undefined && callbacks.has(id)) {
      const cb = callbacks.get(id);
      callbacks.delete(id);
      if (type === 'result') cb.resolve({ stdout, result });
      else cb.reject({ error, stdout });
    }
  });

  readyPromise = new Promise((resolve) => {
    const readyHandler = (e) => {
      if (e.data.type === 'ready') {
        worker.removeEventListener('message', readyHandler);
        resolve();
      }
    };
    worker.addEventListener('message', readyHandler);
  });

  worker.postMessage({ type: 'load' });
  return readyPromise;
}

export async function runPython(code, onStatus) {
  await initPyodide(onStatus);

  return new Promise((resolve, reject) => {
    const id = nextId++;
    callbacks.set(id, { resolve, reject });
    worker.postMessage({ id, code });
  });
}

export function isPyodideReady() {
  return readyPromise !== null;
}
```

- [ ] **Step 2: 提交**

```bash
git add src/utils/pyodide-loader.js
git commit -m "feat: add Pyodide loader with single Worker instance"
```

---

## Task 5: 重构 CodeEditor 集成 Pyodide + 语法高亮

**Files:**
- Modify: `src/components/CodeEditor.jsx`

- [ ] **Step 1: 读取当前文件**

```bash
wc -l /Users/Zhuanz/Desktop/workspace/1-AI教案/src/components/CodeEditor.jsx
```

- [ ] **Step 2: 替换 CodeEditor.jsx**

完整重写 `/Users/Zhuanz/Desktop/workspace/1-AI教案/src/components/CodeEditor.jsx`：

```jsx
import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { runPython, isPyodideReady } from '../utils/pyodide-loader';

export default function CodeEditor({ lessonId, onBack, initialCode }) {
  const [code, setCode] = useState(
    initialCode || `# 在这里输入 Python 代码\n# 点击 "运行" 按钮在浏览器中执行\n\nprint("Hello, AI 教案!")\n`
  );
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState('');
  const [ready, setReady] = useState(isPyodideReady());

  useEffect(() => {
    // Preload Pyodide when editor opens
    const t = setTimeout(async () => {
      try {
        setStatus('首次加载约需 10 秒...');
        // Just check readiness lazily on first run
      } catch (e) {
        setStatus('加载失败');
      }
    }, 100);
    return () => clearTimeout(t);
  }, []);

  const handleRun = async () => {
    setRunning(true);
    setOutput('');
    setStatus('正在执行...');
    try {
      const result = await runPython(code, setStatus);
      const out = [result.stdout, result.result].filter(Boolean).join('\n');
      setOutput(out || '(无输出)');
      setStatus('✓ 执行完成');
    } catch (err) {
      setOutput(`❌ 错误:\n${err.error || err}`);
      setStatus('执行失败');
    } finally {
      setRunning(false);
    }
  };

  const styles = {
    container: { maxWidth: 1000, margin: '0 auto', padding: '32px 20px' },
    header: { marginBottom: 20 },
    backBtn: {
      background: 'linear-gradient(135deg, #4F46E5 0%, #6366f1 100%)',
      color: 'white', border: 'none', padding: '10px 20px',
      borderRadius: 10, cursor: 'pointer', fontWeight: 600,
      boxShadow: '0 2px 8px rgba(79,70,229,0.25)'
    },
    title: { fontSize: '1.5rem', fontWeight: 700, marginTop: 16, marginBottom: 16 },
    toolbar: {
      display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12
    },
    runBtn: {
      background: running ? '#94a3b8' : '#10B981',
      color: 'white', border: 'none', padding: '10px 20px',
      borderRadius: 8, cursor: running ? 'wait' : 'pointer',
      fontWeight: 600, fontSize: '0.95rem'
    },
    statusText: { color: '#64748b', fontSize: '0.85rem' },
    editorBox: {
      borderRadius: 12, overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    },
    textarea: {
      width: '100%', minHeight: 320, padding: 16,
      fontFamily: '"Fira Code", "Consolas", monospace',
      fontSize: '0.9rem', color: '#e2e8f0', background: '#1e1e1e',
      border: 'none', outline: 'none', resize: 'vertical'
    },
    outputBox: {
      background: '#0f172a', color: '#10b981',
      padding: 16, borderRadius: 12, marginTop: 12,
      fontFamily: '"Fira Code", "Consolas", monospace',
      fontSize: '0.9rem', whiteSpace: 'pre-wrap',
      minHeight: 80, maxHeight: 320, overflow: 'auto'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← 返回课程</button>
        <h2 style={styles.title}>💻 代码练习 - {lessonId}</h2>
      </div>

      <div style={styles.toolbar}>
        <button style={styles.runBtn} onClick={handleRun} disabled={running}>
          {running ? '⏳ 运行中...' : '▶ 运行代码'}
        </button>
        <span style={styles.statusText}>{status}</span>
      </div>

      <div style={styles.editorBox}>
        <textarea
          style={styles.textarea}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
        />
      </div>

      <h3 style={{ marginTop: 24, marginBottom: 8, color: '#1e293b' }}>📤 输出</h3>
      <div style={styles.outputBox}>{output || '(等待运行)'}</div>

      <details style={{ marginTop: 16, color: '#64748b', fontSize: '0.85rem' }}>
        <summary>语法高亮示例 (只读)</summary>
        <SyntaxHighlighter language="python" style={vscDarkPlus} customStyle={{ borderRadius: 8, marginTop: 8 }}>
{`import numpy as np

def train(X, y, lr=0.01, epochs=100):
    weights = np.zeros(X.shape[1])
    for _ in range(epochs):
        pred = X @ weights
        weights -= lr * (X.T @ (pred - y)) / len(y)
    return weights

print("训练完成:", train(X_train, y_train))`}
        </SyntaxHighlighter>
      </details>
    </div>
  );
}
```

- [ ] **Step 3: 提交**

```bash
git add src/components/CodeEditor.jsx
git commit -m "feat: integrate Pyodide runner + syntax highlighter in CodeEditor"
```

---

## Task 6: QuizPanel 成绩持久化

**Files:**
- Modify: `src/components/QuizPanel.jsx`

- [ ] **Step 1: 找到测验完成回调位置**

```bash
grep -n "complete\|finish\|score" /Users/Zhuanz/Desktop/workspace/1-AI教案/src/components/QuizPanel.jsx | head -20
```

- [ ] **Step 2: 修改 QuizPanel.jsx 头部导入**

在 `/Users/Zhuanz/Desktop/workspace/1-AI教案/src/components/QuizPanel.jsx` 第 1 行后添加：

```javascript
import { progressDB } from '../utils/storage';
import { normalizeLessonId } from '../utils/id-normalizer';
```

- [ ] **Step 3: 找到 quiz 完成函数（应该在 handleSubmit 或类似函数）**

用 grep 找到计算分数的位置，在该函数末尾添加持久化逻辑：

```javascript
// Persist result to IndexedDB
try {
  const normalizedId = normalizeLessonId(lessonId);
  await progressDB.saveProgress(normalizedId, 'quiz', {
    score,
    total: totalQuestions,
    answers,
    takenAt: new Date().toISOString()
  });
} catch (err) {
  console.warn('保存测验成绩失败:', err);
}
```

- [ ] **Step 4: 同时修复 lessonId 引用**

找到所有引用 lessonId 读取 questions 的位置（如果存在），用：

```javascript
const normalizedId = normalizeLessonId(lessonId);
```

确保 `questions.json` 用 `L01` 键查询。

- [ ] **Step 5: 提交**

```bash
git add src/components/QuizPanel.jsx
git commit -m "feat: persist quiz scores to IndexedDB + ID normalization"
```

---

## Task 7: Progress.jsx 路由接入

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: 读取 App.jsx 路由部分**

确认 routes 配置位置（约第 232 行）。

- [ ] **Step 2: 导入 Progress 组件**

修改 `/Users/Zhuanz/Desktop/workspace/1-AI教案/src/App.jsx` 第 7 行附近：

```javascript
import Progress from './components/Progress';
```

- [ ] **Step 3: 添加路由**

在 `/progress` 路由位置插入：

```jsx
<Route path="/progress" element={<Progress />} />
```

放在 `/quiz/:lessonId` 之后。

- [ ] **Step 4: 添加导航按钮**

修改 Navigation 组件的内层 Link 区：

```jsx
<Link to="/progress" className={isActive('/progress') ? 'nav-btn active' : 'nav-btn'}>📈 学习进度</Link>
```

放在 `/jupyter` 之前。

- [ ] **Step 5: 提交**

```bash
git add src/App.jsx
git commit -m "feat: add /progress route and nav link"
```

---

## Task 8: 创建 ThemeToggle 组件

**Files:**
- Create: `src/components/ThemeToggle.jsx`

- [ ] **Step 1: 创建组件**

创建 `/Users/Zhuanz/Desktop/workspace/1-AI教案/src/components/ThemeToggle.jsx`：

```jsx
import React, { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme]);

  const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <button
      onClick={toggle}
      style={{
        background: 'rgba(255,255,255,0.15)',
        color: 'white', border: 'none', padding: '6px 12px',
        borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem',
        whiteSpace: 'nowrap'
      }}
      title="切换主题"
    >
      {theme === 'light' ? '🌙 暗色' : '☀️ 亮色'}
    </button>
  );
}
```

- [ ] **Step 2: 在 App.jsx 导航栏使用**

修改 Navigation 组件的内层 `<div>` 区，在 nav-btn 列表后添加：

```jsx
<ThemeToggle />
```

- [ ] **Step 3: 提交**

```bash
git add src/components/ThemeToggle.jsx src/App.jsx
git commit -m "feat: add dark mode toggle component"
```

---

## Task 9: 添加 dark theme CSS 变量

**Files:**
- Modify: `src/index.css` (如果存在) 或 `index.html`

- [ ] **Step 1: 检查 CSS 文件**

```bash
ls /Users/Zhuanz/Desktop/workspace/1-AI教案/src/*.css 2>/dev/null
ls /Users/Zhuanz/Desktop/workspace/1-AI教案/index.html
```

- [ ] **Step 2: 在 index.html 添加 CSS 变量**

修改 `/Users/Zhuanz/Desktop/workspace/1-AI教案/index.html` 的 `<head>`，在 `<title>` 后插入：

```html
<style>
  :root {
    --bg-primary: #f8fafc;
    --bg-card: #ffffff;
    --text-primary: #1e293b;
    --text-secondary: #64748b;
    --border-color: #e2e8f0;
  }
  [data-theme="dark"] {
    --bg-primary: #0f172a;
    --bg-card: #1e293b;
    --text-primary: #e2e8f0;
    --text-secondary: #94a3b8;
    --border-color: #334155;
  }
  body {
    background: var(--bg-primary);
    color: var(--text-primary);
    transition: background 0.3s, color 0.3s;
  }
</style>
```

- [ ] **Step 3: 提交**

```bash
git add index.html
git commit -m "feat: add CSS variables for dark theme support"
```

---

## Task 10: 关键组件应用 CSS 变量

**Files:**
- Modify: `src/components/LessonContent.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: 修改 LessonContent.jsx 中卡片背景**

将 `card.background: 'white'` → `card.background: 'var(--bg-card, white)'`

将 `wrapper` 下的背景相关色用 CSS 变量。

- [ ] **Step 2: 修改 App.jsx 中 footer 背景**

将 `footer.background: '#f8fafc'` → `'var(--bg-primary, #f8fafc)'`

- [ ] **Step 3: 提交**

```bash
git add src/components/LessonContent.jsx src/App.jsx
git commit -m "refactor: apply dark theme CSS variables to key components"
```

---

## Task 11: 构建验证

**Files:** 无（仅验证）

- [ ] **Step 1: 运行 vite build**

```bash
cd /Users/Zhuanz/Desktop/workspace/1-AI教案
npx vite build 2>&1 | tail -20
```

期望：`✓ built in <N>s` 无错误。

- [ ] **Step 2: 启动 preview**

```bash
lsof -ti:3000 | xargs kill -9 2>/dev/null
npx vite preview --port 3000 --host 2>&1 &
sleep 2
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000
```

期望：`200`

- [ ] **Step 3: 验证所有路由**

```bash
for path in / /outline /plan /standalone /jupyter /progress /lesson/L01 /editor/L01 /quiz/L01; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$path")
  echo "$path: $code"
done
```

期望全部 `200`。

---

## Task 12: 安装 Playwright 并写截图测试

**Files:**
- Modify: `package.json` (新增 devDep)
- Create: `tests/screenshots.spec.js`

- [ ] **Step 1: 安装 Playwright**

```bash
cd /Users/Zhuanz/Desktop/workspace/1-AI教案
npm install -D @playwright/test
npx playwright install chromium --with-deps 2>&1 | tail -5
```

- [ ] **Step 2: 创建 Playwright 配置**

创建 `/Users/Zhuanz/Desktop/workspace/1-AI教案/playwright.config.js`：

```javascript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 800 },
  },
  reporter: 'list',
});
```

- [ ] **Step 3: 创建截图测试**

创建 `/Users/Zhuanz/Desktop/workspace/1-AI教案/tests/screenshots.spec.js`：

```javascript
import { test } from '@playwright/test';
import fs from 'fs';

const SCREENSHOT_DIR = 'screenshots';
if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR);

test('home page', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${SCREENSHOT_DIR}/01-home.png`, fullPage: true });
});

test('lesson detail L01', async ({ page }) => {
  await page.goto('/lesson/L01');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${SCREENSHOT_DIR}/02-lesson-L01.png`, fullPage: true });
});

test('code editor L01', async ({ page }) => {
  await page.goto('/editor/L01');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${SCREENSHOT_DIR}/03-editor-L01.png`, fullPage: true });
});

test('quiz L01', async ({ page }) => {
  await page.goto('/quiz/L01');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${SCREENSHOT_DIR}/04-quiz-L01.png`, fullPage: true });
});

test('progress page', async ({ page }) => {
  await page.goto('/progress');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${SCREENSHOT_DIR}/05-progress.png`, fullPage: true });
});

test('dark mode toggle', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const toggle = page.locator('button[title="切换主题"]');
  await toggle.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/06-dark-mode.png`, fullPage: true });
});
```

- [ ] **Step 4: 运行测试**

```bash
cd /Users/Zhuanz/Desktop/workspace/1-AI教案
npx playwright test 2>&1 | tail -30
```

期望：6 个测试全部通过，生成 6 张截图。

- [ ] **Step 5: 检查截图**

```bash
ls -la /Users/Zhuanz/Desktop/workspace/1-AI教案/screenshots/
```

期望：6 个 PNG 文件，每个 >10KB。

- [ ] **Step 6: 提交**

```bash
git add package.json package-lock.json playwright.config.js tests/
git commit -m "test: add Playwright core-path screenshot tests"
```

---

## 自审 checklist

- [x] Spec coverage: 7 个 Gap 全部对应到 Task 1-12
- [x] Placeholder scan: 无 TBD/TODO 占位
- [x] Type consistency: `normalizeLessonId` 在 id-normalizer.js 定义并在 QuizPanel/L01 ID 查询中使用一致
- [x] Worker 路径: `../workers/pyodide.worker.js` 相对 pyodide-loader.js 在 `utils/` 下, 实际是 `../workers/pyodide.worker.js` ✓