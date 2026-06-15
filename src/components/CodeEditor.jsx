import React, { useState } from 'react';

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  header: {
    marginBottom: '24px',
  },
  backButton: {
    background: 'var(--primary)',
    color: 'white',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    marginBottom: '16px',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '16px',
  },
  editorWrapper: {
    background: '#1e1e1e',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  toolbar: {
    background: '#2d2d2d',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #3d3d3d',
  },
  toolbarLeft: {
    display: 'flex',
    gap: '8px',
  },
  toolbarButton: {
    background: '#3d3d3d',
    color: '#ccc',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  status: {
    color: '#888',
    fontSize: '0.85rem',
  },
  editorArea: {
    minHeight: '500px',
    padding: '16px',
    fontFamily: '"Fira Code", "Consolas", monospace',
    fontSize: '14px',
    color: '#d4d4d4',
    lineHeight: 1.6,
    outline: 'none',
  },
  output: {
    background: '#1e1e1e',
    borderTop: '1px solid #3d3d3d',
    padding: '16px',
    fontFamily: '"Fira Code", "Consolas", monospace',
    fontSize: '14px',
  },
  outputLabel: {
    color: '#888',
    marginBottom: '8px',
    fontSize: '0.85rem',
  },
  outputContent: {
    color: '#10b981',
    whiteSpace: 'pre-wrap',
  },
  iframe: {
    width: '100%',
    height: '600px',
    border: 'none',
    background: 'white',
  },
};

function CodeEditor({ lessonId, onBack }) {
  const [code, setCode] = useState(`# Python 代码编辑器
# 当前课程: ${lessonId || 'L1'}

import numpy as np
import pandas as pd

# 示例代码
def greet(name):
    return f"Hello, {name}!"

message = greet("AI学习者")
print(message)

# 尝试修改代码并运行
numbers = [1, 2, 3, 4, 5]
squared = [n ** 2 for n in numbers]
print(f"平方: {squared}")
`);

  const [isRunning, setIsRunning] = useState(false);
  const [showJupyter, setShowJupyter] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 1000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          ← 返回课程内容
        </button>
        <h1 style={styles.title}>💻 JupyterLite 代码编辑器</h1>
      </div>

      {showJupyter ? (
        <div style={styles.editorWrapper}>
          <div style={styles.toolbar}>
            <div style={styles.toolbarLeft}>
              <button style={styles.toolbarButton} onClick={() => setShowJupyter(false)}>
                ← 返回简易编辑器
              </button>
            </div>
            <span style={styles.status}>JupyterLite 运行环境</span>
          </div>
          <iframe
            src="https://jupyterlite.github.io/demo/repl/?toolbar=1"
            style={styles.iframe}
            title="JupyterLite"
          />
        </div>
      ) : (
        <div style={styles.editorWrapper}>
          <div style={styles.toolbar}>
            <div style={styles.toolbarLeft}>
              <button style={styles.toolbarButton} onClick={handleRun}>
                ▶ 运行
              </button>
              <button style={styles.toolbarButton} onClick={() => setShowJupyter(true)}>
                切换到 JupyterLite
              </button>
            </div>
            <span style={styles.status}>
              {isRunning ? '运行中...' : '就绪'} | Python 3.10
            </span>
          </div>
          <textarea
            style={styles.editorArea}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />
          <div style={styles.output}>
            <div style={styles.outputLabel}>输出:</div>
            <div style={styles.outputContent}>
              Hello, AI学习者!
              平方: [1, 4, 9, 16, 25]
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CodeEditor;