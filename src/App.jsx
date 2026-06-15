import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import LessonContent from './components/LessonContent';
import CodeEditor from './components/CodeEditor';
import QuizPanel from './components/QuizPanel';
import Progress from "./components/Progress";
import ThemeToggle from "./components/ThemeToggle";
import TokenCounter from "./components/TokenCounter";
import Search from "./components/Search";
import ErrorBook from "./components/ErrorBook";
import PromptPlayground from "./components/PromptPlayground";
import RAGBuilder, { RAGBuilderDemo } from "./components/RAGBuilder";
import KnowledgeGraph, { KnowledgeGraphDemo } from "./components/KnowledgeGraph";
import Leaderboard, { LeaderboardDemo } from "./components/Leaderboard";
import BenchmarkRunner from "./components/BenchmarkRunner";
import AITutor, { AITutorDemo } from "./components/AITutor";
import { OutlinePage, PlanReportPage, StandalonePage, JupyterDemoPage } from './components/StaticPages';
import { LESSONS, WEEK_GROUPS } from './data/lessons_new';

// =============================================================================
// 导航栏
// =============================================================================
function Navigation() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
      padding: '12px 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
          <h1 style={{ fontSize: '1.3rem', margin: 0 }}>🤖 AI教案</h1>
        </Link>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <Link to="/" className={isActive('/') ? 'nav-btn active' : 'nav-btn'}>📚 全部课程</Link>
          <Link to="/outline" className={isActive('/outline') ? 'nav-btn active' : 'nav-btn'}>📋 课程大纲</Link>
          <Link to="/plan" className={isActive('/plan') ? 'nav-btn active' : 'nav-btn'}>📊 开发计划</Link>
          <Link to="/standalone" className={isActive('/standalone') ? 'nav-btn active' : 'nav-btn'}>🖥️ 独立课件</Link>
          <Link to="/progress" className={isActive("/progress")?"nav-btn active":"nav-btn"}>📈 学习进度</Link>
          <Link to="/jupyter" className={isActive('/jupyter') ? 'nav-btn active' : 'nav-btn'}>💻 Jupyter</Link>
          <Link to="/tools/token" className={isActive('/tools/token') ? 'nav-btn active' : 'nav-btn'}>🔢 Token</Link>
          <Link to="/tools/search" className={isActive('/tools/search') ? 'nav-btn active' : 'nav-btn'}>🔍 搜索</Link>
          <Link to="/tools/errors" className={isActive('/tools/errors') ? 'nav-btn active' : 'nav-btn'}>📝 错题本</Link>
          <Link to="/tools/playground" className={isActive('/tools/playground') ? 'nav-btn active' : 'nav-btn'}>🎯 Playground</Link>
          <Link to="/tools/rag" className={isActive('/tools/rag') ? 'nav-btn active' : 'nav-btn'}>📄 RAG</Link>
          <Link to="/tools/knowledge" className={isActive('/tools/knowledge') ? 'nav-btn active' : 'nav-btn'}>🔗 图谱</Link>
          <Link to="/tools/leaderboard" className={isActive('/tools/leaderboard') ? 'nav-btn active' : 'nav-btn'}>🏆 排行</Link>
          <Link to="/tools/benchmark" className={isActive('/tools/benchmark') ? 'nav-btn active' : 'nav-btn'}>📊 Benchmark</Link>
          <Link to="/tools/ai-tutor" className={isActive('/tools/ai-tutor') ? 'nav-btn active' : 'nav-btn'}>🎓 AI助教</Link>
          <ThemeToggle />
        </div>
      </div>
      <style>{`
        .nav-btn {
          background: rgba(255,255,255,0.15);
          color: white;
          padding: 6px 12px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 0.85rem;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .nav-btn:hover, .nav-btn.active {
          background: rgba(255,255,255,0.3);
        }
      `}</style>
    </nav>
  );
}

// =============================================================================
// 页脚
// =============================================================================
function Footer() {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '20px',
      background: '#f8fafc',
      borderTop: '1px solid #e2e8f0',
      marginTop: 40
    }}>
      <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
        <span>AI教案</span>
        <span style={{ margin: '0 10px' }}>|</span>
        <span>面向就业导向的AI系统教材</span>
        <span style={{ margin: '0 10px' }}>|</span>
        <span>2026年6月</span>
      </div>
    </footer>
  );
}

// =============================================================================
// 首页 - 课程列表
// =============================================================================
function HomePage() {
  const navigate = useNavigate();

  // Load completed lessons from localStorage
  const [completedLessons, setCompletedLessons] = React.useState(() => {
    try {
      const completed = new Set();
      for (let i = 1; i <= 24; i++) {
        const key = `lesson-completed-L${String(i).padStart(2, '0')}`;
        if (localStorage.getItem(key) === 'true') {
          completed.add(`L${String(i).padStart(2, '0')}`);
        }
      }
      return completed;
    } catch {
      return new Set();
    }
  });

  // Calculate week progress
  const getWeekProgress = (weekLessons) => {
    const completed = weekLessons.filter(id => completedLessons.has(id)).length;
    return { completed, total: weekLessons.length };
  };

  // Refresh completed lessons when returning to home
  React.useEffect(() => {
    const handleStorage = () => {
      const completed = new Set();
      for (let i = 1; i <= 24; i++) {
        const key = `lesson-completed-L${String(i).padStart(2, '0')}`;
        if (localStorage.getItem(key) === 'true') {
          completed.add(`L${String(i).padStart(2, '0')}`);
        }
      }
      setCompletedLessons(completed);
    };
    window.addEventListener('storage', handleStorage);
    // Also poll for changes (since localStorage events don't fire on same page)
    const interval = setInterval(handleStorage, 1000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
      {/* 头部横幅 */}
      <div style={{
        background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        borderRadius: 16,
        padding: '32px',
        color: 'white',
        textAlign: 'center',
        marginBottom: 40
      }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: 8 }}>📚 AI人工智能系统教程</h2>
        <p style={{ opacity: 0.9, margin: 0 }}>24课完整版 · 覆盖ML/DL/NLP/LLM/Agent全链路</p>
      </div>

      {/* 快速入口卡片 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 40 }}>
        <Link to="/outline" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#dbeafe', border: '1px solid #bfdbfe', borderRadius: 12, padding: '16px 20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>📋</div>
            <div style={{ fontWeight: 600, color: '#1e40af' }}>课程大纲</div>
            <div style={{ fontSize: '0.8rem', color: '#3b82f6', marginTop: 4 }}>查看完整课程结构</div>
          </div>
        </Link>
        <Link to="/plan" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 12, padding: '16px 20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>📊</div>
            <div style={{ fontWeight: 600, color: '#166534' }}>开发计划</div>
            <div style={{ fontSize: '0.8rem', color: '#22c55e', marginTop: 4 }}>项目规划与进度</div>
          </div>
        </Link>
        <Link to="/standalone" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 12, padding: '16px 20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>🖥️</div>
            <div style={{ fontWeight: 600, color: '#92400e' }}>独立课件</div>
            <div style={{ fontSize: '0.8rem', color: '#f59e0b', marginTop: 4 }}>完整离线课件</div>
          </div>
        </Link>
        <Link to="/jupyter" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fce7f3', border: '1px solid #fbcfe8', borderRadius: 12, padding: '16px 20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>💻</div>
            <div style={{ fontWeight: 600, color: '#9d174d' }}>Jupyter演示</div>
            <div style={{ fontSize: '0.8rem', color: '#ec4899', marginTop: 4 }}>浏览器内运行Python</div>
          </div>
        </Link>
      </div>

      {/* 12周课程网格 - 改进的响应式CSS Grid */}
      {WEEK_GROUPS.map((week) => {
        const progress = getWeekProgress(week.lessons);
        const progressPercent = Math.round((progress.completed / progress.total) * 100);
        return (
        <div key={week.label} style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, gap: 16 }}>
            <h3 style={{
              fontSize: '1.15rem',
              color: '#4F46E5',
              margin: 0,
              paddingBottom: 10,
              borderBottom: '3px solid #4F46E5',
              fontWeight: 700,
              letterSpacing: '-0.01em'
            }}>{week.label}</h3>
           <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                background: '#e2e8f0',
                borderRadius: 10,
                height: 10,
                width: 100,
                overflow: 'hidden',
              }}>
                <div style={{
                  background: progressPercent === 100 ? '#10B981' : 'linear-gradient(90deg, #4F46E5, #7C3AED)',
                  height: '100%',
                  width: `${progressPercent}%`,
                  transition: 'width 0.3s ease',
                }} />
              </div>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: progressPercent === 100 ? '#10B981' : '#64748b',
                minWidth: 50,
              }}>
                {progress.completed}/{progress.total}
              </span>
            </div>
          </div>
          <div className="lesson-grid">
            {week.lessons.map((lessonId) => {
              const lesson = LESSONS[lessonId];
              if (!lesson) return null;
              return (
                <div
                  key={lessonId}
                  className="lesson-card"
                  onClick={() => navigate(`/lesson/${lessonId}`)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <span className="lesson-id-badge">{lessonId}</span>
                    <span className="lesson-card-title">{lesson.title}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {lesson.tags.map(tag => (
                      <span key={tag} className="lesson-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        );
      })}
      <style>{`
        .lesson-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
          gap: 20px;
        }
        .lesson-card {
          background: white;
          border-radius: 14px;
          padding: 22px;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.25s ease,
                      border-color 0.25s ease;
          border: 1px solid #e8edf4;
          position: relative;
          overflow: hidden;
        }
        .lesson-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #4F46E5, #7C3AED);
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .lesson-card:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 12px 24px rgba(79, 70, 229, 0.15);
          border-color: #c7d2fe;
        }
        .lesson-card:hover::before {
          opacity: 1;
        }
        .lesson-id-badge {
          background: linear-gradient(135deg, #4F46E5 0%, #6366f1 100%);
          color: white;
          padding: 5px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          box-shadow: 0 2px 6px rgba(79, 70, 229, 0.3);
        }
        .lesson-card-title {
          font-weight: 700;
          font-size: 1rem;
          color: #1e293b;
          line-height: 1.4;
        }
        .lesson-tag {
          background: #f1f5f9;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.72rem;
          color: #64748b;
          font-weight: 500;
          letter-spacing: 0.01em;
        }
      `}</style>
    </div>
  );
}

// =============================================================================
// 路由包装器
// =============================================================================
function LessonPage() {
  const { lessonId } = useParams();
  return <LessonContent lessonId={lessonId} />;
}

function CodeEditorWrapper() {
  const params = useParams();
  return <CodeEditor lessonId={params.lessonId} onBack={() => window.history.back()} />;
}

function QuizWrapper() {
  const params = useParams();
  return <QuizPanel lessonId={params.lessonId} onBack={() => window.history.back()} />;
}

// =============================================================================
// 根组件
// =============================================================================
export default function App() {
  return (
    <BrowserRouter>
      <div className="app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navigation />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/lesson/:lessonId" element={<LessonPage />} />
            <Route path="/editor/:lessonId" element={<CodeEditorWrapper />} />
            <Route path="/quiz/:lessonId" element={<QuizWrapper />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/outline" element={<OutlinePage />} />
            <Route path="/plan" element={<PlanReportPage />} />
            <Route path="/standalone" element={<StandalonePage />} />
            <Route path="/jupyter" element={<JupyterDemoPage />} />
            <Route path="/tools/token" element={
              <div style={{ padding: 20 }}>
                <h2>Token Counter</h2>
                <TokenCounterDemo />
              </div>
            } />
            <Route path="/tools/search" element={
              <div style={{ padding: 20 }}>
                <h2>全文搜索</h2>
                <SearchDemo />
              </div>
            } />
            <Route path="/tools/errors" element={
              <div style={{ padding: 20 }}>
                <h2>错题本</h2>
                <ErrorBookDemo />
              </div>
            } />
            <Route path="/tools/playground" element={
              <div style={{ padding: 20 }}>
                <h2>Prompt Playground</h2>
                <PromptPlaygroundDemo />
              </div>
            } />
            <Route path="/tools/rag" element={
              <div style={{ padding: 20 }}>
                <h2>RAG Demo Builder</h2>
                <RAGBuilderDemo />
              </div>
            } />
            <Route path="/tools/knowledge" element={
              <div style={{ padding: 20 }}>
                <h2>Knowledge Graph</h2>
                <KnowledgeGraphDemo />
              </div>
            } />
            <Route path="/tools/leaderboard" element={
              <div style={{ padding: 20 }}>
                <h2>Leaderboard</h2>
                <LeaderboardDemo />
              </div>
            } />
            <Route path="/tools/benchmark" element={
              <div style={{ padding: 20 }}>
                <h2>Benchmark Runner</h2>
                <BenchmarkRunnerDemo />
              </div>
            } />
            <Route path="/tools/ai-tutor" element={
              <div style={{ padding: 20 }}>
                <h2>AI 助教</h2>
                <AITutorDemo />
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}