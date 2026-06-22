// 访问专题页, 看正文里有多少 doc 链接
import puppeteer from 'puppeteer';
const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
const page = await browser.newPage();
await page.goto('https://www.yuque.com/aaron-wecc3/dhluml', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 2000));
const pwd = await page.$('input.ant-input.larkui-input');
if (pwd) { await pwd.click(); await page.keyboard.type('ghkq', { delay: 60 }); await page.keyboard.press('Enter'); await new Promise(r => setTimeout(r, 5000)); }

// 访问"专题七--项目方案篇"
await page.goto('https://www.yuque.com/aaron-wecc3/dhluml/snoxhrutgoybigeg', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 3000));
console.log('专题七 page title:', await page.title());

// 数正文 doc 链接 (slug 长度 14-22)
const info = await page.evaluate(() => {
  const all = Array.from(document.querySelectorAll('a'))
    .filter(a => a.href && a.href.includes('/dhluml/'));
  return all.map(a => {
    const href = a.href.split('?')[0];
    const slug = href.split('/').pop();
    return { slug: slug.slice(0, 25), text: (a.innerText || '').trim().slice(0, 40), href };
  });
});
console.log(`\n专题七所有链接: ${info.length} 个`);
info.forEach((x, i) => console.log(`  [${i}] "${x.text}" -> ${x.slug}`));

// 看正文选择器
const body = await page.evaluate(() => {
  const b = document.querySelector('.ne-viewer-body') || document.querySelector('article');
  return b ? { len: b.innerText.length, sample: b.innerText.slice(0, 500) } : null;
});
console.log(`\n专题七正文: ${body ? body.len : 0}字`);
if (body) console.log(`前 500: "${body.sample}"`);

await page.close();
await browser.disconnect();
