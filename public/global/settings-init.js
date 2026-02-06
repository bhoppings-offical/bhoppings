"use strict";

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
    },
    liquidGlass: false,
    legacyNavbar: false,
    skipBio: false,
    backgroundUrl: null,
    backgroundBlur: 48
  };

  function mergeSettings() {
    const settings = JSON.parse(localStorage.getItem("settings")) || defaultSettings;
    for (const key in defaultSettings) {
      if (!settings[key]) {
        settings[key] = defaultSettings[key];
      }
    }
  }

  mergeSettings();
  
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
    function safeCssUrl(url) {
  if (!url) return "";
  return url.replace(/["')]/g, encodeURIComponent);
}

const background = settings.backgroundUrl
  ? `url("${safeCssUrl(settings.backgroundUrl)}")`
  : `linear-gradient(to right, ${(settings.cacheTheme || defaultSettings.cacheTheme).background.join(", ")})`;
style.innerHTML = `
      :root {
        --theme-color: linear-gradient(to right, ${(settings.cacheTheme || defaultSettings.cacheTheme).primary.join(", ")});
        --background: ${background};
        --background-blur: ${settings.backgroundBlur}px;
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

async function setBackground(url) {
  const settings = JSON.parse(localStorage.getItem("settings"));
  // If url is falsy (null, "", undefined, etc.), the theme gradient will be used instead
  settings.backgroundUrl = url || null;
  localStorage.setItem("settings", JSON.stringify(settings));
  
  // Remove and re-inject styles to apply changes immediately
  removeRootStyle();
  await injectRootStyle(settings);
  
  if (typeof updateSidebar !== 'undefined') {
    updateSidebar();
  }
}

async function setBackgroundBlur(blurAmount) {
  const settings = JSON.parse(localStorage.getItem("settings"));
  settings.backgroundBlur = blurAmount;
  localStorage.setItem("settings", JSON.stringify(settings));
  
  // Remove and re-inject styles to apply changes immediately
  removeRootStyle();
  await injectRootStyle(settings);
  
  if (typeof updateSidebar !== 'undefined') {
    updateSidebar();
  }
}

// Make functions globally available
window.setBackground = setBackground;
window.setBackgroundBlur = setBackgroundBlur;

});
