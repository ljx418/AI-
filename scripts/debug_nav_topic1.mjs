// 试点击专题一, 触发导航, 看 URL 变化
import puppeteer from 'puppeteer';
const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
const page = await browser.newPage();
await page.goto('https://www.yuque.com/aaron-wecc3/dhluml', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 2000));
const pwd = await page.$('input.ant-input.larkui-input');
if (pwd) { await pwd.click(); await page.keyboard.type('ghkq', { delay: 60 }); await page.keyboard.press('Enter'); await new Promise(r => setTimeout(r, 5000)); }

console.log('点击前 URL:', page.url());

// 点击"专题一--基础篇"
const r = await page.evaluate(() => {
  const aside = document.querySelector('[class*="ReaderLayout-module_aside"]');
  if (!aside) return { ok: false, reason: 'no aside' };
  const items = Array.from(aside.querySelectorAll('[class*="catalogTreeItem-module_CatalogItem"]'));
  for (const item of items) {
    const txt = (item.innerText || '').trim();
    if (txt.startsWith('专题一') && txt.length < 80) {
      const tw = item.querySelector('[class*="titleWrapper"]');
      if (tw) {
        tw.click();
        return { ok: true, txt, html: tw.outerHTML.slice(0, 300) };
      }
    }
  }
  return { ok: false, reason: '专题一 not found', items: items.length };
});
console.log('点击结果:', JSON.stringify(r, null, 2));

await new Promise(r => setTimeout(r, 3000));
console.log('点击后 URL:', page.url());
console.log('点击后 title:', await page.title());

// 看 URL 变化后, 9 专题下子 doc 链接
const sub = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('a'))
    .filter(a => a.href && a.href.includes('/dhluml/'))
    .filter(a => {
      const slug = a.href.split('/').pop().split('?')[0];
      return slug.length >= 14 && slug.length <= 22 && /^[a-z0-9]+$/.test(slug);
    })
    .map(a => ({ text: (a.innerText || '').trim().slice(0, 40), href: a.href }));
});
console.log(`\n专题一下的子 doc: ${sub.length} 个`);
sub.forEach(s => console.log(`  "${s.text}" -> ${s.href.split('/').pop()}`));

// 也看 body innerText
const bodyText = await page.evaluate(() => document.body.innerText);
console.log(`\nbody 长度: ${bodyText.length}`);
console.log(`前 500: ${bodyText.slice(0, 500)}`);

await page.close();
await browser.disconnect();
