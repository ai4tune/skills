# 热点信息源配置

## 推荐信息源

### 科技 / AI 领域

| 来源 | URL | 抓取方式 | 更新频率 | 可信度 |
|------|-----|----------|----------|--------|
| 36 氪 | 36kr.com | RSS / Web | 实时 | ⚠️ 中 |
| 极客公园 | geekpark.net | RSS | 日更 | ✅ 高 |
| TechCrunch | techcrunch.com | RSS | 实时 | ✅ 高 |
| The Verge | theverge.com | RSS | 实时 | ✅ 高 |
| Hacker News | news.ycombinator.com | API | 实时 | ⚠️ 中 |
| Product Hunt | producthunt.com | API | 日更 | ⚠️ 中 |
| Google AI Blog | blog.google/technology/ai | RSS | 周更 | ✅ 高 |
| OpenAI Blog | openai.com/blog | RSS | 不定期 | ✅ 高 |
| Anthropic Blog | anthropic.com/news | RSS | 不定期 | ✅ 高 |

### 综合热点

| 来源 | URL | 抓取方式 | 更新频率 | 可信度 |
|------|-----|----------|----------|--------|
| 微博热搜 | weibo.com/hot | API / Web | 实时 | ❓ 低（需筛选） |
| 知乎热榜 | zhihu.com/hot | API | 实时 | ⚠️ 中 |
| 百度热搜 | top.baidu.com | Web | 实时 | ❓ 低（需筛选） |
| 今日头条 | toutiao.com | Web | 实时 | ⚠️ 中 |
| 澎湃新闻 | thepaper.cn | RSS | 实时 | ✅ 高 |

### 商业 / 财经

| 来源 | URL | 抓取方式 | 更新频率 | 可信度 |
|------|-----|----------|----------|--------|
| 虎嗅 | huxiu.com | RSS | 日更 | ⚠️ 中 |
| 晚点 LatePost | latepost.com | Web | 不定期 | ✅ 高 |
| 经济观察报 | eeo.com.cn | RSS | 日更 | ✅ 高 |

### 生活方式 / 消费

| 来源 | URL | 抓取方式 | 更新频率 | 可信度 |
|------|-----|----------|----------|--------|
| 小红书热门 | xiaohongshu.com | Web | 实时 | ❓ 低（需筛选） |
| 什么值得买 | smzdm.com | RSS | 实时 | ⚠️ 中 |

## CronJob 配置示例

```yaml
# 热点抓取定时任务配置
hot_topic_monitor:
  # 执行频率
  schedule: "0 7 * * *"        # 每天早上 7:00
  # schedule: "0 */6 * * *"    # 每 6 小时一次
  # schedule: "0 7,12,18 * * *" # 每天 7:00、12:00、18:00

  # 信息源（选择与你账号定位相关的）
  sources:
    - "36kr"
    - "techcrunch"
    - "zhihu_hot"
    - "weibo_hot"

  # 账号定位关键词
  positioning:
    domain: "AI 工具评测"
    keywords: ["AI", "人工智能", "ChatGPT", "效率工具", "自动化"]

  # 筛选规则
  filters:
    min_relevance: 0.6         # 最低相关度 60%
    exclude_categories:        # 排除类别
      - "娱乐八卦"
      - "体育赛事"
      - "明星绯闻"
    exclude_keywords:          # 排除关键词
      - "离婚"
      - "出轨"

  # 输出设置
  output:
    max_topics: 5              # 最多推荐 5 个
    include_source_link: true  # 包含原文链接
    include_heat_index: true   # 包含热度指数
```

## 热点时效性分类

| 标记 | 含义 | 建议行动 |
|------|------|----------|
| 🔥 **立即** | 热点正在爆发，窗口期 < 6 小时 | 快速出稿，抢时间差 |
| ⏰ **24h** | 热点持续发酵中，窗口期 1-2 天 | 深度分析，差异化角度 |
| 📅 **本周** | 行业报告/趋势类，窗口期 3-7 天 | 精心打磨，长文深度 |
| 🌿 **常青** | 非时效性话题，可长期积累 | 放入选题库，按需取用 |

## 自定义信息源

用户可以添加自定义信息源：

```yaml
custom_sources:
  - name: "我的行业群聊摘要"
    type: "manual"            # 手动输入
    description: "每天从行业群聊中摘录的有价值信息"

  - name: "竞品公众号"
    type: "wechat_monitor"    # 公众号监控
    accounts:
      - "竞品号A"
      - "竞品号B"
    track: "topics_only"      # 只追踪选题方向，不抄袭内容
```
