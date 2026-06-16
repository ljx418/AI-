#!/usr/bin/env node
// scripts/dedup_content.mjs - W2 跨课内容字符级 4-gram 相似度精筛
// 用法: node scripts/dedup_content.mjs [--threshold 0.3] [--topic "L4[9]-L6[3]"]
// 关联: docs/governance/CROSS_LESSON_DEDUP.md §2.2

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const args = process.argv.slice(2);
const threshold = parseFloat(args.find(a => a.startsWith('--threshold='))?.split('=')[1] || '0.3');
const topicArg = args.find(a => a.startsWith('--topic='))?.split('=')[1];

function loadLessons() {
  const path = join(ROOT, 'src/data/lessons_new.jsx');
  if (!existsSync(path)) {
    console.error('❌ lessons_new.jsx not found at', path);
    process.exit(1);
  }
  const content = readFileSync(path, 'utf-8');

  // LESSONS 是个对象, 用 regex 扫顶层 key (避免 f-string 干扰)
  const lessonsMatch = content.match(/export const LESSONS\s*=\s*\{/);
  if (!lessonsMatch) {
    console.error('❌ LESSONS export not found');
    process.exit(1);
  }
  const objStart = lessonsMatch.index + lessonsMatch[0].length;
  const endIdx = content.lastIndexOf('};');
  if (endIdx < objStart) {
    console.error('❌ LESSONS 结束标记 `};` 未找到');
    process.exit(1);
  }
  const objText = content.slice(objStart, endIdx);

  const keyRegex = /["']?(L\d+)["']?\s*:\s*\{/g;
  const keyMatches = [...objText.matchAll(keyRegex)];

  const lessons = [];
  for (let i = 0; i < keyMatches.length; i++) {
    const m = keyMatches[i];
    const lessonId = m[1];
    const valueStart = m.index + m[0].length;
    const nextKeyIdx = i + 1 < keyMatches.length ? keyMatches[i + 1].index : objText.length;
    const lessonText = objText.slice(valueStart, nextKeyIdx);

    const sectionContents = [...lessonText.matchAll(/sections:\s*\[[\s\S]*?\]/g)].map(x => x[0]);
    const codeExamples = [...lessonText.matchAll(/codeExamples:\s*\[[\s\S]*?\]/g)].map(x => x[0]);

    const allText = sectionContents.join('\n') + '\n' + codeExamples.join('\n');
    const cleanText = allText.replace(/[\s\n\r]+/g, '').slice(0, 50000);

    lessons.push({ id: lessonId, title: lessonId, content: cleanText });
  }
  return lessons;
}

function ngrams(text, n = 4) {
  const set = new Set();
  for (let i = 0; i <= text.length - n; i++) {
    set.add(text.slice(i, i + n));
  }
  return set;
}

function jaccard(set1, set2) {
  if (set1.size === 0 || set2.size === 0) return 0;
  const inter = [...set1].filter(x => set2.has(x)).length;
  const union = new Set([...set1, ...set2]).size;
  return inter / union;
}

function filterLessons(lessons) {
  if (!topicArg) return lessons;
  const re = new RegExp(topicArg);
  return lessons.filter(l => re.test(l.id));
}

function main() {
  console.log(`\n🔍 跨课内容 4-gram 相似度精筛 (threshold=${threshold})\n`);

  const allLessons = loadLessons();
  const lessons = filterLessons(allLessons);
  console.log(`Loaded ${allLessons.length} lessons, comparing ${lessons.length}\n`);

  if (lessons.length < 2) {
    console.log('⚠️  需 ≥ 2 课做对比, 当前 1 课或更少');
    process.exit(0);
  }

  console.log('⏳ 预计算 n-grams (4-gram 滑窗)...');
  const gramsCache = new Map();
  for (const lesson of lessons) {
    gramsCache.set(lesson.id, ngrams(lesson.content));
  }
  console.log('✅ n-grams 预计算完成\n');

  const errors = [];
  const warnings = [];

  for (let i = 0; i < lessons.length; i++) {
    for (let j = i + 1; j < lessons.length; j++) {
      const a = lessons[i];
      const b = lessons[j];
      const sim = jaccard(gramsCache.get(a.id), gramsCache.get(b.id));

      if (sim >= threshold) {
        errors.push({ a: a.id, b: b.id, sim });
      } else if (sim >= threshold * 0.5) {
        warnings.push({ a: a.id, b: b.id, sim });
      }
    }
  }

  if (errors.length === 0) {
    console.log(`✅ 无 ≥${(threshold*100).toFixed(0)}% 内容重复\n`);
  } else {
    console.log(`❌ ${errors.length} 对 ≥${(threshold*100).toFixed(0)}% 重复:\n`);
    for (const e of errors.slice(0, 30)) {
      console.log(`  🔴 ${e.a} <-> ${e.b}: ${(e.sim * 100).toFixed(1)}%`);
    }
    if (errors.length > 30) console.log(`  ... and ${errors.length - 30} more`);
    console.log();
  }

  if (warnings.length > 0) {
    console.log(`🟡 ${warnings.length} 对 警告 (15-${(threshold*100).toFixed(0)}%):\n`);
    for (const w of warnings.slice(0, 10)) {
      console.log(`  ${w.a} <-> ${w.b}: ${(w.sim * 100).toFixed(1)}%`);
    }
    if (warnings.length > 10) console.log(`  ... and ${warnings.length - 10} more`);
    console.log();
  }

  process.exit(errors.length > 0 ? 1 : 0);
}

main();
