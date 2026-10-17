"use strict";

(async function () {
  const manager = window.AddonManager;
  const container = document.getElementById("addons-container");

  // Render skeleton while loading
  container.innerHTML = `
    <div class="addons-header">
      <h1 class="addons-title">Addons</h1>
      <p class="addons-subtitle">Extend and customise bhoppings.de with addons.</p>
    </div>
    <div class="addons-grid" id="addons-grid">
      ${[1,2,3].map(() => `<div class="addon-card skeleton"></div>`).join("")}
    </div>
  `;

  let availableAddons = [];
  try {
    const res = await fetch("/config/addons.json");
    availableAddons = await res.json();
  } catch (e) {
    container.innerHTML += `<p class="addons-error">Failed to load addons.</p>`;
    return;
  }

  function renderAddons() {
    const grid = document.getElementById("addons-grid");
    grid.innerHTML = availableAddons.map(addon => {
      const installed = manager.isInstalled(addon.id);
      const tags = (addon.tags || []).map(t => `<span class="addon-tag">${t}</span>`).join("");
      return `
        <div class="addon-card liquid-glass" data-id="${addon.id}">
          <div class="addon-card-top">
            <img class="addon-icon" src="${addon.icon}" alt="${addon.name}" onerror="this.style.display='none'">
            <div class="addon-info">
              <div class="addon-name">${addon.name}</div>
              <div class="addon-meta">by ${addon.author} &nbsp;·&nbsp; v${addon.version}</div>
            </div>
            <button class="addon-btn ${installed ? "installed" : "install"}" data-id="${addon.id}">
              ${installed ? "Uninstall" : "Install"}
            </button>
          </div>
          <p class="addon-description">${addon.description}</p>
          <div class="addon-tags">${tags}</div>
        </div>
      `;
    }).join("");

    // Bind buttons
    grid.querySelectorAll(".addon-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        const id = this.dataset.id;
        if (manager.isInstalled(id)) {
          manager.uninstall(id);
          showToast(`"${id}" uninstalled. Refresh to apply changes.`);
        } else {
          manager.install(id);
          showToast(`"${id}" installed! Refresh any open pages to activate.`);
        }
        renderAddons();
      });
    });
  }

  renderAddons();

  function showToast(msg) {
    const existing = document.querySelector(".addon-toast");
    if (existing) existing.remove();
    const toast = document.createElement("div");
    toast.className = "addon-toast";
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }
})();
