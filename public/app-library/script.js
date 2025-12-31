function appCard(app) {
  const card = $("<div></div>").addClass("app-card").data("href", ((app.fromRoot ? "" : "/apps/") + app.url).replace(/\/\//, "/"));
  const favorite = $("<div></div").addClass("app-favorite");
  if (app.favorited) {
    favorite.addClass("favorited");
  }
  const icon = $("<div></div>").addClass("app-icon");
  const iconImg = $("<img />").prop("src", "/assets/images/app-icons/" + app.image);
  const button = $("<div></div>").text(app.name).addClass("app-button").click(function(e) {
    window.open($(this).parent().data("href"), "_blank");
  })
  card.append(favorite, icon.append(iconImg), icon, button);
  return card;
}

function renderApps() {
  const container = $("#apps-container");
  container.empty();
  for (const app of window.apps) {
    const card = appCard(app);
    container.append(card);
  }
}

$(document).ready(async function(e) {
  window.apps = await fetch("/config/app-library.json").then(r => r.json());
  renderApps();
})