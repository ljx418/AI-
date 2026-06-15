/**
 * Prompt Playground v1.0 - 多模型对比工具
 * 支持 20+ 模型、参数调优、API密钥管理、历史版本对比、导出
 */
import React, { useState, useMemo, useEffect, useRef } from 'react';

// 支持的模型列表 (20+)
const MODELS = [
  // OpenAI
  { id: 'gpt-4', name: 'GPT-4', color: '#10a37f', maxTokens: 8192, provider: 'OpenAI' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', color: '#10a37f', maxTokens: 4096, provider: 'OpenAI' },
  { id: 'gpt-4o', name: 'GPT-4o', color: '#10a37f', maxTokens: 128000, provider: 'OpenAI' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', color: '#10a37f', maxTokens: 128000, provider: 'OpenAI' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', color: '#10a37f', maxTokens: 4096, provider: 'OpenAI' },
  // Anthropic
  { id: 'claude-3-opus', name: 'Claude 3 Opus', color: '#d97706', maxTokens: 200000, provider: 'Anthropic' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', color: '#d97706', maxTokens: 200000, provider: 'Anthropic' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', color: '#d97706', maxTokens: 200000, provider: 'Anthropic' },
  { id: 'claude-3-5-haiku', name: 'Claude 3.5 Haiku', color: '#d97706', maxTokens: 200000, provider: 'Anthropic' },
  // Qwen
  { id: 'qwen-turbo', name: 'Qwen Turbo', color: '#0050a5', maxTokens: 8192, provider: 'Qwen' },
  { id: 'qwen-plus', name: 'Qwen Plus', color: '#0050a5', maxTokens: 32768, provider: 'Qwen' },
  { id: 'qwen-max', name: 'Qwen Max', color: '#0050a5', maxTokens: 32768, provider: 'Qwen' },
  // DeepSeek
  { id: 'deepseek-chat', name: 'DeepSeek Chat', color: '#2dd4bf', maxTokens: 16384, provider: 'DeepSeek' },
  { id: 'deepseek-coder', name: 'DeepSeek Coder', color: '#2dd4bf', maxTokens: 16384, provider: 'DeepSeek' },
  { id: 'deepseek-v2', name: 'DeepSeek V2', color: '#2dd4bf', maxTokens: 16384, provider: 'DeepSeek' },
  // Gemini
  { id: 'gemini-pro', name: 'Gemini Pro', color: '#4285f4', maxTokens: 32768, provider: 'Google' },
  { id: 'gemini-flash', name: 'Gemini Flash', color: '#4285f4', maxTokens: 1000000, provider: 'Google' },
  // Moonshot
  { id: 'moonshot-v1', name: 'Moonshot V1', color: '#7c3aed', maxTokens: 128000, provider: 'Moonshot' },
  // Zhipu
  { id: 'glm-4', name: 'GLM-4', color: '#22c55e', maxTokens: 128000, provider: 'Zhipu' },
  { id: 'glm-4-flash', name: 'GLM-4 Flash', color: '#22c55e', maxTokens: 128000, provider: 'Zhipu' },
  // Ollama (本地)
  { id: 'ollama-llama3', name: 'Llama 3 (本地)', color: '#6b7280', maxTokens: 8192, provider: 'Ollama' },
  { id: 'ollama-qwen2', name: 'Qwen2 (本地)', color: '#6b7280', maxTokens: 8192, provider: 'Ollama' },
];

// 预设模板
const PRESETS = [
  { id: 'summary', name: '文章摘要', prompt: '请用50字概括以下内容：\n{content}' },
  { id: 'translate', name: '中英翻译', prompt: '请将以下内容翻译成英文：\n{content}' },
  { id: 'code_review', name: '代码审查', prompt: '请审查以下代码并指出问题和改进建议：\n```{language}\n{code}\n```' },
  { id: 'cot', name: 'Chain-of-Thought', prompt: '请逐步思考并回答：\n{question}' },
  { id: 'json_format', name: 'JSON 格式化', prompt: '请将以下内容格式化为 JSON：\n{content}' },
  { id: 'explain_code', name: '代码解释', prompt: '请详细解释以下代码的功能：\n```{language}\n{code}\n```' },
  { id: 'write_test', name: '编写测试', prompt: '请为以下代码编写单元测试：\n```{language}\n{code}\n```' },
  { id: 'refactor', name: '代码重构', prompt: '请重构以下代码，提高可读性和性能：\n```{language}\n{code}\n```' },
];

// Token 估算
const estimateTokens = (text) => {
  if (!text) return 0;
  const chineseChars = (text.match(/[一-鿿]/g) || []).length;
  const otherChars = text.length - chineseChars;
  return Math.ceil(chineseChars * 1.5 + otherChars * 0.25);
};

// 成本估算
const estimateCost = (modelId, inputTokens, outputTokens = 0) => {
  const rates = {
    'gpt-4': { input: 0.015, output: 0.075 },
    'gpt-4-turbo': { input: 0.01, output: 0.03 },
    'gpt-4o': { input: 0.005, output: 0.015 },
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
    'gpt-3.5-turbo': { input: 0.001, output: 0.002 },
    'claude-3-opus': { input: 0.015, output: 0.075 },
    'claude-3-sonnet': { input: 0.003, output: 0.015 },
    'claude-3-5-sonnet': { input: 0.003, output: 0.015 },
    'claude-3-5-haiku': { input: 0.00025, output: 0.00125 },
    'qwen-turbo': { input: 0.0004, output: 0.002 },
    'qwen-plus': { input: 0.001, output: 0.005 },
    'qwen-max': { input: 0.02, output: 0.06 },
    'deepseek-chat': { input: 0.00027, output: 0.0011 },
    'deepseek-coder': { input: 0.00027, output: 0.0011 },
    'deepseek-v2': { input: 0.00027, output: 0.0011 },
    'gemini-pro': { input: 0.00125, output: 0.005 },
    'gemini-flash': { input: 0.000035, output: 0.00014 },
    'moonshot-v1': { input: 0.003, output: 0.015 },
    'glm-4': { input: 0.001, output: 0.005 },
    'glm-4-flash': { input: 0.0001, output: 0.0001 },
    'ollama-llama3': { input: 0, output: 0 },
    'ollama-qwen2': { input: 0, output: 0 },
  };
  const rate = rates[modelId] || { input: 0.001, output: 0.002 };
  return ((inputTokens / 1e6) * rate.input + (outputTokens / 1e6) * rate.output);
};

export default function PromptPlayground() {
  // 模型选择
  const [selectedModels, setSelectedModels] = useState(['gpt-4', 'deepseek-chat']);
  // 系统提示
  const [systemPrompt, setSystemPrompt] = useState('你是一个有帮助的助手。');
  // 用户提示
  const [userPrompt, setUserPrompt] = useState('');
  // 变量
  const [variables, setVariables] = useState({ content: '', code: '', question: '', language: 'python' });
  // 加载状态
  const [isLoading, setIsLoading] = useState(false);
  // 响应
  const [responses, setResponses] = useState({});
  // 当前tab
  const [activeTab, setActiveTab] = useState(0);
  // 历史记录
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('prompt-playground-history') || '[]');
    } catch { return []; }
  });

  // API密钥管理
  const [apiKeys, setApiKeys] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('prompt-playground-apikeys') || '{}');
    } catch { return {}; }
  });

  // 参数设置
  const [params, setParams] = useState({
    temperature: 0.7,
    top_p: 1.0,
    max_tokens: 2048,
  });

  // 保存API密钥
  const saveApiKey = (provider, key) => {
    const newKeys = { ...apiKeys, [provider]: key };
    setApiKeys(newKeys);
    localStorage.setItem('prompt-playground-apikeys', JSON.stringify(newKeys));
  };

  // 参数调整
  const updateParam = (key, value) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  // 变量替换
  const processedPrompt = useMemo(() => {
    let prompt = userPrompt;
    Object.entries(variables).forEach(([key, value]) => {
      prompt = prompt.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    });
    return prompt;
  }, [userPrompt, variables]);

  // 切换模型选择
  const toggleModel = (modelId) => {
    setSelectedModels(prev =>
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  // 应用预设
  const applyPreset = (preset) => {
    setUserPrompt(preset.prompt);
  };

  // 模拟 API 调用（实际项目中需要真实 API）
  const callModel = async (modelId) => {
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1500));

    const mockResponses = {
      'gpt-4': `[GPT-4] 处理中...\n\n分析：${processedPrompt.slice(0, 50)}...\n\n结论：${params.temperature > 0.5 ? '创造性回答' : '确定性回答'}`,
      'deepseek-chat': `[DeepSeek] 收到请求。\n\n回答：${processedPrompt.slice(0, 30)}...需要进一步考虑。\n\n参数：temp=${params.temperature}, top_p=${params.top_p}`,
      'claude-3-5-sonnet': `[Claude 3.5] 处理中...\n\n${processedPrompt.slice(0, 40)}\n\n详细分析如下：`,
      'qwen-plus': `[Qwen Plus] 收到请求。\n\n问题分析：${processedPrompt.slice(0, 50)}\n\n方案建议：`,
      'gemini-flash': `[Gemini Flash] 快速响应...\n\n${processedPrompt.slice(0, 30)}...`,
    };

    return mockResponses[modelId] || `[${modelId}] 响应内容...\n\n当前参数: temperature=${params.temperature}, max_tokens=${params.max_tokens}`;
  };

  // 发送请求
  const handleSubmit = async () => {
    if (!processedPrompt.trim()) return;

    setIsLoading(true);
    setResponses({});
    setActiveTab(0);

    const newResponses = {};
    const startTime = Date.now();

    await Promise.all(selectedModels.map(async (modelId) => {
      try {
        newResponses[modelId] = await callModel(modelId);
      } catch (e) {
        newResponses[modelId] = `Error: ${e.message}`;
      }
    }));

    const elapsed = Date.now() - startTime;
    setResponses(newResponses);
    setIsLoading(false);

    // 保存到历史
    const historyItem = {
      id: Date.now(),
      prompt: processedPrompt,
      models: selectedModels,
      responses: newResponses,
      timestamp: new Date().toISOString(),
      elapsed,
      params: { ...params }
    };
    const newHistory = [historyItem, ...history.slice(0, 19)];
    setHistory(newHistory);
    localStorage.setItem('prompt-playground-history', JSON.stringify(newHistory));
  };

  // 加载历史
  const loadHistory = (item) => {
    setUserPrompt(item.prompt);
    setParams(item.params || { temperature: 0.7, top_p: 1.0, max_tokens: 2048 });
  };

  // 导出功能
  const exportResults = (format) => {
    let content = '';
    if (format === 'json') {
      content = JSON.stringify({
        prompt: processedPrompt,
        params,
        responses
      }, null, 2);
    } else if (format === 'markdown') {
      content = `# Prompt Playground Export\n\n`;
      content += `## Prompt\n${processedPrompt}\n\n`;
      content += `## Parameters\n- temperature: ${params.temperature}\n- top_p: ${params.top_p}\n- max_tokens: ${params.max_tokens}\n\n`;
      content += `## Responses\n`;
      Object.entries(responses).forEach(([model, response]) => {
        content += `\n### ${model}\n${response}\n`;
      });
    }

    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-export.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 计算 token 和成本
  const inputTokens = estimateTokens(systemPrompt + processedPrompt);
  const outputTokens = estimateTokens(Object.values(responses).join(''));

  // 按提供商分组模型
  const modelsByProvider = MODELS.reduce((acc, model) => {
    if (!acc[model.provider]) acc[model.provider] = [];
    acc[model.provider].push(model);
    return acc;
  }, {});

  return (
    <div style={{ padding: 16, maxWidth: 1400, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 16 }}>Prompt Playground v1.0</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* 左侧 */}
        <div>
          {/* 模型市场 */}
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: 8 }}>模型市场 (20+ 模型)</h3>
            <div style={{ maxHeight: 150, overflow: 'auto', border: '1px solid #e2e8f0', borderRadius: 8, padding: 8 }}>
              {Object.entries(modelsByProvider).map(([provider, models]) => (
                <div key={provider} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: 4 }}>{provider}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {models.map(model => (
                      <label key={model.id} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: '0.75rem' }}>
                        <input
                          type="checkbox"
                          checked={selectedModels.includes(model.id)}
                          onChange={() => toggleModel(model.id)}
                        />
                        <span style={{ color: model.color }}>{model.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 参数调优 */}
          <div style={{ marginBottom: 16, padding: 12, background: '#f8fafc', borderRadius: 8 }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: 8 }}>参数调优</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: 4 }}>Temperature: {params.temperature}</label>
                <input
                  type="range"
                  min="0" max="2" step="0.1"
                  value={params.temperature}
                  onChange={(e) => updateParam('temperature', parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: 4 }}>Top P: {params.top_p}</label>
                <input
                  type="range"
                  min="0" max="1" step="0.1"
                  value={params.top_p}
                  onChange={(e) => updateParam('top_p', parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: 4 }}>Max Tokens: {params.max_tokens}</label>
                <input
                  type="number"
                  value={params.max_tokens}
                  onChange={(e) => updateParam('max_tokens', parseInt(e.target.value))}
                  style={{ width: '100%', padding: '4px', borderRadius: 4, border: '1px solid #e2e8f0' }}
                />
              </div>
            </div>
          </div>

          {/* API密钥管理 */}
          <div style={{ marginBottom: 16, padding: 12, background: '#fff7ed', borderRadius: 8, border: '1px solid #fed7aa' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: 8 }}>API 密钥管理</h3>
            {Object.keys(modelsByProvider).map(provider => (
              <div key={provider} style={{ marginBottom: 8 }}>
                <label style={{ fontSize: '0.75rem', display: 'block', marginBottom: 4 }}>{provider} API Key:</label>
                <input
                  type="password"
                  value={apiKeys[provider] || ''}
                  onChange={(e) => saveApiKey(provider, e.target.value)}
                  placeholder={`Enter ${provider} API Key...`}
                  style={{ width: '100%', padding: '6px', borderRadius: 4, border: '1px solid #e2e8f0', fontSize: '0.8rem' }}
                />
              </div>
            ))}
          </div>

          {/* System Prompt */}
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: 8 }}>System Prompt</h3>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="系统提示词..."
              style={{ width: '100%', height: 60, padding: 8, borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem', resize: 'vertical' }}
            />
          </div>

          {/* User Prompt */}
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: 8 }}>User Prompt</h3>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <select
                onChange={(e) => {
                  const preset = PRESETS.find(p => p.id === e.target.value);
                  if (preset) applyPreset(preset);
                }}
                style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #e2e8f0' }}
              >
                <option value="">选择预设模板...</option>
                {PRESETS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="输入 Prompt，可用 {variable} 变量..."
              style={{ width: '100%', height: 120, padding: 8, borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem', fontFamily: 'monospace' }}
            />
          </div>

          {/* 变量填充 */}
          {userPrompt.includes('{') && (
            <div style={{ marginBottom: 16, padding: 12, background: '#f8fafc', borderRadius: 8 }}>
              <h4 style={{ fontSize: '0.85rem', marginBottom: 8 }}>变量填充</h4>
              {Object.keys(variables).map(key => (
                <div key={key} style={{ marginBottom: 8 }}>
                  <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: 4 }}>{`{${key}}`}</label>
                  <input
                    type="text"
                    value={variables[key]}
                    onChange={(e) => setVariables(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={`输入 ${key} 值...`}
                    style={{ width: '100%', padding: '6px 8px', borderRadius: 4, border: '1px solid #e2e8f0', fontSize: '0.8rem' }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Token 统计 */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 16, padding: 12, background: '#f8fafc', borderRadius: 8, fontSize: '0.8rem' }}>
            <div><span style={{ color: '#64748b' }}>输入 Token:</span><span style={{ fontWeight: 600, marginLeft: 8 }}>{inputTokens}</span></div>
            <div><span style={{ color: '#64748b' }}>预计成本:</span><span style={{ fontWeight: 600, marginLeft: 8, color: '#22c55e' }}>${selectedModels.reduce((sum, m) => sum + estimateCost(m, inputTokens), 0).toFixed(4)}</span></div>
          </div>

          {/* 提交按钮 */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !processedPrompt.trim() || selectedModels.length === 0}
              style={{ flex: 1, padding: '12px 16px', background: isLoading ? '#94a3b8' : '#4F46E5', color: 'white', border: 'none', borderRadius: 8, fontSize: '0.9rem', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 600 }}
            >
              {isLoading ? '发送中...' : `发送到 ${selectedModels.length} 个模型`}
            </button>
            <button onClick={() => exportResults('json')} style={{ padding: '12px 16px', background: '#f1f5f9', border: 'none', borderRadius: 8, fontSize: '0.85rem', cursor: 'pointer' }}>导出JSON</button>
            <button onClick={() => exportResults('markdown')} style={{ padding: '12px 16px', background: '#f1f5f9', border: 'none', borderRadius: 8, fontSize: '0.85rem', cursor: 'pointer' }}>导出MD</button>
          </div>
        </div>

        {/* 右侧 */}
        <div>
          {/* Tab 切换 */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 12, borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
            {selectedModels.map((modelId, idx) => {
              const model = MODELS.find(m => m.id === modelId);
              return (
                <button
                  key={modelId}
                  onClick={() => setActiveTab(idx)}
                  style={{
                    padding: '8px 12px',
                    background: activeTab === idx ? model?.color : 'transparent',
                    color: activeTab === idx ? 'white' : '#64748b',
                    border: 'none',
                    borderRadius: '4px 4px 0 0',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  {model?.name || modelId}
                </button>
              );
            })}
          </div>

          {/* 响应内容 */}
          <div style={{ height: 350, overflow: 'auto', padding: 12, background: '#f8fafc', borderRadius: 8, fontSize: '0.85rem', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
            {Object.keys(responses).length === 0 ? (
              <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: 100 }}>选择模型并输入 Prompt 后点击发送</div>
            ) : (
              <div style={{ color: '#1e293b' }}>{responses[selectedModels[activeTab]] || '无响应'}</div>
            )}
          </div>

          {/* 历史记录 */}
          {history.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h4 style={{ fontSize: '0.85rem', marginBottom: 8 }}>历史记录 ({history.length})</h4>
              <div style={{ maxHeight: 150, overflow: 'auto' }}>
                {history.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => loadHistory(item)}
                    style={{
                      padding: '8px',
                      marginBottom: 4,
                      background: '#f1f5f9',
                      borderRadius: 4,
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ color: '#64748b' }}>{item.models?.join(', ')}</span>
                    <span style={{ marginLeft: 8 }}>{item.prompt?.slice(0, 30)}...</span>
                    <span style={{ marginLeft: 8, color: '#94a3b8' }}>{item.elapsed}ms</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function PromptPlaygroundDemo() {
  return (
    <div style={{ padding: 20 }}>
      <h3>Prompt Playground v1.0 Demo</h3>
      <PromptPlayground />
    </div>
  );
}