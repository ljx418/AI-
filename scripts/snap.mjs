// scripts/snap.mjs - 自动化截屏 + console 错误检测
// 用法: node scripts/snap.mjs [URL] [OUT_FILE]
// 默认: http://localhost:3000/  -> /tmp/snap.png
import puppeteer from 'puppeteer';
import fs from 'fs';

const url = process.argv[2] || 'http://localhost:3000/';
const outFile = process.argv[3] || '/tmp/snap.png';

console.log(`📸 截屏: ${url} -> ${outFile}`);

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const consoleMsgs = [];
const pageErrors = [];

page.on('console', msg => {
  consoleMsgs.push(`[${msg.type()}] ${msg.text()}`);
});
page.on('pageerror', err => {
  pageErrors.push(`${err.message}\n${err.stack || ''}`);
});
page.on('requestfailed', req => {
  consoleMsgs.push(`[FAILED] ${req.url()} - ${req.failure()?.errorText}`);
});

try {
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
} catch (e) {
  console.log(`⚠️ navigation: ${e.message}`);
}

// 等 2 秒异步数据加载
await new Promise(r => setTimeout(r, 2000));

// DOM 状态
const domState = await page.evaluate(() => {
  const root = document.getElementById('root');
  return {
    rootHTMLLen: root?.innerHTML.length || 0,
    rootChildren: root?.children.length || 0,
    bodyText: document.body.innerText.slice(0, 300),
    title: document.title,
    navBtnCount: document.querySelectorAll('.nav-btn').length,
    lessonCardCount: document.querySelectorAll('.lesson-card').length,
  };
});

await page.screenshot({ path: outFile, fullPage: false });
console.log(`✅ 截图: ${outFile}`);

console.log(`\n=== DOM 状态 ===`);
console.log(JSON.stringify(domState, null, 2));

console.log(`\n=== Console (${consoleMsgs.length}) ===`);
consoleMsgs.slice(0, 20).forEach(m => console.log(m));

console.log(`\n=== Page Errors (${pageErrors.length}) ===`);
pageErrors.slice(0, 5).forEach(e => console.log(e));

await browser.close();

if (domState.rootHTMLLen === 0) {
  console.log('\n❌ #root 为空');
  process.exit(1);
}
console.log(`\n✅ 页面渲染 (${domState.rootHTMLLen} chars, ${domState.rootChildren} children)`);