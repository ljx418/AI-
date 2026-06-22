// 模拟点击 9 专题菜单, 抓每个专题下的子文档链接
import puppeteer from 'puppeteer';
const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
const page = await browser.newPage();

await page.goto('https://www.yuque.com/aaron-wecc3/dhluml', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 2000));
const pwd = await page.$('input.ant-input.larkui-input');
if (pwd) { await pwd.click(); await page.keyboard.type('ghkq', { delay: 80 }); await page.keyboard.press('Enter'); await new Promise(r => setTimeout(r, 5000)); }

// 找 9 专题菜单项 (在 body 文本中有"专题一--基础篇"等)
const topicHrefs = await page.evaluate(() => {
  const titles = ['专题一', '专题二', '专题三', '专题四', '专题五', '专题六', '专题七', '专题八', '专题九'];
  const out = [];
  document.querySelectorAll('a, [role="treeitem"], [class*="tree"] a, [class*="catalog"] a').forEach(el => {
    const t = (el.innerText || '').trim();
    for (const k of titles) {
      if (t.startsWith(k)) {
        out.push({ title: t, href: el.href || 'no-href' });
        break;
      }
    }
  });
  // 去重
  const seen = new Set();
  return out.filter(o => { if (seen.has(o.href)) return false; seen.add(o.href); return true; });
});
console.log('9 专题 URL:');
topicHrefs.forEach(t => console.log(`  ${t.title} -> ${t.href}`));

// 也试一下 "AI大模型面试系列" 目录页里 9 专题的 href
console.log('\n--- 直接试 9 专题 URL 模式 ---');
const guesses = [
  'https://www.yuque.com/aaron-wecc3/dhluml/books/1',  // 基础
  'https://www.yuque.com/aaron-wecc3/dhluml/books/2',  // RAG
];
for (const g of guesses) {
  try {
    const r = await fetch(g, { redirect: 'follow' });
    console.log(`  ${g} -> ${r.url} (${r.status})`);
  } catch (e) {
    console.log(`  ${g} -> ERR: ${e.message}`);
  }
}

await page.close();
await browser.disconnect();
