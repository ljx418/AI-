// 用 body 文本找 9 专题 URL
import puppeteer from 'puppeteer';
const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
const page = await browser.newPage();
await page.goto('https://www.yuque.com/aaron-wecc3/dhluml', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 2000));
const pwd = await page.$('input.ant-input.larkui-input');
if (pwd) { await pwd.click(); await page.keyboard.type('ghkq', { delay: 60 }); await page.keyboard.press('Enter'); await new Promise(r => setTimeout(r, 5000)); }

// 从 body 文本中找 9 专题 URL
const topicMap = await page.evaluate(() => {
  const titles = ['专题一', '专题二', '专题三', '专题四', '专题五', '专题六', '专题七', '专题八', '专题九'];
  const result = {};
  // 遍历所有 a 元素, 找 innerText 含专题关键词的
  document.querySelectorAll('a').forEach(a => {
    const txt = (a.innerText || '').trim();
    for (const t of titles) {
      if (txt.startsWith(t) && txt.length < 80) {
        if (!result[t]) result[t] = { text: txt, href: a.href };
      }
    }
  });
  return result;
});
console.log('9 专题 URL 映射:');
for (const [k, v] of Object.entries(topicMap)) {
  console.log(`  ${k}: ${v ? v.href : '(未找到)'} "${v?.text}"`);
}

await page.close();
await browser.disconnect();
