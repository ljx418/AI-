/**
 * Error Book (错题本) - 间隔重复学习系统
 * 基于 SM-2 算法的错题复习系统
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';

// SM-2 算法实现
const calculateNextReview = (quality, repetitions, easeFactor, interval) => {
  let newRepetitions = repetitions;
  let newEaseFactor = easeFactor;
  let newInterval = interval;

  if (quality >= 3) {
    // 正确回答
    if (newRepetitions === 0) {
      newInterval = 1;
    } else if (newRepetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * easeFactor);
    }
    newRepetitions += 1;
  } else {
    // 错误回答，重置
    newRepetitions = 0;
    newInterval = 1;
  }

  // 更新 Ease Factor
  newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  newEaseFactor = Math.max(1.3, newEaseFactor);

  return {
    repetitions: newRepetitions,
    easeFactor: newEaseFactor,
    interval: newInterval,
    nextReview: Date.now() + newInterval * 24 * 60 * 60 * 1000
  };
};

// 错误题目卡片
function ErrorCard({ error, onReview }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [quality, setQuality] = useState(3);

  const handleReview = (q) => {
    setQuality(q);
    onReview(error.id, q);
  };

  return (
    <div style={{
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: 8,
      padding: 16,
      marginBottom: 12
    }}>
      {/* 题目 */}
      <div style={{
        fontWeight: 500,
        marginBottom: 8,
        color: '#1e293b'
      }}>
        {error.question}
      </div>

      {/* 选项 */}
      {error.options && (
        <div style={{ marginBottom: 12 }}>
          {error.options.map((opt, i) => (
            <div key={i} style={{
              padding: '8px 12px',
              marginBottom: 4,
              borderRadius: 6,
              background: showAnswer
                ? opt === error.correct
                  ? '#dcfce7'
                  : opt === error.userAnswer
                    ? '#fee2e2'
                    : '#f8fafc'
                : '#f8fafc',
              color: showAnswer
                ? opt === error.correct
                  ? '#166534'
                  : opt === error.userAnswer
                    ? '#991b1b'
                    : '#1e293b'
                : '#1e293b'
            }}>
              {opt}
            </div>
          ))}
        </div>
      )}

      {/* 答案区域 */}
      {showAnswer ? (
        <div>
          {/* 正确答案 */}
          <div style={{
            padding: '8px 12px',
            background: '#dcfce7',
            borderRadius: 6,
            marginBottom: 12,
            color: '#166534'
          }}>
            正确答案: {error.correct}
          </div>

          {/* 解释 */}
          {error.explanation && (
            <div style={{
              fontSize: '0.85rem',
              color: '#64748b',
              marginBottom: 12
            }}>
              {error.explanation}
            </div>
          )}

          {/* 评分按钮 */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => handleReview(1)}
              style={{
                flex: 1,
                padding: '8px 12px',
                background: '#fee2e2',
                border: 'none',
                borderRadius: 6,
                color: '#991b1b',
                cursor: 'pointer'
              }}
            >
              😢 完全不会 (1)
            </button>
            <button
              onClick={() => handleReview(2)}
              style={{
                flex: 1,
                padding: '8px 12px',
                background: '#fef3c7',
                border: 'none',
                borderRadius: 6,
                color: '#92400e',
                cursor: 'pointer'
              }}
            >
              🤔 记得一点 (2)
            </button>
            <button
              onClick={() => handleReview(3)}
              style={{
                flex: 1,
                padding: '8px 12px',
                background: '#dcfce7',
                border: 'none',
                borderRadius: 6,
                color: '#166534',
                cursor: 'pointer'
              }}
            >
              😊 很简单 (3)
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAnswer(true)}
          style={{
            padding: '8px 16px',
            background: '#4F46E5',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer'
          }}
        >
          查看答案
        </button>
      )}
    </div>
  );
}

export default function ErrorBook({
  errors = [],
  onSave,
  initialErrors = []
}) {
  const [errorList, setErrorList] = useState(initialErrors);
  const [filter, setFilter] = useState('all'); // all, review, mastered

  // 加载错误
  useEffect(() => {
    const saved = localStorage.getItem('errorBook');
    if (saved) {
      try {
        setErrorList(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load error book:', e);
      }
    }
  }, []);

  // 保存错误
  useEffect(() => {
    if (errorList.length > 0) {
      localStorage.setItem('errorBook', JSON.stringify(errorList));
    }
  }, [errorList]);

  // 过滤错误
  const filteredErrors = useMemo(() => {
    const now = Date.now();

    if (filter === 'review') {
      return errorList.filter(e => e.nextReview <= now);
    } else if (filter === 'mastered') {
      return errorList.filter(e => e.repetitions >= 3);
    }
    return errorList;
  }, [errorList, filter]);

  // 统计
  const stats = useMemo(() => {
    const now = Date.now();
    return {
      total: errorList.length,
      needReview: errorList.filter(e => e.nextReview <= now).length,
      mastered: errorList.filter(e => e.repetitions >= 3).length
    };
  }, [errorList]);

  // 添加错误
  const addError = useCallback((error) => {
    setErrorList(prev => {
      const exists = prev.find(e => e.id === error.id);
      if (exists) return prev;

      const newError = {
        ...error,
        repetitions: 0,
        easeFactor: 2.5,
        interval: 1,
        nextReview: Date.now(),
        createdAt: Date.now()
      };

      return [...prev, newError];
    });
  }, []);

  // 复习错误
  const reviewError = useCallback((id, quality) => {
    setErrorList(prev => prev.map(error => {
      if (error.id !== id) return error;

      const { repetitions, easeFactor, interval } = error;
      const updated = calculateNextReview(quality, repetitions, easeFactor, interval);

      return { ...error, ...updated };
    }));
  }, []);

  // 删除错误
  const deleteError = useCallback((id) => {
    setErrorList(prev => prev.filter(e => e.id !== id));
  }, []);

  return (
    <div style={{ padding: 16 }}>
      {/* 统计 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
        marginBottom: 20
      }}>
        <div style={{
          padding: 16,
          background: '#f8fafc',
          borderRadius: 8,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#4F46E5' }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>总错误</div>
        </div>
        <div style={{
          padding: 16,
          background: '#fef3c7',
          borderRadius: 8,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#92400e' }}>
            {stats.needReview}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#92400e' }}>待复习</div>
        </div>
        <div style={{
          padding: 16,
          background: '#dcfce7',
          borderRadius: 8,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#166534' }}>
            {stats.mastered}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#166534' }}>已掌握</div>
        </div>
      </div>

      {/* 筛选 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '8px 16px',
            background: filter === 'all' ? '#4F46E5' : '#f1f5f9',
            color: filter === 'all' ? 'white' : '#64748b',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer'
          }}
        >
          全部
        </button>
        <button
          onClick={() => setFilter('review')}
          style={{
            padding: '8px 16px',
            background: filter === 'review' ? '#f59e0b' : '#f1f5f9',
            color: filter === 'review' ? 'white' : '#64748b',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer'
          }}
        >
          待复习 ({stats.needReview})
        </button>
        <button
          onClick={() => setFilter('mastered')}
          style={{
            padding: '8px 16px',
            background: filter === 'mastered' ? '#22c55e' : '#f1f5f9',
            color: filter === 'mastered' ? 'white' : '#64748b',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer'
          }}
        >
          已掌握
        </button>
      </div>

      {/* 错误列表 */}
      {filteredErrors.length === 0 ? (
        <div style={{
          padding: 40,
          textAlign: 'center',
          color: '#64748b'
        }}>
          {filter === 'all' ? '暂无错题记录' : '没有需要复习的错题'}
        </div>
      ) : (
        filteredErrors.map(error => (
          <ErrorCard
            key={error.id}
            error={error}
            onReview={reviewError}
          />
        ))
      )}
    </div>
  );
}

// 错题本演示
export function ErrorBookDemo() {
  const initialErrors = [
    {
      id: 'q1',
      question: '什么是 Transformer 的位置编码?',
      options: ['A: 绝对位置', 'B: 相对位置', 'C: 旋转位置', 'D: 三角函数位置'],
      userAnswer: 'A',
      correct: 'D',
      explanation: 'Transformer 使用 Sinusoidal 位置编码，是三角函数形式。',
      repetitions: 1,
      easeFactor: 2.5,
      interval: 3,
      nextReview: Date.now() + 2 * 24 * 60 * 60 * 1000
    },
    {
      id: 'q2',
      question: 'LoRA 的全称是?',
      options: ['A: Low-Rank Adaptation', 'B: Low-Resource Adaptation', 'C: Local Ranking', 'D: Linear Regression'],
      userAnswer: 'B',
      correct: 'A',
      explanation: 'LoRA = Low-Rank Adaptation，低秩适配。',
      repetitions: 0,
      easeFactor: 2.5,
      interval: 1,
      nextReview: Date.now()
    }
  ];

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h3>错题本 Demo</h3>
      <ErrorBook initialErrors={initialErrors} />
    </div>
  );
}