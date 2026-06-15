import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const styles = {
  container: {
    maxWidth: '1000px',
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
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '8px',
  },
  badge: {
    background: 'var(--primary)',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '0.85rem',
    display: 'inline-block',
    marginBottom: '16px',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '24px',
  },
  tag: {
    background: '#f1f5f9',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '0.85rem',
  },
  content: {
    background: 'var(--card-bg)',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    lineHeight: 1.8,
  },
  codeBlock: {
    borderRadius: '8px',
    margin: '16px 0',
  },
  actionButtons: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  },
  actionButton: (color) => ({
    background: color,
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 500,
    flex: 1,
  }),
};

function CourseView({ lesson, onBack, onOpenEditor, onOpenQuiz }) {
  // Build content from actual lesson data (not hardcoded sample)
  const content = lesson.content || lesson.sections?.[0]?.content || `# ${lesson.title}\n\n暂无内容`;
  const sectionsMarkdown = lesson.sections?.map(s => `## ${s.title}\n\n${s.content}`).join('\n\n') || '';
  const fullContent = `# ${lesson.title}

## 学习目标
${(lesson.objectives || []).map(o => `- ${o}`).join('\n')}

${sectionsMarkdown}
`;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          ← 返回课程列表
        </button>
        <h1 style={styles.title}>{lesson.title}</h1>
        <span style={styles.badge}>{lesson.id}</span>
        <div style={styles.tags}>
          {lesson.tags.map((tag) => (
            <span key={tag} style={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>

      <div style={styles.content}>
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ borderRadius: '8px', margin: '16px 0' }}
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {fullContent}
        </ReactMarkdown>
      </div>

      <div style={styles.actionButtons}>
        <button style={styles.actionButton('#10B981')} onClick={onOpenEditor}>
          💻 打开代码编辑器
        </button>
        <button style={styles.actionButton('#F59E0B')} onClick={onOpenQuiz}>
          📝 开始测验
        </button>
      </div>
    </div>
  );
}

export default CourseView;