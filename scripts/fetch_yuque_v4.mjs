// scripts/fetch_yuque_v4.mjs — 单 page session (避免 Chrome 死), 主 agent 验收
// 策略: 登录 → 滚首页 20 轮 + 9 专题 slug (4 个已知: foho + snox + gq5 + sozn) 逐个访问
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE = 'https://www.yuque.com/aaron-wecc3/dhluml';
const OUT_FILE = path.join(process.cwd(), 'docs', 'yuque_raw', 'yuque_urls.json');
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function isDocHref(href) {
  if (!href || !href.includes('/dhluml/') || href.includes('/books/')) return false;
  const slug = href.split('?')[0].split('/').pop();
  return slug && slug.length >= 14 && slug.length <= 22 && /^[a-z0-9]+$/.test(slug);
}

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
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
  
  // 1. 首页滚 20 轮
  console.log('📜 首页滚 20 轮...');
  for (let i = 0; i < 20; i++) {
    const urls = await page.evaluate(() => {
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
    urls.forEach(u => all.add(u));
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await sleep(800);
    if (i % 5 === 0) console.log(`   轮 ${i+1}: ${all.size}`);
  }
  console.log(`   首页累计: ${all.size}`);
  
  // 2. 9 专题共用入口 foho2nsutnn37gw3
  for (const slug of ['foho2nsutnn37gw3', 'snoxhrutgoybigeg', 'gq5n7l8nlgx4m08r', 'soznzt09nuzptr5z']) {
    try {
      await page.goto(`${BASE}/${slug}`, { waitUntil: 'networkidle2', timeout: 30000 });
      await sleep(1500);
      for (let r = 0; r < 5; r++) {
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await sleep(800);
      }
      const u = await page.evaluate(() => {
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
      u.forEach(x => all.add(x));
      console.log(`   ${slug}: +${u.length} (累计 ${all.size})`);
    } catch (e) {
      console.log(`   ${slug}: ✗ ${e.message.slice(0, 60)}`);
    }
  }
  
  fs.writeFileSync(OUT_FILE, JSON.stringify([...all].sort(), null, 2));
  console.log(`\n📚 v4 共 ${all.size} URL (目标 287, 偏差 ${Math.round((all.size-287)/287*100)}%)`);
  
  await browser.close();
})();
