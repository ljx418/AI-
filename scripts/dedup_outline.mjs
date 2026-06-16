#!/usr/bin/env node
// scripts/dedup_outline.mjs - W2 跨课 outline 相似度粗筛
// 用法: node scripts/dedup_outline.mjs [--threshold 0.3]
// 关联: docs/governance/CROSS_LESSON_DEDUP.md §2.1

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const args = process.argv.slice(2);
const threshold = parseFloat(args.find(a => a.startsWith('--threshold='))?.split('=')[1] || '0.3');

// 解析 lessons_new.jsx 为 LESSONS 数组 (LESSONS 实际是对象)
function loadLessons() {
  const path = join(ROOT, 'src/data/lessons_new.jsx');
  if (!existsSync(path)) {
    console.error('❌ lessons_new.jsx not found at', path);
    process.exit(1);
  }
  const content = readFileSync(path, 'utf-8');

  // LESSONS 是个对象: 用 regex 扫所有 "Lxx": { 顶层 key
  // 避免 brace-matching 被 codeExamples 里的 Python f-string `f'{tool}'` 干扰
  const lessonsMatch = content.match(/export const LESSONS\s*=\s*\{/);
  if (!lessonsMatch) {
    console.error('❌ LESSONS export not found');
    process.exit(1);
  }
  const objStart = lessonsMatch.index + lessonsMatch[0].length;

  // 找 LESSONS 对象结束 (从 objStart 末尾 `};` 倒推)
  const endIdx = content.lastIndexOf('};');
  if (endIdx < objStart) {
    console.error('❌ LESSONS 结束标记 `};` 未找到');
    process.exit(1);
  }
  const objText = content.slice(objStart, endIdx);

  // 找所有顶层 key 位置 (用 regex)
  const keyRegex = /["']?(L\d+)["']?\s*:\s*\{/g;
  const keyMatches = [...objText.matchAll(keyRegex)];

  const lessons = [];
  for (let i = 0; i < keyMatches.length; i++) {
    const m = keyMatches[i];
    const lessonId = m[1];
    const valueStart = m.index + m[0].length;  // 跳过 "{"
    const nextKeyIdx = i + 1 < keyMatches.length ? keyMatches[i + 1].index : objText.length;
    // 取这个 lesson 对象的范围: 从 { 开始到下一个 "Lxx" 之前
    const lessonText = objText.slice(valueStart, nextKeyIdx);

    const titleMatch = lessonText.match(/title:\s*["']([^"']+)["']/);
    const title = titleMatch ? titleMatch[1] : lessonId;
    const sectionTitles = [...lessonText.matchAll(/title:\s*["']([^"']+)["']/g)]
      .map(x => x[1])
      .filter(t => t !== title);

    lessons.push({ id: lessonId, title, outline: sectionTitles });
  }
  return lessons;
}

function extractAllText(lesson) {
  return [lesson.title, ...lesson.outline].join(' ').trim().toLowerCase();
}

function jaccardSimilarity(t1, t2) {
  const set1 = new Set(t1.split(/\s+/).filter(Boolean));
  const set2 = new Set(t2.split(/\s+/).filter(Boolean));
  if (set1.size === 0 || set2.size === 0) return 0;
  const inter = [...set1].filter(x => set2.has(x)).length;
  const union = new Set([...set1, ...set2]).size;
  return inter / union;
}

function main() {
  console.log(`\n🔍 跨课 Outline 相似度粗筛 (threshold=${threshold})\n`);

  const lessons = loadLessons();
  console.log(`Loaded ${lessons.length} lessons\n`);

  const warnings = [];
  const errors = [];

  for (let i = 0; i < lessons.length; i++) {
    for (let j = i + 1; j < lessons.length; j++) {
      const a = lessons[i];
      const b = lessons[j];
      const t1 = extractAllText(a);
      const t2 = extractAllText(b);
      const sim = jaccardSimilarity(t1, t2);

      if (sim >= threshold) {
        errors.push({ a: a.id, b: b.id, sim, level: '🔴' });
      } else if (sim >= threshold * 0.5) {
        warnings.push({ a: a.id, b: b.id, sim, level: '🟡' });
      }
    }
  }

  if (errors.length === 0) {
    console.log('✅ 无 ≥30% outline 重复\n');
  } else {
    console.log(`❌ ${errors.length} 对 ≥30% 重复 (需修复):\n`);
    for (const e of errors) {
      console.log(`  ${e.level} ${e.a} <-> ${e.b}: ${(e.sim * 100).toFixed(1)}%`);
    }
    console.log();
  }

  if (warnings.length > 0) {
    console.log(`🟡 ${warnings.length} 对 15-30% 警告 (人工 spot-check):\n`);
    for (const w of warnings.slice(0, 20)) {
      console.log(`  ${w.level} ${w.a} <-> ${w.b}: ${(w.sim * 100).toFixed(1)}%`);
    }
    if (warnings.length > 20) console.log(`  ... and ${warnings.length - 20} more`);
    console.log();
  }

  process.exit(errors.length > 0 ? 1 : 0);
}

main();
