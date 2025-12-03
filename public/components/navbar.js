const navbarItems = [
  { text: "bio", href: "/" },
  {
    text: "software",
    items: [
      { text: "quill", href: "/quill" },
      { text: "tangox", href: "/downloads/tangox" },
      { text: "tango clicker", href: "/downloads/tangoclicker" }
    ]
  },
  { text: "assets", items: [
    { text: "lume", href: "/lume" },
    { text: "orik", href: "/orik" }
  ]},
  { text: "nexa", href: "/nexa" },
  { text: "Apps", href: "/apps", /*icon: "/assets/images/icons/package.svg"*/}
];

var navbarGlowShimmer;

function navbarItem(item) {
  const e = document.createElement("div");
  e.innerText = item.text;
  e.classList.add("navbar-item");
  e.setAttribute("tabindex", 0)
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
  const logo = document.createElement("div");
  logo.setAttribute("id", "navbar-logo");
  logo.innerText = "bhop";
  nav.appendChild(logo);
  logo.addEventListener("click", (e) => {
    window.open("/home", "_self");
  });
  for (const i of navbarItems) {
    const e = navbarItem(i);
    nav.appendChild(e);
  }
  const glow = document.createElement("div");
  glow.id = "navbar-glow";
  glow.innerHTML = `<div id="navbar-glow-shimmer"></div>`
  const glowCover = document.createElement("div");
  glowCover.id = "navbar-shimmer-cover";
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
    navbarElement.addEventListener("click", (e) => {
        if (
            e.target.matches("#navbar .navbar-item") &&
            !e.target.querySelector(".navbar-dropdown")
        ) {
            const href = e.target.getAttribute("data-href");
            window.open(href, "_blank");
        };
    })
    navbarGlowShimmer = document.getElementById("navbar-glow-shimmer");
updateNavbarGlowSize();
});



function updateNavbarGlowSize() {
  const transform = getComputedStyle(navbarGlowShimmer).transform;
  let angleDeg;

  if (transform === "none") {
    angleDeg = 0;
  } else {
    const vals = transform.match(/matrix\((.+)\)/)[1].split(", ");
    const a = parseFloat(vals[0]);
    const b = parseFloat(vals[1]);
    angleDeg = Math.atan2(b, a) * (180 / Math.PI);
  }

  const angleRad = (angleDeg * Math.PI) / 180;

  const width = Math.abs(Math.cos(angleRad));

  navbarGlowShimmer.style.setProperty("--scale-x", width);

  requestAnimationFrame(updateNavbarGlowSize);
}
