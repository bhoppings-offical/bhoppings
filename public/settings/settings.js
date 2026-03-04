"use strict";

$(document).ready(async () => {
  [window.cursorSvg, window.bIconSvg, window.cursors, window.themes] =
  await Promise.all([
    fetch("/assets/images/cursor.svg").then(r => r.text()),
    fetch("/assets/images/icons/bhop-b.svg").then(r => r.text()),
    fetch("/config/cursors.json").then(r => r.json()),
    fetch("/config/themes.json").then(r => r.json())
  ]);

  // Extract categories before rendering so they don't pollute the item lists
  window.themeCategories = window.themes._categories || {};
  window.cursorCategories = window.cursors._categories || {};
  delete window.themes._categories;
  delete window.cursors._categories;

  settingsReady();
});

function updateSidebar() {
  $("#sidebar-button-cursor").empty().append($(applyCursorColor(cursorSvg, window.cursors[JSON.parse(localStorage.getItem("settings")).cursor] || ["#fff", "#fff"])));
}


function settingsReady() {
  const settings = JSON.parse(window.localStorage.getItem("settings")) || {};
  updateSidebar();
  renderSettings();
  applyGlass();
  if (settings.liquidGlass) {
    showGlass();
    $("#glass-switch").addClass("enabled");
  } else {
    hideGlass();
    handleGlassSwitch();
    setTimeout(handleGlassSwitch, 1);
  }
  if (settings.legacyNavbar) {
    $("#navbar-switch").addClass("enabled")
  }
  if (settings.skipBio) {
    $("#bio-switch").addClass("enabled")
  }
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
  $(".switch").not("#glass-switch, #navbar-switch, #bio-switch").on("click", function(e) {
    $(this).toggleClass("enabled");
  });
  $("#background-url").val(JSON.parse(localStorage.getItem("settings")).backgroundUrl)
  $("#background-url").on("keydown", async function(e) {
    if (e.key !== "Enter") return;
    const val = $(this).val().trim();
    setBackground(val);
  })
  $("#blurInput").on("input", function(e) {
      const sett = JSON.parse(localStorage.getItem("settings"));
      sett.backgroundBlur = $(this).val();
      localStorage.setItem("settings", JSON.stringify(sett));
      document.documentElement.style.setProperty("--background-blur", `${$(this).val()}px`)
  })
  $(".sidebar-button").on("click", function(e) {
    const idTable = {
      "sidebar-button-cursor": "cursor-section",
      "sidebar-button-theme": "theme-section",
      "sidebar-button-effect": "effect-section"
    }
    const id = idTable[$(this).attr("id")];
    scrollToElement($(`#${id}`))
  })
function handleGlassSwitch() {
      const settings = JSON.parse(window.localStorage.getItem("settings"));
      if (settings.liquidGlass) {
        settings.liquidGlass = false;
        $(this).removeClass("enabled");
        hideGlass();
      }
      else {
        $(this).addClass("enabled");
        settings.liquidGlass = true;
        showGlass();
      }
      window.localStorage.setItem("settings", JSON.stringify(settings));
    }
  $("#glass-switch").on("click", handleGlassSwitch)
    $("#navbar-switch").on("click", function(e) {
      const settings = JSON.parse(window.localStorage.getItem("settings"));
      if (settings.legacyNavbar) {
        settings.legacyNavbar = false;
        $(this).removeClass("enabled");
        $("#navbar").removeClass("legacy");

      }
      else {
        $(this).addClass("enabled");
        settings.legacyNavbar = true;
        $("#navbar").addClass("legacy");

      }
      window.localStorage.setItem("settings", JSON.stringify(settings));
    })
    $("#bio-switch").on("click", function(e) {
      const settings = JSON.parse(window.localStorage.getItem("settings"));
      if (settings.skipBio) {
        settings.skipBio = false;
        $(this).removeClass("enabled");
      }
      else {
        $(this).addClass("enabled");
        settings.skipBio = true;

      }
      window.localStorage.setItem("settings", JSON.stringify(settings));
    })
//chatgpt nerd scrolling
const idTable = {
  "sidebar-button-cursor": "cursor-section",
  "sidebar-button-theme": "theme-section",
  "sidebar-button-effect": "effect-section"
};

const $container = $("#settings-content-container");
const $sections = $.map(idTable, (sectionId) => $(`#${sectionId}`));
let activeButton = null;

$container.on("scroll", function() {
  const containerScrollTop = $container.scrollTop();
  const containerHeight = $container.height();

  let mostVisibleSection = null;
  let maxVisibleHeight = 0;

  $sections.forEach(($section) => {
    const sectionTop = $section.position().top;
    const sectionHeight = $section.outerHeight();

    // Calculate visible portion of the section
    const visibleTop = Math.max(sectionTop, 0);
    const visibleBottom = Math.min(sectionTop + sectionHeight, containerHeight);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);

    if (visibleHeight > maxVisibleHeight) {
      maxVisibleHeight = visibleHeight;
      mostVisibleSection = $section;
    }
  });

  if (!mostVisibleSection) return;

  const sectionId = mostVisibleSection.attr("id");
  const buttonId = Object.entries(idTable).find(([key, val]) => val === sectionId)?.[0];
  if (!buttonId || buttonId === activeButton) return;

  if (activeButton) $(`#${activeButton}`).removeClass("active");
  $(`#${buttonId}`).addClass("active");
  activeButton = buttonId;
});
}

function formatKey(key) {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ').replace("Oled", "OLED").replace("Default", "Legacy");
}

function applyCursorColor(svg, colors) {
  const uniqueId = colors.join('_').replace(/#/g, '');
  const gradientId = `paint0_linear_${uniqueId}`;

  return svg
    .replace(/paint0_linear_[^"]+/g, gradientId)
    .replace(/stop-color="white"/, `stop-color="${colors[0]}"`)
    .replace(/stop-color="#EEEEEE"/, `stop-color="${colors[1] || colors[0]}"`);
}

// ─── Layout & Filter Icons ────────────────────────────────────────────────────

const LAYOUT_ICONS = {
  default: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><rect x="2" y="2" width="9" height="9" rx="1.5"/><rect x="13" y="2" width="9" height="9" rx="1.5"/><rect x="2" y="13" width="9" height="9" rx="1.5"/><rect x="13" y="13" width="9" height="9" rx="1.5"/></svg>`,
  compact: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="17" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/><rect x="17" y="9" width="6" height="6" rx="1"/><rect x="1" y="17" width="6" height="6" rx="1"/><rect x="9" y="17" width="6" height="6" rx="1"/><rect x="17" y="17" width="6" height="6" rx="1"/></svg>`,
  list: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><rect x="2" y="3" width="20" height="4" rx="1.5"/><rect x="2" y="10" width="20" height="4" rx="1.5"/><rect x="2" y="17" width="20" height="4" rx="1.5"/></svg>`
};

// ─── Toolbar Builder ──────────────────────────────────────────────────────────

function buildToolbar(sectionId, categories, idAttr) {
  const settings = JSON.parse(localStorage.getItem("settings")) || {};
  const savedLayout = settings.layouts?.[sectionId] || "default";

  const toolbar = document.createElement("div");
  toolbar.className = "section-toolbar";

  // Filter pills
  const pillsWrapper = document.createElement("div");
  pillsWrapper.className = "filter-pills";

  const allPill = document.createElement("button");
  allPill.className = "filter-pill active";
  allPill.setAttribute("data-filter", "all");
  allPill.textContent = "All";
  pillsWrapper.appendChild(allPill);

  for (const cat of Object.keys(categories)) {
    const pill = document.createElement("button");
    pill.className = "filter-pill";
    pill.setAttribute("data-filter", cat);
    pill.textContent = formatKey(cat);
    pillsWrapper.appendChild(pill);
  }

  toolbar.appendChild(pillsWrapper);

  // Layout buttons
  const layoutWrapper = document.createElement("div");
  layoutWrapper.className = "layout-buttons";

  for (const [layout, icon] of Object.entries(LAYOUT_ICONS)) {
    const btn = document.createElement("button");
    btn.className = "layout-btn" + (layout === savedLayout ? " active" : "");
    btn.setAttribute("data-layout", layout);
    btn.setAttribute("title", formatKey(layout));
    btn.innerHTML = icon;
    layoutWrapper.appendChild(btn);
  }

  toolbar.appendChild(layoutWrapper);

  // Wire up filter clicks
  pillsWrapper.addEventListener("click", (e) => {
    const pill = e.target.closest(".filter-pill");
    if (!pill) return;
    pillsWrapper.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
    pill.classList.add("active");
    filterSection(sectionId, pill.getAttribute("data-filter"), categories, idAttr);
  });

  // Wire up layout clicks
  layoutWrapper.addEventListener("click", (e) => {
    const btn = e.target.closest(".layout-btn");
    if (!btn) return;
    layoutWrapper.querySelectorAll(".layout-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    setLayout(sectionId, btn.getAttribute("data-layout"));
  });

  return toolbar;
}

// ─── Filter Logic ─────────────────────────────────────────────────────────────

function filterSection(sectionId, filter, categories, idAttr) {
  const section = document.getElementById(sectionId);
  const items = section.querySelectorAll(".settings-item");

  items.forEach(item => {
    const btn = item.querySelector(`[${idAttr}]`);
    if (!btn) return;
    const id = btn.getAttribute(idAttr);

    if (filter === "all") {
      item.classList.remove("section-item-hidden");
      return;
    }

    const inCategory = categories[filter] && categories[filter].includes(id);
    item.classList.toggle("section-item-hidden", !inCategory);
  });
}

// ─── Layout Logic ─────────────────────────────────────────────────────────────

function setLayout(sectionId, layout) {
  const section = document.getElementById(sectionId);
  section.classList.remove("layout-default", "layout-compact", "layout-list");
  if (layout !== "default") section.classList.add(`layout-${layout}`);

  const sett = JSON.parse(localStorage.getItem("settings")) || {};
  if (!sett.layouts) sett.layouts = {};
  sett.layouts[sectionId] = layout;
  localStorage.setItem("settings", JSON.stringify(sett));
}

// ─── Render ───────────────────────────────────────────────────────────────────

function renderSettings() {
  const cursors = window.cursors;
  const themes = window.themes;
  const cursorSection = document.getElementById("cursor-section");
  const themeSection = document.getElementById("theme-section");
  const effectSection = document.getElementById("effect-section");
  const settings = JSON.parse(localStorage.getItem("settings")) || {};

  cursorSection.innerHTML = "";

  for (let i = 0; i < Object.keys(cursors).length; i++) {
    const key = Object.keys(cursors)[i];
    const cursor = cursors[key];
    const innerHTML = `<div class="settings-item-icon">${applyCursorColor(window.cursorSvg, cursor)}</div><div class="settings-item-button liquid-glass" data-cursor-id="${key}">${formatKey(key)}</div>`;
    const elem = document.createElement("div");
    elem.classList.add("settings-item", "liquid-glass");
    elem.innerHTML = innerHTML;
    cursorSection.appendChild(elem);
  }

  // Inject cursor toolbar
  const cursorToolbar = buildToolbar("cursor-section", window.cursorCategories, "data-cursor-id");
  cursorSection.insertBefore(cursorToolbar, cursorSection.firstChild);
  // Apply saved layout
  setLayout("cursor-section", settings.layouts?.["cursor-section"] || "default");

  themeSection.innerHTML = "";

  for (let i = 0; i < Object.keys(themes).length; i++) {
    const key = Object.keys(themes)[i];
    const theme = themes[key];
    const innerHTML = `<div class="settings-item-icon settings-item-icon-masked-b" style='--bg: linear-gradient(to right, ${theme.primary.join(", ")}'></div><div class="settings-item-button liquid-glass" data-theme-id="${key}">${formatKey(key)}</div>`;
    const elem = document.createElement("div");
    elem.classList.add("settings-item", "liquid-glass");
    elem.innerHTML = innerHTML;
    themeSection.appendChild(elem);
  }

  // Inject theme toolbar
  const themeToolbar = buildToolbar("theme-section", window.themeCategories, "data-theme-id");
  themeSection.insertBefore(themeToolbar, themeSection.firstChild);
  // Apply saved layout
  setLayout("theme-section", settings.layouts?.["theme-section"] || "default");

  effectSection.innerHTML = "";
  for (let i = 0; i < Object.keys(window.effects).length; i++) {
    const name = window.effects[i];
    const innerHTML = `<div class="settings-item-icon"><img src="/assets/images/effect-icons/${name}.svg" /></div><div class="settings-item-button liquid-glass" data-effect-id="${name}">${formatKey(name)}</div>`;
    const elem = document.createElement("div");
    elem.classList.add("settings-item", "liquid-glass");
    elem.innerHTML = innerHTML;
    effectSection.appendChild(elem);
  }

  document.getElementById("settings-content-container").scrollTop = 0;
}

function getScrollParent($el) {
  let $parent = $el.parent();

  while ($parent.length) {
    if ($parent[0] === document.body) break;

    const overflowY = $parent.css("overflow-y");
    if (overflowY === "auto" || overflowY === "scroll") {
      return $parent;
    }

    $parent = $parent.parent();
  }

  return $("html, body");
}


function scrollToElement(element, duration = 400) {
  const $el = $(element);
  if (!$el.length) return;

  const $parent = getScrollParent($el);

  const elementTop = $el.offset().top;
  const parentTop = $parent.offset()?.top || 0;

  const elementHeight = $el.outerHeight();
  const parentHeight = $parent.innerHeight();

  const targetScrollTop =
    $parent.scrollTop() +
    (elementTop - parentTop) - 192;

  $parent.animate(
    { scrollTop: targetScrollTop },
    duration
  );
}

$("#settings-content-container").on("scroll", function(e) {
  checkGlassBounding();
})
