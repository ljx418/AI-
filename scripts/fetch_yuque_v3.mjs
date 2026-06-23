// scripts/fetch_yuque_v3.mjs — 主 agent 真实验收版 (2026-06-23)
// 策略: 登录 + 滚 documentElement 10 轮 + 访问 9 专题页
// 已知: 9 专题在 main content (不在 aside), 滚 documentElement 有效 (19→38)
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE = 'https://www.yuque.com/aaron-wecc3/dhluml';
const OUT_DIR = path.join(process.cwd(), 'docs', 'yuque_raw');
const OUT_FILE = path.join(OUT_DIR, 'yuque_urls.json');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function isDocHref(href) {
  if (!href || !href.includes('/dhluml/')) return false;
  if (href.includes('/books/')) return false;
  const slug = href.split('?')[0].split('/').pop();
  if (!slug || slug.length < 14 || slug.length > 22) return false;
  if (!/^[a-z0-9]+$/.test(slug)) return false;
  return true;
}

(async () => {
  console.log('🔌 连接 Chrome CDP 9222...');
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  page.setDefaultTimeout(30000);

  // === 1. 登录 + 首页 ===
  console.log('🌐 访问语雀首页...');
  await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(2000);
  console.log('   URL:', page.url());
  console.log('   title:', await page.title());

  // 检测密码框
  const hasPwd = await page.$('input.ant-input.larkui-input, input[class*="ant-input"]');
  if (hasPwd) {
    const pwd = process.env.YUQUE_PASSWORD;
    if (!pwd) throw new Error('YUQUE_PASSWORD env required');
    console.log(`🔐 检测到密码框, 输入密码 (env YUQUE_PASSWORD)...`);
    await hasPwd.click();
    await page.keyboard.type(pwd, { delay: 80 });
    await page.keyboard.press('Enter');
    await sleep(5000);
    console.log('   登录后 URL:', page.url());
    console.log('   登录后 title:', await page.title());
  } else {
    console.log('   无密码框, 可能已登录或免密');
  }

  const allUrls = new Set();

  // === 2. 滚 documentElement 收集 URL (主策略) ===
  console.log('\n📜 滚动 documentElement 收集 URL...');
  for (let round = 0; round < 15; round++) {
    const newUrls = await page.evaluate(() => {
      const out = new Set();
      document.querySelectorAll('a').forEach(a => {
        const href = a.href ? a.href.split('?')[0] : '';
        if (href.includes('/dhluml/') && !href.includes('/books/')) {
          const slug = href.split('/').pop();
          if (slug.length >= 14 && slug.length <= 22 && /^[a-z0-9]+$/.test(slug)) {
            out.add(href);
          }
        }
      });
      return [...out];
    });
    newUrls.forEach(u => allUrls.add(u));

    // 滚到底
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await sleep(1000);
    console.log(`   轮 ${round + 1}: 累计 ${allUrls.size} URL`);
  }

  // === 3. 找 9 专题 slug, 逐个访问 ===
  console.log('\n🌲 找 9 专题 slug...');
  const topicSlugs = await page.evaluate(() => {
    const main = document.querySelector('main') || document.body;
    const out = new Set();
    main.querySelectorAll('a').forEach(a => {
      const text = (a.textContent || '').trim();
      const href = a.href ? a.href.split('?')[0] : '';
      if (text.match(/^专题[一二三四五六七八九]/) && href.includes('/dhluml/')) {
        const slug = href.split('/').pop();
        // 排除共用索引页 foho2nsutnn37gw3 (19 链接的) 和 snoxhrutgoybigeg (1 链接的)
        if (slug !== 'foho2nsutnn37gw3' && slug !== 'snoxhrutgoybigeg' && slug.length >= 10) {
          out.add(slug);
        }
      }
    });
    return [...out];
  });
  console.log(`   找到 ${topicSlugs.length} 个专题 slug:`, topicSlugs.slice(0, 10).join(', '));

  // === 4. 访问每个专题页, 收集子 doc URL ===
  console.log('\n📚 访问 9 专题页...');
  for (const slug of topicSlugs) {
    const url = `${BASE}/${slug}`;
    try {
      console.log(`   → ${slug} ...`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await sleep(1000);
      // 滚专题页内容
      for (let r = 0; r < 5; r++) {
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await sleep(800);
      }
      const topicUrls = await page.evaluate(() => {
        const out = new Set();
        document.querySelectorAll('a').forEach(a => {
          const href = a.href ? a.href.split('?')[0] : '';
          if (href.includes('/dhluml/') && !href.includes('/books/')) {
            const slug2 = href.split('/').pop();
            if (slug2.length >= 14 && slug2.length <= 22 && /^[a-z0-9]+$/.test(slug2)) {
              out.add(href);
            }
          }
        });
        return [...out];
      });
      topicUrls.forEach(u => allUrls.add(u));
      console.log(`     累计: ${allUrls.size}`);
    } catch (e) {
      console.log(`     ✗ 失败: ${e.message.slice(0, 80)}`);
    }
  }

  // === 5. 落盘 ===
  const urlArr = [...allUrls].sort();
  fs.writeFileSync(OUT_FILE, JSON.stringify(urlArr, null, 2), 'utf-8');
  console.log(`\n📚 共 ${urlArr.length} 个 doc URL`);
  console.log(`   URL 清单: ${OUT_FILE}`);
  console.log(`   目标 287, 偏差: ${Math.round((urlArr.length - 287) / 287 * 100)}%`);

  await browser.close();
})();
