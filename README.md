# Routa della Fortuna

NSFW tag 随机老虎机。7 个维度，400+ tags，来源于 AO3、哔咔、DLsite 等主流网站。

## 两种用法

### 直接玩（无需安装）

打开 [`index.html`](index.html) 即可。可以部署到 GitHub Pages 或任何静态托管。

自定义标签保存在浏览器 localStorage 中。

### 部署版（AI 集成）

```bash
git clone https://github.com/YOUR_USERNAME/ero-slot.git
cd ero-slot
npm install
npm start
```

打开 `http://localhost:3000`。

#### API

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/dimensions` | GET | 获取所有维度和标签 |
| `/api/spin` | POST | 随机 spin，返回结果 |
| `/api/tags` | POST | 添加自定义标签（持久化） |
| `/api/report` | POST | 前端 spin 结果上报 |

**Spin 示例：**

```bash
curl -X POST http://localhost:3000/api/spin \
  -H "Content-Type: application/json" \
  -d '{"active":["position","scenario","props","roleplay","physical","mental"],"gore":false}'
```

**添加标签：**

```bash
curl -X POST http://localhost:3000/api/tags \
  -H "Content-Type: application/json" \
  -d '{"dimension":"position","zh":"新标签","en":"optional","ja":"optional"}'
```

#### AI 工具（MCP）

`mcp-server.js` 是一个 MCP stdio server，可以让 AI 直接调用 spin。

配置示例（`.mcp.json`）：

```json
{
  "mcpServers": {
    "ero_slot": {
      "command": "node",
      "args": ["/path/to/ero-slot/mcp-server.js"]
    }
  }
}
```

AI 可用工具：
- `ero_slot_spin` — 随机 spin，返回今晚的 recipe
- `ero_slot_dimensions` — 列出所有维度和标签数

#### Webhook 回调

设置 `CALLBACK_URL` 环境变量，spin 结果会自动 POST 到指定 URL：

```bash
CALLBACK_URL=https://your-webhook.com/receive npm start
```

## 七个维度

| # | 维度 | 说明 |
|---|------|------|
| 1 | 体位 · Entry | 身体的排列方式或者进入哪个入口 |
| 2 | 场景 · Scene | 在哪里，什么时间，谁可能推门进来 |
| 3 | 道具 · Props | 手边能拿到的东西。从专业的到即兴的 |
| 4 | 设定 · Role | 什么人，什么关系，什么故事 |
| 5 | 物理 · Body | 节奏、力度、什么时候允许高潮 |
| 6 | 精神 · Mind | 羞辱、夸奖、控制、服从 |
| 7 | GORE | ⚠ 极端虚构内容，默认锁定 |

## 自定义标签

每个标签包含三个字段：
- **中文**（必填）— 转轮上显示的文字
- **English**（选填）— MENU 卡片补充
- **日本語**（选填）— MENU 卡片补充

部署版的自定义标签持久化到 `src/tags.json`。静态版保存在浏览器 localStorage。

## License

MIT
