// scripts/fetch_yuque_full.mjs — 抓取语雀 dhluml 全量 287 核心文档
// 完整流程:
//   1. CDP 登录
//   2. 在首页点击 9 专题 (catalogTreeItem-module_CatalogItem) 展开
//   3. 收集所有 a[href*="/dhluml/"] (slug 长度匹配 16-19 字符)
//   4. 逐个访问 + 抓 innerText 纯文本 + 落盘 .md
//   5. 累计 cjk 字数, 写 yuque_index.json
//
// 用法: node scripts/fetch_yuque_full.mjs [--limit N] [--start N] [--topic T]
//   --limit N   只抓前 N 个
//   --start N   从第 N 个开始 (用于断点续抓)
//   --topic T   只抓 topic=T 的 doc (T 为 topic 分类结果, 抓完一轮才有)

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
let limit = Infinity;
let start = 0;
let onlyTopic = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--limit') limit = parseInt(args[++i], 10);
  else if (args[i] === '--start') start = parseInt(args[++i], 10);
  else if (args[i] === '--topic') onlyTopic = args[++i];
}

const BASE = 'https://www.yuque.com/aaron-wecc3/dhluml';
const OUT_DIR = path.join(process.cwd(), 'docs', 'yuque_raw');
const INDEX_FILE = path.join(OUT_DIR, 'yuque_index.json');
const FAILED_FILE = path.join(OUT_DIR, 'yuque_failed.json');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function cjkCount(s) { return (s.match(/[一-鿿]/g) || []).length; }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  // 1. 加载已有 index (用于断点续抓)
  let index = [];
  if (fs.existsSync(INDEX_FILE)) {
    try { index = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf-8')); } catch {}
  }
  const indexedUrls = new Set(index.map(d => d.url));
  console.log(`📂 已索引: ${index.length} 个文档`);

  // 2. 连接浏览器
  console.log('🔌 连接 Chrome CDP 9222...');
  const browser = await puppeteer.connect({
    browserURL: 'http://localhost:9222',
    defaultViewport: { width: 1440, height: 900 }
  });
  console.log('✅ 已连接');
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);

  try {
    // 3. 登录
    console.log('🌐 访问语雀首页...');
    await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });
    await sleep(2000);
    const pwd = await page.$('input.ant-input.larkui-input, input[class*="ant-input"]');
    if (pwd) {
      await pwd.click();
      await page.keyboard.type('ghkq', { delay: 60 });
      await page.keyboard.press('Enter');
      await sleep(5000);
      console.log('🔐 登录后:', await page.title());
    }

    // 4. 收集 URL 策略: 9 专题页 = 目录页, 子链接在专题页正文里
    //    流程: 在首页展开 9 专题, 拿到 9 个专题 URL, 然后逐个访问专题页, 提取子 doc
    console.log('🌲 展开 9 专题侧边栏 (主侧边栏 + 多轮)...');
    const topicUrls = new Set();
    for (let round = 0; round < 5; round++) {
      const result = await page.evaluate(() => {
        const aside = document.querySelector('[class*="ReaderLayout-module_aside"]');
        if (!aside) return { found: 0, clicked: 0, urls: [] };
        const items = Array.from(aside.querySelectorAll('[class*="catalogTreeItem-module_CatalogItem"]'));
        let clicked = 0;
        const urls = [];
        for (const item of items) {
          const txt = (item.innerText || '').trim();
          if (!/^专题[一二三四五六七八九]/.test(txt) || txt.length >= 80) continue;
          // 拿该 item 内**所有 a** (可能多个链接, 包括兄弟)
          item.querySelectorAll('a').forEach(a => {
            if (a.href) urls.push(a.href.split('?')[0]);
          });
          // 展开
          const collapseIcon = item.querySelector('[class*="collapseIconWrapper"]');
          if (collapseIcon && collapseIcon.className.includes('collapsed')) {
            try {
              const titleWrapper = item.querySelector('[class*="titleWrapper"]') || item;
              titleWrapper.click();
              clicked++;
            } catch {}
          }
        }
        return { found: items.length, clicked, urls };
      });
      for (const u of result.urls) topicUrls.add(u);
      console.log(`   轮 ${round + 1}: ${result.found} 个, 点击 ${result.clicked} 个, 专题 URL 累计 ${topicUrls.size}`);
      if (result.clicked === 0) break;
      await sleep(2000);
    }

    // 5. 访问每个专题页, 收集子 doc 链接
    console.log(`\n📂 访问 ${topicUrls.size} 个专题页, 收集子 doc...`);
    const allDocUrls = new Set();
    for (const tu of topicUrls) {
      try {
        await page.goto(tu, { waitUntil: 'networkidle2', timeout: 20000 });
        await sleep(2000);
        const childUrls = await page.evaluate(() => {
          const out = new Set();
          document.querySelectorAll('a').forEach(a => {
            const href = a.href ? a.href.split('?')[0] : '';
            if (!href.includes('/dhluml/')) return;
            const parts = href.split('/');
            const slug = parts[parts.length - 1];
            // 单文档 slug 长度 14-22, 全字母数字
            if (slug.length >= 14 && slug.length <= 22 && /^[a-z0-9]+$/.test(slug)) {
              out.add(href);
            }
          });
          return [...out];
        });
        const before = allDocUrls.size;
        for (const u of childUrls) allDocUrls.add(u);
        console.log(`   ${tu.split('/').pop()}: +${allDocUrls.size - before} (累计 ${allDocUrls.size})`);
      } catch (e) {
        console.log(`   ❌ ${tu.split('/').pop()}: ${e.message.slice(0, 50)}`);
      }
    }

    // 6. 加首页 16 链接 (可能有 287 编号系列)
    // 先回到首页
    try {
      await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 20000 });
      await sleep(2000);
    } catch {}
    const homeUrls2 = await page.evaluate(() => {
      try {
        const arr = Array.from(document.querySelectorAll('a'))
          .filter(a => a.href && a.href.includes('/dhluml/'))
          .map(a => a.href.split('?')[0])
          .filter(h => {
            const slug = h.split('/').pop();
            return slug.length >= 14 && slug.length <= 22 && /^[a-z0-9]+$/.test(slug);
          });
        return arr;
      } catch (e) {
        return [];
      }
    });
    const homeSet = new Set(homeUrls2 || []);
    for (const u of homeSet) allDocUrls.add(u);
    console.log(`\n   首页额外: ${homeSet.size} 个, 总计 ${allDocUrls.size} 个 doc URL`);

    // 7. 写 URL 清单
    const allUrls = [...allDocUrls];
    fs.writeFileSync(path.join(OUT_DIR, 'yuque_urls.json'),
      JSON.stringify(allUrls.sort(), null, 2), 'utf-8');
    console.log(`📚 共 ${allUrls.length} 个 doc URL`);
    console.log(`   URL 清单: ${path.join(OUT_DIR, 'yuque_urls.json')}`);

    // 8. 断点续抓: 过滤已索引的
    const todo = allUrls
      .filter(u => !indexedUrls.has(u))
      .slice(start, start + (limit === Infinity ? allUrls.length : limit));
    console.log(`⏳ 待抓: ${todo.length} 个 (start=${start}, limit=${limit})`);

    // 8. 抓取目录
    const topicDir = path.join(OUT_DIR, 'pending_classify');
    if (!fs.existsSync(topicDir)) fs.mkdirSync(topicDir, { recursive: true });

    let success = 0, fail = 0;
    for (let i = 0; i < todo.length; i++) {
      const url = todo[i];
      const urlPath = new URL(url).pathname;
      const slug = urlPath.split('/').pop();
      const safeName = `${String(index.length + i).padStart(3, '0')}_${slug}`;

      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        await sleep(1500);

        const doc = await page.evaluate(() => {
          // 优先级: .ne-viewer-body > article
          const body = document.querySelector('.ne-viewer-body')
            || document.querySelector('article');
          const titleEl = document.querySelector('.lake-title')
            || document.querySelector('h1');
          return {
            title: titleEl ? titleEl.innerText.trim() : document.title,
            content: body ? body.innerText : '',
            url: location.href
          };
        });

        const cjk = cjkCount(doc.content);
        // 过滤: cjk < 100 视为目录页或反爬, 跳过
        if (cjk < 100) {
          console.log(`   ⚠ [${i}] ${slug}: 仅 ${cjk} 字 (目录页/反爬, 跳过)`);
          fail++;
          await sleep(400);
          continue;
        }
        const md = `# ${doc.title}\n\n来源: ${doc.url}\n中文字符: ${cjk}\n抓取时间: ${new Date().toISOString()}\n\n---\n\n${doc.content}\n`;
        const outFile = path.join(topicDir, `${safeName}.md`);
        fs.writeFileSync(outFile, md, 'utf-8');

        index.push({
          idx: index.length,
          title: doc.title,
          url: doc.url,
          slug,
          cjk_chars: cjk,
          body_len: doc.content.length,
          file: path.relative(process.cwd(), outFile)
        });
        success++;

        if ((i + 1) % 5 === 0 || i === todo.length - 1) {
          console.log(`   [${i + 1}/${todo.length}] ${cjk}字 "${doc.title.slice(0, 35)}"`);
        }
      } catch (e) {
        console.log(`   ❌ [${i}] ${url.split('/').pop()}: ${e.message.slice(0, 60)}`);
        fail++;
      }

      // 每 20 个 doc 写一次 index, 防止丢失
      if ((i + 1) % 20 === 0) {
        fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');
      }
      await sleep(400);
    }

    // 9. 最终写 index
    fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');

    const totalCjk = index.reduce((s, d) => s + d.cjk_chars, 0);
    console.log(`\n📊 本次完成:`);
    console.log(`   成功: ${success}, 失败: ${fail}`);
    console.log(`   累计: ${index.length} 文档, ${totalCjk.toLocaleString()} 中文字符`);
    console.log(`   索引: ${INDEX_FILE}`);
  } catch (e) {
    console.error('❌ 顶层错误:', e.message);
    console.error(e.stack);
  } finally {
    await page.close();
  }
})();
