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
      color: rgba(200,160,255,0.6);
      font-family: "Kumbh Sans", sans-serif;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      transition: color 0.2s;
    }
    #seasonal-widget:hover #seasonal-widget-label { color: rgba(220,180,255,1); }
    #seasonal-widget-icon {
      font-size: 42px;
      line-height: 1;
      filter: drop-shadow(0 0 14px rgba(200,150,255,0.6));
      animation: bunny-hop 1s ease-in-out infinite;
    }
    #seasonal-widget.active #seasonal-widget-icon {
      animation: bunny-hop-fast 0.4s ease-in-out infinite;
    }
    @keyframes bunny-hop {
      0%,100% { transform: translateY(0px); }
      40%      { transform: translateY(-10px); }
      60%      { transform: translateY(-10px); }
    }
    @keyframes bunny-hop-fast {
      0%,100% { transform: translateY(0px) scaleX(1); }
      50%      { transform: translateY(-14px) scaleX(1.05); }
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
      background: radial-gradient(ellipse at center, rgba(180,120,255,0.07) 0%, rgba(255,200,150,0.05) 50%, transparent 70%);
      opacity: 0;
      transition: opacity 1s ease;
    }
    #seasonal-glow.visible { opacity: 1; }
  `;
  document.head.appendChild(style);

  const widget = document.createElement("div");
  widget.id = "seasonal-widget";
  widget.innerHTML = `
    <div id="seasonal-widget-label">Happy Easter! 🐣</div>
    <div id="seasonal-widget-icon">🐰</div>
  `;
  document.body.appendChild(widget);

  const canvas = document.createElement("canvas");
  canvas.id = "seasonal-canvas";
  document.body.appendChild(canvas);

  const glow = document.createElement("div");
  glow.id = "seasonal-glow";
  document.body.appendChild(glow);

  const ctx = canvas.getContext("2d");
  let eggs = [], active = false, raf = null;
  const EGG_EMOJIS = ["🥚","🐣","🐥","🌸","🌷","🌼","💐","🟣","🔵","🟡","🟠","🟢","🩵","🩷","🟤"];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function spawnEgg() {
    return {
      x: Math.random() * canvas.width,
      y: -30,
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 2 + 1,
      size: Math.random() * 22 + 14,
      alpha: 1,
      rotation: (Math.random() - 0.5) * 0.3,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      gravity: 0.08,
      bounce: 0.55 + Math.random() * 0.15,
      bounces: 0,
      maxBounces: Math.floor(Math.random() * 4) + 2,
      emoji: EGG_EMOJIS[Math.floor(Math.random() * EGG_EMOJIS.length)],
      floor: canvas.height * (0.6 + Math.random() * 0.35),
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = eggs.length - 1; i >= 0; i--) {
      const e = eggs[i];
      e.vy += e.gravity;
      e.x += e.vx;
      e.y += e.vy;
      e.rotation += e.rotSpeed;

      // Bounce off floor
      if (e.y >= e.floor) {
        e.y = e.floor;
        e.vy = -Math.abs(e.vy) * e.bounce;
        e.vx *= 0.85;
        e.bounces++;
        if (Math.abs(e.vy) < 0.5) e.vy = 0;
      }

      // Fade out after max bounces + settled
      if (e.bounces >= e.maxBounces && Math.abs(e.vy) < 0.8) {
        e.alpha -= 0.008;
      }
      if (e.alpha <= 0 || e.x < -60 || e.x > canvas.width + 60) {
        eggs.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = e.alpha;
      ctx.font = e.size + "px serif";
      ctx.translate(e.x, e.y);
      ctx.rotate(e.rotation);
      ctx.fillText(e.emoji, -e.size / 2, e.size / 2);
      ctx.restore();
    }

    if (active && eggs.length < 80 && Math.random() < 0.12) {
      eggs.push(spawnEgg());
    }

    if (active || eggs.length > 0) {
      raf = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function start() {
    active = true;
    glow.classList.add("visible");
    widget.classList.add("active");
    widget.querySelector("#seasonal-widget-label").textContent = "Click to stop 🐣";
    if (!raf) draw();
  }

  function stop() {
    active = false;
    glow.classList.remove("visible");
    widget.classList.remove("active");
    widget.querySelector("#seasonal-widget-label").textContent = "Happy Easter! 🐣";
  }

  widget.addEventListener("click", () => active ? stop() : start());

})();
