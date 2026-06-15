/**
 * Full-Text Search - 基于 Fuse.js 的全文检索
 */
import React, { useState, useMemo, useEffect, useRef } from 'react';

// 内置简化版 Fuse (避免外部依赖)
class SimpleFuse {
  constructor(data, options = {}) {
    this.data = data;
    this.keys = options.keys || ['title', 'content'];
    this.threshold = options.threshold || 0.3;
  }

  search(query) {
    if (!query || query.length < 2) return [];

    const results = [];
    const q = query.toLowerCase();

    for (let i = 0; i < this.data.length; i++) {
      const item = this.data[i];
      let score = 0;
      let matches = [];

      for (const key of this.keys) {
        const value = item[key];
        if (!value) continue;

        const strValue = String(value).toLowerCase();
        const idx = strValue.indexOf(q);

        if (idx !== -1) {
          // 精确匹配得高分
          score += 1;
          matches.push({ key, indices: [[idx, idx + q.length - 1]] });

          // 开头匹配加分
          if (idx === 0) score += 0.5;
          // 单词边界匹配加分
          if (idx > 0 && /[\s,\-,\.]/.test(strValue[idx - 1])) score += 0.3;
        }
      }

      if (score > 0) {
        results.push({
          item,
          score,
          matches
        });
      }
    }

    // 排序
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 20);
  }
}

// 搜索高亮组件
function Highlight({ text, query }) {
  if (!query || !text) return <span>{text}</span>;

  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));

  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} style={{
            background: '#fef08a',
            padding: '0 2px',
            borderRadius: 2
          }}>{part}</mark>
        ) : (
          part
        )
      )}
    </span>
  );
}

export default function Search({
  data = [],
  placeholder = '搜索课程...',
  onResultClick,
  maxResults = 10
}) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Fuse 实例
  const fuse = useMemo(() => new SimpleFuse(data, {
    keys: ['title', 'content', 'tags']
  }), [data]);

  // 搜索结果
  const results = useMemo(() => {
    return query.length >= 2 ? fuse.search(query) : [];
  }, [query, fuse]);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        onResultClick?.(results[selectedIndex].item);
        setIsOpen(false);
        setQuery('');
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onResultClick]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={inputRef} style={{ position: 'relative' }}>
      {/* 搜索输入框 */}
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '10px 14px',
            paddingLeft: 40,
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            fontSize: '0.9rem',
            background: 'white',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
        />
        {/* 搜索图标 */}
        <span style={{
          position: 'absolute',
          left: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#94a3b8'
        }}>🔍</span>

        {/* 清空按钮 */}
        {query && (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94a3b8',
              fontSize: '1rem'
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* 搜索结果 */}
      {isOpen && results.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: 4,
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          maxHeight: 400,
          overflow: 'auto',
          zIndex: 100
        }}>
          {results.slice(0, maxResults).map((result, index) => (
            <div
              key={result.item.id || index}
              onClick={() => {
                onResultClick?.(result.item);
                setIsOpen(false);
                setQuery('');
              }}
              style={{
                padding: '10px 14px',
                cursor: 'pointer',
                borderBottom: '1px solid #f1f5f9',
                background: index === selectedIndex ? '#f8fafc' : 'white',
                transition: 'background 0.15s'
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {/* 标题 */}
              <div style={{
                fontWeight: 500,
                color: '#1e293b',
                marginBottom: 4
              }}>
                <Highlight text={result.item.title} query={query} />
              </div>
              {/* 内容片段 */}
              {result.item.content && (
                <div style={{
                  fontSize: '0.8rem',
                  color: '#64748b',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  <Highlight text={result.item.content.slice(0, 100)} query={query} />
                </div>
              )}
              {/* 标签 */}
              {result.item.tags && (
                <div style={{
                  display: 'flex',
                  gap: 4,
                  marginTop: 6,
                  flexWrap: 'wrap'
                }}>
                  {result.item.tags.slice(0, 3).map(tag => (
                    <span key={tag} style={{
                      fontSize: '0.7rem',
                      padding: '2px 6px',
                      background: '#f1f5f9',
                      borderRadius: 4,
                      color: '#64748b'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* 结果数 */}
          {results.length > maxResults && (
            <div style={{
              padding: '8px 14px',
              fontSize: '0.8rem',
              color: '#64748b',
              textAlign: 'center'
            }}>
              还有 {results.length - maxResults} 条结果...
            </div>
          )}
        </div>
      )}

      {/* 无结果 */}
      {isOpen && query.length >= 2 && results.length === 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: 4,
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: '20px',
          textAlign: 'center',
          color: '#64748b',
          zIndex: 100
        }}>
          未找到相关结果
        </div>
      )}
    </div>
  );
}

// 搜索演示组件
export function SearchDemo() {
  const [lessons] = useState([
    { id: 'L17', title: 'LLM 基础 (GPT/Transformer)', content: 'GPT 模型是基于 Transformer 的自回归语言模型...', tags: ['GPT', 'Transformer'] },
    { id: 'L18', title: 'RAG 与向量数据库', content: 'RAG 是检索增强生成技术...', tags: ['RAG', '向量'] },
    { id: 'L25', title: 'DeepSeek 架构', content: 'DeepSeek V3 是 671B MoE 模型...', tags: ['DeepSeek', 'MoE'] },
    { id: 'L26', title: 'LoRA 微调', content: 'LoRA 是低秩适配器微调...', tags: ['LoRA', '微调'] },
  ]);

  const handleResultClick = (result) => {
    alert(`点击: ${result.title}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>全文搜索 Demo</h3>
      <Search data={lessons} onResultClick={handleResultClick} />
    </div>
  );
}