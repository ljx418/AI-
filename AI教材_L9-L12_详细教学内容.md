# AI教材 Week 5-6：深度学习基础与实战

**课程周期**：Week 5-6（L9-L12）  
**前置要求**：Python基础、NumPy基础、高中数学（矩阵、导数）

---

## L9：神经网络基础

### 学习目标

- 理解感知机的原理与局限
- 掌握反向传播算法的数学推导
- 熟悉常用激活函数及其特性
- 能够从零实现一个神经网络

### 核心知识点

#### 1. 感知机（Perceptron）

感知机是最早的神经网络模型，由Frank Rosenblatt于1957年提出。

```
输入层 → 权重相乘 → 偏置相加 → 激活函数 → 输出
```

**数学表达**：
```
y = activation(w · x + b)
```

其中 `w` 是权重向量，`x` 是输入向量，`b` 是偏置。

#### 2. 激活函数

| 函数 | 公式 | 导数 | 特点 |
|------|------|------|------|
| Sigmoid | 1/(1+e^(-x)) | σ(x)(1-σ(x)) | 输出(0,1)，易饱和 |
| Tanh | (e^x-e^(-x))/(e^x+e^(-x)) | 1-tanh²(x) | 输出(-1,1)，零中心 |
| ReLU | max(0,x) | 1(x>0), 0(x≤0) | 计算高效，缓解梯度消失 |
| Leaky ReLU | max(0.01x,x) | 1(x>0), 0.01(x≤0) | 避免神经元死亡 |

#### 3. 反向传播（Backpropagation）

**核心思想**：链式法则求导，从后向前计算梯度并更新参数。

**损失函数示例（均方误差）**：
```
L = (1/N) Σ(y_pred - y_true)²
```

**梯度下降更新规则**：
```
w = w - learning_rate * ∂L/∂w
```

### 代码示例：从零实现神经网络

```python
"""
L9 神经网络基础 - 从零实现感知机和多层神经网络
安装依赖：pip install torch torchvision numpy matplotlib
"""

import numpy as np
import matplotlib.pyplot as plt

# ============================================================
# 第一部分：感知机实现
# ============================================================

class Perceptron:
    """单层感知机"""
    def __init__(self, input_dim, learning_rate=0.1):
        self.weights = np.random.randn(input_dim) * 0.01
        self.bias = 0
        self.lr = learning_rate

    def step_function(self, x):
        """阶跃激活函数"""
        return np.where(x >= 0, 1, 0)

    def forward(self, x):
        """前向传播"""
        z = np.dot(x, self.weights) + self.bias
        return self.step_function(z)

    def fit(self, X, y, epochs=100):
        """训练感知机"""
        for epoch in range(epochs):
            for i in range(len(X)):
                y_pred = self.forward(X[i])
                error = y[i] - y_pred
                # 更新规则
                self.weights += self.lr * error * X[i]
                self.bias += self.lr * error
            if (epoch + 1) % 20 == 0:
                accuracy = np.mean(self.predict(X) == y)
                print(f"Epoch {epoch+1}, Accuracy: {accuracy:.2%}")

    def predict(self, X):
        return np.array([self.forward(x) for x in X])


# ============================================================
# 第二部分：使用 PyTorch 实现神经网络
# ============================================================

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset

# 检查设备
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")

class NeuralNetwork(nn.Module):
    """多层神经网络"""
    def __init__(self, input_dim, hidden_dims, output_dim, dropout=0.2):
        super(NeuralNetwork, self).__init__()
        layers = []
        prev_dim = input_dim

        for hidden_dim in hidden_dims:
            layers.append(nn.Linear(prev_dim, hidden_dim))
            layers.append(nn.ReLU())
            layers.append(nn.Dropout(dropout))
            prev_dim = hidden_dim

        layers.append(nn.Linear(prev_dim, output_dim))
        layers.append(nn.Sigmoid())

        self.network = nn.Sequential(*layers)

    def forward(self, x):
        return self.network(x)


def train_model(model, train_loader, criterion, optimizer, epochs=100):
    """训练循环"""
    model.train()
    losses = []

    for epoch in range(epochs):
        epoch_loss = 0
        for X_batch, y_batch in train_loader:
            X_batch, y_batch = X_batch.to(device), y_batch.to(device)

            # 前向传播
            y_pred = model(X_batch)
            loss = criterion(y_pred, y_batch)

            # 反向传播
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            epoch_loss += loss.item()

        avg_loss = epoch_loss / len(train_loader)
        losses.append(avg_loss)

        if (epoch + 1) % 20 == 0:
            print(f"Epoch {epoch+1}/{epochs}, Loss: {avg_loss:.4f}")

    return losses


# ============================================================
# 第三部分：完整示例 - 鸢尾花分类
# ============================================================

from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

def main():
    # 加载数据
    iris = load_iris()
    X = iris.data
    y = (iris.target == 2).astype(float)  # 二分类：Virginica vs 其他

    # 数据预处理
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    # 转换为 PyTorch 张量
    X_train_t = torch.FloatTensor(X_train).to(device)
    y_train_t = torch.FloatTensor(y_train).reshape(-1, 1).to(device)
    X_test_t = torch.FloatTensor(X_test).to(device)
    y_test_t = torch.FloatTensor(y_test).reshape(-1, 1).to(device)

    # 创建 DataLoader
    train_dataset = TensorDataset(X_train_t, y_train_t)
    train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True)

    # 初始化模型
    model = NeuralNetwork(
        input_dim=4,
        hidden_dims=[16, 8],
        output_dim=1,
        dropout=0.2
    ).to(device)

    print(f"\n模型结构:\n{model}")
    print(f"\n参数总数: {sum(p.numel() for p in model.parameters()):,}")

    # 损失函数和优化器
    criterion = nn.BCELoss()
    optimizer = optim.Adam(model.parameters(), lr=0.01)

    # 训练
    print("\n开始训练...")
    losses = train_model(model, train_loader, criterion, optimizer, epochs=200)

    # 评估
    model.eval()
    with torch.no_grad():
        y_pred = model(X_test_t)
        y_pred_class = (y_pred >= 0.5).float()
        accuracy = (y_pred_class == y_test_t).float().mean()
        print(f"\n测试集准确率: {accuracy:.2%}")

    # 绘制损失曲线
    plt.figure(figsize=(10, 4))
    plt.plot(losses)
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.title('Training Loss Curve')
    plt.grid(True)
    plt.savefig('/Users/Zhuanz/Desktop/workspace/1-AI教案/l9_loss_curve.png', dpi=150)
    plt.show()

    print("\n✅ L9 神经网络基础完成！")


if __name__ == '__main__':
    main()
```

### 练习题

1. **理论题**：解释为什么 ReLU 函数比 Sigmoid 函数更常用于隐藏层？
2. **推导题**：写出3 层神经网络（输入-隐藏-输出）的反向传播梯度公式。
3. **实践题**：修改上述代码，将隐藏层扩展为 3 层，比较收敛速度差异。
4. **思考题**：感知机无法解决 XOR 问题，如何修改网络结构来解决？

### 延伸阅读

- [Deep Learning - Chapter 6: Deep Feedforward Networks](http://www.deeplearningbook.org/)
- [Neural Networks and Deep Learning - Michael Nielsen](http://neuralnetworksanddeeplearning.com/)
- [PyTorch 官方教程 - Neural Networks](https://pytorch.org/tutorials/beginner/basics/quickstart_tutorial.html)

---

## L10：CNN卷积神经网络

### 学习目标

- 理解卷积操作的核心原理
- 掌握池化层、全连接层的作用
- 熟悉 LeNet、AlexNet、VGG 等经典架构
- 能够使用 PyTorch 构建图像分类模型

### 核心知识点

#### 1. 卷积操作

**卷积核（Filter/Kernel）**：一个小矩阵，在输入图像上滑动进行点积运算。

```
输入: 5x5矩阵
卷积核: 3x3
输出: 3x3 特征图
```

**关键参数**：
- **Stride（步长）**：卷积核每次移动的像素数
- **Padding（填充）**：在输入边缘添加像素，控制输出尺寸
- **通道（Channel）**：彩色图像有 R/G/B 三个通道

**输出尺寸公式**：
```
Output = (Input - Kernel + 2*Padding) / Stride + 1
```

#### 2. 池化层（Pooling）

| 类型 | 作用 | 特点 |
|------|------|------|
| Max Pooling | 取区域内最大值 | 保留显著特征 |
| Average Pooling | 取区域内平均值 | 平滑特征 |

#### 3. 经典架构

**LeNet-5 (1998)**：最早的商业应用CNN，用于手写数字识别
```
Input(32x32) → Conv(6,5x5) → Pool(2x2) → Conv(16,5x5) → Pool(2x2)
→ FC(120) → FC(84) → Output(10)
```

**AlexNet (2012)**：ImageNet 比赛冠军，引入 ReLU 和 Dropout
- 5 层卷积 + 3 层全连接
- 使用 GPU 并行训练

**VGG (2014)**：简洁高效，使用小卷积核（3x3）
- VGG-16: 16 层，138M 参数
- 深网络通过小卷积核堆叠实现大感受野

### 代码示例：CNN图像分类

```python
"""
L10 CNN卷积神经网络 - CIFAR-10 图像分类
安装依赖：pip install torch torchvision numpy matplotlib
"""

import torch
import torch.nn as nn
import torch.optim as optim
import torchvision
import torchvision.transforms as transforms
import matplotlib.pyplot as plt
import numpy as np

# 设置设备
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")

# ============================================================
# 第一部分：定义 CNN 模型
# ============================================================

class SimpleCNN(nn.Module):
    """简单卷积神经网络"""
    def __init__(self, num_classes=10):
        super(SimpleCNN, self).__init__()

        # 卷积层部分
        self.conv_layers = nn.Sequential(
            # Conv1: 3通道输入 -> 32通道
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),  # 32x32 -> 16x16

            # Conv2: 32 -> 64通道
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),  # 16x16 -> 8x8

            # Conv3: 64 -> 128通道
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),  # 8x8 -> 4x4
        )

        # 全连接层部分
        self.fc_layers = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128 * 4 * 4, 256),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(256, num_classes)
        )

    def forward(self, x):
        x = self.conv_layers(x)
        x = self.fc_layers(x)
        return x


class LeNet5(nn.Module):
    """LeNet-5 架构实现"""
    def __init__(self, num_classes=10):
        super(LeNet5, self).__init__()

        self.features = nn.Sequential(
            # C1: 3 -> 6通道, 5x5卷积
            nn.Conv2d(3, 6, kernel_size=5),
            nn.ReLU(),
            # S2: 2x2最大池化
            nn.MaxPool2d(2, 2),

            # C3: 6 -> 16通道, 5x5卷积
            nn.Conv2d(6, 16, kernel_size=5),
            nn.ReLU(),
            # S4: 2x2最大池化
            nn.MaxPool2d(2, 2)
        )

        self.classifier = nn.Sequential(
            # C5: 全连接层
            nn.Linear(16 * 5 * 5, 120),
            nn.ReLU(),
            # F6: 全连接层
            nn.Linear(120, 84),
            nn.ReLU(),
            # F7: 输出层
            nn.Linear(84, num_classes)
        )

    def forward(self, x):
        x = self.features(x)
        x = torch.flatten(x, 1)
        x = self.classifier(x)
        return x


# ============================================================
# 第二部分：数据加载
# ============================================================

def get_cifar10_loaders(batch_size=64):
    """加载 CIFAR-10 数据集"""
    # 数据增强
    transform_train = transforms.Compose([
        transforms.RandomCrop(32, padding=4),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor(),
        transforms.Normalize((0.4914, 0.4822, 0.4465),
                             (0.2470, 0.2435, 0.2616))
    ])

    transform_test = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize((0.4914, 0.4822, 0.4465),
                             (0.2470, 0.2435, 0.2616))
    ])

    # 加载数据集
    trainset = torchvision.datasets.CIFAR10(
        root='/Users/Zhuanz/Desktop/workspace/1-AI教案/data',
        train=True, download=True, transform=transform_train
    )

    testset = torchvision.datasets.CIFAR10(
        root='/Users/Zhuanz/Desktop/workspace/1-AI教案/data',
        train=False, download=True, transform=transform_test
    )

    train_loader = DataLoader(
        trainset, batch_size=batch_size, shuffle=True, num_workers=2
    )
    test_loader = DataLoader(
        testset, batch_size=batch_size, shuffle=False, num_workers=2
    )

    return train_loader, test_loader


# ============================================================
# 第三部分：训练和评估
# ============================================================

def train_epoch(model, loader, criterion, optimizer, device):
    """训练一个 epoch"""
    model.train()
    total_loss = 0
    correct = 0
    total = 0

    for inputs, labels in loader:
        inputs, labels = inputs.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        total_loss += loss.item()
        _, predicted = outputs.max(1)
        total += labels.size(0)
        correct += predicted.eq(labels).sum().item()

    return total_loss / len(loader), 100. * correct / total


def evaluate(model, loader, criterion, device):
    """评估模型"""
    model.eval()
    total_loss = 0
    correct = 0
    total = 0

    with torch.no_grad():
        for inputs, labels in loader:
            inputs, labels = inputs.to(device), labels.to(device)
            outputs = model(inputs)
            loss = criterion(outputs, labels)

            total_loss += loss.item()
            _, predicted = outputs.max(1)
            total += labels.size(0)
            correct += predicted.eq(labels).sum().item()

    return total_loss / len(loader), 100. * correct / total


def visualize_predictions(model, loader, classes, device, num_images=8):
    """可视化预测结果"""
    model.eval()
    fig, axes = plt.subplots(2, 4, figsize=(12, 6))

    with torch.no_grad():
        for i, (inputs, labels) in enumerate(loader):
            if i > 0:
                break
            inputs, labels = inputs.to(device), labels.to(device)
            outputs = model(inputs)
            _, predicted = outputs.max(1)

            for j in range(min(num_images, len(inputs))):
                ax = axes[j // 4, j % 4]
                img = inputs[j].cpu().numpy().transpose(1, 2, 0)
                # 反标准化
                mean = np.array([0.4914, 0.4822, 0.4465])
                std = np.array([0.2470, 0.2435, 0.2616])
                img = img * std + mean
                img = np.clip(img, 0, 1)

                ax.imshow(img)
                true_label = classes[labels[j]]
                pred_label = classes[predicted[j]]
                color = 'green' if true_label == pred_label else 'red'
                ax.set_title(f'T: {true_label}\nP: {pred_label}',
                           color=color, fontsize=10)
                ax.axis('off')

    plt.tight_layout()
    plt.savefig('/Users/Zhuanz/Desktop/workspace/1-AI教案/l10_predictions.png', dpi=150)
    plt.show()


# ============================================================
# 主程序
# ============================================================

from torch.utils.data import DataLoader

def main():
    # CIFAR-10 类别
    classes = ['airplane', 'automobile', 'bird', 'cat', 'deer',
               'dog', 'frog', 'horse', 'ship', 'truck']

    # 加载数据
    print("加载 CIFAR-10 数据集...")
    train_loader, test_loader = get_cifar10_loaders(batch_size=64)

    # 创建模型
    print("\n创建 SimpleCNN 模型...")
    model = SimpleCNN(num_classes=10).to(device)
    print(f"模型参数量: {sum(p.numel() for p in model.parameters()):,}")

    # 损失函数和优化器
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=10, gamma=0.5)

    # 训练
    print("\n开始训练 CNN 模型...")
    epochs = 30
    train_losses, test_losses = [], []
    train_accs, test_accs = [], []

    for epoch in range(epochs):
        train_loss, train_acc = train_epoch(
            model, train_loader, criterion, optimizer, device
        )
        test_loss, test_acc = evaluate(
            model, test_loader, criterion, device
        )
        scheduler.step()

        train_losses.append(train_loss)
        test_losses.append(test_loss)
        train_accs.append(train_acc)
        test_accs.append(test_acc)

        if (epoch + 1) % 5 == 0:
            print(f"Epoch {epoch+1}/{epochs}")
            print(f"  Train - Loss: {train_loss:.4f}, Acc: {train_acc:.2f}%")
            print(f"  Test - Loss: {test_loss:.4f}, Acc: {test_acc:.2f}%")

    # 可视化结果
    print("\n可视化预测结果...")
    visualize_predictions(model, test_loader, classes, device)

    # 绘制训练曲线
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))

    ax1.plot(train_losses, label='Train Loss')
    ax1.plot(test_losses, label='Test Loss')
    ax1.set_xlabel('Epoch')
    ax1.set_ylabel('Loss')
    ax1.set_title('Training and Test Loss')
    ax1.legend()
    ax1.grid(True)

    ax2.plot(train_accs, label='Train Acc')
    ax2.plot(test_accs, label='Test Acc')
    ax2.set_xlabel('Epoch')
    ax2.set_ylabel('Accuracy (%)')
    ax2.set_title('Training and Test Accuracy')
    ax2.legend()
    ax2.grid(True)

    plt.tight_layout()
    plt.savefig('/Users/Zhuanz/Desktop/workspace/1-AI教案/l10_training_curves.png', dpi=150)
    plt.show()

    print("\n✅ L10 CNN卷积神经网络完成！")
    print(f"最终测试准确率: {test_accs[-1]:.2f}%")


if __name__ == '__main__':
    main()
```

### 练习题

1. **计算题**：输入图像 224x224x3，使用 64 个 7x7 卷积核，stride=2，padding=3，输出尺寸是多少？
2. **理论题**：解释1x1 卷积核的作用，它在 Inception 和 ResNet 中如何被使用？
3. **实践题**：实现一个 VGG-16 的简化版本（去掉 BN 层），比较训练速度和精度差异。
4. **思考题**：为什么深层 CNN 需要 Batch Normalization？它如何解决梯度问题？

### 延伸阅读

- [Convolutional Neural Networks (LeNet)](http://yann.lecun.com/exdb/lenet/)
- [AlexNet: ImageNet Classification with Deep CNNs](https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks)
- [Very Deep Convolutional Networks for Large-Scale Image Recognition](https://arxiv.org/abs/1409.1556)
- [Stanford CS231n: Convolutional Neural Networks](http://cs231n.stanford.edu/)

---

## L11：RNN与序列处理

### 学习目标

- 理解 RNN 的工作原理与梯度流问题
- 掌握 LSTM 和 GRU 的门控机制
- 熟悉 Seq2Seq 架构及其应用场景
- 能够实现序列数据建模

### 核心知识点

#### 1. 循环神经网络（RNN）基础

**核心思想**：将信息循环传递，保持内部状态。

```
RNN 单元：
h_t = tanh(W_xh * x_t + W_hh * h_{t-1} + b)
y_t = W_hy * h_t
```

**问题**：梯度消失和梯度爆炸
- 梯度随时间指数衰减（vanilla RNN）
- 长期依赖难以捕捉

#### 2. LSTM（Long Short-Term Memory）

**核心创新**：引入门控机制，控制信息流动。

```
LSTM 单元：
- 遗忘门：决定丢弃哪些信息
f_t = σ(W_f · [h_{t-1}, x_t] + b_f)

- 输入门：决定保留哪些新信息
i_t = σ(W_i · [h_{t-1}, x_t] + b_i)
C~_t = tanh(W_C · [h_{t-1}, x_t] + b_C)

- 细胞状态更新
C_t = f_t * C_{t-1} + i_t * C~_t

- 输出门
o_t = σ(W_o · [h_{t-1}, x_t] + b_o)
h_t = o_t * tanh(C_t)
```

#### 3. GRU（Gated Recurrent Unit）

**简化版 LSTM**：合并遗忘门和输入门。

```
 GRU 单元：
- 更新门：决定保留多少过去信息
z_t = σ(W_z · [h_{t-1}, x_t])

- 重置门：决定忽略多少过去信息
r_t = σ(W_r · [h_{t-1}, x_t])

- 候选隐藏状态
h~_t = tanh(W · [r_t * h_{t-1}, x_t])

- 最终隐藏状态
h_t = (1 - z_t) * h_{t-1} + z_t * h~_t
```

#### 4. Seq2Seq 架构

**编码器-解码器结构**：
```
输入序列 → [Encoder RNN] → 上下文向量 → [Decoder RNN] → 输出序列
```

**应用场景**：
- 机器翻译
- 文本摘要
- 对话系统
- 图像描述

### 代码示例：序列预测与文本生成

```python
"""
L11 RNN与序列处理 - 文本生成和时间序列预测
安装依赖：pip install torch torchvision numpy matplotlib
"""

import torch
import torch.nn as nn
import numpy as np
import matplotlib.pyplot as plt
from torch.utils.data import DataLoader, TensorDataset
import os

# 设置随机种子
torch.manual_seed(42)
np.random.seed(42)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")


# ============================================================
# 第一部分：LSTM 实现
# ============================================================

class LSTMModel(nn.Module):
    """LSTM 文本分类模型"""
    def __init__(self, vocab_size, embedding_dim, hidden_dim, num_layers, dropout=0.3):
        super(LSTMModel, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embedding_dim, padding_idx=0)
        self.lstm = nn.LSTM(
            embedding_dim, hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout if num_layers > 1 else 0,
            bidirectional=True
        )
        self.dropout = nn.Dropout(dropout)
        self.fc = nn.Linear(hidden_dim * 2, 1)  # *2 因为双向

    def forward(self, x):
        # x: (batch_size, seq_len)
        embedded = self.embedding(x)  # (batch_size, seq_len, embedding_dim)
        lstm_out, (hidden, cell) = self.lstm(embedded)

        # 取最后一个时刻的输出（双向）
        hidden = torch.cat([hidden[-2], hidden[-1]], dim=1)
        hidden = self.dropout(hidden)
        output = self.fc(hidden)
        return torch.sigmoid(output)


class GRUModel(nn.Module):
    """GRU 文本分类模型"""
    def __init__(self, vocab_size, embedding_dim, hidden_dim, num_layers, dropout=0.3):
        super(GRUModel, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embedding_dim, padding_idx=0)
        self.gru = nn.GRU(
            embedding_dim, hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout if num_layers > 1 else 0,
            bidirectional=True
        )
        self.dropout = nn.Dropout(dropout)
        self.fc = nn.Linear(hidden_dim * 2, 1)

    def forward(self, x):
        embedded = self.embedding(x)
        gru_out, hidden = self.gru(embedded)
        hidden = torch.cat([hidden[-2], hidden[-1]], dim=1)
        hidden = self.dropout(hidden)
        output = self.fc(hidden)
        return torch.sigmoid(output)


# ============================================================
# 第二部分：文本生成模型
# ============================================================

class TextGenerator(nn.Module):
    """基于 LSTM 的文本生成模型"""
    def __init__(self, vocab_size, embedding_dim, hidden_dim, num_layers):
        super(TextGenerator, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embedding_dim)
        self.lstm = nn.LSTM(embedding_dim, hidden_dim, num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_dim, vocab_size)

    def forward(self, x, hidden=None):
        embedded = self.embedding(x)
        if hidden is None:
            lstm_out, hidden = self.lstm(embedded)
        else:
            lstm_out, hidden = self.lstm(embedded, hidden)
        output = self.fc(lstm_out)
        return output, hidden

    def generate(self, start_idx, idx_to_char, length=100, temperature=1.0):
        """生成文本"""
        self.eval()
        with torch.no_grad():
            # 从起始字符开始
            current_idx = torch.tensor([[start_idx]], dtype=torch.long).to(device)
            generated = [start_idx]

            hidden = None
            for _ in range(length):
                output, hidden = self.forward(current_idx, hidden)
                output = output.squeeze()

                # 温度采样
                if temperature != 1.0:
                    output = output / temperature
                    probs = torch.softmax(output, dim=-1)
                    current_idx = torch.multinomial(probs, 1)
                else:
                    current_idx = torch.argmax(output, dim=-1)

                generated.append(current_idx.item())
                current_idx = current_idx.unsqueeze(0)

            return ''.join([idx_to_char.get(i, '') for i in generated])


# ============================================================
# 第三部分：数据预处理
# ============================================================

def build_vocab(text):
    """构建词汇表"""
    char_to_idx = {char: idx + 3 for idx, char in enumerate(set(text))}
    char_to_idx['<PAD>'] = 0
    char_to_idx['<UNK>'] = 1
    char_to_idx['<START>'] = 2
    idx_to_char = {idx: char for char, idx in char_to_idx.items()}
    return char_to_idx, idx_to_char


def text_to_sequence(text, char_to_idx):
    """将文本转换为索引序列"""
    return [char_to_idx.get(c, 1) for c in text]  # 1 是 UNK


def create_sequences(text, char_to_idx, seq_length=50):
    """创建训练序列"""
    sequences = []
    for i in range(0, len(text) - seq_length, seq_length // 2):
        seq = text[i:i + seq_length]
        sequences.append(text_to_sequence(seq, char_to_idx))
    return sequences


# ============================================================
# 第四部分：Seq2Seq 翻译模型
# ============================================================

class Encoder(nn.Module):
    """序列编码器"""
    def __init__(self, vocab_size, embed_dim, hidden_dim, num_layers=1):
        super(Encoder, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim)
        self.lstm = nn.LSTM(embed_dim, hidden_dim, num_layers, batch_first=True)

    def forward(self, x):
        embedded = self.embedding(x)
        outputs, (hidden, cell) = self.lstm(embedded)
        return hidden, cell


class Decoder(nn.Module):
    """序列解码器"""
    def __init__(self, vocab_size, embed_dim, hidden_dim, num_layers=1):
        super(Decoder, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim)
        self.lstm = nn.LSTM(embed_dim, hidden_dim, num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_dim, vocab_size)

    def forward(self, x, hidden, cell):
        embedded = self.embedding(x.unsqueeze(1))
        lstm_out, (hidden, cell) = self.lstm(embedded, (hidden, cell))
        output = self.fc(lstm_out.squeeze(1))
        return output, hidden, cell


class Seq2Seq(nn.Module):
    """Seq2Seq 模型"""
    def __init__(self, vocab_size, embed_dim, hidden_dim, num_layers=1):
        super(Seq2Seq, self).__init__()
        self.encoder = Encoder(vocab_size, embed_dim, hidden_dim, num_layers)
        self.decoder = Decoder(vocab_size, embed_dim, hidden_dim, num_layers)
        self.vocab_size = vocab_size

    def forward(self, source, target, teacher_forcing_ratio=0.5):
        batch_size = source.size(0)
        target_len = target.size(1)
        vocab_size = self.vocab_size

        outputs = torch.zeros(batch_size, target_len, vocab_size).to(device)

        hidden, cell = self.encoder(source)
        decoder_input = target[:,0]  # <START> token

        for t in range(1, target_len):
            output, hidden, cell = self.decoder(decoder_input, hidden, cell)
            outputs[:, t] = output

            teacher_force = np.random.random() < teacher_forcing_ratio
            top1 = output.argmax(1)
            decoder_input = target[:, t] if teacher_force else top1

        return outputs


# ============================================================
# 主程序
# ============================================================

def main():
    # 简单示例：使用莎士比亚文本训练
    print("=" * 60)
    print("L11 RNN 与序列处理")
    print("=" * 60)

    # 加载示例文本（使用内置文本）
    sample_text = """
    To be, or not to be, that is the question:
    Whether 'tis nobler in the mind to suffer
    The slings and arrows of outrageous fortune,
    Or to take arms against a sea of troubles.
    """

    # 准备数据
    print("\n准备训练数据...")
    char_to_idx, idx_to_char = build_vocab(sample_text)
    sequences = create_sequences(sample_text, char_to_idx, seq_length=30)

    X = torch.tensor(sequences, dtype=torch.long)
    dataset = TensorDataset(X[:, :-1], X[:, 1:])
    loader = DataLoader(dataset, batch_size=8, shuffle=True)

    # 创建模型
    print("\n创建 LSTM文本生成模型...")
    vocab_size = len(char_to_idx)
    model = TextGenerator(
        vocab_size=vocab_size,
        embedding_dim=64,
        hidden_dim=128,
        num_layers=2
    ).to(device)

    print(f"词汇表大小: {vocab_size}")
    print(f"参数量: {sum(p.numel() for p in model.parameters()):,}")

    # 训练
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

    print("\n训练文本生成模型...")
    model.train()
    losses = []

    for epoch in range(200):
        total_loss = 0
        for X_batch, y_batch in loader:
            X_batch, y_batch = X_batch.to(device), y_batch.to(device)

            optimizer.zero_grad()
            output, _ = model(X_batch)
            loss = criterion(output.view(-1, vocab_size), y_batch.view(-1))
            loss.backward()
            optimizer.step()

            total_loss += loss.item()

        avg_loss = total_loss / len(loader)
        losses.append(avg_loss)

        if (epoch + 1) % 50 == 0:
            print(f"Epoch {epoch+1}, Loss: {avg_loss:.4f}")

    # 生成文本
    print("\n生成文本示例:")
    model.eval()
    start_idx = char_to_idx.get('T', 3)
    generated_text = model.generate(start_idx, idx_to_char, length=200, temperature=0.8)
    print(f"起始字符 'T':\n{generated_text}")

    # 绘制损失曲线
    plt.figure(figsize=(10, 4))
    plt.plot(losses)
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.title('LSTM Text Generation Training Loss')
    plt.grid(True)
    plt.savefig('/Users/Zhuanz/Desktop/workspace/1-AI教案/l11_loss_curve.png', dpi=150)
    plt.show()

    print("\n" + "=" * 60)
    print("✅ L11 RNN与序列处理完成！")
    print("=" * 60)

    print("\n各模型对比:")
    print("- RNN: 基础循环结构，适合短序列")
    print("- LSTM: 门控机制，适合长序列")
    print("- GRU: LSTM 的简化版本，计算效率高")
    print("- Seq2Seq: 编码器-解码器，适合序列到序列任务")


if __name__ == '__main__':
    main()
```

### 练习题

1. **理论题**：画出 LSTM 的单元结构图，标注各个门的作用。
2. **推导题**：解释为什么 LSTM 能缓解梯度消失问题，而普通 RNN 不能。
3. **实践题**：使用 PyTorch 内置的 LSTM 层，实现一个情感分类模型（在 IMDB 数据集上）。
4. **思考题**：Seq2Seq 模型中，编码器最后一个隐藏状态作为解码器初始状态有何优缺点？

### 延伸阅读

- [Long Short-Term Memory](https://www.bioinf.jku.at/publications/older/2604.pdf) - Hochreiter & Schmidhuber 原始论文
- [Learning Phrase Representations using RNN Encoder-Decoder](https://arxiv.org/abs/1406.1078) - Seq2Seq 基础
- [Understanding LSTM Networks](https://colah.github.io/posts/2015-08-Understanding-LSTMs/) - 博客教程
- [Sequence Models - DeepLearning.AI](https://www.coursera.org/learn/nlp-sequence-models)

---

## L12：深度学习实战

### 学习目标

- 掌握图像分类的完整流程
- 理解迁移学习的核心思想
- 能够使用预训练模型进行微调
- 完成一个完整的端到端项目

### 核心知识点

#### 1. 图像分类完整流程

```
数据收集 → 数据清洗 → 数据增强 → 划分数据集
    ↓
模型选择 → 训练验证 → 超参数调优 → 模型测试
    ↓
部署导出 → 模型压缩 → 服务化
```

#### 2. 数据增强（Data Augmentation）

| 方法 | 作用 |
|------|------|
| 随机翻转 | 增加水平对称样本 |
| 随机裁剪 | 增加空间不变性 |
| 颜色抖动 | 增加光照变化鲁棒性 |
| 随机旋转 | 增加角度多样性 |
| Cutout/Random Erasing | 增强遮挡抗性 |

#### 3. 迁移学习（Transfer Learning）

**核心思想**：在大规模数据集（如 ImageNet）上预训练的模型，其特征提取能力可以迁移到新任务。

**两种策略**：
1. **特征提取**：冻结预训练层，只训练新添加的分类头
2. **微调（Fine-tuning）**：解冻部分层，联合训练

**常用预训练模型**：
- **ResNet**：残差网络，152 层
- **VGG**：16/19 层
- **EfficientNet**：高效轻量
- **Vision Transformer (ViT)**：Transformer 架构

#### 4. 经典技巧

| 技巧 | 描述 |
|------|------|
| 学习率预热 | 初期逐渐增大学习率 |
| 余弦退火 | 学习率按余弦曲线衰减 |
| 早停 | 监控验证集，防止过拟合 |
| 模型集成 | 多模型预测结果平均 |

### 代码示例：迁移学习实战

```python
"""
L12 深度学习实战 - 图像分类与迁移学习
安装依赖：pip install torch torchvision numpy matplotlib pillow
"""

import torch
import torch.nn as nn
import torch.optim as optim
from torch.optim.lr_scheduler import CosineAnnealingWarmRestarts
import torchvision
from torchvision import transforms
from torchvision.datasets import ImageFolder
from torchvision.models import resnet18, ResNet18_Weights
import matplotlib.pyplot as plt
from PIL import Image
import numpy as np
import os
from tqdm import tqdm

# 设置随机种子
torch.manual_seed(42)
torch.cuda.manual_seed_all(42)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")


# ============================================================
# 第一部分：数据准备与增强
# ============================================================

def get_data_transforms():
    """获取数据增强和预处理"""
    # 训练时的数据增强
    train_transform = transforms.Compose([
        transforms.RandomResizedCrop(224),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomVerticalFlip(p=0.2),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
        transforms.RandomRotation(30),
        transforms.RandomAffine(degrees=0, translate=(0.1, 0.1)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        ),
        transforms.RandomErasing(p=0.3, scale=(0.02, 0.2))
    ])

    # 验证/测试时的预处理
    val_transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
    ])

    return train_transform, val_transform


# ============================================================
# 第二部分：迁移学习模型
# ============================================================

class TransferLearningModel(nn.Module):
    """迁移学习模型包装器"""
    def __init__(self, num_classes, freeze_backbone=True):
        super(TransferLearningModel, self).__init__()

        # 加载预训练的 ResNet18
        self.backbone = resnet18(weights=ResNet18_Weights.DEFAULT)

        # 冻结或解冻骨干网络
        if freeze_backbone:
            for param in self.backbone.parameters():
                param.requires_grad = False

        # 获取特征维度并替换分类头
        in_features = self.backbone.fc.in_features
        self.backbone.fc = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(in_features, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, num_classes)
        )

    def forward(self, x):
        return self.backbone(x)


class FineTuningModel(nn.Module):
    """微调模型 - 解冻高层"""
    def __init__(self, num_classes):
        super(FineTuningModel, self).__init__()

        self.backbone = resnet18(weights=ResNet18_Weights.DEFAULT)

        # 只解冻最后两层
        for param in self.backbone.layer4.parameters():
            param.requires_grad = True
        for param in self.backbone.layer3.parameters():
            param.requires_grad = True

        in_features = self.backbone.fc.in_features
        self.backbone.fc = nn.Sequential(
            nn.Dropout(0.4),
            nn.Linear(in_features, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, num_classes)
        )

    def forward(self, x):
        return self.backbone(x)


# ============================================================
# 第三部分：训练与验证
# ============================================================

def train_one_epoch(model, loader, criterion, optimizer, device):
    """训练一个 epoch"""
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0

    pbar = tqdm(loader, desc='Training')
    for images, labels in pbar:
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item()
        _, predicted = outputs.max(1)
        total += labels.size(0)
        correct += predicted.eq(labels).sum().item()

        pbar.set_postfix({
            'loss': f'{running_loss / (pbar.n + 1):.4f}',
            'acc': f'{100. * correct / total:.2f}%'
        })

    return running_loss / len(loader), 100. * correct / total


def validate(model, loader, criterion, device):
    """验证模型"""
    model.eval()
    running_loss = 0.0
    correct = 0
    total = 0

    with torch.no_grad():
        for images, labels in loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)

            running_loss += loss.item()
            _, predicted = outputs.max(1)
            total += labels.size(0)
            correct += predicted.eq(labels).sum().item()

    return running_loss / len(loader), 100. * correct / total


def predict_image(model, image_path, transform, classes, device):
    """预测单张图片"""
    model.eval()

    # 加载并预处理图片
    image = Image.open(image_path).convert('RGB')
    input_tensor = transform(image).unsqueeze(0).to(device)

    # 预测
    with torch.no_grad():
        output = model(input_tensor)
        probs = torch.softmax(output, dim=1)[0]
        pred_idx = output.argmax(1).item()

    return classes[pred_idx], probs[pred_idx].item(), probs.cpu().numpy()[0]


# ============================================================
# 第四部分：完整训练流程
# ============================================================

def main():
    print("=" * 60)
    print("L12 深度学习实战 - 图像分类与迁移学习")
    print("=" * 60)

    # 类别定义（示例：猫狗分类）
    classes = ['cat', 'dog']

    # 数据路径（请替换为实际数据路径）
    data_dir = '/Users/Zhuanz/Desktop/workspace/1-AI教案/data/pet_images'

    # 如果数据目录不存在，创建示例结构
    if not os.path.exists(data_dir):
        print("\n创建示例数据结构...")
        os.makedirs(f'{data_dir}/train/cat', exist_ok=True)
        os.makedirs(f'{data_dir}/train/dog', exist_ok=True)
        os.makedirs(f'{data_dir}/val/cat', exist_ok=True)
        os.makedirs(f'{data_dir}/val/dog', exist_ok=True)
        os.makedirs(f'{data_dir}/test', exist_ok=True)

        # 使用 CIFAR-10 数据作为演示
        print("下载 CIFAR-10 数据集作为演示...")

    train_transform, val_transform = get_data_transforms()

    #加载示例数据集（CIFAR-10演示）
    print("\n加载 CIFAR-10 数据集（演示用）...")
    cifar_trainset = torchvision.datasets.CIFAR10(
        root='/Users/Zhuanz/Desktop/workspace/1-AI教案/data',
        train=True, download=True,
        transform=train_transform
    )
    cifar_testset = torchvision.datasets.CIFAR10(
        root='/Users/Zhuanz/Desktop/workspace/1-AI教案/data',
        train=False, download=True,
        transform=val_transform
    )

    # 使用子集（只取猫和狗）
    cat_indices = [i for i, label in enumerate(cifar_trainset.targets) if label == 3]  # cat
    dog_indices = [i for i, label in enumerate(cifar_trainset.targets) if label == 5]  # dog
    selected_indices = cat_indices[:500] + dog_indices[:500]

    train_loader = torch.utils.data.DataLoader(
        torch.utils.data.Subset(cifar_trainset, selected_indices),
        batch_size=32, shuffle=True, num_workers=2
    )

    test_indices = [i for i, label in enumerate(cifar_testset.targets) if label in [3, 5]]
    test_loader = torch.utils.data.DataLoader(
        torch.utils.data.Subset(cifar_testset, test_indices[:200]),
        batch_size=32, shuffle=False, num_workers=2
    )

    print(f"训练集大小: {len(train_loader.dataset)}")
    print(f"测试集大小: {len(test_loader.dataset)}")

    # ============================================================
    # 策略1：特征提取（冻结骨干网络）
    # ============================================================
    print("\n" + "=" * 60)
    print("策略1：特征提取（迁移学习）")
    print("=" * 60)

    model_ft = TransferLearningModel(num_classes=2, freeze_backbone=True).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer_ft = optim.Adam(model_ft.backbone.fc.parameters(), lr=0.001)

    print(f"可训练参数: {sum(p.numel() for p in model_ft.parameters() if p.requires_grad):,}")

    epochs = 15
    best_acc_ft = 0

    for epoch in range(epochs):
        print(f"\nEpoch {epoch+1}/{epochs}")
        train_loss, train_acc = train_one_epoch(
            model_ft, train_loader, criterion, optimizer_ft, device
        )
        val_loss, val_acc = validate(model_ft, test_loader, criterion, device)

        print(f"Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.2f}%")
        print(f"Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.2f}%")

        if val_acc > best_acc_ft:
            best_acc_ft = val_acc
            torch.save(model_ft.state_dict(),
                      '/Users/Zhuanz/Desktop/workspace/1-AI教案/l12_feature_extract_best.pth')

    # ============================================================
    # 策略2：微调（解冻高层）
    # ============================================================
    print("\n" + "=" * 60)
    print("策略2：微调（Fine-tuning）")
    print("=" * 60)

    model_finetune = FineTuningModel(num_classes=2).to(device)
    criterion = nn.CrossEntropyLoss()

    # 使用差分学习率
    optimizer_ft2 = optim.Adam([
        {'params': model_finetune.backbone.layer3.parameters(), 'lr': 1e-4},
        {'params': model_finetune.backbone.layer4.parameters(), 'lr': 1e-4},
        {'params': model_finetune.backbone.fc.parameters(), 'lr': 1e-3}
    ])

    scheduler = CosineAnnealingWarmRestarts(optimizer_ft2, T_0=5, T_mult=2)

    best_acc_ft2 = 0
    history = {'train_loss': [], 'val_loss': [], 'train_acc': [], 'val_acc': []}

    for epoch in range(epochs):
        print(f"\nEpoch {epoch+1}/{epochs}")
        train_loss, train_acc = train_one_epoch(
            model_finetune, train_loader, criterion, optimizer_ft2, device
        )
        val_loss, val_acc = validate(model_finetune, test_loader, criterion, device)
        scheduler.step()

        history['train_loss'].append(train_loss)
        history['val_loss'].append(val_loss)
        history['train_acc'].append(train_acc)
        history['val_acc'].append(val_acc)

        print(f"Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.2f}%")
        print(f"Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.2f}%")

        if val_acc > best_acc_ft2:
            best_acc_ft2 = val_acc
            torch.save(model_finetune.state_dict(),
                      '/Users/Zhuanz/Desktop/workspace/1-AI教案/l12_finetune_best.pth')

    # ============================================================
    # 可视化结果
    # ============================================================
    print("\n绘制训练曲线...")

    fig, axes = plt.subplots(1, 2, figsize=(14, 5))

    axes[0].plot(history['train_loss'], label='Train Loss')
    axes[0].plot(history['val_loss'], label='Val Loss')
    axes[0].set_xlabel('Epoch')
    axes[0].set_ylabel('Loss')
    axes[0].set_title('Training and Validation Loss')
    axes[0].legend()
    axes[0].grid(True)

    axes[1].plot(history['train_acc'], label='Train Acc')
    axes[1].plot(history['val_acc'], label='Val Acc')
    axes[1].set_xlabel('Epoch')
    axes[1].set_ylabel('Accuracy (%)')
    axes[1].set_title('Training and Validation Accuracy')
    axes[1].legend()
    axes[1].grid(True)

    plt.tight_layout()
    plt.savefig('/Users/Zhuanz/Desktop/workspace/1-AI教案/l12_training_curves.png', dpi=150)
    plt.show()

    # ============================================================
    # 预测示例
    # ============================================================
    print("\n" + "=" * 60)
    print("预测示例")
    print("=" * 60)

    model_finetune.load_state_dict(
        torch.load('/Users/Zhuanz/Desktop/workspace/1-AI教案/l12_finetune_best.pth')
    )
    model_finetune.eval()

    # 获取测试集图片进行预测
    fig, axes = plt.subplots(2, 5, figsize=(15, 6))
    axes = axes.flatten()

    with torch.no_grad():
        for i in range(10):
            img, label = test_loader.dataset[i]
            img_display = img.cpu().numpy().transpose(1, 2, 0)
            mean = np.array([0.485, 0.456, 0.406])
            std = np.array([0.229, 0.224, 0.225])
            img_display = img_display * std + mean
            img_display = np.clip(img_display, 0, 1)

            input_tensor = img.unsqueeze(0).to(device)
            output = model_finetune(input_tensor)
            probs = torch.softmax(output, dim=1)[0]
            pred_label = classes[output.argmax(1).item()]
            true_label = classes[label] if label < 2 else classes[0]

            axes[i].imshow(img_display)
            color = 'green' if pred_label == true_label else 'red'
            axes[i].set_title(f'T: {true_label}\nP: {pred_label}\nConf: {probs.max().item():.2f}',
                             color=color)
            axes[i].axis('off')

    plt.tight_layout()
    plt.savefig('/Users/Zhuanz/Desktop/workspace/1-AI教案/l12_predictions.png', dpi=150)
    plt.show()

    # ============================================================
    # 总结
    # ============================================================
    print("\n" + "=" * 60)
    print("训练完成总结")
    print("=" * 60)
    print(f"策略1（特征提取）最佳准确率: {best_acc_ft:.2f}%")
    print(f"策略2（微调）最佳准确率: {best_acc_ft2:.2f}%")
    print("\n迁移学习技巧:")
    print("1. 小数据集：优先使用特征提取")
    print("2. 大数据集：使用微调，解冻高层")
    print("3. 差分学习率：底层用小学习率")
    print("4. 数据增强：有效扩充训练数据")

    print("\n✅ L12 深度学习实战完成！")


if __name__ == '__main__':
    main()
```

### 练习题

1. **实践题**：使用 VGG-16 替代 ResNet-18，重新完成上述迁移学习流程。
2. **思考题**：什么时候应该使用更大的模型？什么时候应该使用更小的模型？
3. **实践题**：实现 Test Time Augmentation (TTA)，对比单张预测和 TTA 预测的准确率差异。
4. **理论题**：解释为什么 ImageNet 预训练模型能泛化到医疗图像、卫星图像等不同领域？

### 延伸阅读

- [Transfer Learning for Image Classification](https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html)
- [How to Fine-Tune BERT for Text Classification](https://arxiv.org/abs/1905.05583)
- [CS231n: Transfer Learning](http://cs231n.github.io/transfer-learning/)
- [Timm: PyTorch Image Models](https://github.com/huggingface/pytorch-image-models)

---

##附录：PyTorch 常用代码模板

### 基础训练模板

```python
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader

# 1. 定义模型
model = YourModel().to(device)

# 2. 损失函数
criterion = nn.CrossEntropyLoss()

# 3. 优化器
optimizer = optim.Adam(model.parameters(), lr=0.001)

# 4. 学习率调度
scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=10, gamma=0.5)

# 5. 训练循环
for epoch in range(num_epochs):
    model.train()
    for batch_idx, (data, target) in enumerate(train_loader):
        data, target = data.to(device), target.to(device)

        optimizer.zero_grad()
        output = model(data)
        loss = criterion(output, target)
        loss.backward()
        optimizer.step()

    scheduler.step()
```

### GPU/CPU 自动检测

```python
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = model.to(device)
```

### 模型保存与加载

```python
# 保存
torch.save(model.state_dict(), 'model.pth')

# 加载
model = YourModel()
model.load_state_dict(torch.load('model.pth'))
model.eval()
```

---

**课程结束**
完成 Week 5-6 学习后，你已掌握：
- 神经网络基础（感知机、反向传播）
- CNN图像处理能力
- RNN 序列建模能力
- 迁移学习实战技能

下一步：推荐学习 Transformer架构和注意力机制，开启大语言模型时代的大门。