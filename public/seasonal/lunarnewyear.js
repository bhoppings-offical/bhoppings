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
      color: rgba(255,200,50,0.6);
      font-family: "Kumbh Sans", sans-serif;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      transition: color 0.2s;
    }
    #seasonal-widget:hover #seasonal-widget-label { color: rgba(255,215,80,1); }
    #seasonal-widget-icon {
      font-size: 42px;
      line-height: 1;
      filter: drop-shadow(0 0 18px rgba(255,80,50,0.9));
      animation: lantern-sway 2s ease-in-out infinite;
    }
    #seasonal-widget.active #seasonal-widget-icon {
      animation: lantern-glow 0.5s ease-in-out infinite;
    }
    @keyframes lantern-sway {
      0%,100% { transform: rotate(-8deg); }
      50%      { transform: rotate(8deg); }
    }
    @keyframes lantern-glow {
      0%,100% { transform: scale(1);    filter: drop-shadow(0 0 18px rgba(255,80,50,0.9)); }
      50%      { transform: scale(1.15); filter: drop-shadow(0 0 28px rgba(255,200,50,1)); }
    }
    #seasonal-canvas {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 8887;
    }
    #seasonal-glow {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 8886;
      background: radial-gradient(ellipse at center, rgba(220,30,30,0.10) 0%, rgba(255,180,0,0.05) 50%, transparent 70%);
      opacity: 0;
      transition: opacity 1s ease;
    }
    #seasonal-glow.visible { opacity: 1; }
  `;
  document.head.appendChild(style);

  const widget = document.createElement("div");
  widget.id = "seasonal-widget";
  widget.innerHTML = `
    <div id="seasonal-widget-label">Lunar New Year! 🧧</div>
    <div id="seasonal-widget-icon">🏮</div>
  `;
  document.body.appendChild(widget);

  const canvas = document.createElement("canvas");
  canvas.id = "seasonal-canvas";
  document.body.appendChild(canvas);

  const glow = document.createElement("div");
  glow.id = "seasonal-glow";
  document.body.appendChild(glow);

  const ctx = canvas.getContext("2d");
  let particles = [], active = false, raf = null;

  const FIREWORK_COLORS = [
    "#FF2200","#FF6600","#FFD700","#FF88AA","#FF4488",
    "#FFAA00","#FFFFFF","#FF3300","#FFE066",
  ];
  const EMOJIS = ["🧧","🏮","🐉","✨","🎆","🌟","💛","❤️","🎇"];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function burst(cx, cy) {
    for (let i = 0; i < 50; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = Math.random() * 7 + 2;
      particles.push({
        type: "spark",
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        color: FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
        size: Math.random() * 5 + 2,
        alpha: 1,
        gravity: 0.15,
        drag: 0.96,
      });
    }
  }

  function spawnLantern() {
    return {
      type: "emoji",
      x: Math.random() * canvas.width,
      y: -30,
      vx: (Math.random() - 0.5) * 0.8,
      vy: Math.random() * 0.8 + 0.4,
      size: Math.random() * 18 + 16,
      alpha: Math.random() * 0.4 + 0.6,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.008,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      if (p.type === "spark") {
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.018;
        if (p.alpha <= 0) { particles.splice(i, 1); continue; }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

      } else {
        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * 0.5;
        p.y += p.vy;
        if (p.y > canvas.height + 40) { particles.splice(i, 1); continue; }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.font = p.size + "px serif";
        ctx.fillText(p.emoji, p.x - p.size / 2, p.y + p.size / 2);
        ctx.restore();
      }
    }

    if (active) {
      // Random fireworks
      if (Math.random() < 0.04) {
        burst(Math.random() * canvas.width, Math.random() * canvas.height * 0.55);
      }
      // Falling lanterns
      if (particles.filter(p => p.type === "emoji").length < 40 && Math.random() < 0.1) {
        particles.push(spawnLantern());
      }
    }

    if (active || particles.length > 0) {
      raf = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function start() {
    active = true;
    glow.classList.add("visible");
    widget.classList.add("active");
    widget.querySelector("#seasonal-widget-label").textContent = "Click to stop 🧧";
    burst(canvas.width * 0.3, canvas.height * 0.4);
    burst(canvas.width * 0.7, canvas.height * 0.35);
    if (!raf) draw();
  }

  function stop() {
    active = false;
    glow.classList.remove("visible");
    widget.classList.remove("active");
    widget.querySelector("#seasonal-widget-label").textContent = "Lunar New Year! 🧧";
  }

  widget.addEventListener("click", () => active ? stop() : start());

})();
