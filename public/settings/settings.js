$(document).ready(async () => {
  [window.cursorSvg, window.bIconSvg, window.effectIconSvg, window.cursors, window.themes] =
  await Promise.all([
    fetch("/assets/images/cursor.svg").then(r => r.text()),
    fetch("/assets/images/icons/bhop-b.svg").then(r => r.text()),
    fetch("/assets/images/icons/bolt.svg").then(r => r.text()),
    fetch("/config/cursors.json").then(r => r.json()),
    fetch("/config/themes.json").then(r => r.json())
  ]);
  settingsReady();
});

function updateSidebar() {
  $("#sidebar-button-cursor").append($(cursorSvg));
  $("#sidebar-button-theme").append($(bIconSvg));
  $("#sidebar-button-effect").append($(effectIconSvg));
}


function settingsReady() {
  updateSidebar();
  renderSettings();
  document.getElementById("settings-content-container").addEventListener("click", (e) => {
    if (e.target.parentElement.parentElement.id === "cursor-section") {
      const cursorId = e.target.getAttribute("data-cursor-id");
      applyCursor(cursorId)
    }
  });
  document.getElementById("settings-content-container").addEventListener("click", (e) => {
    if (e.target.parentElement.parentElement.id === "theme-section") {
      const themeId = e.target.getAttribute("data-theme-id");
      applyTheme(themeId)
    }
  });
}

function formatKey(key) {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function applyCursorColor(svg, colors) {
  const uniqueId = colors.join('_').replace(/#/g, '');
  const gradientId = `paint0_linear_${uniqueId}`;
  
  return svg
    .replace("white", colors[0])
    .replace("#EEEEEE", colors[1] || colors[0])
    .replace(/paint0_linear_2743_7907/g, gradientId);
}

function renderSettings() {
  const cursors = window.cursors;
  const themes = window.themes;
  const cursorSection = document.getElementById("cursor-section");
  const themeSection = document.getElementById("theme-section");
  const effectSection = document.getElementById("effect-section");
  cursorSection.innerHTML = "";
  for (let i = 0; i < Object.keys(cursors).length; i ++) {
    const key = Object.keys(cursors)[i];
    const cursor = cursors[key];
    const innerHTML = `<div class="settings-item-icon">${applyCursorColor(window.cursorSvg, cursor)}</div><div class="settings-item-button" data-cursor-id="${key}">Apply ${formatKey(key)}</div>`;
    const elem = document.createElement("div");
    elem.classList.add("settings-item");
    elem.innerHTML = innerHTML;
    cursorSection.appendChild(elem);
  }
  themeSection.innerHTML = "";
  for (let i = 0; i < Object.keys(themes).length; i ++) {
    const key = Object.keys(themes)[i];
    const theme = themes[key];
    const innerHTML = `<div class="settings-item-icon settings-item-icon-masked-b" style='--bg: linear-gradient(to right, ${theme.primary.join(", ")}'></div><div class="settings-item-button" data-theme-id="${key}">Apply ${formatKey(key)}</div>`;
    const elem = document.createElement("div");
    elem.classList.add("settings-item");
    elem.innerHTML = innerHTML;
    themeSection.appendChild(elem);
  }
}