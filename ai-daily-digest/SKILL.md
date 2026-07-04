---
name: ai-daily-digest
description: 从 Karpathy 推荐的 90 个顶级技术博客抓取最新文章，Agent 自行完成 AI 评分筛选，生成每日精选日报。
---

# AI Daily Digest

从 Karpathy 推荐的 90 个热门技术博客中抓取最新文章，Agent 自行评分筛选并生成每日精选摘要。

## 命令

### `/digest`

运行每日摘要生成器。

**使用方式**: 输入 `/digest`，Agent 通过交互式引导收集参数后执行。

---

## 脚本目录

**重要**: 所有脚本位于此 skill 的 `scripts/` 子目录。

**Agent 执行说明**：
1. 确定此 SKILL.md 文件的目录路径为 `SKILL_DIR`
2. 脚本路径 = `${SKILL_DIR}/scripts/<script-name>.ts`

| 脚本 | 用途 |
|------|------|
| `scripts/digest.ts` | RSS 抓取脚本 - 抓取 90 个博客源，按时间过滤，输出 JSON |

---

## 配置持久化

配置文件路径: `~/.ai-daily-digest/config.json`

Agent 在执行前**必须检查**此文件是否存在：
1. 如果存在，读取并解析 JSON
2. 询问用户是否使用已保存配置
3. 执行完成后保存当前配置到此文件

**配置文件结构**：
```json
{
  "timeRange": 48,
  "topN": 15,
  "language": "zh",
  "lastUsed": "2026-03-25T12:00:00Z"
}
```

---

## 交互流程

### Step 0: 检查已保存配置

```bash
cat ~/.ai-daily-digest/config.json 2>/dev/null || echo "NO_CONFIG"
```

如果配置存在，询问是否复用：

```
🔧 检测到上次使用的配置：

• 时间范围: ${config.timeRange} 小时
• 精选数量: ${config.topN} 篇
• 输出语言: ${config.language === 'zh' ? '中文' : 'English'}

请选择：
1. ✅ 使用上次配置直接运行（推荐）
2. 🔄 重新配置
```

⛔️ **此处必须停下来等用户选择。**

### Step 1: 收集参数

依次询问以下参数（如果用户选择了复用配置则跳过）：

**时间范围：**
```
⏰ 抓取多长时间内的文章？

1. 24 小时 — 仅最近一天
2. 48 小时 — 最近两天，覆盖更全（推荐）
3. 72 小时 — 最近三天
4. 7 天 — 一周内的文章
```

**精选数量：**
```
📊 AI 筛选后保留多少篇？

1. 10 篇 — 精简版
2. 15 篇 — 标准推荐（推荐）
3. 20 篇 — 扩展版
```

**输出语言：**
```
🌐 摘要使用什么语言？

1. 中文（推荐）
2. English
```

### Step 2: 运行脚本抓取 RSS

运行脚本获取文章数据（JSON 格式）：

```bash
npx -y bun ${SKILL_DIR}/scripts/digest.ts \
  --hours <timeRange> \
  --output /tmp/digest-articles.json
```

脚本输出 JSON 结构：
```json
{
  "stats": {
    "totalFeeds": 90,
    "successFeeds": 85,
    "failedFeeds": 5,
    "totalArticles": 500,
    "filteredArticles": 46,
    "hours": 48
  },
  "articles": [
    {
      "title": "...",
      "link": "https://...",
      "pubDate": "2026-03-25T10:00:00.000Z",
      "description": "...",
      "sourceName": "simonwillison.net",
      "sourceUrl": "https://simonwillison.net"
    }
  ]
}
```

读取 `/tmp/digest-articles.json`，获取 `articles` 数组和 `stats` 对象。如果 `articles` 为空，告知用户并建议扩大时间范围。

### Step 3: Agent 完成 AI 评分

Agent 自行对文章进行多维度评分。**按每批 10 篇**处理所有文章。

对每批文章，Agent 内心执行以下评估（无需外部 API）：

**评分维度（1-10 整数）：**

| 维度 | 10 分 | 7-9 分 | 4-6 分 | 1-3 分 |
|------|-------|--------|--------|--------|
| 相关性 (relevance) | 所有技术人都应知道的重大突破 | 对大部分技术从业者有价值 | 对特定领域有价值 | 与技术行业关联不大 |
| 质量 (quality) | 深度分析，原创洞见 | 有深度，观点独到 | 信息准确，表达清晰 | 浅尝辄止或纯转述 |
| 时效性 (timeliness) | 正在发生的重大事件 | 近期热点相关 | 常青内容 | 过时 |

**分类标签**（必选其一）：
- `ai-ml`: AI、机器学习、LLM、深度学习
- `security`: 安全、隐私、漏洞、加密
- `engineering`: 软件工程、架构、编程语言、系统设计
- `tools`: 开发工具、开源项目、新库/框架
- `opinion`: 行业观点、个人思考、职业发展
- `other`: 其他

**关键词提取**：每篇 2-4 个英文关键词

按 `relevance + quality + timeliness` 总分排序，取 Top N 篇。

### Step 4: Agent 完成 AI 摘要

对 Step 3 筛选出的 Top N 篇文章，Agent 生成：

1. **中文标题** (titleZh): 将英文标题翻译为自然中文（原标题是中文则保持不变）
2. **摘要** (summary): 4-6 句结构化摘要：
   - 核心问题/主题（1 句）
   - 关键论点/技术方案/发现（2-3 句）
   - 结论/核心观点（1 句）
3. **推荐理由** (reason): 1 句话说明"为什么值得读"

摘要要求：
- 直接说重点，不要用"本文讨论了..."开头
- 包含具体技术名词、数据、方案名称
- 保留关键数字（性能提升百分比、用户数等）

### Step 5: Agent 生成并输出报告

Agent 按以下结构生成 Markdown 报告，写入 `./output/digest-YYYYMMDD.md`：

```markdown
# 📰 AI 博客每日精选 — YYYY-MM-DD

> 来自 Karpathy 推荐的 N 个顶级技术博客，AI 精选 Top M

## 📝 今日看点

（3-5 句宏观趋势总结，不逐篇列举，做宏观归纳，风格简洁有力像新闻导语）

---

## 🏆 今日必读

🥇 **中文标题**

[英文原标题](链接) — 来源 · 相对时间 · 分类emoji 分类名

> 摘要内容

💡 **为什么值得读**: 推荐理由

🏷️ keyword1, keyword2, keyword3

（重复 🥈 🥉）

---

## 📊 数据概览

| 扫描源 | 抓取文章 | 时间范围 | 精选 |
|:---:|:---:|:---:|:---:|
| 成功数/总数 | 总文章数 篇 → 过滤后文章数 篇 | Nh | **精选数 篇** |

### 分类分布

（用 Mermaid pie 图展示各分类文章数量）

### 高频关键词

（用 Mermaid xychart-beta 展示 top 12 高频关键词）

### 🏷️ 话题标签

keyword1(N) · keyword2(N) · ...

---

## 分类文章列表

（按分类分组展示所有精选文章，每篇含：中文标题、英文原标题链接、来源、相对时间、综合评分/30、摘要、关键词）

---

*生成于 ... | 扫描 N 源 → 获取 M 篇 → 精选 K 篇*
*基于 Hacker News Popularity Contest 2025 RSS 源列表，由 Andrej Karpathy 推荐*
*由「懂点儿AI」制作，欢迎关注同名微信公众号获取更多 AI 实用技巧 💡*
```

### Step 5b: 保存配置

```bash
mkdir -p ~/.ai-daily-digest
cat > ~/.ai-daily-digest/config.json << 'EOF'
{
  "timeRange": <hours>,
  "topN": <topN>,
  "language": "<zh|en>",
  "lastUsed": "<ISO timestamp>"
}
EOF
```

### Step 6: 结果展示

**成功时**：
- 📁 报告文件路径
- 📊 简要摘要：扫描源数、抓取文章数、精选文章数
- 🏆 **今日精选 Top 3 预览**：中文标题 + 一句话摘要

**失败时**：
- 显示错误信息
- 常见问题：网络问题、RSS 源不可用

---

## 参数映射

| 交互选项 | 脚本参数 |
|----------|----------|
| 24 小时 | `--hours 24` |
| 48 小时 | `--hours 48` |
| 72 小时 | `--hours 72` |
| 7 天 | `--hours 168` |

---

## 环境要求

- `bun` 运行时（通过 `npx -y bun` 自动安装）
- 网络访问（需要能访问 RSS 源）
- 无需任何 API Key（Agent 自行完成 AI 工作）

---

## 信息源

90 个 RSS 源来自 [Hacker News Popularity Contest 2025](https://refactoringenglish.com/tools/hn-popularity/)，由 [Andrej Karpathy 推荐](https://x.com/karpathy)。

包括：simonwillison.net, paulgraham.com, overreacted.io, gwern.net, krebsonsecurity.com, antirez.com, daringfireball.net 等顶级技术博客。

完整列表内嵌于脚本中。

---

## 故障排除

### "No articles fetched"
检查网络连接。脚本会跳过不可用的源并继续处理。

### "No articles found in time range"
尝试扩大时间范围（如从 24 小时改为 48 小时或 7 天）。

---

## 示例触发

- "帮我生成今天的 AI 资讯日报"
- "获取最近 24 小时的技术博客精选"
- "生成本周的 AI 技术摘要"
- `/digest`
