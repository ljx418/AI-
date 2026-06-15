# AI 人工智能基础教程 — Week 1-2 详细教学内容

**适用课程**: L1 ~ L4（AI概述与历史 / 开发环境搭建 / 数学基础回顾 / Python进阶）
**建议学时**: 每周 4 课时，共 8 课时
**适用对象**: 具备基础编程经验（任意语言），无 AI 背景

---

# L1: AI 概述与历史

**课时**: 2 课时（90 分钟/课时）

## 1. 学习目标

完成本课程后，学员能够：

1. 准确陈述 AI 的定义，并区分「狭义 AI」「通用 AI」「超级 AI」三个层次
2. 按时间顺序叙述 AI 发展史上的三次浪潮及其核心技术标志
3. 解释 GOFAI（符号主义人工智能）的核心假设与方法论局限
4. 说明深度学习崛起的技术背景——数据、算力、算法三要素
5. 评估当前主流 AI 系统的能力边界与固有缺陷

## 2. 核心知识点

### 2.1 什么是人工智能

- **强人工智能（AGI）**: 具备通用认知能力，能在任意领域自主学习与推理（尚未实现）
- **弱人工智能（Narrow AI）**: 在特定任务上达到或超越人类水平（当前主流）
- **超级人工智能（ASI）**: 在几乎所有领域远超人类智能（理论假设）
- 日常接触的 AI 系统：搜索引擎、推荐算法、自动驾驶、医疗影像诊断、围棋程序

### 2.2 AI 发展简史

| 年代 | 阶段 | 核心技术 | 代表成果 |
|------|------|----------|----------|
| 1956–1974 | 第一次浪潮 | 逻辑推理、搜索树、启发式编程 | ELIZA（聊天机器人）、Shakey 机器人 |
| 1980–1987 | 第二次浪潮 | 专家系统、规则引擎、知识表示 | MYCIN（医疗诊断）、XCON（配置系统） |
| 1990–2012 | 统计学习时期 | SVM、随机森林、贝叶斯方法 | 垃圾邮件过滤、语音识别（Hidden Markov Model） |
| 2012 至今 | 深度学习时代 | 深度神经网络、卷积网络、Transformer | AlexNet、AlphaGo、GPT 系列 |

### 2.3 GOFAI 与符号主义

- **核心假设**: 智能 = 符号操纵，认知可被形式化规则描述
- **方法**: 知识表示（谓词逻辑、语义网络）、搜索算法（A*, 剪枝）、专家系统
- **局限**:
  - 知识获取瓶颈（专家知识难以显式编码）
  - 常识推理缺失（框架问题、符号接地问题）
  - 鲁棒性差（无法处理噪声与模糊性）

### 2.4 深度学习的崛起

- **数据**: 互联网时代产生的海量标注数据（ImageNet 百万级图像）
- **算力**: GPU/TPU 并行计算突破，训练时间从数周压缩到数小时
- **算法**: ReLU 激活函数、Dropout 正则化、Batch Norm、迁移学习
- **关键突破**:
  - 2012 AlexNet（ImageNet 挑战赛）→ CNN 在视觉任务大幅领先
  - 2014 GAN（生成对抗网络）→ 生成模型进入实用阶段
  - 2017 Transformer → NLP 领域全面升级
  - 2020 GPT-3 / 2022 ChatGPT / 2023 GPT-4 → 大语言模型涌现

### 2.5 当前 AI 的能力与局限

- **强项**: 模式识别、大规模信息检索、策略优化、风格迁移
- **弱项**: 因果推理、长期规划、常识理解、可解释性、幻觉问题

## 3. 代码示例

**运行说明**: 本脚本将生成 AI 发展史时间线可视化图表。在终端或 Jupyter Notebook 中运行均可。

```python
# pip install matplotlib numpy
"""
L1-demo-ai-history.py
演示：用 Python 可视化 AI 发展时间线（使用 matplotlib）
在终端运行：python L1-demo-ai-history.py
在 Jupyter Notebook 运行：将代码复制到单元格并执行
"""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np

# ============================================================
# 数据准备：AI 发展四个浪潮
# ============================================================
eras = [
    {
        "name": "第一次浪潮\n(1956-1974)",
        "start": 1956,
        "end": 1974,
        "color": "#3498db",
        "desc": "逻辑推理·搜索树·ELIZA"
    },
    {
        "name": "第二次浪潮\n(1980-1987)",
        "start": 1980,
        "end": 1987,
        "color": "#e74c3c",
        "desc": "专家系统·知识表示·MYCIN"
    },
    {
        "name": "统计学习时期\n(1990-2012)",
        "start": 1990,
        "end": 2012,
        "color": "#2ecc71",
        "desc": "SVM·随机森林·HMM语音识别"
    },
    {
        "name": "深度学习时代\n(2012-2026)",
        "start": 2012,
        "end": 2026,
        "color": "#9b59b6",
        "desc": "CNN·Transformer·GPT·AlphaGo"
    },
]

# ============================================================
# 绘制时间线
# ============================================================
fig, ax = plt.subplots(figsize=(14, 6))
ax.set_xlim(1950, 2030)
ax.set_ylim(0, 1)
ax.set_xlabel("年份", fontsize=12)
ax.set_title("人工智能发展史", fontsize=16, fontweight="bold")
ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.spines["left"].set_visible(False)
ax.set_yticks([])

for i, era in enumerate(eras):
    y_pos = 0.5
    width = era["end"] - era["start"]
    rect = mpatches.FancyBboxPatch(
        (era["start"], y_pos - 0.15),
        width,
        0.3,
        boxstyle="round,pad=0.02",
        facecolor=era["color"],
        alpha=0.7,
        edgecolor="black"
    )
    ax.add_patch(rect)
    ax.text(
        era["start"] + width / 2,
        y_pos,
        era["name"],
        ha="center",
        va="center",
        fontsize=9,
        color="white",
        fontweight="bold"
    )
    ax.text(
        era["start"] + width / 2,
        y_pos - 0.25,
        era["desc"],
        ha="center",
        va="center",
        fontsize=7,
        color="gray"
    )

# 标记关键里程碑
milestones = [
    (2017, "Transformer (2017)", "orange"),
    (2022, "ChatGPT (2022)", "red"),
    (1997, "Deep Blue (1997)", "#27ae60"),
    (2016, "AlphaGo (2016)", "#8e44ad"),
]

for year, label, color in milestones:
    ax.axvline(x=year, color=color, linestyle="--", linewidth=1.5, alpha=0.8)
    ax.text(year, 0.88, label, fontsize=8, color=color, ha="center")

plt.tight_layout()
output_path = "l1_ai_timeline.png"
plt.savefig(output_path, dpi=150)
plt.show()
print(f"时间线图已保存至 {output_path}")
```

## 4. 练习题

1. **名词辨析**: 解释「狭义 AI」与「通用 AI（AGI）」的本质区别，并各举一个现实中的应用实例。
2. **历史排序**: 将以下五个事件按时间顺序排列，并说明每次技术突破的核心贡献：
   - Deep Blue 战胜卡斯帕罗夫
   - ImageNet 挑战赛中 AlexNet 夺冠
   - Transformer 论文发表
   - ELIZA 聊天程序诞生
   - GPT-4 发布
3. **GOFAI 批判**: 专家系统为何在 1980 年代末走向衰落？至少列出两个根本原因。
4. **三要素分析**: 深度学习在 2012 年突然崛起，请从数据、算力、算法三个维度说明其背后的驱动因素。
5. **能力边界评估**: 当前的大语言模型（LLM）在哪些任务上表现出色？又在哪些任务上存在明显缺陷？请举例说明「幻觉」问题在实际应用中可能造成的后果。

## 5. 延伸阅读

- **书籍**: Stuart Russell & Peter Norvig, *Artificial Intelligence: A Modern Approach*（第4版），第1-2章 — AI 领域最权威教材
- **书籍**: 尼克, 《人工智能简史》, 人民邮电出版社 — 中文视角的 AI 史梳理
- **论文**: McCarthy et al., 1956, "A Proposal for the Dartmouth Summer Research Project on Artificial Intelligence" — AI 诞生论文
- **在线课程**: 3Blue1Brown, *Neural Networks* 系列视频（B站有中文翻译）— 直觉理解深度学习
- **纪录片**: *AlphaGo*（2017），讲述 AlphaGo vs 李世石的故事，帮助理解 AI 决策过程

---

# L2: 开发环境搭建

**课时**: 2 课时（90 分钟/课时）

## 1. 学习目标

完成本课程后，学员能够：

1. 在本地计算机上完成 Anaconda 发行版的安装与验证
2. 使用 conda 创建、激活、切换、删除独立的 Python 环境
3. 独立启动 Jupyter Notebook 并完成基本的单元格操作
4. 至少安装并使用两个 AI 开发常用的第三方库（如 numpy, matplotlib）
5. 掌握 pip / conda 两种包管理工具的基本命令

## 2. 核心知识点

### 2.1 为什么选择 Anaconda

- **发行版概念**: Anaconda 预装 250+ 科学计算包，避免逐一安装的依赖地狱
- **conda 环境管理**: 隔离不同项目的 Python 版本和依赖，避免冲突
- **Jupyter 内置**: Notebook、QtConsole、Spyder 开箱即用
- **适用场景**: 数据科学、机器学习、AI 研究（不适合生产服务器部署）

### 2.2 Python 环境管理

```bash
# 查看当前环境
conda info --envs

# 创建新环境（指定 Python 版本）
conda create -n ai-course python=3.11 -y

# 激活环境（Windows: conda activate ai-course）
conda activate ai-course

# 安装包
conda install numpy pandas matplotlib scikit-learn

# 或使用 pip（pip 与 conda 环境隔离）
pip install torch torchvision

# 退出环境
conda deactivate

# 删除环境
conda env remove -n ai-course

# 导出环境依赖（用于复现）
conda env export > environment.yml
```

### 2.3 Jupyter Notebook 核心操作

| 操作 | 快捷键 |
|------|--------|
| 运行单元格 | `Shift + Enter` |
| 添加单元格（上） | `A` |
| 添加单元格（下） | `B` |
| 删除单元格 | `DD`（双击 D） |
| 切换为代码/ markdown | `Y` / `M` |
| 命令模式 vs 编辑模式 | `Esc` / `Enter` |
| 中断内核 | `II` |
| 重启内核 | `00` |

### 2.4 工具链全景

- **代码编辑**: VS Code（推荐）、PyCharm、JupyterLab
- **版本控制**: Git + GitHub / Gitee
- **包管理**: pip / conda / poetry
- **实验管理**: MLflow、Weights & Biases、TensorBoard
- **云端算力**: Google Colab（免费 TPU/GPU）、Kaggle Notebook

### 2.5 常见安装问题排查

- **PATH 未配置**: 找不到 conda 命令 → 运行 `source ~/.bashrc` 或手动添加 PATH
- **SSL 证书错误**: `conda config --set ssl_verify false`（仅在内网环境）
- **依赖冲突**: 创建新环境而非在 base 中直接安装

## 3. 代码示例

**运行说明**: 本脚本分 6 个单元格执行，验证开发环境是否正确配置。在 Jupyter Notebook 中依次运行每个单元格；在终端运行需将每个代码段独立执行。

```python
# pip install numpy pandas matplotlib
# ============================================================
# 单元格 1：检查 Python 版本和路径
# ============================================================
import sys
print(f"Python 版本: {sys.version}")
print(f"可执行文件路径: {sys.executable}")
```

```python
# pip install numpy pandas matplotlib
# ============================================================
# 单元格 2：检查 conda 环境变量
# ============================================================
import os
conda_env = os.environ.get("CONDA_DEFAULT_ENV", "not set")
print(f"当前 conda 环境: {conda_env}")
```

```python
# pip install numpy pandas matplotlib
# ============================================================
# 单元格 3：验证 NumPy 安装并测试数组运算
# ============================================================
import numpy as np
print(f"NumPy 版本: {np.__version__}")
arr = np.array([1, 2, 3, 4, 5])
print(f"数组: {arr}")
print(f"数组运算 (arr * 2): {arr * 2}")
print(f"数组求和: {arr.sum()}, 平均值: {arr.mean()}")
```

```python
# pip install numpy pandas matplotlib
# ============================================================
# 单元格 4：验证 Matplotlib 并绘制正弦波
# ============================================================
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 2 * np.pi, 100)
y_sin = np.sin(x)
y_cos = np.cos(x)

plt.figure(figsize=(8, 4))
plt.plot(x, y_sin, label="sin(x)", color="#3498db")
plt.plot(x, y_cos, label="cos(x)", color="#e74c3c", linestyle="--")
plt.title("Jupyter 环境验证：Matplotlib 测试")
plt.xlabel("x")
plt.ylabel("y")
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()
print("Matplotlib 绑定成功，图表已渲染！")
```

```python
# pip install numpy pandas matplotlib
# ============================================================
# 单元格 5：验证 Pandas 并演示基本数据操作
# ============================================================
import pandas as pd

df = pd.DataFrame({
    "课程": ["L1", "L2", "L3", "L4"],
    "名称": ["AI概述", "环境搭建", "数学基础", "Python进阶"],
    "课时": [2, 2, 2, 2]
})
print("课程信息表：")
print(df)
print(f"\n数据形状: {df.shape}")
print(f"列名: {list(df.columns)}")
```

```python
# pip install numpy pandas matplotlib
# ============================================================
# 单元格 6：检查已安装的所有第三方包
# ============================================================
import pkg_resources

installed = [
    f"{p.project_name}=={p.version}"
    for p in pkg_resources.working_set
]
print(f"已安装包数量: {len(installed)}")
print("\n前 15 个包（按字母排序）:")
for pkg in sorted(installed)[:15]:
    print(f"  {pkg}")
```

## 4. 练习题

1. **环境搭建**: 在你的电脑上安装 Anaconda，并使用 `conda create`创建一个名为 `ai-learning` 的 Python 3.11 环境。然后在该环境中安装 `numpy`、`pandas`、`matplotlib` 三个包。
2. **环境导出与复现**: 将上题创建的环境导出为 `environment.yml`，然后尝试在另一台机器上使用该文件重建相同的环境。
3. **Jupyter 入门**: 在 Jupyter Notebook 中完成以下操作：创建一个包含「我的第一个 AI 课程」标题的 Markdown 单元格，再创建一个打印「Hello AI!」的代码单元格，并运行它。
4. **包管理对比**: 分别使用 `pip install` 和 `conda install` 安装 `scikit-learn`，比较两种方法的输出差异，并说明这两种方式各自的优势与局限。
5. **工具链探索**: 注册 GitHub 账号，安装 VS Code 并安装 Python 插件，在 VS Code 中打开上一题创建的 Jupyter Notebook 文件（.ipynb），体验两种开发环境的差异。

## 5. 延伸阅读

- **官网文档**: Anaconda 官方文档 — https://docs.anaconda.com/
- **conda 用户指南**: https://docs.conda.io/projects/conda/
- **Jupyter 官方文档**: https://jupyter-notebook.readthedocs.io/
- **VS Code Python 教程**: https://code.visualstudio.com/docs/python/python-tutorial
- **工具**: Google Colab（https://colab.research.google.com）— 无需本地安装，在线运行 Jupyter Notebook

---

# L3: 数学基础回顾

**课时**: 2 课时（90 分钟/课时）

## 1. 学习目标

完成本课程后，学员能够：

1. 理解向量、矩阵的几何意义，并能用 NumPy 进行基本线性代数运算（加减乘、转置、逆、特征值）
2. 解释概率论中的条件概率、贝叶斯定理，并应用于简单场景的推理计算
3. 说明信息熵、交叉熵的数学含义，理解它们在 ML 损失函数中的应用
4. 能读懂并手动推导梯度下降的单步更新公式
5. 对积分、导数、极值有直观理解，能识别机器学习中的数学符号

## 2. 核心知识点

### 2.1 线性代数

**向量与矩阵基础**

- **向量**: n 维有序数列表，几何上表示空间中的一个点或方向
- **矩阵**: m×n 数表，表示线性变换（旋转、缩放、投影）
- **核心运算**:
  - 加减：对应元素操作
  - 数乘：每个元素乘以标量
  - 矩阵乘法：(m×n)·(n×p) = (m×p)，复杂度 O(n²)
  - 转置：行列互换，记作 Aᵀ
  - 逆矩阵：A⁻¹，满足 AA⁻¹ = I（仅方阵且行列式非零时存在）

**神经网络中的线性代数**

- 输入向量 x ∈ ℝⁿ 通过权重矩阵 W ∈ ℝⁿˣᵐ 变换为隐向量 h = Wx + b
- 批量处理时使用矩阵乘法一次完成多个样本的计算（GPU 并行基础）

### 2.2 概率统计

**基本概念**

- **随机变量**: 取值随机的变量，分为离散（如骰子）和连续（如身高）
- **概率分布**: 描述随机变量取各值的概率（P(X=x)）
- **期望值 E[X]**: 随机变量的长期平均值（加权求和）
- **方差 Var(X)**: 数据离散程度的度量 E[(X-E[X])²]

**条件概率与贝叶斯定理**

- P(A|B) = P(A∩B) / P(B)（B 发生时 A 的概率）
- **贝叶斯定理**: P(A|B) = P(B|A)·P(A) / P(B)
  - P(A) 先验概率
  - P(A|B) 后验概率
  - P(B|A) 似然度

### 2.3 信息论

**熵（Entropy）**

- H(X) = -∑ p(x) log₂ p(x)（单位：比特）
- 描述随机变量的不确定性；均匀分布熵最大

**交叉熵（Cross-Entropy）**

- CE(p, q) = -∑ p(x) log q(x)
- 机器学习中作为分类损失函数（Softmax + Cross-Entropy）
- 交叉熵 ≥ 熵，当 q=p 时等于熵

### 2.4 微积分基础

**导数与梯度**

- 导数：函数在某点的瞬时变化率（切线斜率）
- 梯度：多元函数在每维上的偏导数向量 ▽f = [∂f/∂x₁, ∂f/∂x₂, ...]
- 梯度指向函数上升最快的方向；沿负梯度方向下降最快

**梯度下降算法**

目标：最小化均方误差 MSE = (1/n)∑(ŷᵢ - yᵢ)²

## 3. 代码示例

**运行说明**: 本脚本综合演示线性代数、概率论、信息论三大数学基础。在 Jupyter Notebook 中依次运行每个代码段，或在终端执行完整脚本。

```python
# pip install numpy matplotlib
"""
L3-math-review.py
综合演示：线性代数 + 概率 + 信息论
终端运行：python L3-math-review.py
Jupyter Notebook 运行：复制各代码段到独立单元格执行
"""

import numpy as np
import matplotlib.pyplot as plt

print("=" * 60)
print("L3 数学基础综合演示")
print("=" * 60)

# ============================================================
# Part 1: 线性代数 — 矩阵分解与特征值
# ============================================================
print("\n[1] 特征值分解：PCA 的数学核心")

A = np.array([[2.0, 1.0], [1.0, 2.0]])
eigenvalues, eigenvectors = np.linalg.eig(A)

print(f"矩阵 A = \n{A}")
print(f"特征值 λ = {eigenvalues.round(4)}")
print(f"特征向量（按列）= \n{eigenvectors.round(4)}")

v = eigenvectors[:, 0]
av = A @ v
lambda_v = eigenvalues[0] * v
print(f"\n验证 Av = λv:")
print(f"  A @ v = {av.round(4)}")
print(f"  λ * v = {lambda_v.round(4)}")
print(f"  两向量相等: {np.allclose(av, lambda_v)}")

#矩阵的行列式和逆
det_A = np.linalg.det(A)
A_inv = np.linalg.inv(A)
print(f"\n行列式 det(A) = {det_A:.4f}")
print(f"逆矩阵 A^-1 = \n{A_inv.round(4)}")
print(f"验证 A @ A^-1 = I:\n{(A @ A_inv).round(4)}")

# ============================================================
# Part 2: 概率论 — 贝叶斯推断（医疗诊断）
# ============================================================
print("\n[2] 贝叶斯推断：医疗检测场景")
print("场景：某疾病患病率 1%，检测准确率 99%（患病者阳性率 99%，未患病者阴性率 99%）")

P_disease = 0.01
P_positive_given_disease = 0.99
P_negative_given_healthy = 0.99

P_positive_given_healthy = 1.0 - P_negative_given_healthy

P_positive = (
    P_positive_given_disease * P_disease
    + P_positive_given_healthy * (1.0 - P_disease)
)

P_disease_given_positive = (
    P_positive_given_disease * P_disease / P_positive
)

print(f"\nP(疾病)       = {P_disease:.4f} (先验概率)")
print(f"P(阳性|疾病)  = {P_positive_given_disease:.4f}")
print(f"P(阴性|健康)  = {P_negative_given_healthy:.4f}")
print(f"P(阳性) = {P_positive:.4f}")
print(f"P(疾病|阳性)  = {P_disease_given_positive:.4f}")
print(f"\n结论：检测呈阳性时，实际患病的概率约为 {P_disease_given_positive*100:.1f}%！")
print("（直觉上容易误以为 99%，但由于疾病本身很罕见，需要考虑 base rate）")

# ============================================================
# Part 3: 信息论 — 熵与交叉熵
# ============================================================
print("\n[3] 信息论：香农熵与交叉熵")


def shannon_entropy(p):
    """计算离散分布的香农熵（以2为底，单位：比特）"""
    p = np.array(p, dtype=np.float64)
    p = np.clip(p, 1e-10, 1.0)
    return -np.sum(p * np.log2(p))


def cross_entropy(p, q):
    """计算分布 p 对分布 q 的交叉熵 H(p, q)"""
    p = np.array(p, dtype=np.float64)
    q = np.array(q, dtype=np.float64)
    q = np.clip(q, 1e-10, 1.0)
    return -np.sum(p * np.log2(q))


def kl_divergence(p, q):
    """计算 KL(p||q) = H(p,q) - H(p)"""
    return cross_entropy(p, q) - shannon_entropy(p)


# 示例1：均匀硬币
p_coin = [0.5, 0.5]
h_coin = shannon_entropy(p_coin)
print(f"\n均匀硬币分布 {p_coin}")
print(f"  香农熵 H = {h_coin:.4f} bits (最大熵，不确定性最高)")

# 示例2：偏置硬币
p_biased = [0.9, 0.1]
h_biased = shannon_entropy(p_biased)
print(f"\n偏置硬币分布 {p_biased}")
print(f"  香农熵 H = {h_biased:.4f} bits (偏置分布熵更小)")

# 示例3：交叉熵与 KL散度
q_uniform = [0.5, 0.5]
ce = cross_entropy(p_biased, q_uniform)
kl = kl_divergence(p_biased, q_uniform)
print(f"\n用均匀分布 q={q_uniform} 描述偏置硬币 p={p_biased}:")
print(f"  交叉熵 H(p,q) = {ce:.4f} bits")
print(f"  熵 H(p)       = {h_biased:.4f} bits")
print(f"  KL(p||q)      = {kl:.4f} bits (用均匀分布描述偏置分布的额外代价)")

# ============================================================
# Part 4: 可视化 — 熵的变化曲线与损失函数对比
# ============================================================
print("\n[4] 生成可视化图表...")

p_range = np.linspace(0.001, 0.999, 200)
h_values = [
    shannon_entropy([p, 1.0 - p])
    for p in p_range
]

fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# 子图1：二元分布的香农熵随 p变化
axes[0].plot(p_range, h_values, color="#2ecc71", linewidth=2)
axes[0].set_xlabel("p(X=1)", fontsize=11)
axes[0].set_ylabel("H(p) [bits]", fontsize=11)
axes[0].set_title("二元分布的香农熵", fontsize=13)
axes[0].grid(True, alpha=0.3)
axes[0].axvline(x=0.5, color="gray", linestyle="--", alpha=0.6)
axes[0].text(0.52, 0.95, "p=0.5 时熵最大 (1 bit)", fontsize=9, transform=axes[0].transAxes)

# 子图2：交叉熵 vs MSE 作为分类损失函数的对比
p_true = np.array([0.0, 1.0])
q1_values = np.linspace(0.01, 0.99, 100)
ce_values = []
mse_values = []

for q1 in q1_values:
    q = np.array([1.0 - q1, q1])
    ce_values.append(cross_entropy(p_true, q))
    mse_values.append(np.mean((p_true - q) ** 2))

axes[1].plot(q1_values, ce_values, label="Cross-Entropy", color="#3498db", linewidth=2)
axes[1].plot(q1_values, mse_values, label="MSE", color="#e74c3c", linestyle="--", linewidth=2)
axes[1].set_xlabel("预测概率 q(X=1)", fontsize=11)
axes[1].set_ylabel("损失值", fontsize=11)
axes[1].set_title("分类损失函数对比（真实分布 [0,1]）", fontsize=13)
axes[1].legend(fontsize=10)
axes[1].grid(True, alpha=0.3)
axes[1].axvline(x=1.0, color="green", linestyle=":", alpha=0.6)
axes[1].text(0.85, 0.95, "q=[0,1] 时 CE=0（最优）", fontsize=9, transform=axes[1].transAxes)

plt.tight_layout()
output_path = "l3_math_demo.png"
plt.savefig(output_path, dpi=150)
plt.show()
print(f"\n数学基础演示图已保存至 {output_path}")
```

## 4. 练习题

1. **线性代数**: 给定矩阵 A = [[1,2],[3,4]] 和向量 x = [1,1]，计算 A·x、Aᵀ、A 的行列式和逆矩阵（使用 NumPy 验证手算结果）。
2. **概率计算**: 一种疾病检测方法的准确率为 99%（患病者检测阳性概率 99%，未患病者检测阴性概率 99%）。若该疾病在人群中的患病率为 0.5%，计算检测结果为阳性时真正患病的概率。
3. **信息论**: 计算抛掷一枚均匀六面骰子的香农熵（以比特为单位），然后计算一枚偏置骰子（6 出现概率为 50%，其他面各 10%）的熵，说明为何偏置分布熵更小。
4. **梯度下降**: 对于函数 f(x) = x⁴ - 4x²，手动推导其梯度公式，并使用 Python 实现梯度下降算法，找到一个局部最小值点（初始值 x₀=0.5，学习率 0.01，迭代 100 次）。
5. **综合应用**: 假设一个神经网络最后一层的原始输出为 logit = [2.0, 1.0, 0.5]，请手动计算：① 通过 Softmax 转为概率分布；② 假设真实标签为类别 0（one-hot 为 [1,0,0]），计算交叉熵损失值。

## 5. 延伸阅读

- **书籍**: Gilbert Strang, *Linear Algebra and Its Applications*（第5版）— 麻省理工线性代数教材，配套视频可在 MIT OpenCourseWare 免费观看
- **书籍**: 西格蒙德, 《概率论与数理统计》— 国内经典教材
- **在线课程**: 3Blue1Brown, *Essence of Linear Algebra*（B站中文翻译）— 几何直觉理解线性代数
- **在线课程**: Khan Academy, *Statistics & Probability* — 互动式概率统计学习
- **工具**: https://www.geogebra.org/ — 可视化数学概念（梯度、矩阵变换等）

---

# L4: Python 进阶

**课时**: 2 课时（90 分钟/课时）

## 1. 学习目标

完成本课程后，学员能够：

1. 熟练使用 NumPy 进行向量化数组操作，避免 Python 循环的性能瓶颈
2. 使用 Pandas 完成数据读取、清洗、聚合与基本统计分析
3. 用 Matplotlib 绘制高质量数据可视化图表（折线、散点、柱状、热力图）
4. 理解面向对象编程（类、继承、封装）的核心概念，并能设计简单的神经网络类
5. 将数据处理、可视化与 OOP 三者结合，完成一个小型完整的数据分析项目

## 2. 核心知识点

### 2.1 NumPy 进阶

**向量化思维**

Python 循环是性能瓶颈；NumPy 向量化操作利用 SIMD 指令并行加速，速度提升 10–100 倍。

**广播（Broadcasting）**: 小矩阵与大矩阵运算时自动扩展

**常用函数**: `np.mean`, `np.std`, `np.argmax`, `np.unique`, `np.concatenate`, `np.dot`

### 2.2 Pandas 数据处理

**核心数据结构**

- `Series`：一维带标签数组
- `DataFrame`：二维表格（类似 Excel / SQL 表）

**常用操作**: 条件筛选、分组聚合、新增列、缺失值处理、文件读写

### 2.3 Matplotlib 数据可视化

**图表类型选择指南**

| 数据场景 | 推荐图表 |
|----------|----------|
| 随时间变化趋势 | 折线图 |
| 分类对比 | 柱状图 |
| 两个变量关系 | 散点图 |
| 分布情况 | 直方图 / 箱线图 |
| 相关性矩阵 | 热力图 |

### 2.4 面向对象编程（OOP）

**核心概念**

- **类（Class）**: 抽象的数据类型模板，定义属性（data）和方法（behavior）
- **对象（Object）**: 类的实例
- **继承（Inheritance）**: 子类复用父类代码并扩展功能
- **封装（Encapsulation）**: 隐藏内部细节，通过公共接口交互

## 3. 代码示例

### 3.1 L4-Part1: NumPy 向量化演示

**运行说明**: 运行此脚本对比 Python 循环与 NumPy 向量化的性能差异。

```python
# pip install numpy
"""
L4-numpy-vectorization.py
NumPy 向量化性能演示：对比 Python 循环 vs NumPy 向量化
终端运行：python L4-numpy-vectorization.py
"""

import numpy as np
import time

print("=" * 50)
print("NumPy 向量化演示")
print("=" * 50)

n = 10_000_000
a = np.random.rand(n)
b = np.random.rand(n)

# 方法1：Python 循环（逐元素乘法后求和）
start = time.time()
result_loop = 0.0
for i in range(n):
    result_loop += a[i] * b[i]
loop_time = time.time() - start

# 方法2：NumPy 向量化 dot product
start = time.time()
result_vec = np.dot(a, b)
vec_time = time.time() - start

# 方法3：NumPy 向量化（对应元素相乘后求和）
start = time.time()
result_vec2 = np.sum(a * b)
vec2_time = time.time() - start

print(f"\n数组规模: {n:,} 元素")
print(f"Python 循环结果: {result_loop:.4f}, 耗时: {loop_time:.4f}s")
print(f"np.dot 结果:      {result_vec:.4f}, 耗时: {vec_time:.4f}s")
print(f"np.sum(a*b) 结果: {result_vec2:.4f}, 耗时: {vec2_time:.4f}s")
print(f"\nnp.dot 加速比:   {loop_time / vec_time:.1f}x")
print(f"np.sum(a*b) 加速比: {loop_time / vec2_time:.1f}x")

# 额外演示：NumPy 常用向量化操作
print("\n--- NumPy 向量化操作示例 ---")
arr = np.arange(1, 11)
print(f"arr = {arr}")
print(f"arr * 2  = {arr * 2}")
print(f"arr ** 2 = {arr ** 2}")
print(f"np.sqrt(arr) = {np.sqrt(arr).round(2)}")
print(f"arr[arr > 5]  = {arr[arr > 5]}")

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
print(f"\n矩阵 A =\n{A}")
print(f"矩阵 B =\n{B}")
print(f"A @ B (矩阵乘法) =\n{A @ B}")
print(f"A * B (逐元素乘法) =\n{A * B}")
```

### 3.2 L4-Part2: Pandas 数据处理演示

**运行说明**: 运行此脚本演示 Pandas 基本数据操作。

```python
# pip install pandas numpy matplotlib
"""
L4-pandas-demo.py
Pandas 数据处理演示：学生成绩数据分析
终端运行：python L4-pandas-demo.py
"""

import pandas as pd
import numpy as np

print("=" * 50)
print("Pandas 数据处理演示")
print("=" * 50)

# 创建示例 DataFrame
df = pd.DataFrame({
    "姓名": ["张三", "李四", "王五", "赵六", "陈七"],
    "数学": [92, 78, 85, 96, 63],
    "英语": [88, 95, 79, 91, 72],
    "班级": ["A", "B", "A", "B", "A"]
})

print("\n原始数据:")
print(df)

# 新增列：总分和平均分
df["总分"] = df["数学"] + df["英语"]
df["平均分"] = df["总分"] / 2
print("\n新增总分和平均分后:")
print(df)

# 条件筛选：平均分 > 85 的学生
print("\n平均分 > 85 的学生:")
print(df[df["平均分"] > 85])

# 分组聚合：按班级计算平均分
print("\n各班平均分:")
print(df.groupby("班级")["平均分"].mean().round(2))

# 描述性统计
print("\n描述性统计:")
print(df[["数学", "英语"]].describe())

# 读取外部数据示例（取消注释即可使用）
# df_csv = pd.read_csv("data.csv")
# df_excel = pd.read_excel("data.xlsx")
# df_json = pd.read_json("data.json")
```

### 3.3 L4-Part3: Matplotlib 可视化演示

**运行说明**: 运行此脚本生成包含 4 个子图的可视化图表。

```python
# pip install matplotlib numpy pandas
"""
L4-matplotlib-demo.py
Matplotlib 数据可视化演示：多图表综合展示
终端运行：python L4-matplotlib-demo.py
"""

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

plt.rcParams["font.sans-serif"] = ["Arial Unicode MS", "SimHei"]
plt.rcParams["axes.unicode_minus"] = False

print("=" * 50)
print("Matplotlib 可视化演示")
print("=" * 50)

# 创建画布：2x2 子图布局
fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# ----------------------------------------
# 子图1：折线图 — 神经网络训练曲线
# ----------------------------------------
epochs = np.arange(1, 21)
train_loss = 2.5 * np.exp(-0.15 * epochs) + np.random.randn(20) * 0.1
val_loss = 2.3 * np.exp(-0.12 * epochs) + np.random.randn(20) * 0.15

axes[0, 0].plot(epochs, train_loss, "o-", label="训练损失", color="#3498db", markersize=5)
axes[0, 0].plot(epochs, val_loss, "s--", label="验证损失", color="#e74c3c", markersize=5)
axes[0, 0].set_xlabel("Epoch", fontsize=11)
axes[0, 0].set_ylabel("Loss", fontsize=11)
axes[0, 0].set_title("神经网络训练曲线", fontsize=13)
axes[0, 0].legend(fontsize=10)
axes[0, 0].grid(True, alpha=0.3)

# ----------------------------------------
# 子图2：散点图 — 真实值 vs 预测值
# ----------------------------------------
np.random.seed(42)
y_true = np.random.randn(100) * 10 + 50
y_pred = y_true + np.random.randn(100) * 3

axes[0, 1].scatter(y_true, y_pred, alpha=0.6, c="#2ecc71", edgecolors="none", s=50)
axes[0, 1].plot([20, 80], [20, 80], "r--", linewidth=2, label="理想预测线")
axes[0, 1].set_xlabel("真实值", fontsize=11)
axes[0, 1].set_ylabel("预测值", fontsize=11)
axes[0, 1].set_title("回归预测效果", fontsize=13)
axes[0, 1].legend(fontsize=10)
axes[0, 1].grid(True, alpha=0.3)

# ----------------------------------------
# 子图3：柱状图 — 课程评分对比
# ----------------------------------------
courses = ["AI概述", "环境搭建", "数学基础", "Python进阶"]
ratings = [4.5, 4.8, 4.3, 4.7]
colors = ["#3498db", "#2ecc71", "#e74c3c", "#9b59b6"]

bars = axes[1, 0].bar(courses, ratings, color=colors, edgecolor="black", linewidth=1.2)
axes[1, 0].set_ylim(0, 5.5)
axes[1, 0].set_ylabel("评分（满分5分）", fontsize=11)
axes[1, 0].set_title("课程评分对比", fontsize=13)
for i, (c, r) in enumerate(zip(courses, ratings)):
    axes[1, 0].text(i, r + 0.1, f"{r:.1f}", ha="center", fontsize=11, fontweight="bold")
axes[1, 0].grid(True, alpha=0.3, axis="y")

# ----------------------------------------
# 子图4：热力图 — 相关性矩阵
# ----------------------------------------
np.random.seed(0)
data = pd.DataFrame({
    "数学": np.random.randint(60, 100, 50),
    "英语": np.random.randint(60, 100, 50),
    "物理": np.random.randint(60, 100, 50),
    "化学": np.random.randint(60, 100, 50)
})
corr = data.corr()

im = axes[1, 1].imshow(corr, cmap="RdBu_r", vmin=-1, vmax=1, aspect="auto")
axes[1, 1].set_xticks(range(4))
axes[1, 1].set_yticks(range(4))
axes[1, 1].set_xticklabels(corr.columns, fontsize=9)
axes[1, 1].set_yticklabels(corr.columns, fontsize=9)
axes[1, 1].set_title("成绩相关性矩阵热力图", fontsize=13)
plt.colorbar(im, ax=axes[1, 1], shrink=0.8)

for i in range(4):
    for j in range(4):
        text_color = "white" if abs(corr.iloc[i, j]) > 0.5 else "black"
        axes[1, 1].text(
            j, i, f"{corr.iloc[i, j]:.2f}",
            ha="center", va="center",
            color=text_color, fontsize=10
        )

plt.suptitle("L4 Matplotlib 数据可视化综合示例", fontsize=16, fontweight="bold")
plt.tight_layout()
output_path = "l4_visualization.png"
plt.savefig(output_path, dpi=150, bbox_inches="tight")
plt.show()
print(f"\n可视化图表已保存至 {output_path}")
```

### 3.4 L4-Part4: OOP 神经网络类设计

**运行说明**: 运行此脚本演示如何使用面向对象编程构建一个简单的神经网络类。

```python
# pip install numpy
"""
L4-oop-neural-network.py
面向对象编程演示：使用 OOP 模式设计简单神经网络类
包含 Layer 基类、Dense 层、ReLU 激活、Softmax +交叉熵损失
终端运行：python L4-oop-neural-network.py
"""

import numpy as np

print("=" * 50)
print("OOP 神经网络类设计演示")
print("=" * 50)


# ============================================================
# Layer 基类：定义神经网络层的接口
# ============================================================
class Layer:
    """神经网络层基类，定义前向传播和反向传播的接口"""

    def forward(self, x):
        raise NotImplementedError("子类必须实现 forward 方法")

    def backward(self, grad):
        raise NotImplementedError("子类必须实现 backward 方法")


# ============================================================
# Dense 全连接层
# ============================================================
class Dense(Layer):
    """全连接层：y = W @ x + b
    使用 Xavier 初始化，保持前向传播方差稳定
    """

    def __init__(self, input_dim, output_dim):
        self.W = np.random.randn(input_dim, output_dim) * np.sqrt(2.0 / input_dim)
        self.b = np.zeros((1, output_dim))
        self.x = None
        self.grad_W = None
        self.grad_b = None

    def forward(self, x):
        self.x = x
        return x @ self.W + self.b

    def backward(self, grad):
        self.grad_W = self.x.T @ grad
        self.grad_b = np.sum(grad, axis=0, keepdims=True)
        grad_input = grad @ self.W.T
        return grad_input


# ============================================================
# ReLU 激活层
# ============================================================
class ReLU(Layer):
    """ReLU 激活函数：y = max(0, x)"""

    def __init__(self):
        self.mask = None

    def forward(self, x):
        self.mask = (x > 0)
        return np.maximum(0, x)

    def backward(self, grad):
        return grad * self.mask


# ============================================================
# Softmax + 交叉熵损失（数值稳定版）
# ============================================================
class SoftmaxCrossEntropy:
    """Softmax 激活 + 交叉熵损失联合计算（数值稳定）
    前向传播返回损失值，反向传播直接返回 softmax 概率梯度
    """

    def forward(self, x, y):
        x_shifted = x - np.max(x, axis=1, keepdims=True)
        exp_x = np.exp(x_shifted)
        self.probs = exp_x / np.sum(exp_x, axis=1, keepdims=True)

        batch_size = len(y)
        if len(y.shape) == 1:
            correct_logprobs = -np.log(self.probs[range(batch_size), y] + 1e-10)
        else:
            correct_logprobs = -np.sum(y * np.log(self.probs + 1e-10), axis=1)

        self.loss = np.mean(correct_logprobs)
        return self.loss

    def backward(self, y):
        return self.probs


# ============================================================
# 简单神经网络容器类
# ============================================================
class SimpleNeuralNet:
    """简单两层神经网络：Dense -> ReLU -> Dense -> SoftmaxCrossEntropy"""

    def __init__(self, input_dim, hidden_dim, output_dim):
        self.layer1 = Dense(input_dim, hidden_dim)
        self.relu = ReLU()
        self.layer2 = Dense(hidden_dim, output_dim)
        self.loss_fn = SoftmaxCrossEntropy()

    def forward(self, x):
        h = self.relu.forward(self.layer1.forward(x))
        logits = self.layer2.forward(h)
        return logits

    def train_step(self, x, y):
        logits = self.forward(x)
        loss = self.loss_fn.forward(logits, y)
        grad = self.loss_fn.backward(y)

        grad_layer2 = self.layer2.backward(grad)
        grad_relu = self.relu.backward(grad_layer2)
        grad_layer1 = self.layer1.backward(grad_relu)

        return loss

    def predict(self, x):
        logits = self.forward(x)
        probs = self.loss_fn.probs
        return np.argmax(probs, axis=1)


# ============================================================
# 演示：使用神经网络
# ============================================================
print("\n[1] 创建神经网络实例")
net = SimpleNeuralNet(input_dim=4, hidden_dim=8, output_dim=3)
print(f"  输入维度: 4, 隐层维度: 8, 输出维度: 3")

print("\n[2] 前向传播测试（batch_size=4）")
x_batch = np.random.randn(4, 4)
logits = net.forward(x_batch)
print(f"  输入形状: {x_batch.shape}")
print(f"  输出 logits形状: {logits.shape}")
print(f"  输出 logits:\n{logits.round(4)}")

print("\n[3] 训练一步并计算损失（随机标签）")
y_random = np.array([0, 2, 1, 0])
loss = net.train_step(x_batch, y_random)
print(f"  随机标签: {y_random}")
print(f"  当前损失: {loss:.4f}")

print("\n[4] 预测结果")
predictions = net.predict(x_batch)
print(f"  预测类别: {predictions}")
print(f"  各类别概率:\n{net.loss_fn.probs.round(4)}")

print("\n[5] 使用真实标签训练（演示）")
y_onehot = np.array([[1, 0, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0]], dtype=np.float64)
loss2 = net.train_step(x_batch, y_onehot)
print(f"  One-hot 标签损失: {loss2:.4f}")

print("\n[6] 参数信息汇总")
print(f"  Layer1 W 形状: {net.layer1.W.shape}")
print(f"  Layer1 b 形状: {net.layer1.b.shape}")
print(f"  Layer2 W 形状: {net.layer2.W.shape}")
print(f"  Layer2 b 形状: {net.layer2.b.shape}")
```

### 3.5 L4-Part5: 综合项目

**运行说明**: 运行此脚本完成学生成绩数据的完整分析Pipeline，结合 NumPy + Pandas + Matplotlib + OOP。

```python
# pip install numpy pandas matplotlib
"""
L4-comprehensive-project.py
综合项目：学生成绩数据分析
结合 NumPy 向量化 + Pandas 数据处理 + Matplotlib 可视化 + OOP 统计分析类
终端运行：python L4-comprehensive-project.py
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

plt.rcParams["font.sans-serif"] = ["Arial Unicode MS", "SimHei"]
plt.rcParams["axes.unicode_minus"] = False

print("=" * 60)
print("L4 综合项目：学生成绩数据分析报告")
print("=" * 60)

# ============================================================
# Step 1: 数据准备（使用 NumPy 生成模拟数据）
# ============================================================
np.random.seed(42)
n_students = 120

data = {
    "学号": [f"S{i:04d}" for i in range(1, n_students + 1)],
    "姓名": [f"学生{i}" for i in range(1, n_students + 1)],
    "班级": np.random.choice(["AI-1班", "AI-2班", "AI-3班"], n_students),
    "数学": np.clip(np.random.normal(78, 12, n_students).astype(int), 45, 100),
    "英语": np.clip(np.random.normal(82, 10, n_students).astype(int), 45, 100),
    "编程": np.clip(np.random.normal(85, 11, n_students).astype(int), 45, 100),
}
df = pd.DataFrame(data)

# ============================================================
# Step 2: 数据清洗与特征工程（使用 Pandas）
# ============================================================
df["总分"] = df["数学"] + df["英语"] + df["编程"]
df["平均分"] = (df["总分"] / 3).round(2)
df["等级"] = df["平均分"].apply(
    lambda x: "A" if x >= 90 else "B" if x >= 80 else "C" if x >= 70 else "D"
)

# ============================================================
# Step 3: 统计分析（OOP 风格的统计类）
# ============================================================
class GradeStatistics:
    """学生成绩统计类：封装常用统计分析方法"""

    def __init__(self, df):
        self.df = df

    def summary(self):
        print(f"\n学生总数: {len(self.df)}")
        print(f"\n各科平均分:\n{self.df[['数学', '英语', '编程']].mean().round(2)}")
        print(f"\n各科标准差:\n{self.df[['数学', '英语', '编程']].std().round(2)}")

    def class_ranking(self):
        print("\n班级平均分排名:")
        ranking = self.df.groupby("班级")["平均分"].mean().sort_values(ascending=False)
        print(ranking.round(2))

    def grade_distribution(self):
        print("\n等级分布:")
        dist = self.df["等级"].value_counts().sort_index()
        print(dist)
        print(f"\n各等级占比:")
        print((dist / len(self.df) * 100).round(1).astype(str) + "%")

    def top_students(self, n=5):
        print(f"\n总分前 {n} 名学生:")
        top = self.df.nlargest(n, "总分")[["学号", "姓名", "班级", "总分", "等级"]]
        print(top.to_string(index=False))


stats = GradeStatistics(df)
stats.summary()
stats.class_ranking()
stats.grade_distribution()
stats.top_students(n=5)

# ============================================================
# Step 4: 数据可视化（使用 Matplotlib）
# ============================================================
fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# 子图1：各班各科平均分柱状图
class_means = df.groupby("班级")[["数学", "英语", "编程"]].mean()
class_means.plot(
    kind="bar",
    ax=axes[0, 0],
    color=["#3498db", "#e74c3c", "#2ecc71"],
    edgecolor="black",
    linewidth=1.0
)
axes[0, 0].set_title("各班各科平均分对比", fontsize=13)
axes[0, 0].set_ylabel("分数", fontsize=11)
axes[0, 0].tick_params(axis="x", rotation=15)
axes[0, 0].legend(loc="upper right", fontsize=10)
axes[0, 0].grid(True, alpha=0.3, axis="y")

# 子图2：总分分布直方图
axes[0, 1].hist(
    df["总分"],
    bins=15,
    color="#9b59b6",
    edgecolor="white",
    alpha=0.8
)
axes[0, 1].axvline(
    df["总分"].mean(),
    color="red",
    linestyle="--",
    linewidth=2,
    label=f"均值={df['总分'].mean():.1f}"
)
axes[0, 1].set_title("总分分布直方图", fontsize=13)
axes[0, 1].set_xlabel("总分", fontsize=11)
axes[0, 1].set_ylabel("学生人数", fontsize=11)
axes[0, 1].legend(fontsize=10)
axes[0, 1].grid(True, alpha=0.3, axis="y")

# 子图3：数学 vs 编程散点图（按等级着色）
colors_map = {"A": "#2ecc71", "B": "#3498db", "C": "#f39c12", "D": "#e74c3c"}
for grade, color in colors_map.items():
    subset = df[df["等级"] == grade]
    axes[1, 0].scatter(
        subset["数学"],
        subset["编程"],
        label=f"等级{grade}",
        alpha=0.7,
        c=color,
        edgecolors="none",
        s=60
    )
axes[1, 0].set_xlabel("数学成绩", fontsize=11)
axes[1, 0].set_ylabel("编程成绩", fontsize=11)
axes[1, 0].set_title("数学 vs 编程成绩（按等级着色）", fontsize=13)
axes[1, 0].legend(fontsize=10)
axes[1, 0].grid(True, alpha=0.3)

# 子图4：各科成绩箱线图
df[["数学", "英语", "编程"]].plot(kind="box", ax=axes[1, 1])
axes[1, 1].set_title("各科成绩箱线图", fontsize=13)
axes[1, 1].set_ylabel("分数", fontsize=11)
axes[1, 1].grid(True, alpha=0.3, axis="y")

plt.suptitle("L4 综合项目：学生成绩数据分析报告", fontsize=16, fontweight="bold")
plt.tight_layout()
output_path = "l4_project_report.png"
plt.savefig(output_path, dpi=150, bbox_inches="tight")
plt.show()
print(f"\n分析图表已保存至 {output_path}")
```

## 4. 练习题

1. **NumPy 实战**: 使用 NumPy 生成一个 100×100 的随机矩阵 A 和向量 b，求解线性方程组 Ax = b（使用 `np.linalg.solve`）。然后手动实现高斯消元法验证结果。
2. **Pandas 数据清洗**: 下载一个公开数据集（如 Kaggle 的 Titanic 数据集），使用 Pandas 完成以下操作：① 读取数据；② 识别并处理缺失值；③ 对类别型特征进行编码；④ 保存清洗后的数据到新文件。
3. **Matplotlib 绑图**: 使用 Matplotlib 绑制一个包含 4 个子图的画布，分别展示：正弦波、余弦波、两者叠加、误差棒图（每点添加置信区间）。要求图表具有标题、坐标轴标签、图例，并保存为 PNG 文件。
4. **OOP 设计**: 设计一个 `Optimizer` 基类和 `SGD`（随机梯度下降）、`Adam` 两个子类，实现 `step()` 方法。然后设计一个 `Model` 类，包含若干 `Layer` 实例，实现 `train()` 方法进行完整的前向传播、损失计算、反向传播和参数更新流程。
5. **综合项目**: 在 Week 1-2 四个课程的学习中，你对哪个知识点最感兴趣？选择一个方向（可以是神经网络结构、数据处理流程、可视化方案等），使用本课程所学工具独立完成一个小型的探索性分析项目，并将代码与结果整理提交。

## 5. 延伸阅读

- **书籍**: Jake VanderPlas, *Python Data Science Handbook*（ O'Reilly ）— 涵盖 IPython、NumPy、Pandas、Matplotlib、Scikit-Learn，英文原版可在线免费阅读
- **官网文档**: NumPy 官方教程 — https://numpy.org/devdocs/user/quickstart.html
- **官网文档**: Pandas 官方教程 — https://pandas.pydata.org/docs/getting_started/index.html
- **官网文档**: Matplotlib 官方示例库 — https://matplotlib.org/stable/gallery/index.html
- **书籍**: Al Sweigart, *Automate the Boring Stuff with Python*（第2版）— Python 实用编程，适合巩固基础

---

# 附录：课程进度检查清单

## L1 检查点
- [ ] 能说出 AI 的三个层次（狭义/通用/超级）
- [ ] 能按顺序描述 AI 发展的四次浪潮
- [ ] 能解释 GOFAI 的核心局限

## L2 检查点
- [ ] conda 环境创建与切换成功
- [ ] Jupyter Notebook 能正常运行代码和 Markdown
- [ ] 已安装至少 5 个第三方库

## L3 检查点
- [ ] 能手算矩阵乘法和求逆
- [ ] 能用贝叶斯定理计算条件概率
- [ ] 能解释信息熵与交叉熵的含义

## L4 检查点
- [ ] NumPy 向量化操作替代了 Python 循环
- [ ] Pandas 能完成完整的数据处理 pipeline
- [ ] Matplotlib 能绑制多子图可视化
- [ ] 能设计简单的类层次结构

---

*文档版本：v2.0 | 适用教材：AI 人工智能基础教程 Week 1-2*