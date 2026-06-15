#!/usr/bin/env python3
"""
verify_arxiv.py - 验证所有 arXiv ID 真实可访问

检查 lessons_new.jsx 中所有 [arxiv:XXXX] 引用，并 curl 验证。
如发现未验证 ID 则报错。
"""
import re, sys, subprocess, json
from pathlib import Path

PROJECT = Path('/Users/Zhuanz/Desktop/workspace/1-AI教案')
LESSONS_FILE = PROJECT / 'src/data/lessons_new.jsx'

def find_lesson_block(content, lid):
    m = re.search(rf'"{lid}":\s*\{{', content)
    if not m: return None
    s = m.end() - 1
    depth = 1
    j = s + 1
    while j < len(content) and depth > 0:
        if content[j] == '{': depth += 1
        elif content[j] == '}': depth -= 1
        j += 1
    try:
        return json.loads(content[s:j])
    except:
        return None

def extract_arxiv_ids(data):
    """从 lesson JSON 提取所有 arXiv ID"""
    ids = []
    text = json.dumps(data, ensure_ascii=False)
    # 找 references
    for ref in data.get('references', []):
        if isinstance(ref, dict):
            url = ref.get('url', '')
            m = re.search(r'arxiv\.org/(?:abs|pdf)/(\d{4}\.\d{4,5})', url)
            if m:
                ids.append(m.group(1))
    # 找 content 内联引用
    for sec in data.get('sections', []):
        for m in re.finditer(r'\[arxiv:(\d{4}\.\d{4,5})\]', sec.get('content', '')):
            ids.append(m.group(1))
    return list(set(ids))

def verify_arxiv_id(arxiv_id, timeout=10):
    """curl 验证 arXiv ID 返回 200 with retry (arXiv 间歇性超时)"""
    for attempt in range(3):
        try:
            result = subprocess.run(
                ['curl', '-sL', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', str(timeout), '-A', 'Mozilla/5.0',
                 f'https://arxiv.org/abs/{arxiv_id}'],
                capture_output=True, text=True, timeout=timeout + 2
            )
            code = result.stdout.strip()
            if code == '200':
                return True, f'HTTP {code}'
        except Exception as e:
            pass
        time.sleep(1 + attempt)  # exponential backoff
    return False, 'HTTP 000 (3 retries)'

def audit_all_lesson_arxiv(target_lid=None):
    content = LESSONS_FILE.read_text() if LESSONS_FILE.exists() else ''
    lids = re.findall(r'"(L\d{2})":\s*\{', content)
    lids = sorted(set(lids))
    if target_lid:
        lids = [target_lid]
    total_ids = 0
    total_valid = 0
    invalid = []
    for lid in lids:
        data = find_lesson_block(content, lid)
        if not data: continue
        ids = extract_arxiv_ids(data)
        for aid in ids:
            total_ids += 1
            valid, line = verify_arxiv_id(aid)
            if valid:
                total_valid += 1
            else:
                invalid.append((lid, aid, line))
    print(f'\n=== arXiv Audit Summary ===')
    print(f'Total IDs: {total_ids}, Valid: {total_valid}, Invalid: {len(invalid)}')
    if invalid:
        print('\n=== Invalid IDs ===')
        for lid, aid, line in invalid:
            print(f'  [{lid}] arxiv:{aid} -> {line[:80]}')
    return 0 if not invalid else 1

if __name__ == '__main__':
    target = sys.argv[1] if len(sys.argv) > 1 else None
    sys.exit(audit_all_lesson_arxiv(target))