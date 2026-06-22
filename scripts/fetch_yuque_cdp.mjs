// scripts/fetch_yuque_cdp.mjs — 复用已启动的 Chrome CDP, 抓取语雀 dhluml 全量文档
// 流程: connect CDP -> 打开新 tab -> 访问语雀 -> 输入密码 -> 抓所有侧边栏链接
//       -> 逐个访问 -> 抓内容 + 标题 + 字数 -> 落盘
//
// 优势: 浏览器复用, headless=new 不会触发反爬 (复用 chrome-yuque-data-v2 的 cookies)
//
// 用法: node scripts/fetch_yuque_cdp.mjs [--limit 5]
//   --limit 5   只抓前 5 个 doc (调试用, 不写盘)

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
let limit = Infinity;
let noWrite = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--limit') limit = parseInt(args[++i], 10);
  else if (args[i] === '--dry') noWrite = true;
}

const BASE = 'https://www.yuque.com/aaron-wecc3/dhluml';
const OUT_DIR = path.join(process.cwd(), 'docs', 'yuque_raw');
const INDEX_FILE = path.join(OUT_DIR, 'yuque_index.json');
const FAILED_FILE = path.join(OUT_DIR, 'yuque_failed.json');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function cjkCount(s) { return (s.match(/[一-鿿]/g) || []).length; }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  console.log('🔌 连接 Chrome CDP 9222...');
  let browser;
  try {
    browser = await puppeteer.connect({
      browserURL: 'http://localhost:9222',
      defaultViewport: { width: 1440, height: 900 }
    });
  } catch (e) {
    console.error('❌ CDP 连接失败, 请先启动 Chrome with --remote-debugging-port=9222');
    console.error('   错误:', e.message);
    process.exit(1);
  }
  console.log('✅ 已连接');

  const page = await browser.newPage();
  page.setDefaultTimeout(30000);

  try {
    console.log('🌐 访问语雀首页...');
    await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });
    await sleep(2000);
    console.log('   当前 URL:', page.url());
    console.log('   页面 title:', await page.title());

    // 检查是否需要密码
    // 语雀密码页是 type="text" 的自定义 input (ant-design)
    const hasPwd = await page.$('input.ant-input.larkui-input, input[class*="ant-input"]');
    if (hasPwd) {
      console.log('🔐 检测到密码框, 输入密码 ghkq...');
      await hasPwd.click();
      await page.keyboard.type('ghkq', { delay: 80 });
      await page.keyboard.press('Enter');
      await sleep(5000);
      console.log('   登录后 URL:', page.url());
      console.log('   登录后 title:', await page.title());
    } else {
      console.log('   无密码框, 可能已登录或免密');
    }

    // 抓取侧边栏所有链接
    console.log('📋 提取侧边栏链接...');
    const allLinks = await page.evaluate((base) => {
      const items = [];
      const seen = new Set();
      document.querySelectorAll('a').forEach(a => {
        const href = a.href;
        const text = (a.innerText || '').trim();
        if (href && href.includes('/dhluml/') && text && text.length < 200) {
          if (seen.has(href)) return;
          seen.add(href);
          if (href === base || href === base + '/' || href === base + '/dashboard') return;
          // 排除知识库元数据链接
          if (href.includes('/books/') || href.includes('/settings')) return;
          items.push({ text, href });
        }
      });
      return items;
    }, BASE);
    console.log(`📚 找到 ${allLinks.length} 个文档链接`);

    if (allLinks.length === 0) {
      console.log('⚠️  0 个链接, 可能需要滚动展开侧边栏或登录失败');
      const sampleLinks = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a')).slice(0, 30).map(a => ({
          text: (a.innerText || '').trim().slice(0, 50),
          href: a.href
        }));
      });
      console.log('   页面前 30 个链接示例:');
      sampleLinks.forEach((l, i) => console.log(`     [${i}] ${l.text} -> ${l.href}`));
    }

    const docsToFetch = allLinks.slice(0, limit === Infinity ? allLinks.length : limit);
    console.log(`\n⏳ 开始抓取 ${docsToFetch.length} 个文档${noWrite ? ' (DRY 模式不写盘)' : ''}...`);

    const index = [];
    const failed = [];
    const topicDir = path.join(OUT_DIR, 'pending_classify');
    if (!fs.existsSync(topicDir)) fs.mkdirSync(topicDir, { recursive: true });

    for (let i = 0; i < docsToFetch.length; i++) {
      const { text, href } = docsToFetch[i];
      const urlPath = new URL(href).pathname;
      const slug = urlPath.split('/').pop() || `doc_${i}`;
      const safeName = `${String(i).padStart(3, '0')}_${slug}`.slice(0, 200);

      try {
        await page.goto(href, { waitUntil: 'networkidle2', timeout: 30000 });
        await sleep(800);

        const doc = await page.evaluate(() => {
          // 语雀正文选择器优先级
          const body = document.querySelector('.ne-viewer-body')
            || document.querySelector('article')
            || document.querySelector('.yuque-doc-content')
            || document.querySelector('[class*="viewer"]')
            || document.querySelector('main');
          const titleEl = document.querySelector('.lake-title')
            || document.querySelector('h1')
            || document.querySelector('[class*="title"]');
          return {
            title: titleEl ? titleEl.innerText.trim() : document.title,
            content: body ? body.innerText : document.body.innerText,
            url: location.href,
            bodyLen: body ? body.innerText.length : 0
          };
        });

        const cjk = cjkCount(doc.content);
        const md = `# ${doc.title}\n\n来源: ${doc.url}\n中文字符: ${cjk}\n正文长度: ${doc.bodyLen}\n\n---\n\n${doc.content}\n`;

        if (!noWrite) {
          const outFile = path.join(topicDir, `${safeName}.md`);
          fs.writeFileSync(outFile, md, 'utf-8');
          index.push({
            idx: i, title: doc.title, url: doc.url, sidebar_text: text,
            slug, cjk_chars: cjk, body_len: doc.bodyLen,
            file: path.relative(process.cwd(), outFile)
          });
        } else {
          index.push({ idx: i, title: doc.title, cjk_chars: cjk, body_len: doc.bodyLen, url: doc.url });
        }

        if ((i + 1) % 5 === 0 || i === docsToFetch.length - 1) {
          console.log(`   [${i + 1}/${docsToFetch.length}] ${cjk}字 "${doc.title.slice(0, 30)}"`);
        }
      } catch (e) {
        console.log(`   ❌ [${i}] 失败: ${e.message.slice(0, 80)}`);
        failed.push({ idx: i, href, error: e.message });
      }

      await sleep(400);
    }

    if (!noWrite) {
      fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');
      fs.writeFileSync(FAILED_FILE, JSON.stringify(failed, null, 2), 'utf-8');
    }

    const totalCjk = index.reduce((s, d) => s + d.cjk_chars, 0);
    console.log(`\n📊 完成:`);
    console.log(`   成功: ${index.length} 个`);
    console.log(`   失败: ${failed.length} 个`);
    console.log(`   总中文字符: ${totalCjk.toLocaleString()}`);
    if (!noWrite) console.log(`   索引: ${INDEX_FILE}`);
  } catch (e) {
    console.error('❌ 顶层错误:', e.message);
    console.error(e.stack);
  } finally {
    await page.close();
    // 不 disconnect, 保留 CDP 连接给后续脚本
  }
})();
