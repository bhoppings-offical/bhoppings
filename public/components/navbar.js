const navbar = document.createElement("navbar");

const navbarItems = [
  { text: "bio", href: "/" },
  {
    text: "downloads",
    items: [
      { text: "quill", href: "/quill" },
      { text: "tangox", href: "/downloads/tangox" },
      { text: "tango clicker", href: "/downloads/tangoclicker" }
    ]
  }
];

function navbarItem(item) {
  const e = document.createElement("div");
  e.innerText = item.text
}