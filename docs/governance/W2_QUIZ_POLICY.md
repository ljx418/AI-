# W2 测验题策略 (L49-L63 不扩展 questions.json)

**生成时间**: 2026-06-16
**关联文档**: [ARCHITECTURE.md §3.3](./ARCHITECTURE.md) / [PRD.md §3.1](./PRD.md)

---

## 1. 决策

**L49-L63 不扩展 `src/data/quiz/questions.json` 测验题库。**

---

## 2. 依据

| 因素 | 说明 |
|------|------|
| **W1 现状** | 现有 240+ 题覆盖 48 课，平均 5 题/课 |
| **W2 工作量** | 15 课若每课 5 题 = 75 新题，agent 时间 +2h |
| **M12+ 规划** | 测验题扩展列入 M12+（与 M9 AITutor 整合） |
| **核心 KPI** | W2 重点是课程内容深度，不在测验覆盖 |

---

## 3. 实施规则

- L49-L63 在 lessons_new.jsx 中 `exercises` 字段**保留为空数组 `[]`**
- QuizPanel 对 exercises 为空的课显示"本课暂无测验题，前往下一节"
- W2.A/B/C 子 Agent 任务书的 prompt 不要求生成 quiz 题

---

## 4. 数据模型

```ts
interface Lesson {
  // ...
  exercises: Exercise[];  // W2 课填空数组 []
}
```

---

## 5. 影响

- W2 后 questions.json 不变 (240+ 题)
- 验收门槛不要求新 quiz 题数
- 用户在 L49-L63 完成时无测验，但有 progress 100% 标记

---

## 6. M12+ 规划

- M12+ 考虑用 deepseek 批量生成测验题（每课 5-8 题）
- 与 AITutor Mock 模式整合，提供"智能出题"功能

---

## 7. 修订历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-06-16 | 初版, 决策 L49-L63 不扩 quiz |
