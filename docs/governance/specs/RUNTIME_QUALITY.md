# 运行时质量规范 (Runtime Quality Spec)

| 字段 | 内容 |
|------|------|
| 文档版本 | v1.0 |
| 创建日期 | 2026-06-10 |
| 覆盖范围 | FR-CE-4 / FR-QZ-3 / FR-PR-3 / FR-UX-2 / NFR-PF / NFR-SC / 用户故事 1/3/4 |

---

## §1. 离线缓存规范 (Service Worker) — 对应 FR-CE-4

### 1.1 目标
用户首次加载 Pyodide 后，**离线状态仍可运行代码**（不需重新下载 10MB WASM）。

### 1.2 实现方案

**文件**：`public/sw.js`

```javascript
const CACHE_VERSION = 'v1';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const PYODIDE_CACHE = `pyodide-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/assets/index.css',
  '/assets/index.js',
];

const PYODIDE_URLS = [
  'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js',
  'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.asm.wasm',
  'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/python_stdlib.zip',
];

// 安装：预缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// 激活：清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(k => k !== STATIC_CACHE && k !== PYODIDE_CACHE)
        .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch：缓存优先（Pyodide），网络优先（其他）
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (PYODIDE_URLS.some(u => event.request.url.startsWith(u.replace(/\/[^/]*$/, '')))) {
    event.respondWith(
      caches.open(PYODIDE_CACHE).then(async cache => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        const fresh = await fetch(event.request);
        cache.put(event.request, fresh.clone());
        return fresh;
      })
    );
  } else if (url.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request))
    );
  }
});
```

### 1.3 注册
在 `src/main.jsx` 顶部添加：
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(console.warn);
}
```

### 1.4 验收
- [ ] 首次访问后断网，仍能打开首页
- [ ] 首次访问后断网，Pyodide 加载 < 1 秒（命中缓存）
- [ ] 更新 `index.html` 后，新 SW 自动激活

---

## §2. 测验错题回顾 + 上次得分 UI — 对应 FR-QZ-3

### 2.1 目标
用户在课程详情或测验入口看到**上次得分、错题列表**。

### 2.2 数据来源
IndexedDB `quizzes` store 已存 `answers` 数组（含 userAnswer + correct）。

### 2.3 UI 集成方案

在 `LessonContent.jsx` 添加 "上次学习"卡片（在 actionRow 之前）：

```jsx
const [lastScore, setLastScore] = useState(null);

useEffect(() => {
  (async () => {
    try {
      const all = await progressDB.getAll();
      const mine = all.find(q => q.lessonId === lessonId);
      setLastScore(mine);
    } catch {}
  })();
}, [lessonId]);

// 渲染
{lastScore && (
  <div style={{background: '#fef3c7', padding: 12, borderRadius: 8, marginBottom: 16}}>
    📊 上次得分：<strong>{lastScore.score}/{lastScore.total}</strong>
    （{new Date(lastScore.takenAt).toLocaleDateString()}）
    <button onClick={() => navigate(`/quiz/${lessonId}`)}>🔄 再做一遍</button>
  </div>
)}
```

### 2.4 错题回顾页（QuizPanel 完成页）
在 `QuizPanel.jsx` 完成态增加错题列表：
```jsx
{answers.map((a, i) => {
  const q = questions[i];
  if (a === q.answer) return null; // 跳过答对
  return (
    <div key={i} style={{background: '#fee2e2', padding: 10, margin: 4, borderRadius: 6}}>
      <strong>Q{i+1}: {q.question}</strong>
      <div>你的答案：{a} ❌</div>
      <div>正确答案：{q.answer} ✓</div>
      <div style={{color: '#64748b'}}>解析：{q.explanation}</div>
    </div>
  );
})}
```

### 2.5 验收
- [ ] LessonContent 显示上次得分
- [ ] QuizPanel 完成页显示错题
- [ ] 数据从 IndexedDB 读出，不依赖 React state

---

## §3. Progress 页完整显示规范 — 对应 FR-PR-3

### 3.1 显示内容

| 区块 | 数据源 | 说明 |
|------|--------|------|
| 总览 | localStorage 24 个 `lesson-completed-*` 键 | 已完成/总数 + 进度环 |
| 各周进度 | WEEK_GROUPS | 6 周 × 完成数 |
| 测验统计 | IndexedDB quizzes store | 平均分、最高分、最近 5 次 |
| 知识点掌握 | IndexedDB 错题统计 | 错误最多的知识点 |
| 学习时长 | localStorage `lesson-time-spent` | 累计分钟（可选）|

### 3.2 组件结构

```jsx
// src/components/Progress.jsx
function Progress() {
  const [overview, setOverview] = useState({completed: 0, total: 24});
  const [quizStats, setQuizStats] = useState({avg: 0, max: 0, recent: []});
  const [weekProgress, setWeekProgress] = useState([]);

  useEffect(() => {
    (async () => {
      // 1. 读 localStorage
      const completed = [];
      for (let i = 1; i <= 24; i++) {
        if (localStorage.getItem(`lesson-completed-L${String(i).padStart(2,'0')}`) === 'true') {
          completed.push(`L${String(i).padStart(2,'0')}`);
        }
      }
      setOverview({completed: completed.length, total: 24, list: completed});

      // 2. 读 IndexedDB quizzes
      const quizzes = await progressDB.getAllQuizzes?.() || [];
      if (quizzes.length) {
        const scores = quizzes.map(q => q.score / q.total);
        setQuizStats({
          avg: (scores.reduce((a,b)=>a+b,0) / scores.length * 100).toFixed(0),
          max: Math.max(...scores) * 100,
          recent: quizzes.slice(-5).reverse()
        });
      }

      // 3. 计算周进度
      setWeekProgress(WEEK_GROUPS.map(w => ({
        label: w.label,
        completed: w.lessons.filter(id => completed.includes(id)).length,
        total: w.lessons.length,
      })));
    })();
  }, []);

  return (
    <div>
      <ProgressRing percent={overview.completed / overview.total} />
      <StatsGrid stats={quizStats} />
      <WeekProgress data={weekProgress} />
      <RecentQuizzes data={quizStats.recent} />
    </div>
  );
}
```

### 3.3 验收
- [ ] 显示总览（环 + 数字）
- [ ] 显示 6 周进度条
- [ ] 显示测验统计
- [ ] 完成 1 课后刷新能看到进度变化

---

## §4. 响应式断点规范 — 对应 FR-UX-2

### 4.1 三档断点

| 断点 | 宽度 | 适用设备 | 行为 |
|------|------|----------|------|
| Mobile | < 640px | 手机 | 单列；导航栏折叠成汉堡；字号缩小 |
| Tablet | 640-1024px | 平板/iPad | 单列；导航保持横排；卡片 2 列 |
| Desktop | > 1024px | 桌面 | 卡片 3-4 列；完整布局 |

### 4.2 实现策略（适配本项目 inline-style 风格）

**挑战**：本项目组件大量使用 React inline style（`style={{...}}`），而 `@media` 查询**无法在 inline style 中直接生效**。

**解决方案**：采用 **CSS 变量 + 容器查询（container queries）** 的混合策略：

#### 方案 A：CSS 变量（推荐）
在 `index.html` 的 `<style>` 中定义断点相关变量，inline style 引用：

```css
/* index.html <style> 内 */
:root {
  --bp-padding: 12px;          /* Mobile 默认 */
  --bp-card-min: 100%;         /* Mobile 单列 */
  --bp-grid-cols: 1;
}

@media (min-width: 640px) {
  :root {
    --bp-padding: 20px;
    --bp-card-min: calc(50% - 8px);  /* Tablet 双列 */
    --bp-grid-cols: 2;
  }
}

@media (min-width: 1024px) {
  :root {
    --bp-padding: 32px;
    --bp-card-min: 280px;
    --bp-grid-cols: 4;
  }
}
```

然后组件中：
```jsx
<div style={{
  padding: 'var(--bp-padding)',
  gridTemplateColumns: 'repeat(auto-fill, minmax(var(--bp-card-min), 1fr))',
}}>
```

#### 方案 B：CSS className 混合（用于关键组件）
对核心布局（首页网格、课程详情容器）添加 className，CSS 处理断点：

```jsx
<div className="lesson-grid">
  {lessons.map(...)}
</div>
```

```css
.lesson-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}
@media (min-width: 640px) {
  .lesson-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .lesson-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
}
```

**T11 实施时**：优先方案 A（侵入最小），对方案 B 仅在 CSS 变量无法表达时使用。

### 4.3 验收（用 Playwright 矩阵中的 mobile/tablet 测试）
- [ ] iPhone 12 (390x844) 无水平滚动
- [ ] iPad (768x1024) 布局合理
- [ ] Desktop (1280x800) 完整布局

---

## §5. 性能验收测量 — 对应 NFR-PF

### 5.1 指标采集脚本

`scripts/perf_measure.js`（Node + Puppeteer 或浏览器手动）：

```javascript
// 使用 PerformanceObserver API（performance.timing 已被废弃）
const metrics = {
  firstPaint: 0,
  firstContentfulPaint: 0,
  domContentLoaded: 0,
  loadComplete: 0,
};

// 监听 paint 时机
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.name === 'first-paint') metrics.firstPaint = entry.startTime;
    if (entry.name === 'first-contentful-paint') metrics.firstContentfulPaint = entry.startTime;
  }
}).observe({ type: 'paint', buffered: true });

// 监听 navigation
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    metrics.domContentLoaded = entry.domContentLoadedEventEnd;
    metrics.loadComplete = entry.loadEventEnd;
  }
}).observe({ type: 'navigation', buffered: true });

const routeTimings = []; // 监听路由变化前后时间
const pyodideTimings = { start: null, ready: null };

// Pyodide: 监听 first message
window.addEventListener('message', (e) => {
  if (e.data?.type === 'status') pyodideTimings.start = performance.now();
  if (e.data?.type === 'ready') pyodideTimings.ready = performance.now();
});
```

> **注**：原 `performance.timing` API 已在 2022 年后弃用，应改用 `PerformanceObserver` + `PerformanceNavigationTiming`。

### 5.2 验收阈值

| 指标 | 目标 | 测量方法 |
|------|------|----------|
| First Contentful Paint | < 1.5s | Performance API |
| DOMContentLoaded | < 2.0s | Performance API |
| 路由切换 | < 200ms | 手动标记 |
| Pyodide 首次加载 | < 15s | 消息时间戳 |

### 5.3 输出到控制台（开发模式）
```javascript
if (import.meta.env.DEV) {
  setTimeout(() => {
    console.table({
      'FCP (ms)': metrics.firstContentfulPaint,
      'DOMContentLoaded (ms)': metrics.domContentLoaded,
      'Pyodide (ms)': pyodideTimings.ready - pyodideTimings.start,
    });
  }, 3000);
}
```

### 5.4 验收
- [ ] 实测 FCP < 1.5s（本地 4G 节流）
- [ ] 实测路由切换 < 200ms
- [ ] 实测 Pyodide 加载 < 15s

---

## §6. 单元测试规范 — 对应 NFR-MT

### 6.1 工具
- **Vitest**（Vite 原生，无需配置）
- 已在 Vite 项目中可零配置使用
- **覆盖率门槛**：≥ 70%（关键工具函数）

### 6.2 测试文件位置
`src/**/*.test.js` 与源文件同目录

### 6.3 关键模块测试用例

```javascript
// src/utils/id-normalizer.test.js
import { describe, it, expect } from 'vitest';
import { normalizeLessonId, lessonIdToNumber } from './id-normalizer';

describe('id-normalizer', () => {
  it('pads single digit', () => {
    expect(normalizeLessonId('L1')).toBe('L01');
    expect(normalizeLessonId(1)).toBe('L01');
  });
  it('keeps double digit', () => {
    expect(normalizeLessonId('L24')).toBe('L24');
  });
  it('handles plain number', () => {
    expect(normalizeLessonId('9')).toBe('L09');
  });
  it('passes through invalid', () => {
    expect(normalizeLessonId('XX')).toBe('XX');
  });
  it('converts to number', () => {
    expect(lessonIdToNumber('L17')).toBe(17);
  });
});

// src/utils/spaced-repetition.test.js
import { describe, it, expect } from 'vitest';
import { calculateNextReview } from './spaced-repetition';

describe('SM-2 algorithm', () => {
  it('fails on quality < 3', () => {
    const result = calculateNextReview(2, 5, 2.5, 10);
    expect(result.repetitions).toBe(0);
    expect(result.interval).toBe(1);
  });
  it('first success → interval 1', () => {
    const result = calculateNextReview(5, 0, 2.5, 0);
    expect(result.repetitions).toBe(1);
    expect(result.interval).toBe(1);
  });
  it('second success → interval 6', () => {
    const result = calculateNextReview(5, 1, 2.5, 1);
    expect(result.interval).toBe(6);
  });
});

// src/utils/storage.test.js
import { describe, it, expect } from 'vitest';
import { progressDB } from './storage';

describe('storage', () => {
  // 用 fake-indexeddb
  // ...
});
```

### 6.4 package.json scripts
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

### 6.5 自动检查脚本（避免手动执行遗漏）
```bash
# scripts/check-nfr-mt.sh
#!/bin/bash
# 1. 单文件 < 500 行
VIOLATIONS=$(find src -name "*.jsx" -o -name "*.js" | xargs wc -l | awk '$1 > 500 {print $2}')
if [ -n "$VIOLATIONS" ]; then
  echo "❌ 单文件超 500 行："
  echo "$VIOLATIONS"
  exit 1
fi
echo "✓ 所有源文件 < 500 行"

# 2. 测试覆盖率 ≥ 70%
npx vitest run --coverage 2>&1 | tee /tmp/coverage.txt
COVERAGE=$(grep -oP "All files.*?(\d+\.\d+)" /tmp/coverage.txt | grep -oP "\d+\.\d+")
if (( $(echo "$COVERAGE < 70" | bc -l) )); then
  echo "❌ 测试覆盖率 $COVERAGE% < 70%"
  exit 1
fi
echo "✓ 测试覆盖率 $COVERAGE% ≥ 70%"
```

### 6.6 验收
- [ ] id-normalizer 5 个测试通过
- [ ] SM-2 算法 3 个测试通过
- [ ] 关键工具函数覆盖率 ≥ 70%
- [ ] 单文件 < 500 行（`check-nfr-mt.sh` 自动验证）

---

## §7. CSP 安全配置 — 对应 NFR-SC

### 7.1 CSP 头配置

部署时（Nginx/Vercel）的 HTTP 响应头：

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval'
              https://cdn.jsdelivr.net/pyodide/v0.26.2/;
  worker-src 'self' blob:;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://cdn.jsdelivr.net/;
  frame-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
```

### 7.2 关键说明
- `unsafe-inline` 必须保留（Vite 内联 style）
- `unsafe-eval` 必须保留（Pyodide 需要）
- `worker-src blob:` 允许 Pyodide Worker
- `connect-src` 允许 jsdelivr
- 部署时通过 meta 标签（开发）或 HTTP 头（生产）

### 7.3 Nginx 配置片段
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net/pyodide/v0.26.2/; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://cdn.jsdelivr.net/" always;
```

### 7.4 Vercel 配置（vercel.json）
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net/pyodide/v0.26.2/; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://cdn.jsdelivr.net/"
        }
      ]
    }
  ]
}
```

### 7.5 验收
- [ ] 开发模式 CSP 不阻断
- [ ] 生产部署 CSP 通过浏览器审计
- [ ] Pyodide Worker 能正常加载

---

## §8. E2E 用户旅程脚本 — 对应用户故事 1/3/4

### 8.1 故事 1：应届生线性学习

**旅程**（8 步）：
1. 访问 `/` → 看到 24 课网格
2. 点击 L01 → 看到完整内容
3. 点击"代码练习" → 编辑器
4. 点击"运行" → 看到输出
5. 返回 → 点击"开始测验" → 看到 10 题
6. 完成测验 → 看到得分
7. 访问 `/progress` → 看到 L01 完成
8. 点击 L02 → 继续学习

**对应 Playwright 测试**：`tests/e2e/journey-student.spec.js`（见 PLAYWRIGHT_MATRIX.md §3.3 flow-*）

### 8.2 故事 3：自学者浏览器运行

**旅程**（4 步）：
1. 访问 `/lesson/L17` → 看到代码块
2. 点击代码块的"▶ 运行"按钮
3. Pyodide 加载 → 输出显示
4. 修改代码 → 再次运行 → 新输出

**新增**：M5-T9 暴露"运行"入口到 LessonContent 后即可。

### 8.3 故事 4：面试候选人测验评估

**旅程**（5 步）：
1. 访问 `/quiz/L01` → 答题
2. 提交 → 看到得分
3. 查看错题列表
4. 再做一遍 → 看到上次得分对比
5. 访问 `/progress` → 累积统计

---

## §9. 总体验收清单

| 检查项 | 验证方式 |
|--------|----------|
| 离线可打开首页 | 断网后访问 / |
| 离线可运行 Pyodide | 断网后 Pyodide 加载 < 1s |
| 上次得分显示 | 完成 1 课后刷新看到 |
| 错题回顾 | QuizPanel 完成页可见 |
| Progress 完整 | /progress 6 周 + 测验统计 |
| 响应式 | Mobile/Tablet/Desktop 三档 |
| 性能达标 | FCP < 1.5s |
| 单测通过 | `npm test` 全绿 |
| CSP 配置 | 部署后浏览器无警告 |