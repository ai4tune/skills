---
name: wechat-format
description: 将 Markdown 文章转为微信公众号兼容的 HTML。内置多套主题，输出带 inline CSS 的富文本，可直接粘贴到公众号编辑器。
---

# 公众号排版格式化技能

将标准 Markdown 文章转为**可直接粘贴到微信公众号编辑器**的带样式 HTML。

## 工作原理

微信公众号编辑器不支持 Markdown，但支持带 inline CSS 的富文本。本技能通过 Node.js 脚本完成转换：

```
Markdown → markdown-it 解析 → HTML → 注入 inline CSS → 微信兼容 HTML
```

## 使用方法

### 方式 1：命令行

```bash
# 安装依赖（首次）
cd scripts && npm install

# 转换文章（默认微信主题）
node scripts/format.mjs < article.md

# 指定主题
node scripts/format.mjs --theme=mac < article.md

# 输出到文件
node scripts/format.mjs --theme=medium < article.md > output.html
```

### 方式 2：AI 调用

在 wechat-write 完成写作后，自动调用本脚本转换。

## 可用主题

| 主题 ID | 名称 | 适合 |
|---------|------|------|
| `wechat` | 微信原生绿 | 通用，官方感 |
| `mac` | Mac 极简白 | 科技、日常 |
| `medium` | Medium 博客 | 生活、随笔 |

## 输出格式

输出为一段完整的 HTML，包含 `<section>` 根节点，所有样式以 inline CSS 形式内联。

用户只需：
1. 在浏览器打开 HTML 文件（或复制 HTML 内容）
2. 全选 → 复制
3. 粘贴到公众号编辑器

## 示例触发

- "帮我把这篇 Markdown 文章转成公众号格式"
- "用 Mac 主题格式化这篇文章"
- "把刚写好的文章转成可以粘贴到公众号的格式"
