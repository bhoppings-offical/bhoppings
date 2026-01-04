"use strict";

function appCard(app) {
  const card = $("<div></div>").addClass("app-card").data("href", ((app.fromRoot ? "" : "/apps/") + app.url).replace(/\/\//, "/"));
  const favorite = $("<div></div>").addClass("app-favorite").data("name", app.name);
  
  const favorites = JSON.parse(localStorage.getItem("app-favorites"));
  if (favorites.includes(app.name)) {
    favorite.addClass("favorited");
  }
  const icon = $("<div></div>").addClass("app-icon");
  const iconImg = $("<img />").prop("src", "/assets/images/app-icons/" + app.image);
  if (app.tags && app.tags.includes("broken")) {
    icon.css("filter", "grayscale(1) brightness(0.5)");
  }
  const button = $("<div></div>").html(app.name).addClass("app-button").click(function(e) {
    window.open($(this).parent().data("href"), "_blank");
  })
  card.append(favorite, icon.append(iconImg), icon, button);
  return card;
}

function renderApps() {
  const container = $("#apps-container");
  container.empty();
  const favorites = JSON.parse(window.localStorage.getItem("app-favorites"));
  
window.apps.sort((a, b) => {
  return (a.tags ? a.tags.includes("broken") : 0) - (b.tags ? b.tags.includes("broken") : 0)
})
window.apps.sort((a, b) => {
  const aFav = favorites.includes(a.name);
  const bFav = favorites.includes(b.name);

  return bFav - aFav;
});

  for (const app of window.apps) {
    const card = appCard(app);
    container.append(card);
  }
}

$(document).ready(async function(e) {
  window.apps = await fetch("/config/app-library.json").then(r => r.json());
  renderApps();
  $("#apps-container").on("click", function(e) {
    if ($(e.target).hasClass("app-favorite")) {
      favoriteApp($(e.target).data("name"));
    }
  })
  $("#apps-container").scrollTop(0);
  $("#search-input").on("keydown", function(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    search();
  }
});

})

function favoriteApp(name) {
  const favorites = JSON.parse(localStorage.getItem("app-favorites"));
  if (favorites.includes(name)) {
    favorites.splice(favorites.indexOf(name), 1);
  } else {
    favorites.push(name);
  }
  localStorage.setItem("app-favorites", JSON.stringify(favorites));
  $(".app-favorite").filter(function () {
  return $(this).data("name") === name;
}).toggleClass("favorited");
}

function search() {
  renderApps();
  const query = $("#search-input").val();
  const passing = fuzzySuggest(query, window.apps).map(o => o.name);

  $(".app-card").each(function () {
    const name = $(this).find(".app-favorite").data("name");

    if (passing.includes(name)) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
}



//stackoverflow and chatgpt search function nerd shit
function fuzzySuggest(query, items, maxDistance = 3) {
  const normalize = str =>
    String(str || "").toLowerCase().replace(/\s+/g, "");

  const levenshtein = (str1, str2) => {
    const matrix = Array(str1.length + 1)
      .fill()
      .map(() => Array(str2.length + 1).fill(0));

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
  };

  const searchInput = normalize(query);
  if (!searchInput) return items;

  return items.filter(obj => {
    const name = normalize(obj.name);

    return (
      name.includes(searchInput) ||
      levenshtein(searchInput, name) <= maxDistance
    );
  });
}
