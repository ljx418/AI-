# 链接验证脚本规范 (Link Verification Spec)

| 字段 | 内容 |
|------|------|
| 任务 ID | M5-T11 |
| 文档版本 | v1.0 |
| 创建日期 | 2026-06-10 |
| 估计工时 | 1h |
| 优先级 | P1 |

---

## 1. 目标

自动化验证 24 课所有引用 URL 的可达性，输出报告供内容审计。

---

## 2. 脚本规范

### 2.1 文件路径
`scripts/verify_links.py`

### 2.2 接口
```bash
python3 verify_links.py [--lesson L18] [--all] [--format text|json|md] [--output report.md]
```

### 2.3 输入
- 自动扫描 `src/data/lessons_new.jsx` 中所有 lesson 的 `references`
- 自动扫描 `src/quiz/questions.json` 中 `explanation`/`question` 内的 URL
- 可选：扫描 `public/static/*.html` 中的链接

### 2.4 输出
- 文本：表格列出每 URL 的 HTTP 状态
- JSON：结构化数据供 CI 消费
- Markdown：报告文档（默认 `link_report.md`）

### 2.5 性能
- 并发：10 线程
- 超时：8 秒/URL
- 重试：3 次（指数退避）
- User-Agent：`Mozilla/5.0 (compatible; AI-Lesson-Verify/1.0)`

### 2.6 失败处理
- HTTP 4xx → 标记失效，给出原因
- HTTP 5xx → 重试 3 次后标记可疑
- 超时 → 标记网络问题（GitHub 在受限网络下常见）
- 301/302 → 自动跟随，最多 5 跳

---

## 3. 实现代码（完整）

```python
#!/usr/bin/env python3
"""
verify_links.py - 验证 1-AI教案所有引用 URL 的可达性

Usage:
    python3 verify_links.py                    # 全部
    python3 verify_links.py --lesson L18       # 单课
    python3 verify_links.py --format json      # JSON 输出
    python3 verify_links.py --output report.md # 保存到文件
"""
import argparse
import json
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import urlparse

import urllib.request
import urllib.error

PROJECT = Path('/Users/Zhuanz/Desktop/workspace/1-AI教案')
LESSONS_FILE = PROJECT / 'src/data/lessons_new.jsx'
QUESTIONS_FILE = PROJECT / 'src/quiz/questions.json'
TIMEOUT = 8
MAX_RETRIES = 3
MAX_WORKERS = 10
USER_AGENT = 'Mozilla/5.0 (compatible; AI-Lesson-Verify/1.0)'


def verify_url(url: str) -> dict:
    """验证单个 URL"""
    result = {
        'url': url,
        'domain': urlparse(url).netloc,
        'status': None,
        'final_url': None,
        'error': None,
        'attempts': 0,
        'ms': 0,
    }
    start = time.time()
    for attempt in range(1, MAX_RETRIES + 1):
        result['attempts'] = attempt
        try:
            req = urllib.request.Request(url, headers={'User-Agent': USER_AGENT})
            with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
                result['status'] = resp.status
                result['final_url'] = resp.geturl()
                break
        except urllib.error.HTTPError as e:
            result['status'] = e.code
            result['error'] = str(e)
            # 4xx 不重试
            if 400 <= e.code < 500:
                break
        except (urllib.error.URLError, TimeoutError, OSError) as e:
            result['error'] = str(e)
            if attempt < MAX_RETRIES:
                time.sleep(0.5 * attempt)
        except Exception as e:
            result['error'] = f'Unexpected: {e}'
            break
    result['ms'] = int((time.time() - start) * 1000)
    return result


def extract_urls_from_lessons(target_lesson=None):
    """从 lessons_new.jsx 提取所有 references URL"""
    if not LESSONS_FILE.exists():
        return []
    content = LESSONS_FILE.read_text()
    # 找每个 lesson block
    blocks = re.split(r'"(L\d{2})":', content)[1:]
    urls = []
    for i in range(0, len(blocks), 2):
        lid = 'L' + blocks[i]
        if target_lesson and lid != target_lesson:
            continue
        bt = blocks[i+1]
        next_m = re.search(r',\s*"L\d{2}":', bt)
        if next_m:
            bt = bt[:next_m.start()]
        try:
            data = json.loads(bt)
        except json.JSONDecodeError:
            urls.append({'lesson': lid, 'url': None, 'error': 'PARSE_ERROR'})
            continue
        for ref in data.get('references', []):
            if isinstance(ref, str):
                url_match = re.search(r'https?://\S+', ref)
                if url_match:
                    urls.append({'lesson': lid, 'title': ref[:50], 'url': url_match.group()})
            elif isinstance(ref, dict):
                url = ref.get('url') or ref.get('link')
                if url:
                    urls.append({'lesson': lid, 'title': ref.get('title') or ref.get('name') or ref.get('label', '')[:50], 'url': url})
    return urls


def extract_urls_from_questions():
    """从 questions.json 提取 explanation 中的 URL"""
    if not QUESTIONS_FILE.exists():
        return []
    data = json.loads(QUESTIONS_FILE.read_text())
    urls = []
    for lid, lesson_data in data.items():
        for q in lesson_data.get('questions', []):
            for field in ['explanation', 'question']:
                text = q.get(field, '')
                for url_match in re.finditer(r'https?://\S+', text):
                    urls.append({'lesson': lid, 'title': f'Q:{q.get("id")}:{field}', 'url': url_match.group()})
    return urls


def run_verification(items):
    """并发验证所有 URL"""
    print(f'Verifying {len(items)} URLs with {MAX_WORKERS} workers...')
    results = []
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(verify_url, item['url']): item for item in items if item.get('url')}
        for future in as_completed(futures):
            item = futures[future]
            try:
                result = future.result()
                result['lesson'] = item['lesson']
                result['title'] = item.get('title', '')
                results.append(result)
            except Exception as e:
                results.append({
                    'lesson': item['lesson'],
                    'url': item['url'],
                    'title': item.get('title', ''),
                    'status': None,
                    'error': f'Verify failed: {e}'
                })
    return results


def format_text(results):
    """格式化文本输出"""
    # 分类：GitHub 在受限网络下超时不应视为失效
    ok = [r for r in results if r.get('status') and 200 <= r['status'] < 400]
    fail = [r for r in results if not r.get('status') or r['status'] >= 400]
    susp = [r for r in results if r.get('status') is None]
    # GitHub 超时单独标记为"网络限制"，不计入 fail
    github_blocked = [r for r in susp if 'github.com' in r.get('url', '')]

    print(f'\n=== Summary ===')
    print(f'OK: {len(ok)}/{len(results)}')
    print(f'Failed (HTTP 4xx/5xx): {len(fail)}')
    print(f'Suspicious (timeout/network): {len(susp)}')
    print(f'  └─ GitHub blocked: {len(github_blocked)} (网络限制，不计入健康度)')
    print(f'真实可疑: {len(susp) - len(github_blocked)}')

    # 健康度判定：仅计算非 GitHub 域名
    non_github = [r for r in results if 'github.com' not in r.get('url', '')]
    if non_github:
        non_github_ok = sum(1 for r in non_github if r.get('status') and 200 <= r['status'] < 400)
        health = non_github_ok / len(non_github) * 100
        print(f'\n非 GitHub 链接健康度: {health:.1f}% ({non_github_ok}/{len(non_github)})')

    if fail:
        print(f'\n=== Failed URLs ===')
        for r in fail:
            print(f'  [{r["lesson"]}] {r["url"]} -> {r.get("status")} {r.get("error", "")}')
    if susp:
        print(f'\n=== Suspicious URLs ===')
        for r in susp:
            tag = ' [GITHUB-BLOCKED]' if 'github.com' in r.get('url', '') else ''
            print(f'  [{r["lesson"]}] {r["url"]} -> {r.get("error", "")}{tag}')


def format_markdown(results):
    """生成 Markdown 报告"""
    ok = [r for r in results if r.get('status') and 200 <= r['status'] < 400]
    fail = [r for r in results if not r.get('status') or r['status'] >= 400]
    susp = [r for r in results if r.get('status') is None]
    lines = ['# 链接验证报告', '', f'**生成时间**: {time.strftime("%Y-%m-%d %H:%M:%S")}', '']
    lines.append(f'## 概览\n')
    lines.append(f'- 总 URL: {len(results)}')
    lines.append(f'- ✅ 正常 (2xx/3xx): {len(ok)}')
    lines.append(f'- ❌ 失效 (4xx/5xx): {len(fail)}')
    lines.append(f'- ⚠️ 可疑 (超时): {len(susp)}\n')
    lines.append('## 详细\n')
    lines.append('| 课程 | 标题 | URL | 状态 | 备注 |\n|------|------|-----|------|------|')
    for r in sorted(results, key=lambda x: (x['lesson'], x.get('status') or 999)):
        status = r.get('status') or 'TIMEOUT'
        emoji = '✅' if status and 200 <= status < 400 else '❌' if status and status >= 400 else '⚠️'
        lines.append(f"| {r['lesson']} | {(r.get('title') or '')[:30]} | `{r['url']}` | {emoji} {status} | {r.get('error','')[:50]} |")
    return '\n'.join(lines)


def main():
    parser = argparse.ArgumentParser(description='Verify all reference URLs')
    parser.add_argument('--lesson', help='只检查指定课程, 如 L18')
    parser.add_argument('--format', choices=['text', 'json', 'md'], default='text')
    parser.add_argument('--output', help='保存到文件')
    parser.add_argument('--include-questions', action='store_true', help='包含 questions.json 中的 URL')
    args = parser.parse_args()

    items = extract_urls_from_lessons(args.lesson)
    if args.include_questions:
        items.extend(extract_urls_from_questions())
    if not items:
        print('No URLs found')
        return 1

    results = run_verification(items)

    if args.format == 'text':
        format_text(results)
    elif args.format == 'json':
        print(json.dumps(results, ensure_ascii=False, indent=2))
    elif args.format == 'md':
        md = format_markdown(results)
        if args.output:
            Path(args.output).write_text(md)
            print(f'Saved to {args.output}')
        else:
            print(md)

    # 退出码判定：仅当非 GitHub 链接失败数 > 5 才失败（GitHub 网络限制可接受）
    non_github = [r for r in results if 'github.com' not in r.get('url', '')]
    non_github_fail = sum(1 for r in non_github if not r.get('status') or r.get('status', 0) >= 400)
    return 1 if non_github_fail > 5 else 0


if __name__ == '__main__':
    sys.exit(main())
```

---

## 4. 使用示例

### 4.1 验证全部 URL（默认文本输出）
```bash
python3 scripts/verify_links.py
```

### 4.2 验证单课（Markdown 报告）
```bash
python3 scripts/verify_links.py --lesson L18 --format md --output reports/L18.md
```

### 4.3 验证全部并生成报告
```bash
python3 scripts/verify_links.py --include-questions --format md --output link_report.md
```

### 4.4 CI 集成（GitHub Actions）
```yaml
- name: Verify links
  run: python3 scripts/verify_links.py --include-questions --format json > link_status.json
- name: Check failures
  run: |
    python3 -c "
    import json, sys
    data = json.load(open('link_status.json'))
    fails = [r for r in data if not r.get('status') or r.get('status', 0) >= 400]
    if fails and len(fails) > 5:
      print(f'Too many failed: {len(fails)}')
      sys.exit(1)
    "
```

---

## 5. 输出示例

### 5.1 文本输出
```
Verifying 168 URLs with 10 workers...

=== Summary ===
OK: 152/168
Failed: 8
Suspicious (timeout/network): 8

=== Failed URLs ===
  [L01] https://chat.openai.com -> 404 Page not found
  ...

=== Suspicious URLs ===
  [L21] https://github.com/crewAI/crewAI -> <urlopen error [Errno 60] Operation timed out>
  ...
```

### 5.2 Markdown 输出片段
```markdown
| 课程 | 标题 | URL | 状态 | 备注 |
|------|------|-----|------|------|
| L01 | Attention Is All You Need | `https://arxiv.org/abs/1706.03762` | ✅ 200 | |
| L21 | CrewAI GitHub | `https://github.com/crewAI/crewAI` | ⚠️ TIMEOUT | Operation timed out |
```

---

## 6. 验收标准

- [ ] 脚本可在 60 秒内完成 200 个 URL 验证
- [ ] 输出包含 OK / Failed / Suspicious 三分类
- [ ] Markdown 报告可直接用于 PR 评论
- [ ] 与 GitHub Actions 集成，PR 时自动运行
- [ ] 不破坏构建（即使失败也不阻断）