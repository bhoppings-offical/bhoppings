"use strict";
(function () {
  const VERA_BASE = "https://vera-bhoppings.vercel.app/";

  // Hook: called for each app card after render.
  // Expects { app: { url, name, ... }, buttonContainer: HTMLElement }
  window.AddonManager.registerHook("appCardButtons", function ({ app, buttonContainer }) {
    if (!app.url) return;

    const veraUrl = VERA_BASE + app.url;

    const btn = document.createElement("a");
    btn.className = "app-vera-button";
    btn.href = veraUrl;
    btn.target = "_blank";
    btn.rel = "noopener noreferrer";
    btn.innerHTML = `
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/>
        <line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
      Open in Vera
    `;

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    buttonContainer.appendChild(btn);
  });

  console.log("[Vera Addon] Registered successfully");
})();
