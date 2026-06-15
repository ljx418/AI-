/**
 * Token Counter - 实时显示 token 数量
 * 支持 GPT/Qwen/DeepSeek 等模型的 token 计算
 */
import React, { useState, useMemo, useEffect } from 'react';

// Tokenizer 模拟 (实际项目中应使用 tiktoken 或对应模型的 tokenizer)
const estimateTokens = (text) => {
  if (!text) return 0;
  // 粗略估计: 中文 ~1.5 token/char, 英文 ~0.25 token/char
  const chineseChars = (text.match(/[一-龥]/g) || []).length;
  const otherChars = text.length - chineseChars;
  return Math.ceil(chineseChars * 1.5 + otherChars * 0.25);
};

// 不同模型的 token 限制
const MODEL_LIMITS = {
  'gpt-4': { context: 128000, output: 16384 },
  'gpt-4-turbo': { context: 128000, output: 4096 },
  'gpt-3.5-turbo': { context: 16385, output: 4096 },
  'claude-3': { context: 200000, output: 4096 },
  'claude-3.5': { context: 200000, output: 4096 },
  'qwen-turbo': { context: 32000, output: 8192 },
  'qwen-plus': { context: 130000, output: 8192 },
  'qwen-max': { context: 32000, output: 8192 },
  'deepseek-chat': { context: 64000, output: 8192 },
  'deepseek-coder': { context: 64000, output: 8192 },
  'gemini-pro': { context: 32000, output: 8192 },
  'gemini-ultra': { context: 128000, output: 8192 },
};

export default function TokenCounter({
  text = '',
  model = 'gpt-4',
  onModelChange,
  showModelSelect = true
}) {
  const [selectedModel, setSelectedModel] = useState(model);

  // 计算 token
  const tokenCount = useMemo(() => estimateTokens(text), [text]);

  // 获取模型限制
  const limits = MODEL_LIMITS[selectedModel] || MODEL_LIMITS['gpt-4'];

  // 计算使用百分比
  const usagePercent = Math.min(100, (tokenCount / limits.context) * 100);

  // 成本估算 (粗略)
  const costEstimate = useMemo(() => {
    const rates = {
      'gpt-4': { input: 0.015, output: 0.075 },
      'gpt-4-turbo': { input: 0.01, output: 0.03 },
      'gpt-3.5-turbo': { input: 0.001, output: 0.002 },
      'claude-3': { input: 0.015, output: 0.075 },
      'claude-3.5': { input: 0.003, output: 0.015 },
      'qwen-turbo': { input: 0.0004, output: 0.002 },
      'qwen-plus': { input: 0.001, output: 0.005 },
      'qwen-max': { input: 0.02, output: 0.12 },
      'deepseek-chat': { input: 0.00027, output: 0.0011 },
      'deepseek-coder': { input: 0.00027, output: 0.0011 },
      'gemini-pro': { input: 0.00035, output: 0.00105 },
      'gemini-ultra': { input: 0.00105, output: 0.00315 },
    };
    const rate = rates[selectedModel] || rates['gpt-4'];
    const inputCost = (tokenCount / 1000000) * rate.input;
    const outputCost = (tokenCount / 1000000) * rate.output;
    return (inputCost + outputCost).toFixed(6);
  }, [tokenCount, selectedModel]);

  // 模型变更处理
  const handleModelChange = (e) => {
    const newModel = e.target.value;
    setSelectedModel(newModel);
    onModelChange?.(newModel);
  };

  // 颜色指示
  const getStatusColor = () => {
    if (usagePercent > 90) return '#ef4444'; // 红
    if (usagePercent > 70) return '#f59e0b'; // 黄
    return '#22c55e'; // 绿
  };

  return (
    <div style={{
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: 8,
      padding: '12px 16px',
      fontSize: '0.85rem',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      alignItems: 'center'
    }}>
      {/* 模型选择 */}
      {showModelSelect && (
        <select
          value={selectedModel}
          onChange={handleModelChange}
          style={{
            padding: '6px 10px',
            borderRadius: 6,
            border: '1px solid #e2e8f0',
            background: 'white',
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          {Object.keys(MODEL_LIMITS).map(m => (
            <option key={m} value={m}>{m.toUpperCase()}</option>
          ))}
        </select>
      )}

      {/* Token 数量 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: '#64748b' }}>Token:</span>
        <span style={{
          fontWeight: 600,
          color: getStatusColor(),
          fontFamily: 'monospace'
        }}>
          {tokenCount.toLocaleString()}
        </span>
      </div>

      {/* 进度条 */}
      <div style={{
        flex: 1,
        minWidth: 100,
        maxWidth: 200,
        height: 6,
        background: '#e2e8f0',
        borderRadius: 3,
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${usagePercent}%`,
          height: '100%',
          background: getStatusColor(),
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* 百分比 */}
      <span style={{
        color: getStatusColor(),
        fontSize: '0.75rem',
        minWidth: 45
      }}>
        {usagePercent.toFixed(1)}%
      </span>

      {/* 上下文限制 */}
      <span style={{ color: '#64748b', fontSize: '0.75rem' }}>
        / {limits.context.toLocaleString()}
      </span>

      {/* 成本估算 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        marginLeft: 'auto'
      }}>
        <span style={{ color: '#64748b' }}>≈</span>
        <span style={{
          color: '#22c55e',
          fontFamily: 'monospace',
          fontSize: '0.8rem'
        }}>
          ${costEstimate}
        </span>
      </div>
    </div>
  );
}

// 独立使用示例
export function TokenCounterDemo() {
  const [text, setText] = useState('');

  return (
    <div style={{ padding: 20 }}>
      <h3>Token Counter Demo</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="输入文本测试 token 计数..."
        style={{
          width: '100%',
          height: 100,
          padding: 10,
          borderRadius: 8,
          border: '1px solid #e2e8f0',
          fontSize: '0.9rem',
          marginBottom: 12
        }}
      />
      <TokenCounter text={text} />
    </div>
  );
}