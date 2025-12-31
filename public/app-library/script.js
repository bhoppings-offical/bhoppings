function appCard(app) {
  const card = $("<div></div>").addClass("app-card").data("href", (app.fromRoot ? "" : "/apps/") + app.url);
  const favorite = $("<div></div").addClass("app-favorite");
  if (app.favorited) {
    favorite.addClass("favorited");
  }
}