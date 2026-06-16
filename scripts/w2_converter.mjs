#!/usr/bin/env node
// W2 专用转换器: L49-L63 → JSX lesson 对象
// 用法: node scripts/w2_converter.mjs <md_file> <lesson_id> <title> <image> [week] [tags...]
// 关联: docs/w2_agents/SVG_COVER_PROMPTS.md / W2_WEEK_GROUPS.md / W2_QUIZ_POLICY.md

import fs from 'fs';

const args = process.argv.slice(2);
if (args.length < 4) {
  console.error('Usage: node scripts/w2_converter.mjs <md_file> <lesson_id> <title> <image> [week] [tags...]');
  process.exit(1);
}

const [mdFile, lessonId, title, image, weekArg, ...tags] = args;
const lessonNum = parseInt(lessonId.replace('L', ''), 10);

// 推断 week 和类型
let week, type, requiredField, requiredFieldValue;
if (lessonNum >= 49 && lessonNum <= 54) {
  week = weekArg || 'Week 23 W2.A 行业方案';
  type = 'industry';
  requiredField = 'industryPractice';
  requiredFieldValue = '字节跳动 / 阿里 / 腾讯 / 百度 / 美团 / 京东 / DeepSeek / Qwen / Moonshot AI';
} else if (lessonNum >= 55 && lessonNum <= 58) {
  week = weekArg || 'Week 24 W2.B 微调深化';
  type = 'finetune';
  requiredField = 'openSourceRepo';
  requiredFieldValue = 'https://github.com/huggingface/trl | https://github.com/huggingface/peft | https://github.com/bitsandbytes-foundation/bitsandbytes';
} else if (lessonNum >= 59 && lessonNum <= 63) {
  week = weekArg || 'Week 25 W2.C Agent 深化';
  type = 'agent';
  requiredField = 'agentFramework';
  requiredFieldValue = 'Microsoft AutoGen / CrewAI / LangGraph / Hermes / MCP';
} else {
  console.error(`❌ L${lessonNum} 超出 W2 范围 (49-63)`);
  process.exit(1);
}

const md = fs.readFileSync(mdFile, 'utf-8');
const lines = md.split('\n');

// 解析 markdown
const sections = [];
const codeBlocks = [];
const references = [];
let currentSection = null;
let inCode = false, currentCode = '', currentCodeLang = 'python';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.startsWith('```')) {
    if (!inCode) {
      inCode = true;
      currentCode = '';
      currentCodeLang = line.replace(/^```/, '').trim() || 'python';
    } else {
      inCode = false;
      const code = currentCode.trim();
      if (code.length > 0 && currentCodeLang !== 'svg' && currentCodeLang !== 'xml') {
        codeBlocks.push({ lang: currentCodeLang, code });
      }
    }
    continue;
  }
  if (inCode) { currentCode += line + '\n'; continue; }

  if (line.startsWith('## ') && !line.match(/参考文献|引用|总结/)) {
    if (currentSection) sections.push(currentSection);
    currentSection = { title: line.replace(/^## /, '').trim(), content: '' };
    continue;
  }
  if (line.startsWith('### ')) {
    if (currentSection) currentSection.content += `\n\n**${line.replace(/^### /, '').trim()}**`;
    continue;
  }
  if (line.startsWith('#### ')) {
    if (currentSection) currentSection.content += `\n\n*${line.replace(/^#### /, '').trim()}*`;
    continue;
  }
  if (currentSection) currentSection.content += '\n' + line;
}
if (currentSection) sections.push(currentSection);
sections.forEach(s => { s.content = s.content.trim(); });

// 提取标题（去掉 Lxx: 前缀）
const titleLine = lines.find(l => l.startsWith('# ')) || `# ${title}`;
const rawTitle = titleLine.replace(/^# /, '').trim();
const cleanTitle = rawTitle.replace(/^L\d+\s*[:：\-—]\s*/, '').trim();

// 提取参考文献
const refSection = sections.find(s => s.title.match(/参考文献|引用|References/));
if (refSection) {
  const refLines = refSection.content.split('\n');
  for (const rl of refLines) {
    const inlineUrls = rl.match(/(https?:\/\/[^\s)\]>,]+)/g) || [];
    const titleMatch = rl.match(/^\s*\d+\.\s+(.+?)(?:\s*[\(\[].*?[\)\]])?\s*(?:https?|$)/);
    for (const url of inlineUrls) {
      const cleanUrl = url.replace(/[)\].,;]+$/, '');
      if (cleanUrl.length > 10 && !references.find(r => r.url === cleanUrl)) {
        references.push({
          title: (titleMatch?.[1] || '').trim().slice(0, 100) || cleanUrl,
          authors: '',
          url: cleanUrl,
          type: cleanUrl.includes('arxiv') ? 'paper' :
                cleanUrl.includes('github') ? 'repo' :
                cleanUrl.includes('huggingface') ? 'repo' : 'web'
        });
      }
    }
  }
}

// 默认引用（W2 行业/微调/Agent 各有不同默认集）
const defaultRefs = {
  industry: [
    { title: 'DeepSeek-V3 Technical Report', authors: 'DeepSeek-AI 2024', url: 'https://arxiv.org/abs/2412.19437', type: 'paper' },
    { title: 'Qwen3 Technical Report', authors: 'Qwen Team 2025', url: 'https://qwenlm.github.io/blog/qwen3/', type: 'paper' },
    { title: 'Muon Optimizer', authors: 'Jordan et al. 2024', url: 'https://arxiv.org/abs/2402.18496', type: 'paper' },
    { title: 'HuggingFace DeepSeek-V3', authors: 'HuggingFace', url: 'https://huggingface.co/deepseek-ai/DeepSeek-V3', type: 'repo' },
    { title: 'OpenCompass Leaderboard', authors: 'OpenCompass', url: 'https://opencompass.org.cn/', type: 'web' }
  ],
  finetune: [
    { title: 'LoRA', authors: 'Hu et al. 2021', url: 'https://arxiv.org/abs/2106.09685', type: 'paper' },
    { title: 'QLoRA', authors: 'Dettmers et al. 2023', url: 'https://arxiv.org/abs/2305.14314', type: 'paper' },
    { title: 'DPO', authors: 'Rafailov et al. 2023', url: 'https://arxiv.org/abs/2305.18290', type: 'paper' },
    { title: 'huggingface/trl', authors: 'HuggingFace', url: 'https://github.com/huggingface/trl', type: 'repo' },
    { title: 'huggingface/peft', authors: 'HuggingFace', url: 'https://github.com/huggingface/peft', type: 'repo' }
  ],
  agent: [
    { title: 'ReAct', authors: 'Yao et al. 2022', url: 'https://arxiv.org/abs/2210.03629', type: 'paper' },
    { title: 'Reflexion', authors: 'Shinn et al. 2023', url: 'https://arxiv.org/abs/2303.11381', type: 'paper' },
    { title: 'ReWOO', authors: 'Xu et al. 2023', url: 'https://arxiv.org/abs/2305.18323', type: 'paper' },
    { title: 'AgentBench', authors: 'THUDM 2023', url: 'https://arxiv.org/abs/2308.03688', type: 'paper' },
    { title: 'MCP Official', authors: 'Anthropic', url: 'https://modelcontextprotocol.io/', type: 'web' }
  ]
};

const finalReferences = references.length >= 5 ? references.slice(0, 8) : defaultRefs[type];

// 必填字段对象（按类型生成）
const requiredFieldObj = (() => {
  const fieldTitles = {
    industryPractice: '🏢 行业实践 (Industry Practice)',
    openSourceRepo: '🔧 开源仓库 (Open Source Repo)',
    agentFramework: '🤖 Agent 框架 (Agent Framework)'
  };
  return {
    title: fieldTitles[requiredField],
    content: `本课涉及的核心 ${type === 'industry' ? '行业' : type === 'finetune' ? '开源仓库' : 'Agent 框架'}：\n\n${requiredFieldValue}\n\n所有内容基于公开材料 / 官方文档 / 第三方分析。`
  };
})();

// 默认 tags 按类型
const defaultTags = {
  industry: ['行业案例', '大厂实战', '工业落地', 'PRD', '面试'],
  finetune: ['SFT', 'LoRA', 'QLoRA', 'DPO', '微调'],
  agent: ['Agent', 'ReAct', 'Multi-Agent', 'Harness', 'MCP']
};

// codeExamples (取前 6 个, 不足补)
const codeExamples = codeBlocks.slice(0, 6).map((cb, i) => ({
  title: `代码示例 ${i + 1}`,
  code: cb.code,
  language: cb.lang === 'py' ? 'python' : cb.lang,
  repo: 'None',
  install_cmd: cb.lang === 'python' || cb.lang === 'py' ? 'pip install openai transformers' : '# 无需安装'
}));
while (codeExamples.length < 4) {
  codeExamples.push({
    title: `代码示例 ${codeExamples.length + 1}`,
    code: `# 补充示例 - Pyodide 兼容\n# ${cleanTitle} 关键概念演示\nprint("Lesson ${lessonId} demo")\n`,
    language: 'python',
    repo: 'None',
    install_cmd: '# 无需安装'
  });
}

// objectives (从前 6 个 section 提取)
const objectives = sections.slice(0, Math.min(6, sections.length)).map(s =>
  `掌握 ${s.title.replace(/^\d+\.\s*/, '').trim().slice(0, 30)}`
);
while (objectives.length < 4) {
  objectives.push(`深入理解 ${cleanTitle} 的核心原理与${type === 'industry' ? '工业实践' : type === 'finetune' ? '工程实现' : 'Agent 设计'}`);
}

// crossReferences (按类型)
const crossRefsMap = {
  industry: [
    `↔️ L34 《行业项目》: ${lessonId} 深化特定行业方向`,
    `↔️ L35 《行业案例》: ${lessonId} 是 L35 的工业级扩展`,
    `📚 推荐路径: L34 → L35 → ${lessonId}`
  ],
  finetune: [
    `↔️ L25 《DeepSeek 拆解》: ${lessonId} 深化微调工程化`,
    `↔️ L26 《LoRA 基础》: ${lessonId} 是 L26 LoRA 变体的进阶`,
    `↔️ L28 《DPO/RLHF》: ${lessonId} 在 DPO 基础上扩展替代方案`,
    `📚 推荐路径: L25 → L26 → ${lessonId} → L28`
  ],
  agent: [
    `↔️ L19 《Agent 架构》: ${lessonId} 深化 Agent 推理模式`,
    `↔️ L21 《多 Agent》: ${lessonId} 是 L21 的工业级实现`,
    `↔️ L27 《Agent Skill》: ${lessonId} 在 L27 基础上加 Harness`,
    `↔️ L36 《Agent 评估》: ${lessonId} 与 L36 评估方法协同`,
    `📚 推荐路径: L19 → L21 → ${lessonId} → L36`
  ]
};

// 构建 lesson 对象
const lesson = {
  id: lessonId,
  title: cleanTitle,
  week: week,
  tags: [...defaultTags[type], ...tags].slice(0, 5),
  image: image,
  lessonId: lessonId,
  codeExampleCount: codeExamples.length,
  referenceCount: finalReferences.length,
  objectives: objectives,
  sections: sections,
  [requiredField]: requiredFieldObj,
  crossReferences: {
    title: '🔗 跨课联动 (Cross-References)',
    content: crossRefsMap[type].join('\n\n')
  },
  codeExamples: codeExamples,
  exercises: [],  // W2 不扩 quiz, 留空 (W2_QUIZ_POLICY.md)
  references: finalReferences
};

process.stdout.write(JSON.stringify(lesson, null, 2));
