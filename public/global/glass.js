function applyGlass() {
    const elements = document.getElementsByClassName("liquid-glass");
    const glassMaterial = document.createElement("div");
    glassMaterial.innerHTML = `<div class="liquidGlassMaterial">
    <div class="liquidGlassEdgeReflection"></div>
    <div class="liquidGlassEmbossReflection"></div>
    <div class="liquidGlassRefraction"></div>
    <div class="liquidGlassBlur"></div>
    <div class="BlendLayers"></div>
    <div class="BlendEdge"></div>
    <div class="Highlight"></div>
  </div>`;
  const matElement = glassMaterial.firstChild;
    for (element of elements) {
        if (!element.getElementsByClassName("liquidGlassMaterial")[0]) {
            element.appendChild(matElement.cloneNode(true));
        }
    }
    if (!document.documentElement.innerHTML.includes("global/glass.css")) {
        const link = document.createElement("link");
        link.href = "/global/glass.css";
        link.rel = "stylesheet";
        document.head.append(link);
    }
}

document.addEventListener("DOMContentLoaded", function(e) {
    const settings = JSON.parse(window.localStorage.getItem("settings"));
    if (settings.liquidGlass) {
        applyGlass();
        requestAnimationFrame(() => checkGlassBounding(true));
    }
})

function showGlass() {
        $(".liquid-glass .liquidGlassMaterial").show();
        $('link[href="/global/glass.css"]').prop('disabled', false);
}
function hideGlass() {
        $(".liquid-glass .liquidGlassMaterial").hide();
        $('link[href="/global/glass.css"]').prop('disabled', true);
}

function checkGlassBounding(loop = false) {
    const glass = document.getElementsByClassName("liquid-glass");
    for (let i = 0; i < glass.length; i++) {
        const elem = glass[i];
        const rect = elem.getBoundingClientRect();
        const glassMaterial = elem.getElementsByClassName("liquidGlassMaterial")[0];
        if (!glassMaterial) continue;

        const leniencyX = rect.width;   // horizontal leniency
        const leniencyY = rect.height;  // vertical leniency

        if (rect.left > window.innerWidth + leniencyX ||
            rect.top > window.innerHeight + leniencyY ||
            rect.right < -leniencyX ||
            rect.bottom < -leniencyY) {
            glassMaterial.style.setProperty("display", "none", "important");
        } else {
            glassMaterial.style.display = "block";
        }
    }
    if (loop) requestAnimationFrame(() => checkGlassBounding(true));
}