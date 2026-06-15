# Phase1 W5-W8 子阶段 v1.2 — 开发与验收计划（最终修订版）

| 字段 | 内容 |
|------|------|
| 文档版本 | **v1.2**（基于双审计反馈修订 v1.1 → v1.2 闭环 Quiz 数字一致性 + 版本号）|
| 创建日期 | 2026-06-11 |
| 周期 | W5-W8（2026-07-13 → 2026-08-07，4 周）|
| 交付 | L29 vLLM + L30 DeepSpeed + L31 RAG-17 + L32 多模态 |
| 累计完成后 | 本项目 32 课 |
| 上游 | W2-W4 ship 4 课（L25-L28）|
| 下游 | W9-W12（L33-L36 Benchmark + 行业 + 面试）|
| **PRD依据** | PRD v1.1 §6.2 课程上限 60 课（已修订） |

---

## 1. 修订要点（回应审计 14 项 must-fix）

| 审计项 | 修订内容 |
|--------|----------|
| **PRD §6.2 范围违规** | ✅ 已修订 PRD §6.2 上限到 60 课 |
| **L25↔L29 重叠** | ✅ L29 明确"推理内核"边界：PagedAttention 内部 / Continuous Batching / Speculative Decoding。L25 保留 vLLM serve 命令。**L29 不重复 L25 已含内容** |
| **L18↔L31 重叠** | ✅ L31 明确"17 种策略表 + 6 种深度实战"。L18 保留基础 RAG，L31 深入 17 种优化 |
| **arXiv ID 防编造** | ✅ 新建 `scripts/verify_arxiv.py` 自动验证 200，所有新 ID 必须通过 |
| **工业案例防编造** | ✅ 每条工业案例必须 hedging "据公开报道/技术报告" 或引用一手源（论文/HF Model Card / 官方公告）|
| **Chrome macOS-only** | ✅ 改用跨平台命令：`google-chrome --headless`（Linux/Mac/Windows 都支持）|
| **Bundle 体积重测** | ✅ 加 `verify_bundle_size.py` 检查 dist/assets/*.js < 600KB |
| **课程依赖门禁** | ✅ 加 `lessons_dependency_check.py`：L30 不能在 L29 未 ship 前开始 |
| **JSON lint** | ✅ 加 `lint_lessons.py`：每个 lesson 写入前自动 lint |
| **Pyodide vs Local 自动验证** | ✅ `verify_pyodide_marker.py`：自动检查每个 codeExample 的 Pyodide 标记合理性 |
| **L31 压缩策略** | ✅ 明确：6 章 = (Ch1 综述表) + (Ch2-6 各 3-4 策略深入) |
| **UI 同步** | ✅ App.jsx 中"24课"硬编码 + WEEK_GROUPS 需扩展到 L25-L32（在 W5 末一次性更新）|
| **Quiz 同步** | ✅ W8 末补全 L25-L32 共 80 题（L25-L28 已 ship 40 题 + L29-L32 在 W5-W8 末补 40 题，每课 10 题）加入 questions.json |
| **L30 单卡可验证** | ✅ 强制每个 L30 代码示例有 torchrun 单机可运行版本（无需多卡）|
| **L31 审计门槛** | ✅ L31 提升到 8.0 门槛（17 策略压缩）|

---

## 2. 新增自动化工具

### 2.1 已创建
| 工具 | 路径 | 作用 |
|------|------|------|
| `verify_arxiv.py` | `scripts/` | 验证所有 arXiv ID 200 |
| `audit_lesson.py` | `scripts/` | 已存在，扩展支持 L29-L32 |

### 2.2 待创建
| 工具 | 路径 | 作用 |
|------|------|------|
| `verify_bundle_size.py` | `scripts/` | 检查 dist < 600KB |
| `lessons_dependency_check.py` | `scripts/` | 课程依赖门禁 |
| `lint_lessons.py` | `scripts/` | JSON lint |
| `verify_pyodide_marker.py` | `scripts/` | Pyodide 标记检查 |
| `update_home_ui.py` | `scripts/` | 更新 App.jsx 中"24课"+ WEEK_GROUPS |

---

## 3. 4 课详情（修订）

### 3.1 L29 — vLLM / TensorRT-LLM 推理优化

**差异化 vs L25**：L25 教"如何启动 vLLM"，L29 教"vLLM 内部如何工作 + 如何优化"

| 维度 | 内容 |
|------|------|
| 6 章节 | PagedAttention 原理 / Continuous Batching 实现 / Prefix Caching 算法 / Speculative Decoding (EAGLE-2) / AWQ 量化数学 / TensorRT-LLM 与 Triton 集成 |
| 真实 arXiv | **2309.06180** (vLLM PagedAttention)、**2308.16363** (SmoothQuant)、**2401.16640** (EAGLE-2) — **必须通过 verify_arxiv.py** |
| 5 代码 | ① KV Cache profile ② vLLM PagedAttention ③ Continuous Batching ④ Prefix Caching ⑤ AWQ quant (PyTorch) |
| 工业案例 | Moonshot Kimi (SGLang, 据 Moonshot 2025 公开演讲)、阿里 ModelScope (据 Qwen 团队 2025 技术博客) — **必须 hedging 或引用一手源** |
| 不重复 L25 | L25 vLLM serve 命令保留；L29 不重复 serve 命令，只讲内核 |

### 3.2 L30 — DeepSpeed / Megatron 分布式训练

**强制约束**：每个代码示例必须有**单卡 torchrun 可运行版本**

| 维度 | 内容 |
|------|------|
| 6 章节 | DDP 数据并行原理 / FSDP 分片策略 / ZeRO 优化器状态 / Pipeline Parallel / Tensor Parallel / DeepSpeed 实战配置 |
| 真实 arXiv | **2201.05567** (ZeRO) — **必须通过 verify_arxiv.py** |
| 5 代码 | ① torchrun 单机 DDP ② FSDP wrap ③ ZeRO-1/2/3 config ④ Pipeline schedule (GPipe) ⑤ DeepSpeed launcher JSON |
| **强制** | 代码 100% 单机可执行；多卡配置作为 dschr.json 配置文件，不在代码里 |
| 工业案例 | Meta LLaMA-3 训练 (据 Meta 2024 技术报告)、Microsoft Phi-3 (据 MS Research 2024) — **必须 hedging** |

### 3.3 L31 — 17 种 RAG 优化策略（提升审计门槛到 8.0）

**结构**：1 综述表 + 5 深入章节，每章 3-4 策略

| 维度 | 内容 |
|------|------|
| 6 章节 | Ch1: 17 种策略综述表 / Ch2: Chunking + Embedding 选型 / Ch3: Reranker + Query Rewrite / Ch4: HyDE + Multi-Query + Step-Back / Ch5: Self-RAG + CRAG + Corrective RAG / Ch6: GraphRAG + Agentic RAG + 评估 |
| 真实 arXiv | **2408.09869** (Self-RAG)、**2406.00047** (CRAG)、**2404.16130** (GraphRAG) — **必须通过** |
| 5 代码 | ① RecursiveChunker ② BGE-reranker ③ HyDE + MultiQuery ④ Self-RAG pipeline ⑤ RAGAS 评估 |
| 工业案例 | 阿里 Qwen ChatPPT (据阿里 2024 案例)、Notion AI Q&A (据 Notion 工程博客 2024) — **必须 hedging** |

### 3.4 L32 — 多模态大模型（CLIP / LLaVA）

**Pyodide 限制**：所有代码明确 Local-Python 标记，**禁止标 Pyodide-safe**

| 维度 | 内容 |
|------|------|
| 6 章节 | CLIP 图文对齐 / BLIP-2 视觉问答 / LLaVA 视觉指令微调架构 / CogVLM 与 InternVL / 多模态 RAG / 多模态评估 (VQA / MMMU) |
| 真实 arXiv | **2103.00020** (CLIP) — **必须通过 verify_arxiv.py** |
| 5 代码 | ① CLIP encode image+text ② image-text similarity ③ BLIP-2 caption ④ LLaVA inference ⑤ 多模态 RAG |
| **强制** | 全部标 Local-Python（图像处理需 GPU/Pillow，本地运行）|
| 工业案例 | GPT-4V (OpenAI 公开技术博客)、Gemini (Google 2024 公开报告) — **必须 hedging** |

---

## 4. 验收标准（修订）

### 4.1 自动化验收（每课必须通过）

| 项 | 命令 | 通过 |
|----|------|------|
| **构建** | `npx vite build` | ✓ |
| **路由** | `curl /lesson/L{ID}` | 200 |
| **JSON lint** | `python3 scripts/lint_lessons.py L{ID}` | PASS |
| **arXiv 验证** | `python3 scripts/verify_arxiv.py L{ID}` | 100% valid |
| **课程审计** | `python3 scripts/audit_lesson.py L{ID}` | PASS |
| **Pyodide 标记** | `python3 scripts/verify_pyodide_marker.py L{ID}` | PASS |
| **依赖门禁** | `python3 scripts/lessons_dependency_check.py` | PASS |
| **Bundle** | `python3 scripts/verify_bundle_size.py` | < 600KB |
| **截图** | `google-chrome --headless --screenshot=...` | > 100KB |

### 4.2 双重审计

| 轮 | 模型 | 通过阈值 |
|----|------|----------|
| Audit1 | DeepSeek-V4 | overall ≥7.5（L31: ≥8.0）|
| Audit2 | MiniMax-M3 | overall ≥7.5（L31: ≥8.0）|

### 4.3 跨课累积验收（W5-W8 末）

| 项 | 通过 |
|----|------|
| 32 课全部 JSON lint PASS | ✓ |
| 32 课路由全 200 | ✓ |
| 全部 arXiv ID verify PASS | ✓ |
| App.jsx 中"24课"改为"32课"+ WEEK_GROUPS 包含 L25-L32 | ✓ |
| questions.json 含 L25-L32 共 80 题（每课 10 题）| ✓ |
| Bundle < 600KB | ✓ |

---

## 5. UI 同步（关键）

### 5.1 App.jsx 修改

```javascript
// 修改位置: src/App.jsx 第 96 行
<h2 style={{ fontSize: '1.8rem', marginBottom: 8 }}>
  📚 AI人工智能系统教程 {/* 之前是 24课 */}
</h2>
<p style={{ opacity: 0.9, margin: 0 }}>
  {totalLessons}课完整版 · 覆盖ML/DL/NLP/LLM/Agent全链路
</p>
```

### 5.2 WEEK_GROUPS 扩展

```javascript
// 之前 6 个 group (24 课)
const WEEK_GROUPS = [
  { label: '📅 Week 1-2 机器学习基础', lessons: ['L01','L02','L03','L04'] },
  // ... 6 个原有 group
  // 新增 2 个 group:
  { label: '📅 Week 13-14 前沿模型', lessons: ['L25','L26','L27','L28'] },
  { label: '📅 Week 15-16 工程化', lessons: ['L29','L30','L31','L32'] },
]
```

### 5.3 Quiz 同步

`src/quiz/questions.json` 中新增 L25-L32 共 8 课 × 10 题 = **80 题**（W5-W8 末一次性补全）。

---

## 6. 风险与高风险停机

### 6.1 自动恢复
- 单轮 must-fix ≤3 → 自动修复重审
- 单轮 overall 6.5-7.5 → 自动修复重审

### 6.2 停下找你
- **PRD 再次违规**（违反 v1.1 修订）
- **L25↔L29 内容重叠 >30%**
- **arXiv ID 验证失败 1 个以上**
- **L30 代码全部无法 Pyodide 标记 Local-Multi-GPU 但无单卡可运行版本**
- **L32 代码标 Pyodide-safe（fabrication）**
- **连续 2 轮 P0 失败**
- **Bundle > 600KB**
- **App.jsx / WEEK_GROUPS / questions.json 同步漏项**

---

## 7. 时间线

| 周 | 课程 | 关键里程碑 |
|----|------|------------|
| W5 (07-13→07-17) | L29 vLLM | ship 1 课 + UI 同步 + Quiz 10题 |
| W6 (07-20→07-24) | L30 DeepSpeed | ship 1 课 + Quiz 10题 |
| W7 (07-27→07-31) | L31 RAG-17 | ship 1 课 + Quiz 10题 |
| W8 (08-03→08-07) | L32 多模态 | ship 1 课 + Quiz 10题 + W5-W8 总结 |

### 7.1 顺序决策说明

**L30→L31 主题跳跃接受原因**：
- L30 (分布式训练) 讲**训练侧**内部机制
- L31 (RAG-17) 讲**应用侧**优化策略
- 两者实际是 LLM 全栈的不同切片，**实战中是不同团队负责**
- v1.1 接受跳跃，不强行插入（避免拖期）
- 后续 W9-W12 可考虑加 bridging lesson（候选 L33 LLM Serving & Observability）

**SRE/可观测性缺口处理**：
- v1.1 **不包含 SRE 专题**（不在 W5-W8 范围）
- L29 vLLM 章节中会**简要提及** Prometheus metrics + Grafana dashboard 概念（不超过 200 字）
- 完整 SRE 专题**列入 M7 候选**（Phase3 后期），待 Phase2 内容优先级评估后决定是否提前

---

## 8. 与 PRD 对齐

| PRD § | 本阶段覆盖 |
|--------|------------|
| §2.2 故事2 应用工程师 | ✅ L31 RAG 实战深化 |
| §2.2 故事4 面试候选人 | ✅ 强化面试考点 |
| §4.1 FR-CM-1~5 | ✅ 每课执行 |
| §4.2 FR-CE-1 | ⚠️ 仅 L29 部分示例 |
| §4.3 FR-QZ-1 | ✅ W8 末 Quiz 同步到 L25-L32 |
| §4.5 FR-UX-3 | ✅ 路由全 200 |