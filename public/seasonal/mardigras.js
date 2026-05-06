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
      color: rgba(255,210,0,0.6);
      font-family: "Kumbh Sans", sans-serif;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      transition: color 0.2s;
    }
    #seasonal-widget:hover #seasonal-widget-label { color: rgba(255,215,0,1); }
    #seasonal-widget-icon {
      font-size: 42px;
      line-height: 1;
      filter: drop-shadow(0 0 14px rgba(180,0,255,0.8));
      animation: mask-bob 1.5s ease-in-out infinite;
    }
    #seasonal-widget.active #seasonal-widget-icon {
      animation: mask-bob-fast 0.5s ease-in-out infinite;
    }
    @keyframes mask-bob {
      0%,100% { transform: translateY(0) rotate(-5deg); }
      50%      { transform: translateY(-8px) rotate(5deg); }
    }
    @keyframes mask-bob-fast {
      0%,100% { transform: translateY(0) rotate(-8deg) scale(1); }
      50%      { transform: translateY(-10px) rotate(8deg) scale(1.1); }
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
      background: radial-gradient(ellipse at center, rgba(150,0,255,0.08) 0%, rgba(255,200,0,0.04) 60%, transparent 80%);
      opacity: 0;
      transition: opacity 1s ease;
    }
    #seasonal-glow.visible { opacity: 1; }
  `;
  document.head.appendChild(style);

  const widget = document.createElement("div");
  widget.id = "seasonal-widget";
  widget.innerHTML = `
    <div id="seasonal-widget-label">Happy Mardi Gras! 🎭</div>
    <div id="seasonal-widget-icon">🎭</div>
  `;
  document.body.appendChild(widget);

  const canvas = document.createElement("canvas");
  canvas.id = "seasonal-canvas";
  document.body.appendChild(canvas);

  const glow = document.createElement("div");
  glow.id = "seasonal-glow";
  document.body.appendChild(glow);

  const ctx = canvas.getContext("2d");
  let beads = [], active = false, raf = null;

  // Classic Mardi Gras colors: purple, gold, green
  const BEAD_COLORS = [
    "#9B30FF","#7B1FA2","#FFD700","#FFC200","#00A550","#009944",
    "#CC00FF","#FFAA00","#00CC55",
  ];
  const EMOJIS = ["🎭","🪙","✨","💜","💛","💚"];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function spawnBead() {
    const isEmoji = Math.random() < 0.25;
    return {
      isEmoji,
      x: Math.random() * canvas.width,
      y: -20,
      vx: (Math.random() - 0.5) * 2.5,
      vy: Math.random() * 2.5 + 1,
      size: isEmoji ? Math.random() * 16 + 14 : Math.random() * 10 + 6,
      color: BEAD_COLORS[Math.floor(Math.random() * BEAD_COLORS.length)],
      alpha: Math.random() * 0.3 + 0.7,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.06,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.03 + 0.01,
      gravity: 0.06,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      // Bead strand — chain of circles
      trail: Math.random() < 0.4 ? Math.floor(Math.random() * 3) + 2 : 0,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = beads.length - 1; i >= 0; i--) {
      const b = beads[i];
      b.wobble += b.wobbleSpeed;
      b.vy += b.gravity;
      b.x += b.vx + Math.sin(b.wobble) * 0.6;
      b.y += b.vy;
      b.rotation += b.rotSpeed;
      if (b.y > canvas.height + 40) { beads.splice(i, 1); continue; }

      ctx.save();
      ctx.globalAlpha = b.alpha;

      if (b.isEmoji) {
        ctx.font = b.size + "px serif";
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rotation);
        ctx.fillText(b.emoji, -b.size / 2, b.size / 2);
      } else {
        // Draw a small strand of beads
        ctx.fillStyle = b.color;
        ctx.shadowBlur = 4;
        ctx.shadowColor = b.color;
        const r = b.size * 0.5;
        ctx.beginPath();
        ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
        ctx.fill();
        // Trailing bead strand
        for (let t = 1; t <= b.trail; t++) {
          ctx.globalAlpha = b.alpha * (1 - t * 0.28);
          ctx.beginPath();
          ctx.arc(b.x - b.vx * t * 2.5, b.y - b.vy * t * 2.5, r * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    if (active && beads.length < 120 && Math.random() < 0.22) {
      beads.push(spawnBead());
    }

    if (active || beads.length > 0) {
      raf = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function start() {
    active = true;
    glow.classList.add("visible");
    widget.classList.add("active");
    widget.querySelector("#seasonal-widget-label").textContent = "Click to stop 🎭";
    if (!raf) draw();
  }

  function stop() {
    active = false;
    glow.classList.remove("visible");
    widget.classList.remove("active");
    widget.querySelector("#seasonal-widget-label").textContent = "Happy Mardi Gras! 🎭";
  }

  widget.addEventListener("click", () => active ? stop() : start());

})();
