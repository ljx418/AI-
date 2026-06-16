# W2 课程分组规则 (L49-L63 → Week 23/24/25)

**生成时间**: 2026-06-16
**关联文档**: [ARCHITECTURE.md §3.1](./ARCHITECTURE.md) / [PRD.md §3.1](./PRD.md)

---

## 1. 目的

PRD/ARCH 提到 L49-L63 归 "Week 23-25 W2 冲刺"，但 `lessons_new.jsx` 的 `WEEK_GROUPS` 数组怎么分没明确。本文档定义规则。

---

## 2. 分组方案（与子阶段一致）

| Week | 范围 | 主题 | 课数 |
|------|------|------|----:|
| **Week 23 W2.A** | L49-L54 | 行业方案 (Industry Solutions) | 6 |
| **Week 24 W2.B** | L55-L58 | 微调深化 (Fine-tuning Depth) | 4 |
| **Week 25 W2.C** | L59-L63 | Agent 深化 (Agent Depth) | 5 |

---

## 3. 在 lessons_new.jsx 中的写法

WEEK_GROUPS 是 HomePage 显示用的分组数组，**W2 实施时由子 Agent 在合并到 LESSONS 时同步更新**。

```js
// 添加到 src/data/lessons_new.jsx 的 WEEK_GROUPS 数组
{ week: 'Week 23 W2.A', title: '行业方案', range: 'L49-L54' },
{ week: 'Week 24 W2.B', title: '微调深化', range: 'L55-L58' },
{ week: 'Week 25 W2.C', title: 'Agent 深化', range: 'L59-L63' },
```

每个 lesson 对象的 `week` 字段也对应更新：
- L49-L54 → `"Week 23 W2.A"`
- L55-L58 → `"Week 24 W2.B"`
- L59-L63 → `"Week 25 W2.C"`

---

## 4. HomePage 视觉验证

W2 后 HomePage 应显示 25 个周次分组（原 19 + W2 3 + W1 0 新 = 25）。

可在 W2 验收时通过浏览器查看 `http://localhost:5173/` 确认。

---

## 5. 修订历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-06-16 | 初版, 定义 Week 23/24/25 规则 |
