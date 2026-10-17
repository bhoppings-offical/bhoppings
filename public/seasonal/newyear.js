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
      color: rgba(255,230,100,0.6);
      font-family: "Kumbh Sans", sans-serif;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      transition: color 0.2s;
    }
    #seasonal-widget:hover #seasonal-widget-label { color: rgba(255,230,100,1); }
    #seasonal-widget-icon {
      font-size: 42px;
      line-height: 1;
      filter: drop-shadow(0 0 16px rgba(255,220,50,0.8));
      animation: sparkler-idle 1s ease-in-out infinite;
    }
    #seasonal-widget.active #seasonal-widget-icon {
      animation: sparkler-spin 0.6s linear infinite;
    }
    @keyframes sparkler-idle {
      0%,100% { transform: rotate(-10deg) scale(1); }
      50%      { transform: rotate(10deg) scale(1.1); }
    }
    @keyframes sparkler-spin {
      from { transform: rotate(0deg) scale(1.2); }
      to   { transform: rotate(360deg) scale(1.2); }
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
    <div id="seasonal-widget-label">Happy New Year! 🎉</div>
    <div id="seasonal-widget-icon">✨</div>
  `;
  document.body.appendChild(widget);

  const canvas = document.createElement("canvas");
  canvas.id = "seasonal-canvas";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let pieces = [], active = false, raf = null;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const COLORS = [
    "#FFD700","#FF4444","#44DDFF","#FF44DD","#44FF88",
    "#FF8844","#FFFFFF","#FFAA00","#CC44FF",
  ];

  function burst(cx, cy) {
    for (let i = 0; i < 60; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = Math.random() * 8 + 3;
      pieces.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 7 + 3,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.3,
        gravity: 0.18 + Math.random() * 0.1,
        drag: 0.97,
        alpha: 1,
        type: Math.random() < 0.5 ? "rect" : "circle",
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = pieces.length - 1; i >= 0; i--) {
      const p = pieces[i];
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.alpha -= 0.012;
      if (p.alpha <= 0 || p.y > canvas.height + 20) { pieces.splice(i, 1); continue; }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      if (p.type === "rect") {
        ctx.fillRect(-p.size / 2, -p.size * 0.3, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Auto-burst while active
    if (active && Math.random() < 0.05) {
      burst(
        Math.random() * canvas.width,
        Math.random() * canvas.height * 0.6
      );
    }

    if (pieces.length > 0 || active) {
      raf = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function start() {
    active = true;
    widget.classList.add("active");
    widget.querySelector("#seasonal-widget-label").textContent = "Click to stop 🎉";
    // Initial big burst from center
    burst(canvas.width / 2, canvas.height * 0.4);
    burst(canvas.width * 0.25, canvas.height * 0.5);
    burst(canvas.width * 0.75, canvas.height * 0.5);
    if (!raf) draw();
  }

  function stop() {
    active = false;
    widget.classList.remove("active");
    widget.querySelector("#seasonal-widget-label").textContent = "Happy New Year! 🎉";
  }

  widget.addEventListener("click", () => active ? stop() : start());

})();
