import React, { useState, useEffect, useMemo } from 'react';

// LocalStorage keys
const STORAGE_KEYS = {
  STREAK: 'ai_course_streak',
  LAST_ACTIVE_DATE: 'ai_course_last_active',
  TOTAL_MINUTES: 'ai_course_total_minutes',
  COURSES_COMPLETED: 'ai_course_completed',
  QUIZ_HISTORY: 'ai_course_quiz_history',
  KNOWLEDGE_POINTS: 'ai_course_knowledge_points',
  WRONG_QUESTIONS: 'ai_course_wrong_questions',
};

// Default progress data structure
const defaultProgressData = {
  streak: 0,
  totalMinutes: 0,
  coursesCompleted: Array(24).fill(false),
  quizHistory: [],
  knowledgePoints: {},
  wrongQuestions: [],
};

// Knowledge point definitions for the course
const KNOWLEDGE_POINTS = [
  'AI定义',
  '深度学习',
  '神经网络',
  'Python基础',
  '数据处理',
  '模型训练',
  '评估指标',
  '实战应用',
];

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '24px',
    paddingBottom: '10px',
    borderBottom: '3px solid #4F46E5',
    display: 'inline-block',
    color: '#1e293b',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    textAlign: 'center',
    border: '1px solid #e2e8f0',
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#4F46E5',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#64748b',
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#1e293b',
  },
  progressItem: {
    background: 'white',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0',
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  progressLabel: {
    fontWeight: 500,
    color: '#334155',
  },
  progressPercent: {
    color: '#4F46E5',
    fontWeight: 600,
  },
  progressBar: {
    height: '8px',
    background: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: (percent, color) => ({
    height: '100%',
    width: `${percent}%`,
    background: color,
    transition: 'width 0.3s',
  }),
  weekProgress: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
  },
  chartContainer: {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '16px',
    border: '1px solid #e2e8f0',
  },
  chartTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '16px',
    textAlign: 'center',
  },
  radarChart: {
    position: 'relative',
    width: '280px',
    height: '280px',
    margin: '0 auto',
  },
  lineChart: {
    position: 'relative',
    width: '100%',
    height: '200px',
    padding: '20px 40px',
  },
  wrongQuestionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    background: 'white',
    borderRadius: '8px',
    marginBottom: '8px',
    borderLeft: '4px solid #ef4444',
    border: '1px solid #e2e8f0',
  },
  wrongCount: {
    background: '#fee2e2',
    color: '#ef4444',
    padding: '4px 12px',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '0.85rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#64748b',
  },
};

// Helper functions for LocalStorage
function loadFromStorage(key, defaultValue) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

// Calculate streak based on last active date
function calculateStreak(lastActiveDate, currentStreak) {
  if (!lastActiveDate) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastActive = new Date(lastActiveDate);
  lastActive.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Same day, keep streak
    return currentStreak;
  } else if (diffDays === 1) {
    // Consecutive day, increment streak
    return currentStreak + 1;
  } else {
    // Streak broken
    return 1;
  }
}

// Format minutes to hours and minutes
function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

// Generate sample data for demo
function generateSampleData() {
  const knowledgePoints = {};
  KNOWLEDGE_POINTS.forEach(kp => {
    const correct = Math.floor(Math.random() * 6) + 4; // 4-10
    const total = 10;
    knowledgePoints[kp] = { correct, total };
  });

  const wrongQuestions = [];
  for (let i = 1; i <= 6; i++) {
    for (let j = 1; j <= 5; j++) {
      const wrongCount = Math.floor(Math.random() * 4);
      if (wrongCount > 0) {
        wrongQuestions.push({ qId: `L${i}_Q${j}`, wrongCount });
      }
    }
  }
  wrongQuestions.sort((a, b) => b.wrongCount - a.wrongCount);

  const quizHistory = [];
  const baseDate = new Date('2026-05-01');
  for (let i = 0; i < 8; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i * 2);
    quizHistory.push({
      courseId: `L${Math.floor(i / 2) + 1}`,
      score: Math.floor(Math.random() * 4) + 7, // 7-10
      total: 10,
      date: date.toISOString().split('T')[0],
      timeSpent: Math.floor(Math.random() * 120) + 180, // 180-300 seconds
    });
  }

  return {
    streak: 5,
    totalMinutes: 1234,
    coursesCompleted: [true, true, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    quizHistory,
    knowledgePoints,
    wrongQuestions: wrongQuestions.slice(0, 10),
  };
}

// Radar Chart Component (Pure CSS/SVG)
function RadarChart({ data, labels }) {
  const size = 260;
  const center = size / 2;
  const radius = 100;
  const levels = 5;

  const angleStep = (2 * Math.PI) / labels.length;

  // Calculate points for each label
  const getPoint = (index, value, maxValue) => {
    const angle = index * angleStep - Math.PI / 2;
    const distance = (value / maxValue) * radius;
    return {
      x: center + distance * Math.cos(angle),
      y: center + distance * Math.sin(angle),
    };
  };

  // Generate level rings
  const levelRings = [];
  for (let i = 1; i <= levels; i++) {
    const ringPoints = labels.map((_, idx) => {
      const angle = idx * angleStep - Math.PI / 2;
      const distance = (i / levels) * radius;
      return `${center + distance * Math.cos(angle)},${center + distance * Math.sin(angle)}`;
    });
    levelRings.push(ringPoints.join(' '));
  }

  // Generate axis lines and labels
  const axisLines = labels.map((label, idx) => {
    const point = getPoint(idx, 100, 100);
    return { point, label };
  });

  // Generate data polygon
  const dataPoints = labels.map((label, idx) => {
    const value = data[label] || 0;
    return getPoint(idx, value, 10);
  });
  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Level rings */}
      {levelRings.map((points, idx) => (
        <polygon
          key={idx}
          points={points}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {axisLines.map((axis, idx) => (
        <line
          key={idx}
          x1={center}
          y1={center}
          x2={axis.point.x}
          y2={axis.point.y}
          stroke="#e2e8f0"
          strokeWidth="1"
        />
      ))}

      {/* Data polygon */}
      <polygon
        points={dataPolygon}
        fill="rgba(79, 70, 229, 0.3)"
        stroke="#4F46E5"
        strokeWidth="2"
      />

      {/* Data points */}
      {dataPoints.map((point, idx) => (
        <circle
          key={idx}
          cx={point.x}
          cy={point.y}
          r="4"
          fill="#4F46E5"
        />
      ))}

      {/* Labels */}
      {labels.map((label, idx) => {
        const angle = idx * angleStep - Math.PI / 2;
        const labelRadius = radius + 25;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        const anchor = Math.abs(angle) < Math.PI / 2 ? 'start' : 'end';
        return (
          <text
            key={idx}
            x={x}
            y={y}
            textAnchor={anchor}
            dominantBaseline="middle"
            fontSize="11"
            fill="var(--text)"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

// Line Chart Component (Pure CSS/SVG)
function LineChart({ data }) {
  if (!data || data.length === 0) {
    return <div style={styles.emptyState}>暂无数据</div>;
  }

  const width = 700;
  const height = 200;
  const padding = { top: 20, right: 40, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxScore = 10;
  const minScore = 0;
  const scoreRange = maxScore - minScore;

  const xStep = chartWidth / Math.max(data.length - 1, 1);
  const yScale = chartHeight / scoreRange;

  const points = data.map((item, idx) => ({
    x: padding.left + idx * xStep,
    y: padding.top + chartHeight - (item.score - minScore) * yScale,
    ...item,
  }));

  const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      {/* Grid lines */}
      {[0, 2, 4, 6, 8, 10].map(score => (
        <g key={score}>
          <line
            x1={padding.left}
            y1={padding.top + chartHeight - (score - minScore) * yScale}
            x2={width - padding.right}
            y2={padding.top + chartHeight - (score - minScore) * yScale}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
          <text
            x={padding.left - 10}
            y={padding.top + chartHeight - (score - minScore) * yScale}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize="11"
            fill="var(--text-light)"
          >
            {score}
          </text>
        </g>
      ))}

      {/* Area fill */}
      <path
        d={areaPath}
        fill="rgba(79, 70, 229, 0.1)"
      />

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke="#4F46E5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Points */}
      {points.map((point, idx) => (
        <g key={idx}>
          <circle
            cx={point.x}
            cy={point.y}
            r="5"
            fill="#4F46E5"
            stroke="white"
            strokeWidth="2"
          />
         <text
            x={point.x}
            y={padding.top + chartHeight + 20}
            textAnchor="middle"
            fontSize="10"
            fill="var(--text-light)"
          >
            {point.date?.slice(5) || `T${idx + 1}`}
          </text>
        </g>
      ))}
    </svg>
  );
}

// Week Progress Component
function WeekProgress({ coursesCompleted }) {
  const weeks = [
    { label: 'Week 1-2', indices: [0, 1, 2, 3], color: '#3b82f6' },
    { label: 'Week 3-4', indices: [4, 5, 6, 7], color: '#10b981' },
    { label: 'Week 5-6', indices: [8, 9, 10, 11], color: '#f59e0b' },
    { label: 'Week 7-8', indices: [12, 13, 14, 15], color: '#ec4899' },
    { label: 'Week 9-10', indices: [16, 17, 18, 19], color: '#8b5cf6' },
    { label: 'Week 11-12', indices: [20, 21, 22, 23], color: '#ef4444' },
  ];

  return (
    <div style={styles.weekProgress}>
      {weeks.map(week => {
        const completed = week.indices.filter(i => coursesCompleted[i]).length;
        const total = week.indices.length;
        const percent = (completed / total) * 100;

        return (
          <div key={week.label} style={styles.progressItem}>
            <div style={styles.progressHeader}>
              <span style={styles.progressLabel}>{week.label}</span>
              <span style={styles.progressPercent}>
                {completed}/{total}
              </span>
            </div>
            <div style={styles.progressBar}>
              <div style={styles.progressFill(percent, week.color)} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Wrong Questions List Component
function WrongQuestionsList({ wrongQuestions }) {
  if (!wrongQuestions || wrongQuestions.length === 0) {
    return <div style={styles.emptyState}>暂无错题记录</div>;
  }

  const top10 = wrongQuestions.slice(0, 10);

  return (
    <div>
      {top10.map((item, idx) => (
        <div key={item.qId} style={styles.wrongQuestionItem}>
          <div>
            <div style={{ fontWeight: 500 }}>{item.qId}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
              错误次数
            </div>
          </div>
          <span style={styles.wrongCount}>{item.wrongCount}次</span>
        </div>
      ))}
    </div>
  );
}

function Progress() {
  const [progressData, setProgressData] = useState(defaultProgressData);
  const [isDemo, setIsDemo] = useState(false);

  // Load data on mount
  useEffect(() => {
    const storedStreak = loadFromStorage(STORAGE_KEYS.STREAK, 0);
    const lastActiveDate = loadFromStorage(STORAGE_KEYS.LAST_ACTIVE_DATE, null);
    const totalMinutes = loadFromStorage(STORAGE_KEYS.TOTAL_MINUTES, 0);
    const coursesCompleted = loadFromStorage(STORAGE_KEYS.COURSES_COMPLETED, defaultProgressData.coursesCompleted);
    const quizHistory = loadFromStorage(STORAGE_KEYS.QUIZ_HISTORY, []);
    const knowledgePoints = loadFromStorage(STORAGE_KEYS.KNOWLEDGE_POINTS, {});
    const wrongQuestions = loadFromStorage(STORAGE_KEYS.WRONG_QUESTIONS, []);

    // Calculate streak
    const streak = calculateStreak(lastActiveDate, storedStreak);

    // Check if we have any data
    const hasData = streak > 0 || totalMinutes > 0 || quizHistory.length > 0 ||
                    coursesCompleted.some(c => c) || Object.keys(knowledgePoints).length > 0;

    if (hasData) {
      setProgressData({
        streak,
        totalMinutes,
        coursesCompleted,
        quizHistory,
        knowledgePoints,
        wrongQuestions,
      });
    } else {
      // Use demo data
      const sampleData = generateSampleData();
      setProgressData(sampleData);
      setIsDemo(true);
    }

    // Update last active date
    const today = new Date().toISOString().split('T')[0];
    saveToStorage(STORAGE_KEYS.LAST_ACTIVE_DATE, today);
    saveToStorage(STORAGE_KEYS.STREAK, streak);
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const { quizHistory, knowledgePoints, coursesCompleted } = progressData;

    // Overall accuracy
    let totalCorrect = 0;
    let totalQuestions = 0;
    Object.values(knowledgePoints).forEach(kp => {
      totalCorrect += kp.correct || 0;
      totalQuestions += kp.total || 0;
    });
    const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    // Courses completed count
    const completedCount = coursesCompleted.filter(Boolean).length;

    // Average score from quiz history
    const avgScore = quizHistory.length > 0
      ? Math.round(quizHistory.reduce((sum, q) => sum + (q.score / q.total) * 100, 0) / quizHistory.length)
      : 0;

    return {
      completedCount,
      totalCount: 24,
      overallAccuracy,
      avgScore,
      quizzesTaken: quizHistory.length,
    };
  }, [progressData]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>学习进度</h1>

      {isDemo && (
        <div style={{
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '24px',
          fontSize: '0.9rem',
          color: '#92400e',
        }}>
          当前显示演示数据。开始学习后，您的真实学习进度将显示在这里。
        </div>
      )}

      {/* Overall Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{progressData.streak}</div>
          <div style={styles.statLabel}>连续学习天数</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{formatTime(progressData.totalMinutes)}</div>
          <div style={styles.statLabel}>总学习时长</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.overallAccuracy}%</div>
          <div style={styles.statLabel}>总体正确率</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{stats.avgScore}%</div>
          <div style={styles.statLabel}>平均成绩</div>
        </div>
      </div>

      {/* Overall Progress */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>总体进度</h2>
        <div style={styles.progressItem}>
          <div style={styles.progressHeader}>
            <span style={styles.progressLabel}>课程完成度</span>
            <span style={styles.progressPercent}>
              {stats.completedCount}/{stats.totalCount} ({Math.round((stats.completedCount / stats.totalCount) * 100)}%)
            </span>
          </div>
          <div style={styles.progressBar}>
            <div style={styles.progressFill((stats.completedCount / stats.totalCount) * 100, '#4F46E5')} />
          </div>
        </div>
      </section>

      {/* Week Progress */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>各周进度 (12周/24课)</h2>
        <WeekProgress coursesCompleted={progressData.coursesCompleted} />
      </section>

      {/* Quiz History Line Chart */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>成绩历史曲线</h2>
        <div style={styles.chartContainer}>
          <LineChart data={progressData.quizHistory} />
        </div>
      </section>

      {/* Knowledge Points Radar Chart */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>知识点掌握度</h2>
        <div style={styles.chartContainer}>
          <RadarChart
            data={progressData.knowledgePoints}
            labels={KNOWLEDGE_POINTS}
          />
        </div>
      </section>

      {/* Wrong Questions Top10 */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>易错题 Top 10</h2>
        <WrongQuestionsList wrongQuestions={progressData.wrongQuestions} />
      </section>
    </div>
  );
}

export default Progress;