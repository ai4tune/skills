# 文章输出结构化 Schema

> 借鉴 AutoContents 的 JSON Schema 模式。
> wechat-write 的输出必须严格遵循此结构，确保下游（排版、配图、发布）可靠消费。

## 输出结构

```yaml
article:
  title: "文章标题（≤30字）"
  summary: "摘要（≤60字）"
  content_type: "news|tools|topics|analysis|lifestyle|story"
  
  sections:
    - heading: "———\n🧭 小标题\n———"
      paragraphs:
        - type: "text"          # 正文段落（≤3行）
          content: "段落内容"
        - type: "emphasis"       # 强调块
          style: "🔥|⚠️|📌"    # 观点/重点/提示
          content: "强调内容"
        - type: "info_card"      # 信息卡片
          title: "📌 卡片标题"
          items: ["要点1", "要点2", "要点3"]
        - type: "image"          # AI 配图位
          style: "扁平插画"
          description: "图片内容描述"
          tone: "暖橙色"
        - type: "quote"          # 金句
          content: "金句内容"
          is_golden: true        # 是否为可独立传播的金句
        - type: "list"           # 列表
          items: ["条目1", "条目2", "条目3"]

  cover_image:
    style: "扁平插画"
    description: "封面图内容描述"
    tone: "暖橙色"
    ratio: "21:9"

  golden_quotes:
    - "金句1——可独立截图传播"
    - "金句2"

  call_to_action:
    type: "comment|follow|share|bookmark"
    prompt: "留言互动引导文案"

  metadata:
    word_count: 2136
    reading_time: "5分钟"
    category: "商业分析+情感共鸣"
    tags: ["AI", "变现", "智能体"]

  self_check:
    total_score: 42
    info_density: 8
    title_appeal: 9
    quote_quality: 7
    format_score: 9
    compliance: 9
    passed: true

  images:
    - position: "cover"
      prompt: "[📷 AI配图 | 风格：扁平插画 | 内容：封面描述 | 色调：暖橙]"
    - position: "after_section_1"
      prompt: "[📷 AI配图 | 风格：信息图 | 内容：数据对比 | 色调：蓝灰]"
    - position: "after_section_2"
      prompt: "[📷 AI配图 | 风格：场景插画 | 内容：场景描述 | 色调：暖色]"
```

## 段落类型说明

| type | 作用 | 排版规则 |
|------|------|---------|
| `text` | 正文段落 | ≤ 3 行，重要句子单独一行 |
| `emphasis` | 强调块 | `🔥/⚠️/📌 标签` + `>` 引用块 |
| `info_card` | 信息卡片 | `📌 标题` + 列表 |
| `image` | 配图位 | `[📷 AI配图 \| ...]` 标记 |
| `quote` | 金句/引用 | `>` 引用块 |
| `list` | 列表 | `-` 无序列表，≤ 5 条 |

## 强制校验规则

输出前自动校验，不通过则重写：

| 校验项 | 规则 | 不通过时 |
|--------|------|---------|
| 标题长度 | ≤ 30 字 | 自动截断 |
| 摘要长度 | ≤ 60 字 | 自动截断 |
| 段落长度 | 每个 `text` 段落 ≤ 3 行 | 自动拆分 |
| 强调块频率 | sections 中每 3 个段落至少 1 个非 text 元素 | 自动插入 |
| 配图数量 | 长文 ≥ 3 张（含封面） | 自动补充配图位 |
| 金句数量 | ≥ 2 条 | 自动提取 |
| CTA | 必须有且只有 1 个 | 自动添加 |
| 自检分数 | ≥ 35 | 触发重写 |
| HTML 标签 | 不允许 | 自动剥离 |

## 下游消费方式

| 消费方 | 读取字段 | 用途 |
|--------|---------|------|
| **排版引擎** | `sections[]` | 按 type 渲染排版元素 |
| **配图生成** | `images[]` + `cover_image` | 调用 AI 生成/Puppeteer 截图 |
| **发布系统** | `title` + `summary` + `metadata` | 填充草稿字段 |
| **自检系统** | `self_check` | 决定是否放行 |
| **多版本** | `golden_quotes` + `sections` | 裁剪出短文/朋友圈/口播版 |
