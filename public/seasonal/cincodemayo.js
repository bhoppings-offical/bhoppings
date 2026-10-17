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
      color: rgba(255,80,80,0.6);
      font-family: "Kumbh Sans", sans-serif;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      transition: color 0.2s;
    }
    #seasonal-widget:hover #seasonal-widget-label { color: rgba(255,80,80,1); }
    #seasonal-widget-icon {
      font-size: 42px;
      line-height: 1;
      filter: drop-shadow(0 0 12px rgba(255,60,60,0.7));
      animation: pinata-swing 1.2s ease-in-out infinite;
    }
    #seasonal-widget.active #seasonal-widget-icon {
      animation: pinata-burst 0.4s ease-in-out infinite;
    }
    @keyframes pinata-swing {
      0%,100% { transform: rotate(-12deg) scale(1); }
      50%      { transform: rotate(12deg) scale(1.05); }
    }
    @keyframes pinata-burst {
      0%,100% { transform: scale(1) rotate(0deg); }
      50%      { transform: scale(1.2) rotate(15deg); }
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
      background: radial-gradient(ellipse at center, rgba(0,150,60,0.07) 0%, rgba(220,0,0,0.05) 60%, transparent 80%);
      opacity: 0;
      transition: opacity 1s ease;
    }
    #seasonal-glow.visible { opacity: 1; }
  `;
  document.head.appendChild(style);

  const widget = document.createElement("div");
  widget.id = "seasonal-widget";
  widget.innerHTML = `
    <div id="seasonal-widget-label">¡Cinco de Mayo! 🎉</div>
    <div id="seasonal-widget-icon">🪅</div>
  `;
  document.body.appendChild(widget);

  const canvas = document.createElement("canvas");
  canvas.id = "seasonal-canvas";
  document.body.appendChild(canvas);

  const glow = document.createElement("div");
  glow.id = "seasonal-glow";
  document.body.appendChild(glow);

  const ctx = canvas.getContext("2d");
  let pieces = [], active = false, raf = null;

  // Mexican flag colors + festive extras
  const COLORS = [
    "#006847","#FFFFFF","#CE1126",
    "#FFD700","#FF6600","#FF3399",
    "#00AA55","#FF2244",
  ];
  const EMOJIS = ["🪅","🌮","🎉","🌶️","🎊","🌵","🎸","🥑"];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function burst(cx, cy) {
    for (let i = 0; i < 55; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 3;
      const isEmoji = Math.random() < 0.15;
      pieces.push({
        isEmoji,
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: isEmoji ? Math.random() * 14 + 12 : Math.random() * 8 + 4,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.25,
        gravity: 0.18 + Math.random() * 0.1,
        drag: 0.97,
        alpha: 1,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        shape: ["rect","circle","tri"][Math.floor(Math.random() * 3)],
      });
    }
  }

  function spawnDrift() {
    return {
      isEmoji: true,
      x: Math.random() * canvas.width,
      y: -30,
      vx: (Math.random() - 0.5) * 1.5,
      vy: Math.random() * 1.5 + 0.5,
      size: Math.random() * 16 + 14,
      rotation: 0,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      gravity: 0,
      drag: 1,
      alpha: Math.random() * 0.4 + 0.6,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.03 + 0.01,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = pieces.length - 1; i >= 0; i--) {
      const p = pieces[i];
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.vy *= p.drag;
      if (p.wobble !== undefined) {
        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * 0.5;
      } else {
        p.x += p.vx;
      }
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.alpha -= p.gravity > 0 ? 0.014 : 0;
      if (p.alpha <= 0 || p.y > canvas.height + 50) { pieces.splice(i, 1); continue; }

      ctx.save();
      ctx.globalAlpha = p.alpha;

      if (p.isEmoji) {
        ctx.font = p.size + "px serif";
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillText(p.emoji, -p.size / 2, p.size / 2);
      } else {
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size * 0.3, p.size, p.size * 0.6);
        } else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 0.5);
          ctx.lineTo(p.size * 0.45, p.size * 0.4);
          ctx.lineTo(-p.size * 0.45, p.size * 0.4);
          ctx.closePath();
          ctx.fill();
        }
      }
      ctx.restore();
    }

    if (active) {
      if (Math.random() < 0.05) {
        burst(Math.random() * canvas.width, Math.random() * canvas.height * 0.5);
      }
      if (pieces.filter(p => p.gravity === 0).length < 30 && Math.random() < 0.1) {
        pieces.push(spawnDrift());
      }
    }

    if (active || pieces.length > 0) {
      raf = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function start() {
    active = true;
    glow.classList.add("visible");
    widget.classList.add("active");
    widget.querySelector("#seasonal-widget-label").textContent = "Click to stop 🎉";
    burst(canvas.width * 0.35, canvas.height * 0.45);
    burst(canvas.width * 0.65, canvas.height * 0.4);
    if (!raf) draw();
  }

  function stop() {
    active = false;
    glow.classList.remove("visible");
    widget.classList.remove("active");
    widget.querySelector("#seasonal-widget-label").textContent = "¡Cinco de Mayo! 🎉";
  }

  widget.addEventListener("click", () => active ? stop() : start());

})();
