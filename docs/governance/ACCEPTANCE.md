# AI 教案 — 验收门槛 & 出门条件 (Acceptance Criteria)

| 字段 | 内容 |
|------|------|
| 文档版本 | v2.1 |
| 创建日期 | 2026-06-10 |
| 更新日期 | 2026-06-15 |
| 验收范围 | M11 W1 (已完成) + M11 W2 (待验收) |
| 出门条件 | 满足全部 P0 + P1 + 9 专题覆盖 ≥ 30% |

---

## 1. 验收流程

```
代码合并 → 自动构建 → 自动化检查 (inspect_lessons) → curl 验证 → 人工抽检 → 审计签字 → 出门
  ↓          ↓                    ↓                       ↓           ↓           ↓
  git       Vite build    63 课实测字数/代码/引用     77 路由200  3 课抽样    项目组
  commit    <4s, 0 错    总字数 ≥42 万              含回归       500 字/课   评审
```

**M11 W2 新增自动化**:
- `inspect_lessons.mjs` 实测 63 课字数/代码/引用
- `curl` 循环验证 77 路由 (63 课 + 9 工具 + 5 静态)
- `gap_eval.mjs` 复算 9 专题覆盖率

---

## 2. 自动化验收门槛 (MUST PASS)

### 2.1 构建门槛

| 检查项 | 命令 | 通过条件 |
|--------|------|----------|
| Vite build | `npx vite build` | 退出码 0, 输出 "✓ built in <4s" |
| Bundle 大小 | `ls -la dist/assets/index-*.js` | ≤ 2MB (gzipped ≤ 800KB) |
| 路由 200 | `curl -s -o /dev/null -w "%{http_code}" <url>` | 77/77 返回 200 |
| 63 课路由 | 循环 63 次 | 63/63 返回 200 |

**W2 路由清单** (77 路由):
- `/`、`/outline`、`/plan`、`/standalone`、`/jupyter`、`/progress` (6 主路由)
- `/lesson/L01` ... `/lesson/L63` (63 课程路由)
- `/editor/L01`、`/quiz/L01` (2 课程子路由, 抽样验证)
- `/tools/token`、`/tools/search`、`/tools/errors`、`/tools/playground`、`/tools/rag`、`/tools/knowledge`、`/tools/leaderboard`、`/tools/benchmark`、`/tools/tutor` (9 工具路由)

### 2.2 数据完整性门槛 (W2 强化)

| 检查项 | 工具 | 通过条件 |
|--------|------|----------|
| 63 课数据 | `node scripts/inspect_lessons.mjs` | 63/63 JSON 可解析 |
| 总中文字符 | 同上 | **≥ 42 万** (W2 累计) |
| W2 新增 (L49-L63) | 同上 | **≥ 18 万** (15 课) |
| 每课 W2 字数 | 同上 | **≥ 8,000** (W2.A/B/C 单课) |
| 每课章节数 | 同上 | **≥ 3** |
| 每课代码示例 | 同上 | **≥ 4** |
| 每课引用 | 同上 | **≥ 5** |
| placeholder 检测 | `grep -E "TODO\|占位\|模拟数据" src/data/lessons_new.jsx` | **0 命中** |

**W2 强化要求**:
- W2.A (L49-L54) 每课 `industryPractice` ≥ 1 真实公司名
- W2.B (L55-L58) 每课 `openSourceRepo` ≥ 1 github.com 链接
- W2.C (L59-L63) 每课 `agentFramework` ≥ 1 真实框架名

### 2.3 外链验证门槛

```bash
# 验证所有引用 URL
python3 verify_links.py  # 沿用 M5 脚本
# 通过条件: 63 课 × 平均 8 条 ≈ 500 个 URL 全部 HTTP 200/301/302
```

**抽样规则**:
- arXiv 链接 100% curl 验证
- 官方文档 100% curl 验证
- GitHub 仓库 50% 抽样 + 浏览器人工验证
- 视频/博客链接 100% curl 验证

### 2.4 9 专题覆盖率门槛 (W2 新增)

| 主题 | W1 后覆盖率 | W2 目标 | 验证方法 |
|------|-----------:|--------:|----------|
| 基础篇 | 20% | 20% (维持) | gap_eval.mjs |
| Transformer/NLP | 17% | 17% (维持) | gap_eval.mjs |
| RAG 篇 | 48% | 48% (维持, W1 主战场) | gap_eval.mjs |
| 微调篇 | 9% | **≥ 35%** ⬆ | gap_eval.mjs |
| DeepSeek/前沿 | 9% | 9% (W3 跟进) | gap_eval.mjs |
| Agent 篇 | 7% | **≥ 30%** ⬆ | gap_eval.mjs |
| 行业/项目/公司 | 2% | **≥ 15%** ⬆⬆ | gap_eval.mjs |
| 部署/推理/分布式 | N/A (AI 超) | N/A (维持) | gap_eval.mjs |
| 工具/实践/评测 | N/A (AI 超) | N/A (维持) | gap_eval.mjs |
| **9 专题总覆盖** | **16.8%** | **≥ 30%** ⬆ | gap_eval.mjs |

---

## 3. 功能验收门槛 (M11 W2 沿用)

### 3.1 核心路径 (用户故事 1: 应届生线性学习)

| 步骤 | 操作 | 通过条件 |
|------|------|----------|
| 1 | 访问 `/` | 看到 **63 课** 网格 + Week 1-25 分组 |
| 2 | 点击 L49 (W2 新课) | URL 变 `/lesson/L49`, 看到完整内容 |
| 3 | 滚动到代码示例 | 代码块可见, 有复制按钮 |
| 4 | 点击"代码练习" | URL 变 `/editor/L49`, 看到编辑器 |
| 5 | 点击"运行" | Pyodide 加载 → 输出显示 |
| 6 | 返回点击"开始测验" | URL 变 `/quiz/L49`, 看到 10 题 |
| 7 | 完成测验 | 看到得分 + 错题 |
| 8 | 访问 `/progress` | 看到 L49 已完成 + 测验得分 |

**通过标准**: 8 步全部成功, 无白屏, 无 console error。

### 3.2 跨课跳转 (W1 沿用)

| 步骤 | 操作 | 通过条件 |
|------|------|----------|
| 1 | 访问 `/lesson/L39` | 看到 RAG 三范式内容 |
| 2 | 点击 crossRef `L40` | URL 变 `/lesson/L40` |
| 3 | 验证内容切换 | RAG 优化策略 |

### 3.3 dark mode (沿用)

| 步骤 | 操作 | 通过条件 |
|------|------|----------|
| 1 | 任意页面点击"🌙 暗色" | 整个站点背景变深 |
| 2 | 刷新页面 | 主题保持 |
| 3 | 点击"☀️ 亮色" | 回到浅色 |

---

## 4. 非功能性验收门槛 (沿用)

### 4.1 性能

| 指标 | 目标 | 测量 |
|------|------|------|
| 首屏渲染 | < 2s | Lighthouse |
| 路由切换 | < 200ms | Performance API |
| Pyodide 首次加载 | < 15s | Performance API |
| Vite build | < 4s (W2 增量) | Vite 输出 |
| Lighthouse 性能分 | ≥ 80 | Lighthouse CI |

### 4.2 兼容性

| 浏览器 | 版本 | 通过条件 |
|--------|------|----------|
| Chrome | ≥ 120 | 渲染正确 + Pyodide 运行 |
| Edge | ≥ 120 | 同上 |
| Safari | ≥ 17 | 同上 |
| Firefox | ≥ 120 | 同上 (待验证) |

### 4.3 可访问性 (基础)

- 文字对比度 ≥ 4.5:1
- 键盘 Tab 可导航
- alt 属性完整 (图片)
- 标题层级正确 (h1 > h2 > h3)

---

## 5. 文档验收门槛 (M11 W2)

| 文档 | 路径 | 验收标准 |
|------|------|----------|
| PRD v2.2 | `docs/governance/PRD.md` | **W2 需求完整, L49-L63 拆解, 76K+50K+61K 字数预算** |
| 目标架构 v2.2 | `docs/governance/ARCHITECTURE.md` | **63 课路由 + 9 工具路由 + 5 静态路由, 新增 inspect_lessons.mjs** |
| 项目里程碑 v2.0 | `docs/governance/MILESTONES.md` | **M11 W1 完成 + W2 启动 + W2.A/B/C/Z 子任务清单** |
| 验收门槛 v2.1 (本) | `docs/governance/ACCEPTANCE.md` | **W2 量化门槛 + 9 专题覆盖率门槛** |
| drawio Gap v2.0 | `docs/governance/diagrams/GAP_DRAWIO.md` | **W2 目标 vs 现状 + 4 图齐全** |
| W2 差距重评估 | `docs/governance/M11_W2_GAP_REEVALUATION.md` | **W1 实测数据 + W2 优先级** |
| W2 阶段报告 | `docs/governance/M11_W2A_INDUSTRY_REPORT.md` 等 | **W2.A/B/C 各 1 份** |
| W2 端到端验收 | `docs/governance/M11_W2_ACCEPTANCE.md` | **63 课全过 + 覆盖率 ≥ 30%** |

---

## 6. 出门条件 (DoD) - M11 W2

### 6.1 内容 (P0)

- [ ] L49-L63 全部 15 课生成, 实测通过
- [ ] 每课字数 ≥ 8,000, 代码 ≥ 4, 引用 ≥ 5
- [ ] 无 placeholder 文本污染 (W1 教训)
- [ ] W2.A (L49-L54) 每课含 ≥ 1 真实公司名 (字节/阿里/腾讯/百度/美团/DeepSeek)
- [ ] W2.B (L55-L58) 每课含 ≥ 1 github.com 链接 (trl/peft/unsloth)
- [ ] W2.C (L59-L63) 每课含 ≥ 1 真实框架名 (AutoGen/CrewAI/LangGraph)
- [ ] 总字数增量 ≥ 18 万 (累计 ≥ 42 万)

### 6.2 工程 (P0)

- [ ] `npx vite build` 0 错误, < 4s
- [ ] 63 课路由 `/lesson/Lxx` 全部 200
- [ ] 9 工具路由全 200
- [ ] 5 静态路由全 200
- [ ] 老课 L01-L48 全部 200 (无回归)
- [ ] `inspect_lessons.mjs` 跑通 63 课

### 6.3 文档 (P0)

- [ ] PRD/ARCHITECTURE/MILESTONES/ACCEPTANCE 更新到 v2.x
- [ ] GAP_DRAWIO 更新到 v2.0
- [ ] M11_W2A/B/C 报告
- [ ] M11_W2_ACCEPTANCE.md 端到端验收
- [ ] M11_W2_GAP_REEVALUATION.md 复算

### 6.4 覆盖率 (SHOULD)

- [ ] 9 专题总覆盖率 ≥ 30%
- [ ] 项目方案/公司落地覆盖率 ≥ 15% (从 2%)
- [ ] 微调篇覆盖率 ≥ 35% (从 9%)
- [ ] Agent 篇覆盖率 ≥ 30% (从 7%)

### 6.5 风险审计 (P0)

- [ ] 单 Agent stall < 1 次
- [ ] 无假验收风险 (3 课人工 spot-check 通过, 每课 ≥ 500 字抽样)
- [ ] 引用 URL 100% 实测可访问
- [ ] W1 教训闭环: placeholder 检测 + 强制 3 课人工抽样

---

## 7. 验收签字 (W2)

| 角色 | 姓名 | 日期 | 签字 |
|------|------|------|------|
| 产品 |  |  |  |
| 技术 |  |  |  |
| 内容 |  |  |  |
| 测试 |  |  |  |

---

## 8. 验收失败处理

如果任意 P0 项不通过:
1. 记录到 `docs/governance/ISSUES.md` (若不存在则创建)
2. 评估影响范围 (仅 W2 / 影响后续 M11 W3+)
3. 决定: 修复后重新验收 / 接受遗留 (升级为 M11 W3 任务)

如果覆盖率 SHOULD 项不通过 (但 P0 内容全过):
- 记录到 W3 backlog, W3 优先补缺口主题

---

## 9. 验收检查清单 (Quick Run - W2)

```bash
# 1. 构建
cd /Users/Zhuanz/Desktop/workspace/1-AI教案
npx vite build 2>&1 | tail -5

# 2. 启动
lsof -ti:3000 | xargs kill -9 2>/dev/null
sleep 1
nohup npx vite preview --port 3000 --host > /tmp/vite.log 2>&1 &
sleep 3

# 3. 路由 (主 + 工具 + 静态)
for path in / /outline /plan /standalone /jupyter /progress \
            /tools/token /tools/search /tools/errors /tools/playground \
            /tools/rag /tools/knowledge /tools/leaderboard /tools/benchmark /tools/tutor; do
  /usr/bin/curl -s -o /dev/null -w "$path: %{http_code}\n" "http://localhost:3000$path"
done

# 4. 63 课路由
for i in $(seq -w 1 63); do
  lid=$(printf "L%02d" $((10#$i)))
  /usr/bin/curl -s -o /dev/null -w "$lid: %{http_code}\n" "http://localhost:3000/lesson/$lid"
done

# 5. 数据完整性 (W2 强化版: inspect_lessons.mjs)
node scripts/inspect_lessons.mjs 2>&1 | tail -20

# 6. placeholder 检测 (W1 教训)
grep -E "TODO|占位|模拟数据" src/data/lessons_new.jsx
echo "placeholder check: $?"

# 7. 9 专题覆盖率 (W2 新增)
node scripts/gap_eval.mjs 2>&1 | tail -25

# 8. 截图
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --headless --disable-gpu --no-sandbox --window-size=1280,800 \
  --screenshot=/tmp/home.png --virtual-time-budget=8000 \
  http://localhost:3000/ 2>&1 | tail -1
ls -la /tmp/home.png
```

---

## 10. 审计记录

### 10.1 M11 W1 审计 (2026-06-15) ✅

- **评分**: 92/100 (W1 验收通过)
- **关键发现**:
  - 5/5 量化门槛全过 (课数 12/12, 总字 40.1 万, 每课 8K+, 每课代码 4+, 每课引用 5+)
  - 25 路由全 200 (12 新 + 4 旧 + 9 工具)
  - build 2.92s
- **遗留问题**:
  - L47 placeholder 污染 (已修复)
  - 单 Agent stall 1458s (已自动恢复)
- **结论**: PASS - 进入 W2

### 10.2 M11 W2 审计 (进行中, 2026-06-30 目标) ⏳

#### 10.2.1 W2.A 审计 (W2.A 完成时)

- **方法**: inspect_lessons.mjs 6 课实测 + curl 6 路由
- **必查**: industryPractice 字段非空 + 真实公司名
- **审计输出**: M11_W2A_INDUSTRY_REPORT.md

#### 10.2.2 W2.B 审计 (W2.B 完成时)

- **方法**: inspect_lessons.mjs 4 课实测 + curl 4 路由
- **必查**: openSourceRepo 字段含 github.com
- **审计输出**: M11_W2B_FT_REPORT.md

#### 10.2.3 W2.C 审计 (W2.C 完成时)

- **方法**: inspect_lessons.mjs 5 课实测 + curl 5 路由
- **必查**: agentFramework 字段含真实框架名
- **审计输出**: M11_W2C_AGENT_REPORT.md

#### 10.2.4 W2.Z 端到端审计 (W2 全部完成时)

- **方法**: 全部 77 路由 + 63 课实测 + 9 专题覆盖率
- **必查**: 6.1-6.5 全部出门条件
- **审计输出**: M11_W2_ACCEPTANCE.md
- **结论必须**: PASS → 进入 M11 W3 / FAIL → 修复重验

### 10.3 最终独立审计结论 (W2 后, 估)

| 维度 | W1 评分 | W2 目标 |
|------|--------:|--------:|
| 文档结构完整性 | 95/100 | 95/100 |
| FR/NFR 覆盖 | 95/100 | 95/100 |
| 任务可执行性 | 90/100 | 95/100 (W2 拆 3 Agent 更细) |
| 文档间一致性 | 95/100 | 95/100 |
| 量化验收标准 | 85/100 | 95/100 (inspect_lessons 硬验收) |
| 风险与降级 | 85/100 | 90/100 (placeholder 闭环) |
| **综合** | **92/100** | **94/100** |

---

## 11. 与 M5/M8 旧版对比 (W2 视角)

| 维度 | M5/M8 旧版 | M11 W2 新版 |
|------|----------|-------------|
| 课程数 | 24-35 | **63** |
| 工具数 | 8 | 9 (含 AITutor) |
| 总字数 | 21-24 万 | **44 万** |
| 验收方法 | 人工 spot-check | **inspect_lessons.mjs 自动化** |
| 风险控制 | 文档声明 | **W1 教训闭环** (placeholder 检测) |
| 覆盖率评估 | 1/0 命中估算 | **按字数实测** (gap_eval.mjs) |
| 子阶段 | 4 (M5/M6/M7/M8) | **W2.A/B/C/Z 4 阶段** |

**M11 W2 是首个用"实测覆盖率"作为出门条件**的阶段, 标志着项目验收从"估算"走向"硬数据"。
