#!/usr/bin/env node
// gap_eval.mjs — 9 专题覆盖率 (按字数实测) vs 语雀 dhluml
// 用法: node scripts/gap_eval.mjs [--out json]
//
// 数据基础:
// - AI 教案 L01-L48 实测中文字符 (来自 src/data/lessons_new.jsx)
// - 语雀 dhluml 9 专题按"启发式权重"分配 (287 文档 / 1,420,798 字)
// - W2 重点: 行业/微调/Agent 3 个 P0 主题覆盖率

import fs from 'fs';

const args = process.argv.slice(2);
let jsonOutput = false;
for (const a of args) if (a === '--out' || a === '--json') jsonOutput = true;

// 1. 提取 AI 教案每课字数
const src = fs.readFileSync('src/data/lessons_new.jsx', 'utf-8');
const lessonsStart = src.indexOf('export const LESSONS');
const body = src.slice(lessonsStart);
const re = /"(L\d{2})":\s*\{/g;
const matches = []; let m;
while ((m = re.exec(body)) !== null) matches.push({id: m[1], offset: m.index});
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
const cnChars = {};
for (const {id, offset} of matches) {
  const bs = body.indexOf('{', offset), be = findBlockEnd(body, bs);
  const block = body.slice(bs, be+1);
  cnChars[id] = (block.match(/[一-龥]/g) || []).length;
}

// 2. 主题归一化
const adjusted = {
  '基础篇 (ML/DL/Python)':       ['L01','L02','L03','L04','L05','L06','L07','L08','L09','L10','L11','L12','L37'],
  'Transformer/NLP 篇':          ['L13','L14','L15','L16','L17','L38'],
  'RAG 篇':                       ['L18','L31','L39','L40','L41','L42','L43','L44','L45','L46','L47','L48'],
  '微调篇 (SFT/LoRA/DPO)':        ['L25','L26','L28'],
  'DeepSeek/前沿模型篇':          ['L32'],
  'Agent 篇':                     ['L19','L21','L22','L27','L36'],
  '部署/推理/分布式篇':           ['L29','L30'],
  '工具/实践/评测篇':             ['L20','L23','L33'],
  '行业案例/项目方案/公司落地':   ['L34','L35']
};

// 3. 语雀 9 专题权重 (287 文档, 1,420,798 字)
const yuqueWeights = {
  '基础篇 (ML/DL/Python)':       30,
  'Transformer/NLP 篇':          25,
  'RAG 篇':                       50,
  '微调篇 (SFT/LoRA/DPO)':        35,
  'DeepSeek/前沿模型篇':          20,
  'Agent 篇':                     45,
  '部署/推理/分布式篇':           0,
  '工具/实践/评测篇':             0,
  '行业案例/项目方案/公司落地':   30 + 30 + 22
};
const YUQUE_TOTAL_CHARS = 1420798;
const totalWeight = Object.values(yuqueWeights).reduce((s, x) => s + x, 0);

// 4. 计算
const rows = [];
let totalAiChars = 0, totalYqChars = 0;
for (const [topic, lessons] of Object.entries(adjusted)) {
  const w = yuqueWeights[topic] || 0;
  const yqChars = Math.round((w / totalWeight) * YUQUE_TOTAL_CHARS);
  const aiChars = lessons.reduce((s, lid) => s + (cnChars[lid] || 0), 0);
  const cov = yqChars > 0 ? Math.round(aiChars / yqChars * 100) : null;
  const gap = yqChars - aiChars;
  rows.push({ topic, w, yqChars, lessons, aiChars, cov, gap });
  totalAiChars += aiChars;
  totalYqChars += yqChars;
}

if (jsonOutput) {
  console.log(JSON.stringify({ rows, totalAiChars, totalYqChars, overallCov: (totalAiChars/totalYqChars*100).toFixed(1) }, null, 2));
  process.exit(0);
}

// 5. 文字输出
console.log('='.repeat(80));
console.log(' 9 专题覆盖率评估 (按字数实测) - AI 教案 vs 语雀 dhluml');
console.log('='.repeat(80));
console.log('');
console.log('| 主题 | 语雀字数(估) | AI 字数(实) | 覆盖率 | 差距 |');
console.log('|------|----------:|----------:|------:|-----:|');
rows.forEach(r => {
  const cov = r.cov === null ? 'N/A' : `${r.cov}%`;
  const gapStr = r.gap > 0 ? `-${(r.gap/1000).toFixed(1)}K` : (r.gap < 0 ? `+${(-r.gap/1000).toFixed(1)}K` : '0');
  console.log(`| ${r.topic.padEnd(30)} | ${(r.yqChars/1000).toFixed(0).padStart(6)}K | ${(r.aiChars/1000).toFixed(1).padStart(6)}K | ${cov.padStart(5)} | ${gapStr.padStart(7)} |`);
});
console.log('');
console.log(`AI 教案总字数: ${totalAiChars.toLocaleString()} (${(totalAiChars/1000).toFixed(0)}K)`);
console.log(`语雀 9 专题总: ${totalYqChars.toLocaleString()} (${(totalYqChars/1000).toFixed(0)}K)`);
console.log(`9 专题总覆盖率: ${(totalAiChars/totalYqChars*100).toFixed(1)}%`);
console.log('');

// W2 门槛
const W2_OVERALL_COV = 30;
const W2_INDUSTRY_COV = 15;
const W2_FT_COV = 35;
const W2_AGENT_COV = 30;
const W2_PASS = (totalAiChars/totalYqChars*100) >= W2_OVERALL_COV;

const cov = (t) => rows.find(r => r.topic === t)?.cov || 0;

console.log('W2 覆盖率门槛:');
console.log(`  9 专题总覆盖率 ≥ ${W2_OVERALL_COV}%: ${(totalAiChars/totalYqChars*100) >= W2_OVERALL_COV ? '✓' : '✗'} (实际 ${(totalAiChars/totalYqChars*100).toFixed(1)}%)`);
console.log(`  行业/项目/公司 ≥ ${W2_INDUSTRY_COV}%: ${cov('行业案例/项目方案/公司落地') >= W2_INDUSTRY_COV ? '✓' : '✗'} (实际 ${cov('行业案例/项目方案/公司落地')}%)`);
console.log(`  微调篇 ≥ ${W2_FT_COV}%: ${cov('微调篇 (SFT/LoRA/DPO)') >= W2_FT_COV ? '✓' : '✗'} (实际 ${cov('微调篇 (SFT/LoRA/DPO)')}%)`);
console.log(`  Agent 篇 ≥ ${W2_AGENT_COV}%: ${cov('Agent 篇') >= W2_AGENT_COV ? '✓' : '✗'} (实际 ${cov('Agent 篇')}%)`);
console.log('');
console.log(`综合: ${W2_PASS ? '✅ PASS' : '❌ FAIL (等待 L49-L63 生成)'}`);

if (!W2_PASS) {
  console.log('');
  console.log('缺口最大 (优先级 P0):');
  rows.filter(r => r.yqChars > 0).sort((a, b) => b.gap - a.gap).slice(0, 3).forEach((r, i) => {
    console.log(`  ${i+1}. ${r.topic}: 缺 ${(r.gap/1000).toFixed(1)}K 字 (AI ${(r.aiChars/1000).toFixed(1)}K / 语雀 ${(r.yqChars/1000).toFixed(0)}K = ${r.cov}%)`);
  });
}
