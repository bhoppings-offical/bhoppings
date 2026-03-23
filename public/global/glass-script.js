// made by SnezLinkZ
// math and logic by snezlinkz, parallelization on webgl by claude

"use strict";
console.log("glass script loaded")

class LiquidGlass {
  static colorCoeff = 128;
  static smoothCoefficient = 0.1;
  static padding = 0;
  static depth = 40;
  static ids = [];

  // ─── WebGL state (shared across all calls) ────────────────────────────────
  static _gl        = null;
  static _program   = null;
  static _glCanvas  = null;
  static _uniforms  = {};   // cached uniform locations
  static _webglOk   = null; // null = untested, true/false = result

  // ─── Shaders ─────────────────────────────────────────────────────────────

  static _VS = /* glsl */`
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  // One fragment = one pixel.  Exact port of the JS math.
  static _FS = /* glsl */`
    precision highp float;

    uniform float u_width;
    uniform float u_height;
    uniform float u_radius;
    uniform float u_depth;
    uniform float u_colorCoeff;
    uniform float u_smoothCoeff;

    // Mirrors LiquidGlass.easing(x, y, s)
    float easing(float x, float y) {
      float s    = u_smoothCoeff * 20.0;
      float dist = sqrt(x * x + y * y);
      return (sin(3.141592653589793 * (dist / s - 0.5)) + 1.0) / 2.0;
    }

    // Mirrors LiquidGlass.vectorAtSphere(x, y, d)
    vec2 vectorAtSphere(float x, float y) {
      if (x * x + y * y > 1.0) return vec2(0.0);

      float isNegCoeff = (x <= 0.0 && y <= 0.0) ? -1.0 : 1.0;
      float xt = isNegCoeff * (x / 2 + 0.5f);
      float yt = isNegCoeff * (y / 2 + 0.5f);
      if (sqrt(xt * xt + yt * yt) < 0.00001) return vec2(0.0);

      float e = easing(xt, yt);
      float a = e - 1.0 + u_depth;
      return vec2(e * xt * a * isNegCoeff,
                  e * yt * a * isNegCoeff);
    }

    // Mirrors LiquidGlass.vectorAt(x, y, w, h, r, d)
    // WebGL origin is bottom-left; y is pre-flipped before this call.
    vec2 vectorAt(float x, float y) {
      float w = u_width;
      float h = u_height;
      float r = u_radius;

      // corners
      if (x <= r && y <= r)
        return vectorAtSphere((x - r) / r,  (y - r) / r);
      if (x <= r && h - y <= r)
        return vectorAtSphere((x - r) / r, -(h - y - r) / r);
      if (w - x <= r && y <= r)
        return vectorAtSphere(-(w - x - r) / r,  (y - r) / r);
      if (w - x <= r && h - y <= r)
        return vectorAtSphere(-(w - x - r) / r, -(h - y - r) / r);

      // center — no displacement
      if (x >= r && x <= w - r && y >= r && y <= h - r)
        return vec2(0.0);

      // edges
      if (x >= r && y <= r)
        return vectorAtSphere(0.0,  (y - r) / r);
      if (x >= r && y >= h - r)
        return vectorAtSphere(0.0, -(h - y - r) / r);
      if (x <= r && y >= r && y <= h - r)
        return vectorAtSphere((x - r) / r, 0.0);
      if (w - x <= r && y >= r && y <= h - r)
        return vectorAtSphere(-(w - x - r) / r, 0.0);

      return vec2(0.0);
    }

    void main() {
      // gl_FragCoord origin is bottom-left; flip Y to match canvas-2D top-left.
      float x = gl_FragCoord.x;
      float y = u_height - gl_FragCoord.y;

      vec2 disp = vectorAt(x, y);

      float r = clamp(disp.x * u_colorCoeff + 128.0, 0.0, 255.0) / 255.0;
      float g = clamp(disp.y * u_colorCoeff + 128.0, 0.0, 255.0) / 255.0;
      float b = 128.0 / 255.0;

      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `;

  // ─── WebGL initialisation (runs once, lazily) ─────────────────────────────

  static _initWebGL() {
    if (LiquidGlass._webglOk !== null) return LiquidGlass._webglOk;

    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      console.warn("LiquidGlass: WebGL unavailable, falling back to CPU.");
      LiquidGlass._webglOk = false;
      return false;
    }

    const compile = (type, src) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("LiquidGlass shader error:", gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    };

    const vs = compile(gl.VERTEX_SHADER,   LiquidGlass._VS);
    const fs = compile(gl.FRAGMENT_SHADER, LiquidGlass._FS);
    if (!vs || !fs) { LiquidGlass._webglOk = false; return false; }

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("LiquidGlass link error:", gl.getProgramInfoLog(program));
      LiquidGlass._webglOk = false;
      return false;
    }

    // Full-screen quad (two triangles covering NDC [-1,1])
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,   1, -1,  -1,  1,
      -1,  1,   1, -1,   1,  1,
    ]), gl.STATIC_DRAW);

    gl.useProgram(program);

    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Cache uniform locations once
    LiquidGlass._uniforms = {
      width:      gl.getUniformLocation(program, "u_width"),
      height:     gl.getUniformLocation(program, "u_height"),
      radius:     gl.getUniformLocation(program, "u_radius"),
      depth:      gl.getUniformLocation(program, "u_depth"),
      colorCoeff: gl.getUniformLocation(program, "u_colorCoeff"),
      smoothCoeff:gl.getUniformLocation(program, "u_smoothCoeff"),
    };

    LiquidGlass._gl       = gl;
    LiquidGlass._program  = program;
    LiquidGlass._glCanvas = canvas;
    LiquidGlass._webglOk  = true;
    return true;
  }

  // ─── Displacement map generation ─────────────────────────────────────────

  /**
   * GPU path — runs the fragment shader, one thread per pixel.
   * Returns the internal WebGL canvas (reused each call; convert to dataURL
   * immediately if you need to keep multiple maps alive simultaneously).
   */
  static _generateDisplacementMapGPU(width, height, radius, depth) {
    const gl      = LiquidGlass._gl;
    const canvas  = LiquidGlass._glCanvas;
    const u       = LiquidGlass._uniforms;

    canvas.width  = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);

    gl.uniform1f(u.width,       width);
    gl.uniform1f(u.height,      height);
    gl.uniform1f(u.radius,      Math.max(radius, 1));
    gl.uniform1f(u.depth,       depth);
    gl.uniform1f(u.colorCoeff,  LiquidGlass.colorCoeff);
    gl.uniform1f(u.smoothCoeff, LiquidGlass.smoothCoefficient);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    return canvas;
  }

  /**
   * CPU fallback — identical to the original implementation.
   * Used when WebGL is unavailable.
   */
  static _generateDisplacementMapCPU(width, height, radius, depth, scale) {
    const canvas = document.createElement("canvas");
    canvas.width  = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    const r   = Math.max(radius, 1);
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const vector = LiquidGlass.vectorAt(x, y, width, height, r, depth, scale);
        LiquidGlass.setPixel(ctx, x, y, {
          r: vector[0] * LiquidGlass.colorCoeff + 128,
          g: vector[1] * LiquidGlass.colorCoeff + 128,
          b: 128,
        });
      }
    }
    return canvas;
  }

  /** Public entry point — picks GPU or CPU automatically. */
  static generateDisplacementMap(width, height, radius, depth, scale) {
    if (LiquidGlass._initWebGL()) {
      return LiquidGlass._generateDisplacementMapGPU(width, height, radius, depth);
    }
    return LiquidGlass._generateDisplacementMapCPU(width, height, radius, depth, scale);
  }

  // ─── SVG / filter generation (unchanged) ─────────────────────────────────

  static generateSVG(w, h, disp, id, frost = 0, scale = 20) {
    return `<svg width="${w + LiquidGlass.padding}" height="${h + LiquidGlass.padding}">
    <filter id="disp-svg-${id}">
      <feImage
        id="dispMap"
        href="${disp}"
        x="0" y="0"
        width="${w + LiquidGlass.padding}"
        height="${h + LiquidGlass.padding}"
        result="map"
      />
      <feGaussianBlur in="SourceGraphic" result="blurred" stdDeviation="${frost}" />
      <feDisplacementMap
        in="blurred"
        in2="map"
        scale="${scale}"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </svg>`;
  }

  // ─── Math helpers (unchanged — also used by the CPU fallback) ────────────

  static easing(x, y, s = LiquidGlass.smoothCoefficient * 20) {
    return (Math.sin(Math.PI * (Math.sqrt(x * x + y * y) / s - 0.5)) + 1) / 2;
  }

  static vectorAtSphere(x, y, d = 40) {
    if (x * x + y * y > 1) return [0, 0];
    const isNeg      = x <= 0 && y <= 0;
    const isNegCoeff = isNeg ? -1 : 1;
    const xt   = isNegCoeff * x;
    const yt   = isNegCoeff * y;
    const dist = Math.sqrt(xt * xt + yt * yt);
    if (dist === 0) return [0, 0];
    const e = LiquidGlass.easing(xt, yt);
    const a = e - 1 + d;
    return [e * xt * a * isNegCoeff, e * yt * a * isNegCoeff];
  }

  static vectorAt(x, y, w, h, r, d) {
    if      (x <= r         && y <= r        ) return LiquidGlass.vectorAtSphere( (x - r) / r,  (y - r) / r,      d);
    else if (x <= r         && h - y <= r    ) return LiquidGlass.vectorAtSphere( (x - r) / r, -(h - y - r) / r,  d);
    else if (w - x <= r     && y <= r        ) return LiquidGlass.vectorAtSphere(-(w - x - r) / r,  (y - r) / r,   d);
    else if (w - x <= r     && h - y <= r    ) return LiquidGlass.vectorAtSphere(-(w - x - r) / r, -(h - y - r) / r, d);
    else if (x >= r && x <= w - r && y >= r && y <= h - r) return [0, 0];
    else if (x >= r         && y <= r        ) return LiquidGlass.vectorAtSphere(0,  (y - r) / r,      d);
    else if (x >= r         && y >= h - r    ) return LiquidGlass.vectorAtSphere(0, -(h - y - r) / r,  d);
    else if (x <= r         && y >= r && y <= h - r) return LiquidGlass.vectorAtSphere( (x - r) / r, 0, d);
    else if (w - x <= r     && y >= r && y <= h - r) return LiquidGlass.vectorAtSphere(-(w - x - r) / r, 0, d);
    return [0, 0];
  }

  static setPixel(ctx, x, y, color) {
    ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    ctx.fillRect(x, y, 1, 1);
  }

  // ─── DOM mapping (unchanged) ──────────────────────────────────────────────

  static mapElements() {
    let filterContainer = document.getElementById("glass-filters");
    if (!filterContainer) {
      filterContainer = document.createElement("div");
      filterContainer.id = "glass-filters";
      filterContainer.style.setProperty("position", "fixed");
      filterContainer.style.setProperty("left", "100vw");
      filterContainer.style.setProperty("top",  "100vh");
      document.body.appendChild(filterContainer);
    }
    filterContainer.replaceChildren();

    const glassElements = document.getElementsByClassName("liquid-glass");
    LiquidGlass.ids = [];

    for (let i = 0; i < glassElements.length; i++) {
      const elem = glassElements[i];
      const { width, height } = elem.getBoundingClientRect();

      const frost = parseInt(getComputedStyle(elem).getPropertyValue("--glass-frost")    || "0",  10);
      const depth = parseInt(getComputedStyle(elem).getPropertyValue("--glass-depth")    || "0",  10);
      const scale = parseInt(getComputedStyle(elem).getPropertyValue("--glass-strength") || "20", 10);
      const radius = Math.min(height / 2, width / 2,
                              parseInt(getComputedStyle(elem).borderRadius, 10));

      const id = `glass-w${width}-h${height}-r${radius}-f${frost}-d${depth}-s${scale}`;
      elem.style.setProperty("backdrop-filter", `url("#disp-svg-${id}")`);

      if (LiquidGlass.ids.includes(id)) continue;
      LiquidGlass.ids.push(id);

      const canvas = LiquidGlass.generateDisplacementMap(width, height, radius, depth, scale);
      const svg    = LiquidGlass.generateSVG(width, height, canvas.toDataURL(), id, frost, scale);
      filterContainer.insertAdjacentHTML("beforeend", svg);
    }
  }

  static start() {
    requestAnimationFrame(LiquidGlass.loop);
  }
}