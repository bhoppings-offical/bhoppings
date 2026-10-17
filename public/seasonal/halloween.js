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
      color: rgba(255,160,50,0.6);
      font-family: "Kumbh Sans", sans-serif;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      transition: color 0.2s;
    }
    #seasonal-widget:hover #seasonal-widget-label { color: rgba(255,160,50,1); }
    #seasonal-widget-icon {
      font-size: 42px;
      line-height: 1;
      filter: drop-shadow(0 0 14px rgba(255,100,0,0.7));
      animation: pumpkin-idle 2s ease-in-out infinite;
    }
    #seasonal-widget.active #seasonal-widget-icon {
      animation: pumpkin-flicker 0.3s ease-in-out infinite alternate;
    }
    @keyframes pumpkin-idle {
      0%,100% { transform: rotate(-4deg); }
      50%      { transform: rotate(4deg); }
    }
    @keyframes pumpkin-flicker {
      0%   { filter: drop-shadow(0 0 8px rgba(255,80,0,0.5)); }
      100% { filter: drop-shadow(0 0 22px rgba(255,120,0,1)); }
    }
    #seasonal-canvas {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 8887;
    }
    #seasonal-dark {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 8885;
      background: rgba(10,0,20,0);
      transition: background 1s ease;
    }
    #seasonal-dark.visible { background: rgba(10,0,20,0.35); }
  `;
  document.head.appendChild(style);

  const widget = document.createElement("div");
  widget.id = "seasonal-widget";
  widget.innerHTML = `
    <div id="seasonal-widget-label">Happy Halloween! 🕷️</div>
    <div id="seasonal-widget-icon">🎃</div>
  `;
  document.body.appendChild(widget);

  const canvas = document.createElement("canvas");
  canvas.id = "seasonal-canvas";
  document.body.appendChild(canvas);

  const dark = document.createElement("div");
  dark.id = "seasonal-dark";
  document.body.appendChild(dark);

  const ctx = canvas.getContext("2d");
  let bats = [], active = false, raf = null;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // Draw a simple bat shape using arcs
  function drawBat(ctx, x, y, size, wingPhase) {
    const flap = Math.sin(wingPhase) * 0.4;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "rgba(30,0,50,0.85)";
    // Body
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.28, size * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();
    // Left wing
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-size * 0.8, -size * 0.5 * (1 + flap), -size, size * 0.1);
    ctx.quadraticCurveTo(-size * 0.5, size * 0.25, 0, size * 0.05);
    ctx.fill();
    // Right wing
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(size * 0.8, -size * 0.5 * (1 + flap), size, size * 0.1);
    ctx.quadraticCurveTo(size * 0.5, size * 0.25, 0, size * 0.05);
    ctx.fill();
    // Eyes
    ctx.fillStyle = "rgba(255,140,0,0.9)";
    ctx.beginPath();
    ctx.arc(-size * 0.1, -size * 0.02, size * 0.05, 0, Math.PI * 2);
    ctx.arc(size * 0.1, -size * 0.02, size * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function spawnBat() {
    const fromRight = Math.random() < 0.5;
    return {
      x: fromRight ? canvas.width + 60 : -60,
      y: Math.random() * canvas.height * 0.7 + 50,
      size: Math.random() * 20 + 20,
      speed: (Math.random() * 2 + 1.5) * (fromRight ? -1 : 1),
      drift: (Math.random() - 0.5) * 0.4,
      wingPhase: Math.random() * Math.PI * 2,
      wingSpeed: Math.random() * 0.15 + 0.1,
      wobbleAmp: Math.random() * 20 + 10,
      wobbleSpeed: Math.random() * 0.03 + 0.01,
      wobble: Math.random() * Math.PI * 2,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = bats.length - 1; i >= 0; i--) {
      const b = bats[i];
      b.x += b.speed;
      b.wobble += b.wobbleSpeed;
      b.y += Math.sin(b.wobble) * 0.5;
      b.wingPhase += b.wingSpeed;
      if (b.x < -120 || b.x > canvas.width + 120) { bats.splice(i, 1); continue; }
      drawBat(ctx, b.x, b.y, b.size, b.wingPhase);
    }

    if (active && bats.length < 18 && Math.random() < 0.04) {
      bats.push(spawnBat());
    }

    if (active || bats.length > 0) {
      raf = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function start() {
    active = true;
    dark.classList.add("visible");
    widget.classList.add("active");
    widget.querySelector("#seasonal-widget-label").textContent = "Click to stop 🕷️";
    if (!raf) draw();
  }

  function stop() {
    active = false;
    dark.classList.remove("visible");
    widget.classList.remove("active");
    widget.querySelector("#seasonal-widget-label").textContent = "Happy Halloween! 🕷️";
  }

  widget.addEventListener("click", () => active ? stop() : start());

})();
