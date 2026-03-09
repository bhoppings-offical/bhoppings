"use strict";

class AddonManager {
  constructor() {
    if (!localStorage.getItem("installed-addons")) {
      localStorage.setItem("installed-addons", JSON.stringify([]));
    }
    this.installedAddons = JSON.parse(localStorage.getItem("installed-addons") || "[]");
    this.hooks = {};
    this.registry = [];
  }

  registerHook(hookName, callback) {
    if (!this.hooks[hookName]) this.hooks[hookName] = [];
    this.hooks[hookName].push(callback);
  }

  applyHook(hookName, data) {
    const callbacks = this.hooks[hookName] || [];
    return callbacks.map(cb => cb(data)).filter(Boolean);
  }

  isInstalled(id) {
    return this.installedAddons.includes(id);
  }

  install(id) {
    if (!this.isInstalled(id)) {
      this.installedAddons.push(id);
      localStorage.setItem("installed-addons", JSON.stringify(this.installedAddons));
    }
  }

  uninstall(id) {
    this.installedAddons = this.installedAddons.filter(a => a !== id);
    localStorage.setItem("installed-addons", JSON.stringify(this.installedAddons));
    // Clear all hooks so uninstalled addon's callbacks are gone
    this.hooks = {};
  }

  async loadAddonScript(scriptSrc) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = scriptSrc + "?v=" + Date.now();
      script.onload = resolve;
      script.onerror = () => reject(new Error("Failed to load addon: " + scriptSrc));
      document.head.appendChild(script);
    });
  }

  async loadInstalledAddons(availableAddons) {
    this.registry = availableAddons;
    for (const addon of availableAddons) {
      if (this.isInstalled(addon.id)) {
        try {
          await this.loadAddonScript(addon.script);
          console.log(`[AddonManager] Loaded addon: ${addon.name} v${addon.version}`);
        } catch (e) {
          console.error(`[AddonManager] Failed to load addon: ${addon.id}`, e);
        }
      }
    }
  }
}

window.AddonManager = new AddonManager();
