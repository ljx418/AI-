// scripts/fetch_yuque_phase2.mjs — 多策略 URL 抓取 (Phase 2)
// 用于 fetch_yuque_urls_only.mjs 仍达不到 200 URL 时跑
//
// 多策略组合:
//   1. 主动导航到 /books/N (1-12) — 语雀 books URL 可能是 1-9 也可能是 1-12
//   2. 已收集的 topic URL 做 BFS — 把每个 URL 都访问一次, 抓 main content 内的新 doc URL
//   3. 强制 IntersectionObserver trigger — 把 aside 内所有未渲染的 catalog item 强制 isIntersecting=true
//   4. 通过键盘 PgDn / End 在 aside 内反复滚, 触发虚拟列表加载

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE = 'https://www.yuque.com/aaron-wecc3/dhluml';
const OUT_DIR = path.join(process.cwd(), 'docs', 'yuque_raw');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function isDocHref(href) {
  if (!href || !href.includes('/dhluml/')) return false;
  if (href.includes('/books/') || href.includes('/dashboard') || href.includes('/settings')) return false;
  const slug = href.split('?')[0].split('/').pop();
  if (!slug || slug.length < 14 || slug.length > 22) return false;
  return /^[a-z0-9]+$/.test(slug);
}

(async () => {
  console.log('🔌 连接 Chrome CDP 9222 (Phase 2 多策略)...');
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);
  await page.setViewport({ width: 1440, height: 900 });

  // 加载已有 URL (phase 1 收的)
  const urlFile = path.join(OUT_DIR, 'yuque_urls.json');
  let allUrls = new Set();
  if (fs.existsSync(urlFile)) {
    try {
      const existing = JSON.parse(fs.readFileSync(urlFile, 'utf-8'));
      for (const u of existing) allUrls.add(u);
      console.log(`📂 加载已有 ${allUrls.size} 个 URL`);
    } catch {}
  }

  try {
    // 登录
    await page.goto(BASE, { waitUntil: 'networkidle2' });
    await sleep(2000);
    const pwd = await page.$('input.ant-input.larkui-input');
    if (pwd) { await pwd.click(); await page.keyboard.type('ghkq', { delay: 60 }); await page.keyboard.press('Enter'); await sleep(5000); }

    // ===== 策略 1: BFS 遍历已收集的 URL =====
    // 9 专题页本身是 doc, 它们的 main content 内有子 doc 链接
    console.log('\n🔄 策略 1: BFS 遍历已收集 URL, 抓子 doc...');
    const initialUrls = [...allUrls];
    const visited = new Set();
    for (const u of initialUrls) visited.add(u);
    const queue = [...initialUrls];

    let bfsRounds = 0;
    while (queue.length > 0 && bfsRounds < 50) {
      const u = queue.shift();
      bfsRounds++;
      try {
        await page.goto(u, { waitUntil: 'networkidle2', timeout: 20000 });
        await sleep(1500);
        const newLinks = await page.evaluate(() => {
          const out = new Set();
          document.querySelectorAll('a').forEach(a => {
            const href = a.href ? a.href.split('?')[0] : '';
            if (!href.includes('/dhluml/')) return;
            if (href.includes('/books/') || href.includes('/dashboard') || href.includes('/settings')) return;
            const slug = href.split('/').pop();
            if (slug.length >= 14 && slug.length <= 22 && /^[a-z0-9]+$/.test(slug)) {
              out.add(href);
            }
          });
          return [...out];
        });
        let added = 0;
        for (const l of newLinks) {
          if (!visited.has(l)) {
            visited.add(l);
            allUrls.add(l);
            queue.push(l);
            added++;
          }
        }
        if (added > 0 || bfsRounds % 10 === 0) {
          console.log(`   [BFS ${bfsRounds}] ${u.split('/').pop()}: +${added} (累计 ${allUrls.size}, 队列 ${queue.length})`);
        }
      } catch (e) {
        // 静默失败
      }
    }

    // ===== 策略 2: /books/N 全范围扫 (1-15) =====
    console.log('\n📚 策略 2: /books/1..15 范围扫...');
    for (let n = 1; n <= 15; n++) {
      const u = `${BASE}/books/${n}`;
      try {
        await page.goto(u, { waitUntil: 'networkidle2', timeout: 15000 });
        await sleep(1500);
        const links = await page.evaluate(() => {
          const out = new Set();
          document.querySelectorAll('a').forEach(a => {
            const href = a.href ? a.href.split('?')[0] : '';
            if (!href.includes('/dhluml/')) return;
            if (href.includes('/books/') || href.includes('/dashboard') || href.includes('/settings')) return;
            const slug = href.split('/').pop();
            if (slug.length >= 14 && slug.length <= 22 && /^[a-z0-9]+$/.test(slug)) {
              out.add(href);
            }
          });
          return [...out];
        });
        const before = allUrls.size;
        for (const x of links) allUrls.add(x);
        console.log(`   /books/${n}: ${links.length} 个, 新增 ${allUrls.size - before} (累计 ${allUrls.size})`);
      } catch (e) {
        console.log(`   /books/${n}: ❌ ${e.message.slice(0, 50)}`);
      }
    }

    // ===== 策略 3: 强制 IntersectionObserver + 反复 End 键 =====
    console.log('\n⚡ 策略 3: 强制 IO + 反复 End 键...');
    try {
      await page.goto(BASE, { waitUntil: 'networkidle2' });
      await sleep(2000);

      // 用键盘 End 在 aside 内反复滚
      for (let round = 0; round < 30; round++) {
        await page.evaluate(() => {
          // 找 aside 内可滚动元素, 滚到底
          const aside = document.querySelector('[class*="ReaderLayout-module_aside"]') || document.querySelector('aside');
          if (!aside) return;
          let el = aside;
          for (let i = 0; i < 5; i++) {
            const cs = el && getComputedStyle(el);
            if (cs && (cs.overflowY === 'auto' || cs.overflowY === 'scroll')) break;
            el = el && el.firstElementChild;
          }
          if (el) el.scrollTop = el.scrollHeight;
          // 也滚 document
          document.documentElement.scrollTop = document.documentElement.scrollHeight;
          document.body.scrollTop = document.body.scrollHeight;
        });
        // 模拟按 End 键 50 次
        await page.focus('[class*="ReaderLayout-module_aside"]').catch(() => {});
        for (let i = 0; i < 5; i++) {
          await page.keyboard.press('End').catch(() => {});
          await sleep(50);
        }
        await sleep(800);

        // 收集
        const r = await page.evaluate(() => {
          const out = new Set();
          document.querySelectorAll('a').forEach(a => {
            const href = a.href ? a.href.split('?')[0] : '';
            if (!href.includes('/dhluml/')) return;
            if (href.includes('/books/')) return;
            const slug = href.split('/').pop();
            if (slug.length >= 14 && slug.length <= 22 && /^[a-z0-9]+$/.test(slug)) {
              out.add(href);
            }
          });
          return [...out];
        });
        const before = allUrls.size;
        for (const x of r) allUrls.add(x);
        if (round % 5 === 0 || allUrls.size > before) {
          console.log(`   轮 ${round + 1}: 找到 ${r.length}, 新增 ${allUrls.size - before} (累计 ${allUrls.size})`);
        }
      }
    } catch (e) {
      console.log(`   ❌ ${e.message.slice(0, 60)}`);
    }

    // 落盘
    const urlArr = [...allUrls].sort();
    fs.writeFileSync(urlFile, JSON.stringify(urlArr, null, 2), 'utf-8');
    console.log(`\n📚 Phase 2 完成: 共 ${urlArr.length} 个 doc URL`);
    console.log(`   目标 287, 偏差 ${((287 - urlArr.length) / 287 * 100).toFixed(1)}%`);
  } catch (e) {
    console.error('❌ 顶层错误:', e.message);
  } finally {
    await page.close();
  }
})();
