// 完整 9 专题展开 + 收集所有 doc URL
// 策略: 第一轮先点"专题一"让 9 专题标题消失, 看实际 DOM 结构
//       然后用 innerText 扫描所有 a 元素找 287 文档

import puppeteer from 'puppeteer';
const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
const page = await browser.newPage();
await page.goto('https://www.yuque.com/aaron-wecc3/dhluml', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 2000));
const pwd = await page.$('input.ant-input.larkui-input');
if (pwd) { await pwd.click(); await page.keyboard.type('ghkq', { delay: 80 }); await page.keyboard.press('Enter'); await new Promise(r => setTimeout(r, 5000)); }

// 第一次先看 9 专题精确 outerHTML 前 200 字符 (在侧边栏中)
const sidebarHTML = await page.evaluate(() => {
  // 找包含"专题一"的最近容器
  const cands = Array.from(document.querySelectorAll('*')).filter(el => (el.innerText || '').startsWith('专题一--基础篇') && el.innerText.length < 100);
  return cands.slice(0, 3).map(el => ({
    tag: el.tagName,
    cls: (el.className || '').toString(),
    parent: el.parentElement ? el.parentElement.tagName + '.' + (el.parentElement.className || '').toString().slice(0, 40) : null,
    html: el.outerHTML.slice(0, 500)
  }));
});
console.log('"专题一--基础篇" 元素:');
sidebarHTML.forEach(h => console.log('  ', JSON.stringify(h, null, 2)));

// 现在展开所有 9 专题: 在 body 里搜"专题X"开头, 找点击目标
// 关键洞察: 语雀的"专题目录"可能是 React 组件, 真实点击元素是 parent container
const allTopics = ['专题一', '专题二', '专题三', '专题四', '专题五', '专题六', '专题七', '专题八', '专题九'];
for (const t of allTopics) {
  // 找 span/div 文字等于 t (精确), 然后找它的 a 父元素
  const result = await page.evaluate((topic) => {
    const els = Array.from(document.querySelectorAll('span, div, a'))
      .filter(el => (el.innerText || '').trim() === topic);
    return els.map(el => {
      // 找 a 父元素
      let p = el;
      while (p && p.tagName !== 'A' && p.parentElement) p = p.parentElement;
      return {
        text: (el.innerText || '').trim(),
        tag: el.tagName,
        href: p && p.tagName === 'A' ? p.href : null,
        cls: (el.className || '').toString().slice(0, 40)
      };
    });
  }, t);
  console.log(`\n${t}: 找到 ${result.length} 个精确匹配元素`);
  result.forEach((r, i) => console.log(`  [${i}] ${r.tag} cls="${r.cls}" href=${r.href || 'null'}`));
}

await page.close();
await browser.disconnect();
