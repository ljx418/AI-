/**
 * Leaderboard - 学习排行榜
 */
import React, { useState, useEffect } from 'react';

const MOCK_USERS = [
  { rank: 1, name: 'Alex Chen', lessons: 24, score: 9850, streak: 12 },
  { rank: 2, name: '李明', lessons: 22, score: 9200, streak: 8 },
  { rank: 3, name: 'Wang Wei', lessons: 21, score: 8900, streak: 15 },
  { rank: 4, name: '张伟', lessons: 19, score: 8200, streak: 6 },
  { rank: 5, name: '刘洋', lessons: 18, score: 7800, streak: 10 },
  { rank: 6, name: '陈静', lessons: 17, score: 7500, streak: 5 },
  { rank: 7, name: 'Zhang Li', lessons: 16, score: 7200, streak: 3 },
  { rank: 8, name: '王芳', lessons: 15, score: 6800, streak: 7 },
  { rank: 9, name: '李强', lessons: 14, score: 6500, streak: 4 },
  { rank: 10, name: '赵敏', lessons: 13, score: 6200, streak: 2 },
];

export default function Leaderboard() {
  const [users] = useState(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const completed = [];
    for (let i = 1; i <= 24; i++) {
      const key = `lesson-completed-L${String(i).padStart(2, '0')}`;
      if (localStorage.getItem(key) === 'true') completed.push(i);
    }
    setCurrentUser({ rank: '-', name: '你', lessons: completed.length, score: completed.length * 400 + completed.length * 50, streak: 0 });
  }, []);

  const filteredUsers = filter === 'all' ? users : users.filter(u => u.lessons >= parseInt(filter));

  return (
    <div style={{ padding: 16, maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 16 }}>🏆 学习排行榜</h2>
      <div style={{ marginBottom: 16 }}>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <option value="all">全部</option>
          <option value="15">≥15 课</option>
          <option value="18">≥18 课</option>
          <option value="20">≥20 课</option>
        </select>
      </div>
      {currentUser && <div style={{ padding: 16, marginBottom: 16, background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', borderRadius: 12, color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><div style={{ fontSize: '0.8rem', opacity: 0.8 }}>你的进度</div><div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{currentUser.lessons}/24 课</div></div>
          <div style={{ textAlign: 'right' }}><div style={{ fontSize: '0.8rem', opacity: 0.8 }}>总分</div><div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{currentUser.score}</div></div>
        </div>
      </div>}
      <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        {filteredUsers.map((user, i) => <div key={user.rank} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: i < filteredUsers.length - 1 ? '1px solid #f1f5f9' : 'none', background: user.rank <= 3 ? (user.rank === 1 ? '#fef3c7' : user.rank === 2 ? '#f1f5f9' : '#fff7ed') : 'white' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: user.rank === 1 ? '#fbbf24' : user.rank === 2 ? '#94a3b8' : user.rank === 3 ? '#f97316' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', color: user.rank <= 3 ? 'white' : '#64748b', marginRight: 12 }}>{user.rank}</div>
          <div style={{ flex: 1 }}><div style={{ fontWeight: 600 }}>{user.name}</div><div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user.lessons} 课 · {user.streak} 天连续</div></div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#22c55e' }}>{user.score}</div>
        </div>)}
      </div>
    </div>
  );
}

export function LeaderboardDemo() {
  return <div style={{ padding: 20 }}><h3>Leaderboard</h3><Leaderboard /></div>;
}