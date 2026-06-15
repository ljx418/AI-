import React from 'react';

// 静态HTML页面包装组件
function StaticPage({ title, src }) {
  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        borderRadius: 12,
        padding: '16px 24px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        <span style={{ color: 'white', fontSize: '1.2rem' }}>📄</span>
        <h1 style={{ color: 'white', fontSize: '1.3rem', margin: 0 }}>{title}</h1>
      </div>
      <iframe
        src={src}
        title={title}
        style={{
          width: '100%',
          height: 'calc(100vh - 180px)',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          background: 'white'
        }}
      />
    </div>
  );
}

export function OutlinePage() {
  return <StaticPage title="📚 AI教材详细课程大纲" src="/static/AI教材详细课程大纲.html" />;
}

export function PlanReportPage() {
  return <StaticPage title="📊 开发计划汇报" src="/static/AI教材开发计划汇报.html" />;
}

export function StandalonePage() {
  return <StaticPage title="🖥️ 独立课件" src="/static/ai-courseware-standalone.html" />;
}

export function JupyterDemoPage() {
  return <StaticPage title="💻 JupyterLite 演示" src="/static/jupyterlite-demo.html" />;
}