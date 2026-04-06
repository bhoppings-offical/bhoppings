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
      color: rgba(255,200,220,0.6);
      font-family: "Kumbh Sans", sans-serif;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      transition: color 0.2s;
    }
    #seasonal-widget:hover #seasonal-widget-label { color: rgba(255,180,200,1); }
    #seasonal-widget-icon {
      font-size: 42px;
      line-height: 1;
      filter: drop-shadow(0 0 14px rgba(255,100,150,0.7));
      animation: heart-pulse 1.2s ease-in-out infinite;
    }
    #seasonal-widget.active #seasonal-widget-icon {
      animation: heart-pulse-fast 0.5s ease-in-out infinite;
    }
    @keyframes heart-pulse {
      0%,100% { transform: scale(1); }
      50%      { transform: scale(1.18); }
    }
    @keyframes heart-pulse-fast {
      0%,100% { transform: scale(1); }
      50%      { transform: scale(1.25) rotate(5deg); }
    }
    #seasonal-canvas {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 8887;
      opacity: 0;
      transition: opacity 0.6s ease;
    }
    #seasonal-canvas.visible { opacity: 1; }
    #seasonal-glow {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 8886;
      background: radial-gradient(ellipse at center, rgba(255,80,130,0.12) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 1s ease;
    }
    #seasonal-glow.visible { opacity: 1; }
  `;
  document.head.appendChild(style);

  const widget = document.createElement("div");
  widget.id = "seasonal-widget";
  widget.innerHTML = `
    <div id="seasonal-widget-label">Happy Valentine's! 💕</div>
    <div id="seasonal-widget-icon">🩷</div>
  `;
  document.body.appendChild(widget);

  const canvas = document.createElement("canvas");
  canvas.id = "seasonal-canvas";
  document.body.appendChild(canvas);

  const glow = document.createElement("div");
  glow.id = "seasonal-glow";
  document.body.appendChild(glow);

  const ctx = canvas.getContext("2d");
  let hearts = [], active = false, raf = null;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const HEART_EMOJIS = ["🩷","💖","💗","💝","💓","❤️","💞"];

  function spawnHeart() {
    return {
      x: Math.random() * canvas.width,
      y: -30,
      size: Math.random() * 18 + 14,
      speed: Math.random() * 1.2 + 0.5,
      drift: (Math.random() - 0.5) * 0.8,
      alpha: Math.random() * 0.5 + 0.5,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.03 + 0.01,
      rotation: (Math.random() - 0.5) * 0.4,
      emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = hearts.length - 1; i >= 0; i--) {
      const h = hearts[i];
      h.wobble += h.wobbleSpeed;
      h.x += h.drift + Math.sin(h.wobble) * 0.5;
      h.y += h.speed;
      if (h.y > canvas.height + 40) { hearts.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = h.alpha;
      ctx.font = h.size + "px serif";
      ctx.translate(h.x, h.y);
      ctx.rotate(h.rotation * Math.sin(h.wobble));
      ctx.fillText(h.emoji, -h.size / 2, h.size / 2);
      ctx.restore();
    }

    if (active && hearts.length < 120 && Math.random() < 0.25) {
      hearts.push(spawnHeart());
    }

    if (active || hearts.length > 0) {
      raf = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function start() {
    active = true;
    canvas.classList.add("visible");
    glow.classList.add("visible");
    widget.classList.add("active");
    widget.querySelector("#seasonal-widget-label").textContent = "Click to stop 💕";
    if (!raf) draw();
  }

  function stop() {
    active = false;
    canvas.classList.remove("visible");
    glow.classList.remove("visible");
    widget.classList.remove("active");
    widget.querySelector("#seasonal-widget-label").textContent = "Happy Valentine's! 💕";
  }

  widget.addEventListener("click", () => active ? stop() : start());

})();
