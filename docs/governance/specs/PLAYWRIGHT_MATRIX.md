# Playwright 截图测试矩阵 (Playwright Test Matrix)

| 字段 | 内容 |
|------|------|
| 任务 ID | M5-T12 |
| 文档版本 | v1.0 |
| 创建日期 | 2026-06-10 |
| 估计工时 | 2h |
| 优先级 | P2 |

---

## 1. 目标

用 Playwright 自动化截图所有关键页面 + 核心交互流程，作为视觉回归基线。

---

## 2. 测试矩阵

### 2.1 页面截图（16 个测试）

| # | 测试名 | URL | 截图路径 | 验证点 |
|---|--------|-----|----------|--------|
| 1 | `home-desktop` | `/` | `screenshots/01-home.png` | 24 课网格 + 4 入口卡片 + dark toggle |
| 2 | `home-dark` | `/` + 点击 toggle | `screenshots/02-home-dark.png` | 主题切换生效 |
| 3 | `lesson-l01` | `/lesson/L01` | `screenshots/03-lesson-l01.png` | 标题 + 章节 + 代码 + 参考 |
| 4 | `lesson-l10` | `/lesson/L10` | `screenshots/04-lesson-l10.png` | CNN 课程 + 配图 |
| 5 | `lesson-l17` | `/lesson/L17` | `screenshots/05-lesson-l17.png` | LLM 课程 + 数学公式 |
| 6 | `lesson-l21` | `/lesson/L21` | `screenshots/06-lesson-l21.png` | 多 Agent + 架构图 |
| 7 | `lesson-l24` | `/lesson/L24` | `screenshots/07-lesson-l24.png` | 职业规划 + 表格 |
| 8 | `lesson-l19` | `/lesson/L19` | `screenshots/08-lesson-l19.png` | **关键** JSON 修复后渲染 |
| 9 | `editor-l01` | `/editor/L01` | `screenshots/09-editor-l01.png` | 代码编辑器 + Pyodide 按钮 |
| 10 | `quiz-l01` | `/quiz/L01` | `screenshots/10-quiz-l01.png` | 测验题 + 选项 |
| 11 | `progress-empty` | `/progress` | `screenshots/11-progress-empty.png` | 空进度 |
| 12 | `outline` | `/outline` | `screenshots/12-outline.png` | 12 周大纲 + topic-tags |
| 13 | `plan` | `/plan` | `screenshots/13-plan.png` | 开发计划静态页 |
| 14 | `standalone` | `/standalone` | `screenshots/14-standalone.png` | 独立课件 |
| 15 | `jupyter` | `/jupyter` | `screenshots/15-jupyter.png` | Jupyter 演示 |
| 16 | `not-found` | `/lesson/L99` | `screenshots/16-not-found.png` | 404 优雅处理 |

### 2.2 交互流程（5 个测试）

| # | 测试名 | 步骤 | 验证点 |
|---|--------|------|--------|
| 17 | `flow-home-to-lesson` | 访问 `/` → 点 L01 卡片 | URL 变 `/lesson/L01` |
| 18 | `flow-run-code` | 访问 `/editor/L01` → 输入 `print("hello")` → 点运行 | 输出显示 `hello` |
| 19 | `flow-quiz-complete` | 访问 `/quiz/L01` → 答完 10 题 → 提交 | 显示得分 |
| 20 | `flow-progress-after` | 完成 quiz → 访问 `/progress` | 看到 L01 得分 |
| 21 | `flow-dark-persist` | 访问 `/` → 点 dark toggle → 刷新 | 主题保持 |

### 2.3 兼容性（3 个测试）

| # | 测试名 | 视口 | 截图路径 |
|---|--------|------|----------|
| 22 | `mobile-home` | 375x667 | `screenshots/mobile-home.png` |
| 23 | `mobile-lesson` | 375x667 | `screenshots/mobile-lesson.png` |
| 24 | `tablet-home` | 768x1024 | `screenshots/tablet-home.png` |

---

## 3. 测试实现

### 3.1 文件路径
- `tests/screenshots.spec.ts`（TypeScript，推荐）
- 或 `tests/screenshots.spec.js`

### 3.2 Playwright 配置

```javascript
// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 800 },
  },
  reporter: 'list',
  // 必须先启动 preview server
  webServer: {
    command: 'npx vite preview --port 3000 --host',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
```

### 3.3 完整测试代码

```javascript
import { test, expect } from '@playwright/test';
import fs from 'fs';

const SCREENSHOT_DIR = 'screenshots';
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// 页面截图
test('home page', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${SCREENSHOT_DIR}/01-home.png`, fullPage: true });
});

test('dark mode toggle', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.locator('button[title="切换主题"]').click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/02-home-dark.png`, fullPage: true });
});

const lessons = ['L01', 'L10', 'L17', 'L19', 'L21', 'L24'];
for (const lid of lessons) {
  test(`lesson ${lid}`, async ({ page }) => {
    await page.goto(`/lesson/${lid}`);
    await page.waitForLoadState('networkidle');
    // 等待内容加载
    await page.waitForSelector('h1', { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(500);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/03-lesson-${lid.toLowerCase()}.png`,
      fullPage: true,
    });
  });
}

test('code editor with Pyodide', async ({ page }) => {
  await page.goto('/editor/L01');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/09-editor.png`, fullPage: true });
});

test('quiz panel', async ({ page }) => {
  await page.goto('/quiz/L01');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${SCREENSHOT_DIR}/10-quiz.png`, fullPage: true });
});

// 静态页
for (const page_name of ['outline', 'plan', 'standalone', 'jupyter']) {
  test(`static ${page_name}`, async ({ page }) => {
    await page.goto(`/${page_name}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);  // iframe 加载时间
    await page.screenshot({ path: `${SCREENSHOT_DIR}/static-${page_name}.png`, fullPage: true });
  });
}

// 交互流程
test('flow: home → lesson', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  // 点击 L01 卡片
  await page.locator('text=AI概述与历史').first().click();
  await page.waitForURL(/\/lesson\/L01/);
  expect(page.url()).toContain('/lesson/L01');
});

test('flow: run Python code', async ({ page }) => {
  await page.goto('/editor/L01');
  await page.waitForLoadState('networkidle');

  // 替换代码
  const textarea = page.locator('textarea').first();
  await textarea.fill('print("hello from playwright")');

  // 点击运行
  await page.locator('button:has-text("运行")').first().click();

  // 等待输出（Pyodide 加载约 10 秒）
  await page.waitForTimeout(15_000);

  // 验证输出包含 hello
  const body = await page.locator('body').textContent();
  expect(body).toContain('hello from playwright');

  await page.screenshot({ path: `${SCREENSHOT_DIR}/flow-code-run.png`, fullPage: true });
});

test('flow: dark mode persists', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.locator('button[title="切换主题"]').click();
  await page.waitForTimeout(500);
  // 刷新
  await page.reload();
  await page.waitForLoadState('networkidle');
  // 检查 html data-theme
  const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  expect(theme).toBe('dark');
});

// 兼容性
test('mobile home', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${SCREENSHOT_DIR}/mobile-home.png`, fullPage: true });
});

test('tablet home', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `${SCREENSHOT_DIR}/tablet-home.png`, fullPage: true });
});
```

---

## 4. 安装与运行

### Step 1: 安装 Playwright
```bash
cd /Users/Zhuanz/Desktop/workspace/1-AI教案
npm install -D @playwright/test
npx playwright install chromium --with-deps
```

### Step 2: 启动 preview server
```bash
lsof -ti:3000 | xargs kill -9 2>/dev/null
sleep 1
nohup npx vite preview --port 3000 --host > /tmp/vite.log 2>&1 &
sleep 3
```

### Step 3: 运行测试
```bash
npx playwright test 2>&1 | tail -30
```

### Step 4: 验证截图
```bash
ls -la screenshots/
# 期望：≥ 20 个 PNG，每个 > 10KB
```

---

## 5. 输出示例

```
Running 24 tests using 1 worker

  ✓ home page (1.2s)
  ✓ dark mode toggle (1.5s)
  ✓ lesson L01 (1.8s)
  ✓ lesson L10 (1.6s)
  ✓ lesson L17 (1.7s)
  ✓ lesson L19 (1.4s)
  ✓ lesson L21 (1.5s)
  ✓ lesson L24 (1.6s)
  ✓ code editor with Pyodide (1.3s)
  ✓ quiz panel (1.2s)
  ✓ static outline (2.1s)
  ✓ static plan (1.9s)
  ✓ static standalone (2.0s)
  ✓ static jupyter (2.2s)
  ✓ flow: home → lesson (1.8s)
  ✓ flow: run Python code (15.4s)
  ✓ flow: dark mode persists (2.3s)
  ✓ mobile home (1.1s)
  ✓ tablet home (1.0s)

19 passed (45s)
```

---

## 6. CI 集成

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npx playwright test
        env:
          CI: true
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: screenshots
          path: screenshots/
```

---

## 7. 验收标准

- [ ] 19 个测试全部通过
- [ ] ≥ 16 张截图生成，每张 > 10KB
- [ ] flow-code-run 验证 Pyodide 真实运行 Python
- [ ] dark mode 测试通过
- [ ] 移动端截图正常（无水平滚动条）

---

## 8. 已知限制

- Pyodide 首次加载慢（10-15秒），需更长 timeout
- GitHub Pages/Vercel 部署时 baseURL 需改
- iframe 内页面（静态页）截图需额外等待

---

## 9. 扩展（未来）

- 视觉回归：pixelmatch 对比新旧截图
- 性能审计：Lighthouse CI
- 可访问性：axe-core 集成
- 跨浏览器：Firefox / WebKit / Safari