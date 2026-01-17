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
    applyGlass();
})