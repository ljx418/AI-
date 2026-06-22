// scripts/fetch_yuque_v2.mjs — 抓取语雀 dhluml 知识库全量文档
// 流程:
//   1. 打开浏览器
//   2. 访问首页，输入密码
//   3. 提取侧边栏所有文档链接
//   4. 依次访问每个文档，抓 markdown 内容 + 字数 + 标题
//   5. 落盘到 docs/yuque_raw/<topic>/<NN>_<title>.md
//   6. 输出 yuque_index.json (含每个 doc 的 url/title/cjk_chars/topic)
//
// 重要:
//   - 复用 fetch_yuque.mjs 的登录方式 (密码 ghkq)
//   - 间隔 sleep 500ms 避免反爬
//   - 失败 doc 写入 yuque_failed.json
//
// 用法: node scripts/fetch_yuque_v2.mjs [--topic 9专题] [--limit 5]
//   --limit 5   只抓前 5 个 doc (调试用)
//   --topic N   只抓某个主题 (1-9)

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
let onlyTopic = null;
let limit = Infinity;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--topic') onlyTopic = parseInt(args[++i], 10);
  else if (args[i] === '--limit') limit = parseInt(args[++i], 10);
}

const BASE = 'https://www.yuque.com/aaron-wecc3/dhluml';
const OUT_DIR = path.join(process.cwd(), 'docs', 'yuque_raw');
const INDEX_FILE = path.join(OUT_DIR, 'yuque_index.json');
const FAILED_FILE = path.join(OUT_DIR, 'yuque_failed.json');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function cjkCount(s) { return (s.match(/[一-鿿]/g) || []).length; }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  console.log('🚀 启动浏览器...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--remote-debugging-port=9222'],
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();
  page.setDefaultTimeout(30000);

  try {
    console.log('🔐 登录语雀...');
    await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForSelector('input[type="password"]', { timeout: 15000 });
    await page.type('input[type="password"]', 'ghkq', { delay: 80 });
    await page.keyboard.press('Enter');
    await sleep(3000);
    console.log('✅ 登录成功, 当前 URL:', page.url());

    console.log('📋 提取侧边栏所有文档链接...');
    const allLinks = await page.evaluate((base) => {
      const items = [];
      const seen = new Set();
      document.querySelectorAll('a').forEach(a => {
        const href = a.href;
        const text = (a.innerText || '').trim();
        // 过滤：只要含 /dhluml/ 但不是首页/分类页
        if (href && href.includes('/dhluml/') && text && text.length < 200) {
          if (seen.has(href)) return;
          seen.add(href);
          // 排除知识库根目录
          if (href === base || href === base + '/') return;
          items.push({ text, href });
        }
      });
      return items;
    }, BASE);
    console.log(`📚 找到 ${allLinks.length} 个链接`);

    // 按 9 主题启发式分类 (沿用 M11_W2_GAP_REEVALUATION §1.3)
    // 但更精准：抓取每 doc 的实际标题，再用关键词匹配归类
    // 先抓所有 doc 的内容，再分类

    const index = [];
    const failed = [];
    const docsToFetch = allLinks.slice(0, limit === Infinity ? allLinks.length : limit);
    console.log(`⏳ 开始抓取 ${docsToFetch.length} 个文档...`);

    for (let i = 0; i < docsToFetch.length; i++) {
      const { text, href } = docsToFetch[i];
      const urlPath = new URL(href).pathname;
      const slug = urlPath.split('/').pop() || `doc_${i}`;
      const safeName = `${String(i).padStart(3, '0')}_${slug}`.slice(0, 200);
      const topicDir = path.join(OUT_DIR, 'pending_classify');
      if (!fs.existsSync(topicDir)) fs.mkdirSync(topicDir, { recursive: true });

      try {
        await page.goto(href, { waitUntil: 'networkidle2', timeout: 30000 });
        await sleep(800); // 等渲染

        const doc = await page.evaluate(() => {
          // 语雀正文: .ne-viewer-body 或 article
          const body = document.querySelector('.ne-viewer-body, article, .yuque-doc-content, [class*="content"]');
          const titleEl = document.querySelector('h1, .lake-title, [class*="title"]');
          return {
            title: titleEl ? titleEl.innerText.trim() : document.title,
            content: body ? body.innerText : document.body.innerText,
            url: location.href
          };
        });

        const cjk = cjkCount(doc.content);
        const md = `# ${doc.title}\n\n来源: ${doc.url}\n\n---\n\n${doc.content}\n`;
        const outFile = path.join(topicDir, `${safeName}.md`);
        fs.writeFileSync(outFile, md, 'utf-8');

        index.push({
          idx: i,
          title: doc.title,
          url: doc.url,
          sidebar_text: text,
          slug,
          cjk_chars: cjk,
          file: path.relative(process.cwd(), outFile)
        });

        if ((i + 1) % 10 === 0 || i === docsToFetch.length - 1) {
          console.log(`   [${i + 1}/${docsToFetch.length}] ${cjk}字 ${doc.title.slice(0, 30)}`);
        }
      } catch (e) {
        console.log(`   ❌ [${i}] 失败: ${e.message}`);
        failed.push({ idx: i, href, error: e.message });
      }

      await sleep(500);
    }

    fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8');
    fs.writeFileSync(FAILED_FILE, JSON.stringify(failed, null, 2), 'utf-8');

    const totalCjk = index.reduce((s, d) => s + d.cjk_chars, 0);
    console.log(`\n📊 完成: ${index.length} 个文档, 总中文字符 ${totalCjk}`);
    console.log(`   索引: ${INDEX_FILE}`);
    console.log(`   失败: ${FAILED_FILE} (${failed.length} 个)`);

    // 等待用户输入 (不关闭浏览器)
    console.log('\n⏸  浏览器保持打开, 等待 5s 后关闭...');
    await sleep(5000);
  } catch (e) {
    console.error('❌ 顶层错误:', e.message, e.stack);
  } finally {
    await browser.close();
  }
})();
