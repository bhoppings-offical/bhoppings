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
      color: rgba(255,230,0,0.6);
      font-family: "Kumbh Sans", sans-serif;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      transition: color 0.2s;
    }
    #seasonal-widget:hover #seasonal-widget-label { color: rgba(255,230,0,1); }
    #seasonal-widget-icon {
      font-size: 42px;
      line-height: 1;
      filter: drop-shadow(0 0 14px rgba(255,200,0,0.8));
      animation: jester-wobble 0.7s ease-in-out infinite;
    }
    #seasonal-widget.active #seasonal-widget-icon {
      animation: jester-spin 0.4s linear infinite;
    }
    @keyframes jester-wobble {
      0%   { transform: rotate(-15deg) scale(1); }
      25%  { transform: rotate(15deg) scale(1.1); }
      50%  { transform: rotate(-10deg) scale(0.95); }
      75%  { transform: rotate(10deg) scale(1.05); }
      100% { transform: rotate(-15deg) scale(1); }
    }
    @keyframes jester-spin {
      0%   { transform: rotate(0deg) scaleX(1); }
      49%  { transform: rotate(174deg) scaleX(1); }
      50%  { transform: rotate(180deg) scaleX(-1); }
      99%  { transform: rotate(354deg) scaleX(-1); }
      100% { transform: rotate(360deg) scaleX(1); }
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
    <div id="seasonal-widget-label">April Fools! 🃏</div>
    <div id="seasonal-widget-icon">🤡</div>
  `;
  document.body.appendChild(widget);

  const canvas = document.createElement("canvas");
  canvas.id = "seasonal-canvas";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let bits = [], active = false, raf = null;
  const EMOJIS = ["🃏","🎭","❓","😜","🤡","💬","🎪","🙃","🪄","👁️","🫣"];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function spawnBit() {
    // Some fall normally, some fly upward, some go sideways — it's April Fools
    const chaos = Math.random();
    return {
      x: Math.random() * canvas.width,
      y: chaos < 0.2 ? canvas.height + 30 : -30,
      vx: (Math.random() - 0.5) * 4,
      vy: chaos < 0.2 ? -(Math.random() * 2 + 1) : (Math.random() * 2 + 0.8),
      size: Math.random() * 22 + 14,
      alpha: Math.random() * 0.4 + 0.6,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.12,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.06 + 0.02,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      flipAt: Math.random() * 200 + 100,
      traveled: 0,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = bits.length - 1; i >= 0; i--) {
      const b = bits[i];
      b.wobble += b.wobbleSpeed;
      b.x += b.vx + Math.sin(b.wobble) * 1.2;
      b.y += b.vy;
      b.rotation += b.rotSpeed;
      b.traveled += Math.abs(b.vy) + Math.abs(b.vx);

      // Randomly reverse direction mid-flight because why not
      if (b.traveled > b.flipAt && Math.random() < 0.02) {
        b.vy *= -1;
        b.flipAt += 150;
      }

      const oob = b.y > canvas.height + 50 || b.y < -50 || b.x < -60 || b.x > canvas.width + 60;
      if (oob) { bits.splice(i, 1); continue; }

      ctx.save();
      ctx.globalAlpha = b.alpha;
      ctx.font = b.size + "px serif";
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rotation);
      ctx.fillText(b.emoji, -b.size / 2, b.size / 2);
      ctx.restore();
    }

    if (active && bits.length < 80 && Math.random() < 0.18) {
      bits.push(spawnBit());
    }

    if (active || bits.length > 0) {
      raf = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function start() {
    active = true;
    widget.classList.add("active");
    widget.querySelector("#seasonal-widget-label").textContent = "Got you! 😜";
    if (!raf) draw();
  }

  function stop() {
    active = false;
    widget.classList.remove("active");
    widget.querySelector("#seasonal-widget-label").textContent = "April Fools! 🃏";
  }

  widget.addEventListener("click", () => active ? stop() : start());

})();
