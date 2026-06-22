// 诊断: 列出语雀密码页所有 input 元素
import puppeteer from 'puppeteer';
const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
const page = await browser.newPage();
await page.goto('https://www.yuque.com/aaron-wecc3/dhluml', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 2000));

const inputs = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('input')).map(i => ({
    type: i.type,
    name: i.name,
    placeholder: i.placeholder,
    className: i.className,
    id: i.id
  }));
});
console.log('所有 input:');
console.log(JSON.stringify(inputs, null, 2));

// 也看 password 关键词的 elements
const all = await page.evaluate(() => {
  const arr = [];
  document.querySelectorAll('*').forEach(el => {
    const t = (el.innerText || '').trim();
    if (t.length < 50 && (t.includes('密码') || t.toLowerCase().includes('password'))) {
      arr.push({ tag: el.tagName, class: el.className, text: t.slice(0, 80) });
    }
  });
  return arr.slice(0, 20);
});
console.log('\n含"密码"的元素:');
console.log(JSON.stringify(all, null, 2));

// 也 dump 整个 body 的部分 html 看结构
const html = await page.evaluate(() => document.body.innerHTML.slice(0, 5000));
console.log('\nbody html 前 5000 字符:');
console.log(html);

await page.close();
await browser.disconnect();
