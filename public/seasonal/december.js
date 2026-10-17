"use strict";
(function () {

  // ── Styles ────────────────────────────────────────────────────
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
      color: rgba(255,255,255,0.5);
      font-family: "Kumbh Sans", sans-serif;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      transition: color 0.2s;
    }
    #seasonal-widget:hover #seasonal-widget-label { color: rgba(255,255,255,0.9); }
    #seasonal-widget-icon {
      font-size: 42px;
      line-height: 1;
      filter: drop-shadow(0 0 12px rgba(180,220,255,0.5));
      animation: snowman-idle 3s ease-in-out infinite;
      transition: transform 0.15s ease;
    }
    #seasonal-widget:hover #seasonal-widget-icon { transform: scale(1.15); }
    #seasonal-widget.active #seasonal-widget-icon {
      animation: snowman-bounce 0.5s ease-in-out infinite alternate;
    }
    @keyframes snowman-idle {
      0%,100% { transform: translateY(0px) rotate(-2deg); }
      50%      { transform: translateY(-6px) rotate(2deg); }
    }
    @keyframes snowman-bounce {
      0%   { transform: translateY(0px) scale(1) rotate(-3deg); }
      100% { transform: translateY(-12px) scale(1.1) rotate(3deg); }
    }
    #seasonal-canvas {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 8887;
      opacity: 0;
      transition: opacity 0.8s ease;
    }
    #seasonal-canvas.visible { opacity: 1; }
    #snow-ground {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 0px;
      background: linear-gradient(to top, rgba(220,240,255,0.18), transparent);
      pointer-events: none;
      z-index: 8886;
      transition: height 1.2s cubic-bezier(0.22,1,0.36,1);
      border-radius: 60% 60% 0 0 / 20px 20px 0 0;
    }
  `;
  document.head.appendChild(style);

  // ── DOM ───────────────────────────────────────────────────────
  const widget = document.createElement("div");
  widget.id = "seasonal-widget";
  widget.innerHTML = `
    <div id="seasonal-widget-label">Happy December! ❄️</div>
    <div id="seasonal-widget-icon">⛄</div>
  `;
  document.body.appendChild(widget);

  const canvas = document.createElement("canvas");
  canvas.id = "seasonal-canvas";
  document.body.appendChild(canvas);

  const ground = document.createElement("div");
  ground.id = "snow-ground";
  document.body.appendChild(ground);

  // ── Snow logic ────────────────────────────────────────────────
  const ctx = canvas.getContext("2d");
  let flakes = [], active = false, raf = null;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function spawnFlake() {
    return {
      x: Math.random() * canvas.width,
      y: -10,
      r: Math.random() * 4 + 2,
      speed: Math.random() * 1.5 + 0.6,
      drift: (Math.random() - 0.5) * 0.6,
      alpha: Math.random() * 0.5 + 0.5,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.005,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const groundH = Math.min(flakes.length * 0.05, 60);
    ground.style.height = groundH + "px";

    for (let i = flakes.length - 1; i >= 0; i--) {
      const f = flakes[i];
      f.wobble += f.wobbleSpeed;
      f.x += f.drift + Math.sin(f.wobble) * 0.4;
      f.y += f.speed;
      if (f.y > canvas.height - groundH) {
        flakes.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(210,235,255,${f.alpha})`;
      ctx.fill();
    }

    if (active && flakes.length < 280 && Math.random() < 0.35) {
      flakes.push(spawnFlake());
    }

    if (active || flakes.length > 0) {
      raf = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ground.style.height = "0px";
    }
  }

  function start() {
    active = true;
    canvas.classList.add("visible");
    widget.classList.add("active");
    widget.querySelector("#seasonal-widget-label").textContent = "Click to stop ❄️";
    if (!raf) draw();
  }

  function stop() {
    active = false;
    canvas.classList.remove("visible");
    widget.classList.remove("active");
    widget.querySelector("#seasonal-widget-label").textContent = "Happy December! ❄️";
  }

  widget.addEventListener("click", () => active ? stop() : start());

})();
