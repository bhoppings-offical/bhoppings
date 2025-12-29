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
}