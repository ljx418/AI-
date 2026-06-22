// 诊断: 访问"AI大模型面试系列"目录页, 看是否有 9 专题入口
import puppeteer from 'puppeteer';
const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
const page = await browser.newPage();
await page.goto('https://www.yuque.com/aaron-wecc3/dhluml', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 2000));
const pwd = await page.$('input.ant-input.larkui-input');
if (pwd) { await pwd.click(); await page.keyboard.type('ghkq', { delay: 80 }); await page.keyboard.press('Enter'); await new Promise(r => setTimeout(r, 5000)); }

// 进入"AI大模型面试系列"
await page.goto('https://www.yuque.com/aaron-wecc3/dhluml/foho2nsutnn37gw3', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 3000));
console.log('目录页 title:', await page.title());

// 拿所有链接（不只是含 /dhluml/ 的）
const allLinks = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('a'))
    .filter(a => a.href && a.href.includes('yuque.com/aaron-wecc3/dhluml'))
    .map(a => ({ text: (a.innerText || '').trim().slice(0, 80), href: a.href }))
    .filter(l => l.text);
});
console.log(`\n所有 dhluml 链接 (${allLinks.length}):`);
allLinks.forEach((l, i) => console.log(`  [${i}] "${l.text}" -> ${l.href.replace('https://www.yuque.com/aaron-wecc3/dhluml', '/dhluml')}`));

// 也看 body 文本
const bodyText = await page.evaluate(() => document.body.innerText);
console.log(`\nbody 总长: ${bodyText.length}`);
console.log(`body 全文（前 4000 字符）:\n${bodyText.slice(0, 4000)}`);

await page.close();
await browser.disconnect();
