// 模拟点击 9 专题菜单, 拿到所有展开后的子文档 URL
import puppeteer from 'puppeteer';
const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
const page = await browser.newPage();
await page.goto('https://www.yuque.com/aaron-wecc3/dhluml', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 2000));
const pwd = await page.$('input.ant-input.larkui-input');
if (pwd) { await pwd.click(); await page.keyboard.type('ghkq', { delay: 80 }); await page.keyboard.press('Enter'); await new Promise(r => setTimeout(r, 5000)); }

// 找 9 专题菜单的可点击元素 (按文字"专题一"等定位)
const topics = ['专题一', '专题二', '专题三', '专题四', '专题五', '专题六', '专题七', '专题八', '专题九'];
const allDocLinks = new Set();

for (const t of topics) {
  // 找菜单项并点击展开
  const before = allDocLinks.size;
  const clicked = await page.evaluate((topic) => {
    // 找含此文字的可点击元素
    const cands = Array.from(document.querySelectorAll('*'))
      .filter(el => {
        const txt = (el.innerText || '').trim();
        if (!txt.startsWith(topic)) return false;
        if (txt.length > 100) return false;
        const tag = el.tagName;
        // a / div / span / [role]
        return ['A', 'DIV', 'SPAN', 'LI'].includes(tag);
      });
    if (cands.length === 0) return { found: 0, clicked: 0 };
    let clicked = 0;
    for (const c of cands) {
      try {
        c.click();
        clicked++;
      } catch {}
    }
    return { found: cands.length, clicked };
  }, t);
  await new Promise(r => setTimeout(r, 2000)); // 等展开

  // 抓取当前所有 dhluml 文档链接
  const newLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a'))
      .filter(a => a.href && a.href.includes('/dhluml/'))
      .map(a => a.href)
      .filter(h => h.split('/').length > 4);
  });
  for (const l of newLinks) allDocLinks.add(l);

  console.log(`${t}: clicked=${clicked.clicked}, before=${before}, after=${allDocLinks.size}`);
}

console.log(`\n累计唯一 doc URL: ${allDocLinks.size}`);
console.log('前 10 个:');
[...allDocLinks].slice(0, 10).forEach(u => console.log(`  ${u}`));

await page.close();
await browser.disconnect();
