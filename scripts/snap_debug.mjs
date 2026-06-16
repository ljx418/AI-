import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const logs = [];
const errs = [];
page.on('console', m => logs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', e => errs.push(`${e.message}`));
page.on('requestfailed', r => logs.push(`[reqfail] ${r.url()} ${r.failure()?.errorText}`));
await page.goto('http://localhost:3000/lessons/L49', { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise(r => setTimeout(r, 5000));
const state = await page.evaluate(() => {
  return {
    bodyText: document.body.innerText,
    lessonsInWindow: typeof window.__lessons_cache,
    rootHTML: document.getElementById('root')?.innerHTML?.slice(0, 1000)
  };
});
console.log('=== LOGS ==='); logs.forEach(l => console.log(l));
console.log('=== ERRORS ==='); errs.forEach(e => console.log(e));
console.log('=== STATE ==='); console.log(JSON.stringify(state, null, 2));
await page.screenshot({ path: '/tmp/snap_L49_debug.png' });
await browser.close();
