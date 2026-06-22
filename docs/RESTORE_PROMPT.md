# 给新电脑 Claude 的首条提示词

> **用法**: 把下面代码块内的内容**完整复制**到新电脑 Claude Code 的首条消息里 (粘贴后回车)。
> **作用**: 让新 Claude 知道项目背景 + 9 个待执行任务 + 用户规则, 立即恢复工作上下文。

---

```
我在另一台电脑 (新机器) 上继续 1-AI教案项目开发。请按以下步骤恢复上下文, 不要先问问题。

## 1. 项目背景 (1-AI教案)

- **项目地址**: /Users/<新用户>/Desktop/workspace/1-AI教案
- **GitHub**: https://github.com/ljx418/AI- (public, 已推送)
- **技术栈**: Vite 5 + React 18 + React Router 6 + SWC + Puppeteer
- **当前状态** (W2 完成后):
  - 63 课 (L01-L63), 41.3 万中文字符 (实测)
  - 13 个工具路由 + 9 个 静态页面路由
  - 0 page error (首页/L49/工具页 验证通过)
- **核心数据**: src/data/lessons.json (2.6MB) + src/data/lessons_new.jsx (元数据)
- **3 工具 scripts**:
  - snap.mjs (截屏 + console 验证)
  - snap_wait.mjs (异步数据后截屏)
  - inspect_lessons.mjs (字数验收)

## 2. 立即执行 (5 步验证恢复)

按 docs/RESTORE.md §9 的"一键恢复脚本"跑完后, 请执行以下 4 步验证, 每步用真实数据:

1. `node scripts/snap.mjs http://localhost:3000/ /tmp/h.png` — 期望最后一行 `✅ 页面渲染 (50xxx chars, 1 children)`
2. `node scripts/snap_wait.mjs http://localhost:3000/lesson/L49 /tmp/l.png` — 期望 `textLen: 21xxx, errors: []`
3. `node scripts/snap.mjs http://localhost:3000/tools/playground /tmp/t.png` — 期望 `✅ 页面渲染 (15xxx chars, 1 children)`
4. 检查 `git log --oneline -5` 应能看到 8894178 (V2 差距评估) 提交

任一步失败, 用 `scripts/snap_debug.mjs` 排查, 不要凭印象判断。

## 3. 9 个待执行任务 (按顺序)

请用 TaskCreate 重建以下 9 个任务, 保持 ID 顺序 (我方老电脑当前的 task list 状态):

1. ⏸ **写 PRD.md v3.0** - 锚定 yuque 100% 目标, 9 主题对标表, 阶段时间表, token 预算
2. ⏸ **写 ARCHITECTURE.md v3.0** - 9 主题课程架构, tools/sandbox/progress/ai-tutor 子模块, yuque 抓取 pipeline
3. ⏸ **写 MILESTONES.md v3.0** - W3-W7 6 个月里程碑
4. ⏸ **写 M11_ACCEPTANCE_CRITERIA_V3.md** - 9 主题分层门槛 + 工具/SPA/质量门槛 + 出门条件清单
5. ⏸ **写 GAP_DRAWIO_V3.xml** - 4 大区域: 目标vs当前/W3-W7计划/里程碑/验收
6. ⏸ **文档交叉引用 + 提交推送** - PRD/ARCH/MILESTONES/ACCEPTANCE/GAP_DRAWIO 之间建立交叉引用
7. 🔄 **in_progress: 抓取语雀 287 核心文档** (W3 启动前置)
   - 已抓: 36 URL 中 6 成功 (~2 万字) + 4 落盘 doc
   - 9 专题只展开 2 个 (专题七、九), 其他 7 个 URL 不可达
   - 待解决: 滚动 lazy load, 完整收集 287 URL 后批量抓
8. ⏸ **按 9 主题分类 287 文档到 9 个子目录** - 启发式分配 + 校正
9. ⏸ **新电脑首次开 dev server + 3 页截屏** (上面 1-3 步)

## 4. 用户硬性规则 (5 条, 来自 feedback/ai-lesson-dev-rules.md)

请先读 `docs/memory/feedback/ai-lesson-dev-rules.md`, 5 条规则:

1. **语雀原文抓取先于开发** - 任何 W 阶段启动前先抓到本地
2. **每子阶段完成做端到端验收 + PRD 规格检视** - 偏差大/虚假验收风险立即停下来
3. **下一阶段开始前写验收标准 + 开发计划 + 审计意见** - 开发前闭环所有审计
4. **真实验收** - 禁止 mock/估算, 必须从 lessons.json/dist/DOM 读真实数据
5. **人类只处理高风险流程** - 验收/审计/开发由 Claude 自动完成

## 5. 当前关键状态 (从老电脑继承)

- dev server 已经在跑 (3000 端口, PID 11853)
- Chrome CDP 9222 还在跑 (抓语雀用)
- 已抓语雀 6 个 doc: ael69mgev87brygu / ag9ulsic7lt55tim / db0emkai9h7e37gz / dxzvon9yet37i8n2, 落在 docs/yuque_raw/pending_classify/
- 抓取脚本: scripts/fetch_yuque_full.mjs (主), scripts/fetch_yuque_urls_only.mjs (滚动 URL 收集), 11 个 debug_*.mjs 调试脚本
- **9 主题中已 100% 覆盖**: 无
- **9 主题中已部分覆盖**: 项目方案 (W2.A 39.7%) / Agent (W2.C 44.5%) / 行业落地 (W2.A 38.8%) — W2 一次补齐 24-40pp
- **9 主题中空心化**: 基础 (20.1%) / Transformer (17.2%) - 待 W3 升级

## 6. 优先级建议

按 brainstorm 决策:
- 完成度目标: 9 主题各 100% 字数覆盖 (≈ 106 万字, 200 课)
- 时间窗口: 加速 6 个月 (W3 8月 - W8 12月)
- 差异化策略: 双轨道并行 (课程对标 + 工具独立增强)
- 资源模式: 不设 token 硬限 + 语雀原文拆解重写
- 抗反爬: 间隔 sleep 800ms + 限制最大 50 轮

## 7. 第一步该做什么

先跑完 §2 的 4 步验证, 确认新电脑环境 OK, 然后:
- 如果 OK: 继续 #7 抓取 (按 §1 启动 Chrome CDP 后跑 fetch_yuque_urls_only.mjs)
- 如果失败: 用 snap_debug.mjs 排查, 别瞎试

不要在恢复前问我"你想要做什么" — 已经全部在 §3 任务列表里, 直接开干。
```

---

## 附: 为什么这么写

新电脑 Claude 默认没有:
1. TaskList (空)
2. memory (空, 除非 §4 恢复)
3. 项目当前的"上下文" (对话历史没了)

这条提示词一次性把 **3 件事** 注入:
- **9 个 TaskCreate** 让 TaskList 立即有内容
- **5 条用户硬性规则** 让新 Claude 知道边界
- **优先级** 让它知道下一步该做什么

**不要**在新 Claude 还没读完这条提示词前问它问题 — 它读完后会主动验证和开干。
