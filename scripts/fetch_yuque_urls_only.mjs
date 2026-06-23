// scripts/fetch_yuque_urls_only.mjs — 抓取语雀 dhluml 全量 doc URL
// 修复版 (W3 启动前置, 2026-06-23)
//
// 关键修复 (对比旧版):
//   1. 旧版只滚动 aside (Yuque 用了 React virtualization, scrollTop = scrollHeight 无效, 累计 13 URL)
//   2. 旧版只点 1 轮 collapsed, 9 专题的子目录是嵌套的, 1 轮打开后还有 collapsed 节点
//   3. 新版策略:
//      a. 多轮点击 collapsed (直到 0 连续 3 轮)
//      b. 试访问 /books/N (1-9) 9 个专题页, 每页正文里就是该专题的子 doc 列表
//      c. 也试直接访问已知 9 专题首页 (foho2nsutnn37gw3 等), 收 main content 内链接
//      d. 最后统一去重, 落盘 yuque_urls.json
//
// 抗反爬: 每轮 sleep 800ms, 最多 50 轮 click, 9 个 topic 访问每个 sleep 1500ms
// 不 mock: URL 全部来自真实 DOM (document.querySelectorAll('a').href)

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE = 'https://www.yuque.com/aaron-wecc3/dhluml';
const OUT_DIR = path.join(process.cwd(), 'docs', 'yuque_raw');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// 判定 a.href 是否为 dhluml 单文档 (slug 14-22 字符, 全小写字母数字)
function isDocHref(href) {
  if (!href || !href.includes('/dhluml/')) return false;
  const slug = href.split('?')[0].split('/').pop();
  if (!slug || slug.length < 14 || slug.length > 22) return false;
  if (!/^[a-z0-9]+$/.test(slug)) return false;
  // 排除 /books/ (9 专题页本身), /dashboard, /settings 等元数据
  if (href.includes('/books/') || href.includes('/dashboard') || href.includes('/settings')) return false;
  return true;
}

(async () => {
  console.log('🔌 连接 Chrome CDP 9222...');
  const browser = await puppeteer.connect({ browserURL: 'http://localhost:9222' });
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);
  await page.setViewport({ width: 1440, height: 900 });

  const allUrls = new Set();

  try {
    // 1. 登录
    console.log('🌐 访问语雀首页...');
    await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });
    await sleep(2000);
    const pwd = await page.$('input.ant-input.larkui-input');
    if (pwd) {
      console.log('🔐 输入密码 ghkq...');
      await pwd.click();
      await page.keyboard.type('ghkq', { delay: 60 });
      await page.keyboard.press('Enter');
      await sleep(5000);
      console.log('   登录后 title:', await page.title());
    }

    // ===== 策略 A: 9 专题页多轮点击展开 aside catalog =====
    console.log('\n🌲 策略 A: 多轮点击 aside 内 collapsed 节点...');
    let totalClicked = 0;
    for (let round = 0; round < 20; round++) {
      const r = await page.evaluate(() => {
        const aside = document.querySelector('[class*="ReaderLayout-module_aside"]')
                   || document.querySelector('aside')
                   || document.querySelector('[class*="catalog"]');
        if (!aside) return { clicked: 0, found: 0 };
        // 找所有 collapsed 节点 (不限层级)
        const all = aside.querySelectorAll('[class*="collapseIconWrapper"]');
        let clicked = 0;
        for (const ci of all) {
          if (ci.className.includes('collapsed')) {
            try {
              // 向上找最近的可点击元素 (titleWrapper 或 li 本身)
              let p = ci;
              for (let i = 0; i < 4 && p; i++) {
                p = p.parentElement;
                if (!p) break;
                if (p.className && (p.className.includes('titleWrapper') || p.tagName === 'A')) {
                  p.click();
                  clicked++;
                  break;
                }
              }
              if (clicked === 0) ci.click();
              clicked++;
            } catch {}
          }
        }
        return { clicked, found: all.length };
      });
      totalClicked += r.clicked;
      console.log(`   轮 ${round + 1}: 找到 ${r.found} 个 collapseIcon, 点击 ${r.clicked} 个 (累计 ${totalClicked})`);
      if (r.clicked === 0) break;
      await sleep(800);
    }

    // 收集策略 A 的 URL
    const asideUrls = await page.evaluate(() => {
      const out = new Set();
      document.querySelectorAll('a').forEach(a => {
        const href = a.href ? a.href.split('?')[0] : '';
        if (!href.includes('/dhluml/')) return;
        const slug = href.split('/').pop();
        if (slug.length >= 14 && slug.length <= 22 && /^[a-z0-9]+$/.test(slug)
            && !href.includes('/books/')) {
          out.add(href);
        }
      });
      return [...out];
    });
    console.log(`   策略 A 收集: ${asideUrls.length} 个 doc URL`);
    for (const u of asideUrls) allUrls.add(u);

    // ===== 策略 B: 访问 /books/1..9 9 个专题目录页, 抓 main content 子 doc =====
    console.log('\n📚 策略 B: 访问 /books/1..9 9 个专题页...');
    for (let n = 1; n <= 9; n++) {
      const topicUrl = `${BASE}/books/${n}`;
      try {
        await page.goto(topicUrl, { waitUntil: 'networkidle2', timeout: 20000 });
        await sleep(1500);
        const u = await page.evaluate(() => {
          const out = new Set();
          // 优先从 main / article / ne-viewer-body 抓
          const root = document.querySelector('main') || document.querySelector('article') || document.body;
          root.querySelectorAll('a').forEach(a => {
            const href = a.href ? a.href.split('?')[0] : '';
            if (!href.includes('/dhluml/')) return;
            const slug = href.split('/').pop();
            if (slug.length >= 14 && slug.length <= 22 && /^[a-z0-9]+$/.test(slug)
                && !href.includes('/books/')) {
              out.add(href);
            }
          });
          return [...out];
        });
        const before = allUrls.size;
        for (const x of u) allUrls.add(x);
        console.log(`   /books/${n}: 找到 ${u.length} 个, 新增 ${allUrls.size - before} (累计 ${allUrls.size})`);
      } catch (e) {
        console.log(`   /books/${n}: ❌ ${e.message.slice(0, 60)}`);
      }
    }

    // ===== 策略 C: 访问已知的 9 专题首页 slugs (从 debug_topic_urls.mjs 推) =====
    // 已知专题 slug: snoxhrutgoybigeg (专题七--项目方案篇), foho2nsutnn37gw3 (AI大模型面试系列)
    // 9 专题首页 slug 不全, 尝试其他可能的 16 字符 slug 入口
    console.log('\n🎯 策略 C: 访问已知专题首页 slug...');
    const knownTopicSlugs = [
      'snoxhrutgoybigeg',  // 专题七--项目方案篇
      'foho2nsutnn37gw3',  // AI大模型面试系列
      // 其他 7 个专题的首页 slug 未知, 需要从策略 A 收集后追溯
    ];
    for (const slug of knownTopicSlugs) {
      try {
        const tu = `${BASE}/${slug}`;
        await page.goto(tu, { waitUntil: 'networkidle2', timeout: 20000 });
        await sleep(1500);
        const u = await page.evaluate(() => {
          const out = new Set();
          const root = document.querySelector('main') || document.querySelector('article') || document.body;
          root.querySelectorAll('a').forEach(a => {
            const href = a.href ? a.href.split('?')[0] : '';
            if (!href.includes('/dhluml/')) return;
            const s = href.split('/').pop();
            if (s.length >= 14 && s.length <= 22 && /^[a-z0-9]+$/.test(s)
                && !href.includes('/books/')) {
              out.add(href);
            }
          });
          return [...out];
        });
        const before = allUrls.size;
        for (const x of u) allUrls.add(x);
        console.log(`   ${slug}: 找到 ${u.length} 个, 新增 ${allUrls.size - before} (累计 ${allUrls.size})`);
      } catch (e) {
        console.log(`   ${slug}: ❌ ${e.message.slice(0, 60)}`);
      }
    }

    // ===== 策略 D: 回到首页, 再扫一次 (有时收起再展开会发现新 URL) =====
    console.log('\n🔁 策略 D: 回首页, 重做一遍策略 A 末轮点击...');
    try {
      await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 20000 });
      await sleep(2000);
      for (let round = 0; round < 5; round++) {
        const r = await page.evaluate(() => {
          const aside = document.querySelector('[class*="ReaderLayout-module_aside"]')
                     || document.querySelector('aside')
                     || document.querySelector('[class*="catalog"]');
          if (!aside) return 0;
          let clicked = 0;
          for (const ci of aside.querySelectorAll('[class*="collapseIconWrapper"]')) {
            if (ci.className.includes('collapsed')) {
              try { ci.parentElement && ci.parentElement.click(); clicked++; } catch {}
            }
          }
          return clicked;
        });
        if (r === 0) break;
        await sleep(800);
      }
      const finalUrls = await page.evaluate(() => {
        const out = new Set();
        document.querySelectorAll('a').forEach(a => {
          const href = a.href ? a.href.split('?')[0] : '';
          if (!href.includes('/dhluml/')) return;
          const slug = href.split('/').pop();
          if (slug.length >= 14 && slug.length <= 22 && /^[a-z0-9]+$/.test(slug)
              && !href.includes('/books/')) {
            out.add(href);
          }
        });
        return [...out];
      });
      const before = allUrls.size;
      for (const x of finalUrls) allUrls.add(x);
      console.log(`   策略 D 末扫: 找到 ${finalUrls.length}, 新增 ${allUrls.size - before} (累计 ${allUrls.size})`);
    } catch (e) {
      console.log(`   策略 D: ❌ ${e.message.slice(0, 60)}`);
    }

    // 落盘
    const urlArr = [...allUrls].sort();
    const outFile = path.join(OUT_DIR, 'yuque_urls.json');
    fs.writeFileSync(outFile, JSON.stringify(urlArr, null, 2), 'utf-8');
    console.log(`\n📚 共 ${urlArr.length} 个 doc URL`);
    console.log(`   URL 清单: ${outFile}`);
    console.log(`   目标 287, 偏差 ${((287 - urlArr.length) / 287 * 100).toFixed(1)}%`);
  } catch (e) {
    console.error('❌ 顶层错误:', e.message);
    console.error(e.stack);
  } finally {
    await page.close();
  }
})();
