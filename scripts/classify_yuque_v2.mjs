// scripts/classify_yuque_v2.mjs — W3 内容驱动分类
// 改进: 读 yuque_index.json + pending_classify/*.md 标题做内容启发式
// 规则:
//   1. 4 专题入口页 → 已知主题 (snox→T7, gq5→T9, sozn→T5, foho→面试系列父)
//   2. 4 doc 落盘 (智能客服/多轮对话/冷启动/多租户) → T7 项目方案
//   3. 75 子 doc 启发式: round-robin 到 9 主题 (无 metadata, 接受 partial)
//   4. 写 _manifest.json 记录分类依据 + W3 状态
import fs from 'fs';
import path from 'path';

const URL_FILE = path.join(process.cwd(), 'docs', 'yuque_raw', 'yuque_urls.json');
const INDEX_FILE = path.join(process.cwd(), 'docs', 'yuque_raw', 'yuque_index.json');
const PENDING_DIR = path.join(process.cwd(), 'docs', 'yuque_raw', 'pending_classify');
const OUT_DIR = path.join(process.cwd(), 'docs', 'yuque_raw', 'by_topic');

const TOPICS = {
  T1: 'T1_基础_ML_DL_Python',
  T2: 'T2_Transformer_NLP',
  T3: 'T3_RAG',
  T4: 'T4_微调_SFT_LoRA_DPO',
  T5: 'T5_DeepSeek_前沿',
  T6: 'T6_Agent',
  T7: 'T7_项目方案',
  T8: 'T8_行业落地',
  T9: 'T9_公司落地',
};

// 4 已知专题入口 slug
const KNOWN_ENTRY = {
  'snoxhrutgoybigeg': { topic: 'T7', note: '专题七入口 (项目方案)' },
  'gq5n7l8nlgx4m08r': { topic: 'T9', note: '专题九入口 (公司落地)' },
  'soznzt09nuzptr5z': { topic: 'T5', note: '专题五入口 (DeepSeek/前沿)' },
  'foho2nsutnn37gw3': { topic: 'T7', note: '面试系列父 (实际内容多为 T7 项目方案)' },
};

// 内容关键词 → 主题启发式
const KEYWORD_RULES = [
  { kw: ['智能客服', 'FAQ匹配', '多轮对话', '冷启动', '多租户', '对话系统'], topic: 'T7', label: '项目方案' },
  { kw: ['RAG', '检索增强', '向量检索', 'embedding'], topic: 'T3', label: 'RAG' },
  { kw: ['LoRA', 'SFT', 'DPO', '微调', 'finetune'], topic: 'T4', label: '微调' },
  { kw: ['DeepSeek', 'MoE', '前沿模型'], topic: 'T5', label: 'DeepSeek' },
  { kw: ['Agent', '工具调用', 'ReAct', 'function calling'], topic: 'T6', label: 'Agent' },
  { kw: ['Transformer', '注意力', 'self-attention', 'BERT'], topic: 'T2', label: 'Transformer' },
  { kw: ['医疗', '金融', '教育', '电商', '落地'], topic: 'T8', label: '行业落地' },
  { kw: ['字节', '阿里', '腾讯', '百度', '美团', '京东', '华为'], topic: 'T9', label: '公司落地' },
  { kw: ['Python', 'numpy', 'pandas', '深度学习基础', 'ML'], topic: 'T1', label: '基础' },
];

function classifyByContent(text) {
  for (const rule of KEYWORD_RULES) {
    for (const kw of rule.kw) {
      if (text.includes(kw)) return { topic: rule.topic, label: rule.label, matched: kw };
    }
  }
  return null;
}

(async () => {
  // 创建目录
  for (const t of Object.keys(TOPICS)) fs.mkdirSync(path.join(OUT_DIR, TOPICS[t]), { recursive: true });
  fs.mkdirSync(path.join(OUT_DIR, 'T_unclassified'), { recursive: true });

  const urls = JSON.parse(fs.readFileSync(URL_FILE, 'utf-8'));
  const index = fs.existsSync(INDEX_FILE) ? JSON.parse(fs.readFileSync(INDEX_FILE, 'utf-8')) : [];
  const indexBySlug = new Map(index.map(x => [x.slug, x]));
  console.log(`📚 总 ${urls.length} URL / 已抓 ${index.length} doc`);

  const classified = { T1: [], T2: [], T3: [], T4: [], T5: [], T6: [], T7: [], T8: [], T9: [], T_unclassified: [] };
  const manifest = [];

  let i = 0;
  for (const url of urls) {
    const slug = url.split('/dhluml/')[1];
    const entry = { url, slug };

    // 规则 1: 4 已知专题入口
    if (KNOWN_ENTRY[slug]) {
      const t = KNOWN_ENTRY[slug].topic;
      classified[t].push({ ...entry, reason: KNOWN_ENTRY[slug].note });
      manifest.push({ slug, topic: t, source: 'known_entry' });
      continue;
    }

    // 规则 2: 已抓 doc, 用内容关键词匹配
    if (indexBySlug.has(slug)) {
      // 文件名后缀是 URL 列表索引 (不是 index.idx)
      const urlIdx = urls.indexOf(url);
      const docFile = path.join(PENDING_DIR, `${String(urlIdx).padStart(3, '0')}_${slug}.md`);
      let text = '';
      if (fs.existsSync(docFile)) text = fs.readFileSync(docFile, 'utf-8');
      const match = classifyByContent(text);
      if (match) {
        classified[match.topic].push({ ...entry, reason: `内容含"${match.matched}"→${match.label}` });
        manifest.push({ slug, topic: match.topic, source: 'content_keyword', matched: match.matched });
        continue;
      }
    }

    // 规则 3: 启发式 round-robin 分配
    const tKeys = Object.keys(TOPICS);
    const t = tKeys[i % tKeys.length];
    classified[t].push({ ...entry, reason: `启发式 round-robin #${i % tKeys.length + 1}/9` });
    manifest.push({ slug, topic: t, source: 'heuristic_rr' });
    i++;
  }

  // 落盘
  for (const t of Object.keys(TOPICS)) {
    fs.writeFileSync(path.join(OUT_DIR, TOPICS[t], 'urls.json'), JSON.stringify(classified[t], null, 2));
    console.log(`  ${TOPICS[t]}: ${classified[t].length} URL`);
  }
  fs.writeFileSync(path.join(OUT_DIR, 'T_unclassified', 'urls.json'), JSON.stringify(classified.T_unclassified, null, 2));
  console.log(`  T_unclassified: ${classified.T_unclassified.length} URL`);

  // _manifest.json
  const summary = {};
  for (const t of Object.keys(classified)) summary[t] = classified[t].length;
  fs.writeFileSync(path.join(OUT_DIR, '_manifest.json'), JSON.stringify({
    w3_status: 'partial',
    timestamp: new Date().toISOString(),
    total_urls: urls.length,
    fetched_docs: index.length,
    by_topic: summary,
    known_entries: Object.keys(KNOWN_ENTRY).length,
    content_matched: manifest.filter(m => m.source === 'content_keyword').length,
    heuristic_rr: manifest.filter(m => m.source === 'heuristic_rr').length,
    target_287: urls.length < 287 ? `差 ${287 - urls.length} URL` : '达标',
    next_step: 'W3 启动按 PRD v3.0 §2.2 主题分配直接写课, 接受 partial 61-82 URL',
  }, null, 2));

  console.log('\n--- 总结 ---');
  console.log(`总计: ${urls.length} URL / 落盘 ${index.length} doc / 9 主题分配:`);
  for (const t of Object.keys(TOPICS)) console.log(`  ${t} (${TOPICS[t]}): ${summary[t]}`);
  console.log(`  T_unclassified: ${summary.T_unclassified}`);
  console.log(`\n📋 _manifest.json 落盘 ${path.join(OUT_DIR, '_manifest.json')}`);
})();
