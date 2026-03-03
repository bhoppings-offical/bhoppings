"use strict";
const navbarItems = [
  { text: "bio", href: "/" },
  {
    text: "software",
    items: [
      { text: "tangox", href: "/downloads/TangoX.exe" },
      { text: "tango clicker", href: "/downloads/TangoClicker.exe" }
    ]
  },
  { text: "lume", href: "/apps/lume" },
  { text: "vera", href: "/apps/vera" },
  { text: "apps", href: "/app-library" }
];

let navbarGlowShimmer;

function navbarItem(item) {
  const e = document.createElement("div");
  e.innerText = item.text;
  e.classList.add("navbar-item");
  e.setAttribute("tabindex", 0);
  if (!item.items) {
    e.setAttribute("data-href", item.href);
    if (item.icon) {
      const icon = document.createElement("img");
      icon.src = item.icon;
      e.prepend(icon);
    }
    return e;
  }
  const dropdown = document.createElement("div");
  dropdown.classList.add("navbar-dropdown");
  for (const i of item.items) {
    const el = navbarItem(i);
    dropdown.appendChild(el);
  }
  e.appendChild(dropdown);
  return e;
}

function navbar() {
  const nav = document.createElement("div");
  nav.setAttribute("id", "navbar");
  nav.classList.add("liquid-glass")
  const logo = document.createElement("div");
  logo.setAttribute("id", "navbar-logo");
  logo.innerText = "bhop";
  nav.appendChild(logo);
  logo.addEventListener("click", () => {
    window.open("/home", "_self");
  });
  for (const i of navbarItems) {
    const e = navbarItem(i);
    nav.appendChild(e);
  }
  const glow = document.createElement("div");
  glow.id = "navbar-glow";
  glow.innerHTML = `<div id="navbar-glow-shimmer"></div>`;
  const glowCover = document.createElement("div");
  glowCover.id = "navbar-shimmer-cover";
  const mobileClickOutArea = document.createElement("div");
  mobileClickOutArea.id = "navbar-clickout-area";
  //nav.appendChild(mobileClickOutArea);
  nav.appendChild(glow);
  glow.appendChild(glowCover);
  return nav;
}

function injectNavbar() {
  const element = navbar();
  document.body.appendChild(element);
  return element;
}

document.addEventListener("DOMContentLoaded", () => {
  const navbarElement = injectNavbar();
  navbarGlowShimmer = document.getElementById("navbar-glow-shimmer");

  navbarElement.querySelectorAll(".navbar-item[data-href]").forEach(item => {
    item.addEventListener("click", () => {
      const href = item.getAttribute("data-href");
      if (href) {
        window.open(href, "_self");
      }
    });
  });

  window.navbarWidth = navbarElement.offsetWidth;
  window.navbarHeight = navbarElement.offsetHeight;

  requestAnimationFrame(moveNavbarShimmer);

  document.addEventListener('click', (e) => {
  const dropdowns = document.querySelectorAll('.navbar-item:focus');
  dropdowns.forEach((item) => {
    if (!item.contains(e.target)) {
      item.blur(); // remove focus manually
    }
  });
});
if (JSON.parse(localStorage.getItem("settings")).legacyNavbar) {
    document.getElementById("navbar").classList.add("legacy");
  }

});



let t = 0;
const shimmerSpeed = 2;
let oldNow = 0;
function moveNavbarShimmer() {
  const frameTime = performance.now() - oldNow;
  oldNow = performance.now();
  const navbarPerimeter = 2 * (navbarWidth + navbarHeight);

  const dist = (t * shimmerSpeed) % navbarPerimeter;

  let x = 0, y = 0;

  if (dist <= navbarWidth) {
    x = dist;
    y = 0;
  } else if (dist <= navbarWidth + navbarHeight) {
    x = navbarWidth;
    y = dist - navbarWidth;
  } else if (dist <= navbarPerimeter - navbarHeight) {
    x = navbarWidth - (dist - navbarWidth - navbarHeight);
    y = navbarHeight;
  } else {
    x = 0;
    y = navbarPerimeter - dist;
  }

  navbarGlowShimmer.style.setProperty("--x", x + "px");
  navbarGlowShimmer.style.setProperty("--y", y + "px");

  t++;
  requestAnimationFrame(moveNavbarShimmer);
}

