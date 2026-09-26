// A model of policy-based data retention, drawn on a 2D canvas.
//
// Every dot is a record. Its colour is its retention policy, and the hairline
// arc around it fills as the record ages toward that policy's window. Once the
// window closes the record is due (amber ring). A scheduled deletion run sweeps
// across the store and removes whatever is due; new records arrive in the
// freed slots. Nothing is deleted early, and nothing overstays.

const POLICIES = [
  { window: 8, color: "235,210,159" }, // short
  { window: 14, color: "200,165,106" }, // medium
  { window: 22, color: "238,231,216" }, // long
];
const SWEEP_SECONDS = 2.8;
const WARN = "240,160,75";
const MOSS = "127,143,133";

const rgba = (c, a) => `rgba(${c},${Math.max(0, Math.min(1, a))})`;

export function createRetentionSim(canvas, { reducedMotion = false, onReadout } = {}) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  let W = 1;
  let H = 1;
  let cols = 24;
  let rows = 7;
  let cell = 10;
  let ox = 0;
  let oy = 0;
  let cells = [];
  let sweep = 0;
  let deleted = 0;
  let sinceReadout = 0;

  const newRecord = (age = 0) => {
    const policy = Math.floor(Math.random() * POLICIES.length);
    return { policy, age, state: "live", timer: 0, born: age > 0 ? 1 : 0 };
  };

  function layout() {
    W = canvas.clientWidth || 1;
    H = canvas.clientHeight || 1;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const nextCols = W < 520 ? 12 : 24;
    const nextRows = W < 520 ? 8 : 7;
    if (nextCols !== cols || nextRows !== rows || cells.length === 0) {
      cols = nextCols;
      rows = nextRows;
      // Seed with ages spread across each window so the store looks lived in.
      cells = Array.from({ length: cols * rows }, () => {
        const r = newRecord();
        r.age = Math.random() * POLICIES[r.policy].window * 1.05;
        r.born = 1;
        if (r.age >= POLICIES[r.policy].window) r.state = "due";
        return r;
      });
    }
    cell = Math.min(W / cols, (H - 8) / rows);
    ox = (W - cell * cols) / 2;
    oy = (H - cell * rows) / 2;
  }

  function step(dt) {
    const prev = sweep;
    sweep += dt / SWEEP_SECONDS;
    const wrapped = sweep >= 1;
    if (wrapped) sweep -= 1;

    cells.forEach((c, i) => {
      const col = i % cols;
      const x = (col + 0.5) / cols;
      const window = POLICIES[c.policy].window;
      if (c.state === "live" || c.state === "due") {
        c.age += dt;
        c.born = Math.min(1, c.born + dt * 2.5);
        if (c.age >= window) c.state = "due";
        const crossed = wrapped ? x >= prev || x < sweep : x >= prev && x < sweep;
        if (c.state === "due" && crossed) {
          c.state = "deleting";
          c.timer = 0;
          deleted += 1;
        }
      } else if (c.state === "deleting") {
        c.timer += dt;
        if (c.timer > 0.55) {
          c.state = "gone";
          c.timer = -Math.random() * 1.2;
        }
      } else if (c.state === "gone") {
        c.timer += dt;
        if (c.timer > 0.9) Object.assign(c, newRecord());
      }
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const r = Math.max(1.6, cell * 0.14);
    const R = cell * 0.34;

    cells.forEach((c, i) => {
      const cx = ox + ((i % cols) + 0.5) * cell;
      const cy = oy + (Math.floor(i / cols) + 0.5) * cell;
      const p = POLICIES[c.policy];

      if (c.state === "gone") {
        ctx.beginPath();
        ctx.arc(cx, cy, 1, 0, Math.PI * 2);
        ctx.fillStyle = rgba(MOSS, 0.35);
        ctx.fill();
        return;
      }

      if (c.state === "deleting") {
        const k = c.timer / 0.55;
        ctx.beginPath();
        ctx.arc(cx, cy, R + k * cell * 0.25, 0, Math.PI * 2);
        ctx.strokeStyle = rgba(WARN, 0.9 * (1 - k));
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, r * (1 - k), 0, Math.PI * 2);
        ctx.fillStyle = rgba(WARN, 1 - k);
        ctx.fill();
        return;
      }

      const due = c.state === "due";
      // age arc, from twelve o'clock
      const f = Math.min(1, c.age / p.window);
      ctx.beginPath();
      ctx.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + f * Math.PI * 2);
      ctx.strokeStyle = due ? rgba(WARN, 0.95) : rgba(p.color, 0.45 * c.born);
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, r * c.born, 0, Math.PI * 2);
      ctx.fillStyle = due ? rgba(WARN, 0.9) : rgba(p.color, 0.9 * c.born);
      ctx.fill();
    });

    // the deletion run
    const x = ox + sweep * cell * cols;
    const g = ctx.createLinearGradient(x - 40, 0, x, 0);
    g.addColorStop(0, "rgba(235,210,159,0)");
    g.addColorStop(1, "rgba(235,210,159,0.10)");
    ctx.fillStyle = g;
    ctx.fillRect(x - 40, oy, 40, cell * rows);
    ctx.beginPath();
    ctx.moveTo(x, oy - 4);
    ctx.lineTo(x, oy + cell * rows + 4);
    ctx.strokeStyle = "rgba(235,210,159,0.7)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function readout() {
    if (!onReadout) return;
    let due = 0;
    let held = 0;
    for (const c of cells) {
      if (c.state === "due") due += 1;
      if (c.state === "live" || c.state === "due") held += 1;
    }
    onReadout({ due, held, deleted });
  }

  let raf = 0;
  let last = 0;
  let running = false;

  function tick(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    step(dt);
    draw();
    sinceReadout += dt;
    if (sinceReadout > 0.25) {
      sinceReadout = 0;
      readout();
    }
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (reducedMotion) {
      draw();
      readout();
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

  function resize() {
    layout();
    draw();
  }

  layout();
  sweep = 0.35;
  draw();
  readout();

  return { start, stop, resize, destroy: stop };
}
