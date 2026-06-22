// 找"专题二"等文字的 DOM 元素位置和可点击性
import puppeteer from 'puppeteer';
const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
const page = await browser.newPage();
await page.goto('https://www.yuque.com/aaron-wecc3/dhluml', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 2000));
const pwd = await page.$('input.ant-input.larkui-input');
if (pwd) { await pwd.click(); await page.keyboard.type('ghkq', { delay: 80 }); await page.keyboard.press('Enter'); await new Promise(r => setTimeout(r, 5000)); }

// 先点"专题一"展开, 然后找所有 9 专题
await page.evaluate(() => {
  document.querySelectorAll('*').forEach(el => {
    if ((el.innerText || '').trim().startsWith('专题一') && el.innerText.length < 100) el.click();
  });
});
await new Promise(r => setTimeout(r, 2000));

// 现在找所有 9 专题的精确位置
const all9 = await page.evaluate(() => {
  const out = [];
  const topics = ['专题一', '专题二', '专题三', '专题四', '专题五', '专题六', '专题七', '专题八', '专题九'];
  for (const t of topics) {
    const cands = [];
    document.querySelectorAll('*').forEach(el => {
      const txt = (el.innerText || '').trim();
      if (txt === t) {
        const r = el.getBoundingClientRect();
        cands.push({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 60), x: r.x, y: r.y, w: r.width, h: r.height });
      }
    });
    out.push({ topic: t, candidates: cands });
  }
  return out;
});

for (const t of all9) {
  console.log(`\n${t.topic}: ${t.candidates.length} 个元素`);
  t.candidates.forEach((c, i) => console.log(`  [${i}] ${c.tag} cls="${c.cls}" pos=(${c.x},${c.y}) ${c.w}x${c.h}`));
}

await page.close();
await browser.disconnect();
