import React, { useState, useEffect, useRef } from 'react';
import { progressDB } from '../utils/storage';
import { normalizeLessonId } from '../utils/id-normalizer';

const styles = {
  container: {
    maxWidth: '800px',
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
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '16px',
  },
  progress: {
    marginBottom: '24px',
  },
  progressBar: {
    height: '8px',
    background: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: (percent) => ({
    height: '100%',
    width: `${percent}%`,
    background: 'var(--primary)',
    transition: 'width 0.3s',
  }),
  progressText: {
    fontSize: '0.85rem',
    color: 'var(--text-light)',
    marginTop: '8px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  timer: {
    fontSize: '0.85rem',
    color: 'var(--primary)',
    fontWeight: 600,
  },
  questionCard: {
    background: 'var(--card-bg)',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '24px',
  },
  questionType: {
    fontSize: '0.75rem',
    color: 'var(--primary)',
    fontWeight: 600,
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  questionText: {
    fontSize: '1.1rem',
    fontWeight: 500,
    marginBottom: '20px',
  },
  codeBlock: {
    background: '#1e293b',
    color: '#e2e8f0',
    padding: '16px',
    borderRadius: '8px',
    fontFamily: 'Monaco, Consolas, monospace',
    fontSize: '0.9rem',
    marginBottom: '16px',
    overflow: 'auto',
  },
  codeHighlight: {
    background: '#f59e0b',
    color: '#1e293b',
    padding: '2px 4px',
    borderRadius: '4px',
    fontWeight: 600,
  },
  options: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  option: (selected, correct, showResult, disabled) => ({
    padding: '12px 16px',
    border: `2px solid ${showResult ? (correct ? '#10b981' : selected ? '#ef4444' : '#e2e8f0') : selected ? 'var(--primary)' : '#e2e8f0'}`,
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: showResult && correct ? '#dcfce7' : selected ? '#eef2ff' : 'white',
    transition: 'all 0.2s',
    opacity: disabled ? 0.6 : 1,
  }),
  optionText: {
    fontSize: '0.95rem',
  },
  blankInput: (correct, showResult) => ({
    width: '100%',
    padding: '12px 16px',
    border: `2px solid ${showResult ? (correct ? '#10b981' : '#ef4444') : '#e2e8f0'}`,
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    background: showResult && correct ? '#dcfce7' : 'white',
    boxSizing: 'border-box',
  }),
  explanation: {
    marginTop: '16px',
    padding: '12px 16px',
    background: '#fef3c7',
    borderRadius: '8px',
    fontSize: '0.9rem',
    color: '#92400e',
  },
  explanationTitle: {
    fontWeight: 600,
    marginBottom: '4px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
  },
  navButton: {
    background: 'white',
    color: 'var(--primary)',
    padding: '12px 24px',
    border: '2px solid var(--primary)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 500,
    flex: 1,
  },
  submitButton: {
    background: 'var(--primary)',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 500,
    flex: 1,
  },
  disabledButton: {
    background: '#e2e8f0',
    color: '#94a3b8',
    cursor: 'not-allowed',
  },
  result: {
    textAlign: 'center',
    padding: '40px',
  },
  resultIcon: {
    fontSize: '4rem',
    marginBottom: '16px',
  },
  resultText: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '8px',
  },
  resultSubtext: {
    color: 'var(--text-light)',
    fontSize: '1rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginTop: '24px',
  },
  statCard: {
    background: '#f8fafc',
    padding: '16px',
    borderRadius: '12px',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--primary)',
  },
  statLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-light)',
    marginTop: '4px',
  },
  knowledgeSection: {
    marginTop: '24px',
    textAlign: 'left',
  },
  knowledgeTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '12px',
  },
  knowledgeList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  knowledgeTag: (mastered) => ({
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '0.85rem',
    background: mastered ? '#dcfce7' : '#fee2e2',
    color: mastered ? '#10b981' : '#ef4444',
  }),
};

// 计分规则
const calculateScore = (question, userAnswer) => {
  if (question.type === 'single') {
    return userAnswer === question.answer ? 1 : 0;
  }
  if (question.type === 'multiple') {
    const correct = JSON.stringify(userAnswer?.sort()) === JSON.stringify(question.answer.sort());
    return correct ? 1 : 0;
  }
  if (question.type === 'blank') {
    return userAnswer?.trim() === question.answer ? 1 : 0;
  }
  if (question.type === 'code') {
    return userAnswer === question.answer ? 1 : 0;
  }
  return 0;
};

// Sample quiz questions
const sampleQuestions = [
  {
    id: 1,
    type: 'single',
    question: '以下哪个是监督学习的特点？',
    options: [
      '不需要标注数据',
      '需要标注好的训练数据',
      '只能处理分类问题',
      '不能处理回归问题',
    ],
    answer: 1,
    explanation: '监督学习需要使用标注好的训练数据来训练模型，模型学习输入与对应输出之间的映射关系。',
    knowledgePoint: '监督学习基础',
  },
  {
    id: 2,
    type: 'multiple',
    question: '以下哪些算法可以用于回归问题？',
    options: [
      '线性回归',
      '逻辑回归',
      '决策树',
      'K-Means',
    ],
    answer: [0, 2],
    explanation: '线性回归和决策树都可以用于回归问题。逻辑回归虽然名字里有"回归"，但实际上是一种分类算法。K-Means是聚类算法，不属于监督学习。',
    knowledgePoint: '回归算法',
  },
  {
    id: 3,
    type: 'single',
    question: '神经网络的反向传播算法主要用于？',
    options: [
      '数据预处理',
      '计算梯度并更新权重',
      '特征提取',
      '模型评估',
    ],
    answer: 1,
    explanation: '反向传播（Backpropagation）通过计算损失函数对各参数的梯度，来更新神经网络的权重，是训练神经网络的核心算法。',
    knowledgePoint: '反向传播',
  },
  {
    id: 4,
    type: 'blank',
    question: '机器学习中，训练集、验证集和测试集的比例通常为 6:__:2？',
    answer: '2',
    explanation: '常见的划分比例为 60% 训练集、20% 验证集、20% 测试集。验证集用于调参和模型选择，测试集用于最终评估。',
    knowledgePoint: '数据集划分',
  },
  {
    id: 5,
    type: 'code',
    question: '下面代码中，下划线处应填入什么来实现模型训练？',
    codeSnippet: `model.compile(optimizer='adam',
              loss='binary_crossentropy',
              metrics=['accuracy'])

# 训练模型
history = model.__1__(x_train, y_train,
                     epochs=10,
                     validation_data=(x_val, y_val))`,
    options: ['evaluate', 'fit', 'predict', 'train'],
    answer: 1,
    explanation: 'model.fit() 用于训练模型，传入训练数据、标签、轮次和验证数据。evaluate用于评估，predict用于预测。',
    knowledgePoint: 'Keras训练API',
  },
];

function QuizPanel({ lessonId, onBack, questions: customQuestions }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionResults, setQuestionResults] = useState({});

  const questions = customQuestions || sampleQuestions;
  const question = questions[currentQuestion];
  const timerRef = useRef(null);

  useEffect(() => {
    if (!quizComplete) {
      timerRef.current = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizComplete, startTime]);

  const handleSelect = (optionIndex) => {
    if (showResult) return;

    if (question.type === 'multiple') {
      const current = answers[question.id] || [];
      const newAnswers = current.includes(optionIndex)
        ? current.filter((i) => i !== optionIndex)
        : [...current, optionIndex];
      setAnswers({ ...answers, [question.id]: newAnswers });
    } else {
      setAnswers({ ...answers, [question.id]: optionIndex });
    }
  };

  const handleBlankChange = (e) => {
    if (showResult) return;
    setAnswers({ ...answers, [question.id]: e.target.value });
  };

  const handleSubmit = () => {
    const isCorrect = calculateScore(question, answers[question.id]) === 1;
    setQuestionResults({
      ...questionResults,
      [question.id]: { correct: isCorrect, userAnswer: answers[question.id] },
    });
    setShowResult(true);
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowResult(false);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowResult(false);
    } else {
      setQuizComplete(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const totalQuestions = questions.length;
  const calculateTotalScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      correct += calculateScore(q, answers[q.id]);
    });
    return correct;
  };

  const score = calculateTotalScore();

  useEffect(() => {
    if (quizComplete) {
      try {
        const nid = normalizeLessonId(lessonId);
        progressDB.saveProgress(nid, "quiz", { score, total: totalQuestions, answers, takenAt: new Date().toISOString() });
      } catch (err) {
        console.warn("保存测验成绩失败:", err);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizComplete]);
  const progressPercent = ((currentQuestion + 1) / questions.length) * 100;
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate knowledge point mastery
  const knowledgeMastery = questions.reduce((acc, q) => {
    const result = questionResults[q.id];
    if (result) {
      acc[q.knowledgePoint] = result.correct;
    }
    return acc;
  }, {});

  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    const masteredCount = Object.values(knowledgeMastery).filter(Boolean).length;

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.backButton} onClick={onBack}>
            ← 返回课程内容
          </button>
        </div>
        <div style={styles.questionCard}>
          <div style={styles.result}>
            <div style={styles.resultIcon}>
              {percentage >= 80 ? '🎉' : percentage >= 50 ? '👍' : '📚'}
            </div>
            <div style={styles.resultText}>
              {percentage >= 80 ? '优秀!' : percentage >= 50 ? '良好' : '继续努力'}
            </div>
            <div style={styles.resultSubtext}>
              正确率: {score}/{questions.length} ({percentage}%)
            </div>

            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{score}</div>
                <div style={styles.statLabel}>正确题数</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{formatTime(timeSpent)}</div>
                <div style={styles.statLabel}>用时</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statValue}>{masteredCount}/{questions.length}</div>
                <div style={styles.statLabel}>知识点</div>
              </div>
            </div>

            <div style={styles.knowledgeSection}>
              <div style={styles.knowledgeTitle}>知识点掌握情况</div>
              <div style={styles.knowledgeList}>
                {Object.entries(knowledgeMastery).map(([kp, mastered], idx) => (
                  <span key={idx} style={styles.knowledgeTag(mastered)}>
                    {mastered ? '✓' : '✗'} {kp}
                  </span>
                ))}
              </div>
            </div>

            <button
              style={{ ...styles.submitButton, marginTop: '24px' }}
              onClick={() => {
                setCurrentQuestion(0);
                setAnswers({});
                setShowResult(false);
                setQuizComplete(false);
                setQuestionResults({});
                setTimeSpent(0);
              }}
            >
              重新测验
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isAnswered = question.type === 'blank'
    ? answers[question.id] !== undefined && answers[question.id] !== ''
    : answers[question.id] !== undefined;

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'single':
      case 'multiple':
        return (
          <div style={styles.options}>
            {question.options.map((option, index) => (
              <div
                key={index}
                style={styles.option(
                  question.type === 'multiple'
                    ? (answers[question.id] || []).includes(index)
                    : answers[question.id] === index,
                  question.type === 'multiple'
                    ? question.answer.includes(index)
                    : question.answer === index,
                  showResult,
                  showResult
                )}
                onClick={() => !showResult && handleSelect(index)}
              >
                <span style={styles.optionText}>
                  {String.fromCharCode(65 + index)}. {option}
                </span>
              </div>
            ))}
          </div>
        );

      case 'blank':
        return (
          <div>
            <input
              type="text"
              style={styles.blankInput(
                answers[question.id]?.trim() === question.answer,
                showResult
              )}
              value={answers[question.id] || ''}
              onChange={handleBlankChange}
              placeholder="请输入答案..."
              disabled={showResult}
            />
         </div>
        );

      case 'code':
        return (
          <div>
            <div style={styles.codeBlock}>
              {question.codeSnippet.split('__1__').map((part, idx, arr) => (
                <React.Fragment key={idx}>
                  {part}
                  {idx < arr.length - 1 && (
                    <span style={styles.codeHighlight}>
                      {question.options[answers[question.id]] || '______'}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div style={styles.options}>
              {question.options.map((option, index) => (
                <div
                  key={index}
                  style={styles.option(
                    answers[question.id] === index,
                    question.answer === index,
                    showResult,
                    showResult
                  )}
                  onClick={() => !showResult && handleSelect(index)}
                >
                  <span style={styles.optionText}>
                    {String.fromCharCode(65 + index)}. {option}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getQuestionTypeLabel = () => {
    switch (question.type) {
      case 'single': return '单选题';
      case 'multiple': return '多选题';
      case 'blank': return '填空题';
      case 'code': return '代码补全';
      default: return '题目';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          ← 返回课程内容
        </button>
        <h1 style={styles.title}>📝 课程测验 - {lessonId || 'L1'}</h1>
      </div>

      <div style={styles.progress}>
        <div style={styles.progressBar}>
          <div style={styles.progressFill(progressPercent)} />
        </div>
        <div style={styles.progressText}>
          <span>题目 {currentQuestion + 1}/{questions.length}</span>
          <span style={styles.timer}>⏱ {formatTime(timeSpent)}</span>
        </div>
      </div>

      <div style={styles.questionCard}>
        <div style={styles.questionType}>{getQuestionTypeLabel()}</div>
        <div style={styles.questionText}>{question.question}</div>

        {renderQuestionContent()}

        {showResult && question.explanation && (
          <div style={styles.explanation}>
            <div style={styles.explanationTitle}>💡 解析</div>
            <div>{question.explanation}</div>
          </div>
        )}
      </div>

      <div style={styles.buttonGroup}>
        <button
          style={{
            ...styles.navButton,
            ...(currentQuestion === 0 ? styles.disabledButton : {}),
          }}
          onClick={handlePrev}
          disabled={currentQuestion === 0}
        >
          ← 上一题
        </button>

        {!showResult ? (
          <button
            style={{
              ...styles.submitButton,
              ...(!isAnswered ? styles.disabledButton : {}),
            }}
            onClick={handleSubmit}
            disabled={!isAnswered}
          >
            提交答案
          </button>
        ) : (
          <button style={styles.submitButton} onClick={handleNext}>
            {currentQuestion < questions.length - 1 ? '下一题 →' : '查看结果'}
          </button>
        )}
      </div>
    </div>
  );
}

export default QuizPanel;