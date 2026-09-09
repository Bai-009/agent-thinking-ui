// Agent Thinking UI. Every event, value and model message below is synthetic demo data.
(() => {
  "use strict";

  const stage = document.querySelector("#stage");
  const form = document.querySelector("#form");
  const input = document.querySelector("#input");
  const rerunButton = document.querySelector("#rerunBtn");
  const REDUCED_MOTION = Boolean(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);


  // The input stream and the reading-paced presentation queue advance independently.
  const AGENT_STREAM = [
  {
    "event": "demo.run.started",
    "data": {
      "status": "running",
      "message": "示例分析已开始。"
    }
  },
  {
    "event": "demo.session.title",
    "data": {
      "title": "示例团队月度费用比较"
    }
  },
  {
    "event": "demo.progress",
    "data": {
      "phase": "planning",
      "status": "running",
      "message": "准备比较两个月的团队费用。"
    }
  },
  {
    "event": "demo.plan.summary",
    "data": {
      "message": "先确认字段，再进行月度汇总。"
    }
  },
  {
    "event": "demo.progress",
    "data": {
      "phase": "collecting_evidence",
      "status": "running",
      "message": "Agent 第1轮：正在分析..."
    }
  },
  {
    "event": "demo.agent.thinking",
    "data": {
      "turn": 1,
      "delta": "需要比较示例团队在5月和6月的费用，先确认演示数据中的表和字段。"
    }
  },
  {
    "event": "demo.agent.llm.call",
    "data": {
      "turn": 1,
      "purpose": "schema_inspection",
      "model": "demo-model",
      "prompt_tokens": 1000,
      "completion_tokens": 100,
      "total_tokens": 1100,
      "latency_ms": 600,
      "status": "ok"
    }
  },
  {
    "event": "demo.agent.step",
    "data": {
      "turn": 1,
      "tool_name": "get_schema",
      "tool_input": "{\"tables\": [\"demo_teams\", \"demo_costs\"]}",
      "success": true,
      "summary": "## demo_teams\n  - id (INT) [PK]\n  - name (VARCHAR(64))\n\n## demo_costs\n  - id (INT) [PK]\n  - team_id (INT)\n  - category (VARCHAR(64))\n  - amount (DECIMAL)\n  - cost_date (DATE)",
      "latency_ms": 40
    }
  },
  {
    "event": "demo.progress",
    "data": {
      "phase": "collecting_evidence",
      "status": "running",
      "message": "Agent 第2轮：正在分析..."
    }
  },
  {
    "event": "demo.agent.thinking",
    "data": {
      "turn": 2,
      "delta": "字段可以支持按团队汇总月度费用，接下来分别查询5月和6月，比较变化。"
    }
  },
  {
    "event": "demo.agent.llm.call",
    "data": {
      "turn": 2,
      "purpose": "monthly_comparison",
      "model": "demo-model",
      "prompt_tokens": 1400,
      "completion_tokens": 200,
      "total_tokens": 1600,
      "latency_ms": 800,
      "status": "ok"
    }
  },
  {
    "event": "demo.agent.step",
    "data": {
      "turn": 2,
      "tool_name": "query_sql",
      "tool_input": "{\"sql\": \"SELECT t.name, SUM(c.amount) AS cost FROM demo_costs c JOIN demo_teams t ON c.team_id=t.id WHERE MONTH(cost_date)=6 AND YEAR(cost_date)=2026 GROUP BY t.name\", \"purpose\": \"6月各团队费用\"}",
      "success": true,
      "summary": "(3 rows)\n| name | cost |\n| 团队 A | 180000.00 |\n| 团队 B | 72000.00 |\n| 团队 C | 48000.00 |",
      "latency_ms": 30
    }
  },
  {
    "event": "demo.agent.step",
    "data": {
      "turn": 2,
      "tool_name": "query_sql",
      "tool_input": "{\"sql\": \"SELECT t.name, SUM(c.amount) AS cost FROM demo_costs c JOIN demo_teams t ON c.team_id=t.id WHERE MONTH(cost_date)=5 AND YEAR(cost_date)=2026 GROUP BY t.name\", \"purpose\": \"5月各团队费用\"}",
      "success": true,
      "summary": "(3 rows)\n| name | cost |\n| 团队 A | 120000.00 |\n| 团队 B | 60000.00 |\n| 团队 C | 40000.00 |",
      "latency_ms": 30
    }
  },
  {
    "event": "demo.agent.done",
    "data": {
      "reason": "complete",
      "turn_count": 2,
      "tool_calls": 3,
      "tool_errors": 0,
      "message": "示例分析完成，共2轮分析、3次工具调用。"
    }
  },
  {
    "event": "demo.answer.delta",
    "data": {
      "delta": "6月费用为300,000元，5月为220,000元，增加80,000元（36.4%）。"
    }
  },
  {
    "event": "demo.answer.final",
    "data": {
      "blocks": [
        {
          "type": "text",
          "content": "团队 A 费用增加60,000元，占总增量的75%。当前汇总不能说明具体费用类别的变化原因。"
        }
      ],
      "sql_results": [
        {
          "sql": "SELECT t.name, SUM(c.amount) AS cost FROM demo_costs c JOIN demo_teams t ON c.team_id=t.id WHERE MONTH(cost_date)=6 AND YEAR(cost_date)=2026 GROUP BY t.name",
          "columns": [
            "name",
            "cost"
          ],
          "column_descriptions": [
            "示例团队",
            "费用合计"
          ],
          "rows": [
            [
              "团队 A",
              180000
            ],
            [
              "团队 B",
              72000
            ],
            [
              "团队 C",
              48000
            ]
          ],
          "total_count": 3,
          "db_name": "demo_db",
          "table_names": [
            "demo_costs",
            "demo_teams"
          ],
          "round_question": "6月各团队费用"
        },
        {
          "sql": "SELECT t.name, SUM(c.amount) AS cost FROM demo_costs c JOIN demo_teams t ON c.team_id=t.id WHERE MONTH(cost_date)=5 AND YEAR(cost_date)=2026 GROUP BY t.name",
          "columns": [
            "name",
            "cost"
          ],
          "column_descriptions": [
            "示例团队",
            "费用合计"
          ],
          "rows": [
            [
              "团队 A",
              120000
            ],
            [
              "团队 B",
              60000
            ],
            [
              "团队 C",
              40000
            ]
          ],
          "total_count": 3,
          "db_name": "demo_db",
          "table_names": [
            "demo_costs",
            "demo_teams"
          ],
          "round_question": "5月各团队费用"
        }
      ],
      "rag_chunks": [],
      "limitations": [
        "仅有团队汇总，不能推断费用类别。"
      ],
      "next_actions": [
        "按费用类别进一步查询"
      ]
    }
  },
  {
    "event": "demo.trace.summary",
    "data": {
      "total_latency_ms": 1500,
      "llm_calls": 2,
      "total_tokens": 2700,
      "phases": [
        {
          "name": "schema_inspection",
          "latency_ms": 640,
          "status": "ok"
        },
        {
          "name": "monthly_comparison",
          "latency_ms": 860,
          "status": "ok"
        }
      ],
      "agent_summary": {
        "turn_count": 2,
        "tool_calls": 3,
        "tool_errors": 0,
        "done_reason": "complete"
      }
    }
  },
  {
    "event": "demo.run.completed",
    "data": {
      "status": "completed",
      "total_latency_ms": 1500
    }
  }
];

  // Fixed display projections for this fixture; no model is called to summarize it.
  const THINKING_COPY = new Map([
  [
    "需要比较示例团队在5月和6月的费用，先确认演示数据中的表和字段。",
    {
      "reaction": "先确认可用表与字段",
      "intent": "查看团队与费用表结构"
    }
  ],
  [
    "字段可以支持按团队汇总月度费用，接下来分别查询5月和6月，比较变化。",
    {
      "reaction": "字段足以支持月度比较",
      "intent": "查询 5 月和 6 月各团队费用"
    }
  ]
]);

  const GLYPH_D = "M59.6 5.9a50 22 0 1 1 0 44a50 22 0 1 1 0-44M59.6 15.9a40 12 0 1 0 0 24a40 12 0 1 0 0-24";
  const GLYPH_SVG = "<svg viewBox=\"0 0 119.2 55.9\" preserveAspectRatio=\"xMidYMid meet\"><path d=\"" + GLYPH_D + "\"/></svg>";
  const PATH_COLORS = ["#27fef2","#27fef2","#27fff2","#27fef2","#25faf2","#22e8f2","#1fd9f2","#1ccaf2","#18baf1","#18bbf1","#1ac7f1","#20def2","#22ebf2","#25f8f2","#27fff2","#27fef2","#27fff2","#27fff2","#26fcf2","#23eef2","#20def2","#1ccef1","#19bef1","#16b1f1","#14a7f1","#13a2f1","#129ef1","#119bf1","#1096f1","#119af1","#129ff1","#15aef1","#18bbf1","#17b9f0","#0e90e9","#22eaf2","#26fbf2","#27fbf2","#24f1f2","#20e1f2","#1dd5f2","#1ac5f2","#18baf1","#19bef1","#1ac4f1","#1bc9f1","#1dd0f1","#1ed2f2","#1ac6f1","#16b3f0","#0564e5","#0c87f2","#0d88f2","#0a79f1","#0668f0","#0359f0","#004af0","#004bf4","#004ef4","#0150f0","#0562f0","#0975f0","#0b7ff1","#0f90f2","#0d89f2","#15acf1","#13a4f1","#119bf1","#129df1","#13a0f1","#14aaf1","#17b4f1","#1ac4f1","#15aeef","#18b9f1","#15aaf1","#129ef1","#0e8df1","#0d89f1","#0a7cf2","#0a7cf1","#0b7cf2","#0b7ef1","#0c83f1","#0d88f2","#0e8df1","#1095f1","#12a1f1","#15aef1","#18bcf2","#1cccf1","#1fdaf2","#22e6f2","#26f9f2","#27fff2","#27fff2","#27fef2","#26fef2","#26fef2","#27fef2","#27fef2"];

  function colorAt(fraction) {
    const last = PATH_COLORS.length - 1;
    const value = Math.max(0, Math.min(1, fraction)) * last;
    const index = Math.floor(value);
    const mix = value - index;
    const rgb = (hex) => [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
    const start = rgb(PATH_COLORS[index]);
    const end = rgb(PATH_COLORS[Math.min(last, index + 1)]);
    return Math.round(start[0] + (end[0] - start[0]) * mix) + "," + Math.round(start[1] + (end[1] - start[1]) * mix) + "," + Math.round(start[2] + (end[2] - start[2]) * mix);
  }

  function startGlow(glyphEl) {
    if (REDUCED_MOTION) return;
    const path = glyphEl.querySelector("path");
    const lit = glyphEl.querySelector(".lit");
    const hot = glyphEl.querySelector(".hot");
    if (!path || !lit || !hot) return;

    const length = path.getTotalLength();
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    const width = 119.2;
    const height = 55.9;
    const contextOf = (canvas) => {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      const context = canvas.getContext("2d");
      context.scale(dpr, dpr);
      return context;
    };
    const litContext = contextOf(lit);
    const hotContext = contextOf(hot);
    const brand = document.createElement("canvas");
    const brandContext = contextOf(brand);
    const clipPath = new Path2D(path.getAttribute("d"));
    const paintBrand = () => {
      brandContext.save();
      brandContext.clip(clipPath);
      const gradient = brandContext.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#27fef2");
      gradient.addColorStop(1, "#2f6fed");
      brandContext.fillStyle = gradient;
      brandContext.fillRect(0, 0, width, height);
      brandContext.restore();
    };
    paintBrand();

    const radius = 20;
    const patch = document.createElement("canvas");
    patch.width = patch.height = radius * 2 * dpr;
    const patchContext = patch.getContext("2d");
    patchContext.scale(dpr, dpr);
    const keyTimes = [0, .3, .55, 1];
    const keyPoints = [0, .42, .62, 1];
    const curveX = (time) => 3 * time * (1 - time) * (1 - time) * .42 + 3 * time * time * (1 - time) * .58 + time * time * time;
    const curveY = (time) => 3 * time * time * (1 - time) * .58 + time * time * time;
    const ease = (input) => {
      let low = 0;
      let high = 1;
      for (let index = 0; index < 24; index += 1) {
        const middle = (low + high) / 2;
        if (curveX(middle) < input) low = middle;
        else high = middle;
      }
      return curveY((low + high) / 2);
    };
    const pace = (time) => {
      for (let segment = 0; segment < 3; segment += 1) {
        if (time <= keyTimes[segment + 1] || segment === 2) {
          const local = Math.min(1, Math.max(0, (time - keyTimes[segment]) / (keyTimes[segment + 1] - keyTimes[segment])));
          return keyPoints[segment] + (keyPoints[segment + 1] - keyPoints[segment]) * ease(local);
        }
      }
      return 1;
    };
    const fade = (context, amount) => {
      context.globalCompositeOperation = "destination-in";
      context.fillStyle = "rgba(0,0,0," + amount + ")";
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = "source-over";
    };
    const blob = (context, blobRadius, rgb, alpha) => {
      const gradient = context.createRadialGradient(0, 0, 0, 0, 0, blobRadius);
      gradient.addColorStop(0, "rgba(" + rgb + "," + alpha + ")");
      gradient.addColorStop(1, "rgba(" + rgb + ",0)");
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(0, 0, blobRadius, 0, Math.PI * 2);
      context.fill();
    };

    const duration = 4500;
    const frameDuration = 1000 / 60;
    let beganAt = null;
    let previousAt = null;
    const frame = (now) => {
      if (!glyphEl.isConnected) return;
      if (beganAt === null) {
        beganAt = now;
        previousAt = now;
      }
      const steps = Math.min(4, Math.max(0, (now - previousAt) / frameDuration));
      previousAt = now;
      const position = pace(((now - beganAt) % duration) / duration);
      fade(litContext, Math.pow(.98, steps));
      fade(hotContext, Math.pow(.9, steps));
      const point = path.getPointAtLength(position * length);
      const next = path.getPointAtLength((position * length + 2) % length);
      const angle = Math.atan2(next.y - point.y, next.x - point.x);

      patchContext.clearRect(0, 0, radius * 2, radius * 2);
      patchContext.drawImage(brand, -(point.x - radius), -(point.y - radius), width, height);
      patchContext.globalCompositeOperation = "destination-in";
      const mask = patchContext.createRadialGradient(radius, radius, 0, radius, radius, radius);
      mask.addColorStop(0, "rgba(0,0,0,1)");
      mask.addColorStop(1, "rgba(0,0,0,0)");
      patchContext.fillStyle = mask;
      patchContext.fillRect(0, 0, radius * 2, radius * 2);
      patchContext.globalCompositeOperation = "source-atop";
      const hx = radius + Math.cos(angle) * 3;
      const hy = radius + Math.sin(angle) * 3;
      const highlight = patchContext.createRadialGradient(hx, hy, 0, hx, hy, radius * .55);
      highlight.addColorStop(0, "rgba(255,255,255,.32)");
      highlight.addColorStop(1, "rgba(255,255,255,0)");
      patchContext.fillStyle = highlight;
      patchContext.fillRect(0, 0, radius * 2, radius * 2);
      patchContext.globalCompositeOperation = "source-over";
      litContext.drawImage(patch, point.x - radius, point.y - radius, radius * 2, radius * 2);

      hotContext.save();
      hotContext.translate(point.x, point.y);
      hotContext.rotate(angle);
      hotContext.globalCompositeOperation = "lighter";
      blob(hotContext, 4, colorAt(position), .32);
      blob(hotContext, 2, "255,255,255", .8);
      hotContext.restore();
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function safeJson(value) {
    try { return JSON.stringify(value, null, 2); }
    catch (_) { return String(value); }
  }

  function parseToolInput(value) {
    if (!value || typeof value !== "string") return {};
    try { return JSON.parse(value); }
    catch (_) { return {}; }
  }


  function formatTokens(value) {
    return Number.isFinite(Number(value)) ? Number(value).toLocaleString("en-US") : null;
  }

  function stepFacts(event) {
    const data = event.data || {};
    const input = parseToolInput(data.tool_input);
    const rows = [["工具", data.tool_name]];
    if (data.tool_name === "get_schema") {
      const tables = Array.isArray(input.tables) ? input.tables : [];
      if (tables.length) rows.push(["输入", tables.join("、")]);
      rows.push(["返回", data.success === false ? "未完成" : tables.length + " 张表的字段结构"]);
    } else {
      if (input.purpose) rows.push(["目的", input.purpose]);
      const count = rowCount(data.summary);
      rows.push(["返回", data.success === false ? "未完成" : count === null ? "已完成" : count + " 行"]);
    }
    if (Number.isFinite(Number(data.latency_ms))) rows.push(["耗时", data.latency_ms + " ms"]);
    return rows;
  }


  function llmFacts(event) {
    const data = event.data || {};
    const rows = [["模型", data.model || "未提供"]];
    const inputTokens = formatTokens(data.prompt_tokens);
    const outputTokens = formatTokens(data.completion_tokens);
    const totalTokens = formatTokens(data.total_tokens);
    const cached = formatTokens(data.cached_tokens);
    if (inputTokens) rows.push(["输入", inputTokens + " tokens"]);
    if (outputTokens) rows.push(["输出", outputTokens + " tokens"]);
    if (totalTokens) rows.push(["合计", totalTokens + " tokens"]);
    if (cached && Number(data.prompt_tokens) > 0) rows.push(["缓存命中", Math.round(Number(data.cached_tokens) / Number(data.prompt_tokens) * 100) + "%（" + cached + " tokens）"]);
    if (Number.isFinite(Number(data.latency_ms))) rows.push(["耗时", data.latency_ms + " ms"]);
    return rows;
  }

  function processFacts(process) {
    const step = [...process.events].reverse().find((event) => event.data && event.data.tool_name);
    if (step) return stepFacts(step);
    return [["记录", "共 " + process.events.length + " 条原始事件，完整内容见工程记录"]];
  }

  function llmCallsOf(generation) {
    const seen = new Set();
    const calls = [];
    const collect = (event) => {
      if (event && event.event === "demo.agent.llm.call" && !seen.has(event)) {
        seen.add(event);
        calls.push(event);
      }
    };
    generation.pendingEvents.forEach(collect);
    generation.intents.forEach((intent) => intent.processes.forEach((process) => process.events.forEach(collect)));
    return calls;
  }

  function eventTurn(event) {
    if (Number.isFinite(Number(event.data && event.data.turn))) return Number(event.data.turn);
    const match = /第\s*(\d+)\s*轮/.exec((event.data && event.data.message) || "");
    return match ? Number(match[1]) : null;
  }

  function thinkingProjection(_turn, delta) {
    const source = String(delta || "").trim();
    if (THINKING_COPY.has(source)) return THINKING_COPY.get(source);
    const sentences = source.split(/[。！？]/).map((item) => item.trim()).filter(Boolean);
    return {
      reaction: sentences[0] || source,
      intent: sentences.slice(1).join("。")
    };
  }

  function stepIdentity(event, order) {
    const data = event.data || {};
    const input = parseToolInput(data.tool_input);
    const externalId = data.call_id || data.tool_call_id || data.id;
    if (externalId) return "call-" + externalId;
    if (data.tool_name === "get_schema") return "schema";
    if (input.purpose === "6月各团队费用") return "june-cost";
    if (input.purpose === "5月各团队费用") return "may-cost";
    const purpose = input.purpose || input.table || input.tables;
    return "step-" + data.turn + "-" + data.tool_name + "-" + (purpose ? String(purpose).replace(/[^\w\u4e00-\u9fff]+/g, "-") : order);
  }

  function rowCount(summary) {
    const match = /^\((\d+) rows?\)/.exec(String(summary || "").trim());
    return match ? Number(match[1]) : null;
  }

  function processCopy(event) {
    const data = event.data || {};
    const input = parseToolInput(data.tool_input);
    if (data.tool_name === "get_schema") {
      return data.success === false ? "查看表结构——未完成" : "查看团队与费用表结构——已返回两张表字段结构";
    }
    if (input.purpose) {
      const count = rowCount(data.summary);
      const action = "查询 " + input.purpose;
      if (data.success === false) return action + "——未完成";
      return count === null ? action : action + "——已返回 " + count + " 行";
    }
    return data.success === false ? "执行查询——未完成" : "完成一次数据查询";
  }

  // Event ownership stays with its analysis generation, including late arrivals.
  class TraceStore {
    constructor(question) {
      this.question = question;
      this.generations = [];
      this.byId = new Map();
      this.latestByTurn = new Map();
      this.listeners = new Set();
      this.orphanEvents = [];
      this.pendingByTurn = new Map();
      this.thinkingBuffers = new Map();
      this.terminal = null;
      this.answerFinal = null;
      this.eventOrder = 0;
      this.generationOrder = 0;
    }

    subscribe(listener) {
      this.listeners.add(listener);
      return () => this.listeners.delete(listener);
    }

    emit(change) {
      this.listeners.forEach((listener) => listener(change));
    }

    generationFor(turn) {
      return this.latestByTurn.get(Number(turn));
    }

    lastProcess(generation) {
      const intent = generation && generation.intents[generation.intents.length - 1];
      return intent && intent.processes[intent.processes.length - 1];
    }

    queueForTurn(turn, event) {
      const queued = this.pendingByTurn.get(turn) || [];
      queued.push(event);
      this.pendingByTurn.set(turn, queued);
    }

    attachEvent(generation, event) {
      const process = this.lastProcess(generation);
      if (process) process.events.push(event);
      else generation.pendingEvents.push(event);
    }

    flushPending(generation, process) {
      process.events.push(...generation.pendingEvents);
      generation.pendingEvents.length = 0;
    }

    generationId(turn) {
      const base = Number.isFinite(turn) ? "turn-" + turn : "run";
      if (!this.byId.has(base)) return base;
      let suffix = 2;
      while (this.byId.has(base + "-n" + suffix)) suffix += 1;
      return base + "-n" + suffix;
    }

    consumeThinking(event) {
      const turn = Number(event.data.turn);
      const data = event.data || {};
      const explicitStreaming = data.done === false || data.final === false || data.is_final === false || data.status === "streaming";
      const explicitFinal = data.done === true || data.final === true || data.is_final === true || data.status === "completed" || data.status === "done";
      if (!explicitStreaming && !explicitFinal) return { text: String(data.delta || ""), events: [event] };

      const buffered = this.thinkingBuffers.get(turn) || { text: "", events: [] };
      buffered.text += String(data.delta || "");
      buffered.events.push(event);
      if (!explicitFinal) {
        this.thinkingBuffers.set(turn, buffered);
        return null;
      }
      this.thinkingBuffers.delete(turn);
      return buffered;
    }

    createGeneration(event, sourceText, sourceEvents) {
      const turn = Number(event.data.turn);
      const projection = thinkingProjection(turn, sourceText);
      const previous = this.generations[this.generations.length - 1];
      if (previous) previous.sourceClosed = true;
      const id = this.generationId(turn);
      const firstForFixtureTurn = !this.latestByTurn.has(turn);
      const intentId = firstForFixtureTurn && turn === 1 ? "inspect-schema" : firstForFixtureTurn && turn === 2 ? "compare-months" : "intent-" + id + "-1";
      const queued = this.pendingByTurn.get(turn) || [];
      const generation = {
        id,
        sequence: ++this.generationOrder,
        turn,
        reaction: projection.reaction,
        intents: [{ id: intentId, text: projection.intent, processes: [] }],
        pendingEvents: [...this.orphanEvents, ...queued.filter((item) => item.event !== "demo.agent.step"), ...sourceEvents],
        sourceClosed: false,
        leftFrontier: false
      };
      this.orphanEvents.length = 0;
      this.pendingByTurn.delete(turn);
      this.generations.push(generation);
      this.byId.set(generation.id, generation);
      this.latestByTurn.set(turn, generation);
      return { generation, queuedSteps: queued.filter((item) => item.event === "demo.agent.step") };
    }

    updateIntent(generation, projection, sourceEvents) {
      const current = generation.intents[generation.intents.length - 1];
      if (projection.intent && projection.intent !== current.text) {
        generation.intents.push({
          id: "intent-" + generation.id + "-" + (generation.intents.length + 1),
          text: projection.intent,
          processes: []
        });
      }
      generation.pendingEvents.push(...sourceEvents);
    }

    attachByTurn(turn, event) {
      const generation = turn ? this.generationFor(turn) : this.generations[this.generations.length - 1];
      if (generation) this.attachEvent(generation, event);
      else if (turn) this.queueForTurn(turn, event);
      else this.orphanEvents.push(event);
      return generation;
    }

    addStep(event) {
      const turn = Number(event.data.turn);
      const generation = this.generationFor(turn);
      if (!generation) {
        this.queueForTurn(turn, event);
        this.emit({ type: "archive", generation: null });
        return;
      }
      const intent = generation.intents[generation.intents.length - 1];
      const id = stepIdentity(event, ++this.eventOrder);
      let ownerIntent = generation.intents.find((candidate) => candidate.processes.some((item) => item.id === id));
      let process = ownerIntent && ownerIntent.processes.find((item) => item.id === id);
      if (!process) {
        ownerIntent = intent;
        process = { id, text: processCopy(event), events: [], deposited: false };
        this.flushPending(generation, process);
        ownerIntent.processes.push(process);
      } else {
        process.text = processCopy(event);
      }
      process.events.push(event);
      this.emit({ type: "process", generation, intent: ownerIntent, process });
    }

    materializeTerminalArchive(event) {
      if (this.generations.length) return;
      const bufferedEvents = Array.from(this.thinkingBuffers.values()).flatMap((buffer) => buffer.events);
      const queuedEvents = Array.from(this.pendingByTurn.values()).flat();
      const events = [...this.orphanEvents, ...queuedEvents, ...bufferedEvents];
      if (event && !events.includes(event)) events.push(event);
      const generation = {
        id: this.generationId(NaN),
        sequence: ++this.generationOrder,
        turn: null,
        reaction: "未形成可核验结论",
        intents: [{
          id: "terminal-state",
          text: "运行未进入可核验步骤",
          processes: [{ id: "run-state", text: "保留实际运行状态", events, deposited: false }]
        }],
        pendingEvents: [],
        sourceClosed: true,
        leftFrontier: false
      };
      this.orphanEvents.length = 0;
      this.pendingByTurn.clear();
      this.thinkingBuffers.clear();
      this.generations.push(generation);
      this.byId.set(generation.id, generation);
    }

    terminalFrom(event) {
      const status = (event.data && event.data.status) || "failed";
      this.materializeTerminalArchive(event);
      this.generations.forEach((generation) => { generation.sourceClosed = true; });
      this.terminal = {
        status,
        hasAnswer: status === "completed" && Boolean(this.answerFinal),
        event
      };
      this.emit({ type: "terminal", terminal: this.terminal });
    }

    apply(event) {
      const turn = eventTurn(event);
      switch (event.event) {
        case "demo.agent.thinking": {
          const committed = this.consumeThinking(event);
          if (!committed) {
            this.emit({ type: "archive", generation: this.generationFor(Number(event.data.turn)) || null });
            break;
          }
          const turnNumber = Number(event.data.turn);
          const projection = thinkingProjection(turnNumber, committed.text);
          const existing = this.generationFor(turnNumber);
          if (existing && existing.reaction === projection.reaction && !existing.sourceClosed) {
            this.updateIntent(existing, projection, committed.events);
            this.emit({ type: "generation-update", generation: existing });
            break;
          }
          const created = this.createGeneration(event, committed.text, committed.events);
          this.emit({ type: "generation", generation: created.generation });
          created.queuedSteps.forEach((step) => this.addStep(step));
          break;
        }
        case "demo.agent.step":
          this.addStep(event);
          break;
        case "demo.answer.final":
          this.answerFinal = event;
          if (this.terminal && this.terminal.status === "completed") this.terminal.hasAnswer = true;
          this.attachByTurn(turn, event);
          this.emit({ type: "archive", generation: this.generations[this.generations.length - 1] || null });
          break;
        case "demo.run.completed":
          this.attachByTurn(turn, event);
          this.terminalFrom(event);
          break;
        case "demo.run.cancelled":
        case "demo.run.failed":
          this.attachByTurn(turn, event);
          this.terminalFrom(event);
          break;
        default:
          this.attachByTurn(turn, event);
          this.emit({ type: "archive", generation: this.generations[this.generations.length - 1] || null });
      }
    }

    finishInput() {
      if (this.terminal) return;
      this.materializeTerminalArchive(null);
      this.generations.forEach((generation) => { generation.sourceClosed = true; });
      this.terminal = { status: "missing", hasAnswer: false, event: null };
      this.emit({ type: "terminal", terminal: this.terminal });
    }
  }

  function readingGate(kind, text) {
    const count = Array.from(text || "").length;
    const rules = {
      l0: { base: 420, per: 20, min: 850, max: 1500 },
      l1: { base: 250, per: 18, min: 600, max: 1050 },
      l2: { base: 200, per: 16, min: 450, max: 850 }
    }[kind];
    return Math.max(rules.min, Math.min(rules.max, rules.base + rules.per * count));
  }

  class Run {
    constructor() {
      this.cancelled = false;
      this.waits = new Set();
    }
    sleep(milliseconds) {
      return new Promise((resolve) => {
        if (this.cancelled) {
          resolve(false);
          return;
        }
        const record = {
          id: window.setTimeout(() => {
            this.waits.delete(record);
            resolve(!this.cancelled);
          }, milliseconds),
          resolve
        };
        this.waits.add(record);
      });
    }
    cancel() {
      this.cancelled = true;
      this.waits.forEach((record) => {
        window.clearTimeout(record.id);
        record.resolve(false);
      });
      this.waits.clear();
    }
  }

  function createMark() {
    const mark = el("span", "thinking-mark");
    mark.setAttribute("aria-hidden", "true");
    const glyph = el("span", "trace-glyph");
    glyph.innerHTML = GLYPH_SVG;
    const lit = document.createElement("canvas");
    lit.className = "lit";
    const hot = document.createElement("canvas");
    hot.className = "hot";
    glyph.append(lit, hot);
    mark.appendChild(glyph);
    mark._glyph = glyph;
    return mark;
  }


  const ICON_COPY = "<svg viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"5.5\" y=\"5.5\" width=\"8\" height=\"8\" rx=\"1.5\"/><path d=\"M3.5 10.5A1.5 1.5 0 0 1 2 9V3.5A1.5 1.5 0 0 1 3.5 2H9a1.5 1.5 0 0 1 1.5 1.5\"/></svg>";
  const ICON_TICK = "<svg viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 8.5 6.5 12 13 4.5\"/></svg>";
  const ICON_CODE = "<svg viewBox=\"0 0 16 16\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M5 4.5 1.8 8 5 11.5\"/><path d=\"M11 4.5 14.2 8 11 11.5\"/><path d=\"M9.2 3 6.8 13\"/></svg>";

  let devDrawer = null;

  function buildDevDrawer() {
    const scrim = el("div", "dev-scrim");
    scrim.hidden = true;
    scrim.addEventListener("click", closeDevDrawer);
    const root = el("aside", "dev-drawer");
    root.hidden = true;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-label", "工程记录");
    const head = el("div", "dev-head");
    head.appendChild(el("span", "dev-title", "工程记录"));
    const close = el("button", "dev-close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "关闭工程记录");
    close.addEventListener("click", closeDevDrawer);
    head.appendChild(close);
    const body = el("div", "dev-body");
    const summaryEvent = AGENT_STREAM.find((item) => item.event === "demo.trace.summary");
    if (summaryEvent) {
      const data = summaryEvent.data;
      body.appendChild(el("p", "dev-summary",
        "总耗时 " + (data.total_latency_ms / 1000) + " s · LLM 调用 " + data.llm_calls + " 次 · tokens " + formatTokens(data.total_tokens) +
        "。以下为本轮全部模拟事件，共 " + AGENT_STREAM.length + " 条原始事件。"));
    }
    AGENT_STREAM.forEach((event, index) => {
      const section = el("section", "dev-event");
      const headRow = el("div", "dev-event-head");
      headRow.append(el("span", "dev-index", String(index + 1).padStart(2, "0")), el("span", "dev-name", event.event));
      section.append(headRow, el("pre", "", safeJson(event.data)));
      body.appendChild(section);
    });
    root.append(head, body);
    document.body.append(scrim, root);
    return { scrim, root };
  }

  function openDevDrawer() {
    if (!devDrawer) devDrawer = buildDevDrawer();
    devDrawer.scrim.hidden = false;
    devDrawer.root.hidden = false;
    requestAnimationFrame(() => {
      devDrawer.scrim.classList.add("open");
      devDrawer.root.classList.add("open");
    });
  }

  function closeDevDrawer() {
    if (!devDrawer) return;
    devDrawer.scrim.classList.remove("open");
    devDrawer.root.classList.remove("open");
    window.setTimeout(() => {
      if (devDrawer && !devDrawer.root.classList.contains("open")) {
        devDrawer.scrim.hidden = true;
        devDrawer.root.hidden = true;
      }
    }, REDUCED_MOTION ? 0 : 250);
  }

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDevDrawer();
  });

  class TraceView {
    constructor(host, run, store) {
      this.host = host;
      this.run = run;
      this.store = store;
      this.visibleGeneration = null;
      this.visibleIntent = null;
      this.visibleRows = new Map();
      this.depositedRows = new Set();
      this.completed = false;
      this.archive = null;
      this.archiveToggle = null;
      this.archiveBranches = new Map();
      this.expandedBranches = new Set();
      this.evidenceKeys = new Set();

      this.root = el("section", "trace");
      this.root.setAttribute("aria-label", "AI 执行过程");
      this.head = el("div", "trace-head");
      this.mark = createMark();
      this.copy = el("span", "head-copy");
      this.reaction = el("span", "reaction");
      this.intent = el("span", "intent");
      this.copy.append(this.reaction, this.intent);
      this.head.append(this.mark, this.copy);
      this.processList = el("ol", "process-list");
      this.processList.setAttribute("aria-label", "当前实际过程");
      this.status = el("span", "sr-only");
      this.status.setAttribute("role", "status");
      this.status.setAttribute("aria-live", "polite");
      this.status.setAttribute("aria-atomic", "true");
      this.root.append(this.head, this.processList, this.status);
      host.appendChild(this.root);
      startGlow(this.mark._glyph);
      this.store.subscribe(() => {
        if (this.completed && this.archive) this.renderArchive(!this.archive.hidden);
      });
    }

    announce(text) {
      this.status.textContent = "";
      window.setTimeout(() => {
        if (!this.run.cancelled) this.status.textContent = text;
      }, REDUCED_MOTION ? 0 : 12);
    }

    async swapGeneration(update) {
      this.copy.classList.add("changing");
      this.processList.classList.add("changing");
      if (!(await this.run.sleep(REDUCED_MOTION ? 0 : 145))) return false;
      update();
      this.copy.classList.add("entering");
      this.processList.classList.add("entering");
      this.copy.classList.remove("changing");
      this.processList.classList.remove("changing");
      if (!(await this.run.sleep(REDUCED_MOTION ? 0 : 73))) return false;
      this.copy.classList.remove("entering");
      this.processList.classList.remove("entering");
      return true;
    }

    async swapIntent(update) {
      this.intent.classList.add("changing");
      this.processList.classList.add("changing");
      if (!(await this.run.sleep(REDUCED_MOTION ? 0 : 145))) return false;
      update();
      this.intent.classList.add("entering");
      this.processList.classList.add("entering");
      this.intent.classList.remove("changing");
      this.processList.classList.remove("changing");
      if (!(await this.run.sleep(REDUCED_MOTION ? 0 : 73))) return false;
      this.intent.classList.remove("entering");
      this.processList.classList.remove("entering");
      return true;
    }

    resetProcessWindow(deposit) {
      if (deposit) this.visibleRows.forEach((_, id) => this.depositedRows.add(id));
      this.processList.replaceChildren();
      this.visibleRows.clear();
    }

    async showGeneration(generation) {
      this.root.classList.add("visible");
      const changed = this.visibleGeneration && this.visibleGeneration.id !== generation.id;
      if (changed && !(await this.swapGeneration(() => {
        this.resetProcessWindow(false);
        this.depositedRows.clear();
        this.reaction.textContent = generation.reaction;
        this.intent.textContent = "";
      }))) return false;
      if (!changed && !this.visibleGeneration) {
        this.resetProcessWindow(false);
        this.reaction.textContent = generation.reaction;
        this.intent.textContent = "";
      }
      this.visibleGeneration = generation;
      this.visibleIntent = null;
      this.announce("AI 的反应：" + generation.reaction);
      return true;
    }

    async showIntent(generation, intent) {
      if (!this.visibleGeneration || this.visibleGeneration.id !== generation.id) return false;
      if (this.visibleIntent && this.visibleIntent.id !== intent.id) {
        if (!(await this.swapIntent(() => {
          this.resetProcessWindow(true);
          this.intent.textContent = intent.text;
        }))) return false;
      } else {
        this.intent.textContent = intent.text;
      }
      this.visibleIntent = intent;
      this.announce("接下来：" + intent.text);
      return true;
    }

    async addProcess(generation, intent, process) {
      if (!this.visibleGeneration || this.visibleGeneration.id !== generation.id || !this.visibleIntent || this.visibleIntent.id !== intent.id) return true;
      if (this.depositedRows.has(process.id)) return true;
      const existing = this.visibleRows.get(process.id);
      if (existing) {
        if (existing.copy.textContent === process.text) return true;
        existing.copy.classList.add("changing");
        if (!(await this.run.sleep(REDUCED_MOTION ? 0 : 120))) return false;
        existing.copy.textContent = process.text;
        existing.copy.classList.add("entering");
        existing.copy.classList.remove("changing");
        if (!(await this.run.sleep(REDUCED_MOTION ? 0 : 73))) return false;
        existing.copy.classList.remove("entering");
        this.announce(process.text);
        return true;
      }

      while (this.visibleRows.size >= 3) {
        const oldest = this.processList.firstElementChild;
        if (!oldest) break;
        const oldestId = oldest.dataset.processId;
        this.depositedRows.add(oldestId);
        oldest.classList.add("leaving");
        if (!(await this.run.sleep(145))) return false;
        this.visibleRows.delete(oldestId);
        oldest.remove();
      }

      const rowNode = el("li", "process-row");
      rowNode.dataset.processId = process.id;
      const marker = el("span", "process-marker", "·");
      marker.setAttribute("aria-hidden", "true");
      const copy = el("span", "process-copy", process.text);
      rowNode.append(marker, copy);
      this.processList.appendChild(rowNode);
      this.visibleRows.set(process.id, { node: rowNode, copy });
      window.setTimeout(() => rowNode.classList.add("visible"), REDUCED_MOTION ? 0 : 16);
      this.announce(process.text);
      return true;
    }

    branch(key, button, marker, target, section, property) {
      const open = this.expandedBranches.has(key);
      target.hidden = !open;
      marker.textContent = open ? "▾" : "▸";
      button.setAttribute("aria-expanded", String(open));
      const record = { key, button, marker, target, section, property };
      button.addEventListener("click", () => this.setBranch(record, target.hidden));
      this.archiveBranches.set(key, record);
      return record;
    }

    setBranch(branch, open) {
      branch.target.hidden = !open;
      branch.marker.textContent = open ? "▾" : "▸";
      branch.button.setAttribute("aria-expanded", String(open));
      if (open) this.expandedBranches.add(branch.key);
      else this.expandedBranches.delete(branch.key);
    }


    archiveLeaf(section, key, text, facts) {
      const button = el("button", "tree-row");
      button.type = "button";
      const marker = el("span", "tree-marker", "▸");
      marker.setAttribute("aria-hidden", "true");
      button.append(marker, el("span", "", text));
      const detail = el("div", "archive-detail");
      detail.id = "archive-" + key.replace(/[^\w-]+/g, "-");
      const list = el("dl", "call-facts");
      facts.forEach(([term, value]) => list.append(el("dt", "", term), el("dd", "", String(value))));
      detail.appendChild(list);
      button.setAttribute("aria-controls", detail.id);
      if (this.evidenceKeys.has(key)) section.classList.add("evidence-target");
      this.branch(key, button, marker, detail, section, "detail");
      section.append(button, detail);
    }


    renderArchive(open) {
      const archive = el("div", "archive-tree");
      archive.hidden = !open;
      archive.setAttribute("aria-label", "详细证据");
      this.archiveBranches.clear();

      this.store.generations.forEach((generation) => {
        const generationSection = el("section", "archive-generation");
        const generationButton = el("button", "tree-row generation-row");
        generationButton.type = "button";
        const generationMarker = el("span", "tree-marker", "▸");
        generationMarker.setAttribute("aria-hidden", "true");
        const label = el("span", "", generation.reaction);
        const intentText = generation.intents.map((intent) => intent.text).filter(Boolean).join(" / ");
        if (intentText) label.appendChild(el("span", "gen-intent", intentText));
        generationButton.append(generationMarker, label);
        const children = el("div", "archive-children");
        children.id = "archive-" + generation.id;
        generationButton.setAttribute("aria-controls", children.id);
        this.branch(generation.id, generationButton, generationMarker, children, generationSection, "children");

        generation.intents.forEach((intent) => {
          intent.processes.forEach((process) => {
            const section = el("section", "archive-process");
            this.archiveLeaf(section, generation.id + "/" + process.id, process.text, processFacts(process));
            children.appendChild(section);
          });
        });
        llmCallsOf(generation).forEach((event, index) => {
          const section = el("section", "archive-process");
          const turn = event.data && Number.isFinite(Number(event.data.turn)) ? event.data.turn : index + 1;
          this.archiveLeaf(section, generation.id + "/llm-" + turn, "模型推理——" + ((event.data && event.data.model) || "未提供"), llmFacts(event));
          children.appendChild(section);
        });
        if (!generation.intents.some((intent) => intent.processes.length) && generation.pendingEvents.length) {
          const section = el("section", "archive-process");
          this.archiveLeaf(section, generation.id + "/unresolved", "未形成可完成过程", [["记录", "共 " + generation.pendingEvents.length + " 条原始事件，完整内容见工程记录"]]);
          children.appendChild(section);
        }

        generationSection.append(generationButton, children);
        archive.appendChild(generationSection);
      });

      if (this.archive) this.archive.replaceWith(archive);
      else this.root.appendChild(archive);
      this.archive = archive;
      if (this.archiveToggle) {
        this.archiveToggle.textContent = open ? "收起详细证据" : "详细证据";
        this.archiveToggle.setAttribute("aria-expanded", String(open));
      }
    }

    toggleArchive(force) {
      if (!this.completed) return;
      const open = force === undefined ? !(this.archive && !this.archive.hidden) : force;
      this.renderArchive(open);
    }

    openEvidence(refs) {
      if (!this.completed) return;
      this.evidenceKeys.clear();
      refs.forEach((reference) => this.evidenceKeys.add(reference.generationId + "/" + reference.processId));
      this.renderArchive(true);
      refs.forEach((reference) => {
        const processKey = reference.generationId + "/" + reference.processId;
        [reference.generationId, processKey].forEach((key) => {
          const branch = this.archiveBranches.get(key);
          if (branch) this.setBranch(branch, true);
        });
      });
    }

    async settle(summary) {
      if (this.completed) return false;
      this.completed = true;
      this.root.classList.add("settling");
      const rows = Array.from(this.processList.children);
      rows.forEach((node) => node.classList.add("leaving"));
      if (rows.length && !(await this.run.sleep(190))) return false;
      this.copy.classList.add("changing");
      this.mark.classList.add("hidden");
      if (!(await this.run.sleep(160))) return false;

      this.root.classList.add("settled");
      this.mark.classList.remove("hidden");
      this.mark.classList.add("tick-slot");
      this.mark.replaceChildren(el("span", "", "✓"));
      const finalCopy = el("span", "head-copy");
      finalCopy.appendChild(el("span", "settle-summary", summary));
      const toggle = el("button", "process-toggle", "详细证据");
      toggle.type = "button";
      toggle.setAttribute("aria-expanded", "false");
      toggle.addEventListener("click", () => this.toggleArchive());
      finalCopy.appendChild(toggle);
      this.archiveToggle = toggle;
      this.head.replaceChildren(this.mark, finalCopy);
      this.copy = finalCopy;
      this.announce(summary);
      return true;
    }
  }

  const ANSWER_BITS = [
    '<p class="lead">6 月总费用为 300,000 元，较 5 月的 220,000 元增加 80,000 元（36.4%）。<a class="cite" href="#evidence" data-evidence="turn-2|june-cost,turn-2|may-cost">①</a></p>',
    '<h3>主要变化</h3>',
    '<p>团队 A 从 120,000 元升至 180,000 元，增加 60,000 元，占总增量的 75%，是本轮数据中最主要的增长来源。<a class="cite" href="#evidence" data-evidence="turn-2|june-cost,turn-2|may-cost">①</a></p>',
    '<ul><li>团队 B：60,000 元 → 72,000 元，增加 12,000 元。</li><li>团队 C：40,000 元 → 48,000 元，增加 8,000 元。</li></ul>',
    '<h3>本轮边界</h3>',
    '<div class="witness"><p>本轮只查询了按团队汇总的月度费用，尚未按费用类别拆分。<a class="cite" href="#evidence" data-evidence="turn-1|schema,turn-2|june-cost,turn-2|may-cost">②</a></p><p>具体增加了哪些费用，需要进一步按类别查询，不能由团队汇总直接推断。</p></div>'
  ];

  function buildAnswerStream(bits) {
    const stream = [];
    bits.forEach((html) => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;
      const root = wrapper.firstElementChild;
      const containers = root.tagName === "UL" || root.classList.contains("witness") ? Array.from(root.children) : [root];
      containers.forEach((container) => {
        Array.from(container.childNodes).forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            Array.from(node.textContent).forEach((character) => stream.push({ root, container, character }));
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            stream.push({ root, container, element: node });
          }
        });
        container.replaceChildren();
        if (container !== root) container.remove();
      });
      root.remove();
    });
    return stream;
  }

  function parseEvidence(value) {
    return value.split(",").map((entry) => {
      const parts = entry.split("|");
      return { generationId: parts[0], processId: parts[1] };
    });
  }

  function attachEvidenceEvents(root, trace) {
    root.addEventListener("click", (event) => {
      const source = event.target.closest("[data-evidence]");
      if (!source) return;
      event.preventDefault();
      trace.openEvidence(parseEvidence(source.dataset.evidence));
    });
  }

  async function streamAnswer(host, trace, run) {
    const answer = el("article", "answer birth");
    attachEvidenceEvents(answer, trace);
    host.appendChild(answer);
    const stream = buildAnswerStream(ANSWER_BITS);
    if (!(await run.sleep(16))) return false;
    answer.classList.remove("birth");

    for (const token of stream) {
      if (run.cancelled) return false;
      if (!token.root.parentNode) {
        token.root.classList.add("birth");
        answer.appendChild(token.root);
        window.setTimeout(() => token.root.classList.remove("birth"), REDUCED_MOTION ? 0 : 16);
      }
      if (token.container !== token.root && !token.container.parentNode) {
        token.container.classList.add("birth");
        token.root.appendChild(token.container);
        window.setTimeout(() => token.container.classList.remove("birth"), REDUCED_MOTION ? 0 : 16);
      }
      const character = el("span", "answer-char");
      if (token.character !== undefined) character.textContent = token.character;
      else character.appendChild(token.element);
      token.container.appendChild(character);
      window.setTimeout(() => character.classList.add("visible"), REDUCED_MOTION ? 0 : 16);
      if (!(await run.sleep(REDUCED_MOTION ? 0 : 20))) return false;
    }
    if (!(await run.sleep(REDUCED_MOTION ? 0 : 400))) return false;
    showSources(host, trace);
    return true;
  }

  function showSources(host, trace) {
    const sources = el("section", "sources");
    sources.setAttribute("aria-label", "数据依据");
    const items = [
      ["①", "5 月与 6 月各团队费用", "两次团队汇总查询", "turn-2|june-cost,turn-2|may-cost"],
      ["②", "本轮可判断的范围", "表结构与两次汇总查询", "turn-1|schema,turn-2|june-cost,turn-2|may-cost"]
    ];
    items.forEach(([number, title, meta, evidence]) => {
      const source = el("div", "source");
      const button = el("button");
      button.type = "button";
      button.append(el("span", "source-index", number), el("span", "source-title", title), el("span", "source-meta", meta));
      button.addEventListener("click", () => trace.openEvidence(parseEvidence(evidence)));
      source.appendChild(button);
      sources.appendChild(source);
    });
    host.appendChild(sources);
    window.setTimeout(() => sources.classList.add("visible"), REDUCED_MOTION ? 0 : 16);

    const tools = el("div", "answer-tools");
    const copy = el("button");
    copy.type = "button";
    copy.title = "复制";
    copy.setAttribute("aria-label", "复制回答");
    copy.innerHTML = ICON_COPY;
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(host.querySelector(".answer").innerText);
        copy.innerHTML = ICON_TICK;
        window.setTimeout(() => { copy.innerHTML = ICON_COPY; }, 1400);
      } catch (_) {}
    });
    const dev = el("button");
    dev.type = "button";
    dev.title = "工程记录";
    dev.setAttribute("aria-label", "工程记录");
    dev.innerHTML = ICON_CODE;
    dev.addEventListener("click", openDevDrawer);
    tools.append(copy, dev);
    host.appendChild(tools);
    window.setTimeout(() => tools.classList.add("visible"), REDUCED_MOTION ? 0 : 16);
  }

  // Present each generation in reading order before settling into the evidence archive.
  class FrontierPlayer {
    constructor(store, trace, run) {
      this.store = store;
      this.trace = trace;
      this.run = run;
    }

    async waitFor(predicate) {
      while (!predicate()) {
        if (!(await this.run.sleep(24))) return false;
      }
      return true;
    }

    async playIntent(generation, intent, intentIndex) {
      if (!(await this.trace.showIntent(generation, intent))) return false;
      if (!(await this.run.sleep(readingGate("l1", intent.text)))) return false;
      let processIndex = 0;
      const shownTexts = new Map();
      while (!this.run.cancelled) {
        const ready = await this.waitFor(() =>
          intent.processes.length > processIndex ||
          intent.processes.some((process) => shownTexts.has(process.id) && shownTexts.get(process.id) !== process.text) ||
          generation.intents.length > intentIndex + 1 ||
          generation.sourceClosed ||
          Boolean(this.store.terminal)
        );
        if (!ready) return false;
        const changed = intent.processes.find((process) => shownTexts.has(process.id) && shownTexts.get(process.id) !== process.text);
        if (changed) {
          if (!(await this.trace.addProcess(generation, intent, changed))) return false;
          shownTexts.set(changed.id, changed.text);
          if (!(await this.run.sleep(readingGate("l2", changed.text)))) return false;
          continue;
        }
        const process = intent.processes[processIndex];
        if (!process) break;
        if (!(await this.trace.addProcess(generation, intent, process))) return false;
        shownTexts.set(process.id, process.text);
        if (!(await this.run.sleep(readingGate("l2", process.text)))) return false;
        processIndex += 1;
      }
      return true;
    }

    async playGeneration(generation) {
      if (!(await this.trace.showGeneration(generation))) return false;
      if (!(await this.run.sleep(readingGate("l0", generation.reaction)))) return false;
      let intentIndex = 0;
      while (!this.run.cancelled) {
        const ready = await this.waitFor(() =>
          generation.intents.length > intentIndex ||
          generation.sourceClosed ||
          Boolean(this.store.terminal)
        );
        if (!ready) return false;
        const intent = generation.intents[intentIndex];
        if (!intent) break;
        if (!(await this.playIntent(generation, intent, intentIndex))) return false;
        intentIndex += 1;
        if (generation.sourceClosed && intentIndex >= generation.intents.length) break;
      }
      generation.leftFrontier = true;
      return true;
    }

    async playAll() {
      let generationIndex = 0;
      while (!this.run.cancelled) {
        const ready = await this.waitFor(() =>
          this.store.generations.length > generationIndex || Boolean(this.store.terminal)
        );
        if (!ready) return null;
        const generation = this.store.generations[generationIndex];
        if (!generation) break;
        if (!(await this.playGeneration(generation))) return null;
        generationIndex += 1;
      }
      if (!(await this.waitFor(() => Boolean(this.store.terminal)))) return null;
      return this.store.terminal;
    }
  }

  async function feedAgentStream(store, run) {
    for (let index = 0; index < AGENT_STREAM.length; index += 1) {
      if (run.cancelled) return false;
      store.apply(AGENT_STREAM[index]);
      if (index < AGENT_STREAM.length - 1 && !(await run.sleep(82))) return false;
    }
    store.finishInput();
    return true;
  }

  let activeRun = null;
  async function runDemo() {
    if (activeRun) activeRun.cancel();
    const run = new Run();
    activeRun = run;
    stage.replaceChildren();
    document.querySelectorAll(".dev-drawer, .dev-scrim").forEach((node) => node.remove());
    devDrawer = null;

    const store = new TraceStore("6 月份团队费用为什么上升？");
    const turn = el("section", "turn");
    const question = el("div", "question");
    const questionCopy = el("div", "", store.question);
    question.appendChild(questionCopy);
    const host = el("div", "assistant");
    turn.append(question, host);
    stage.appendChild(turn);
    window.setTimeout(() => questionCopy.classList.add("visible"), REDUCED_MOTION ? 0 : 16);
    if (!(await run.sleep(320))) return;

    const trace = new TraceView(host, run, store);
    const player = new FrontierPlayer(store, trace, run);
    const feeder = feedAgentStream(store, run);
    const terminal = await player.playAll();
    if (!terminal || !(await feeder)) return;
    const summary = terminal.hasAnswer ? "已核对团队费用变化" : "未形成可核验结论";
    if (!(await trace.settle(summary))) return;
    if (!terminal.hasAnswer) return;
    if (!(await run.sleep(180))) return;
    await streamAnswer(host, trace, run);
  }


  // Read-only inspection surface for the prototype state and event fixture.
  window.__THINKING_UI__ = Object.freeze({ AGENT_STREAM, TraceStore, TraceView, FrontierPlayer, readingGate });
  if (window.__THINKING_UI_TEST__) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!input.value.trim()) return;
    input.value = "";
    const original = input.placeholder;
    input.placeholder = "此原型使用固定模拟数据，请点击右上角重新演示";
    window.setTimeout(() => { input.placeholder = original; }, 1800);
  });

  rerunButton.addEventListener("click", runDemo);
  runDemo();
})();
