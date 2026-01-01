function svgToDataURL(svgString) {
  // 1. Define the data URL prefix
  const prefix = 'data:image/svg+xml,';
  
  // 2. Encode the SVG string for URL safety
  // This is a simple encoding. For full optimization/edge cases, 
  // a library like 'mini-svg-data-uri' might be better.
  const encodedSVG = encodeURIComponent(svgString)
    .replace(/'/g, '%27') // Replace single quotes with %27
    .replace(/"/g, '%22'); // Replace double quotes with %22

  // 3. Combine the prefix and the encoded string
  return prefix + encodedSVG;
}

document.addEventListener("DOMContentLoaded", async () => {

  if (!localStorage.getItem("app-favorites")) {
    localStorage.setItem("app-favorites", JSON.stringify([]));
  }

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

  
    fetch("/config/themes.json").then(r => r.json()).then(d => {window.themes = d});
    fetch("/config/cursors.json").then(r => r.json()).then(d => {window.cursors = d});
    fetch("/assets/images/cursor.svg").then(r => r.json()).then(d => {window.cursorSvg = d});

  if (!localStorage.getItem("settings")) {
    localStorage.setItem("settings", JSON.stringify(defaultSettings));
  }

  function getSettings() {
    return JSON.parse(localStorage.getItem("settings"));
  }

  function setSettings(settings) {
    localStorage.setItem("settings", JSON.stringify(settings));
  }

  async function injectRootStyle(settings) {
    const style = document.createElement("style");
    style.id = "theme-root-style";
    const cursorLine = settings.cursor == "none" ? "" : `--cursor: url("${svgToDataURL(applyCursorColor(window.cursorSvg || (await fetch("/assets/images/cursor.svg").then(r => r.text())), settings.cacheCursor || defaultSettings.cacheCursor))}")`
    style.innerHTML = `
      :root {
        --theme-color: linear-gradient(to right, ${(settings.cacheTheme || defaultSettings.cacheTheme).primary.join(", ")});
        --background: linear-gradient(to right, ${(settings.cacheTheme || defaultSettings.cacheTheme).background.join(", ")});
        ${cursorLine}
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
    const themes = window.themes || await fetch("/config/themes.json").then(r => r.json());
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

  function applyCursorColor(svg, colors) {
  const uniqueId = colors.join('_').replace(/#/g, '');
  const gradientId = `paint0_linear_${uniqueId}`;

  return svg
    .replace(/paint0_linear_[^"]+/g, gradientId)
    .replace(/stop-color="white"/, `stop-color="${colors[0]}"`)
    .replace(/stop-color="#EEEEEE"/, `stop-color="${colors[1] || colors[0]}"`);
}
async function setCursor(key) {
  const cursors = window.cursors || await fetch("/config/cursors.json").then(r => r.json());
  const settings = JSON.parse(localStorage.getItem("settings"));
  settings.cursor = key;
  const cursorSvgOld = window.cursorSvg || await fetch("/assets/images/cursor.svg").then(r => r.json());
  const cursorColor = cursors[key];
  settings.cacheCursor = cursorColor;
  localStorage.setItem("settings", JSON.stringify(settings));
    removeRootStyle();
    injectRootStyle(settings);
    if (updateSidebar) {
      updateSidebar();
    }
}

window.applyCursorColor = applyCursorColor;
window.setCursor = setCursor;
});
