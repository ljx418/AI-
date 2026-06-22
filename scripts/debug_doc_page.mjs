// 诊断: 抓一个真实文档页, 看 body 真实结构和正文选择器
import puppeteer from 'puppeteer';
const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
const page = await browser.newPage();

// 登录
await page.goto('https://www.yuque.com/aaron-wecc3/dhluml', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 2000));
const pwd = await page.$('input.ant-input.larkui-input, input[class*="ant-input"]');
if (pwd) {
  await pwd.click();
  await page.keyboard.type('ghkq', { delay: 80 });
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 5000));
}
console.log('登录后:', await page.title());

// 拿一个真实文档链接
const links = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('a'))
    .filter(a => a.href && a.href.includes('/dhluml/'))
    .map(a => ({ text: (a.innerText || '').trim().slice(0, 50), href: a.href }))
    .filter(l => l.text);
});
console.log('所有链接数:', links.length);
links.slice(0, 10).forEach((l, i) => console.log(`  [${i}] ${l.text} -> ${l.href}`));

if (links.length > 0) {
  const target = links.find(l => l.href.includes('waeaidol5u28zk1k')) || links.find(l => l.href.split('/').length > 4) || links[0];
  console.log('\n访问:', target.href);
  await page.goto(target.href, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 3000));
  console.log('页面 title:', await page.title());

  // 列所有可能正文选择器
  const candidates = await page.evaluate(() => {
    const sels = [
      '.ne-viewer-body', 'article', '.yuque-doc-content',
      '[class*="viewer"]', '[class*="doc-content"]', '[class*="lake-content"]',
      'main', '.lake-engine', '.DocComment-module', '.catalog'
    ];
    const out = {};
    for (const s of sels) {
      const el = document.querySelector(s);
      out[s] = el ? { len: el.innerText.length, sample: el.innerText.slice(0, 200) } : null;
    }
    return out;
  });
  console.log('\n正文选择器结果:');
  for (const [s, info] of Object.entries(candidates)) {
    console.log(`  ${s}: ${info ? `${info.len}字, 前 200: "${info.sample}"` : 'null'}`);
  }

  // 看 body 总长度和结构
  const bodyInfo = await page.evaluate(() => ({
    bodyLen: document.body.innerText.length,
    bodySample: document.body.innerText.slice(0, 500),
    bodyClass: document.body.className,
    children: Array.from(document.body.children).map(c => ({ tag: c.tagName, cls: c.className, len: c.innerText.length })).slice(0, 10)
  }));
  console.log('\nbody 信息:');
  console.log(`  总长: ${bodyInfo.bodyLen}`);
  console.log(`  class: ${bodyInfo.bodyClass}`);
  console.log(`  前 500: "${bodyInfo.bodySample}"`);
  console.log(`  children:`);
  bodyInfo.children.forEach(c => console.log(`    ${c.tag} cls="${c.cls}" len=${c.len}`));
}

await page.close();
await browser.disconnect();
