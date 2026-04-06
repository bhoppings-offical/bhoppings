"use strict";
(function () {

  const style = document.createElement("style");
  style.textContent = `
    #seasonal-widget {
      position: fixed;
      bottom: 32px;
      right: 32px;
      z-index: 8888;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      user-select: none;
    }
    #seasonal-widget-label {
      font-size: 11px;
      color: rgba(255,100,80,0.6);
      font-family: "Kumbh Sans", sans-serif;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      transition: color 0.2s;
    }
    #seasonal-widget:hover #seasonal-widget-label { color: rgba(255,120,100,1); }
    #seasonal-widget-icon {
      font-size: 42px;
      line-height: 1;
      filter: drop-shadow(0 0 16px rgba(255,80,50,0.8));
      animation: firecracker-idle 1.5s ease-in-out infinite;
    }
    #seasonal-widget.active #seasonal-widget-icon {
      animation: firecracker-shake 0.15s ease-in-out infinite;
    }
    @keyframes firecracker-idle {
      0%,100% { transform: rotate(-5deg); }
      50%      { transform: rotate(5deg) scale(1.1); }
    }
    @keyframes firecracker-shake {
      0%,100% { transform: rotate(-8deg) scale(1.1); }
      50%      { transform: rotate(8deg) scale(1.15); }
    }
    #seasonal-canvas {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 8887;
    }
  `;
  document.head.appendChild(style);

  const widget = document.createElement("div");
  widget.id = "seasonal-widget";
  widget.innerHTML = `
    <div id="seasonal-widget-label">Happy 4th of July! 🇺🇸</div>
    <div id="seasonal-widget-icon">🎆</div>
  `;
  document.body.appendChild(widget);

  const canvas = document.createElement("canvas");
  canvas.id = "seasonal-canvas";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let rockets = [], sparks = [], active = false, raf = null;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const COLORS = ["#FF4444","#FFFFFF","#4488FF","#FF8800","#FF44AA","#FFDD00","#44FFAA"];

  function explode(x, y) {
    const color1 = COLORS[Math.floor(Math.random() * COLORS.length)];
    const color2 = COLORS[Math.floor(Math.random() * COLORS.length)];
    const count = 80 + Math.floor(Math.random() * 40);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      sparks.push({
        x, y,
        vx: Math.cos(angle) * speed * (0.8 + Math.random() * 0.4),
        vy: Math.sin(angle) * speed * (0.8 + Math.random() * 0.4),
        color: Math.random() < 0.5 ? color1 : color2,
        alpha: 1,
        size: Math.random() * 3 + 1.5,
        gravity: 0.06,
        drag: 0.97,
        trail: [],
      });
    }
  }

  function spawnRocket() {
    return {
      x: Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
      y: canvas.height,
      vy: -(Math.random() * 6 + 10),
      targetY: canvas.height * (0.1 + Math.random() * 0.4),
      trail: [],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }

  function draw() {
    // Fade trail
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw rockets
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.trail.push({ x: r.x, y: r.y });
      if (r.trail.length > 12) r.trail.shift();
      r.y += r.vy;
      r.vy *= 0.98;

      for (let t = 0; t < r.trail.length; t++) {
        ctx.beginPath();
        ctx.arc(r.trail[t].x, r.trail[t].y, 2, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        ctx.globalAlpha = (t / r.trail.length) * 0.6;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (r.y <= r.targetY || r.vy > -1) {
        explode(r.x, r.y);
        rockets.splice(i, 1);
      }
    }

    // Draw sparks
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.vx *= s.drag;
      s.vy *= s.drag;
      s.vy += s.gravity;
      s.x += s.vx;
      s.y += s.vy;
      s.alpha -= 0.016;
      if (s.alpha <= 0) { sparks.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.alpha;
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    if (active && Math.random() < 0.03 && rockets.length < 5) {
      rockets.push(spawnRocket());
    }

    if (active || rockets.length > 0 || sparks.length > 0) {
      raf = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function start() {
    active = true;
    widget.classList.add("active");
    widget.querySelector("#seasonal-widget-label").textContent = "Click to stop 🎆";
    rockets.push(spawnRocket());
    rockets.push(spawnRocket());
    if (!raf) draw();
  }

  function stop() {
    active = false;
    widget.classList.remove("active");
    widget.querySelector("#seasonal-widget-label").textContent = "Happy 4th of July! 🇺🇸";
  }

  widget.addEventListener("click", () => active ? stop() : start());

})();
