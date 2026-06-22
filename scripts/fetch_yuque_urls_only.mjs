// scripts/fetch_yuque_urls_only.mjs — 滚动 lazy load, 拿全所有 doc URL
// 策略:
//   1. 登录 + 展开 9 专题侧边栏
//   2. 在 aside 容器中模拟滚动, 触发 IntersectionObserver lazy load
//   3. 每轮滚动后收集新出现的 doc URL
//   4. 直到连续 N 轮无新 URL, 停止
//   5. 落盘 yuque_urls.json
//
// 抗反爬: 每轮 sleep 800ms, 限制最大 50 轮

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE = 'https://www.yuque.com/aaron-wecc3/dhluml';
const OUT_DIR = path.join(process.cwd(), 'docs', 'yuque_raw');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  console.log('🔌 连接 Chrome CDP 9222...');
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);

  try {
    // 登录
    await page.goto(BASE, { waitUntil: 'networkidle2' });
    await sleep(2000);
    const pwd = await page.$('input.ant-input.larkui-input');
    if (pwd) { await pwd.click(); await page.keyboard.type('ghkq', { delay: 60 }); await page.keyboard.press('Enter'); await sleep(5000); }
    console.log('🔐 登录后:', await page.title());

    // 展开 9 专题 (多轮)
    console.log('🌲 展开 9 专题...');
    for (let round = 0; round < 5; round++) {
      const r = await page.evaluate(() => {
        const aside = document.querySelector('[class*="ReaderLayout-module_aside"]');
        if (!aside) return { clicked: 0 };
        const items = Array.from(aside.querySelectorAll('[class*="catalogTreeItem-module_CatalogItem"]'));
        let clicked = 0;
        for (const item of items) {
          const ci = item.querySelector('[class*="collapseIconWrapper"]');
          if (ci && ci.className.includes('collapsed')) {
            try {
              const tw = item.querySelector('[class*="titleWrapper"]') || item;
              tw.click();
              clicked++;
            } catch {}
          }
        }
        return { clicked };
      });
      console.log(`   轮 ${round + 1}: 点击 ${r.clicked}`);
      if (r.clicked === 0) break;
      await sleep(2000);
    }

    // 滚动触发 lazy load
    console.log('\n📜 滚动加载 lazy doc...');
    let prevCount = 0;
    let stableRounds = 0;
    const allUrls = new Set();

    for (let round = 0; round < 50; round++) {
      // 找 aside 内的滚动容器
      const scrollResult = await page.evaluate(() => {
        const aside = document.querySelector('[class*="ReaderLayout-module_aside"]');
        if (!aside) return { scrolled: 0, found: 0, scrollHeight: 0 };

        // 找内部可滚动 div (通常 catalog 区域)
        let scrollEl = aside;
        // 向上找 5 层内, 找 overflow-y=auto/scroll
        for (let i = 0; i < 5; i++) {
          const cs = scrollEl && getComputedStyle(scrollEl);
          if (cs && (cs.overflowY === 'auto' || cs.overflowY === 'scroll')) break;
          scrollEl = scrollEl && scrollEl.firstElementChild;
        }

        if (!scrollEl) return { scrolled: 0, found: 0, scrollHeight: 0 };

        const before = scrollEl.scrollTop;
        scrollEl.scrollTop = scrollEl.scrollHeight;
        const after = scrollEl.scrollTop;
        return {
          scrolled: after - before,
          found: 1,
          scrollHeight: scrollEl.scrollHeight,
          scrollTop: after
        };
      });
      await sleep(1000);

      // 收集当前所有 doc URL
      const newUrls = await page.evaluate(() => {
        const out = new Set();
        document.querySelectorAll('a').forEach(a => {
          const href = a.href ? a.href.split('?')[0] : '';
          if (!href.includes('/dhluml/')) return;
          const slug = href.split('/').pop();
          if (slug.length >= 14 && slug.length <= 22 && /^[a-z0-9]+$/.test(slug)) {
            out.add(href);
          }
        });
        return [...out];
      });
      for (const u of newUrls) allUrls.add(u);

      console.log(`   轮 ${round + 1}: 滚动 ${scrollResult.scrolled}px, URL 累计 ${allUrls.size}`);
      if (allUrls.size === prevCount) {
        stableRounds++;
        if (stableRounds >= 3) break;
      } else {
        stableRounds = 0;
      }
      prevCount = allUrls.size;
    }

    // 落盘
    const urlArr = [...allUrls].sort();
    fs.writeFileSync(path.join(OUT_DIR, 'yuque_urls.json'),
      JSON.stringify(urlArr, null, 2), 'utf-8');
    console.log(`\n📚 共 ${urlArr.length} 个 doc URL`);
    console.log(`   URL 清单: ${path.join(OUT_DIR, 'yuque_urls.json')}`);

    // 顺便数一下首页全部 catalog 数量
    const stats = await page.evaluate(() => {
      const aside = document.querySelector('[class*="ReaderLayout-module_aside"]');
      if (!aside) return { items: 0, links: 0 };
      return {
        items: aside.querySelectorAll('[class*="catalogTreeItem-module_CatalogItem"]').length,
        links: aside.querySelectorAll('a').length
      };
    });
    console.log(`   侧边栏 catalog item: ${stats.items}, 链接: ${stats.links}`);
  } catch (e) {
    console.error('❌ 错误:', e.message);
  } finally {
    await page.close();
  }
})();
