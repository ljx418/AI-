# AI入门教程 - Week 3-4 (L5-L8)

---

## L5: ML核心概念

### 学习目标
1. 理解机器学习三种主要学习范式
2. 掌握偏差与方差的trade-off关系
3. 能够识别过拟合与欠拟合

### 核心知识点

#### 1. 机器学习三大范式

| 类型 | 特点 | 典型场景 | 数据标注 |
|------|------|----------|----------|
| 监督学习 | 有标签学习 | 分类、回归 | 需要 |
| 无监督学习 | 无标签学习 | 聚类、降维 | 不需要 |
| 强化学习 | 试错学习 | 游戏、机器人 | 奖励信号 |

#### 2. 偏差-方差分解

模型误差 = 偏差² + 方差 + 不可约噪声

- **高偏差**: 模型太简单，欠拟合，训练集和测试集表现都差
- **高方差**: 模型太复杂，过拟合，训练集表现好但测试集差

#### 3. 经验风险与结构风险

- 经验风险: 训练集上的平均损失
- 结构风险: 加上正则化项防止过拟合

---

### 代码示例

```python
"""
安装依赖: pip install numpy matplotlib scikit-learn
"""

import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.metrics import mean_squared_error

# 生成非线性数据
np.random.seed(42)
X = np.linspace(0, 4, 50).reshape(-1, 1)
y = np.sin(X.flatten()) + np.random.normal(0, 0.3, 50)

# 划分训练测试集
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 演示不同复杂度模型的偏差-方差权衡
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

degrees = [1, 10, 30]
train_scores, test_scores = [], []

for ax, degree in zip(axes, degrees):
    poly = PolynomialFeatures(degree=degree)
    X_train_poly = poly.fit_transform(X_train)
    X_test_poly = poly.transform(X_test)

    model = LinearRegression()
    model.fit(X_train_poly, y_train)

    train_pred = model.predict(X_train_poly)
    test_pred = model.predict(X_test_poly)

    train_mse = mean_squared_error(y_train, train_pred)
    test_mse = mean_squared_error(y_test, test_pred)

    train_scores.append(train_mse)
    test_scores.append(test_mse)

    # 绘图
    X_plot = np.linspace(0, 4, 100).reshape(-1, 1)
    X_plot_poly = poly.transform(X_plot)
    y_plot = model.predict(X_plot_poly)

    ax.scatter(X_train, y_train, alpha=0.7, label='训练集')
    ax.scatter(X_test, y_test, alpha=0.7, label='测试集')
    ax.plot(X_plot, y_plot, 'r-', linewidth=2, label='模型')
    ax.set_title(f'degree={degree}\n训练MSE={train_mse:.4f}, 测试MSE={test_mse:.4f}')
    ax.legend()
    ax.set_ylim(-2, 2)

plt.tight_layout()
plt.savefig('bias_variance_tradeoff.png', dpi=150)
plt.show()

print("\n=== 偏差方差分析 ===")
print(f"degree=1 (欠拟合):  训练MSE={train_scores[0]:.4f}, 测试MSE={test_scores[0]:.4f}")
print(f"degree=10 (适中):   训练MSE={train_scores[1]:.4f}, 测试MSE={test_scores[1]:.4f}")
print(f"degree=30 (过拟合): 训练MSE={train_scores[2]:.4f}, 测试MSE={test_scores[2]:.4f}")
```

**输出说明:**
- degree=1: 高偏差低方差，欠拟合
- degree=10: 偏差方差较平衡
- degree=30: 低偏差高方差，过拟合

---

### 练习题

1. 如果训练误差和测试误差都很高，说明模型存在什么问题？
2. 正则化如何帮助解决过拟合问题？
3. 用Ridge回归重新实现上面的实验，观察L2正则化对过拟合的影响

---

### 延伸阅读

- 《机器学习》周志华 - 第2章 模型评估与选择
- 论文: "Understanding the Bias-Variance Tradeoff" (Geman et al., 1992)

---

## L6: 监督学习算法

### 学习目标
1. 掌握线性回归、逻辑回归的原理与实现
2. 理解决策树算法及信息增益概念
3. 了解SVM的核函数与软间隔

### 核心知识点

#### 1. 线性回归

假设: $y = Xw + b + \epsilon$

优化目标: $\min_w \|Xw - y\|^2$

闭式解: $w = (X^TX)^{-1}X^Ty$

#### 2. 逻辑回归

用于二分类，输出概率 $P(y=1|x) = \sigma(w^Tx + b)$

损失函数: 交叉熵 $-\sum y\log(\hat{y}) + (1-y)\log(1-\hat{y})$

#### 3. 决策树

- ID3: 使用信息增益划分
- C4.5: 使用信息增益率划分
- CART: 使用基尼系数划分

#### 4. SVM

- 硬间隔: 完美分离
- 软间隔: 允许一定错误
- 核函数: 将数据映射到高维空间

---

### 代码示例

```python
"""
安装依赖: pip install numpy matplotlib scikit-learn pandas
"""

import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris, load_diabetes
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, r2_score, classification_report
from sklearn.preprocessing import StandardScaler

print("=" * 60)
print("L6 代码演示: 监督学习算法")
print("=" * 60)

# ============ 1. 线性回归 ============
print("\n【1】线性回归 - 糖尿病预测")
print("-" * 40)

data = load_diabetes()
X, y = data.data, data.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
r2 = r2_score(y_test, y_pred)

print(f"R² Score: {r2:.4f}")
print(f"系数 (前5个): {model.coef_[:5]}")
print(f"截距: {model.intercept_:.4f}")

# ============ 2. 逻辑回归 ============
print("\n【2】逻辑回归 - 鸢尾花二分类")
print("-" * 40)

iris = load_iris()
# 只使用两个类别和两个特征便于可视化
X = iris.data[50:150, :2]
y = (iris.target[50:150] == 2).astype(int)  # 0: versicolor, 1: virginica

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

model = LogisticRegression()
model.fit(X_train_scaled, y_train)

y_pred = model.predict(X_test_scaled)
acc = accuracy_score(y_test, y_pred)

print(f"准确率: {acc:.4f}")
print(classification_report(y_test, y_pred, target_names=['versicolor', 'virginica']))

# 可视化决策边界
plt.figure(figsize=(10, 4))
plt.subplot(1, 2, 1)
h = 0.02
x_min, x_max = X_train_scaled[:, 0].min() - 1, X_train_scaled[:, 0].max() + 1
y_min, y_max = X_train_scaled[:, 1].min() - 1, X_train_scaled[:, 1].max() + 1
xx, yy = np.meshgrid(np.arange(x_min, x_max, h), np.arange(y_min, y_max, h))
Z = model.predict(np.c_[xx.ravel(), yy.ravel()])
Z = Z.reshape(xx.shape)
plt.contourf(xx, yy, Z, alpha=0.3)
plt.scatter(X_train_scaled[:, 0], X_train_scaled[:, 1], c=y_train, edgecolors='k')
plt.xlabel('特征1 (标准化)')
plt.ylabel('特征2 (标准化)')
plt.title('逻辑回归决策边界')
plt.colorbar()
plt.tight_layout()
plt.savefig('logistic_regression.png', dpi=150)
plt.show()

# ============ 3. 决策树 ============
print("\n【3】决策树 - 鸢尾花分类")
print("-" * 40)

X = iris.data
y = iris.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

tree = DecisionTreeClassifier(max_depth=3, random_state=42)
tree.fit(X_train, y_train)

y_pred = tree.predict(X_test)
acc = accuracy_score(y_test, y_pred)

print(f"准确率: {acc:.4f}")
print(f"树的深度: {tree.get_depth()}")
print(f"叶节点数: {tree.get_n_leaves()}")

# 绘制决策树
plt.figure(figsize=(20, 10))
plot_tree(tree, feature_names=iris.feature_names,
          class_names=iris.target_names, filled=True, rounded=True)
plt.savefig('decision_tree.png', dpi=150, bbox_inches='tight')
plt.show()

# ============ 4. SVM ============
print("\n【4】SVM - 线性可分数据")
print("-" * 40)

np.random.seed(42)
# 生成两类线性可分数据
X = np.r_[np.random.randn(50, 2) - [2, 2], np.random.randn(50, 2) + [2, 2]]
y = np.r_[np.zeros(50), np.ones(50)]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 线性SVM
svm_linear = SVC(kernel='linear', C=1.0)
svm_linear.fit(X_train, y_train)

# RBF核SVM
svm_rbf = SVC(kernel='rbf', C=1.0, gamma='scale')
svm_rbf.fit(X_train, y_train)

print(f"线性SVM准确率: {accuracy_score(y_test, svm_linear.predict(X_test)):.4f}")
print(f"RBF-SVM准确率: {accuracy_score(y_test, svm_rbf.predict(X_test)):.4f}")

# 可视化
plt.figure(figsize=(12, 5))
for i, (svm, title) in enumerate([(svm_linear, '线性SVM'), (svm_rbf, 'RBF-SVM')]):
    plt.subplot(1, 2, i+1)
    h = 0.02
    x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
    y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
    xx, yy = np.meshgrid(np.arange(x_min, x_max, h), np.arange(y_min, y_max, h))
    Z = svm.predict(np.c_[xx.ravel(), yy.ravel()])
    Z = Z.reshape(xx.shape)
    plt.contourf(xx, yy, Z, alpha=0.3)
    plt.scatter(X[:, 0], X[:, 1], c=y, edgecolors='k')
    plt.scatter(svm.support_vectors_[:, 0], svm.support_vectors_[:, 1],
                s=100, facecolors='none', edgecolors='r', label='支持向量')
    plt.title(title)
    plt.legend()
plt.tight_layout()
plt.savefig('svm_comparison.png', dpi=150)
plt.show()
```

---

### 练习题

1. 逻辑回归为什么使用sigmoid函数？它有什么优点？
2. 决策树为什么需要对最大深度做限制？
3. SVM的核函数有什么作用？什么情况下需要使用RBF核？

---

### 延伸阅读

- Scikit-learn官方文档: https://scikit-learn.org/stable/supervised_learning.html
- 书籍: "Hands-On Machine Learning" Chapter 2-6

---

## L7: 无监督学习算法

### 学习目标
1. 理解K-Means聚类算法的原理与实现
2. 掌握PCA降维的核心思想
3. 了解异常检测的基本方法

### 核心知识点

#### 1. K-Means聚类

步骤:
1. 随机初始化K个中心点
2. 分配每个样本到最近的中心
3. 更新中心点为簇的均值
4. 重复2-3直到收敛

目标: 最小化簇内平方和 $\sum_{i=1}^{k}\sum_{x \in C_i} \|x - \mu_i\|^2$

#### 2. PCA主成分分析

目标: 找到数据方差最大的方向

步骤:
1. 标准化数据
2. 计算协方差矩阵
3. 特征值分解
4. 选择前k个主成分

#### 3. 异常检测

常用方法:
- 基于统计: Z-score, IQR
- 基于距离: k-NN
- 基于密度: Isolation Forest, LOF

---

### 代码示例

```python
"""
安装依赖: pip install numpy matplotlib scikit-learn
"""

import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import make_blobs, load_iris
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score

print("=" * 60)
print("L7 代码演示: 无监督学习算法")
print("=" * 60)

# ============ 1. K-Means聚类 ============
print("\n【1】K-Means聚类")
print("-" * 40)

# 生成模拟数据
np.random.seed(42)
X, _ = make_blobs(n_samples=300, centers=4, cluster_std=0.6, random_state=42)

# 使用肘部法则确定最优K
inertias = []
silhouettes = []
K_range = range(2, 10)

for k in K_range:
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    kmeans.fit(X)
    inertias.append(kmeans.inertia_)
    silhouettes.append(silhouette_score(X, kmeans.labels_))

# 绘图
fig, axes = plt.subplots(1, 3, figsize=(15, 4))

# 肘部法则
axes[0].plot(K_range, inertias, 'bo-')
axes[0].set_xlabel('K值')
axes[0].set_ylabel('簇内平方和 (Inertia)')
axes[0].set_title('肘部法则')
axes[0].axvline(x=4, color='r', linestyle='--', label='最优K=4')
axes[0].legend()

# 轮廓系数
axes[1].plot(K_range, silhouettes, 'go-')
axes[1].set_xlabel('K值')
axes[1].set_ylabel('轮廓系数')
axes[1].set_title('轮廓系数分析')
axes[1].axvline(x=4, color='r', linestyle='--', label='最优K=4')
axes[1].legend()

# 最终聚类结果
kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
labels = kmeans.fit_predict(X)
centers = kmeans.cluster_centers_

axes[2].scatter(X[:, 0], X[:, 1], c=labels, s=30, alpha=0.7)
axes[2].scatter(centers[:, 0], centers[:, 1], c='red', marker='X', s=200, edgecolors='black')
axes[2].set_title('K-Means聚类结果 (K=4)')
axes[2].set_xlabel('特征1')
axes[2].set_ylabel('特征2')

plt.tight_layout()
plt.savefig('kmeans_demo.png', dpi=150)
plt.show()

print(f"最优K=4, 轮廓系数: {silhouettes[2]:.4f}")

# ============ 2. PCA降维 ============
print("\n【2】PCA主成分分析 - 鸢尾花数据集")
print("-" * 40)

iris = load_iris()
X = iris.data
y = iris.target

# 标准化
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# PCA
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

print(f"主成分解释方差比例: {pca.explained_variance_ratio_}")
print(f"累计解释方差: {sum(pca.explained_variance_ratio_):.4f}")

# 可视化
plt.figure(figsize=(10, 5))
colors = ['red', 'green', 'blue']
for i, (label, color) in enumerate(zip(['setosa', 'versicolor', 'virginica'], colors)):
    mask = y == i
    plt.scatter(X_pca[mask, 0], X_pca[mask, 1], c=color, label=label, alpha=0.7)

plt.xlabel(f'PC1 ({pca.explained_variance_ratio_[0]:.2%})')
plt.ylabel(f'PC2 ({pca.explained_variance_ratio_[1]:.2%})')
plt.title('PCA降维 - 鸢尾花数据集')
plt.legend()
plt.grid(True, alpha=0.3)
plt.savefig('pca_demo.png', dpi=150)
plt.show()

# 成分重要性
plt.figure(figsize=(10, 4))
plt.bar(iris.feature_names, pca.components_[0], alpha=0.7, label='PC1')
plt.bar(iris.feature_names, pca.components_[1], alpha=0.7, label='PC2')
plt.xlabel('原始特征')
plt.ylabel('主成分载荷')
plt.title('PCA成分载荷')
plt.legend()
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('pca_loadings.png', dpi=150)
plt.show()

# ============ 3. 异常检测 ============
print("\n【3】异常检测 - Isolation Forest")
print("-" * 40)

np.random.seed(42)
# 正常数据: 中心在(0,0)的正态分布
X_normal = np.random.randn(200, 2)
# 异常数据: 远离正常区域
X_anomaly = np.array([[4, 4], [5, -3], [-4, 5]])
X = np.vstack([X_normal, X_anomaly])
y_true = np.array([0] * 200 + [1] * 3)  # 0:正常, 1:异常

# Isolation Forest
iso_forest = IsolationForest(contamination=0.01, random_state=42)
predictions = iso_forest.fit_predict(X)

# 可视化
plt.figure(figsize=(10, 5))
plt.subplot(1, 2, 1)
plt.scatter(X[:, 0], X[:, 1], c=y_true, cmap='coolwarm', alpha=0.7)
plt.title('真实标签 (红:异常)')
plt.colorbar()

plt.subplot(1, 2, 2)
plt.scatter(X[:, 0], X[:, 1], c=(predictions == -1), cmap='coolwarm', alpha=0.7)
plt.title('Isolation Forest检测结果')
plt.colorbar()

plt.tight_layout()
plt.savefig('anomaly_detection.png', dpi=150)
plt.show()

anomaly_count = sum(predictions == -1)
print(f"检测到 {anomaly_count} 个异常点")
print(f"真实异常: {sum(y_true)} 个")
```

---

### 练习题

1. K-Means的K值如何选择？有哪些方法？
2. PCA和线性判别分析(LDA)有什么区别？
3. Isolation Forest为什么能有效检测异常？

---

### 延伸阅读

- Scikit-learn聚类文档: https://scikit-learn.org/stable/modules/clustering.html
- 论文: "Isolation Forest" (Liu et al., 2008)

---

## L8: ML实战项目

### 学习目标
1. 掌握特征工程的常用方法
2. 理解交叉验证的原理与实现
3. 完成Kaggle Titanic实战

### 核心知识点

#### 1. 特征工程

- 缺失值处理: 删除、填充、插值
- 编码: 独热编码、标签编码
- 标准化: MinMaxScaler, StandardScaler
- 特征选择: 过滤法、包装法、嵌入法

#### 2. 交叉验证

- K折交叉验证: 数据分成K份，轮流作为验证集
- 留一法: K=N，适合小数据集
- 分层采样: 保证每折中类别比例一致

#### 3. 模型评估指标

| 任务 | 指标 |
|------|------|
| 分类 | 准确率、精确率、召回率、F1、AUC |
| 回归 | MSE、RMSE、MAE、R² |

---

### 代码示例

```python
"""
安装依赖: pip install numpy pandas scikit-learn matplotlib seaborn
Kaggle数据集: titanic/train.csv (放在当前目录)
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

print("=" * 60)
print("L8 代码演示: Kaggle Titanic实战")
print("=" * 60)

# ============ 1. 数据加载与探索 ============
print("\n【1】数据加载与探索")
print("-" * 40)

# 加载数据 (需要先下载Kaggle Titanic数据集)
try:
    train_df = pd.read_csv('titanic/train.csv')
    test_df = pd.read_csv('titanic/test.csv')
    print("数据加载成功!")
except FileNotFoundError:
    print("请先下载Kaggle Titanic数据集并解压到titanic目录")
    print("下载地址: https://www.kaggle.com/competitions/titanic/data")
    raise

print(f"\n训练集形状: {train_df.shape}")
print(f"测试集形状: {test_df.shape}")
print("\n数据前5行:")
print(train_df.head())

print("\n缺失值统计:")
print(train_df.isnull().sum())

# 可视化
fig, axes = plt.subplots(1, 3, figsize=(15, 4))
sns.countplot(data=train_df, x='Survived', ax=axes[0])
axes[0].set_title('生存情况分布')

sns.barplot(data=train_df, x='Pclass', y='Survived', ax=axes[1])
axes[1].set_title('舱位等级与生存率')

sns.barplot(data=train_df, x='Sex', y='Survived', ax=axes[2])
axes[2].set_title('性别与生存率')

plt.tight_layout()
plt.savefig('titanic_eda.png', dpi=150)
plt.show()

# ============ 2. 特征工程 ============
print("\n【2】特征工程")
print("-" * 40)

def engineer_features(df):
    """特征工程函数"""
    data = df.copy()

    # 1. 处理缺失值
    # Age: 用中位数填充
    data['Age'].fillna(data['Age'].median(), inplace=True)

    # Cabin: 用'U'表示未知
    data['Cabin'].fillna('U', inplace=True)

    # Embarked: 用众数填充
    data['Embarked'].fillna(data['Embarked'].mode()[0], inplace=True)

    # 2. 提取新特征
    # FamilySize = SibSp + Parch + 1
    data['FamilySize'] = data['SibSp'] + data['Parch'] + 1

    # IsAlone: 是否独自旅行
    data['IsAlone'] = (data['FamilySize'] == 1).astype(int)

    # Title: 从姓名中提取称谓
    data['Title'] = data['Name'].str.extract(r' ([A-Za-z]+)\.', expand=False)
    data['Title'] = data['Title'].replace(['Lady', 'Countess', 'Capt', 'Col',
                                           'Don', 'Dr', 'Major', 'Rev', 'Sir',
                                           'Jonkheer', 'Dona'], 'Rare')
    data['Title'] = data['Title'].replace('Mlle', 'Miss')
    data['Title'] = data['Title'].replace('Ms', 'Miss')
    data['Title'] = data['Title'].replace('Mme', 'Mrs')

    # 3. 分箱处理
    # AgeBins: 年龄分箱
    data['AgeBins'] = pd.cut(data['Age'], bins=[0, 12, 18, 35, 60, 100],
                              labels=['Child', 'Teen', 'Young', 'Middle', 'Old'])

    # FareBins: 票价分箱
    data['FareBins'] = pd.qcut(data['Fare'].fillna(data['Fare'].median()),
                                q=4, labels=['Low', 'Medium', 'High', 'VeryHigh'])

    # 4. 编码
    # Label Encoding for Title
    le = LabelEncoder()
    data['Title'] = le.fit_transform(data['Title'])

    # One-hot for categorical
    data = pd.get_dummies(data, columns=['Sex', 'Embarked', 'Pclass', 'AgeBins', 'FareBins'],
                          drop_first=False)

    # 5. 删除不需要的列
    drop_cols = ['Name', 'Ticket', 'Cabin', 'PassengerId']
    data.drop(drop_cols, axis=1, inplace=True)

    return data

# 应用特征工程
train_processed = engineer_features(train_df)
test_processed = engineer_features(test_df)

print(f"处理后特征数量: {train_processed.shape[1]}")
print(f"特征列: {list(train_processed.columns)}")

# 准备数据
X = train_processed.drop('Survived', axis=1)
y = train_processed['Survived']

# 划分训练验证集
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2,
                                                   random_state=42, stratify=y)

# 标准化
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_val_scaled = scaler.transform(X_val)

print(f"\n训练集大小: {X_train.shape}")
print(f"验证集大小: {X_val.shape}")

# ============ 3. 模型训练与交叉验证 ============
print("\n【3】模型训练与交叉验证")
print("-" * 40)

# 定义模型
models = {
    'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
    'Random Forest': RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42),
    'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, max_depth=3, random_state=42)
}

# 5折交叉验证
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

results = {}
for name, model in models.items():
    # 交叉验证
    cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=cv, scoring='accuracy')
    results[name] = {
        'cv_mean': cv_scores.mean(),
        'cv_std': cv_scores.std(),
        'val_score': None
    }

    # 验证集评估
    model.fit(X_train_scaled, y_train)
    val_pred = model.predict(X_val_scaled)
    val_score = accuracy_score(y_val, val_pred)
    results[name]['val_score'] = val_score

    print(f"\n{name}:")
    print(f"  交叉验证准确率: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
    print(f"  验证集准确率: {val_score:.4f}")

# 选择最佳模型
best_model_name = max(results, key=lambda x: results[x]['cv_mean'])
print(f"\n最佳模型 (基于CV): {best_model_name}")

# ============ 4. 模型评估与调参 ============
print("\n【4】模型评估与调参")
print("-" * 40)

# 使用最佳模型
best_model = models[best_model_name]
best_model.fit(X_train_scaled, y_train)
y_pred = best_model.predict(X_val_scaled)

# 分类报告
print("\n分类报告:")
print(classification_report(y_val, y_pred))

# 混淆矩阵
cm = confusion_matrix(y_val, y_pred)
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=['未生存', '生存'],
            yticklabels=['未生存', '生存'])
plt.xlabel('预测')
plt.ylabel('实际')
plt.title(f'{best_model_name} 混淆矩阵')
plt.savefig('titanic_confusion_matrix.png', dpi=150)
plt.show()

# 特征重要性 (如果是树模型)
if hasattr(best_model, 'feature_importances_'):
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': best_model.feature_importances_
    }).sort_values('importance', ascending=True)

    plt.figure(figsize=(10, 8))
    plt.barh(feature_importance['feature'], feature_importance['importance'])
    plt.xlabel('重要性')
    plt.title('特征重要性')
    plt.tight_layout()
    plt.savefig('titanic_feature_importance.png', dpi=150)
    plt.show()

# ============ 5. 预测测试集并生成提交文件 ============
print("\n【5】生成提交文件")
print("-" * 40)

# 准备测试数据
test_df_id = pd.read_csv('titanic/test.csv')['PassengerId']
test_processed_id = engineer_features(test_df.assign(PassengerId=test_df_id))

# 对齐训练和测试特征
missing_cols = set(X.columns) - set(test_processed_id.columns)
for col in missing_cols:
    test_processed_id[col] = 0

# 确保列顺序一致
X_test = test_processed_id[X.columns]
X_test_scaled = scaler.transform(X_test)

# 预测
predictions = best_model.predict(X_test_scaled)

# 创建提交文件
submission = pd.DataFrame({
    'PassengerId': test_df_id,
    'Survived': predictions.astype(int)
})
submission.to_csv('titanic_submission.csv', index=False)
print(f"\n提交文件已保存: titanic_submission.csv")
print(submission.head(10))
```

---

### 练习题

1. 在特征工程中，为什么要对Age和Fare进行分箱处理？
2. 使用GridSearchCV对RandomForest进行超参数调优
3. 尝试其他模型(如XGBoost)并比较效果

---

### 延伸阅读

- Kaggle Titanic入门: https://www.kaggle.com/competitions/titanic
- 特征工程教程: https://www.kaggle.com/learn/feature-engineering

---

## 附录: 常用命令速查

```bash
# 安装Python环境
pip install numpy pandas scikit-learn matplotlib seaborn xgboost lightgbm

# Jupyter Lab启动
jupyter lab

# 常用sklearn函数
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler, MinMaxScaler, LabelEncoder
from sklearn.metrics import accuracy_score, mean_squared_error, classification_report
```

---

*文档版本: v2.0 | 适用教材: AI人工智能基础教程 Week 3-4 (L5-L8)*