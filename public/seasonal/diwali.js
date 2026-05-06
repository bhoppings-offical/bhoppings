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
      color: rgba(255,190,50,0.6);
      font-family: "Kumbh Sans", sans-serif;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      transition: color 0.2s;
    }
    #seasonal-widget:hover #seasonal-widget-label { color: rgba(255,200,80,1); }
    #seasonal-widget-icon {
      font-size: 42px;
      line-height: 1;
      filter: drop-shadow(0 0 16px rgba(255,160,20,0.9));
      animation: diya-flicker 0.9s ease-in-out infinite;
    }
    #seasonal-widget.active #seasonal-widget-icon {
      animation: diya-blaze 0.3s ease-in-out infinite;
    }
    @keyframes diya-flicker {
      0%,100% { transform: scale(1);    filter: drop-shadow(0 0 16px rgba(255,160,20,0.9)); }
      33%      { transform: scale(1.04); filter: drop-shadow(0 0 22px rgba(255,200,60,1)); }
      66%      { transform: scale(0.97); filter: drop-shadow(0 0 12px rgba(255,120,10,0.8)); }
    }
    @keyframes diya-blaze {
      0%,100% { transform: scale(1.1) rotate(-3deg); filter: drop-shadow(0 0 24px rgba(255,200,50,1)); }
      50%      { transform: scale(1.18) rotate(3deg); filter: drop-shadow(0 0 32px rgba(255,240,100,1)); }
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
      background: radial-gradient(ellipse at center, rgba(255,140,0,0.12) 0%, rgba(255,200,0,0.05) 50%, transparent 70%);
      opacity: 0;
      transition: opacity 1s ease;
    }
    #seasonal-glow.visible { opacity: 1; }
  `;
  document.head.appendChild(style);

  const widget = document.createElement("div");
  widget.id = "seasonal-widget";
  widget.innerHTML = `
    <div id="seasonal-widget-label">Happy Diwali! 🪔</div>
    <div id="seasonal-widget-icon">🪔</div>
  `;
  document.body.appendChild(widget);

  const canvas = document.createElement("canvas");
  canvas.id = "seasonal-canvas";
  document.body.appendChild(canvas);

  const glow = document.createElement("div");
  glow.id = "seasonal-glow";
  document.body.appendChild(glow);

  const ctx = canvas.getContext("2d");
  let sparks = [], active = false, raf = null;

  const SPARK_COLORS = [
    "#FFD700","#FF8C00","#FF6600","#FFAA00","#FFF0A0",
    "#FF4400","#FFCC00","#FFFFFF","#FFB830",
  ];
  const EMOJIS = ["🪔","✨","🌟","💫","⭐","🎆","🌠","🔥","🎇"];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function burst(cx, cy) {
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 1.5;
      particles.push({
        type: "spark",
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 2,
        color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
        size: Math.random() * 3 + 1.5,
        alpha: 1,
        gravity: 0.12,
        drag: 0.97,
        trail: [],
      });
    }
  }

  // alias for closure
  let particles = sparks;

  function spawnDiya() {
    return {
      type: "emoji",
      x: Math.random() * canvas.width,
      y: canvas.height + 30,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -(Math.random() * 0.8 + 0.3),  // drift upward slowly, like heat rising
      size: Math.random() * 16 + 14,
      alpha: Math.random() * 0.3 + 0.65,
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
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 5) p.trail.shift();
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;
        if (p.alpha <= 0) { particles.splice(i, 1); continue; }

        // Draw trailing tail
        for (let t = 0; t < p.trail.length; t++) {
          const tp = p.trail[t];
          const ta = (t / p.trail.length) * p.alpha * 0.5;
          ctx.save();
          ctx.globalAlpha = ta;
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(tp.x, tp.y, p.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

      } else {
        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * 0.4;
        p.y += p.vy;
        // Fade as they rise out of frame
        if (p.y < canvas.height * 0.2) p.alpha -= 0.01;
        if (p.alpha <= 0 || p.y < -40) { particles.splice(i, 1); continue; }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.font = p.size + "px serif";
        ctx.fillText(p.emoji, p.x - p.size / 2, p.y + p.size / 2);
        ctx.restore();
      }
    }

    if (active) {
      if (Math.random() < 0.06) {
        burst(Math.random() * canvas.width, Math.random() * canvas.height * 0.7);
      }
      if (particles.filter(p => p.type === "emoji").length < 25 && Math.random() < 0.08) {
        particles.push(spawnDiya());
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
    widget.querySelector("#seasonal-widget-label").textContent = "Click to stop 🪔";
    burst(canvas.width * 0.25, canvas.height * 0.5);
    burst(canvas.width * 0.5,  canvas.height * 0.35);
    burst(canvas.width * 0.75, canvas.height * 0.5);
    if (!raf) draw();
  }

  function stop() {
    active = false;
    glow.classList.remove("visible");
    widget.classList.remove("active");
    widget.querySelector("#seasonal-widget-label").textContent = "Happy Diwali! 🪔";
  }

  widget.addEventListener("click", () => active ? stop() : start());

})();
