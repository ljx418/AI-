// 看侧边栏"AI大模型"分组展开, 找 287 文档
import puppeteer from 'puppeteer';
const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
const page = await browser.newPage();
await page.goto('https://www.yuque.com/aaron-wecc3/dhluml', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 2000));
const pwd = await page.$('input.ant-input.larkui-input');
if (pwd) { await pwd.click(); await page.keyboard.type('ghkq', { delay: 60 }); await page.keyboard.press('Enter'); await new Promise(r => setTimeout(r, 5000)); }

// 展开所有 catalog item (不只是 9 专题, 包含"AI大模型"分组)
console.log('展开所有 CatalogItem...');
for (let round = 0; round < 10; round++) {
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
  console.log(`  轮 ${round + 1}: 点击 ${r.clicked} 个`);
  if (r.clicked === 0) break;
  await new Promise(r2 => setTimeout(r2, 1500));
}

// 数所有 slug 14-22 字符的链接
const all = await page.evaluate(() => {
  const out = new Map(); // href -> text
  document.querySelectorAll('a').forEach(a => {
    const href = a.href ? a.href.split('?')[0] : '';
    if (!href.includes('/dhluml/')) return;
    const slug = href.split('/').pop();
    if (slug.length >= 14 && slug.length <= 22 && /^[a-z0-9]+$/.test(slug)) {
      if (!out.has(href)) out.set(href, (a.innerText || '').trim().slice(0, 50));
    }
  });
  return [...out.entries()];
});
console.log(`\n所有 doc URL: ${all.length} 个`);
all.forEach(([href, txt], i) => console.log(`  [${i}] "${txt.split('\n')[0]}" -> ${href.split('/').pop()}`));

await page.close();
await browser.disconnect();
