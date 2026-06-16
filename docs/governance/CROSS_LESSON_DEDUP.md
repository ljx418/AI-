# 跨课重复检测方法 (≥30% 重复判定)

**生成时间**: 2026-06-16
**目的**: 防止 W2 生成的 15 课与现有 48 课出现 ≥30% 内容雷同
**关联文档**: [M11_W2_PLAN.md §3.4](./M11_W2_PLAN.md)

---

## 1. 触发场景

- W2.A 行业方案可能与 L34/L35 (行业/项目) 重复
- W2.B 微调深化与 L25/L26/L28 (微调) 重复
- W2.C Agent 深化与 L19/L21/L22/L27/L36 (Agent) 重复

---

## 2. 检测方法

### 2.1 Outline 标题相似度（粗筛）

```js
// scripts/dedup_outline.mjs
import lessons from '../src/data/lessons_new.jsx';

function extractOutline(lesson) {
  return lesson.sections.map(s => s.title.trim().toLowerCase());
}

function titleSimilarity(t1, t2) {
  // Jaccard 相似度
  const set1 = new Set(t1.split(/\s+/));
  const set2 = new Set(t2.split(/\s+/));
  const inter = [...set1].filter(x => set2.has(x)).length;
  const union = new Set([...set1, ...set2]).size;
  return union === 0 ? 0 : inter / union;
}

// 对 W2 新课与现有 48 课两两对比
for (const newLesson of newLessons) {
  for (const oldLesson of oldLessons) {
    const sim = titleSimilarity(
      extractOutline(newLesson).join(' '),
      extractOutline(oldLesson).join(' ')
    );
    if (sim >= 0.3) {
      console.warn(`⚠️ ${newLesson.id} vs ${oldLesson.id}: outline 相似度 ${(sim*100).toFixed(1)}%`);
    }
  }
}
```

### 2.2 内容字符级相似度（精筛）

```js
// scripts/dedup_content.mjs
function charSimilarity(text1, text2) {
  // 用 4-gram 滑窗
  const ngram = (s) => {
    const clean = s.replace(/\s+/g, '');
    const grams = new Set();
    for (let i = 0; i <= clean.length - 4; i++) {
      grams.add(clean.slice(i, i + 4));
    }
    return grams;
  };
  const g1 = ngram(text1);
  const g2 = ngram(text2);
  const inter = [...g1].filter(x => g2.has(x)).length;
  const union = new Set([...g1, ...g2]).size;
  return union === 0 ? 0 : inter / union;
}

// W2 课内容（拼所有 sections.content + codeExamples.code）
const newContent = extractAllContent(newLesson);
for (const oldLesson of oldLessons) {
  const oldContent = extractAllContent(oldLesson);
  const sim = charSimilarity(newContent, oldContent);
  if (sim >= 0.3) {
    console.error(`❌ ${newLesson.id} vs ${oldLesson.id}: 内容相似度 ${(sim*100).toFixed(1)}% 超阈值`);
  }
}
```

---

## 3. 阈值与处理

| 相似度 | 等级 | 处理 |
|------:|:----:|------|
| < 10% | 🟢 健康 | 接受 |
| 10-30% | 🟡 警告 | 人工 spot-check |
| ≥ 30% | 🔴 失败 | 该子 Agent 单独重写 |

---

## 4. W2 实施时的执行流程

1. **子 Agent 写完 1 课后**: 立即跑 `dedup_outline.mjs`（粗筛）
2. **W2 全部 15 课写完后**: 跑 `dedup_content.mjs`（精筛）
3. **W2.Z 验收前**: 任何 ≥ 30% 重复必须修复

---

## 5. 已知高风险对子（需主动避让）

| W2 课 | 高风险老课 | 重叠点 |
|------|-----------|--------|
| L50 工业 RAG | L18 RAG 基础 + L31 进阶 RAG + L39-L48 10 课 RAG | RAG 基础概念 |
| L51 工业 Agent | L19/L21/L22/L27 Agent 系列 | Agent 基础概念 |
| L55 SFT 工程化 | L25 DeepSeek 拆解 + L26 LoRA 基础 | SFT/LoRA 概念 |
| L58 DPO 系列 | L28 RLHF/DPO | RLHF/DPO 基础 |
| L59 模式对比 | L27 Agent Skill | ReAct 概念 |
| L60 Multi-Agent | L22 Agent 协作 | 协作模式 |

**避让策略**: W2 课默认假设读者已掌握老课，**不再展开基础概念**，直接深入工业级实现。

---

## 6. 工具脚本依赖

| 脚本 | 用途 | 状态 |
|------|------|:----:|
| `scripts/dedup_outline.mjs` | outline 相似度 | ⏳ W2.A 启动前需补 |
| `scripts/dedup_content.mjs` | 内容相似度 | ⏳ W2.A 启动前需补 |

**当前 3 个 scripts 已就绪** (inspect_lessons.mjs / gap_eval.mjs / md_to_lesson.mjs)，**dedup_*.mjs 需在 W2 实施前补**。

---

## 7. 修订历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-06-16 | 初版, outline + content 双重检测 |
