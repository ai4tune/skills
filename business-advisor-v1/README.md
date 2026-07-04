# 老板智囊（Business Advisor）Skill

`business-advisor-v1` 是一个 V0 研究型 skill，用来实现类似 ChatGPT Deep Research 的轻量 MVP，并在报告中给出更贴近企业经营的 AI 落地建议。

它不做爬虫、不做多 Agent、不做长期记忆。V0 只做四件事：

1. 接收老板的研究问题
2. 生成 Research Plan
3. 接收可选资料
4. 输出固定结构的 Markdown 商业研究报告

## 使用场景

老板输入：

```text
帮我研究天津木地板行业未来三年的趋势。
重点关注：竞争、价格、SPC地板机会、AI应用机会。
```

Skill 输出：

```text
# 一句话结论
# 市场概况
# 行业趋势
# 主要竞争者
# AI机会与落地建议
# 建议
# 风险与不确定性
# 来源
```

其中 `# AI机会与落地建议` 不只列想法，还会要求模型说明：

- 适合先切入的业务场景
- 第一阶段做法
- 需要准备的数据、流程或人员配合
- 2-4 周内如何验证效果
- 是否适合外部顾问陪跑或实施伙伴做轻量原型

## 本地运行

如果对方拿到的是 GitHub 仓库地址，最稳的话术是：

```text
请安装并使用这个 skill：<GitHub 地址>
先阅读 skills/business-advisor-v1/SKILL.md。
安装后帮我研究：天津木地板行业未来三年的趋势。
重点关注：竞争、价格、SPC地板机会、AI应用机会。
```

对 Codex / Claude Code / OpenClaw 这类代码 Agent，本质动作是：

1. clone 仓库
2. 读取 `SKILL.md`
3. 运行 dry-run 验证
4. 有 API Key 后运行正式报告

Dry-run，不调用模型，只检查输入并输出将发送给模型的提示词：

```bash
node skills/business-advisor-v1/scripts/run.mjs \
  --input skills/business-advisor-v1/examples/tianjin-flooring.input.json \
  --dry-run
```

如果当前目录已经在 `skills/business-advisor-v1` 内，也可以运行：

```bash
npm run dry-run
```

调用 OpenAI-compatible API：

```bash
OPENAI_API_KEY=your_key \
OPENAI_MODEL=gpt-4.1 \
node skills/business-advisor-v1/scripts/run.mjs \
  --input skills/business-advisor-v1/examples/tianjin-flooring.input.json
```

或者在 skill 目录内运行同一条命令的短路径：

```bash
OPENAI_API_KEY=your_key \
OPENAI_MODEL=gpt-4.1 \
node scripts/run.mjs --input examples/tianjin-flooring.input.json
```

如果使用自建 Gateway：

```bash
OPENAI_API_KEY=your_gateway_key \
OPENAI_BASE_URL=https://your-gateway.example.com/v1 \
OPENAI_MODEL=your_model \
node skills/business-advisor-v1/scripts/run.mjs \
  --input skills/business-advisor-v1/examples/tianjin-flooring.input.json
```

## Hermes 接入约定

Hermes 只需要把用户输入转成 `schemas/input.schema.json` 对应的 JSON，然后调用 `scripts/run.mjs` 或等价服务。

建议 Hermes 的安装逻辑按这个契约实现：

1. 从 GitHub clone skill 仓库或下载 zip。
2. 检查 `skill.json`、`SKILL.md`、`schemas/input.schema.json` 是否存在。
3. 运行 `npm run dry-run` 或 `node scripts/run.mjs --input examples/tianjin-flooring.input.json --dry-run`。
4. 把 skill 注册到 Hermes 的 Skill Center，入口命令为 `node scripts/run.mjs --input <input.json>`。

V0 输入最小字段：

```json
{
  "question": "帮我研究天津SPC地板未来三年的市场趋势",
  "focusAreas": ["竞争", "价格", "AI机会"]
}
```

V1 接入 Firecrawl 或 Tavily 后，把搜索结果注入 `sourceMaterials`：

```json
{
  "question": "帮我研究天津SPC地板未来三年的市场趋势",
  "focusAreas": ["竞争", "价格", "AI机会"],
  "sourceMaterials": [
    {
      "title": "资料标题",
      "url": "https://example.com",
      "content": "网页摘要或正文片段"
    }
  ]
}
```

## 设计边界

- V0 不保证事实完备，只保证结构化研究输出。
- 没有外部资料时，报告必须明确标注“未接入外部搜索”。
- 不允许模型编造真实来源链接。
- 不在 skill 内写死某个行业，木地板只是 Demo 场景。
- AI 落地建议必须克制，不能写成销售广告；只能把咨询陪跑、原型实施、系统接入作为可选路径之一。
