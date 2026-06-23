// scripts/_probe_scroll.mjs — ad-hoc 探针: 摸清语雀前端结构
// 目标:
//   1. 9 专题是不是在 aside 内, 还是顶部 tab
//   2. 滚动容器是 aside 内还是 document.documentElement
//   3. doc URL 在哪里 (a[href*="/dhluml/"]) — aside? main? 全局?
//
// 用法: node scripts/_probe_scroll.mjs

import puppeteer from 'puppeteer';
const BASE = 'https://www.yuque.com/aaron-wecc3/dhluml';

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto(BASE, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  const pwd = await page.$('input.ant-input.larkui-input');
  if (pwd) { await pwd.click(); await page.keyboard.type('ghkq', { delay: 60 }); await page.keyboard.press('Enter'); await new Promise(r => setTimeout(r, 5000)); }

  console.log('登录后 URL:', page.url());
  console.log('title:', await page.title());

  // 1. 找 9 专题的位置
  const positions = await page.evaluate(() => {
    const titles = ['专题一', '专题二', '专题三', '专题四', '专题五', '专题六', '专题七', '专题八', '专题九'];
    const out = [];
    document.querySelectorAll('*').forEach(el => {
      const txt = (el.innerText || '').trim();
      if (!titles.some(t => txt.startsWith(t))) return;
      if (txt.length > 80) return;
      // 找最近的 aside/header/nav 容器
      let p = el.parentElement;
      let container = null;
      let depth = 0;
      while (p && depth < 8) {
        if (p.tagName === 'ASIDE' || (p.className && p.className.toString().match(/aside|sidebar|header|nav/i))) {
          container = p.tagName + '.' + p.className.toString().slice(0, 40);
          break;
        }
        p = p.parentElement;
        depth++;
      }
      out.push({ txt: txt.slice(0, 30), tag: el.tagName, container, depth });
    });
    return out.slice(0, 15);
  });
  console.log(`\n=== 1. 9 专题位置 (前 15) ===`);
  positions.forEach(p => console.log(`  [${p.tag}] "${p.txt}" -> ${p.container || '(no aside)'} @depth ${p.depth}`));

  // 2. 滚动容器
  const scrollInfo = await page.evaluate(() => {
    const result = [];
    // 检查 document.documentElement / body
    for (const el of [document.documentElement, document.body]) {
      result.push({
        where: el.tagName,
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
        scrollTop: el.scrollTop,
        overflowY: getComputedStyle(el).overflowY
      });
    }
    // 检查 aside 内所有元素 overflow
    const aside = document.querySelector('[class*="ReaderLayout-module_aside"]') || document.querySelector('aside');
    if (aside) {
      let el = aside;
      let depth = 0;
      while (el && depth < 5) {
        const cs = getComputedStyle(el);
        if (cs.overflowY === 'auto' || cs.overflowY === 'scroll') {
          result.push({
            where: 'aside-deep-' + depth,
            scrollHeight: el.scrollHeight,
            clientHeight: el.clientHeight,
            scrollTop: el.scrollTop,
            overflowY: cs.overflowY
          });
        }
        el = el.firstElementChild;
        depth++;
      }
    }
    return result;
  });
  console.log(`\n=== 2. 滚动容器 ===`);
  scrollInfo.forEach(s => console.log(`  ${s.where}: scrollH=${s.scrollHeight} clientH=${s.clientHeight} top=${s.scrollTop} overflow=${s.overflowY}`));

  // 3. doc URL 分布
  const urlDistribution = await page.evaluate(() => {
    const all = document.querySelectorAll('a[href*="/dhluml/"]');
    const dist = { total: all.length, byContainer: {} };
    for (const a of all) {
      // 找最近带 aside/main/nav/header 的容器
      let p = a.parentElement;
      let key = 'unknown';
      let depth = 0;
      while (p && depth < 10) {
        const cls = (p.className || '').toString();
        if (p.tagName === 'ASIDE' || cls.includes('aside')) { key = 'aside'; break; }
        if (p.tagName === 'MAIN' || cls.includes('main') || cls.includes('content')) { key = 'main'; break; }
        if (p.tagName === 'HEADER' || p.tagName === 'NAV') { key = 'header'; break; }
        p = p.parentElement;
        depth++;
      }
      dist.byContainer[key] = (dist.byContainer[key] || 0) + 1;
    }
    return dist;
  });
  console.log(`\n=== 3. doc URL 分布 ===`);
  console.log(`  总计: ${urlDistribution.total}`);
  for (const [k, v] of Object.entries(urlDistribution.byContainer)) {
    console.log(`  ${k}: ${v}`);
  }

  // 4. 试一次 aside scroll 后, 再数 URL
  const beforeScroll = await page.evaluate(() => document.querySelectorAll('a[href*="/dhluml/"]').length);
  const scrollResult = await page.evaluate(() => {
    const aside = document.querySelector('[class*="ReaderLayout-module_aside"]') || document.querySelector('aside');
    if (!aside) return { scrolled: false };
    let el = aside;
    let depth = 0;
    while (el && depth < 5) {
      const cs = getComputedStyle(el);
      if (cs.overflowY === 'auto' || cs.overflowY === 'scroll') {
        const before = el.scrollTop;
        el.scrollTop = el.scrollHeight;
        return { scrolled: true, depth, delta: el.scrollTop - before, scrollH: el.scrollHeight, scrollT: el.scrollTop };
      }
      el = el.firstElementChild;
      depth++;
    }
    return { scrolled: false, reason: 'no scrollable container in aside' };
  });
  console.log(`\n=== 4. aside scroll 试一次 ===`);
  console.log(`  ${JSON.stringify(scrollResult)}`);
  await new Promise(r => setTimeout(r, 1500));
  const afterScroll = await page.evaluate(() => document.querySelectorAll('a[href*="/dhluml/"]').length);
  console.log(`  滚动前 URL 数: ${beforeScroll}, 滚动后 URL 数: ${afterScroll}, 差 ${afterScroll - beforeScroll}`);

  await page.close();
  await browser.disconnect();
})();
