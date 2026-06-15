/**
 * Benchmark Runner v1.0 - 基准测试工具
 * 支持自定义评测集、批量评测、报告生成
 */
import React, { useState } from 'react';

// 内置评测集
const BUILTIN_BENCHMARKS = [
  { id: 'gsm8k', name: 'GSM8K', desc: '数学推理', count: 8 },
  { id: 'mmlu', name: 'MMLU', desc: '多任务理解', count: 5 },
  { id: 'humaneval', name: 'HumanEval', desc: '代码生成', count: 5 },
];

// GSM8K 示例
const GSM8K_SAMPLES = [
  { id: 1, question: 'Tom has 5 apples. He gives 2 to Jerry and 1 to Bob. How many apples does Tom have left?', answer: '2' },
  { id: 2, question: 'Lisa has 10 pencils. She buys 3 more packs of pencils, each with 4 pencils. How many pencils does she have now?', answer: '22' },
  { id: 3, question: 'There are 15 birds on a tree. 7 fly away, then 5 more come. How many birds are on the tree now?', answer: '13' },
  { id: 4, question: 'A bakery made 120 muffins. They sold 45 in the morning and 30 in the afternoon. How many muffins are left?', answer: '45' },
  { id: 5, question: 'John has 3 bags with 8 marbles each. How many marbles does John have in total?', answer: '24' },
  { id: 6, question: 'A train travels 60 miles per hour. How far will it travel in 3 hours?', answer: '180' },
  { id: 7, question: 'Sarah bought a book for $12 and a pen for $3. How much did she spend?', answer: '15' },
  { id: 8, question: 'There are 4 boxes with 6 toys each. How many toys in total?', answer: '24' },
];

// 评估函数
const evaluate = (predicted, groundTruth) => {
  const pred = predicted.trim().replace(/[^0-9]/g, '');
  const gt = groundTruth.trim().replace(/[^0-9]/g, '');
  return pred === gt;
};

export default function BenchmarkRunner() {
  // 选中评测集
  const [selectedBenchmark, setSelectedBenchmark] = useState('gsm8k');
  // 自定义评测数据
  const [customData, setCustomData] = useState('');
  // 结果
  const [results, setResults] = useState([]);
  // 运行状态
  const [isRunning, setIsRunning] = useState(false);
  // 进度
  const [progress, setProgress] = useState(0);
  // 批量模式
  const [batchMode, setBatchMode] = useState(false);

  // 运行基准测试
  const runBenchmark = async () => {
    setIsRunning(true);
    setResults([]);
    setProgress(0);

    // 获取测试数据
    let samples = [];
    if (batchMode && customData.trim()) {
      // 解析自定义数据
      const lines = customData.trim().split('\n').filter(l => l.trim());
      samples = lines.map((line, i) => {
        const [question, answer] = line.split('|').map(s => s.trim());
        return { id: i + 1, question, answer: answer || '0' };
      });
    } else {
      samples = GSM8K_SAMPLES;
    }

    const newResults = [];

    for (let i = 0; i < samples.length; i++) {
      const sample = samples[i];

      // 模拟模型推理
      await new Promise(r => setTimeout(r, 500 + Math.random() * 1000));

      // 模拟预测结果（随机正确）
      const predicted = Math.random() > 0.3 ? sample.answer : String(parseInt(sample.answer) + 1);
      const correct = evaluate(predicted, sample.answer);

      newResults.push({
        id: sample.id,
        question: sample.question,
        groundTruth: sample.answer,
        predicted,
        correct
      });

      setProgress(((i + 1) / samples.length) * 100);
    }

    setResults(newResults);
    setIsRunning(false);
  };

  // 计算准确率
  const accuracy = results.length > 0
    ? (results.filter(r => r.correct).length / results.length * 100).toFixed(1)
    : 0;

  // 导出报告
  const exportReport = (format) => {
    let content = '';
    const timestamp = new Date().toISOString();

    if (format === 'json') {
      content = JSON.stringify({
        benchmark: selectedBenchmark,
        timestamp,
        accuracy: Number(accuracy),
        total: results.length,
        correct: results.filter(r => r.correct).length,
        results
      }, null, 2);
    } else if (format === 'markdown') {
      content = `# Benchmark Report\n\n`;
      content += `**Benchmark**: ${selectedBenchmark}\n\n`;
      content += `**Date**: ${timestamp}\n\n`;
      content += `**Accuracy**: ${accuracy}% (${results.filter(r => r.correct).length}/${results.length})\n\n`;
      content += `## Results\n\n`;
      content += `| ID | Question | Answer | Predicted | Correct |\n`;
      content += `|----|----------|--------|-----------|--------|\n`;
      results.forEach(r => {
        content += `| ${r.id} | ${r.question.slice(0, 30)}... | ${r.groundTruth} | ${r.predicted} | ${r.correct ? '✓' : '✗'} |\n`;
      });
    }

    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `benchmark-report.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: 16, maxWidth: 1000, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 16 }}>Benchmark Runner v1.0</h2>

      {/* 评测集选择 */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: '0.9rem', marginBottom: 8 }}>选择评测集</h3>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          {BUILTIN_BENCHMARKS.map(b => (
            <button
              key={b.id}
              onClick={() => { setSelectedBenchmark(b.id); setBatchMode(false); }}
              style={{
                padding: '10px 16px',
                background: selectedBenchmark === b.id && !batchMode ? '#4F46E5' : '#f1f5f9',
                color: selectedBenchmark === b.id && !batchMode ? 'white' : '#334155',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              {b.name} ({b.desc})
            </button>
          ))}
          <button
            onClick={() => setBatchMode(true)}
            style={{
              padding: '10px 16px',
              background: batchMode ? '#4F46E5' : '#f1f5f9',
              color: batchMode ? 'white' : '#334155',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            自定义评测集
          </button>
        </div>
      </div>

      {/* 自定义数据输入 */}
      {batchMode && (
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: '0.9rem', marginBottom: 8 }}>自定义评测数据</h3>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 8 }}>
            格式：每行一个问题，用 | 分隔问题和答案
          </p>
          <textarea
            value={customData}
            onChange={(e) => setCustomData(e.target.value)}
            placeholder="问题|答案&#10;1+1等于几？|2&#10;2+3等于几？|5"
            style={{ width: '100%', height: 100, padding: 8, borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem', fontFamily: 'monospace' }}
          />
        </div>
      )}

      {/* 运行按钮 */}
      <button
        onClick={runBenchmark}
        disabled={isRunning}
        style={{
          width: '100%',
          padding: '14px 16px',
          background: isRunning ? '#94a3b8' : '#22c55e',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          fontSize: '1rem',
          fontWeight: 600,
          cursor: isRunning ? 'not-allowed' : 'pointer',
          marginBottom: 16
        }}
      >
        {isRunning ? `运行中... ${Math.round(progress)}%` : '运行基准测试'}
      </button>

      {/* 进度条 */}
      {isRunning && (
        <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, marginBottom: 16, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #22c55e, #4F46E5)', transition: 'width 0.3s' }} />
        </div>
      )}

      {/* 结果统计 */}
      {results.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, marginBottom: 16 }}>
          <div style={{
            padding: 16,
            background: Number(accuracy) >= 80 ? '#dcfce7' : Number(accuracy) >= 50 ? '#fef3c7' : '#fee2e2',
            borderRadius: 12,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>准确率</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: Number(accuracy) >= 80 ? '#22c55e' : Number(accuracy) >= 50 ? '#f59e0b' : '#ef4444' }}>
              {accuracy}%
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {results.filter(r => r.correct).length}/{results.length} 正确
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={() => exportReport('json')}
              style={{ padding: '10px 16px', background: '#f1f5f9', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem' }}
            >
              导出JSON
            </button>
            <button
              onClick={() => exportReport('markdown')}
              style={{ padding: '10px 16px', background: '#f1f5f9', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem' }}
            >
              导出Markdown
            </button>
          </div>
        </div>
      )}

      {/* 结果详情 */}
      {results.length > 0 && (
        <div>
          <h3 style={{ fontSize: '0.9rem', marginBottom: 12 }}>详细结果</h3>
          {results.map((r, i) => (
            <div key={i} style={{
              padding: 12,
              marginBottom: 8,
              background: r.correct ? '#dcfce7' : '#fee2e2',
              borderRadius: 8,
              fontSize: '0.85rem'
            }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>问题 {r.id}</div>
              <div style={{ color: '#334155', marginBottom: 8 }}>{r.question}</div>
              <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem' }}>
                <span>标准答案: <strong>{r.groundTruth}</strong></span>
                <span>模型预测: <strong>{r.predicted}</strong></span>
                <span style={{ color: r.correct ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                  {r.correct ? '✓ 正确' : '✗ 错误'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function BenchmarkRunnerDemo() {
  return (
    <div style={{ padding: 20 }}>
      <h3>Benchmark Runner v1.0</h3>
      <BenchmarkRunner />
    </div>
  );
}