/**
 * AI Tutor - AI 助教
 * 支持 RAG 问答、代码辅导、学习建议
 */
import React, { useState } from 'react';

// 课程知识库
const KNOWLEDGE_BASE = [
  { topic: 'Python基础', content: 'Python 是一种高级编程语言, 简单易学, 广泛应用于数据分析、机器学习等领域' },
  { topic: '机器学习', content: '机器学习是人工智能的一个分支, 通过算法让计算机从数据中学习' },
  { topic: '深度学习', content: '深度学习是机器学习的子领域, 使用多层神经网络学习数据的层次化表示' },
  { topic: 'Transformer', content: 'Transformer 是 NLP 和 LLM 的核心架构, 注意力机制是其关键' },
  { topic: 'RAG', content: 'RAG 检索增强生成, 结合向量检索和 LLM 生成' },
  { topic: 'LangChain', content: 'LangChain 是构建 LLM 应用的框架, 提供链式调用能力' },
  { topic: 'Agent', content: 'Agent 是能够自主规划和执行任务的 AI 系统' },
  { topic: 'LoRA', content: 'LoRA 是一种参数高效微调技术, 通过低秩矩阵减少训练参数量' },
  { topic: 'PyTorch', content: 'PyTorch 是 Facebook 开发的深度学习框架, 动态图机制便于调试' },
  { topic: 'TensorFlow', content: 'TensorFlow 是 Google 开发的深度学习框架, 生态完善' },
];

// 模拟回答
const mockAnswer = (question) => {
  const q = question.toLowerCase();

  if (q.includes('python') || q.includes('基础')) {
    return 'Python 是一种高级编程语言, 适合初学者。建议从变量、数据类型、控制流开始学习, 然后学习函数和面向对象。推荐教程: 官方文档 + Real Python。';
  }
  if (q.includes('机器学习') || q.includes('ml')) {
    return '机器学习是人工智能的核心技术。建议学习路线: 线性回归 → 逻辑回归 → 决策树 → CNN → Transformer。必备数学: 线性代数、概率统计、微积分。';
  }
  if (q.includes('深度学习') || q.includes('dl') || q.includes('神经网络')) {
    return '深度学习使用多层神经网络学习特征表示。核心概念: 前向传播、反向传播、激活函数、损失函数、优化器。学习资源: CS231n, Fast.ai。';
  }
  if (q.includes('transformer') || q.includes('attention')) {
    return 'Transformer 依赖注意力机制理解序列关系。建议阅读: Attention Is All You Need 论文, 代码实现: Hugging Face Transformers 库。';
  }
  if (q.includes('rag') || q.includes('检索')) {
    return 'RAG = 向量检索 + LLM 生成。开源方案: LangChain, LlamaIndex, 构建知识库流程: 分块 → 向量化 → 存储 → 检索 → 生成。';
  }
  if (q.includes('agent') || q.includes('代理')) {
    return 'Agent 能够自主规划和执行任务。核心组件: 规划、记忆、工具调用、反思。框架: LangChain Agents, AutoGPT, Claude Code。';
  }
  if (q.includes('代码') || q.includes('debug') || q.includes('错误')) {
    return '代码问题诊断建议: 1) 仔细阅读错误信息 2) 使用 print 3) 分块调试 4) 查看文档 5) 搜索 Stack Overflow';
  }
  if (q.includes('学习') || q.includes('入门') || q.includes('建议')) {
    return '学习 AI 建议路线: 1) Python 基础 2) 机器学习入门 3) 深度学习 4) LLM 应用开发 5) Agent 开发。每天 2 小时, 6 个月可达到初级工程师水平。';
  }

  // 默认回答
  return '感谢提问！根据你的问题，我推荐先学习相关基础知识，然后通过项目实践加深理解。建议使用 LangChain 快速构建 AI 应用。';
};

export default function AITutor() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '你好！我是 AI 助教，可以回答课程相关问题、代码辅导、学习建议。请问我 anything!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // 模拟延迟
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 2000));

    const answer = mockAnswer(input);
    const botMsg = { role: 'assistant', content: answer };
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <div style={{ padding: 16, maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 16 }}>AI 助教</h2>

      {/* 对话列表 */}
      <div style={{ height: 400, overflow: 'auto', border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, marginBottom: 16, background: '#f8fafc' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 12
          }}>
            <div style={{
              maxWidth: '70%', padding: '12px 16px', borderRadius: 12,
              background: msg.role === 'user' ? '#4F46E5' : 'white',
              color: msg.role === 'user' ? 'white' : '#1e293b',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>AI 思考中...</div>}
      </div>

      {/* 输入框 */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="输入问题，按回车发送..."
          disabled={isLoading}
          style={{ flex: 1, padding: '12px 16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.95rem' }}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          style={{ padding: '12px 24px', background: isLoading ? '#94a3b8' : '#4F46E5', color: 'white', border: 'none', borderRadius: 8, cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 600 }}
        >
          {isLoading ? '发送中' : '发送'}
        </button>
      </div>

      {/* 功能提示 */}
      <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>💡 可以问我:</span>
        <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '4px 8px', borderRadius: 4 }}>Python 基础</span>
        <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '4px 8px', borderRadius: 4 }}>机器学习</span>
        <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '4px 8px', borderRadius: 4 }}>代码问题</span>
        <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '4px 8px', borderRadius: 4 }}>学习建议</span>
      </div>
    </div>
  );
}

export function AITutorDemo() {
  return <AITutor />;
}
export function AITutorWrapper() {
  return <AITutor />;
}