# M5 开发与验收大纲 (Development & Acceptance Plan)

| 字段 | 内容 |
|------|------|
| 文档版本 | v1.0 |
| 创建日期 | 2026-06-10 |
| 覆盖任务 | M5-T1 ~ M5-T14 + M5 治理项 |
| 周期 | 2026-06-10 → 2026-06-30 (3 周) |

---

## 1. 任务清单（按依赖顺序）

### 阶段 1：紧急修复（Week 1，06-10 → 06-15）

| ID | 任务 | 依赖 | 工时 | 文档参考 |
|----|------|------|------|----------|
| **T1** | 修复 L19 JSON 损坏 | 无 | 0.5h | `specs/L19_FIX_PLAN.md` |
| **T2** | Service Worker 离线缓存 | T1 | 2h | `specs/RUNTIME_QUALITY.md §1` |
| **T3** | Pyodide 入口暴露到 LessonContent | T2 | 2h | `specs/PYODIDE_EXPOSURE.md` |

### 阶段 2：内容深化（Week 1-2，06-12 → 06-20）

| ID | 任务 | 依赖 | 工时 | 文档参考 |
|----|------|------|------|----------|
| **T4** | L19 内容补全 | T1 | 2h | `specs/CONTENT_TEMPLATE.md` |
| **T5** | L18 内容扩充到 ≥ 4500 字 | 无 | 1h | `specs/CONTENT_TEMPLATE.md §4` |
| **T6** | L20 内容扩充到 ≥ 4500 字 | 无 | 1h | `specs/CONTENT_TEMPLATE.md §4` |
| **T7** | L22 内容扩充到 ≥ 5000 字 | 无 | 1h | `specs/CONTENT_TEMPLATE.md §4` |
| **T8** | L23 内容扩充到 ≥ 4500 字 | 无 | 1h | `specs/CONTENT_TEMPLATE.md §4` |

### 阶段 3：用户体验（Week 2，06-15 → 06-22）

| ID | 任务 | 依赖 | 工时 | 文档参考 |
|----|------|------|------|----------|
| **T9** | 测验错题回顾 + 上次得分 UI | T1 | 1.5h | `specs/RUNTIME_QUALITY.md §2` |
| **T10** | Progress 页完整显示 | T9 | 1.5h | `specs/RUNTIME_QUALITY.md §3` |
| **T11** | 响应式断点 3 档实现 | 无 | 2h | `specs/RUNTIME_QUALITY.md §4` |

### 阶段 4：质量门（Week 3，06-20 → 06-30）

| ID | 任务 | 依赖 | 工时 | 文档参考 |
|----|------|------|------|----------|
| **T12** | 链接验证脚本 | 无 | 1h | `specs/VERIFY_LINKS.md` |
| **T13** | Playwright 截图矩阵 | T3, T9, T10, T11 | 2h | `specs/PLAYWRIGHT_MATRIX.md` |
| **T14** | 单元测试（Vitest） | 无 | 2h | `specs/RUNTIME_QUALITY.md §6` |
| **T15** | CSP 安全配置 | T13 | 1h | `specs/RUNTIME_QUALITY.md §7` |
| **T16** | 性能测量脚本 | T3 | 1h | `specs/RUNTIME_QUALITY.md §5` |
| **T17** | M5 总验收 | T1-T16 | 1h | `ACCEPTANCE.md §6` |

**总工时：22.5 小时（约 3 个工作日）**

---

## 2. 验收大纲（按 PRD FR / NFR 逐条）

### 2.1 功能性验收

#### FR-CM 内容模块

| ID | 验收项 | 通过条件 | 验证方式 |
|----|--------|----------|----------|
| FR-CM-1 | 24 课数据完整 | 24/24 JSON.parse 不抛异常 | `python3 audit_lessons.py` |
| FR-CM-2 | 每课≥3 代码含 pip | 24 课 × 3 = 72 个代码块 | grep "pip install" |
| FR-CM-3 | 每章≥1500 字 + 直觉/陷阱 | 24 课全部达标 | `sum(len(s.content)) ≥ 4500` |
| FR-CM-4 | 100% URL 可达 | arXiv 100% / GitHub ≥ 50% | `verify_links.py` |
| FR-CM-5 | Markdown 渲染 | 章节含 `<pre>`/`<table>`/`<img>` 正常 | Chrome 截图 |

#### FR-CE 代码执行

| ID | 验收项 | 通过条件 | 验证方式 |
|----|--------|----------|----------|
| FR-CE-1 | 浏览器内 Pyodide 运行 | 课程详情代码块点击"运行"输出 | Playwright `flow-run-code` |
| FR-CE-2 | WebWorker 不阻塞 UI | 运行时可切换路由 | Playwright 交互测试 |
| FR-CE-3 | stdout/stderr 显示 | 错误信息可见 | Playwright 故意运行错代码 |
| FR-CE-4 | 离线缓存 | 断网后 Pyodide < 1s | DevTools 离线模式 |

#### FR-QZ 测验系统

| ID | 验收项 | 通过条件 | 验证方式 |
|----|--------|----------|----------|
| FR-QZ-1 | 240 题 4 题型 | 24 课 × 10 题 | `len(questions)` |
| FR-QZ-2 | 成绩写 IndexedDB | 完成后刷新保留 | Playwright 流程测试 |
| FR-QZ-3 | 错题回顾 + 上次得分 | QuizPanel 完成页可见错题 | Playwright + Chrome 截图 |
| FR-QZ-4 | ID 统一 L01-L24 | questions.json 键名一致 | `python3 check_keys.py` |

#### FR-PR 进度追踪

| ID | 验收项 | 通过条件 | 验证方式 |
|----|--------|----------|----------|
| FR-PR-1 | checkbox 写 localStorage | 完成后刷新保留 | Playwright |
| FR-PR-2 | 首页每周进度条 | 6 周显示 | Chrome 截图 |
| FR-PR-3 | `/progress` 完整 | 总览/周进度/测验统计可见 | Chrome 截图 |
| FR-PR-4 | SM-2 工具就绪 | `vitest run` 通过 | 单测输出 |

#### FR-UX UI/UX

| ID | 验收项 | 通过条件 | 验证方式 |
|----|--------|----------|----------|
| FR-UX-1 | dark/light 切换 + 保留 | toggle 工作 + 刷新保持 | Playwright |
| FR-UX-2 | 3 档响应式 | Mobile/Tablet/Desktop 三档截图 | Playwright matrix |
| FR-UX-3 | 9 路由全 200 | curl 全部 200 | curl test loop |
| FR-UX-4 | 大纲页 96 链接 | 全部 `target=_top` | grep + 浏览器测试 |

> **FR-UX-3 路由数澄清**：「9 路由」=8 个静态路由（`/`、`/outline`、`/plan`、`/standalone`、`/jupyter`、`/progress`、`/editor/:id`、`/quiz/:id`）+ `/lesson/:id` 一个动态路由族（24 课）。验收 = 8 静态 + 24 动态 = 32 URL 全部返回 200，加上 `/lesson/L23` 等已被 M5-T1 修复，共 33 URL。

#### FR-SD 静态文档

#### FR-SD 静态文档

| ID | 验收项 | 通过条件 | 验证方式 |
|----|--------|----------|----------|
| FR-SD-1 | 4 静态页 iframe | 4 路由 200 | curl |
| FR-SD-2 | 大纲页 96 链接 | 全部跳转 | Playwright |
| FR-SD-3 | public/ 服务 | HTTP 200 | curl |

### 2.2 非功能性验收

#### NFR-PF 性能

| 指标 | 目标 | 验证 |
|------|------|------|
| First Contentful Paint | < 1.5s | Lighthouse / perf_measure.js |
| 路由切换 | < 200ms | Performance API |
| Pyodide 首次加载 | < 15s | 消息时间戳 |
| Lighthouse 性能分 | ≥ 80 | Lighthouse CI（未来）|

#### NFR-US 可用性

| 浏览器 | 版本 | 验证 | 安装命令 |
|--------|------|------|----------|
| Chrome | ≥ 120 | Playwright Chromium | `npx playwright install chromium` |
| Edge | ≥ 120 | Playwright Chromium（复用）| 同上 |
| Safari | ≥ 17 | Playwright WebKit | `npx playwright install webkit` |
| Firefox | ≥ 120 | Playwright Firefox | `npx playwright install firefox` |

**跨浏览器验收脚本**：
```bash
npx playwright install chromium webkit firefox
npx playwright test --project=chromium
npx playwright test --project=webkit
npx playwright test --project=firefox
```

#### NFR-MT 可维护性

| 指标 | 目标 | 验证 | 自动化 |
|------|------|------|--------|
| 模块化 | components/utils/data 分层 | grep import | 手动 |
| 单文件 < 500 行 | wc -l 检查 | `find src -name "*.jsx" -o -name "*.js" \| xargs wc -l` | `scripts/check-nfr-mt.sh` |
| 关键算法单测 | ≥ 70% | `vitest run --coverage` | `scripts/check-nfr-mt.sh` |

**自动验收脚本** `scripts/check-nfr-mt.sh`：
```bash
#!/bin/bash
set -e

echo "=== NFR-MT 可维护性验收 ==="

# 1. 单文件 < 500 行
echo "1. 检查单文件 < 500 行..."
VIOLATIONS=$(find src \( -name "*.jsx" -o -name "*.js" \) -not -name "*.test.js" -exec wc -l {} + | awk '$1 > 500 {print $2 ":" $1}')
if [ -n "$VIOLATIONS" ]; then
  echo "❌ 单文件超 500 行："
  echo "$VIOLATIONS"
  exit 1
fi
echo "✓ 所有源文件 < 500 行"

# 2. 测试覆盖率 ≥ 70%
echo "2. 检查测试覆盖率 ≥ 70%..."
npx vitest run --coverage 2>&1 | tee /tmp/coverage.txt
COVERAGE=$(grep -oP "All files.*?(\d+\.\d+)" /tmp/coverage.txt | grep -oP "\d+\.\d+" | tail -1)
if (( $(echo "$COVERAGE < 70" | bc -l) )); then
  echo "❌ 测试覆盖率 $COVERAGE% < 70%"
  exit 1
fi
echo "✓ 测试覆盖率 $COVERAGE% ≥ 70%"

# 3. 模块化分层
echo "3. 检查模块化分层..."
COMP=$(find src/components -name "*.jsx" 2>/dev/null | wc -l)
UTIL=$(find src/utils -name "*.js" 2>/dev/null | wc -l)
DATA=$(find src/data -type f 2>/dev/null | wc -l)
echo "  components: $COMP, utils: $UTIL, data: $DATA"
[ $COMP -ge 5 ] && [ $UTIL -ge 3 ] && [ $DATA -ge 1 ] && echo "✓ 三层目录均存在" || { echo "❌ 目录结构不全"; exit 1; }
```

**执行**：`bash scripts/check-nfr-mt.sh`（T14 完成时集成进 CI）

#### NFR-SC 安全性

| 措施 | 验证 |
|------|------|
| HTTPS only | 部署后 URL |
| WebWorker 沙箱 | Pyodide 代码无 DOM 访问 |
| 不存敏感数据 | grep localStorage 用法 |
| CSP 配置 | 部署后浏览器审计无警告 |

### 2.3 用户故事端到端验收

| 故事 | 验收剧本 | 通过条件 |
|------|----------|----------|
| 应届生线性学习 | 8 步（首页→L01→代码→测验→进度→L02）| Playwright 流程通过 |
| 应用工程师定位 | 大纲页点击 topic-tag → 跳转课程 | Playwright 链接测试 |
| 自学者浏览器运行 | L17 代码块"运行"按钮 → 输出 | Playwright |
| 面试候选人评估 | 完成测验 → 错题回顾 → /progress | Playwright + Chrome 截图 |

---

## 3. 验收检查清单（DoD）

### 3.1 必做（缺一不可）

- [ ] T1 完成：L19 JSON 可解析
- [ ] T3 完成：Pyodide 在 LessonContent 可运行
- [ ] T4-T8 完成：L18/19/20/22/23 内容 ≥ 4500 字
- [ ] T9 完成：错题回顾 UI
- [ ] T10 完成：Progress 页完整
- [ ] T11 完成：3 档响应式
- [ ] T12 完成：链接验证脚本（≥ 90% URL 200）
- [ ] T13 完成：Playwright ≥ 18 个测试通过
- [ ] T14 完成：Vitest ≥ 5 个单测通过
- [ ] T15 完成：CSP 配置上线
- [ ] T17 完成：M5 总验收签字

### 3.2 验证命令

```bash
cd /Users/Zhuanz/Desktop/workspace/1-AI教案

# 1. 构建
npx vite build 2>&1 | tail -5
# 期望：✓ built in <N>s 无错

# 2. 启动 + 路由
lsof -ti:3000 | xargs kill -9 2>/dev/null
sleep 1
nohup npx vite preview --port 3000 --host > /tmp/vite.log 2>&1 &
sleep 3
for path in / /outline /plan /standalone /jupyter /progress \
            /lesson/L01 /lesson/L19 /lesson/L24 \
            /editor/L01 /quiz/L01; do
  /usr/bin/curl -s -o /dev/null -w "$path: %{http_code}\n" "http://localhost:3000$path"
done
# 期望：全部 200

# 3. 24 课数据
python3 -c "
import re, json
with open('src/data/lessons_new.jsx') as f: c = f.read()
blocks = re.split(r'\"L(\d{2})\":', c)[1:]
for i in range(0, len(blocks), 2):
    lid = 'L' + blocks[i]
    bt = blocks[i+1]
    nm = re.search(r',\s*\"L\d{2}\":', bt)
    if nm: bt = bt[:nm.start()]
    try:
        d = json.loads(bt)
        chs = len(d.get('sections', []))
        chars = sum(len(s.get('content','')) for s in d.get('sections', []))
        codes = len(d.get('codeExamples', []))
        refs = len(d.get('references', []))
        ok = chars >= 4500 and chs >= 3 and codes >= 3 and refs >= 5
        print(f\"{'✓' if ok else '✗'} {lid}: {chs}章 {chars}字 {codes}代码 {refs}参考\")
    except Exception as e:
        print(f'✗ {lid}: {e}')
"

# 4. 链接验证
python3 scripts/verify_links.py --include-questions --format text

# 5. 单测
npx vitest run

# 6. Playwright
npx playwright test

# 7. 截图（关键路径）
CHROME=/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome
for p in / /lesson/L01 /lesson/L17 /lesson/L21 /editor/L01 /quiz/L01 /progress; do
  $CHROME --headless --disable-gpu --no-sandbox --window-size=1280,4000 \
    --screenshot=/tmp/check_$(basename $p).png --virtual-time-budget=8000 \
    "http://localhost:3000$p" 2>&1 | tail -1
done
ls -la /tmp/check_*.png | awk '{print $5, $9}'
# 期望：每个 > 50KB（非空白页）
```

---

## 4. 风险与降级

| 风险 | 影响 | 降级方案 |
|------|------|----------|
| L19 修复失败 | 阻塞验收 | 用 L18 内容作为模板，LLM 重建 |
| Pyodide CDN 不可达 | 代码运行失败 | 已有降级（语法高亮 + 复制） |
| Playwright 安装失败 | 缺截图验证 | 手动 Chrome headless 截图 |
| Service Worker 注册失败 | 离线失效 | 软降级，不阻断构建 |

---

## 5. 里程碑日期

| 日期 | 事件 |
|------|------|
| 06-10 | T1 完成，L19 修复 |
| 06-12 | T3 完成，Pyodide 暴露 |
| 06-15 | T8 完成，内容深化 |
| 06-20 | T11 完成，UX 增强 |
| 06-25 | T16 完成，质量门 |
| 06-30 | **M5 验收签字** |

---

## 6. 后续路线

| 里程碑 | 任务 |
|--------|------|
| M6 | 内容完成度（L01-L12 扩到 4500+）|
| M7 | 文档化（Glossary / How-to / 任务路由）|
| M8 | 公开发布（README / Vercel / SEO）|