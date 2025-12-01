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
  { text: "apps", href: "/apps", icon: "/assets/images/icons/package.svg"}
];

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
  for (const i of navbarItems) {
    const e = navbarItem(i);
    nav.appendChild(e);
  }
  return nav;
}

function injectNavbar() {
  const element = navbar();
  document.body.appendChild(element);
  return element;
}