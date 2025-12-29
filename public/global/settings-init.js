document.addEventListener("DOMContentLoaded", async () => {
  const ls = window.localStorage;

  const defaultSettings = {
    cursor: "snow",
    theme: "default",
    effect: "waves",
    cacheCursor: ["#fff", "#fff"],
    cacheTheme: {
      primary: ["#D185FF", "#51CBFF"],
      background: ["#12151D"]
    }
  };

  if (!ls.getItem("settings")) {
    ls.setItem("settings", JSON.stringify(defaultSettings));
  }

  function getSettings() {
    return JSON.parse(ls.getItem("settings"));
  }

  function setSettings(settings) {
    ls.setItem("settings", JSON.stringify(settings));
  }

  function injectRootStyle(settings) {
    const style = document.createElement("style");
    style.id = "theme-root-style";
    style.innerHTML = `
      :root {
        --theme-color: linear-gradient(to right, ${settings.cacheTheme.primary.join(", ")});
        --background: linear-gradient(to right, ${settings.cacheTheme.background.join(", ")});
      }
    `;
    document.head.appendChild(style);
    return style;
  }

  function removeRootStyle() {
    document.getElementById("theme-root-style")?.remove();
  }

  async function updateCacheTheme() {
    const settings = getSettings();

    const themes = await fetch("/config/themes.json").then(r => r.json());
    settings.cacheTheme = themes[settings.theme];

    setSettings(settings);
    return settings;
  }

  async function applyTheme(name) {
    let settings = getSettings();
    settings.theme = name;
    setSettings(settings);

    settings = await updateCacheTheme();

    removeRootStyle();
    injectRootStyle(settings);
  }

  const settings = await updateCacheTheme();
  injectRootStyle(settings);

  window.applyTheme = applyTheme;
});
