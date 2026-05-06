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
      color: rgba(255,180,210,0.6);
      font-family: "Kumbh Sans", sans-serif;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      transition: color 0.2s;
    }
    #seasonal-widget:hover #seasonal-widget-label { color: rgba(255,180,210,1); }
    #seasonal-widget-icon {
      font-size: 42px;
      line-height: 1;
      filter: drop-shadow(0 0 14px rgba(255,130,180,0.7));
      animation: petal-drift 3s ease-in-out infinite;
    }
    #seasonal-widget.active #seasonal-widget-icon {
      animation: petal-bloom 1s ease-in-out infinite;
    }
    @keyframes petal-drift {
      0%,100% { transform: rotate(-6deg) scale(1); }
      33%      { transform: rotate(4deg) scale(1.05) translateY(-3px); }
      66%      { transform: rotate(-2deg) scale(0.97) translateY(2px); }
    }
    @keyframes petal-bloom {
      0%,100% { transform: scale(1) rotate(0deg); }
      50%      { transform: scale(1.2) rotate(8deg); filter: drop-shadow(0 0 20px rgba(255,150,200,1)); }
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
      background: radial-gradient(ellipse at center, rgba(255,100,160,0.08) 0%, rgba(220,150,255,0.04) 55%, transparent 75%);
      opacity: 0;
      transition: opacity 1.2s ease;
    }
    #seasonal-glow.visible { opacity: 1; }
  `;
  document.head.appendChild(style);

  const widget = document.createElement("div");
  widget.id = "seasonal-widget";
  widget.innerHTML = `
    <div id="seasonal-widget-label">Happy Mother's Day! 💐</div>
    <div id="seasonal-widget-icon">💐</div>
  `;
  document.body.appendChild(widget);

  const canvas = document.createElement("canvas");
  canvas.id = "seasonal-canvas";
  document.body.appendChild(canvas);

  const glow = document.createElement("div");
  glow.id = "seasonal-glow";
  document.body.appendChild(glow);

  const ctx = canvas.getContext("2d");
  let petals = [], active = false, raf = null;
  const EMOJIS = ["🌸","🌷","🌺","🌼","🌻","🪷","💮","🌹","🫧","💕","✨"];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function spawnPetal() {
    return {
      x: Math.random() * (canvas.width + 80) - 40,
      y: -40,
      vx: (Math.random() - 0.5) * 0.8,
      vy: Math.random() * 1.0 + 0.4,   // gentle — petals fall slow
      size: Math.random() * 20 + 14,
      alpha: Math.random() * 0.35 + 0.65,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.025,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.018 + 0.006,
      sway: Math.random() * 1.2 + 0.4,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      p.wobble += p.wobbleSpeed;
      p.x += p.vx + Math.sin(p.wobble) * p.sway;
      p.y += p.vy;
      p.rotation += p.rotSpeed;

      // Fade out near bottom
      if (p.y > canvas.height * 0.85) {
        p.alpha -= 0.012;
      }
      if (p.alpha <= 0 || p.y > canvas.height + 50) { petals.splice(i, 1); continue; }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.font = p.size + "px serif";
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillText(p.emoji, -p.size / 2, p.size / 2);
      ctx.restore();
    }

    if (active && petals.length < 70 && Math.random() < 0.14) {
      petals.push(spawnPetal());
    }

    if (active || petals.length > 0) {
      raf = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function start() {
    active = true;
    glow.classList.add("visible");
    widget.classList.add("active");
    widget.querySelector("#seasonal-widget-label").textContent = "Click to stop 💐";
    if (!raf) draw();
  }

  function stop() {
    active = false;
    glow.classList.remove("visible");
    widget.classList.remove("active");
    widget.querySelector("#seasonal-widget-label").textContent = "Happy Mother's Day! 💐";
  }

  widget.addEventListener("click", () => active ? stop() : start());

})();
