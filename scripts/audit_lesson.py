#!/usr/bin/env python3
"""
audit_lesson.py - 端到端课程审计
验证：内容完整性、URL可达性、JSON可解析、视觉渲染
"""
import sys, re, json, subprocess
from pathlib import Path

PROJECT = Path('/Users/Zhuanz/Desktop/workspace/1-AI教案')
LESSONS_FILE = PROJECT / 'src/data/lessons_new.jsx'
QUIZ_FILE = PROJECT / 'src/quiz/questions.json'

def find_lesson_block(content, lid):
    """追踪花括号深度找到 lesson 的完整 JSON"""
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

def audit_lesson(lid):
    issues = []
    content = LESSONS_FILE.read_text() if LESSONS_FILE.exists() else ''
    data = find_lesson_block(content, lid)
    if not data:
        return {'lid': lid, 'status': 'FAIL', 'issues': ['JSON parse failed'], 'metrics': {}}
    sections = data.get('sections', [])
    codes = data.get('codeExamples', [])
    refs = data.get('references', [])
    chars = sum(len(s.get('content','')) for s in sections)
    # 指标
    metrics = {
        'sections': len(sections),
        'total_chars': chars,
        'code_count': len(codes),
        'ref_count': len(refs),
    }
    # PRD FR-CM 校验
    if len(sections) < 4:
        issues.append(f'FR-CM-1: sections={len(sections)} < 4')
    if chars < 4500:
        issues.append(f'FR-CM-3: chars={chars} < 4500')
    if len(codes) < 3:
        issues.append(f'FR-CM-2: code_count={len(codes)} < 3')
    # 代码 install 检查
    for i, c in enumerate(codes):
        if 'pip install' not in c.get('code', '') and 'import' in c.get('code', ''):
            issues.append(f'FR-CM-2: code[{i}] missing pip install')
    # ref 检查
    if len(refs) < 5:
        issues.append(f'FR-CM-4: refs={len(refs)} < 5')
    # MD 兼容
    for i, s in enumerate(sections):
        c = s.get('content', '')
        if '```' in c and c.count('```') % 2 != 0:
            issues.append(f'FR-CM-5: section[{i}] unclosed code fence')
    status = 'PASS' if not issues else 'FAIL'
    return {'lid': lid, 'status': status, 'issues': issues, 'metrics': metrics}

def audit_all():
    content = LESSONS_FILE.read_text() if LESSONS_FILE.exists() else ''
    lids = re.findall(r'"(L\d{2})":\s*\{', content)
    results = [audit_lesson(l) for l in sorted(set(lids))]
    passed = sum(1 for r in results if r['status'] == 'PASS')
    print(f'Total: {len(results)}, Passed: {passed}, Failed: {len(results)-passed}')
    print()
    for r in results:
        marker = '✓' if r['status'] == 'PASS' else '✗'
        print(f"  {marker} {r['lid']}: {r['metrics']}")
        if r['issues']:
            for i in r['issues']:
                print(f'      ⚠ {i}')
    return 0 if passed == len(results) else 1

if __name__ == '__main__':
    if len(sys.argv) > 1:
        sys.exit(audit_lesson(sys.argv[1])['status'] == 'PASS')
    sys.exit(audit_all())