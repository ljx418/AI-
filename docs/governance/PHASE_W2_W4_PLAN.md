# Phase1 W2-W4 子阶段 — 开发与验收计划

| 字段 | 内容 |
|------|------|
| 文档版本 | v1.0 |
| 创建日期 | 2026-06-11 |
| 周期 | W2-W4（3 周 / 15 工作日）|
| 子阶段交付 | L26 LoRA/QLoRA + L27 Agent Skill + L28 DPO/RLHF |
| 累计完成后 | 本项目已 ship 28 课 |
| 上游 | L25 DeepSeek（已 ship）|
| 下游 | L29 推理 / L30 分布式 |

---

## 1. 本子阶段开发目标（依据 MASTER_PLAN_18M §2.1.1）

### 1.1 必须交付

| ID | 课程 | 来源 (Yuque) | 估计工时 |
|----|------|--------------|----------|
| **L26** | LoRA / QLoRA 微调全套 | KB 专题三（SFT/PEFT/LoRA/QLoRA/P-Tuning）| 12h |
| **L27** | Agent Skill + Harness Engineering | KB 284/285 | 12h |
| **L28** | DPO / RLHF 深入 | KB RLHF 专题 | 12h |

**总工时**：36h（10 工作日开发 + 5 工作日审计/收尾）

### 1.2 必须遵守的规格（PRD §4 + ARCHITECTURE §3.3）

| 规格 | 来源 | 量化 |
|------|------|------|
| FR-CM-1 | PRD | 24/24+ 课数据完整可渲染 |
| FR-CM-2 | PRD | 每课 ≥3 代码示例含 `pip install` |
| FR-CM-3 | PRD | 每课 ≥4500 字符 |
| FR-CM-4 | PRD | 100% URL 可访问（arXiv 优先） |
| FR-CM-5 | PRD | 章节支持 Markdown（含代码围栏、列表、表格）|
| FR-CE-1 | PRD | 浏览器内 Pyodide 可运行 |
| FR-CE-4 | PRD | Pyodide 兼容标记 |
| 数据模型 | ARCHITECTURE | Lesson schema + Reference 5 格式兼容 |
| Lesson ID | ARCHITECTURE | L01-L24 zero-padded 格式 |

### 1.3 反模式（绝对禁止）

| 反模式 | 后果 |
|--------|------|
| 编造 arXiv ID | Fabrication risk HIGH，阻塞 ship |
| 引用冒名 PyPI 包 | Security risk，阻塞 ship |
| 无 hedging 的具体数字 | Verification risk |
| 不可在 Pyodide 运行的代码标 Pyodide-safe | Pyodide risk |
| 重复公式 / 重复 inline 公式 | UI/UX risk |
| 把 bash 命令包在 Python triple-quoted | UI/UX risk |

---

## 2. 验收标准（必须全部通过）

### 2.1 自动化验收（机器可测）

| 验收项 | 命令 | 通过条件 |
|--------|------|----------|
| **构建** | `cd $PROJECT && npx vite build 2>&1 \| tail -3` | "✓ built in <N>s" |
| **路由** | `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/lesson/L{ID}` | 200 |
| **JSON 可解析** | `python3 -c "import json; json.loads(...)"` | 无异常 |
| **字数** | `python3 audit.py` | ≥4500 字符 |
| **章节数** | `python3 audit.py` | ≥4 章节 |
| **代码示例** | `python3 audit.py` | ≥3 个，全部含 `pip install` |
| **参考** | `python3 audit.py` | ≥5 条 |
| **arXiv 真实** | `curl arxiv.org/abs/<id>` | HTTP 200 |
| **L19 兼容** | `curl lesson route` | HTTP 200（不影响现有） |

### 2.2 双重审计（必须 approve）

| 轮次 | 模型 | 评分维度 | 通过 |
|------|------|----------|------|
| **Audit1** | DeepSeek-V4 | 内容深度 + Fabrication | overall ≥7.5 |
| **Audit2** | MiniMax-M3 | 广度 + UI/UX | overall ≥7.5 |

**两轮均 approve 才能 ship**

### 2.3 视觉验收（端到端）

| 项 | 验证 | 通过 |
|----|------|------|
| Chrome headless 截图 | `/tmp/L{ID}_shipped.png` | > 100KB |
| 课程详情页可见 | DOM 包含 h1, sections, codeExamples, references | ✓ |
| Markdown 渲染 | ### 转 h4、` ``` ` 转 pre、arxiv 转 `<a>` | ✓ |
| 引用链接可点击 | `<a href="https://arxiv.org/...">` | ✓ |

---

## 3. 开发流程（每课）

```
[1] Plan 章节大纲（4-7 章节名）
    ↓
[2] DeepSeek Generate（生成完整 JSON）
    - 6-7 章节，每章 ≥800 字符
    - 总字符 ≥5500
    - 4-5 代码示例（Pyodide-safe + Local-GPU 标记）
    - 8-10 真实 arXiv + GitHub 参考
    - 工业案例
    ↓
[3] MiniMax Polish（广度增强）
    - 跨章节引用（参见 Lxx）
    - 视觉描述（📊 [图示建议]）
    - 常见陷阱（⚠️）
    - 面试考点（💼）
    ↓
[4] Audit1 DeepSeek（深度审计）
    - 通过 → 进入 Audit2
    - 不通过 → 修复 → 重审计
    ↓
[5] Audit2 MiniMax（广度审计）
    - 通过 → Ship
    - 不通过 → 修复 → 重审计
    ↓
[6] Deploy（构建 + 路由 + 截图 + git commit）
    ↓
[7] 端到端验收（自动化 + 视觉）
    - 通过 → 进入下一课
    - 不通过 → 打回开发计划
```

---

## 4. 风险与高风险停机条件

### 4.1 重大偏差（停下找你）
- 课程内容方向偏离 PRD 用户故事
- 引入与 Out-of-Scope 冲突的功能（账号、云同步、付费墙）
- 任何 P0 任务连续 2 轮失败

### 4.2 虚假验收风险（停下找你）
- 截图 > 100KB 但页面空白（fabricated screenshot）
- 路由 200 但 DOM 无内容
- JSON 可解析但所有字段为空字符串

### 4.3 自动恢复（不打扰你）
- 单轮 must-fix ≤ 3 项 → 自动修复重审
- 单轮 overall < 7.5 但 > 6.5 → 自动修复重审
- 字符数差 ≤ 500 → 自动补充

---

## 5. 本阶段交付清单

| # | 交付物 | 通过条件 |
|---|--------|----------|
| 1 | L26 LoRA/QLoRA JSON | 双审计通过 + 部署通过 |
| 2 | L27 Agent Skill JSON | 双审计通过 + 部署通过 |
| 3 | L28 DPO/RLHF JSON | 双审计通过 + 部署通过 |
| 4 | 28 课汇总验收报告 | 全部规格通过 |
| 5 | W2-W4 总结文档 | 含经验教训 |

---

## 6. 时间线

| 周 | 任务 | 关键里程碑 |
|----|------|------------|
| W2 (06-22→06-26) | L26 LoRA/QLoRA | 完成 1 课 ship |
| W3 (06-29→07-03) | L27 Agent Skill | 完成 2 课 ship |
| W4 (07-06→07-10) | L28 DPO/RLHF | 完成 3 课 ship + 阶段总结 |

---

## 7. 与 PRD 的对齐

| PRD § | 本阶段覆盖 |
|--------|-----------|
| §2.2 故事1 应届生学习 | ✅ 课程路径继续 |
| §2.2 故事2 应用工程师定位 | ✅ 新增专项课 |
| §3 In-Scope | ✅ 24 课扩展到 28 |
| §4.1 FR-CM-1~5 | ✅ 每课执行 |
| §4.3 FR-QZ | ⏸️ 待 M5 后续阶段 |
| §4.4 FR-PR | ⏸️ 待 M5 后续阶段 |
| §4.5 FR-UX | ⏸️ 已实现，本次不改动 |