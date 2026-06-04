# Routa della Fortuna

Pick your wheels. Pull the lever. No refunds.

选好轮子，拉下拉杆，概不退换。

---

An NSFW tag randomizer styled as a luxury vintage slot machine. 7 dimensions, 450+ tags (zh/en/ja), sourced from AO3, Pixiv, DLsite & more. Use it in your browser, self-host it, or let your AI spin for you.

一台 NSFW 标签随机老虎机。7 个维度，450+ 标签（中/英/日三语），来源于 AO3、哔咔、DLsite 等主流网站。可以直接在浏览器里玩，也可以自部署接入 AI。

## Quick Start / 快速开始

Open [`index.html`](index.html) in your browser. Done.

浏览器打开 [`index.html`](index.html)，完事。

Deploy to GitHub Pages for a shareable link. Custom tags save to localStorage.

部署到 GitHub Pages 就能分享链接。自定义标签保存在浏览器 localStorage 里。

## Self-Host / 自部署（AI 集成）

```bash
git clone https://github.com/YOUR_USERNAME/routa-della-fortuna.git
cd routa-della-fortuna
npm install
npm start
```

Open `http://localhost:3000`. Hit **Send to AI** in the result card to forward results via webhook.

打开 `http://localhost:3000`。结果卡片里点 **Send to AI** 可以把结果转发给你的 AI。

Set `CALLBACK_URL` to receive spin results:

设置 `CALLBACK_URL` 接收 spin 结果：

```bash
CALLBACK_URL=https://your-ai-webhook.com/receive npm start
```

## API

```bash
# Spin
curl -X POST http://localhost:3000/api/spin \
  -H "Content-Type: application/json" \
  -d '{"active":["position","scenario","props","roleplay","physical","mental"],"gore":false}'

# Add a custom tag (only zh is required)
curl -X POST http://localhost:3000/api/tags \
  -H "Content-Type: application/json" \
  -d '{"dimension":"position","zh":"新标签"}'

# List all dimensions & tags
curl http://localhost:3000/api/dimensions
```

## MCP (AI Tool)

`mcp-server.js` is a stdio MCP server. Add it to your AI's config:

`mcp-server.js` 是 MCP stdio 工具服务器，加到你的 AI 配置里：

```json
{
  "mcpServers": {
    "ero_slot": {
      "command": "node",
      "args": ["/path/to/routa-della-fortuna/mcp-server.js"]
    }
  }
}
```

Tools / 可用工具：
- `ero_slot_spin` — spin the machine, get tonight's recipe / 摇老虎机
- `ero_slot_dimensions` — list all dimensions and tag counts / 列出维度和标签数

## Dimensions / 七个维度

| Wheel | What it decides |
|-------|----------------|
| 体位 ENTRY | How bodies arrange / 身体的排列方式或者进入哪个入口 |
| 场景 SCENE | Where, when, who might walk in / 在哪里，什么时间，谁可能推门进来 |
| 道具 PROPS | What's in your hands / 手边能拿到的东西，从冰块到绳子 |
| 设定 ROLE | Who you are to each other / 什么人，什么关系，什么故事 |
| 物理 BODY | What happens to the body / 节奏、力度、什么时候允许高潮 |
| 精神 MIND | What happens to the mind / 羞辱、夸奖、控制、服从 |
| ⚠ GORE | Past the point of no return / 仅限虚构场景，默认锁定 |

## License

MIT

## Credits

**Copper** — concept, design, tag curation, frontend

**Monday** — tag taxonomy, classification system, naming
