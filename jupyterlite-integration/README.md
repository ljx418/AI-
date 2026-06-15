# JupyterLite 集成方案

## 1. JupyterLite 简介

JupyterLite 是一个基于 WebAssembly 的轻量级 Jupyter Notebook 环境，可以直接在浏览器中运行，无需服务器支持。它使用 Pyodide（Python in WebAssembly）来实现 Python 代码的浏览器端执行。

### 核心特性
- **零后端依赖**: 完全在客户端运行，无需 Python 服务器
- **离线可用**: 一旦资源加载完成，可完全离线使用
- **即时启动**: 无需安装，嵌入 HTML 即可使用
- **持久化存储**: 支持将笔记本保存到浏览器 localStorage

## 2. 集成架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        HTML 课件页面                              │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                     JupyterLite iframe                      │ │
│  │  ┌───────────────────────────────────────────────────────┐  │ │
│  │  │              JupyterLab Web Application               │  │ │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌───────────────┐  │ │ │
│  │  │  │ File Browser │  │ Notebook    │  │  Kernel       │  │ │ │
│  │  │  │             │  │  Editor     │  │  (Pyodide)    │  │ │ │
│  │  │  └─────────────┘  └─────────────┘  └───────────────┘  │ │ │
│  │  │                        │                               │  │ │
│  │  │               ┌────────┴────────┐                     │  │ │
│  │  │               │  xeus-python    │                     │  │ │
│  │  │               │  (WASM Runtime) │                     │  │ │
│  │  │               └────────┬────────┘                     │  │ │
│  │  │                        │                               │  │ │
│  │  │               ┌────────┴────────┐                     │  │ │
│  │  │               │   Pyodide      │                     │  │ │
│  │  │               │  (Python WASM)  │                     │  │ │
│  │  │               └─────────────────┘                     │  │ │
│  │  └───────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│              ┌───────────────┼───────────────┐                    │
│              ▼               ▼               ▼                    │
│     ┌────────────┐   ┌──────────────┐  ┌────────────┐             │
│     │ jupyterlite│   │   numpy     │  │  pandas    │             │
│     │    core    │   │   (WASM)    │  │  (WASM)    │             │
│     └────────────┘   └──────────────┘  └────────────┘             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

嵌入方式对比:

┌─────────────────────────────────────────────────────────────┐
│                    iframe 嵌入方式                             │
│                                                             │
│   <iframe src="./jupyterlite/lab/index.html"                │
│           width="100%" height="600px">                      │
│   </iframe>                                                 │
│                                                             │
│   优点: 隔离性好, 加载快, 维护简单                             │
│   缺点: 通信需通过 postMessage                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    直接嵌入方式 (较少用)                       │
│                                                             │
│   <div id="jupyter-container"></div>                        │
│   <script type="module">                                     │
│     import { JupyterLite } from './jupyterlite.js';          │
│     // 自定义初始化                                          │
│   </script>                                                  │
│                                                             │
│   优点: 可高度定制                                           │
│   缺点: 配置复杂, 需要处理更多边界情况                         │
└─────────────────────────────────────────────────────────────┘
```

## 3. 嵌入代码示例

### 3.1 基础 iframe 嵌入

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>JupyterLite 集成示例</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 20px; }
        .jupyter-container { width: 100%; height: 600px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
        iframe { width: 100%; height: 100%; border: none; }
    </style>
</head>
<body>
    <h1>JupyterLite 内嵌演示</h1>

    <div class="jupyter-container">
        <iframe src="https://jupyterlite.github.io/demo/latest/lab/index.html"
                title="JupyterLite Notebook"
                sandbox="allow-scripts allow-same-origin allow-forms">
        </iframe>
    </div>

    <p style="margin-top: 16px; color: #64748b;">
        提示: 首次加载需要下载 Pyodide 运行时 (约 10MB)，请保持网络连接。
    </p>
</body>
</html>
```

### 3.2 带本地资源路径的配置

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>JupyterLite 本地部署示例</title>
    <style>
        body { font-family: -apple-system, sans-serif; margin: 0; padding: 20px; }
        .jupyter-container { width: 100%; height: 700px; border: 1px solid #e2e8f0; border-radius: 8px; }
        iframe { width: 100%; height: 100%; border: none; }
    </style>
</head>
<body>
    <h1>本地 JupyterLite</h1>

    <!--
        本地部署需要:
        1. 下载 JupyterLite release
        2. 解压到 ./jupyterlite/ 目录
        3. 确保目录结构: ./jupyterlite/lab/index.html
    -->
    <div class="jupyter-container">
        <iframe src="./jupyterlite/lab/index.html"
                title="JupyterLite Notebook"
                sandbox="allow-scripts allow-same-origin allow-forms allow-modals">
        </iframe>
    </div>

    <!-- iframe 与父页面通信示例 -->
    <script>
        // 监听来自 JupyterLite 的消息
        window.addEventListener('message', function(event) {
            // 验证消息来源
            if (event.origin !== 'https://jupyterlite.github.io') return;

            console.log('收到来自 JupyterLite 的消息:', event.data);
        });

        // 向 JupyterLite 发送消息
        function sendToJupyterLite(message) {
            document.querySelector('iframe').contentWindow.postMessage(message, '*');
        }
    </script>
</body>
</html>
```

### 3.3 在现有课程页面中嵌入 JupyterLite

```html
<!-- 在课程页面中嵌入可交互的 Python 实验环境 -->

<div class="exercise-section" style="margin: 30px 0;">
    <h3>动手实践: Python 数据分析</h3>

    <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
        <p><strong>任务:</strong> 使用 pandas 分析以下数据...</p>
    </div>

    <!-- JupyterLite 容器 -->
    <div id="jupyterlite-container"
         style="width: 100%; height: 500px; border: 2px solid #4f46e5; border-radius: 8px; overflow: hidden;">
        <iframe src="./jupyterlite/lab/index.html"
                style="width: 100%; height: 100%; border: none;"
                sandbox="allow-scripts allow-same-origin allow-forms">
        </iframe>
    </div>

    <div style="margin-top: 12px; display: flex; gap: 12px;">
        <button onclick="resetNotebook()" style="padding: 8px 16px; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer;">
            重置笔记本
        </button>
        <button onclick="loadTemplate()" style="padding: 8px 16px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer;">
            加载模板代码
        </button>
    </div>
</div>

<script>
    // 预设代码模板
    const templateCode = `import pandas as pd
import matplotlib.pyplot as plt

# 读取数据
df = pd.DataFrame({
    'x': [1, 2, 3, 4, 5],
    'y': [2, 4, 5, 4, 5]
})

# 数据分析
print(df.describe())
`;

    function loadTemplate() {
        // 通过 localStorage 或 postMessage 传递预设代码
        const iframe = document.querySelector('#jupyterlite-container iframe');
        iframe.contentWindow.postMessage({
            type: 'load_notebook',
            content: templateCode
        }, '*');
    }

    function resetNotebook() {
        if (confirm('确定要重置笔记本吗？所有未保存的内容将丢失。')) {
            location.reload();
        }
    }
</script>
```

## 4. 需要预装的 Python 包列表

JupyterLite 使用 Pyodide 运行时，支持预装的包如下:

### 核心数据科学包

| 包名 | 版本 | 用途 |
|------|------|------|
| numpy | 1.26.x | 数值计算基础库 |
| pandas | 2.x | 数据分析框架 |
| matplotlib | 3.8.x | 数据可视化 |
| scipy | 1.12.x | 科学计算 |

### 机器学习包

| 包名 | 版本 | 用途 |
|------|------|------|
| scikit-learn | 1.4.x | 机器学习算法 |
| joblib | 1.3.x | 模型序列化 |

### 其他常用包

| 包名 | 版本 | 用途 |
|------|------|------|
| pillow | 10.x | 图像处理 |
| requests | 2.31.x | HTTP 请求 |
| pyyaml | 6.x | YAML 解析 |
| json5 | 0.9.x | JSON 解析增强 |

### 安装方式 (settings.json 配置)

```json
{
  "litePluginSettings": {
    "@jupyterlite/pyodide-kernel-extension:kernel": {
      "python": {
        "packages": [
          "numpy",
          "pandas",
          "matplotlib",
          "scikit-learn",
          "scipy",
          "joblib",
          "pillow",
          "requests",
          "pyyaml"
        ]
      }
    }
  }
}
```

## 5. 已知限制和注意事项

### 技术限制

| 限制项 | 说明 | 解决方案 |
|--------|------|----------|
| 首次加载慢 | Pyodide 约 10MB 需要下载 | 提供 CDN 加速 / 离线包 |
| 包安装限制 | 部分 C 扩展包无法使用 | 使用纯 Python 实现替代 |
| 内存限制 | 浏览器内存限制约 2GB | 处理大数据时分批 |
| 执行性能 | 比本地 Python 慢 10-50x | 预计算 / 使用 WASM 优化包 |

### 兼容性问题

- **Safari**: 部分 WebAssembly 功能受限
- **iOS Safari**: 内存限制更严格
- **Firefox**: 需要手动启用 SharedArrayBuffer

### 安全注意事项

1. **sandbox 属性**: 必须设置 `allow-scripts` 但要限制不安全的权限
2. **origin 验证**: 使用 `postMessage` 时务必验证 event.origin
3. **CSP 策略**: 确保 Content-Security-Policy 允许 WASM 执行
4. **数据持久化**: localStorage 有 5-10MB 限制，大文件需处理

### 性能优化建议

1. **预加载**: 在页面加载完成后静默预加载 JupyterLite
2. **按需加载**: 仅在用户点击"开始练习"时才显示 iframe
3. **资源缓存**: 配置长期缓存策略
4. **懒加载**: 预装包采用按需加载模式

```html
<!-- 懒加载示例 -->
<button id="show-jupyter" style="display: none;">开始练习</button>
<div id="jupyter-placeholder" style="display: none;">
    <iframe src="./jupyterlite/lab/index.html" ...></iframe>
</div>

<script>
    // 仅在点击时加载
    document.getElementById('show-jupyter').addEventListener('click', function() {
        this.style.display = 'none';
        document.getElementById('jupyter-placeholder').style.display = 'block';
    });
</script>
```

### 调试技巧

1. **浏览器控制台**: 查看 Pyodide 初始化日志
2. **Network 面板**: 监控资源加载情况
3. **Application 面板**: 检查 localStorage 使用
4. **console.log**: 在 postMessage 通信中添加调试日志

### 离线部署检查清单

- [ ] 下载 jupyterlite-basic.tar.gz 或 jupyterlite-static.tar.gz
- [ ] 解压到 `./jupyterlite/` 目录
- [ ] 确保 `./jupyterlite/lab/index.html` 可访问
- [ ] 配置 `./jupyterlite/settings.json` 中的预装包
- [ ] 测试离线情况下基础功能是否正常

## 6. 快速开始

### CDN 快速嵌入 (测试用)

```html
<iframe
    src="https://jupyterlite.github.io/demo/latest/lab/index.html"
    width="100%" height="600"
    sandbox="allow-scripts allow-same-origin allow-forms">
</iframe>
```

### 本地部署步骤

1. 下载: `curl -L https://github.com/jupyterlite/jupyterlite/releases/latest/download/jupyterlite-basic.tar.gz`
2. 解压: `tar -xzf jupyterlite-basic.tar.gz`
3. 配置: 编辑 `settings.json` 添加预装包
4. 嵌入: 参考本文档的代码示例
5. 测试: 打开 `index.html` 验证功能