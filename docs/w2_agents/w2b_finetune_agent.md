# M11 W2.B 微调深化 Agent 任务书

你是 M11 W2.B「微调篇深化」内容生成 Agent，负责向 AI 教案添加 L55-L58 四课。**使用 deepseek 写长文**。

## ⚠️ W1 教训 (强约束)

1. **不能出现 placeholder**: 标题/正文严禁 `---\s*模拟数据\s*---` / `[为是]XXX(?![\w])` / `TODO\s*[:：]?\s*实际请替换` / `FIXME`
2. **真实开源仓库**: 所有 github.com 链接必须可访问 (curl 验证), 优先 HuggingFace 官方仓库

## 目标

向 `src/data/lessons_new.jsx` 添加 4 个微调深化课, 把语雀 9 专题中"微调篇"覆盖从 9% 提升到 ≥ 35%:

| ID | 标题 | 目标字数 | 开源仓库硬要求 |
|----|------|--------:|---------------|
| L55 | 全参数 SFT 工程化 (数据工程/训练流水线) | 13,000 | ≥ 1 个 SFT 训练仓库 (HuggingFace trl/axolotl) |
| L56 | LoRA 进阶 (DoRA/AdaLoRA/LoftQ) | 12,000 | ≥ 1 个 peft 变体实现 |
| L57 | QLoRA 4-bit 实战 (BitsAndBytes/量化方案) | 12,000 | ≥ 1 个 bitsandbytes 集成案例 |
| L58 | DPO/KTO/SimPO/ORPO 对比 | 13,000 | ≥ 1 个 trl/trlx 的 RLHF 替代算法 |

**总计约 50,000 字 (5 万字)**。

## 数据模型硬要求 (W2 新增)

每课必须包含 `openSourceRepo` 字段, 含 ≥ 1 个 github.com 链接:

```javascript
{
  id: "L55",
  // ... 沿用字段 ...
  openSourceRepo: "https://github.com/huggingface/trl"
}
```

W2 验收脚本会检查:
- 中文字符 ≥ 8,000
- codeExamples ≥ 4
- references ≥ 5
- placeholder 0 命中
- **openSourceRepo 字段含 github.com 链接**

## 工作流 (同 W2.A)

1. 读 L36 字段结构 (offset 5100-5168)
2. 写 4 个 prompt 到 `/tmp/w2b/l55_prompt.txt` ... `l58_prompt.txt`
3. 逐课调 deepseek (`--max-tokens 22000`)
4. md→JSX (用 `scripts/md_to_lesson.mjs`)
5. 追加到 L48 之后
6. 校验: `node scripts/inspect_lessons.mjs --topic "L5[5-8]"`
7. 构建: `npm run build`
8. 报告: `docs/governance/M11_W2B_FT_REPORT.md`

## Prompt 模板 (L57 示例)

```markdown
# 任务: 写 L57 "QLoRA 4-bit 实战 (BitsAndBytes/量化方案)"

## 字数
≥ 12,000 中文字符

## 内容要求
1. **QLoRA 原理** (≥ 2500 字)
   - 4-bit NormalFloat (NF4) 量化
   - Double Quantization
   - Paged Optimizers
   - 论文: Dettmers et al. 2023 (arxiv:2305.14314)
2. **BitsAndBytes 集成** (≥ 2500 字)
   - bitsandbytes 库安装
   - 4-bit/8-bit 量化 API
   - 与 HuggingFace Transformers 集成
3. **QLoRA 训练实战** (≥ 2500 字)
   - LLaMA-Factory / axolotl 集成
   - 学习率 / 批次大小 / 量化参数调优
   - GPU 显存监控
4. **量化方案对比** (≥ 2000 字)
   - GPTQ vs AWQ vs BitsAndBytes
   - NF4 vs FP4
5. **工业部署** (≥ 2000 字)
   - 推理性能对比
   - 量化后模型评测

## 代码示例 (≥ 4 个)
- bitsandbytes 4-bit 加载
- QLoRA peft 配置
- LLaMA-Factory QLoRA 训练
- 显存监控脚本

## 引用 (≥ 5 个, 必须真实)
- QLoRA 论文 (arxiv:2305.14314)
- bitsandbytes GitHub
- HuggingFace PEFT
- LLaMA-Factory 文档
- axolotl GitHub

## ⚠️ 严禁 placeholder
W1 教训: 标题/正文严禁 "--- 模拟数据 ---" / "XXX 亿美元" / "TODO 实际请替换"

## 数据模型输出要求
JSX lesson 必须包含:
- 沿用字段 (sections/codeExamples/references 等)
- **openSourceRepo: "https://github.com/bitsandbytes-foundation/bitsandbytes"**
- crossReferences (链接 L25/L26/L28 + L55/L56/L58)
```

## 关键约束

- **不修改** L01-L48
- **真实** github.com 链接 (curl 验证)
- **真实** arxiv 论文 ID
- **必须** 包含 `openSourceRepo` 字段
- **如果构建失败立即停止**并报告

## 验收门槛

- `npm run build` 成功
- `inspect_lessons.mjs --topic "L5[5-8]"` 4 课全过
- placeholder 0 命中
- 4 课总字数 ≥ 40,000 (W2.B 目标 50K)
- 每课 `openSourceRepo` 字段非空且含 github.com
- 仓库可访问: curl -I <url> 返回 200

## 工具/环境 (同 W2.A)

- `scripts/call_deepseek.mjs` (W1 部署在 /tmp/w2b)
- `scripts/md_to_lesson.mjs` / `scripts/inspect_lessons.mjs` / `scripts/gap_eval.mjs`
- 工作目录: `/Users/Zhuanz/Desktop/workspace/1-AI教案`
