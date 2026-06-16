import puppeteer from 'puppeteer';
const url = process.argv[2] || 'http://localhost:3000/lessons/L49';
const outFile = process.argv[3] || '/tmp/snap_wait.png';
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const errs = [];
page.on('pageerror', e => errs.push(e.message));
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
// 等课程内容出现
await page.waitForFunction(() => document.body.innerText.length > 1000, { timeout: 15000 }).catch(() => {});
await new Promise(r => setTimeout(r, 1500));
const dom = await page.evaluate(() => ({
  textLen: document.body.innerText.length,
  h1: document.querySelector('h1')?.innerText,
  h2Count: document.querySelectorAll('h2').length,
  codeCount: document.querySelectorAll('pre code, code').length,
}));
console.log(JSON.stringify({ dom, errors: errs }, null, 2));
await page.screenshot({ path: outFile, fullPage: false });
await browser.close();
