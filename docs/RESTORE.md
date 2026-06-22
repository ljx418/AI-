# 1-AI教案 — 换机恢复手册

> **目的**: 把本项目从原电脑 (macOS, 路径 `/Users/Zhuanz/Desktop/workspace/1-AI教案`) 完整迁移到新电脑, 让 Claude Code 能恢复相同的工作上下文。
> **生成时间**: 2026-06-22
> **适用项目**: `ljx418/AI-` (github.com, public)

---

## 0. 恢复前清单 (新电脑上准备)

- [ ] macOS 或 Linux (已测过 macOS)
- [ ] Node.js ≥ 18 (项目用 Vite 5)
- [ ] npm ≥ 9
- [ ] Google Chrome (本机应用, 用于 Puppeteer 抓语雀)
- [ ] 语雀 dhluml 知识库密码: `ghkq` (硬编码, 仅为个人备份)
- [ ] GitHub SSH deploy-key 已配置到 `ljx418/AI-` (或用 HTTPS + PAT)
- [ ] `gh` CLI (可选, 验证推送)
- [ ] 至少 5GB 磁盘空间 (含 node_modules + yuque 落盘)

---

## 1. 克隆项目 (3 分钟)

```bash
mkdir -p ~/Desktop/workspace && cd ~/Desktop/workspace
git clone git@github.com-ljx418-ai:ljx418/AI-.git 1-AI教案
cd 1-AI教案
# 验证: ls 应该有 docs/ src/ package.json vite.config.js scripts/
```

**HTTPS 替代** (如果没配 SSH):

```bash
git clone https://github.com/ljx418/AI-.git 1-AI教案
cd 1-AI教案
```

---

## 2. 安装依赖 (5-10 分钟)

```bash
npm install
# 验证:
node -e "console.log(require('puppeteer/package.json').version)"  # 应输出 25.x
```

---

## 3. 启动 Dev Server 验证 (1 分钟)

```bash
npm run dev
# 输出: VITE v5.4.21 ready in 465 ms
# ➜  Local:   http://localhost:3000/

# 浏览器打开 http://localhost:3000 应该看到 50,147 chars 首页 (63 课)
# L49 课程页 (http://localhost:3000/lesson/L49) 应有 21,709 chars
```

**自动化验证** (可选):

```bash
node scripts/snap.mjs http://localhost:3000/ /tmp/home.png
# 期望最后一行: ✅ 页面渲染 (50xxx chars, x children)
```

---

## 4. 恢复 Claude Memory (关键!)

Claude Code 的 memory 在 `~/.claude/projects/<path-encoded>/memory/`。新电脑默认是空的, 必须手动恢复本项目的 memory。

### 4.1 找到对应的 memory 目录

新电脑的 path-encoded = `-Users-<user>-Desktop-workspace-1-AI--`

```bash
mkdir -p ~/.claude/projects/-Users-$(whoami)-Desktop-workspace-1-AI--/memory
cd ~/.claude/projects/-Users-$(whoami)-Desktop-workspace-1-AI--/memory
```

### 4.2 复制 3 个核心 memory 文件

从原电脑拷贝, 或从 git 仓库内 `docs/memory/` (如果你把 memory 也提交了的话) 拿:

| 文件 | 作用 | 来源 |
|------|------|------|
| `MEMORY.md` | memory 索引 | 见 §4.3 |
| `feedback/ai-lesson-dev-rules.md` | **本项目开发硬性规则** | 见 §4.3 |
| `feedback/debugging-patterns.md` | 调试经验 (通用) | 见 §4.3 |

> **重要**: `ai-lesson-dev-rules.md` 包含用户于 2026-06-17 明确的"抓语雀先行/真实验收/规格审计/打回循环"5 条规则, **新 Claude 必须看到**。

### 4.3 Memory 文件 (可直接复制)

```bash
# 假设项目已克隆到 ~/Desktop/workspace/1-AI教案
# 且 docs/memory/ 下放了 3 个 memory 文件的副本 (本步骤见 §5)
cp ~/Desktop/workspace/1-AI教案/docs/memory/*.* ~/.claude/projects/-Users-$(whoami)-Desktop-workspace-1-AI--/memory/
cp -r ~/Desktop/workspace/1-AI教案/docs/memory/feedback ~/.claude/projects/-Users-$(whoami)-Desktop-workspace-1-AI--/memory/
```

### 4.4 验证

新开会话时, 第一次提到"AI 教案开发规则"或"抓语雀"等关键词, Claude 应能 recall 到 `ai-lesson-dev-rules.md` 的内容。

---

## 5. 验证 git 已推送 (1 分钟)

```bash
cd ~/Desktop/workspace/1-AI教案
git log --oneline -5
# 应看到:
#   8894178 docs(M11): V2 差距评估 - W2 后 9 专题覆盖 39%/29%
#   90e48e9 fix: 修复页面空白的 3 个真实错误
#   753af82 perf: SWC + async LESSONS loading
#   3f37564 feat(W2): SHIP 15 lessons (L49-L63)
#   919c468 init: AI 教案 1-AI教案 完整内容
```

如果 commit hash 不一致 (你拉了新 commit), 用 `git fetch && git log --oneline` 看 origin/main 状态。

---

## 6. 恢复 9 个待执行任务 (TaskList)

**这一步必须人工复制**: Claude 的 TaskList 不持久化, 新电脑 Claude 默认空任务列表。

把 `docs/RESTORE_PROMPT.md` 整个粘到新电脑 Claude Code 的首条消息里, 它会自动调用 `TaskList` (空), 然后用 `TaskCreate` 重建 9 个任务:

- [ ] 写 PRD.md v3.0
- [ ] 写 ARCHITECTURE.md v3.0
- [ ] 写 MILESTONES.md v3.0
- [ ] 写 ACCEPTANCE_CRITERIA_V3.md
- [ ] 写 GAP_DRAWIO_V3.xml
- [ ] 抓取语雀 287 文档 (in_progress)
- [ ] 按 9 主题分类 287 文档
- [ ] 文档交叉引用 + 提交推送

---

## 7. 抓取流程恢复 (如果新电脑要继续抓语雀)

### 7.1 启动 Chrome CDP

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-sandbox \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-yuque-data \
  about:blank &
sleep 3
curl -s http://localhost:9222/json/version  # 应返回 Chrome/149
```

### 7.2 跑抓取脚本

```bash
cd ~/Desktop/workspace/1-AI教案

# 第一次跑: 滚动加载 + 收集所有 doc URL
node scripts/fetch_yuque_urls_only.mjs
# 输出 docs/yuque_raw/yuque_urls.json (287 个 URL)

# 第二次: 批量抓取正文
node scripts/fetch_yuque_full.mjs --limit 287
# 输出 docs/yuque_raw/pending_classify/<NNN>_<slug>.md
# 输出 docs/yuque_raw/yuque_index.json
```

**断点续抓**: 如果中断, 重新跑同一命令 (会跳过已索引的 URL):
```bash
node scripts/fetch_yuque_full.mjs  # 不带 --limit, 续抓
```

---

## 8. 关键密码 & 密钥 (单独保存, 不进 git)

| 项目 | 值 | 保存位置 |
|------|------|------|
| 语雀 dhluml 密码 | `ghkq` | 本人手记, 不进任何文件 |
| GitHub SSH deploy-key | (私钥) | `~/.ssh/ljx418_ai_deploy_key` |
| GitHub PAT (gh CLI) | (gho_xxx) | macOS keychain |
| DEEPSEEK_API_KEY | (sk-xxx) | `~/.claude/settings.json` env (不进 git) |

> **不要**把这些进 `.env` 后再提交, 1-AI教案是 PUBLIC 仓库。

---

## 9. 一键恢复脚本 (新电脑上)

把下面命令粘到新电脑 terminal, 一路执行:

```bash
# === 1. 克隆 + 装依赖 ===
mkdir -p ~/Desktop/workspace && cd ~/Desktop/workspace
git clone git@github.com-ljx418-ai:ljx418/AI-.git 1-AI教案
cd 1-AI教案
npm install

# === 2. 启动 dev server (后台) ===
npm run dev &
sleep 5
curl -s -o /dev/null -w "Home: %{http_code}\n" http://localhost:3000/
curl -s -o /dev/null -w "L49:  %{http_code}\n" http://localhost:3000/lesson/L49
curl -s -o /dev/null -w "Tool: %{http_code}\n" http://localhost:3000/tools/playground

# === 3. 启动 Chrome CDP (后台) ===
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --no-sandbox \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-yuque-data \
  about:blank &
sleep 3
curl -s http://localhost:9222/json/version | head -3

# === 4. 恢复 memory ===
mkdir -p ~/.claude/projects/-Users-$(whoami)-Desktop-workspace-1-AI--/memory
cp ~/Desktop/workspace/1-AI教案/docs/memory/MEMORY.md ~/.claude/projects/-Users-$(whoami)-Desktop-workspace-1-AI--/memory/
cp -r ~/Desktop/workspace/1-AI教案/docs/memory/feedback ~/.claude/projects/-Users-$(whoami)-Desktop-workspace-1-AI--/memory/

# === 5. 验证 ===
node scripts/snap.mjs http://localhost:3000/ /tmp/home.png
# 期望: ✅ 页面渲染 (50xxx chars, 1 children)

echo "✅ 恢复完成, 打开 http://localhost:3000"
```

---

## 10. 完整恢复时间预估

| 步骤 | 时间 |
|------|-----:|
| 1. 克隆项目 | 3 分钟 |
| 2. npm install | 5-10 分钟 |
| 3. 启动 dev + 验证 | 1 分钟 |
| 4. 恢复 memory | 1 分钟 |
| 5. (可选) 启动 Chrome CDP | 30 秒 |
| 6. (可选) 续抓语雀 | 1-2 小时 |
| **总计** | **10-15 分钟** (不含续抓) |

---

## 11. 恢复失败排查

| 症状 | 排查 |
|------|------|
| `npm install` 失败 | Node 版本: `node -v` 应 ≥ 18 |
| dev server 启动但 3000 端口占用 | `lsof -i :3000` 找到 PID, kill 后重启 |
| 首页白屏 | 看 `/tmp/vite.log` 末尾, 大概率是 hooks 错。运行 `node scripts/snap_debug.mjs` 看 console error |
| 抓语雀找不到密码框 | 语雀前端已改版, 跑 `scripts/debug_yuque_pwd.mjs` 重新定位 selector |
| 抓语雀 0 字 | lazy load 没等够。修改 `fetch_yuque_full.mjs` 里 `await sleep(1500)` 为更长 |

---

## 12. 验收 (新电脑 Claude 必须通过的 4 步)

1. **首页可访问**: `node scripts/snap.mjs http://localhost:3000/ /tmp/h.png` 最后一行 `✅ 页面渲染 (50xxx chars, 1 children)`
2. **课程路由 OK**: `node scripts/snap_wait.mjs http://localhost:3000/lesson/L49 /tmp/l.png` 期望 `textLen: 21xxx, errors: []`
3. **工具页 OK**: `node scripts/snap.mjs http://localhost:3000/tools/playground /tmp/t.png` 期望 `✅ 页面渲染 (15xxx chars, 1 children)`
4. **记忆召回**: 在新会话问"AI 教案项目有什么硬性开发规则?", Claude 应能引用 `ai-lesson-dev-rules.md`

---

*生成时间: 2026-06-22*
*适用于 1-AI教案 v0.2 (W2 完成后, 41.3 万字 / 63 课)*
