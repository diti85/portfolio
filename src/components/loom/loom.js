// The hero "loom": 33 source threads converge through one hub (the ingestion
// service) and leave as two braided strands (the two sinks). Beads of light
// travel along them as messages. Plain WebGL2, geometry computed on the CPU
// each frame (a few thousand points), drawn as hairlines and soft points.
//
// Hold the pointer over the hub and intake backs up behind it: backpressure.

const SOURCES = 33;
const STRANDS = 9; // per sink
const SINKS = 2;
const SRC_SAMPLES = 96;
const SINK_SAMPLES = 80;
const SPLIT = 0.56; // share of a message's journey spent before the hub

const BRASS = [0.784, 0.647, 0.416];
const GILT = [0.922, 0.824, 0.624];
const BONE = [0.933, 0.906, 0.847];
const WARN = [0.941, 0.627, 0.294];

const LINE_VS = `#version 300 es
in vec2 a_pos;
in vec4 a_col;
uniform vec2 u_half;
out vec4 v_col;
void main() {
  gl_Position = vec4(a_pos / u_half, 0.0, 1.0);
  v_col = a_col;
}`;

const LINE_FS = `#version 300 es
precision mediump float;
in vec4 v_col;
out vec4 o;
void main() { o = v_col; }`;

const POINT_VS = `#version 300 es
in vec2 a_pos;
in float a_size;
in vec4 a_col;
uniform vec2 u_half;
uniform float u_dpr;
out vec4 v_col;
void main() {
  gl_Position = vec4(a_pos / u_half, 0.0, 1.0);
  gl_PointSize = a_size * u_dpr;
  v_col = a_col;
}`;

const POINT_FS = `#version 300 es
precision mediump float;
in vec4 v_col;
out vec4 o;
void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float d = dot(p, p);
  if (d > 1.0) discard;
  o = v_col * exp(-d * 3.2);
}`;

const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a, b, t) => a + (b - a) * t;
const easeOutCubic = (t) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

// Deterministic pseudo-random so the composition is the same on every visit.
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(sh) || "shader compile failed");
  }
  return sh;
}

function program(gl, vs, fs) {
  const p = gl.createProgram();
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(p) || "program link failed");
  }
  return p;
}

export function createLoom(canvas, { reducedMotion = false } = {}) {
  const gl = canvas.getContext("webgl2", {
    antialias: true,
    alpha: true,
    premultipliedAlpha: true,
    powerPreference: "high-performance",
  });
  if (!gl) return null;

  const lineProg = program(gl, LINE_VS, LINE_FS);
  const pointProg = program(gl, POINT_VS, POINT_FS);
  const lineLoc = {
    pos: gl.getAttribLocation(lineProg, "a_pos"),
    col: gl.getAttribLocation(lineProg, "a_col"),
    half: gl.getUniformLocation(lineProg, "u_half"),
  };
  const pointLoc = {
    pos: gl.getAttribLocation(pointProg, "a_pos"),
    size: gl.getAttribLocation(pointProg, "a_size"),
    col: gl.getAttribLocation(pointProg, "a_col"),
    half: gl.getUniformLocation(pointProg, "u_half"),
    dpr: gl.getUniformLocation(pointProg, "u_dpr"),
  };

  const lineBuf = gl.createBuffer();
  const pointBuf = gl.createBuffer();
  const lineVao = gl.createVertexArray();
  const pointVao = gl.createVertexArray();

  gl.bindVertexArray(lineVao);
  gl.bindBuffer(gl.ARRAY_BUFFER, lineBuf);
  gl.enableVertexAttribArray(lineLoc.pos);
  gl.vertexAttribPointer(lineLoc.pos, 2, gl.FLOAT, false, 24, 0);
  gl.enableVertexAttribArray(lineLoc.col);
  gl.vertexAttribPointer(lineLoc.col, 4, gl.FLOAT, false, 24, 8);

  gl.bindVertexArray(pointVao);
  gl.bindBuffer(gl.ARRAY_BUFFER, pointBuf);
  gl.enableVertexAttribArray(pointLoc.pos);
  gl.vertexAttribPointer(pointLoc.pos, 2, gl.FLOAT, false, 28, 0);
  gl.enableVertexAttribArray(pointLoc.size);
  gl.vertexAttribPointer(pointLoc.size, 1, gl.FLOAT, false, 28, 8);
  gl.enableVertexAttribArray(pointLoc.col);
  gl.vertexAttribPointer(pointLoc.col, 4, gl.FLOAT, false, 28, 12);
  gl.bindVertexArray(null);

  // ---- static composition -------------------------------------------------
  const rand = rng(33);
  const sources = Array.from({ length: SOURCES }, (_, i) => ({
    spread: -0.96 + (1.92 * i) / (SOURCES - 1) + (rand() - 0.5) * 0.05,
    phase: rand() * Math.PI * 2,
    amp: 0.03 + rand() * 0.05,
    glow: 0.45 + rand() * 0.55,
  }));
  const strands = [];
  for (let s = 0; s < SINKS; s += 1) {
    for (let j = 0; j < STRANDS; j += 1) {
      strands.push({
        sink: s,
        phase: (j / STRANDS) * Math.PI * 2 + s * 0.7,
        glow: 0.5 + rand() * 0.5,
      });
    }
  }

  const isSmall = () => Math.min(window.innerWidth, window.innerHeight) < 640;
  let particleCount = isSmall() ? 320 : 720;
  let particles = [];
  const seedParticles = () => {
    particles = Array.from({ length: particleCount }, () => ({
      src: Math.floor(rand() * SOURCES),
      strand: Math.floor(rand() * strands.length),
      g: rand(),
      speed: 0.035 + rand() * 0.05,
      size: 1.4 + rand() * 2.2,
      twinkle: rand() * Math.PI * 2,
    }));
  };
  seedParticles();

  // ---- layout ---------------------------------------------------------------
  let dpr = 1;
  let halfW = 1;
  let halfH = 1;
  let landscape = true;
  let L = 1; // half-length along the flow
  let hubA = 0;
  let hubC = 0;
  let sinkC = [0.5, -0.5];

  function layout() {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    dpr = Math.min(window.devicePixelRatio || 1, isSmall() ? 1.5 : 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);

    landscape = w >= h * 0.9;
    halfW = landscape ? w / h : 1;
    halfH = landscape ? 1 : h / w;
    L = landscape ? halfW : halfH;
    if (landscape) {
      hubA = L * 0.36;
      hubC = 0.16;
      sinkC = [0.72, -0.28];
    } else {
      hubA = -L * 0.34;
      hubC = 0.22;
      sinkC = [0.62, -0.5];
    }
    const nextCount = isSmall() ? 320 : 720;
    if (nextCount !== particleCount) {
      particleCount = nextCount;
      seedParticles();
    }
  }

  // Map flow space (along, across) to scene space (x, y).
  const out = [0, 0];
  function toScene(a, c) {
    if (landscape) {
      out[0] = a;
      out[1] = c;
    } else {
      out[0] = c;
      out[1] = -a;
    }
    return out;
  }

  function hubScene() {
    toScene(hubA, hubC);
    return [out[0], out[1]];
  }

  // Source thread i at u ∈ [0,1], start → hub.
  function srcPoint(i, u, t) {
    const s = sources[i];
    const a0 = -L - 0.12;
    const a = lerp(a0, hubA, u);
    const k = smoother(Math.min(1, u));
    let c = lerp(s.spread, hubC, k);
    const fade = 1 - k;
    c += s.amp * fade * Math.sin(u * 6.5 + t * 0.55 + s.phase);
    c += 0.018 * fade * Math.sin(u * 17 - t * 1.05 + s.phase * 2);
    return toScene(a, c);
  }

  // Braided strand at u ∈ [0,1], hub → off-screen.
  function sinkPoint(k, u, t) {
    const st = strands[k];
    const a1 = L + 0.12;
    const a = lerp(hubA, a1, u);
    const e = smoothstep(0, 1, u);
    let c = lerp(hubC, sinkC[st.sink], e);
    const r = 0.05 * smoothstep(0, 0.32, u) * (1 + 0.5 * u);
    c += r * Math.sin(u * 15 - t * 0.9 + st.phase);
    return toScene(a, c);
  }

  // ---- pointer --------------------------------------------------------------
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false, strength: 0 };
  function setPointer(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const nx = (clientX - rect.left) / rect.width;
    const ny = (clientY - rect.top) / rect.height;
    if (nx < 0 || nx > 1 || ny < 0 || ny > 1) {
      pointer.active = false;
      return;
    }
    pointer.active = true;
    pointer.tx = (nx * 2 - 1) * halfW;
    pointer.ty = -(ny * 2 - 1) * halfH;
    if (pointer.strength < 0.01) {
      pointer.x = pointer.tx;
      pointer.y = pointer.ty;
    }
  }
  function clearPointer() {
    pointer.active = false;
  }

  const R = 0.34;
  function displace(p) {
    if (pointer.strength < 0.001) return p;
    const dx = p[0] - pointer.x;
    const dy = p[1] - pointer.y;
    const d = Math.hypot(dx, dy);
    if (d < R && d > 1e-4) {
      const f = 1 - d / R;
      const push = f * f * 0.1 * pointer.strength;
      p[0] += (dx / d) * push;
      p[1] += (dy / d) * push;
    }
    return p;
  }

  // ---- buffers ----------------------------------------------------------------
  const lineVerts = SOURCES * SRC_SAMPLES + strands.length * SINK_SAMPLES;
  const lineData = new Float32Array((lineVerts + 720 * 2 + 128) * 6);
  const pointData = new Float32Array((720 + 4) * 7);

  let clock = 0;
  let pressure = 0; // 0..1, eases toward 1 while the pointer rests on the hub
  let pulse = 0;

  function frame(dt, revealT) {
    clock += dt;
    const t = clock;
    const reveal = easeOutCubic(revealT / 2.4) * 1.15; // along the global journey

    // Pointer easing; when it leaves, the threads relax back into place.
    pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 7);
    pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 7);
    pointer.strength += ((pointer.active ? 1 : 0) - pointer.strength) * Math.min(1, dt * 4);

    const [hx, hy] = hubScene();
    const nearHub = pointer.active && Math.hypot(pointer.x - hx, pointer.y - hy) < 0.16;
    pressure += ((nearHub ? 1 : 0) - pressure) * Math.min(1, dt * (nearHub ? 1.4 : 0.9));

    // ---- threads
    let n = 0;
    const push = (x, y, col, a) => {
      lineData[n++] = x;
      lineData[n++] = y;
      lineData[n++] = col[0] * a;
      lineData[n++] = col[1] * a;
      lineData[n++] = col[2] * a;
      lineData[n++] = a;
    };
    const strips = [];

    for (let i = 0; i < SOURCES; i += 1) {
      const start = n / 6;
      const s = sources[i];
      for (let k = 0; k < SRC_SAMPLES; k += 1) {
        const u = k / (SRC_SAMPLES - 1);
        const g = u * SPLIT;
        const p = displace(srcPoint(i, u, t));
        const tip = 1 - smoothstep(reveal - 0.06, reveal, g);
        const a = (0.1 + 0.34 * smoothstep(0.35, 1, u)) * smoothstep(0, 0.12, u) * s.glow * tip;
        push(p[0], p[1], u > 0.8 ? GILT : BRASS, a);
      }
      strips.push([start, SRC_SAMPLES]);
    }
    for (let k = 0; k < strands.length; k += 1) {
      const start = n / 6;
      const st = strands[k];
      for (let m = 0; m < SINK_SAMPLES; m += 1) {
        const u = m / (SINK_SAMPLES - 1);
        const g = SPLIT + u * (1 - SPLIT);
        const p = displace(sinkPoint(k, u, t));
        const tip = 1 - smoothstep(reveal - 0.06, reveal, g);
        const a = (0.42 - 0.26 * u) * st.glow * tip;
        push(p[0], p[1], u < 0.2 ? GILT : BRASS, a);
      }
      strips.push([start, SINK_SAMPLES]);
    }

    // ---- messages
    let pn = 0;
    const trails = [];
    const live = revealT > 1.4 ? smoothstep(1.4, 2.6, revealT) : 0;
    for (let q = 0; q < particles.length; q += 1) {
      const pt = particles[q];
      let speed = pt.speed;
      // Backpressure: intake approaching the hub stalls, then drains.
      if (pt.g > SPLIT - 0.2 && pt.g < SPLIT) {
        const nearness = smoothstep(SPLIT - 0.2, SPLIT - 0.01, pt.g);
        speed *= 1 - pressure * (0.35 + 0.63 * nearness);
      } else if (pt.g >= SPLIT) {
        speed *= 1 - pressure * 0.5;
      }
      if (!reducedMotion) pt.g += speed * dt;
      if (pt.g >= 1) {
        pt.g -= 1;
        pt.src = Math.floor(rand() * SOURCES);
        pt.strand = Math.floor(rand() * strands.length);
      }
      const pos = (g) =>
        g < SPLIT
          ? srcPoint(pt.src, g / SPLIT, t)
          : sinkPoint(pt.strand, (g - SPLIT) / (1 - SPLIT), t);
      const head = displace(pos(pt.g));
      const hx2 = head[0];
      const hy2 = head[1];
      const edgeFade = smoothstep(0, 0.06, pt.g) * (1 - smoothstep(0.93, 1, pt.g));
      const tw = 0.75 + 0.25 * Math.sin(t * 3 + pt.twinkle);
      const a = live * edgeFade * tw;
      if (a <= 0.001) continue;
      const hot = pt.g > SPLIT - 0.08 && pt.g < SPLIT + 0.08;
      const col = hot ? BONE : GILT;
      pointData[pn++] = hx2;
      pointData[pn++] = hy2;
      pointData[pn++] = pt.size * (hot ? 1.25 : 1);
      pointData[pn++] = col[0] * a * 0.9;
      pointData[pn++] = col[1] * a * 0.9;
      pointData[pn++] = col[2] * a * 0.9;
      pointData[pn++] = a * 0.9;
      if (!reducedMotion) {
        const tail = displace(pos(Math.max(0, pt.g - 0.014 - speed * 0.05)));
        trails.push(hx2, hy2, tail[0], tail[1], a);
      }
    }

    const trailStart = n / 6;
    for (let k = 0; k < trails.length; k += 5) {
      push(trails[k], trails[k + 1], GILT, trails[k + 4] * 0.5);
      push(trails[k + 2], trails[k + 3], GILT, 0);
    }
    const trailCount = n / 6 - trailStart;

    // ---- hub: glow, core, ring, departure pulse
    const hubCol = [
      lerp(GILT[0], WARN[0], pressure),
      lerp(GILT[1], WARN[1], pressure),
      lerp(GILT[2], WARN[2], pressure),
    ];
    const hubA2 = smoothstep(SPLIT - 0.05, SPLIT + 0.05, reveal);
    const glowSize = (landscape ? 150 : 110) * (1 + pressure * 0.35);
    const hubPts = [
      [glowSize, 0.13 * hubA2],
      [22, 0.4 * hubA2],
      [5, 0.95 * hubA2],
    ];
    for (const [size, a] of hubPts) {
      pointData[pn++] = hx;
      pointData[pn++] = hy;
      pointData[pn++] = size;
      pointData[pn++] = hubCol[0] * a;
      pointData[pn++] = hubCol[1] * a;
      pointData[pn++] = hubCol[2] * a;
      pointData[pn++] = a;
    }

    pulse = (pulse + dt / (2.6 + pressure * 3)) % 1;
    const ringStart = n / 6;
    const rings = [
      [0.055, 0.35 * hubA2],
      [0.02 + pulse * 0.16, (1 - pulse) * 0.3 * hubA2 * (1 - pressure)],
    ];
    for (const [r, a] of rings) {
      for (let k = 0; k <= 48; k += 1) {
        const th = (k / 48) * Math.PI * 2;
        push(hx + Math.cos(th) * r, hy + Math.sin(th) * r, hubCol, a);
      }
    }

    // ---- draw
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);

    gl.useProgram(lineProg);
    gl.uniform2f(lineLoc.half, halfW, halfH);
    gl.bindVertexArray(lineVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuf);
    gl.bufferData(gl.ARRAY_BUFFER, lineData.subarray(0, n), gl.DYNAMIC_DRAW);
    for (const [start, count] of strips) gl.drawArrays(gl.LINE_STRIP, start, count);
    if (trailCount) gl.drawArrays(gl.LINES, trailStart, trailCount);
    gl.drawArrays(gl.LINE_STRIP, ringStart, 49);
    gl.drawArrays(gl.LINE_STRIP, ringStart + 49, 49);

    gl.useProgram(pointProg);
    gl.uniform2f(pointLoc.half, halfW, halfH);
    gl.uniform1f(pointLoc.dpr, dpr);
    gl.bindVertexArray(pointVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuf);
    gl.bufferData(gl.ARRAY_BUFFER, pointData.subarray(0, pn), gl.DYNAMIC_DRAW);
    gl.drawArrays(gl.POINTS, 0, pn / 7);
    gl.bindVertexArray(null);
  }

  // ---- loop -----------------------------------------------------------------
  let raf = 0;
  let last = 0;
  let born = 0;
  let running = false;

  function tick(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    frame(dt, (now - born) / 1000);
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (reducedMotion) {
      clock = 14;
      frame(0, 10);
      return;
    }
    if (running) return;
    running = true;
    last = performance.now();
    if (!born) born = last;
    raf = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  function resize() {
    layout();
    if (reducedMotion || !running) frame(0, reducedMotion ? 10 : (performance.now() - born) / 1000);
  }

  function hubFraction() {
    const [x, y] = hubScene();
    return { x: (x / halfW + 1) / 2, y: 1 - (y / halfH + 1) / 2 };
  }

  function destroy() {
    stop();
    gl.deleteBuffer(lineBuf);
    gl.deleteBuffer(pointBuf);
    gl.deleteVertexArray(lineVao);
    gl.deleteVertexArray(pointVao);
    gl.deleteProgram(lineProg);
    gl.deleteProgram(pointProg);
  }

  layout();
  return { start, stop, resize, setPointer, clearPointer, hubFraction, destroy };
}
