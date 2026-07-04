# OpenClaw Skills 工具集

一套精简的 AI 效率工具链，包含 7 个 skill：

| Skill | 功能 |
|-------|------|
| **wechat-write** | 一站式公众号文章创作（选题→大纲→写作→自检） |
| **wechat-format** | Markdown → 微信公众号排版（Node.js 脚本） |
| **ai-daily-digest** | AI 资讯日报（90 个顶级博客 RSS → AI 评分筛选 → 每日精选） |
| **resume-analyzer** | 智能简历分析（多维评分 + 大五人格 + JD 匹配） |
| **poster-generator** | 营销海报生成（需求提炼 → 海报方案 → 确认后生成） |
| **business-advisor-v1** | 面向老板的中文商业研究报告（研究计划 + 分析建议 + AI 落地建议 + 风险提示） |
| **openclaud-github-audit** | GitHub 仓库审计（架构、性能、安全、可靠性、可维护性） |

## 快速开始

### 1. 导入到 OpenClaw

**方式 A：手动导入（推荐）**

将 skill 文件夹复制到 OpenClaw 的 skills 目录：

```bash
# 全局安装（所有 Agent 可用）
cp -r wechat-write ~/.openclaw/skills/
cp -r wechat-format ~/.openclaw/skills/
cp -r ai-daily-digest ~/.openclaw/skills/
cp -r resume-analyzer ~/.openclaw/skills/
cp -r poster-generator ~/.openclaw/skills/
cp -r business-advisor-v1 ~/.openclaw/skills/
cp -r openclaud-github-audit ~/.openclaw/skills/

# 或项目级安装（仅当前项目可用）
cp -r wechat-write <你的项目>/skills/
cp -r wechat-format <你的项目>/skills/
cp -r ai-daily-digest <你的项目>/skills/
cp -r resume-analyzer <你的项目>/skills/
cp -r poster-generator <你的项目>/skills/
cp -r business-advisor-v1 <你的项目>/skills/
cp -r openclaud-github-audit <你的项目>/skills/
```

复制后重启 OpenClaw Gateway 即可生效。

**方式 B：通过聊天导入**

在 OpenClaw 对话中直接说：
> "帮我安装 skills，在 /path/to/skills"

OpenClaw 会自动识别并加载。

**方式 C：通过 GitHub 链接导入**

如果你把这个仓库推到了 GitHub，可以在 OpenClaw 中直接粘贴仓库链接，它会自动安装。

### 2. 安装依赖

```bash
# 排版脚本依赖（只需一次）
cd wechat-format/scripts && npm install

# 简历解析脚本依赖（只需一次）
cd resume-analyzer/scripts && npm install

# 商业研究报告脚本依赖（如需本地运行）
cd business-advisor-v1 && npm install

# ai-daily-digest 无需安装，运行时通过 npx -y bun 自动处理
```

## 使用流程

### 📰 AI 资讯日报

在 OpenClaw 中输入 `/digest` 或说"帮我生成今天的 AI 资讯日报"：

```
1. 检查已保存配置（可一键复用）
2. 收集参数（时间范围、精选数量、语言）
3. 提供 AI API Key（Gemini 免费 / OpenAI 兼容）
4. 执行脚本，生成 Markdown 日报
```

生成的日报包含：今日看点、必读 Top 3、数据概览（Mermaid 图表）、分类文章列表。

**环境要求**：至少一个 API Key（`GEMINI_API_KEY` 或 `OPENAI_API_KEY`）。

---

### 📄 简历分析

在 OpenClaw 中说“帮我分析这份简历”或上传简历文件：

```
1. 上传/粘贴简历（PDF、Word 或纯文本）
2. 确认提取的结构化信息
3. 获取综合分析报告（四维评分 + 大五人格 + 优劣势）
4. 可选：提供 JD 进行匹配度分析
```

支持在同一对话中随时追加 JD 进行匹配分析。

---

### 🧾 商业研究报告

在 OpenClaw 中触发 `business-advisor-v1` 技能，适合研究行业、市场、政策、客户、竞品、产品机会或 AI 应用机会：

```bash
cd business-advisor-v1
npm run dry-run
```

如果要调用 OpenAI 兼容接口生成正式报告，需要提供 `OPENAI_API_KEY`，也可以通过 `OPENAI_BASE_URL` 和 `OPENAI_MODEL` 接入自定义网关。

---

### 🧪 GitHub 仓库审计

在 OpenClaw 中触发 `openclaud-github-audit` 技能，用于对 GitHub 仓库、PR 或代码库做技术尽调：

```
1. 确认审计范围（整个仓库、子目录、分支 diff 或 PR）
2. 建立项目上下文（结构、依赖、入口、CI、部署配置）
3. 从架构、性能、安全、可靠性、可维护性等维度审计
4. 输出按严重程度排序的发现和修复建议
```

---

### 🖼️ 营销海报生成

在 OpenClaw 中触发 `poster-generator` 技能，适合活动海报、促销海报、招聘海报、公告海报等场景：

```
1. 从你的原始描述中提取目标、标题、时间、地点、卖点、CTA 等信息
2. 只追问最关键的缺失信息
3. 先输出海报方案，等待确认
4. 确认后再生成最终海报
```

---

### 🖊️ 公众号文章创作

在 OpenClaw 中触发 `wechat-write` 技能：

```
你：帮我写一篇关于 AI 工具变现的公众号文章
```

技能会引导你完成：

```
1. 选题（展示 3 个选题，等你选择）  ← ⛔️ 暂停
2. 大纲确认（展示文章骨架）        ← ⛔️ 暂停
3. 写作（输出标准 Markdown 文章）
4. 自检（五维度评分）              ← ⛔️ 暂停
```

最终输出一篇**标准 Markdown** 格式的文章。

### 🎨 排版格式化

将 AI 写好的 Markdown 文章保存为文件，然后运行排版脚本：

```bash
# 默认主题（微信绿）
node wechat-format/scripts/format.mjs article.md > output.html

# 指定主题
node wechat-format/scripts/format.mjs --theme=mac article.md > output.html
node wechat-format/scripts/format.mjs --theme=medium article.md > output.html
```

### 📋 发布到公众号

1. 在浏览器中打开生成的 `output.html`
2. `Ctrl+A` 全选 → `Ctrl+C` 复制
3. 打开微信公众号编辑器 → `Ctrl+V` 粘贴
4. 完成！所有样式自动保留 ✅

## 可用主题

| 主题 | 命令 | 风格 |
|------|------|------|
| 🟢 微信原生 | `--theme=wechat` | 绿色强调，官方感（默认） |
| ⚪ Mac 极简 | `--theme=mac` | 纯净留白，蓝色强调 |
| 📝 Medium | `--theme=medium` | 大行距，绿色链接，博客风 |

## 文件结构

```
skills/
├── ai-daily-digest/             # AI 资讯日报 Skill
│   ├── SKILL.md                 # 技能说明（交互流程）
│   └── scripts/
│       └── digest.ts            # 核心脚本（RSS + AI 评分 + 摘要）
│
├── resume-analyzer/             # 简历分析 Skill
│   ├── SKILL.md                 # 技能说明（分析 + 打分 + 人格 + JD 匹配）
│   ├── scripts/
│   │   ├── parse-resume.mjs     # PDF/Word 文本提取
│   │   ├── generate-report-pdf.mjs
│   │   └── package.json         # 依赖声明
│   └── references/
│       ├── scoring-criteria.md  # 四维评分标准
│       └── personality-model.md # 大五人格分析框架
│
├── poster-generator/            # 营销海报生成 Skill
│   ├── SKILL.md                 # 技能说明（方案优先→确认后生成）
│   ├── agents/openai.yaml       # AI 模型配置
│   └── references/
│       ├── poster-brief-template.md
│       ├── layout-rules.md
│       ├── style-presets.md
│       └── workflow.md
│
├── business-advisor-v1/          # 商业研究报告 Skill
│   ├── SKILL.md                 # 技能说明（研究计划→Markdown 报告）
│   ├── skill.json               # Skill 元信息
│   ├── scripts/
│   │   ├── run.mjs              # 报告生成脚本
│   │   └── install.mjs          # 安装脚本
│   ├── schemas/                 # 输入/输出 JSON Schema
│   ├── prompts/                 # 报告提示词
│   └── examples/                # 示例输入
│
├── openclaud-github-audit/       # GitHub 仓库审计 Skill
│   ├── SKILL.md                 # 技能说明（架构/性能/安全/质量审计）
│   ├── agents/openai.yaml       # AI 模型配置
│   └── references/
│       ├── audit-checklists.md  # 审计检查清单
│       └── report-template.md   # 报告模板
│
├── wechat-write/                # 文章创作 Skill
│   ├── SKILL.md                 # 技能说明（选题→写作→自检）
│   ├── agents/openai.yaml       # AI 模型配置
│   ├── references/
│   │   ├── style-guide.md       # 写作风格规范
│   │   └── self-check.md        # 五维度质量自检
│   └── templates/               # 文章模板
│
└── wechat-format/               # 排版格式化 Skill
    ├── SKILL.md                 # 技能说明
    └── scripts/
        ├── format.mjs           # 核心转换脚本
        ├── themes.mjs           # 主题 CSS 定义
        ├── package.json         # 依赖声明
        └── node_modules/        # 依赖（npm install 后生成）
```

## 常见问题

**Q: 为什么不让 AI 直接输出排版好的文章？**

A: AI 天然擅长 Markdown，强迫它输出特定格式的纯文本反而效果不好。用代码控制排版更精准稳定。

**Q: 可以添加自定义主题吗？**

A: 可以！编辑 `wechat-format/scripts/themes.mjs`，按现有主题格式添加新主题即可。每个主题就是一组 CSS 属性字符串。

**Q: 粘贴到公众号后图片不显示？**

A: 文章中的图片标记 `![描述](generate)` 需要在公众号编辑器中手动替换为实际图片，或先用 AI 配图工具生成后替换 URL。

**Q: ai-daily-digest 需要安装什么？**

A: 无需手动安装依赖。脚本通过 `npx -y bun` 自动安装 Bun 运行时，`digest.ts` 是零依赖的纯 TypeScript 文件。只需提供一个 AI API Key 即可。

**Q: resume-analyzer 支持哪些文件格式？**

A: 支持 PDF（`.pdf`）和 Word（`.docx`）格式。也可以直接粘贴简历文本。注意扫描件 PDF 可能无法提取文本，建议使用 Word 版本。

**Q: 简历分析的人格推断准确吗？**

A: 大五人格分析基于简历文本的语言特征推断，仅供参考，不构成专业心理评估。每个维度的判断都会引用简历原文作为证据支撑。
