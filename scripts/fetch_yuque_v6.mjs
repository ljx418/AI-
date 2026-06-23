// scripts/fetch_yuque_v6.mjs — 关键修正: foho2nsutnn37gw3 是 9 专题共用入口, 不排除, 滚 30 轮
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

  await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(2000);
  const hasPwd = await page.$('input.ant-input.larkui-input, input[class*="ant-input"]');
  if (hasPwd) {
    await hasPwd.click();
    await page.keyboard.type('ghkq', { delay: 80 });
    await page.keyboard.press('Enter');
    await sleep(5000);
  }

  const all = new Set();

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
  console.log('📜 首页滚 20 轮...');
  for (let i = 0; i < 20; i++) {
    (await collectUrls()).forEach(u => all.add(u));
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await sleep(800);
    if (i % 5 === 0) console.log(`   轮 ${i+1}: ${all.size}`);
  }
  console.log(`   首页累计: ${all.size}`);

  // 2. 访问 9 专题共用入口 foho2nsutnn37gw3 (关键!) + 其他 3 个
  for (const slug of ['foho2nsutnn37gw3', 'snoxhrutgoybigeg', 'gq5n7l8nlgx4m08r', 'soznzt09nuzptr5z']) {
    console.log(`\n📚 访问 ${slug}, 滚 30 轮...`);
    try {
      await page.goto(`${BASE}/${slug}`, { waitUntil: 'networkidle2', timeout: 30000 });
      await sleep(2000);
      for (let i = 0; i < 30; i++) {
        (await collectUrls()).forEach(u => all.add(u));
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await sleep(800);
        if (i % 10 === 0) console.log(`   轮 ${i+1}: ${all.size}`);
      }
      console.log(`   ${slug} 后累计: ${all.size}`);
    } catch (e) {
      console.log(`   ✗ ${e.message.slice(0, 60)}`);
    }
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify([...all].sort(), null, 2));
  console.log(`\n📚 v6 共 ${all.size} URL (目标 287, 偏差 ${Math.round((all.size-287)/287*100)}%)`);

  await browser.close();
})();
