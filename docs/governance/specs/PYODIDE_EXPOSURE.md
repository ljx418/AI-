# Pyodide 入口暴露方案 (Pyodide in LessonContent)

| 字段 | 内容 |
|------|------|
| 任务 ID | M5-T9 |
| 文档版本 | v1.0 |
| 创建日期 | 2026-06-10 |
| 估计工时 | 2h |
| 优先级 | P1 |

---

## 1. 目标

让用户在 `LessonContent.jsx` 看到代码示例时，**直接点击「▶ 运行」按钮**即可在浏览器内执行 Python 代码并看到输出，**不必跳转到 `/editor/:id` 页面**。

---

## 2. 现状

- `CodeEditor.jsx` 已集成 Pyodide（WebWorker）+ react-syntax-highlighter
- `LessonContent.jsx` 的代码块**仅有「复制」按钮**（参见 `CodeExample` 组件）
- 用户必须从课程详情 → 点"代码练习" → 编辑器，**多一次跳转**

---

## 3. 设计

### 3.1 核心组件：`RunnableCodeBlock`

把 `CodeEditor.jsx` 的核心能力（编辑 + Pyodide 运行 + 输出）抽成可复用组件：

```jsx
// src/components/RunnableCodeBlock.jsx
import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { runPython, isPyodideReady } from '../utils/pyodide-loader';

export default function RunnableCodeBlock({ code: initialCode, lessonId, compact = false }) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState('');

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

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      // 简单的视觉反馈
    });
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        background: '#1e293b',
        borderRadius: 10,
        overflow: 'hidden',
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)'
      }}>
        {/* 头部：标题 + 按钮 */}
        <div style={{
          background: '#0f172a',
          padding: '8px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>💻 Python · {lessonId}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={handleCopy} style={{
              background: '#374151', color: 'white', border: 'none',
              padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: '0.75rem'
            }}>📋 复制</button>
            <button onClick={handleRun} disabled={running} style={{
              background: running ? '#94a3b8' : '#10B981', color: 'white', border: 'none',
              padding: '4px 12px', borderRadius: 4, cursor: running ? 'wait' : 'pointer',
              fontSize: '0.75rem', fontWeight: 600
            }}>{running ? '⏳ 运行中' : '▶ 运行'}</button>
          </div>
        </div>
        {/* 代码区（可编辑 textarea） */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          style={{
            width: '100%', minHeight: compact ? 100 : 180,
            padding: 12, fontFamily: '"Fira Code", monospace',
            fontSize: '0.85rem', color: '#e2e8f0', background: '#1e293b',
            border: 'none', outline: 'none', resize: 'vertical'
          }}
        />
        {/* 状态 + 输出 */}
        {(output || status) && (
          <div style={{
            background: '#0f172a', color: output.startsWith('❌') ? '#ef4444' : '#10b981',
            padding: 12, fontFamily: 'monospace', fontSize: '0.85rem',
            whiteSpace: 'pre-wrap', borderTop: '1px solid #334155',
            minHeight: 40, maxHeight: 200, overflow: 'auto'
          }}>
            {status && <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: 4 }}>{status}</div>}
            {output || '(等待运行)'}
          </div>
        )}
      </div>
    </div>
  );
}
```

### 3.2 改造 `LessonContent.jsx`

把现有 `CodeExample` 组件替换为：

```jsx
import RunnableCodeBlock from './RunnableCodeBlock';

function CodeExample({ example, lessonId }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={styles.codeTitle}>💻 {example.title}</h3>
      <RunnableCodeBlock
        code={example.code}
        lessonId={lessonId}
        compact={false}
      />
    </div>
  );
}
```

并在 `LessonContent` 调用处传入 `lessonId`：
```jsx
{lesson.codeExamples.map((example, i) => (
  <CodeExample key={i} example={example} lessonId={lessonId} />
))}
```

### 3.3 重构 `CodeEditor.jsx`（复用）

```jsx
import RunnableCodeBlock from './RunnableCodeBlock';

export default function CodeEditor({ lessonId, onBack, initialCode }) {
  return (
    <div>
      <button onClick={onBack}>← 返回课程</button>
      <h2>💻 代码练习 - {lessonId}</h2>
      <RunnableCodeBlock
        code={initialCode || '# 在这里输入 Python 代码\nprint("Hello")\n'}
        lessonId={lessonId}
        compact={false}
      />
    </div>
  );
}
```

---

## 4. 实施步骤

### Step 1: 创建 `RunnableCodeBlock.jsx`
- 文件路径：`src/components/RunnableCodeBlock.jsx`
- 内容：上面 §3.1 完整代码
- 验证：`grep -c "runPython" src/components/RunnableCodeBlock.jsx` → 1

### Step 2: 修改 `LessonContent.jsx`
- 替换 `CodeExample` 函数
- 添加 `import RunnableCodeBlock from './RunnableCodeBlock'`
- 在渲染 `lesson.codeExamples` 时传入 `lessonId`

### Step 3: 简化 `CodeEditor.jsx`
- 删除现有 Pyodide 相关代码（保留 React 框架）
- 引入 `RunnableCodeBlock` 直接使用

### Step 4: 验证
```bash
npx vite build 2>&1 | tail -3
lsof -ti:3000 | xargs kill -9 2>/dev/null
sleep 1
nohup npx vite preview --port 3000 --host > /tmp/vite.log 2>&1 &
sleep 3

# 访问课程，验证「运行」按钮可见
CHROME=/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome
$CHROME --headless --disable-gpu --no-sandbox --window-size=1280,4000 \
  --screenshot=/tmp/l01_with_run.png --virtual-time-budget=8000 \
  http://localhost:3000/lesson/L01 2>&1 | tail -1

# 检查页面是否有"运行"按钮文本
$CHROME --headless --disable-gpu --no-sandbox \
  --dump-dom --virtual-time-budget=8000 \
  http://localhost:3000/lesson/L01 2>/dev/null | grep -c "运行"
# 期望：≥ 4 (每个 codeExample 一个)
```

---

## 5. 验收标准

- [ ] L01 课程详情页有 ≥ 4 个"运行"按钮
- [ ] 点击运行按钮，Pyodide 加载代码，输出显示
- [ ] `npx vite build` 无错
- [ ] 24 课全部使用新组件，代码块可运行
- [ ] 编辑器（/editor/:id）仍可正常工作

---

## 6. 风险与降级

| 风险 | 降级 |
|------|------|
| Pyodide 加载慢（首次 10MB） | 显示"首次加载约需 10 秒"提示 |
| 多代码块同时运行 | Worker 串行队列，单 Worker 复用 |
| 代码执行错误 | 显示 traceback，红色边框 |
| Browser 不支持 WebWorker | 检测后降级到主线程（带警告）|