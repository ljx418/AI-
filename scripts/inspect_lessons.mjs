#!/usr/bin/env node
// inspect_lessons.mjs — 实测 L01-L63 课数据 (W2 验收脚本)
// 用法: node scripts/inspect_lessons.mjs [--topic L37-L48] [--strict]
//
// 修复: 之前用 "codeExamples" 字段出现次数 = 1 (数的是字段名, 不是数组元素)
// 现在正确用 brace 配对定位 [ ... ] 数组边界, 然后数对象数
//
// W2 验收门槛:
// - 每课中文字符 ≥ 8000
// - 每课 codeExamples ≥ 4
// - 每课 references ≥ 5
// - 每课 sections ≥ 3
// - placeholder 0 命中
// - 总字数 ≥ 420,000 (W2 累计)
// - 课数 ≥ 63 (W2 累计)

import fs from 'fs';

const args = process.argv.slice(2);
let strictMode = false;
let topicFilter = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--strict') strictMode = true;
  else if (args[i] === '--topic') topicFilter = args[++i];
}

const src = fs.readFileSync('src/data/lessons_new.jsx', 'utf-8');
const lessonsStart = src.indexOf('export const LESSONS');
const body = src.slice(lessonsStart);

const re = /"(L\d+)":\s*\{/g;
const matches = [];
let m;
while ((m = re.exec(body)) !== null) {
  matches.push({ id: m[1], offset: m.index });
}

function findBlockEnd(text, startIdx) {
  let depth = 0, inStr = false, strCh = null, esc = false;
  for (let i = startIdx; i < text.length; i++) {
    const c = text[i];
    if (esc) { esc = false; continue; }
    if (c === '\\') { esc = true; continue; }
    if (inStr) { if (c === strCh) inStr = false; continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = true; strCh = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return i; }
  }
  return -1;
}

// 找 "fieldName": [...] 数组边界, 返回 array 字符串
function findArrayValue(block, fieldName) {
  const re = new RegExp(`"${fieldName}"\\s*:\\s*\\[`, 'g');
  const match = re.exec(block);
  if (!match) return null;
  const arrStart = match.index + match[0].length;
  let depth = 1, inStr = false, strCh = null, esc = false;
  for (let i = arrStart; i < block.length; i++) {
    const c = block[i];
    if (esc) { esc = false; continue; }
    if (c === '\\') { esc = true; continue; }
    if (inStr) { if (c === strCh) inStr = false; continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = true; strCh = c; continue; }
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) return block.slice(arrStart, i); }
  }
  return null;
}

// 数数组里的对象数 (用 brace 配对)
function countObjectsInArray(arrText) {
  if (!arrText) return 0;
  let count = 0, depth = 0, inStr = false, strCh = null, esc = false;
  for (let i = 0; i < arrText.length; i++) {
    const c = arrText[i];
    if (esc) { esc = false; continue; }
    if (c === '\\') { esc = true; continue; }
    if (inStr) { if (c === strCh) inStr = false; continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = true; strCh = c; continue; }
    if (c === '{') { depth++; if (depth === 1) count++; }
    else if (c === '}') depth--;
  }
  return count;
}

const out = [];
let totalChars = 0, totalCodes = 0, totalRefs = 0, totalSections = 0;
let pass = 0, fail = 0, placeholderHits = 0;

for (const { id, offset } of matches) {
  if (topicFilter && !id.match(topicFilter)) continue;
  const blockStart = body.indexOf('{', offset);
  const blockEnd = findBlockEnd(body, blockStart);
  const block = body.slice(blockStart, blockEnd + 1);

  const t = block.match(/"title":\s*"([^"]+)"/);
  const title = t ? t[1] : '(no title)';
  const cnChars = (block.match(/[一-龥]/g) || []).length;

  const codeArr = findArrayValue(block, 'codeExamples');
  const refArr = findArrayValue(block, 'references');
  const secArr = findArrayValue(block, 'sections');
  const codeCount = countObjectsInArray(codeArr);
  const refCount = countObjectsInArray(refArr);
  const sectionCount = countObjectsInArray(secArr);

  // placeholder 检测 (W1 教训): 区分真污染 vs 教学用例
  // 真污染: "--- 模拟数据 ---" 标题型 / "XXX 亿美元" 占位数据型 / "TODO 实际请替换"
  // 误报 (合法): "make_blobs" 生成演示数据 / HTML placeholder 属性 / "替换占位符" 教学说明
  const realPollutionPatterns = [
    /---\s*模拟数据\s*---/g,         // L47 W1 残留
    /[为是]XXX(?![\w])/g,            // "XXX 亿美元" 这种占位数据
    /TODO\s*[:：]?\s*实际请替换/g,   // L15 风格
    /FIXME/g,
    /__PLACEHOLDER__/g,
    /__TODO__/g,
  ];
  let placeholders = 0;
  let pollutionDetails = [];
  for (const pat of realPollutionPatterns) {
    const matches = block.match(pat);
    if (matches) {
      placeholders += matches.length;
      pollutionDetails.push(`${pat.source}:${matches.length}`);
    }
  }
  if (placeholders > 0) placeholderHits++;

  totalChars += cnChars;
  totalCodes += codeCount;
  totalRefs += refCount;
  totalSections += sectionCount;

  const charPass = cnChars >= 8000;
  const codePass = codeCount >= 4;
  const refPass = refCount >= 5;
  const sectionPass = sectionCount >= 3;
  const placeholderPass = placeholders === 0;
  const isPass = charPass && codePass && refPass && sectionPass && placeholderPass;
  if (isPass) pass++; else fail++;

  out.push({ id, title, cnChars, codeCount, refCount, sectionCount, placeholders, isPass });
}

console.log('='.repeat(82));
console.log(' AI 教案课程实测 (inspect_lessons.mjs)');
console.log('='.repeat(82));
console.log(`模式: ${strictMode ? 'STRICT (W2 P0)' : 'NORMAL'}${topicFilter ? ` | 过滤: ${topicFilter}` : ''}`);
console.log('');
console.log('ID    | 字数    | 代码 | 引用 | 章节 | 占位 | 状态 | 标题');
console.log('-'.repeat(82));
out.forEach(x => {
  const flag = x.isPass ? '✓' : '✗';
  const reasons = [];
  if (x.cnChars < 8000) reasons.push(`字<8K(${x.cnChars})`);
  if (x.codeCount < 4) reasons.push(`代<4(${x.codeCount})`);
  if (x.refCount < 5) reasons.push(`引<5(${x.refCount})`);
  if (x.sectionCount < 3) reasons.push(`章<3(${x.sectionCount})`);
  if (x.placeholders > 0) reasons.push(`占位${x.placeholders}`);
  const reasonStr = reasons.length ? ` ${reasons.join(',')}` : '';
  console.log(`${x.id}  | ${String(x.cnChars).padStart(6)} | ${String(x.codeCount).padStart(4)} | ${String(x.refCount).padStart(4)} | ${String(x.sectionCount).padStart(4)} | ${String(x.placeholders).padStart(4)} |  ${flag}   | ${x.title.slice(0, 40)}${reasonStr}`);
});
if (placeholderHits > 0) {
  console.log('');
  console.log('⚠️  检测到 placeholder 真污染 (W1 风格):');
  out.filter(x => x.placeholders > 0).forEach(x => {
    console.log(`  ${x.id} (${x.placeholders} 处): 需手动修复`);
  });
  console.log('  注: 误报 (教学代码里的 make_blobs/HTML placeholder 属性) 已自动排除');
}
console.log('-'.repeat(82));
console.log(`总计: ${out.length} 课, ${totalChars.toLocaleString()} 字, ${totalCodes} 代码, ${totalRefs} 引用, ${totalSections} 章节`);
console.log(`通过: ${pass} 课, 失败: ${fail} 课, placeholder 污染: ${placeholderHits} 课`);
console.log('');

const W2_MIN_CHARS = 420000;
const W2_MIN_LESSONS = 63;
const totalOk = totalChars >= W2_MIN_CHARS && out.length >= W2_MIN_LESSONS && fail === 0 && placeholderHits === 0;
console.log('W2 量化门槛:');
console.log(`  总字数 ≥ ${W2_MIN_CHARS.toLocaleString()}: ${totalChars >= W2_MIN_CHARS ? '✓' : '✗'} (实际 ${totalChars.toLocaleString()})`);
console.log(`  课数 ≥ ${W2_MIN_LESSONS}: ${out.length >= W2_MIN_LESSONS ? '✓' : '✗'} (实际 ${out.length})`);
console.log(`  失败课 = 0: ${fail === 0 ? '✓' : '✗'} (实际 ${fail})`);
console.log(`  placeholder = 0: ${placeholderHits === 0 ? '✓' : '✗'} (实际 ${placeholderHits})`);
console.log('');
console.log(`综合: ${totalOk ? '✅ PASS' : '❌ FAIL'}`);

if (strictMode && !totalOk) {
  process.exit(1);
}
