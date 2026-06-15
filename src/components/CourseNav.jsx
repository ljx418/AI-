import React from 'react';

const styles = {
  header: {
    padding: '20px 40px',
    background: 'var(--card-bg)',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '1.3rem',
    fontWeight: 700,
    color: 'var(--primary)',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '1.2rem',
  },
  navLinks: {
    display: 'flex',
    gap: '8px',
  },
  navLink: (active) => ({
    padding: '8px 16px',
    color: active ? 'white' : 'var(--text)',
    background: active ? 'var(--primary)' : 'transparent',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: 500,
    fontSize: '0.9rem',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s',
  }),
  menuToggle: {
    display: 'none',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '8px',
  },
};

function CourseNav({ currentView, onNavigate }) {
  const navItems = [
    { id: 'list', label: '📋 课程列表' },
    { id: 'editor', label: '💻 代码编辑' },
    { id: 'quiz', label: '📝 测验' },
    { id: 'progress', label: '📊 进度' },
  ];

  return (
    <header style={styles.header}>
      <div style={styles.logo} onClick={() => onNavigate('list')}>
        <span style={styles.logoIcon}>🤖</span>
        <span>AI教案</span>
      </div>

      <nav style={styles.navLinks}>
        {navItems.map((item) => (
          <button
            key={item.id}
            style={styles.navLink(currentView === item.id)}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

export default CourseNav;