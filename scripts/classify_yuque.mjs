// scripts/classify_yuque.mjs — 按 9 主题分配 82 URL 到 9 个子目录
// 规则 (按 v7 抓取 4 专题归属):
//   - snox (专题七) → T7 项目方案
//   - gq5 (专题九) → T9 公司落地
//   - sozn → 待识别 (启发式: 按子 doc title 关键词)
//   - 其他 → 按 slug 启发式 (无 metadata 时归 T-other)
import fs from 'fs';
import path from 'path';

const URL_FILE = path.join(process.cwd(), 'docs', 'yuque_raw', 'yuque_urls.json');
const OUT_DIR = path.join(process.cwd(), 'docs', 'yuque_raw', 'by_topic');

// 9 主题目录
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

// 4 已知专题 slug 归属
const KNOWN_TOPIC_SLUGS = {
  'snoxhrutgoybigeg': 'T7',
  'gq5n7l8nlgx4m08r': 'T9',
  'soznzt09nuzptr5z': 'T5',  // 启发式: sozn 内容偏 DeepSeek
  'foho2nsutnn37gw3': null,   // 面试系列共用入口, 不归类
};

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const t of Object.keys(TOPICS)) {
    fs.mkdirSync(path.join(OUT_DIR, TOPICS[t]), { recursive: true });
  }

  const urls = JSON.parse(fs.readFileSync(URL_FILE, 'utf-8'));
  console.log(`📚 总 ${urls.length} URL`);

  // 分类
  const classified = { T1: [], T2: [], T3: [], T4: [], T5: [], T6: [], T7: [], T8: [], T9: [], T_unclassified: [] };

  for (const url of urls) {
    const slug = url.split('/dhluml/')[1];

    // 4 已知专题页 (不归类, 是入口)
    if (KNOWN_TOPIC_SLUGS[slug] === null) {
      classified.T_unclassified.push({ url, slug, reason: '面试系列共用入口' });
      continue;
    }
    if (KNOWN_TOPIC_SLUGS[slug]) {
      classified[KNOWN_TOPIC_SLUGS[slug]].push({ url, slug, reason: '已知专题页' });
      continue;
    }

    // 子 doc: 按父专题 (从访问路径推断) — 启发式按 slug 字符串
    // (无 metadata, 简单按字符模式归类)
    // 实际生产应该 fetch doc title + 启发式匹配 9 主题关键词
    classified.T_unclassified.push({ url, slug, reason: '子 doc 需 fetch 后归类' });
  }

  // 落盘 — 每个主题一个 .json 列表
  for (const t of Object.keys(TOPICS)) {
    const f = path.join(OUT_DIR, TOPICS[t], 'urls.json');
    fs.writeFileSync(f, JSON.stringify(classified[t], null, 2));
    console.log(`  ${TOPICS[t]}: ${classified[t].length} URL`);
  }
  const f = path.join(OUT_DIR, 'T_unclassified', 'urls.json');
  fs.mkdirSync(path.join(OUT_DIR, 'T_unclassified'), { recursive: true });
  fs.writeFileSync(f, JSON.stringify(classified.T_unclassified, null, 2));
  console.log(`  T_unclassified: ${classified.T_unclassified.length} URL`);

  // 总结
  console.log('\n--- 分类总结 ---');
  console.log(`总计: ${urls.length}`);
  const knownCount = Object.keys(KNOWN_TOPIC_SLUGS).filter(k => KNOWN_TOPIC_SLUGS[k]).length;
  const childCount = urls.length - knownCount - 1; // 减 1 是 foho 共用入口
  console.log(`已知专题入口: ${knownCount}`);
  console.log(`子 doc (需 fetch 后归类): ${childCount}`);
  console.log(`面试系列共用: 1`);
})();
