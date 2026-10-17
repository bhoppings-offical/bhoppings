/* heavy credit to claude */
(function () {
  'use strict';

  const VERT = `
    attribute vec2 p;
    varying vec2 vUv;
    void main() { vUv = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }
  `;

  const FRAG = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uA, uB;
    uniform float uMix, uGainA, uGainB, uTime, uAspect;

    mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

    vec3 flow(sampler2D tex, vec2 uv, float t) {
      vec2 p = uv - .5;
      p.x *= uAspect;
      float r = length(p);

      // the whole field turns slowly, and the middle swirls a bit harder
      // than the edges, which is what gives it the poured-liquid look
      float a = t * .045 + 1.25 * exp(-r * r * 3.2) * sin(t * .1);
      p = rot(a) * p;

      // domain warp: four octaves of drifting sines. smooth, no hard folds.
      float amp = .27;
      for (int i = 0; i < 4; i++) {
        float f = float(i);
        p += amp * vec2(
          sin(p.y * (1.55 + f * 1.1) + t * (.19 + f * .045) + f * 1.7),
          cos(p.x * (1.4 + f * 1.0) - t * (.15 + f * .055) + f * 2.9)
        );
        amp *= .56;
      }
      return texture2D(tex, p * .78 + .5).rgb;
    }

    void main() {
      vec3 a = flow(uA, vUv, uTime) * uGainA;
      vec3 b = flow(uB, vUv, uTime) * uGainB;
      float m = uMix * uMix * (3. - 2. * uMix);
      vec3 c = mix(a, b, m);

      // keep colour, lose any chance of a blown-out background
      float l = dot(c, vec3(.2126, .7152, .0722));
      c = mix(vec3(l), c, 1.5);
      c = c / (1. + .4 * c) * 1.22;

      // vignette pulls the eye to the middle and keeps the corners calm
      float v = length((vUv - .5) * vec2(uAspect, 1.));
      c *= 1. - .40 * smoothstep(.22, .9, v);
      // the controls live along the bottom, so that edge settles darker (vUv.y = 0 is the bottom)
      c *= 1. - .46 * smoothstep(.62, .0, vUv.y);

      gl_FragColor = vec4(c, 1.);
    }
  `;

  const TEX = 128;
  const TARGET_LUMA = .22;
  const MOTION_SPEED = [0, .55, 1];
  const FADE_SECONDS = 1.5;

  function rng(seed) {
    let s = seed >>> 0;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }

  function neutralCanvas() {
    const c = document.createElement('canvas');
    c.width = c.height = TEX;
    const g = c.getContext('2d');
    g.fillStyle = '#2c2c2f';
    g.fillRect(0, 0, TEX, TEX);
    const r = rng(7);
    const blobs = [
      ['#4b4b4f', .30], ['#4b4b4f', .26], ['#3d3d41', .34],
      ['#161618', .30], ['#161618', .26], ['#1e1e20', .36],
    ];
    g.filter = 'blur(14px)';
    for (const [col, size] of blobs) {
      g.fillStyle = col;
      g.beginPath();
      g.ellipse(r() * TEX, r() * TEX, size * TEX, size * TEX * (.6 + r() * .5), r() * Math.PI, 0, Math.PI * 2);
      g.fill();
    }
    g.filter = 'none';
    return c;
  }

  // Cover art → small, very soft square. Two-step downscale approximates an
  // area average (a single big drawImage shrink aliases), then a blur on the
  // way back up removes the bilinear "pyramid" look.
  function blurredCanvas(img) {
    const w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
    const s = Math.min(w, h), sx = (w - s) / 2, sy = (h - s) / 2;

    const mid = document.createElement('canvas');
    mid.width = mid.height = 96;
    const m = mid.getContext('2d');
    m.imageSmoothingQuality = 'high';
    m.drawImage(img, sx, sy, s, s, 0, 0, 96, 96);

    const tiny = document.createElement('canvas');
    tiny.width = tiny.height = 24;
    const t = tiny.getContext('2d');
    t.imageSmoothingQuality = 'high';
    t.drawImage(mid, 0, 0, 24, 24);

    const c = document.createElement('canvas');
    c.width = c.height = TEX;
    const g = c.getContext('2d');
    g.imageSmoothingQuality = 'high';
    g.filter = 'blur(7px)';
    g.drawImage(tiny, -14, -14, TEX + 28, TEX + 28);   // overdraw so blur has no transparent rim
    g.filter = 'none';
    return c;
  }

  function meanLuma(canvas) {
    const t = document.createElement('canvas');
    t.width = t.height = 16;
    const g = t.getContext('2d', { willReadFrequently: true });
    g.drawImage(canvas, 0, 0, 16, 16);
    const d = g.getImageData(0, 0, 16, 16).data;
    let sum = 0;
    for (let i = 0; i < d.length; i += 4) sum += (.2126 * d[i] + .7152 * d[i + 1] + .0722 * d[i + 2]) / 255;
    return sum / (d.length / 4);
  }

  class LiquidBG {
    constructor(canvas, { scale = .5 } = {}) {
      this.canvas = canvas;
      this.scale = scale;
      this.ok = false;
      this.t = 0;
      this.mix = 1;
      this.motion = 1;
      this.rate = 1;
      this.rateTarget = 1;
      this.running = false;
      this.last = 0;

      canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); this.ok = false; });
      canvas.addEventListener('webglcontextrestored', () => this._init(true));

      this._init(false);
      if (this.ok) {
        new ResizeObserver(() => this._resize()).observe(canvas);
        this._resize();
      }
    }

    _init(restoring) {
      const gl = this.gl = this.canvas.getContext('webgl', {
        antialias: false, alpha: false, depth: false, stencil: false,
        powerPreference: 'low-power', preserveDrawingBuffer: false,
      });
      if (!gl) return;

      const sh = (type, src) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, src); gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(s)); return null; }
        return s;
      };
      const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
      if (!vs || !fs) return;
      const prog = this.prog = gl.createProgram();
      gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'p');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      this.u = {};
      for (const n of ['uA', 'uB', 'uMix', 'uGainA', 'uGainB', 'uTime', 'uAspect']) this.u[n] = gl.getUniformLocation(prog, n);
      gl.uniform1i(this.u.uA, 0);
      gl.uniform1i(this.u.uB, 1);

      this.ok = true;
      this._texA = this._makeTex(neutralCanvas());
      this._texB = this._texA;
      this._gainA = this._gainB = this._gain(neutralCanvas());
      this._hasArt = false;
      this._resize();
      if (restoring) this._kick();
    }

    _makeTex(source) {
      const gl = this.gl, tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
      return tex;
    }

    _gain(canvas) {
      const l = Math.max(meanLuma(canvas), .02);
      return Math.min(Math.max(TARGET_LUMA / l, .32), 1.5);
    }

    _resize() {
      if (!this.ok) return;
      const w = Math.max(2, Math.round(this.canvas.clientWidth * this.scale));
      const h = Math.max(2, Math.round(this.canvas.clientHeight * this.scale));
      if (this.canvas.width !== w || this.canvas.height !== h) {
        this.canvas.width = w; this.canvas.height = h;
        this.gl.viewport(0, 0, w, h);
      }
      this._kick();
    }

    /** img: a loaded HTMLImageElement, or null for the neutral grey liquid. */
    setSource(img) {
      if (!this.ok) return;
      const gl = this.gl;
      const src = img ? blurredCanvas(img) : neutralCanvas();
      const tex = this._makeTex(src);
      const gain = this._gain(src);

      // if we're mostly through a fade, promote B to A; otherwise keep A
      if (this.mix > .5) {
        if (this._texA !== this._texB) gl.deleteTexture(this._texA);
        this._texA = this._texB; this._gainA = this._gainB;
      } else if (this._texB !== this._texA) {
        gl.deleteTexture(this._texB);
      }
      this._texB = tex; this._gainB = gain;
      this._hasArt = !!img;
      this.mix = 0;
      this._kick();
    }

    setMotion(level) { this.motion = level; this._kick(); }
    setPlaying(p)    { this.rateTarget = p ? 1 : .3; this._kick(); }

    _kick() {
      if (!this.ok || this.running) return;
      this.running = true;
      this.last = performance.now();
      requestAnimationFrame(ts => this._frame(ts));
    }

    _frame(ts) {
      if (!this.ok) { this.running = false; return; }
      const dt = Math.min(.1, (ts - this.last) / 1000);
      this.last = ts;

      const speed = MOTION_SPEED[this.motion] ?? 1;
      this.rate += (this.rateTarget - this.rate) * (1 - Math.exp(-dt * 2.2));
      this.t += dt * speed * this.rate;
      if (this.mix < 1) this.mix = Math.min(1, this.mix + dt / FADE_SECONDS);

      this.draw();

      const settled = this.mix >= 1 && (speed === 0 || document.hidden);
      if (settled) { this.running = false; return; }
      requestAnimationFrame(t2 => this._frame(t2));
    }

    draw() {
      const gl = this.gl;
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this._texA);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this._texB);
      gl.uniform1f(this.u.uMix, this.mix);
      gl.uniform1f(this.u.uGainA, this._gainA);
      gl.uniform1f(this.u.uGainB, this._gainB);
      gl.uniform1f(this.u.uTime, this.t);
      gl.uniform1f(this.u.uAspect, this.canvas.width / this.canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    renderAt(t) { this.t = t; this.mix = 1; this.draw(); }
  }

  window.LiquidBG = LiquidBG;
})();
