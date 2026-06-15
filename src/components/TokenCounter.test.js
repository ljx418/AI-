import { describe, it, expect } from 'vitest';

// Token estimation functions (extracted for testing)
const estimateTokens = (text) => {
  if (!text) return 0;
  const chineseChars = (text.match(/[一-鿿]/g) || []).length;
  const otherChars = text.length - chineseChars;
  return Math.ceil(chineseChars * 1.5 + otherChars * 0.25);
};

const estimateCost = (modelId, inputTokens, outputTokens = 0) => {
  const rates = {
    'gpt-4': { input: 0.015, output: 0.075 },
    'gpt-4-turbo': { input: 0.01, output: 0.03 },
    'gpt-3.5-turbo': { input: 0.001, output: 0.002 },
    'claude-3': { input: 0.015, output: 0.075 },
    'claude-3.5': { input: 0.003, output: 0.015 },
    'qwen-turbo': { input: 0.0004, output: 0.002 },
    'qwen-plus': { input: 0.001, output: 0.005 },
    'deepseek-chat': { input: 0.00027, output: 0.0011 },
    'deepseek-coder': { input: 0.00027, output: 0.0011 },
  };
  const rate = rates[modelId] || rates['gpt-4-turbo'];
  return ((inputTokens / 1e6) * rate.input + (outputTokens / 1e6) * rate.output);
};

describe('TokenCounter', () => {
  it('should estimate tokens for Chinese text', () => {
    expect(estimateTokens('你好世界')).toBe(4);
  });

  it('should estimate tokens for English text', () => {
    expect(estimateTokens('hello world')).toBe(2);
  });

  it('should estimate tokens for mixed text', () => {
    const result = estimateTokens('hello你好world世界');
    expect(result).toBeGreaterThan(0);
  });

  it('should estimate tokens for empty string', () => {
    expect(estimateTokens('')).toBe(0);
  });

  it('should calculate cost for GPT-4', () => {
    const cost = estimateCost('gpt-4', 1000, 500);
    expect(cost).toBeGreaterThan(0);
    expect(cost).toBeLessThan(1);
  });

  it('should calculate cost for GPT-3.5', () => {
    const cost = estimateCost('gpt-3.5-turbo', 1000, 500);
    expect(cost).toBeGreaterThan(0);
  });

  it('should calculate cost for DeepSeek', () => {
    const cost = estimateCost('deepseek-chat', 1000, 500);
    expect(cost).toBeLessThan(0.01);
  });
});