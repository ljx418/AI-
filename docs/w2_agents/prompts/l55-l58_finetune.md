# M11 W2.B 微调深化 - 4 课 Prompt (L55-L58)

**使用**: `node /tmp/w2b/call_deepseek.mjs /tmp/w2b/l<XX>_prompt.txt --max-tokens 22000`

⚠️ **W1 强约束**: 严禁 placeholder, **必须**含 `openSourceRepo` 字段 (github.com 链接)

---

## L55 全参数 SFT 工程化 (数据工程/训练流水线)

**字数**: ≥ 13,000

**内容**:
1. SFT 流程总览 (≥ 2,000 字): 数据准备 / 训练 / 评测
2. 数据工程 (≥ 3,000 字): 清洗/去重/质量过滤/格式转换
3. 全参数 SFT 训练 (≥ 3,000 字): 分布式 (FSDP/DeepSpeed) / 优化器 (AdamW) / 调度
4. 评测与迭代 (≥ 2,000 字): 离线评测 / HumanEval / 业务指标
5. 工业实践 (≥ 2,000 字): 训练成本/时长/失败恢复
6. 案例对比 (≥ 1,000 字): LLaMA-Factory / axolotl / trl

**代码 (≥ 4)**: FSDP SFT / 数据清洗 pipeline / DeepSpeed 启动 / 评测脚本

**引用 (≥ 5)**: github.com/huggingface/trl / github.com/hiyouga/LLaMA-Factory / github.com/OpenAccess-AI-Collective/axolotl / arxiv:2106.09685 (LoRA) / pytorch.org/docs/stable/fsdp

**openSourceRepo**: `https://github.com/huggingface/trl`

---

## L56 LoRA 进阶 (DoRA/AdaLoRA/LoftQ)

**字数**: ≥ 12,000

**内容**:
1. LoRA 原理回顾 (≥ 2,000 字): 低秩分解 / 公式推导
2. DoRA (≥ 2,500 字): 权重分解 LoRA, arxiv:2402.09353
3. AdaLoRA (≥ 2,500 字): 自适应秩分配, arxiv:2303.10512
4. LoftQ (≥ 2,000 字): 量化感知 LoRA 初始化, arxiv:2310.08659
5. 变体对比 (≥ 2,000 字): 性能/显存/收敛速度
6. 工业选型 (≥ 1,000 字)

**代码 (≥ 4)**: DoRA 实现 / AdaLoRA peft config / LoftQ 初始化 / 变体对比脚本

**引用 (≥ 5)**: arxiv:2402.09353 (DoRA) / arxiv:2303.10512 (AdaLoRA) / arxiv:2310.08659 (LoftQ) / github.com/huggingface/peft / LoRA 原始 arxiv:2106.09685

**openSourceRepo**: `https://github.com/huggingface/peft`

---

## L57 QLoRA 4-bit 实战 (BitsAndBytes/量化方案)

**字数**: ≥ 12,000

**内容**:
1. QLoRA 原理 (≥ 2,500 字): 4-bit NF4 / Double Quant / Paged Optimizers / arxiv:2305.14314
2. BitsAndBytes 集成 (≥ 2,500 字): 4-bit/8-bit 量化 API
3. QLoRA 训练实战 (≥ 2,500 字): LLaMA-Factory / axolotl 集成
4. 量化方案对比 (≥ 2,000 字): GPTQ vs AWQ vs BitsAndBytes
5. 工业部署 (≥ 2,000 字): 推理性能 / 量化评测

**代码 (≥ 4)**: bitsandbytes 4-bit 加载 / QLoRA peft config / LLaMA-Factory QLoRA 训练 / 显存监控

**引用 (≥ 5)**: arxiv:2305.14314 (QLoRA) / github.com/bitsandbytes-foundation/bitsandbytes / github.com/huggingface/peft / LLaMA-Factory 文档 / axolotl 仓库

**openSourceRepo**: `https://github.com/bitsandbytes-foundation/bitsandbytes`

---

## L58 DPO/KTO/SimPO/ORPO 对比

**字数**: ≥ 13,000

**内容**:
1. RLHF 回顾 (≥ 2,000 字): PPO / Reward Model
2. DPO (≥ 2,500 字): Direct Preference Optimization, arxiv:2305.18290
3. KTO (≥ 2,500 字): Kahneman-Tversky Optimization, arxiv:2402.01306
4. SimPO (≥ 2,000 字): Simple Preference Optimization, arxiv:2405.14734
5. ORPO (≥ 2,000 字): Odds Ratio Preference Optimization, arxiv:2403.07691
6. 算法对比 (≥ 2,000 字): 性能/显存/收敛/工业部署

**代码 (≥ 4)**: DPO 训练 / KTO 实现 / SimPO peft 集成 / 4 算法对比

**引用 (≥ 5)**: arxiv:2305.18290 (DPO) / arxiv:2402.01306 (KTO) / arxiv:2405.14734 (SimPO) / arxiv:2403.07691 (ORPO) / github.com/huggingface/trl

**openSourceRepo**: `https://github.com/huggingface/trl`

---

## W2.B 验收

```bash
node scripts/inspect_lessons.mjs --topic "L5[5-8]"
# 4 课全过, 每课 openSourceRepo 字段非空 (含 github.com)
curl -I https://github.com/huggingface/trl  # 200
curl -I https://github.com/huggingface/peft  # 200
curl -I https://github.com/bitsandbytes-foundation/bitsandbytes  # 200
```
