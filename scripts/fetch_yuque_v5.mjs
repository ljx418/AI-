// scripts/fetch_yuque_v5.mjs — 换策略: 自管 Chrome (不依赖 CDP), 启发式找 9 专题全 slug
// 修复: 改用 page.evaluate() 收集 URL (a.href 自动 resolve 成绝对路径)
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE = 'https://www.yuque.com/aaron-wecc3/dhluml';
const OUT_FILE = path.join(process.cwd(), 'docs', 'yuque_raw', 'yuque_urls.json');
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  page.setDefaultTimeout(30000);

  // 登录
  await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(2000);
  const hasPwd = await page.$('input.ant-input.larkui-input, input[class*="ant-input"]');
  if (hasPwd) {
    const pwd = process.env.YUQUE_PASSWORD;
    if (!pwd) throw new Error('YUQUE_PASSWORD env required');
    console.log('🔐 输入密码...');
    await hasPwd.click();
    await page.keyboard.type(pwd, { delay: 80 });
    await page.keyboard.press('Enter');
    await sleep(5000);
  }
  console.log('   登录后 title:', await page.title());

  const all = new Set();

  // 用 page.evaluate 收集 (a.href 自动 resolve)
  async function collectUrls() {
    return await page.evaluate(() => {
      const out = new Set();
      document.querySelectorAll('a').forEach(a => {
        if (a.href && a.href.includes('/dhluml/')) {
          const href = a.href.split('?')[0];
          if (!href.includes('/books/')) {
            const slug = href.split('/').pop();
            if (slug.length >= 14 && slug.length <= 22 && /^[a-z0-9]+$/.test(slug)) {
              out.add(href);
            }
          }
        }
      });
      return [...out];
    });
  }

  // 1. 首页滚 20 轮
  console.log('\n📜 首页滚 20 轮...');
  for (let i = 0; i < 20; i++) {
    const urls = await collectUrls();
    urls.forEach(u => all.add(u));
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await sleep(800);
    if (i % 5 === 0) console.log(`   轮 ${i+1}: ${all.size}`);
  }
  console.log(`   首页累计: ${all.size}`);

  // 2. 找所有"专题"开头的 slug, 不去重
  console.log('\n🌲 找所有 9 专题 slug...');
  const allTopicSlugs = await page.evaluate(() => {
    const out = [];
    const main = document.querySelector('main') || document.body;
    main.querySelectorAll('a').forEach(a => {
      const text = (a.textContent || '').trim();
      const href = a.href ? a.href.split('?')[0] : '';
      if (text.match(/^专题[一二三四五六七八九]/) && href.includes('/dhluml/')) {
        const slug = href.split('/').pop();
        out.push({text: text.slice(0, 20), slug});
      }
    });
    return out;
  });
  const topicSlugSet = new Set(allTopicSlugs.map(t => t.slug));
  console.log(`   共 ${topicSlugSet.size} 个不同 slug:`);
  [...topicSlugSet].forEach(s => console.log(`     ${s}`));

  // 3. 访问每个专题页
  console.log('\n📚 访问每个专题 slug...');
  for (const slug of topicSlugSet) {
    try {
      console.log(`   → ${slug}`);
      await page.goto(`${BASE}/${slug}`, { waitUntil: 'networkidle2', timeout: 30000 });
      await sleep(1500);
      for (let r = 0; r < 5; r++) {
        const urls = await collectUrls();
        urls.forEach(u => all.add(u));
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await sleep(800);
      }
      console.log(`     累计: ${all.size}`);
    } catch (e) {
      console.log(`     ✗ ${e.message.slice(0, 60)}`);
    }
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify([...all].sort(), null, 2));
  console.log(`\n📚 v5 共 ${all.size} URL (目标 287, 偏差 ${Math.round((all.size-287)/287*100)}%)`);

  await browser.close();
})();

