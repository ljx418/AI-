// scripts/fetch_yuque_v7.mjs — 换策略: --single-process Chrome (避免 zygote fork 死)
// 关键: 4 专题页 (foho/snox/gq5/sozn) 内可能有嵌套子目录, 递归访问
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE = 'https://www.yuque.com/aaron-wecc3/dhluml';
const OUT_FILE = path.join(process.cwd(), 'docs', 'yuque_raw', 'yuque_urls.json');
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  // --single-process 避免 zygote fork
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    args: [
      '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
      '--single-process', '--no-zygote',
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  page.setDefaultTimeout(30000);

  await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(2000);
  const hasPwd = await page.$('input.ant-input.larkui-input, input[class*="ant-input"]');
  if (hasPwd) {
    const pwd = process.env.YUQUE_PASSWORD;
    if (!pwd) throw new Error('YUQUE_PASSWORD env required');
    await hasPwd.click();
    await page.keyboard.type(pwd, { delay: 80 });
    await page.keyboard.press('Enter');
    await sleep(5000);
  }
  console.log('登录后 title:', await page.title());

  const all = new Set();
  const visited = new Set();

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

  async function visit(slug, depth) {
    if (visited.has(slug) || depth > 2) return;
    visited.add(slug);
    try {
      await page.goto(`${BASE}/${slug}`, { waitUntil: 'networkidle2', timeout: 30000 });
      await sleep(1500);
      for (let r = 0; r < 10; r++) {
        (await collectUrls()).forEach(u => all.add(u));
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await sleep(800);
      }
      console.log(`  [d${depth}] ${slug}: 累计 ${all.size}`);

      // 找嵌套子目录 (跟当前 slug 不一样的子 slug)
      if (depth < 2) {
        const subSlugs = await page.evaluate(() => {
          const out = new Set();
          document.querySelectorAll('a').forEach(a => {
            if (a.href && a.href.includes('/dhluml/')) {
              const href = a.href.split('?')[0];
              const slug = href.split('/').pop();
              // 找长度 14-22 字符的 slug (可能是子目录)
              if (slug.length >= 14 && slug.length <= 22 && /^[a-z0-9]+$/.test(slug) && !href.includes('/books/')) {
                out.add(slug);
              }
            }
          });
          return [...out];
        });
        // 递归访问每个子 slug
        for (const sub of subSlugs) {
          if (!visited.has(sub)) {
            await visit(sub, depth + 1);
          }
        }
      }
    } catch (e) {
      console.log(`  [d${depth}] ${slug}: ✗ ${e.message.slice(0, 50)}`);
    }
  }

  // 首页滚 20 轮
  console.log('📜 首页滚 20 轮...');
  for (let i = 0; i < 20; i++) {
    (await collectUrls()).forEach(u => all.add(u));
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await sleep(800);
    if (i % 5 === 0) console.log(`   轮 ${i+1}: ${all.size}`);
  }
  console.log(`   首页累计: ${all.size}`);

  // 访问 4 已知专题页, 深度 2 递归
  for (const slug of ['foho2nsutnn37gw3', 'snoxhrutgoybigeg', 'gq5n7l8nlgx4m08r', 'soznzt09nuzptr5z']) {
    await visit(slug, 0);
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify([...all].sort(), null, 2));
  console.log(`\n📚 v7 共 ${all.size} URL (目标 287, 偏差 ${Math.round((all.size-287)/287*100)}%)`);

  await browser.close();
})();
