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
      color: rgba(80,200,80,0.6);
      font-family: "Kumbh Sans", sans-serif;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      transition: color 0.2s;
    }
    #seasonal-widget:hover #seasonal-widget-label { color: rgba(80,220,80,1); }
    #seasonal-widget-icon {
      font-size: 42px;
      line-height: 1;
      filter: drop-shadow(0 0 14px rgba(50,200,50,0.8));
      animation: shamrock-idle 2.5s ease-in-out infinite;
    }
    #seasonal-widget.active #seasonal-widget-icon {
      animation: shamrock-spin 1s ease-in-out infinite;
    }
    @keyframes shamrock-idle {
      0%,100% { transform: rotate(-5deg) scale(1); }
      50%      { transform: rotate(5deg) scale(1.1); }
    }
    @keyframes shamrock-spin {
      0%   { transform: rotate(0deg) scale(1.1); }
      100% { transform: rotate(360deg) scale(1.1); }
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
      background: radial-gradient(ellipse at center, rgba(40,180,40,0.08) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 1s ease;
    }
    #seasonal-glow.visible { opacity: 1; }
  `;
  document.head.appendChild(style);

  const widget = document.createElement("div");
  widget.id = "seasonal-widget";
  widget.innerHTML = `
    <div id="seasonal-widget-label">Happy St. Patrick's! 🍀</div>
    <div id="seasonal-widget-icon">☘️</div>
  `;
  document.body.appendChild(widget);

  const canvas = document.createElement("canvas");
  canvas.id = "seasonal-canvas";
  document.body.appendChild(canvas);

  const glow = document.createElement("div");
  glow.id = "seasonal-glow";
  document.body.appendChild(glow);

  const ctx = canvas.getContext("2d");
  let clovers = [], active = false, raf = null;
  const EMOJIS = ["☘️","🍀","💚","✨","🌿"];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function spawnClover() {
    return {
      x: Math.random() * canvas.width,
      y: -30,
      size: Math.random() * 20 + 12,
      speed: Math.random() * 1.5 + 0.6,
      drift: (Math.random() - 0.5) * 1,
      alpha: Math.random() * 0.4 + 0.6,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.05,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.01,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = clovers.length - 1; i >= 0; i--) {
      const c = clovers[i];
      c.wobble += c.wobbleSpeed;
      c.x += c.drift + Math.sin(c.wobble) * 0.6;
      c.y += c.speed;
      c.rotation += c.rotSpeed;
      if (c.y > canvas.height + 40) { clovers.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = c.alpha;
      ctx.font = c.size + "px serif";
      ctx.translate(c.x, c.y);
      ctx.rotate(c.rotation);
      ctx.fillText(c.emoji, -c.size / 2, c.size / 2);
      ctx.restore();
    }

    if (active && clovers.length < 100 && Math.random() < 0.2) {
      clovers.push(spawnClover());
    }

    if (active || clovers.length > 0) {
      raf = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function start() {
    active = true;
    glow.classList.add("visible");
    widget.classList.add("active");
    widget.querySelector("#seasonal-widget-label").textContent = "Click to stop 🍀";
    if (!raf) draw();
  }

  function stop() {
    active = false;
    glow.classList.remove("visible");
    widget.classList.remove("active");
    widget.querySelector("#seasonal-widget-label").textContent = "Happy St. Patrick's! 🍀";
  }

  widget.addEventListener("click", () => active ? stop() : start());

})();
