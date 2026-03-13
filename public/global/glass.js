/*window.glassSvg = `<svg id="liquid-glass-svg" color-interpolation-filters="sRGB" style="position: absolute; left: 0px; top: 0px;">
  <defs>
      <filter id="liquid-glass-filter" filterUnits="objectBoundingBox">
          
          <!-- Use SourceGraphic directly for displacement -->
          <feImage href="/assets/displacement-map-z1p3yi.png" x="0" y="0" width="1" height="2" result="displacement_map"></feImage>
          <feDisplacementMap in="SourceGraphic" in2="displacement_map"
              scale="50" xChannelSelector="R" yChannelSelector="G"
              result="displaced_TL"></feDisplacementMap>

          <feImage href="/assets/displacement-map-z1p3yi.png" x="0" y="0" width="1" height="2" result="displacement_map_BR"></feImage>
          <feDisplacementMap in="SourceGraphic" in2="displacement_map_BR"
              scale="-50" xChannelSelector="G" yChannelSelector="R"
              result="displaced_BR"></feDisplacementMap>

          <feBlend in="displaced_TL" in2="displaced_BR"
              mode="screen" result="displaced"></feBlend>

          <feColorMatrix in="displaced" type="saturate"
              values="10" result="displaced_saturated"></feColorMatrix>

          <feImage href="/assets/specular-map-z1p3yi.png"
              x="0" y="0" width="1" height="1"
              result="specular_layer"></feImage>

          <feComposite in="displaced_saturated" in2="specular_layer"
              operator="in" result="specular_saturated"></feComposite>

          <feComponentTransfer in="specular_layer"
              result="specular_faded">
              <feFuncA type="linear" slope="0.5"></feFuncA>
          </feComponentTransfer>

          <feBlend in="specular_saturated" in2="displaced"
              mode="normal" result="withSaturation"></feBlend>

          <feBlend in="specular_faded" in2="withSaturation"
              mode="normal" result="preBlur"></feBlend>

          <!-- Blur applied AFTER displacement + blending -->
          <feGaussianBlur in="preBlur"
              stdDeviation="2"></feGaussianBlur>

      </filter>
  </defs>
</svg>
`;

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
        link.id = "glass-css";
        link.href = "/global/glass.css";
        link.rel = "stylesheet";
        document.head.append(link);
    }
}

function ensureGlassStyles() {
    return new Promise((resolve) => {
        let link = document.querySelector('link[href="/global/glass.css"]');
        if (!link) {
            applyGlass();
            link = document.querySelector('link[href="/global/glass.css"]');
        }
        if (!link) return resolve();

        link.disabled = false;
        if (link.sheet) return resolve();

        const onLoad = () => {
            link.removeEventListener("load", onLoad);
            resolve();
        };
        link.addEventListener("load", onLoad);
        // Fallback in case load doesn't fire (cached or blocked)
        setTimeout(resolve, 150);
    });
}

document.addEventListener("DOMContentLoaded", function(e) {
    const $glassSvg = $(glassSvg);
    $("body").prepend($glassSvg);
    const settings = JSON.parse(window.localStorage.getItem("settings"));
    if (settings.liquidGlass) {
        window.liquidGlassEnabled = true;
        applyGlass();
        //requestAnimationFrame(() => checkGlassBounding(true));
    } else {
        window.liquidGlassEnabled = false;
    }
})
*/
function showGlass() {
    LiquidGlass.mapElements();
}
function hideGlass() {
    const glass = document.querySelectorAll("liquid-glass");
    for (let i = 0; i < glass.length; i ++) {
        const elem = glass[i];
        elem.style.setProperty("backdrop-filter", "auto");
    }
}
/*
function checkGlassBounding(loop = false) {
    if (window.liquidGlassEnabled === false) return;
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
            glassMaterial.classList.add("hidden");
        } else {
            glassMaterial.classList.remove("hidden");
        }
    }
    if (loop) requestAnimationFrame(() => checkGlassBounding(true));
}
*/