# L19 JSON 修复方案 (L19 JSON Repair Plan)

| 字段 | 内容 |
|------|------|
| 任务 ID | M5-T1 |
| 文档版本 | v1.0 |
| 创建日期 | 2026-06-10 |
| 估计工时 | 0.5h |
| 优先级 | P0 |

---

## 1. 问题诊断

### 1.1 错误信息
```
JSONDecodeError: Expecting ',' delimiter: line 1 column 15880 (char 15879)
```

### 1.2 根因
`lessons_new.jsx` 中的 L19 block 内有**未转义的双引号**出现在字符串值内。最常见来源：
- Python 代码示例中的字符串字面量（如 `f"..."`、`"..."`）
- 链接 URL 中的引号
- Markdown 内容中的 `"text"` 被错误嵌入 JSON 字符串

### 1.3 定位方法
```python
import json, re
with open('src/data/lessons_new.jsx') as f:
    content = f.read()
m = re.search(r'"L19":\s*\{', content)
start = m.end() - 1
depth = 1
j = start + 1
while j < len(content) and depth > 0:
    if content[j] == '{': depth += 1
    elif content[j] == '}': depth -= 1
    j += 1
try:
    json.loads(content[start:j])
except json.JSONDecodeError as e:
    # e.pos 给出错误位置
    print(f'Error at pos {e.pos}: {e.msg}')
    print(f'Context: {repr(content[start+e.pos-30:start+e.pos+30])}')
```

---

## 2. 修复步骤

### Step 1: 备份原文件
```bash
cp src/data/lessons_new.jsx src/data/lessons_new.jsx.bak
```

### Step 2: 提取 L19 block 到独立文件
```python
import re
with open('src/data/lessons_new.jsx') as f:
    content = f.read()
m = re.search(r'"L19":\s*\{', content)
start = m.end() - 1
depth = 1
j = start + 1
while j < len(content) and depth > 0:
    if content[j] == '{': depth += 1
    elif content[j] == '}': depth -= 1
    j += 1
block = content[start:j]
with open('/tmp/L19_block.txt', 'w') as f:
    f.write(block)
```

### Step 3: 尝试 LLM 重新生成
**优先方案**（推荐）：用 LLM 重新生成 L19 内容
- 提示词模板：
```
请重新生成 L19 (RAG与向量数据库) 的课程 JSON。
输入：当前 lessons_new.jsx 中 L18 的内容（已正确）
输出：完整的 L19 JSON，必须可直接 JSON.parse。
要求：
1. 至少 5 个章节，每章 ≥ 1500 字符
2. 至少 4 个代码示例（含 pip install）
3. 至少 5 条参考资源（真实 arXiv / GitHub URL）
4. 所有字符串值内引号必须正确转义或使用单引号
5. 字段格式与 L18 一致
```
- 直接保存为 `src/quiz/L19_rebuilt.json`，验证后合并到 `lessons_new.jsx`

### Step 4: 手动修复（如果 LLM 方案失败）

#### 4.1 用 state machine 修复
```python
import re

def fix_json_string_escapes(text):
    """在 code 字段内修复未转义的双引号"""
    # 匹配 "code": "..." 内的内容（可能有换行）
    def fix_code_field(match):
        prefix = match.group(1)
        content = match.group(2)
        # 在 Python 字符串中的 \" 不需要再转义
        # 但 JSON 解析需要 \\" 或 "
        # 简单方案：替换单个 \n 为 \\n（已有），单独 " 转 \\"
        fixed = content.replace('\\"', '__ESCAPED_QUOTE__')
        fixed = fixed.replace('"', '\\"')
        fixed = fixed.replace('__ESCAPED_QUOTE__', '\\"')
        return prefix + fixed + '"'
    
    return text

# 应用修复
fixed = fix_json_string_escapes(content)
with open('src/data/lessons_new.jsx', 'w') as f:
    f.write(fixed)
```

#### 4.2 验证
```python
import json
with open('src/data/lessons_new.jsx') as f:
    content = f.read()
# 验证所有 24 课
for i in range(1, 25):
    lid = f'L{i:02d}'
    m = re.search(rf'"{lid}":\s*\{{', content)
    if not m:
        print(f'{lid}: NOT FOUND')
        continue
    start = m.end() - 1
    depth = 1
    j = start + 1
    while j < len(content) and depth > 0:
        if content[j] == '{': depth += 1
        elif content[j] == '}': depth -= 1
        j += 1
    try:
        json.loads(content[start:j])
        print(f'{lid}: OK')
    except json.JSONDecodeError as e:
        print(f'{lid}: ERROR at {e.pos}')
```

### Step 5: 重建 + 验证
```bash
npx vite build 2>&1 | tail -3
lsof -ti:3000 | xargs kill -9 2>/dev/null
sleep 1
nohup npx vite preview --port 3000 --host > /tmp/vite.log 2>&1 &
sleep 3
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/lesson/L19
```

---

## 3. 验收标准

- [ ] `json.loads(content[start:j])` 对 L19 不抛异常
- [ ] 24/24 课 JSON 全部可解析
- [ ] `npx vite build` 无错
- [ ] `/lesson/L19` 返回 200
- [ ] Chrome headless 截图能看到 L19 完整内容（标题 + 章节 + 代码 + 参考）

---

## 4. 风险与回滚

| 风险 | 应对 |
|------|------|
| LLM 生成内容质量差 | 人工 review 后再合并 |
| state-machine 修复破坏其他字段 | 在原文件备份上操作，失败立即恢复 |
| L19 内容仍含错误链接 | 用 `verify_links.py`（M5-T11）扫描 |

**回滚命令**：
```bash
cp src/data/lessons_new.jsx.bak src/data/lessons_new.jsx
```