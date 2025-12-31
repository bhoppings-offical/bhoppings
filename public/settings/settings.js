$(document).ready(async () => {
  [window.cursorSvg, window.bIconSvg, window.cursors, window.themes] =
  await Promise.all([
    fetch("/assets/images/cursor.svg").then(r => r.text()),
    fetch("/assets/images/icons/bhop-b.svg").then(r => r.text()),
    fetch("/config/cursors.json").then(r => r.json()),
    fetch("/config/themes.json").then(r => r.json())
  ]);
  settingsReady();
});

function updateSidebar() {
  $("#sidebar-button-cursor").empty().append($(applyCursorColor(cursorSvg, window.cursors[JSON.parse(localStorage.getItem("settings")).cursor] || ["#fff", "#fff"])));
}


function settingsReady() {
  updateSidebar();
  renderSettings();
  document.getElementById("settings-content-container").setAttribute("style", "transform: translateY(+0px)");
  document.getElementById("settings-content-loading").style.display = "none";
  document.getElementById("settings-content-container").addEventListener("click", (e) => {
    if (e.target.parentElement.parentElement.id === "cursor-section" && e.target.classList.contains("settings-item-button")) {
      const cursorId = e.target.getAttribute("data-cursor-id");
      setCursor(cursorId)
    }
  });
  document.getElementById("settings-content-container").addEventListener("click", (e) => {
    if (e.target.parentElement.parentElement.id === "theme-section" && e.target.classList.contains("settings-item-button")) {
      const themeId = e.target.getAttribute("data-theme-id");
      applyTheme(themeId)
    }
  });
  document.getElementById("settings-content-container").addEventListener("click", (e) => {
    if (e.target.parentElement.parentElement.id === "effect-section" && e.target.classList.contains("settings-item-button")) {
      const id = e.target.getAttribute("data-effect-id");
      setEffect(id);
      const sett = JSON.parse(localStorage.getItem("settings"));
      sett.effect = id;
      localStorage.setItem("settings", JSON.stringify(sett));
    }
  });
}

function formatKey(key) {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ').replace("Oled", "OLED");
}

function applyCursorColor(svg, colors) {
  const uniqueId = colors.join('_').replace(/#/g, '');
  const gradientId = `paint0_linear_${uniqueId}`;

  return svg
    .replace(/paint0_linear_[^"]+/g, gradientId)
    .replace(/stop-color="white"/, `stop-color="${colors[0]}"`)
    .replace(/stop-color="#EEEEEE"/, `stop-color="${colors[1] || colors[0]}"`);
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
    const innerHTML = `<div class="settings-item-icon">${applyCursorColor(window.cursorSvg, cursor)}</div><div class="settings-item-button" data-cursor-id="${key}">${formatKey(key)}</div>`;
    const elem = document.createElement("div");
    elem.classList.add("settings-item");
    elem.innerHTML = innerHTML;
    cursorSection.appendChild(elem);
  }
  (function() {
    const innerHTML = `<div class="settings-item-icon"><img src="/assets/images/icons/times-square.svg" /></div><div class="settings-item-button" data-cursor-id="none">Default</div>`;
    const elem = document.createElement("div");
    elem.classList.add("settings-item");
    elem.innerHTML = innerHTML;
    cursorSection.appendChild(elem);
  })();
  themeSection.innerHTML = "";
  for (let i = 0; i < Object.keys(themes).length; i ++) {
      const key = Object.keys(themes)[i];
    const theme = themes[key];
    const innerHTML = `<div class="settings-item-icon settings-item-icon-masked-b" style='--bg: linear-gradient(to right, ${theme.primary.join(", ")}'></div><div class="settings-item-button" data-theme-id="${key}">${formatKey(key)}</div>`;
    const elem = document.createElement("div");
    elem.classList.add("settings-item");
    elem.innerHTML = innerHTML;
    themeSection.appendChild(elem);
  }
  effectSection.innerHTML = "";
  for (let i = 0; i < Object.keys(window.effects).length; i ++) {
    const name = window.effects[i];
    const innerHTML = `<div class="settings-item-icon"><img src="/assets/images/effect-icons/${name}.svg" /></div><div class="settings-item-button" data-effect-id="${name}">${formatKey(name)}</div>`;
    const elem = document.createElement("div");
    elem.classList.add("settings-item");
    elem.innerHTML = innerHTML;
    effectSection.appendChild(elem);
  }
  document.getElementById("settings-content-container").scrollTop = 0;
}