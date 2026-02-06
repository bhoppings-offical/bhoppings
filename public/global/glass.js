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
    const settings = JSON.parse(window.localStorage.getItem("settings"));
    if (settings.liquidGlass) {
        window.liquidGlassEnabled = true;
        applyGlass();
        requestAnimationFrame(() => checkGlassBounding(true));
    } else {
        window.liquidGlassEnabled = false;
    }
})

function showGlass() {
    console.log("showing glass")
        window.liquidGlassEnabled = true;
        applyGlass();
        ensureGlassStyles().then(() => {
            $(".liquid-glass .liquidGlassMaterial").removeClass("hidden").each(function() {
                this.style.removeProperty("display");
            });
            requestAnimationFrame(() => checkGlassBounding());
        });
}
function hideGlass() {
    console.log("hidden glass")
        window.liquidGlassEnabled = false;
        $(".liquid-glass .liquidGlassMaterial").addClass("hidden");
        $('link[href="/global/glass.css"]').prop('disabled', true);
}

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
