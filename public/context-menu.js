"use strict";

class ContextMenu {
  constructor() {
    this.menu = document.createElement('div');
    this.menu.setAttribute("id", "context-menu");
    this.styleElem = document.createElement('style');
    this.styleElem.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap');
      #context-menu {
        font-size: 1rem;
        position: fixed;
        left: 0;
        top: 0;
        display: none;
        gap: 0.25em;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(0.5em);
        padding: 0.5em;
        border: solid 1px rgba(180, 180, 180, 0.2);
        border-radius: 0.5em;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        color: white;
        flex-direction: column;
        font-family: -apple-system, "Instrument Sans", "Arial", sans-serif;
        z-index: 99999;
      }
      #context-menu > div > img {
          height: 0.7em;
          margin-right: 1em;
          transform: scale(1.5);
          transition: all 0.2s ease-in-out;
      }

      #context-menu > div:hover > img {
        filter: brightness(-100%);
      }

      #context-menu > div.context-spacer {
          background-color: rgba(255, 255, 255, 0.2) !important;
          cursor: default;
          padding: 0px;
          height: 1px;
          width: 90%;
          margin-left: 5%;
      }
      #context-menu > div {
        padding: 5px;
        cursor: pointer;
        padding: 0.5em;
        border-radius: 0.25em;
          transition: all 0.2s ease-in-out;
      }
      #context-menu > div:hover {
        background-color: #fff;
        color: #000;
      }
    `;
    document.head.appendChild(this.styleElem); // Add styles to <head>

    this.registries = [];
  }

  addRegistry(object) {
    let html = "";
    try {
      html = `<img src="${object.img || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/ovOOsQAAAAASUVORK5CYII='}" />${object.text}`;
      const callback = object.callback;
      const filter = object.filter || "*";
      this.registries.push({
        html,
        callback,
        filter
      });
    } catch (error) {
      console.error("Error adding Registry: ", error)
    }
  }
  addSpacer(filter) {
    this.registries.push({
      isSpacer: true,
      filter: filter,
    });
  }

  appendToDom() {
    document.body.appendChild(this.menu); // Only append if it's not already in the DOM
  }

  populateMenu(targetElement) {
    this.menu.innerHTML = ''; // Clear any existing content in the menu
    for (let i = 0; i < this.registries.length; i++) {
      const item = this.registries[i];
      if (item.filter && ![...document.querySelectorAll(item.filter)].includes(targetElement)) {
        continue; // Skip this item if it doesn't match the filter
      }

      if (item.isSpacer) {
        const spacer = document.createElement('div');
        spacer.classList.add('context-spacer');
        this.menu.appendChild(spacer);
        continue;
      }

      const menuItem = document.createElement('div');
      menuItem.innerHTML = item.html;
      menuItem.addEventListener('click', () => {
        item.callback(targetElement); // Trigger the callback for the clicked item, passing the target element
        this.menu.style.display = 'none'; // Hide the menu after an option is selected
      });
      this.menu.appendChild(menuItem);
    }
  }

  setup() {
    this.appendToDom();

    document.addEventListener('contextmenu', (function(e) {
      if (e.shiftKey) {
        this.menu.style.display = "none";
        return;
      }
      e.preventDefault();
      this.menu.style.display = "flex";
      this.menu.style.left = e.clientX + "px";
      this.menu.style.top = e.clientY + "px";
      if (this.menu.contains(e.target)) {
        this.menu.style.display = "none";
        return;
      }
      this.populateMenu(e.target);
    }).bind(this));

    document.addEventListener('click', () => {
      this.menu.style.display = 'none';
    });
  }

  copyToClipboard(content) {
    if (typeof content === 'string') {
      navigator.clipboard.writeText(content)
        .then(() => {
          console.log('Text copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    } else if (content instanceof HTMLInputElement || content instanceof HTMLTextAreaElement || content.nodeType === Node.TEXT_NODE) {
      navigator.clipboard.writeText(content.value || content.textContent)
        .then(() => {
          console.log('Text copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    } else if (content instanceof HTMLImageElement) {
      fetch(content.src)
        .then(response => response.blob())
        .then(blob => {
          const clipboardItem = new ClipboardItem({
            'image/png': blob
          });
          navigator.clipboard.write([clipboardItem])
            .then(() => {
              console.log('Image copied to clipboard!');
            })
            .catch(err => {
              console.error('Failed to copy image: ', err);
            });
        })
        .catch(err => {
          console.error('Failed to fetch image: ', err);
        });
    } else {
      console.error('Unsupported content type');
    }
  }
  downloadImage(imageElement) {
    if (imageElement.tagName !== 'IMG') {
      console.error('The provided element is not an image');
      return;
    }

    const imageUrl = imageElement.src;
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1] || 'image';

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  }
  searchInGoogle(phrase) {
    const query = encodeURIComponent(phrase);
    const url = `https://www.google.com/search?q=${query}`;
    window.open(url, '_blank');
  }
  addRegistries(registries) {
    for (let registry of registries) {
      if (registry.isSpacer) {
        this.addSpacer(registry.filter || "*");
      } else {
        this.addRegistry(registry);
      }
    }
    console.log("successfully added registries!")
  }
}

const contextMenu = new ContextMenu();


const registries = [
  {
    text: 'Copy Image',
    img: '/images/context-menu/copy.svg',
    callback: (targetElement) => {
      contextMenu.copyToClipboard(targetElement);
    },
    filter: "img"
  },
  {
    text: 'Copy Image URL',
    img: '/images/context-menu/link.svg',
    callback: (targetElement) => {
      contextMenu.copyToClipboard(targetElement.src);
    },
    filter: "img"
  },
  {
    text: 'Save Image',
    img: '/images/context-menu/download.svg',
    callback: (targetElement) => {
      contextMenu.downloadImage(targetElement);
    },
    filter: "img"
  },
  {
    text: 'Copy Text',
    img: '/images/context-menu/copy.svg',
    callback: (targetElement) => {
      contextMenu.copyToClipboard(targetElement.textContent);
    },
    filter: ":not(img)"
  },
  {
    text: 'Search with Google',
    img: '/images/context-menu/search.svg',
    callback: (targetElement) => {
      contextMenu.searchInGoogle(targetElement.innerText);
    },
    filter: ":not(img)"
  },
  {
    isSpacer: true
  },
  {
    text: 'Copy HTML',
    img: '/images/context-menu/code.svg',
    callback: (targetElement) => {
      contextMenu.copyToClipboard(targetElement.outerHTML);
    }
  }
];

contextMenu.addRegistries(registries);


contextMenu.setup();
