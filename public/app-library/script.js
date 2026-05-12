“use strict”;
// create #app-container > .app-card
function appCard(app) {
const card = $(”<div></div>”).addClass(“app-card”).data(“href”, ((app.fromRoot ? “” : “/apps/”) + app.url).replace(////, “/”));
const favoriteOutline = $(”<img>”).attr(“src”, “/assets/images/shapes/favorite-border.svg”).addClass(“favorite-border”);
const favorite = $(”<div></div>”).addClass(“app-favorite”).data(“name”, app.name).append(favoriteOutline).addClass(“liquid-glass”);

const favorites = User.getData(“app-favorites”);
if (favorites.includes(app.name)) {
favorite.addClass(“favorited”);
}
const icon = $(”<div></div>”).addClass(“app-icon”);
const iconImg = $(”<img />”).prop(“src”, “/assets/images/app-icons/” + app.image);
if (app.tags && app.tags.includes(“broken”)) {
icon.css(“filter”, “grayscale(1) brightness(0.5)”);
}
const button = $(”<div></div>”).html(”<span>Open</span>”).addClass(“app-button”).addClass(“liquid-glass”).click(function(e) {
window.open($(this).parent().parent().data(“href”), “_blank”);
});
const addonButtons = $(”<div></div>”).addClass(“addon-button-container”);
window.AddonManager.applyHook(“appCardButtons”, {
app: { …app, cardHref: ((app.fromRoot ? “” : “/apps/”) + app.url).replace(////, “/”) },
buttonContainer: addonButtons[0]
});
const title = $(”<div></div>”).html(`<span class="liquid-glass">${app.name}</span>`).addClass(“app-title”).addClass(“liquid-glass”);
const titleBackground = $(”<img>”).prop(“src”, “/assets/images/app-icons/” + app.image).addClass(“title-bg”);
icon.append(iconImg, button, addonButtons, favorite);
title.append(titleBackground);
card.append(icon, icon, title);
return card;
}
// #apps-container > .app
function renderApps() {
const container = $(”#apps-container”);
container.empty();
const favorites = User.getData(“app-favorites”);

window.apps.sort((a, b) => {
return (a.tags ? a.tags.includes(“broken”) : 0) - (b.tags ? b.tags.includes(“broken”) : 0)
})
window.apps.sort((a, b) => {
const aFav = favorites.includes(a.name);
const bFav = favorites.includes(b.name);

return bFav - aFav;
});
let favoriteTitleExists = false;
if (favorites.length >= 1) {
const $e = $(”<h1></h1>”).html(`Your Favorites <span class='small'>(${favorites.length})</span>`);
container.append($e);
}
for (const app of window.apps) {
if (!favorites.includes(app.name) && !favoriteTitleExists) {
const $e = $(”<h1></h1>”).html(`Not Favorited <span class='small'>(${window.apps.length - favorites.length})</span>`);
favoriteTitleExists = true;
container.append($e);
}
const card = appCard(app);
container.append(card);
}
if (User.getData(“settings”).liquidGlass) showGlass();
}

$(document).ready(async function () {
window.apps = await fetch(”/config/app-library.json”).then(r => r.json());
const availableAddons = await fetch(”/config/addons.json”).then(r => r.json()).catch(() => []);
await window.AddonManager.loadInstalledAddons(availableAddons);
renderApps();

$(”#apps-container”).on(“click”, function (e) {
const $favorite = $(e.target).closest(”.app-favorite”);

```
if (!$favorite.length) return;

const name = $favorite.data("name");
if (!name) return;

favoriteApp(name);
```

});
$(”#apps-container”).scrollTop(0);

$(”#search-input”).on(“keydown”, function (e) {
if (e.key === “Enter”) {
e.preventDefault();
search();
}
});
const settings = User.getData(“settings”);
if (settings.liquidGlass) showGlass();
});

function favoriteApp(name) {
const favorites = User.getData(“app-favorites”);
if (favorites.includes(name)) {
favorites.splice(favorites.indexOf(name), 1);
} else {
favorites.push(name);
}
User.setData(“app-favorites”, favorites)
$(”.app-favorite”).filter(function () {
return $(this).data(“name”) === name;
}).toggleClass(“favorited”);
}

function search() {
renderApps();
const query = $(”#search-input”).val();
const passing = fuzzySuggest(query, window.apps).map(o => o.name);
if (query.trim() == “”) {
$(”#apps-container h1”).show();
} else {
$(”#apps-container h1”).hide();
}

$(”.app-card”).each(function () {
const name = $(this).find(”.app-favorite”).data(“name”);

```
if (passing.includes(name)) {
  $(this).show();
} else {
  $(this).hide();
}
```

});
}

//stackoverflow and chatgpt search function nerd shit
function fuzzySuggest(query, items, maxDistance = 3) {
const normalize = str =>
String(str || “”).toLowerCase().replace(/\s+/g, “”);

const levenshtein = (str1, str2) => {
const matrix = Array(str1.length + 1)
.fill()
.map(() => Array(str2.length + 1).fill(0));

```
for (let i = 0; i <= str1.length; i++) matrix[i][0] = i;
for (let j = 0; j <= str2.length; j++) matrix[0][j] = j;

for (let i = 1; i <= str1.length; i++) {
  for (let j = 1; j <= str2.length; j++) {
    if (str1[i - 1] === str2[j - 1]) {
      matrix[i][j] = matrix[i - 1][j - 1];
    } else {
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + 1
      );
    }
  }
}

return matrix[str1.length][str2.length];
```

};

const searchInput = normalize(query);
if (!searchInput) return items;

return items.filter(obj => {
const name = normalize(obj.name);

```
return (
  name.includes(searchInput) ||
  (levenshtein(searchInput, name) <= maxDistance && name.length > 5) || searchInput == ""
);
```

});
}
// ── Tab switching ────────────────────────────────────
let activeTab = “main”;

$(document).ready(function () {
$(”.tab-btn”).on(“click”, function () {
const tab = $(this).data(“tab”);
if (tab === activeTab) return;
activeTab = tab;

```
$(".tab-btn").removeClass("active");
$(this).addClass("active");

if (tab === "main") {
  $("#apps-container").show();
  $("#ugs-container").hide();
} else {
  $("#apps-container").hide();
  $("#ugs-container").show();
  if (!window.ugsLoaded) loadUGS();
}

// clear search when switching tabs
$("#search-input").val("");
if (tab === "main") renderApps();
```

});
});

// ── UGS loading & rendering ──────────────────────────
window.ugsLoaded = false;
window.ugsData = [];   // flat array of { letter, name, url }

function stripCL(name) {
// Remove leading “cl” (case-insensitive) if present
return name.replace(/^cl/i, “”);
}

async function loadUGS() {
const container = $(”#ugs-container”);
container.empty();
container.append(`<div class="ugs-status">Loading games…</div>`);

try {
// games.js from the UGS repo writes <input type="button"> elements into
// a div with id=“sections-container”. We create a hidden one so the
// script has a target to write into, then scrape it after load.
let scratchpad = document.getElementById(“ugs-scratchpad”);
if (!scratchpad) {
scratchpad = document.createElement(“div”);
scratchpad.id = “sections-container”; // must match what games.js expects
scratchpad.style.cssText = “display:none!important;position:absolute;pointer-events:none;”;
document.body.appendChild(scratchpad);
}

```
await new Promise((resolve, reject) => {
  const existingScript = document.getElementById("ugs-games-script");
  if (existingScript) { resolve(); return; }
  const s = document.createElement("script");
  s.id = "ugs-games-script";
  s.src = "https://cdn.jsdelivr.net/gh/bubbls/ugs-singlefile@main/games.js";
  s.onload = resolve;
  s.onerror = reject;
  document.body.appendChild(s);
});

// Give the script a tick to finish any synchronous DOM writes
await new Promise(r => setTimeout(r, 100));

// Now scrape the populated scratchpad
const sections = {};
const letterSections = scratchpad.querySelectorAll(".letter-section");

if (letterSections.length) {
  // Structure: .letter-section > .letter-header + .buttons-container > input[type=button]
  letterSections.forEach(sec => {
    const letter = sec.querySelector(".letter-header")?.textContent?.trim() || "?";
    const buttons = [...sec.querySelectorAll("input[type=button]")];
    if (buttons.length) {
      sections[letter] = buttons.map(btn => {
        // onclick is typically: location.href='url'  or  window.open('url')
        const onclickStr = btn.getAttribute("onclick") || "";
        const urlMatch = onclickStr.match(/['"]([^'"]+)['"]/);
        return { name: btn.value, url: urlMatch ? urlMatch[1] : "#" };
      });
    }
  });
}

// Fallback: maybe games.js set window.sections directly
if (!Object.keys(sections).length && window.sections) {
  Object.assign(sections, window.sections);
}

if (!Object.keys(sections).length) throw new Error("No game data found in sections-container.");

window.ugsLoaded = true;
renderUGS(sections);
```

} catch (err) {
console.error(“UGS load error:”, err);
$(”#ugs-container”).html(` <div class="ugs-status"> Failed to load UGS games.<br> <a href="https://docs.google.com/document/d/1_FmH3BlSBQI7FGgAQL59-ZPe8eCxs35wel6JUyVaG8Q/" target="_blank" style="color:rgba(255,255,255,0.6);">Open the Google Doc directly ↗</a> </div>`);
}
}

function renderUGS(sections) {
const container = $(”#ugs-container”);
container.empty();

// Page header
container.append(`<div class="ugs-page-header"> <h1>Ultimate Game Stash</h1> <p> Source: <a href="https://docs.google.com/document/d/1_FmH3BlSBQI7FGgAQL59-ZPe8eCxs35wel6JUyVaG8Q/" target="_blank">UGS Google Doc</a> &nbsp;·&nbsp; Discord: <a href="https://discord.gg/rmVsAqkpkA" target="_blank">discord.gg/rmVsAqkpkA</a> </p> </div>`);

const letters = Object.keys(sections).sort();
window.ugsData = [];

for (const letter of letters) {
const games = sections[letter];
if (!games || games.length === 0) continue;

```
const section = $(`<div class="ugs-section" data-letter="${letter}"></div>`);
section.append(`<div class="ugs-letter-header">${letter}</div>`);

const list = $(`<div class="ugs-list"></div>`);
for (const game of games) {
  const cleanName = stripCL(game.name);
  window.ugsData.push({ letter, name: cleanName, url: game.url });

  const item = $(`
    <div class="ugs-item liquid-glass" data-name="${cleanName.toLowerCase()}" data-url="${game.url}">
      <span class="ugs-game-name">${cleanName}</span>
      <span class="ugs-open-icon">↗</span>
    </div>
  `);
  item.on("click", function () {
    const url = $(this).data("url");
    if (url && url !== "#") window.open(url, "_blank");
  });
  list.append(item);
}
section.append(list);
container.append(section);
```

}

if (User.getData(“settings”).liquidGlass) showGlass();
}

// ── Unified search (handles both tabs) ───────────────
// Override the original search() with a tab-aware version
const _origSearch = search;
window.search = function () {
if (activeTab === “main”) {
_origSearch();
} else {
searchUGS();
}
};

function searchUGS() {
const query = $(”#search-input”).val().trim().toLowerCase();
$(”.ugs-section”).each(function () {
let anyVisible = false;
$(this).find(”.ugs-item”).each(function () {
const name = $(this).data(“name”) || “”;
const matches = !query || name.includes(query) ||
levenshteinDistance(query, name.substring(0, query.length)) <= 1;
if (matches) {
$(this).removeClass(“ugs-hidden”);
anyVisible = true;
} else {
$(this).addClass(“ugs-hidden”);
}
});
if (anyVisible) $(this).removeClass(“ugs-section-hidden”);
else $(this).addClass(“ugs-section-hidden”);
});
}

function levenshteinDistance(a, b) {
const m = a.length, n = b.length;
const dp = Array.from({ length: m + 1 }, (*, i) =>
Array.from({ length: n + 1 }, (*, j) => (i === 0 ? j : j === 0 ? i : 0))
);
for (let i = 1; i <= m; i++)
for (let j = 1; j <= n; j++)
dp[i][j] = a[i-1] === b[j-1]
? dp[i-1][j-1]
: 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
return dp[m][n];
}

// Wire search input to the unified handler
$(document).ready(function () {
$(”#search-input”).on(“input”, function () {
if (activeTab === “ugs”) searchUGS();
});
});