const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());

const TAGS_PATH = path.join(__dirname, "src", "tags.json");
function loadDimensions() {
  return JSON.parse(fs.readFileSync(TAGS_PATH, "utf-8"));
}

app.get("/api/dimensions", (_req, res) => {
  res.json(loadDimensions());
});

app.post("/api/spin", (req, res) => {
  const { active = [], gore = false } = req.body || {};
  const dims = loadDimensions();
  const results = [];

  for (const dim of dims) {
    if (dim.gore && !gore) continue;
    if (!dim.gore && !active.includes(dim.id)) continue;
    if (!dim.tags.length) continue;
    const tag = dim.tags[Math.floor(Math.random() * dim.tags.length)];
    results.push({ dimension: dim.id, short: dim.short, tag });
  }

  const payload = { results, timestamp: new Date().toISOString() };

  const callbackUrl = process.env.CALLBACK_URL;
  if (callbackUrl) {
    fetch(callbackUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});
  }

  res.json(payload);
});

app.post("/api/tags", (req, res) => {
  const { dimension, zh, en, ja } = req.body || {};
  if (!dimension || !zh) {
    return res.status(400).json({ error: "dimension and zh are required" });
  }
  const dims = loadDimensions();
  const dim = dims.find((d) => d.id === dimension);
  if (!dim) {
    return res.status(404).json({ error: "unknown dimension: " + dimension });
  }
  const tag = { zh, en: en || "", ja: ja || "" };
  dim.tags.push(tag);
  fs.writeFileSync(TAGS_PATH, JSON.stringify(dims, null, 2), "utf-8");
  res.json({ ok: true, tag, dimension, tagCount: dim.tags.length });
});

app.post("/api/report", (req, res) => {
  const payload = req.body;
  if (!payload || !payload.results) {
    return res.status(400).json({ error: "missing results" });
  }
  payload.timestamp = payload.timestamp || new Date().toISOString();
  payload.source = "browser";

  const callbackUrl = process.env.CALLBACK_URL;
  if (callbackUrl) {
    fetch(callbackUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});
  }

  res.json({ ok: true });
});

/* ---- MCP-compatible tool listing ---- */
app.get("/api/mcp/tools", (_req, res) => {
  res.json({
    tools: [
      {
        name: "ero_slot_spin",
        description:
          "Spin the Ruota della Fortuna slot machine. Returns a random tag per active dimension — tonight's recipe.",
        inputSchema: {
          type: "object",
          properties: {
            active: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "position",
                  "scenario",
                  "props",
                  "roleplay",
                  "physical",
                  "mental",
                ],
              },
              description:
                "Which dimensions to spin (1-6). Defaults to all 6 if omitted.",
            },
            gore: {
              type: "boolean",
              description:
                "Unlock the 7th extreme dimension. Default false.",
              default: false,
            },
          },
        },
      },
      {
        name: "ero_slot_dimensions",
        description:
          "List all available dimensions and their tags for the Ruota della Fortuna slot machine.",
        inputSchema: { type: "object", properties: {} },
      },
    ],
  });
});

app.post("/api/mcp/call", (req, res) => {
  const { name, arguments: args = {} } = req.body || {};
  const dims = loadDimensions();

  if (name === "ero_slot_dimensions") {
    const summary = dims.map((d) => ({
      id: d.id,
      label: d.full || d.short,
      tagCount: d.tags.length,
      gore: !!d.gore,
    }));
    return res.json({ result: summary });
  }

  if (name === "ero_slot_spin") {
    const allNonGore = dims.filter((d) => !d.gore).map((d) => d.id);
    const active = args.active && args.active.length ? args.active : allNonGore;
    const gore = !!args.gore;
    const results = [];

    for (const dim of dims) {
      if (dim.gore && !gore) continue;
      if (!dim.gore && !active.includes(dim.id)) continue;
      if (!dim.tags.length) continue;
      const tag = dim.tags[Math.floor(Math.random() * dim.tags.length)];
      results.push({ dimension: dim.id, short: dim.short, tag });
    }

    return res.json({
      result: {
        results,
        timestamp: new Date().toISOString(),
      },
    });
  }

  res.status(404).json({ error: "unknown tool: " + name });
});

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`ERO SLOT running on http://localhost:${PORT}`);
});
