// 调试: 9 专题的真实 DOM 位置, 看有几份 sidebar
import puppeteer from 'puppeteer';
const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
const page = await browser.newPage();
await page.goto('https://www.yuque.com/aaron-wecc3/dhluml', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 2000));
const pwd = await page.$('input.ant-input.larkui-input');
if (pwd) { await pwd.click(); await page.keyboard.type('ghkq', { delay: 60 }); await page.keyboard.press('Enter'); await new Promise(r => setTimeout(r, 5000)); }

// 找 9 专题的精确位置 + 是否在侧边栏内
const info = await page.evaluate(() => {
  const items = Array.from(document.querySelectorAll('[class*="catalogTreeItem-module_CatalogItem"]'));
  return items.map((it, i) => {
    const txt = (it.innerText || '').trim();
    if (!/^专题[一二三四五六七八九]/.test(txt)) return null;
    // 找最近的 sidebar 容器
    let p = it.parentElement;
    let depth = 0;
    while (p && depth < 10) {
      if (p.className && p.className.toString().includes('catalog')) break;
      p = p.parentElement;
      depth++;
    }
    const collapseIcon = it.querySelector('[class*="collapseIconWrapper"]');
    return {
      idx: i,
      txt: txt.slice(0, 30),
      depth,
      parentCls: p ? p.className.toString().slice(0, 60) : null,
      collapseCls: collapseIcon ? collapseIcon.className.slice(0, 80) : null,
      hasCollapsed: collapseIcon ? collapseIcon.className.includes('collapsed') : null
    };
  }).filter(Boolean);
});
console.log(`9 专题数: ${info.length}`);
info.forEach(x => console.log(JSON.stringify(x)));

// 找所有 sidebar (看有几份)
const sidebars = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('[class*="sidebar"], [class*="catalog"], [class*="tree"]'))
    .slice(0, 10)
    .map(el => ({ tag: el.tagName, cls: el.className.toString().slice(0, 80), len: el.innerText.length }));
});
console.log(`\n侧边栏候选: ${sidebars.length}`);
sidebars.forEach(s => console.log(JSON.stringify(s)));

await page.close();
await browser.disconnect();
