// A working model of the ingestion service, drawn on a 2D canvas.
//
// 33 sources emit messages at a varying load. Messages travel over the bus
// into the service, which groups them into batches whose size follows the
// load. Each batch is delivered to both sinks, with a per-sink concurrency
// limit. In "backpressure" mode one sink slows down: its concurrency limit
// drops, deliveries wait in line, and once the line is long enough the
// service stops accepting new messages until the sink recovers.
//
// Nothing here is production data; readouts are labelled as simulated.

const SOURCES = 33;
const MAX_CONCURRENCY = 8;
const MAX_WAITING = 7; // batches waiting before intake pauses
const AVG_PER_SECOND = 30_000_000 / 86_400; // ≈ 347, from 30M+/day

const COLORS = {
  line: "200,165,106",
  gilt: "235,210,159",
  bone: "238,231,216",
  moss: "127,143,133",
  warn: "240,160,75",
  ok: "143,209,176",
};

// Region emphasis per step: [sources, bus, service, sinks]
const EMPHASIS = [
  [1, 0.9, 0.4, 0.4],
  [0.4, 0.6, 1, 0.45],
  [0.35, 0.45, 1, 1],
  [0.45, 0.45, 0.55, 1],
];

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function bezier(p0, p1, p2, p3, t, out) {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  out[0] = a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0];
  out[1] = a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1];
  return out;
}

export function createPipelineSim(canvas, { reducedMotion = false, onReadout } = {}) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  let W = 1;
  let H = 1;
  let dpr = 1;
  let geo = null;

  const sources = Array.from({ length: SOURCES }, (_, i) => ({
    i,
    bias: 0.6 + (((i * 7919) % 97) / 97) * 0.8,
    flash: 0,
  }));

  let messages = []; // { src, u, waiting }
  let buffer = 0;
  let bufferAge = 0;
  const sinks = [
    { name: "Cosmos DB", queue: [], inflight: [], health: 1, target: 1, delivered: 0, pulse: 0 },
    { name: "Snowflake", queue: [], inflight: [], health: 1, target: 1, delivered: 0, pulse: 0 },
  ];
  let t = 0;
  let mode = 0;
  let modeClock = 0;
  let load = 0.7;
  let loadSmooth = 0.7;
  let batchSize = 16;
  let lastBatch = 0;
  let paused = false;
  const emphasis = [...EMPHASIS[0]];

  function layout() {
    W = canvas.clientWidth || 1;
    H = canvas.clientHeight || 1;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const compact = W < 520;
    const sx = W * (compact ? 0.05 : 0.06);
    const bx = W * 0.27;
    const svc = { x: W * 0.43, y: H * 0.3, w: W * 0.24, h: H * 0.4 };
    const inlet = [svc.x, H * 0.5];
    const outlet = [svc.x + svc.w, H * 0.5];
    const sinkX = W * (compact ? 0.88 : 0.9);
    const sinkR = Math.max(12, Math.min(W, H) * 0.05);
    const top = H * 0.08;
    const bottom = H * 0.92;

    const src = sources.map((s) => {
      const y = top + ((bottom - top) * s.i) / (SOURCES - 1);
      const busY = H * 0.5 + (y - H * 0.5) * 0.5;
      const inY = H * 0.5 + (y - H * 0.5) * 0.12;
      return {
        start: [sx, y],
        bus: [bx, busY],
        a: [
          [sx, y],
          [(sx + bx) / 2, y],
          [(sx + bx) / 2, busY],
          [bx, busY],
        ],
        b: [
          [bx, busY],
          [(bx + inlet[0]) / 2, busY],
          [(bx + inlet[0]) / 2, inY],
          [inlet[0], inY],
        ],
      };
    });

    const sinkPos = [
      [sinkX, H * 0.28],
      [sinkX, H * 0.72],
    ];
    const out = sinkPos.map((p) => [
      outlet,
      [(outlet[0] + p[0]) / 2, outlet[1]],
      [(outlet[0] + p[0]) / 2, p[1]],
      [p[0] - sinkR, p[1]],
    ]);

    geo = { compact, sx, bx, svc, inlet, outlet, sinkPos, sinkR, src, out, top, bottom };
  }

  const tmp = [0, 0];
  function messagePoint(m) {
    const g = geo.src[m.src];
    return m.u < 0.5 ? bezier(...g.a, m.u * 2, tmp) : bezier(...g.b, (m.u - 0.5) * 2, tmp);
  }

  function concurrency(s) {
    return Math.max(1, Math.round(MAX_CONCURRENCY * s.health));
  }

  function waitingBatches() {
    return sinks[0].queue.length + sinks[1].queue.length;
  }

  function step(dt) {
    t += dt;
    modeClock += dt;

    // Variable load: slow tide plus short gusts. Batching mode swings harder.
    const swing = mode === 1 ? 0.42 : 0.26;
    load = clamp(0.62 + swing * Math.sin(t * 0.55) + 0.12 * Math.sin(t * 1.9 + 1), 0.15, 1);
    loadSmooth += (load - loadSmooth) * Math.min(1, dt * 1.5);
    batchSize = Math.round(clamp(5 + 31 * loadSmooth, 5, 36));

    // Backpressure cycle on the second sink.
    if (mode === 2) {
      const c = modeClock % 11;
      sinks[1].target = c > 1.5 && c < 6.5 ? 0.18 : 1;
    } else {
      sinks[1].target = 1;
    }
    for (const s of sinks) {
      s.health += (s.target - s.health) * Math.min(1, dt * (s.target < s.health ? 2.2 : 0.9));
      s.pulse = Math.max(0, s.pulse - dt * 2.5);
    }

    // Emit
    for (const s of sources) {
      s.flash = Math.max(0, s.flash - dt * 3);
      const rate = 1.05 * load * s.bias;
      if (Math.random() < rate * dt && messages.length < 460) {
        messages.push({ src: s.i, u: 0, speed: 0.42 + Math.random() * 0.12 });
        s.flash = 1;
      }
    }

    // Move messages; the service only accepts while the line is short.
    const accepting = waitingBatches() < MAX_WAITING;
    paused = !accepting;
    const kept = [];
    for (const m of messages) {
      if (m.u < 1) {
        m.u = Math.min(1, m.u + m.speed * dt);
        kept.push(m);
      } else if (accepting) {
        if (buffer === 0) bufferAge = 0;
        buffer += 1;
      } else {
        kept.push(m);
      }
    }
    messages = kept;

    // Seal a batch when it is full, or when it has waited long enough.
    bufferAge += dt;
    if (buffer >= batchSize || (buffer > 0 && bufferAge > 0.9)) {
      for (const s of sinks) s.queue.push(buffer);
      lastBatch = buffer;
      buffer = 0;
      bufferAge = 0;
    }

    // Deliver
    for (const s of sinks) {
      while (s.queue.length && s.inflight.length < concurrency(s)) {
        s.inflight.push({ size: s.queue.shift(), u: 0 });
      }
      const speed = 0.7 * Math.pow(s.health, 0.8);
      const still = [];
      for (const b of s.inflight) {
        b.u += speed * dt;
        if (b.u >= 1) {
          s.delivered += b.size;
          s.pulse = 1;
        } else still.push(b);
      }
      s.inflight = still;
    }

    const target = EMPHASIS[mode];
    for (let k = 0; k < 4; k += 1) emphasis[k] += (target[k] - emphasis[k]) * Math.min(1, dt * 3);
  }

  // ---- drawing ------------------------------------------------------------
  function rgba(c, a) {
    return `rgba(${c},${clamp(a, 0, 1)})`;
  }

  function label(text, x, y, align, a, size = 12) {
    ctx.font = `500 ${size}px "Hanken Grotesk Variable", system-ui, sans-serif`;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.fillStyle = rgba(COLORS.moss, a);
    ctx.fillText(text, x, y);
  }

  function curve(p, color, a, w = 1) {
    ctx.beginPath();
    ctx.moveTo(p[0][0], p[0][1]);
    ctx.bezierCurveTo(p[1][0], p[1][1], p[2][0], p[2][1], p[3][0], p[3][1]);
    ctx.strokeStyle = rgba(color, a);
    ctx.lineWidth = w;
    ctx.stroke();
  }

  function draw() {
    const g = geo;
    const [eSrc, eBus, eSvc, eSink] = emphasis;
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = "round";

    // Source → bus → inlet hairlines
    for (const s of g.src) {
      curve(s.a, COLORS.line, 0.14 * eSrc, 0.75);
      curve(s.b, COLORS.line, 0.1 * eBus, 0.75);
    }

    // Sources
    for (const s of sources) {
      const [x, y] = g.src[s.i].start;
      ctx.beginPath();
      ctx.arc(x, y, 2 + s.flash * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = rgba(COLORS.gilt, (0.35 + 0.65 * s.flash) * eSrc);
      ctx.fill();
    }
    label("33 sources", g.sx - 2, g.top - H * 0.045, "left", 0.9 * eSrc, g.compact ? 10 : 12);

    // Bus rail
    const railTop = H * 0.5 + (g.top - H * 0.5) * 0.5;
    const railBottom = H * 0.5 + (g.bottom - H * 0.5) * 0.5;
    ctx.beginPath();
    ctx.moveTo(g.bx, railTop - 8);
    ctx.lineTo(g.bx, railBottom + 8);
    ctx.strokeStyle = rgba(COLORS.line, 0.55 * eBus);
    ctx.lineWidth = 1;
    ctx.stroke();
    label("Service Bus", g.bx, railBottom + 26, "center", 0.9 * eBus, g.compact ? 10 : 12);

    // Service body
    const { svc } = g;
    ctx.beginPath();
    ctx.roundRect(svc.x, svc.y, svc.w, svc.h, 10);
    ctx.fillStyle = "rgba(16,39,31,0.92)";
    ctx.fill();
    ctx.strokeStyle = rgba(
      paused ? COLORS.warn : COLORS.line,
      (paused ? 0.85 : 0.6) * Math.max(eSvc, 0.5),
    );
    ctx.lineWidth = 1;
    ctx.stroke();
    label(
      "Ingestion service",
      svc.x + svc.w / 2,
      svc.y - 16,
      "center",
      Math.max(eSvc, 0.55),
      g.compact ? 10 : 12,
    );

    // Batch grid: hollow slots up to the current batch size, filled by the buffer.
    const cols = 6;
    const pad = Math.min(svc.w, svc.h) * 0.14;
    const cell = Math.min((svc.w - pad * 2) / cols, (svc.h - pad * 2) / cols);
    const gx = svc.x + (svc.w - cell * cols) / 2 + cell / 2;
    const gy = svc.y + (svc.h - cell * cols) / 2 + cell / 2;
    const r = Math.max(1.4, cell * 0.2);
    for (let k = 0; k < 36; k += 1) {
      const cx = gx + (k % cols) * cell;
      const cy = gy + Math.floor(k / cols) * cell;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      if (k < buffer) {
        ctx.fillStyle = rgba(COLORS.gilt, 0.95 * eSvc + 0.05);
        ctx.fill();
      } else if (k < batchSize) {
        ctx.strokeStyle = rgba(COLORS.line, 0.5 * eSvc);
        ctx.lineWidth = 0.75;
        ctx.stroke();
      } else {
        ctx.fillStyle = rgba(COLORS.moss, 0.12 * eSvc);
        ctx.fill();
      }
    }

    // Outlet → sinks
    g.out.forEach((p, k) => {
      const s = sinks[k];
      const slow = s.health < 0.7;
      curve(p, slow ? COLORS.warn : COLORS.line, (slow ? 0.5 : 0.3) * eSink, 1);
    });

    // Waiting batches stack beside the outlet
    sinks.forEach((s, k) => {
      const dir = k === 0 ? -1 : 1;
      s.queue.forEach((size, q) => {
        const x = g.outlet[0] + 10 + q * 7;
        const y = g.outlet[1] + dir * 12;
        ctx.beginPath();
        ctx.arc(x, y, 2 + Math.sqrt(size) * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = rgba(COLORS.warn, 0.85);
        ctx.fill();
      });
    });

    // Batches in flight
    sinks.forEach((s, k) => {
      for (const b of s.inflight) {
        const [x, y] = bezier(...g.out[k], b.u, tmp);
        const rad = 2.2 + Math.sqrt(b.size) * 0.7;
        ctx.beginPath();
        ctx.arc(x, y, rad * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = rgba(COLORS.gilt, 0.12 * eSink);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.fillStyle = rgba(COLORS.bone, 0.95 * Math.max(eSink, 0.6));
        ctx.fill();
      }
    });

    // Sinks
    sinks.forEach((s, k) => {
      const [x, y] = g.sinkPos[k];
      const slow = s.health < 0.7;
      const col = slow ? COLORS.warn : COLORS.gilt;
      ctx.beginPath();
      ctx.arc(x, y, g.sinkR, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(16,39,31,0.95)";
      ctx.fill();
      ctx.strokeStyle = rgba(col, 0.75 * Math.max(eSink, 0.5));
      ctx.lineWidth = 1;
      ctx.stroke();
      if (s.pulse > 0) {
        ctx.beginPath();
        ctx.arc(x, y, g.sinkR + (1 - s.pulse) * 14, 0, Math.PI * 2);
        ctx.strokeStyle = rgba(col, s.pulse * 0.5 * eSink);
        ctx.stroke();
      }
      // fill level: a slow tide inside the vessel, with a hairline surface
      const lvl = 0.12 + ((s.delivered % 600) / 600) * 0.7;
      const surface = y + g.sinkR - lvl * g.sinkR * 2;
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, g.sinkR - 3, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = rgba(col, 0.07 * eSink + 0.03);
      ctx.fillRect(x - g.sinkR, surface, g.sinkR * 2, g.sinkR * 2);
      ctx.beginPath();
      ctx.moveTo(x - g.sinkR, surface);
      ctx.lineTo(x + g.sinkR, surface);
      ctx.strokeStyle = rgba(col, 0.55 * eSink + 0.1);
      ctx.stroke();
      ctx.restore();
      label(s.name, x, y + g.sinkR + 16, "center", Math.max(eSink, 0.55), g.compact ? 10 : 12);
    });

    // Messages in flight (drawn last so they sit above the lines)
    for (const m of messages) {
      const [x, y] = messagePoint(m);
      const a = m.u < 0.5 ? eSrc * 0.6 + 0.3 : eBus * 0.5 + 0.4;
      ctx.beginPath();
      ctx.arc(x, y, m.u >= 1 ? 1.8 : 1.5, 0, Math.PI * 2);
      ctx.fillStyle = rgba(m.u >= 1 ? COLORS.warn : COLORS.gilt, a);
      ctx.fill();
    }
  }

  function readout() {
    if (!onReadout) return;
    onReadout({
      intake: Math.round(AVG_PER_SECOND * (0.4 + load * 0.9)),
      batch: batchSize,
      lastBatch,
      concurrency: concurrency(sinks[1]),
      maxConcurrency: MAX_CONCURRENCY,
      waiting: waitingBatches(),
      paused,
      delivered: sinks[0].delivered + sinks[1].delivered,
    });
  }

  // ---- loop -----------------------------------------------------------------
  let raf = 0;
  let last = 0;
  let running = false;
  let sinceReadout = 0;

  function tick(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    step(dt);
    draw();
    sinceReadout += dt;
    if (sinceReadout > 0.2) {
      sinceReadout = 0;
      readout();
    }
    raf = requestAnimationFrame(tick);
  }

  function warm(seconds) {
    for (let k = 0; k < seconds * 30; k += 1) step(1 / 30);
  }

  function renderStill() {
    warm(mode === 2 ? 4 : 6);
    draw();
    readout();
  }

  function start() {
    if (reducedMotion) {
      renderStill();
      return;
    }
    if (running) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  function setMode(next) {
    if (next === mode) return;
    mode = next;
    modeClock = 0;
    if (reducedMotion) renderStill();
  }

  function resize() {
    layout();
    if (!running) draw();
  }

  layout();
  warm(3);
  draw();
  readout();

  return { start, stop, setMode, resize, destroy: stop };
}
