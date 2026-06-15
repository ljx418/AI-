// SM-2算法实现

/**
 * 计算下次复习日期
 * @param {number} quality - 回答质量 (0-5)
 * @param {number} repetitions - 连续成功次数
 * @param {number} ef - 易记因子 (default 2.5)
 * @param {number} interval - 当前间隔天数
 * @returns {Object} {nextReview, repetitions, ef, interval}
 */
export function calculateNextReview(quality, repetitions = 0, ef = 2.5, interval = 1) {
  if (quality < 3) {
    // 失败，重新开始
    return {
      nextReview: new Date(), // 立即复习
      repetitions: 0,
      ef: ef,
      interval: 1
    };
  }

  // 成功，增加间隔
  let newRepetitions = repetitions + 1;
  let newInterval;

  if (newRepetitions === 1) {
    newInterval = 1;
  } else if (newRepetitions === 2) {
    newInterval = 6;
  } else {
    newInterval = Math.round(interval * ef);
  }

  // 更新EF
  let newEf = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  newEf = Math.max(1.3, newEf);

  // 计算下次复习日期
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + newInterval);

  return {
    nextReview,
    repetitions: newRepetitions,
    ef: newEf,
    interval: newInterval
  };
}

/**
 * 检查需要复习的题目
 * @param {Array} quizHistory - 测验历史
 * @returns {Array} 需要复习的题目列表
 */
export function getDueReviews(quizHistory) {
  const now = new Date();
  const dueReviews = [];

  quizHistory.forEach(item => {
    if (item.nextReview && new Date(item.nextReview) <= now) {
      dueReviews.push(item);
    }
  });

  return dueReviews;
}