/**
 * RAG Builder v1.0 - 文档上传生成 RAG demo
 * 支持多文档上传、持久化存储、索引管理、API集成
 */
import React, { useState, useEffect } from 'react';

const chunkText = (text, chunkSize = 500, overlap = 50) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    chunks.push(text.slice(i, i + chunkSize));
    if (i + chunkSize >= text.length) break;
  }
  return chunks;
};

const embedChunk = async (chunk, index) => {
  await new Promise(r => setTimeout(r, 100));
  const vector = new Array(384).fill(0).map((_, i) => Math.sin(index * 100 + i) * 0.1);
  return { chunk, vector, index };
};

const cosineSimilarity = (a, b) => {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-8);
};

const DEFAULT_KNOWLEDGE = [
  { chunk: "机器学习是人工智能的一个分支，通过算法让计算机从数据中学习", vector: Array(384).fill(0).map((_, i) => Math.sin(i) * 0.1) },
  { chunk: "深度学习是机器学习的子领域，使用多层神经网络", vector: Array(384).fill(0).map((_, i) => Math.sin(i + 1) * 0.1) },
  { chunk: "Transformer模型是NLP的核心架构，Attention机制是其关键", vector: Array(384).fill(0).map((_, i) => Math.sin(i + 2) * 0.1) },
  { chunk: "RAG检索增强生成，结合向量检索和LLM生成", vector: Array(384).fill(0).map((_, i) => Math.sin(i + 3) * 0.1) },
  { chunk: "LangChain是构建LLM应用的框架", vector: Array(384).fill(0).map((_, i) => Math.sin(i + 4) * 0.1) },
];

export default function RAGBuilder() {
  const [text, setText] = useState('');
  const [chunks, setChunks] = useState([]);
  const [embeddings, setEmbeddings] = useState([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(0);
  const [indices, setIndices] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rag-indices') || '[]'); }
    catch { return []; }
  });
  const [apiSettings, setApiSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rag-api-settings') || '{}'); }
    catch { return {}; }
  });
  const [currentDoc, setCurrentDoc] = useState(null);

  useEffect(() => {
    localStorage.setItem('rag-indices', JSON.stringify(indices));
  }, [indices]);

  const saveApiSettings = (settings) => {
    setApiSettings(settings);
    localStorage.setItem('rag-api-settings', JSON.stringify(settings));
  };

  const processDocument = async () => {
    if (!text.trim()) return;
    setIsProcessing(true);
    setStep(1);
    const textChunks = chunkText(text);
    setChunks(textChunks);
    await new Promise(r => setTimeout(r, 300));
    setStep(2);
    const embedded = await Promise.all(textChunks.map((c, i) => embedChunk(c, i)));
    setEmbeddings(embedded);
    await new Promise(r => setTimeout(r, 300));
    setStep(3);
    setIsProcessing(false);
  };

  const saveAsIndex = () => {
    if (embeddings.length === 0) return;
    const name = prompt('输入索引名称:', '索引' + (indices.length + 1));
    if (!name) return;
    const newIndex = { id: Date.now(), name, chunks, embeddings, createdAt: new Date().toISOString() };
    setIndices([...indices, newIndex]);
  };

  const loadIndex = (idx) => {
    setCurrentDoc(idx);
    setChunks(idx.chunks);
    setEmbeddings(idx.embeddings);
    setStep(3);
  };

  const deleteIndex = (id) => {
    setIndices(indices.filter(i => i.id !== id));
    if (currentDoc?.id === id) { setCurrentDoc(null); setChunks([]); setEmbeddings([]); setStep(0); }
  };

  const search = async () => {
    if (!query.trim() || embeddings.length === 0) return;
    const queryEmbed = await embedChunk(query, 0);
    const scored = embeddings.map(e => ({ ...e, score: cosineSimilarity(queryEmbed.vector, e.vector) })).sort((a, b) => b.score - a.score).slice(0, 5);
    setResults(scored);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => { setText(prev => prev + '\n\n' + event.target.result); };
      if (file.name.endsWith('.txt') || file.name.endsWith('.md')) reader.readAsText(file);
    });
  };

  const loadDefaultKnowledge = () => {
    setChunks(DEFAULT_KNOWLEDGE.map(d => d.chunk));
    setEmbeddings(DEFAULT_KNOWLEDGE);
    setStep(3);
  };

  return (
    <div style={{ padding: 16, maxWidth: 1200, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 16 }}>RAG Builder v1.0</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <div style={{ marginBottom: 16, padding: 12, background: '#fff7ed', borderRadius: 8, border: '1px solid #fed7aa' }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: 8 }}>API 设置</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <input type="password" placeholder="OpenAI API Key" value={apiSettings.openai || ''} onChange={(e) => saveApiSettings({ ...apiSettings, openai: e.target.value })} style={{ padding: '6px 8px', borderRadius: 4, border: '1px solid #e2e8f0', fontSize: '0.8rem' }} />
              <input type="password" placeholder="DeepSeek API Key" value={apiSettings.deepseek || ''} onChange={(e) => saveApiSettings({ ...apiSettings, deepseek: e.target.value })} style={{ padding: '6px 8px', borderRadius: 4, border: '1px solid #e2e8f0', fontSize: '0.8rem' }} />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: 8 }}>索引管理 ({indices.length})</h3>
            <div style={{ maxHeight: 100, overflow: 'auto', marginBottom: 8 }}>
              {indices.length === 0 && <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>暂无保存的索引</div>}
              {indices.map(idx => (
                <div key={idx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', marginBottom: 4, background: currentDoc?.id === idx.id ? '#e0e7ff' : '#f1f5f9', borderRadius: 4 }}>
                  <span style={{ fontSize: '0.8rem', cursor: 'pointer' }} onClick={() => loadIndex(idx)}>{idx.name}</span>
                  <button onClick={() => deleteIndex(idx.id)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}>删除</button>
                </div>
              ))}
            </div>
            <button onClick={loadDefaultKnowledge} style={{ padding: '6px 12px', background: '#f1f5f9', border: 'none', borderRadius: 4, fontSize: '0.8rem', cursor: 'pointer', marginRight: 8 }}>加载默认知识库</button>
            <button onClick={saveAsIndex} disabled={embeddings.length === 0} style={{ padding: '6px 12px', background: embeddings.length === 0 ? '#f1f5f9' : '#4F46E5', color: embeddings.length === 0 ? '#94a3b8' : 'white', border: 'none', borderRadius: 4, fontSize: '0.8rem', cursor: embeddings.length === 0 ? 'not-allowed' : 'pointer' }}>保存索引</button>
          </div>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: 8 }}>Step 1: 输入文档</h3>
            <input type="file" multiple onChange={handleFileUpload} accept=".txt,.md" style={{ marginBottom: 8, fontSize: '0.8rem' }} />
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="粘贴要检索的文档内容，或上传文件..." style={{ width: '100%', height: 150, padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem', fontFamily: 'monospace', resize: 'vertical' }} />
            <div style={{ marginTop: 8, fontSize: '0.8rem', color: '#64748b' }}>字符数: {text.length} | 预计分块: {chunkText(text).length}</div>
          </div>
          <button onClick={processDocument} disabled={isProcessing || !text.trim()} style={{ width: '100%', marginBottom: 16, padding: '12px 16px', background: isProcessing ? '#94a3b8' : '#4F46E5', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: isProcessing ? 'not-allowed' : 'pointer' }}>
            {isProcessing ? '处理中...' : '处理文档'}
          </button>
          {step > 0 && <div style={{ display: 'flex', gap: 8, fontSize: '0.8rem' }}><span style={{ color: step >= 1 ? '#22c55e' : '#94a3b8' }}>✓ 分块</span><span style={{ color: step >= 2 ? '#22c55e' : '#94a3b8' }}>✓ 嵌入</span><span style={{ color: step >= 3 ? '#22c55e' : '#94a3b8' }}>✓ 就绪</span></div>}
        </div>
        <div>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: '0.9rem', marginBottom: 8 }}>Step 2: 查询</h3>
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="输入查询问题..." style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.9rem' }} />
            <button onClick={search} disabled={step < 3 || !query.trim()} style={{ width: '100%', marginTop: 12, padding: '10px 16px', background: step < 3 ? '#94a3b8' : '#22c55e', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: step < 3 ? 'not-allowed' : 'pointer' }}>搜索</button>
          </div>
          {results.length > 0 && <div><h4 style={{ fontSize: '0.85rem', marginBottom: 8 }}>Top {results.length} 结果</h4>{results.map((r, i) => <div key={i} style={{ padding: 12, marginBottom: 8, background: '#f8fafc', borderRadius: 8, fontSize: '0.8rem' }}><div style={{ color: '#4F46E5', fontWeight: 600, marginBottom: 4 }}>#{i + 1} 相似度: {(r.score * 100).toFixed(1)}%</div><div style={{ color: '#334155' }}>{r.chunk}</div></div>)}</div>}
        </div>
      </div>
      {chunks.length > 0 && <div style={{ marginTop: 24 }}><h3 style={{ fontSize: '0.9rem', marginBottom: 8 }}>文档分块预览 ({chunks.length}块)</h3><div style={{ maxHeight: 200, overflow: 'auto' }}>{chunks.map((c, i) => <div key={i} style={{ padding: '8px 12px', marginBottom: 4, background: i % 2 === 0 ? '#f1f5f9' : 'white', borderRadius: 4, fontSize: '0.75rem', fontFamily: 'monospace' }}>Block {i + 1}: {c.slice(0, 80)}...</div>)}</div></div>}
    </div>
  );
}

export function RAGBuilderDemo() {
  return <div style={{ padding: 20 }}><h3>RAG Builder v1.0</h3><RAGBuilder /></div>;
}