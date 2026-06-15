import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LESSONS, IMAGE_MAP } from '../data/lessons_new';

const styles = {
  wrapper: {
    maxWidth: 880,
    margin: '0 auto',
    padding: '28px 20px 40px',
  },
  backBtn: {
    background: 'linear-gradient(135deg, #4F46E5 0%, #6366f1 100%)',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 10,
    cursor: 'pointer',
    marginBottom: 24,
    fontSize: '0.9rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontWeight: 600,
    boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)',
    transition: 'all 0.2s ease',
  },
  card: {
    background: 'white',
    borderRadius: 18,
    padding: '36px 40px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
    border: '1px solid #e8edf4',
    marginBottom: 24,
  },
  weekBadge: {
    background: 'linear-gradient(135deg, #4F46E5 0%, #6366f1 100%)',
    color: 'white',
    padding: '6px 14px',
    borderRadius: 8,
    fontSize: '0.82rem',
    fontWeight: 700,
    marginRight: 12,
    letterSpacing: '0.02em',
    boxShadow: '0 2px 6px rgba(79, 70, 229, 0.25)',
  },
  weekLabel: {
    color: '#64748b',
    fontSize: '0.88rem',
    fontWeight: 500,
  },
  title: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#0f172a',
    marginBottom: 18,
    marginTop: 14,
    lineHeight: 1.3,
    letterSpacing: '-0.02em',
  },
  tagList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 28,
  },
  tag: {
    background: '#f1f5f9',
    padding: '5px 12px',
    borderRadius: 6,
    fontSize: '0.78rem',
    color: '#64748b',
    fontWeight: 500,
    letterSpacing: '0.01em',
  },
  imageBanner: {
    width: '100%',
    height: 'auto',
    maxHeight: 340,
    borderRadius: 14,
    marginBottom: 28,
    display: 'block',
    border: '1px solid #e2e8f0',
    objectFit: 'contain',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#4F46E5',
    marginBottom: 16,
    marginTop: 32,
    paddingBottom: 10,
    borderBottom: '2px solid #e2e8f0',
    display: 'inline-block',
    letterSpacing: '-0.01em',
  },
  contentText: {
    color: '#334155',
    lineHeight: 1.9,
    fontSize: '1rem',
    marginBottom: 14,
    letterSpacing: '0.01em',
  },
  actionRow: {
    display: 'flex',
    gap: 14,
    marginBottom: 32,
  },
  actionBtn: {
    flex: 1,
    border: 'none',
    padding: '16px 24px',
    borderRadius: 12,
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    transition: 'all 0.25s ease',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: 18,
    fontSize: '0.92rem',
    borderRadius: 10,
    overflow: 'hidden',
  },
  th: {
    background: '#f1f5f9',
    padding: '12px 16px',
    textAlign: 'left',
    fontWeight: 700,
    color: '#334155',
    borderBottom: '2px solid #e2e8f0',
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #f1f5f9',
    color: '#475569',
  },
  codeBlock: {
    background: '#1e293b',
    borderRadius: 12,
    padding: '20px 24px',
    marginBottom: 24,
    overflow: 'auto',
    fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
    fontSize: '0.85rem',
    lineHeight: 1.7,
    color: '#e2e8f0',
    whiteSpace: 'pre',
    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)',
  },
  codeTitle: {
    color: '#7dd3fc',
    fontWeight: 600,
    marginBottom: 12,
    fontSize: '0.88rem',
    letterSpacing: '0.01em',
  },
  objectiveItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
    color: '#334155',
    lineHeight: 1.75,
    fontSize: '0.95rem',
  },
  bullet: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4F46E5 0%, #6366f1 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.72rem',
    fontWeight: 700,
    flexShrink: 0,
    marginTop: 2,
    boxShadow: '0 2px 6px rgba(79, 70, 229, 0.3)',
  },
  exerciseItem: {
    background: '#fef3c7',
    borderLeft: '5px solid #f59e0b',
    borderRadius: '0 10px 10px 0',
    padding: '16px 20px',
    marginBottom: 14,
    color: '#78350f',
    lineHeight: 1.8,
    fontSize: '0.92rem',
  },
  exerciseQ: {
    fontWeight: 700,
    marginBottom: 6,
    fontSize: '0.95rem',
  },
  refItem: {
    color: '#475569',
    padding: '10px 0',
    borderBottom: '1px solid #f1f5f9',
    fontSize: '0.9rem',
    lineHeight: 1.65,
  },
  sectionDivider: {
    borderTop: '1px dashed #e2e8f0',
    margin: '32px 0',
  },
  imageInline: {
    maxWidth: '100%',
    borderRadius: 10,
    margin: '18px 0',
    display: 'block',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  highlightBox: {
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: 12,
    padding: '16px 20px',
    marginBottom: 18,
    color: '#1e40af',
    lineHeight: 1.8,
    fontSize: '0.92rem',
  },
};

function ObjectiveList({ objectives }) {
  return (
    <div style={{ marginBottom: 8 }}>
      {objectives.map((obj, i) => (
        <div key={i} style={styles.objectiveItem}>
          <span style={styles.bullet}>{i + 1}</span>
          <span>{obj}</span>
        </div>
      ))}
    </div>
  );
}

// 简易 Markdown 转 HTML（不依赖第三方库）
function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderMarkdown(md) {
  if (!md) return '';
  // 1. 提取代码块（```lang\n...\n```），用占位符保护
  const codeBlocks = [];
  let processed = md.replace(/```(\w*)\n([\s\S]*?)```/g, (m, lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push({ lang: lang || 'text', code: code.replace(/\n$/, '') });
    return `\n\n__CODE_BLOCK_${idx}__\n\n`;
  });

  // 2. HTML 转义剩余文本（避免 XSS）
  processed = escapeHtml(processed);

  // 3. 处理行内格式 + arxiv 链接 + Lxx 交叉引用
  processed = processed
    .replace(/`([^`\n]+)`/g, '<code style="background:#f1f5f9;padding:2px 6px;border-radius:3px;font-family:monospace;color:#be185d;">$1</code>')
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>')
    // arxiv 链接：[arxiv:1706.03762] → 可点击
    .replace(/\[arxiv:(\d{4}\.\d{4,5})\]/g, '<a href="https://arxiv.org/abs/$1" target="_blank" rel="noopener noreferrer" style="color:#4F46E5;text-decoration:underline;font-weight:500;">[arxiv:$1]</a>')
    // Lxx 交叉引用：参见 L17 / L18 → 可点击
    .replace(/(参见\s*)(L\d{2})/g, '$1<a href="/lesson/$2" style="color:#4F46E5;text-decoration:underline;font-weight:500;">$2</a>')
    // 独立 Lxx 也可点击（避免误匹配：仅匹配 "参见" 后面）
    .replace(/([\s，：、。])(L\d{2})(?=[\s的在中与之])/g, '$1<a href="/lesson/$2" style="color:#4F46E5;text-decoration:underline;font-weight:500;">$2</a>');

  // 4. 处理标题（###、####）
  processed = processed.replace(/^### (.+)$/gm, '<h4 style="font-size:1.05rem;font-weight:700;color:#1e293b;margin:18px 0 8px;">$1</h4>');
  processed = processed.replace(/^#### (.+)$/gm, '<h5 style="font-size:0.98rem;font-weight:700;color:#334155;margin:14px 0 6px;">$1</h5>');

  // 5. 处理列表（- 或 *）
  processed = processed.replace(/^[\-\*] (.+)$/gm, '<li style="margin:4px 0;list-style:none;">• $1</li>');
  processed = processed.replace(/(<li[^>]*>.*<\/li>\n?)+/g, (m) => `<ul style="padding-left:8px;margin:8px 0;">${m}</ul>`);

  // 6. 处理表格（简单的 | col | col |）
  processed = processed.replace(/^(\|.+\|)\n^(\|[\s\-:|]+\|)\n((?:\|.+\|\n?)+)/gm, (m, header, sep, rows) => {
    const heads = header.split('|').slice(1, -1).map(h => `<th style="background:#f1f5f9;padding:8px 12px;border:1px solid #e2e8f0;text-align:left;font-weight:600;">${h.trim()}</th>`).join('');
    const bodyRows = rows.trim().split('\n').map(row => {
      const cells = row.split('|').slice(1, -1).map(c => `<td style="padding:8px 12px;border:1px solid #e2e8f0;">${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `<table style="width:100%;border-collapse:collapse;margin:12px 0;font-size:0.9rem;"><thead><tr>${heads}</tr></thead><tbody>${bodyRows}</tbody></table>`;
  });

  // 7. 段落分隔（双换行）
  processed = processed.split(/\n\n+/).map(p => {
    if (p.startsWith('__CODE_BLOCK_')) return p;
    if (p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<table')) return p;
    return `<p style="margin:8px 0;line-height:1.85;">${p.replace(/\n/g, '<br>')}</p>`;
  }).join('\n');

  // 8. 还原代码块为渲染好的 <pre>
  processed = processed.replace(/__CODE_BLOCK_(\d+)__/g, (m, idx) => {
    const cb = codeBlocks[parseInt(idx, 10)];
    const escapedCode = escapeHtml(cb.code);
    return `<pre style="background:#1e293b;color:#e2e8f0;padding:16px 20px;border-radius:10px;overflow:auto;font-family:'Fira Code',Consolas,monospace;font-size:0.85rem;line-height:1.6;margin:12px 0;box-shadow:inset 0 2px 8px rgba(0,0,0,0.2);"><code>${escapedCode}</code></pre>`;
  });

  return processed;
}

function ContentSection({ section }) {
  const content = section.content || '';
  // 检测是否需要保留 HTML（兼容旧数据）
  const hasTable = content.includes('<table');
  const hasPre = content.includes('<pre');
  const hasImg = content.includes('<img');

  const html = hasTable || hasPre || hasImg ? content : renderMarkdown(content);

  return (
    <div style={{ marginBottom: 8 }}>
      <h3 style={styles.sectionTitle}>{section.title}</h3>
      <div
        style={{ ...styles.contentText, whiteSpace: 'normal' }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

function CodeExample({ example }) {
  const [copied, setCopied] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(example.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const lines = example.code.split('\n');
  const isLong = lines.length > 15;
  const displayCode = isLong && !expanded ? lines.slice(0, 15).join('\n') + '\n// ... (展开查看全部)' : example.code;

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={styles.codeTitle}>💻 {example.title}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                background: expanded ? '#6366f1' : '#4F46E5',
                color: 'white',
                border: 'none',
                padding: '4px 12px',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: '0.75rem',
              }}
            >
              {expanded ? '▲ 收起' : '▼ 展开'}
            </button>
          )}
          <button
            onClick={handleCopy}
            style={{
              background: copied ? '#10B981' : '#374151',
              color: 'white',
              border: 'none',
              padding: '4px 12px',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: '0.75rem',
              transition: 'background 0.2s',
            }}
          >
            {copied ? '✓ 已复制' : '📋 复制'}
          </button>
        </div>
      </div>
      <pre style={{ ...styles.codeBlock, position: 'relative' }}>
        <code>{displayCode}</code>
      </pre>
    </div>
  );
}

function ExerciseSection({ exercises }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={styles.sectionTitle}>📝 练习题</h3>
      {exercises.map((ex, i) => (
        <div key={i} style={styles.exerciseItem}>
          <div style={styles.exerciseQ}>Q{i + 1}. {ex.q}</div>
        </div>
      ))}
    </div>
  );
}

function ReferenceSection({ references }) {
  return (
    <div>
      <h3 style={styles.sectionTitle}>📚 延伸阅读</h3>
      {references.map((ref, i) => {
        // Support string refs and structured refs (name/title/url)
        if (typeof ref === 'string') {
          return <div key={i} style={styles.refItem}>📖 {ref}</div>;
        }
        const title = ref.title || ref.name || '参考资源';
        const url = ref.url || ref.link;
        const typeLabel = ref.type === 'paper' ? '📄' : ref.type === 'github' ? '💻' : ref.type === 'video' ? '🎥' : ref.type === 'course' ? '🎓' : ref.type === 'documentation' ? '📘' : ref.type === 'book' ? '📕' : '🔗';
        return (
          <div key={i} style={styles.refItem}>
            <span style={{ marginRight: 6 }}>{typeLabel}</span>
            {url ? (
              <a href={url} target="_blank" rel="noopener noreferrer" style={{color: '#4F46E5', textDecoration: 'none', fontWeight: 600}}>
                {title}
              </a>
            ) : (
              <span style={{ color: '#334155', fontWeight: 600 }}>{title}</span>
            )}
            {ref.authors && <span style={{ color: '#94a3b8', marginLeft: 6 }}>— {ref.authors}</span>}
            {ref.description && <span style={{ color: '#64748b', marginLeft: 8, fontSize: '0.85rem' }}>{ref.description}</span>}
          </div>
        );
      })}
    </div>
  );
}

export default function LessonContent({ lessonId }) {
  const navigate = useNavigate();
  const lesson = LESSONS[lessonId];

  // Lesson completion state using localStorage
  const [completed, setCompleted] = React.useState(() => {
    try {
      const saved = localStorage.getItem(`lesson-completed-${lessonId}`);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const toggleCompletion = () => {
    const newValue = !completed;
    setCompleted(newValue);
    try {
      localStorage.setItem(`lesson-completed-${lessonId}`, String(newValue));
    } catch {}
  };

  if (!lesson) {
    return (
      <div style={styles.wrapper}>
        <button style={styles.backBtn} onClick={() => navigate('/')}>← 返回课程列表</button>
        <div style={styles.card}>
          <h2 style={{ color: '#ef4444' }}>课程 {lessonId} 未找到</h2>
          <p style={{ color: '#64748b' }}>该课程内容正在开发中。</p>
        </div>
      </div>
    );
  }

  const image = lesson.image || IMAGE_MAP[lessonId];

  return (
    <div style={styles.wrapper}>
      <button style={styles.backBtn} onClick={() => navigate('/')}>← 返回课程列表</button>

      <div style={styles.card}>
        {/* Header */}
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={styles.weekBadge}>{lesson.id}</span>
          <span style={styles.weekLabel}>{lesson.week}</span>
          <button
            onClick={toggleCompletion}
            style={{
              marginLeft: 'auto',
              background: completed ? '#10B981' : 'transparent',
              border: `2px solid ${completed ? '#10B981' : '#cbd5e1'}`,
              borderRadius: 8,
              padding: '6px 14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.85rem',
              fontWeight: 600,
              color: completed ? 'white' : '#64748b',
              transition: 'all 0.2s ease',
            }}
          >
            <span style={{ fontSize: '1rem' }}>{completed ? '✓' : '○'}</span>
            <span>{completed ? '已完成' : '标记完成'}</span>
          </button>
        </div>
        <h1 style={styles.title}>{lesson.title}</h1>

        {/* Tags */}
        {lesson.tags && lesson.tags.length > 0 && (
          <div style={styles.tagList}>
            {lesson.tags.map(tag => (
              <span key={tag} style={styles.tag}>{tag}</span>
            ))}
          </div>
        )}

        {/* Hero Image */}
        {image && (
          <img src={image} alt={lesson.title} style={styles.imageBanner} />
        )}

        {/* Action Buttons */}
        <div style={styles.actionRow}>
          <button
            style={{ ...styles.actionBtn, background: '#10B981', color: 'white' }}
            onClick={() => navigate(`/editor/${lessonId}`)}
          >
            💻 代码练习
          </button>
          <button
            style={{ ...styles.actionBtn, background: '#F59E0B', color: 'white' }}
            onClick={() => navigate(`/quiz/${lessonId}`)}
          >
            📝 开始测验
          </button>
        </div>

        {/* 学习目标 */}
        {lesson.objectives && lesson.objectives.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h3 style={styles.sectionTitle}>🎯 学习目标</h3>
            <ObjectiveList objectives={lesson.objectives} />
          </div>
        )}
      </div>

      {/* 核心知识点 */}
      {lesson.sections && lesson.sections.length > 0 && (
        <div style={styles.card}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e293b', marginBottom: 20 }}>
            📖 核心知识点
          </h2>
          {lesson.sections.map((section, i) => (
            <ContentSection key={i} section={section} />
          ))}
        </div>
      )}

      {/* 代码示例 */}
      {lesson.codeExamples && lesson.codeExamples.length > 0 && (
        <div style={styles.card}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e293b', marginBottom: 20 }}>
            💻 代码示例
          </h2>
          {lesson.codeExamples.map((example, i) => (
            <CodeExample key={i} example={example} />
          ))}
        </div>
      )}

      {/* 练习题 */}
      {lesson.exercises && lesson.exercises.length > 0 && (
        <div style={styles.card}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e293b', marginBottom: 20 }}>
            📝 练习题
          </h2>
          <ExerciseSection exercises={lesson.exercises} />
        </div>
      )}

      {/* 延伸阅读 */}
      {lesson.references && lesson.references.length > 0 && (
        <div style={styles.card}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1e293b', marginBottom: 20 }}>
            📚 延伸阅读资源
          </h2>
          <ReferenceSection references={lesson.references} />
        </div>
      )}
    </div>
  );
}