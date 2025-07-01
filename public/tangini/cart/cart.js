"use strict";

const storeItems = {
  stare: {
    id: "stare",
    name: "Tango Stare",
    description: "He's staring at you.",
    price: 49.99,
    image: "stare.png",
  },
  diamond: {
    id: "diamond",
    name: "Tango Diamond",
    description: "Tango, but a diamond.",
    price: 1999.99,
    image: "diamond.png",
  },
  silly_lick: {
    id: "silly_lick",
    name: "Tango Silly Lick",
    description: "Get a lick from Tango himself.",
    price: 149.99,
    image: "silly_lick.png",
  },
  stare_2: {
    id: "stare_2",
    name: "Tango Stare 2",
    description: "He's staring at you more.",
    price: 74.99,
    image: "stare_2.png",
  },
  kitty_cup: {
    id: "kitty_cup",
    name: "Kitty Cup Tango",
    description: "Hehe! hes licking the cup.",
    price: 6.99,
    image: "kitty_cup.png",
  },
  evil: {
    id: "evil",
    name: "Evil Tango",
    description: "Tango's dark side.",
    price: 2499.99,
    image: "evil.png",
  },
  cutie_patootie: {
    id: "cutie_patootie",
    name: "Cutie Patootie Tango",
    description: "Don't you just want to rape him?",
    price: 69.99,
    image: "cutie_patootie.png",
  },
  evil_2: {
    id: "evil_2",
    name: "More Evil Tango",
    description: "Tango has a darker side???",
    price: 4999.99,
    image: "evil_2.png",
  },
  burrito: {
    id: "burrito",
    name: "Burrito Tango",
    description: "Trying to be a stupid beaner so bad.",
    price: 34.99,
    image: "burrito.png",
  },
  crazy: {
    id: "crazy",
    name: "Crazy Tango",
    description: "He's crazy! (maybe a little autistic)",
    price: 99.99,
    image: "crazy.png",
  },
  super_silly_lick: {
    id: "super_silly_lick",
    name: "Super Silly Lick",
    description: "This one's even better than the last!",
    price: 750,
    image: "super_silly_lick.png",
  },
  king: {
    id: "king",
    name: "King Tango",
    description: "He's royalty, but not as good as the Kitty Kingdom Ruler.",
    price: 10000,
    image: "king.png",
  },
  sexy: {
    id: "sexy",
    name: "Sexy Tango",
    description: "Ooh, so sexy Tango.",
    price: 79.99,
    image: "sexy.png",
  },
  sideways: {
    id: "sideways",
    name: "Sideways Tango",
    description: "A little sideways fellow.",
    price: 99.99,
    image: "sideways.png",
  },
  asian: {
    id: "asian",
    name: "Asian Tango",
    description: "haha! get it? cause like small eyes?",
    price: 49.99,
    image: "asian.png",
  },
  stoop: {
    id: "stoop",
    name: "Stoop Tango",
    description: "He's kind of retarded.",
    price: 0,
    image: "stoop.png",
  },
};

function itemHTML({ id, name, description, price, image }) {
  const itemHTML = `<div class="cart-item" data-id="${id}">
<img class="cart-item-img" src="/images/tangini/item/${image}" />
<div class="cart-item-text">
  <div class="cart-item-name">${name}</div>
  <div class="cart-item-description">
    ${description}
  </div>
</div>
<div class="cart-item-counter">
  <div class="cart-item-counter-text">${Account.getValue(`cart.${id}`) || "N"}</div>
  <img
    class="cart-item-arrows"
    src="/images/tangini/cart-item-arrows.svg"
  />
</div>
<div class="cart-item-right">
  <div class="cart-item-price">$${price.toFixed(2) || "N"}</div>
  <div class="cart-item-delete"></div>
</div>
</div>`;
  return itemHTML;
}

function displayCartItems() {
  $(".cart").empty();
  let total = 0;
  const itemCount = Object.values(Account.getValue("cart")).reduce((acc, val) => acc + val, 0);
  $(".item-count-text").text(`You have ${itemCount} items in your cart.`);
  for (const item of Object.values(storeItems)) {
    const count = Account.getValue(`cart.${item.id}`)
    if (typeof count !== "number" || Number.isNaN(count) || count < 1) {
      continue;
    }
    total += count * item.price;
    const html = itemHTML(item);
    const itemElement = $(html);
    $(".cart").append(itemElement);
  }
  total = total.toFixed(2);
  $(".checkout-button-price").text(`$${total}`);
}

function deleteCartItem(id) {
  Account.setValue(`cart.${id}`, 0);
  displayCartItems();
}

function totalCartPrice() {
  let total = 0;
  for (const item of Object.values(storeItems)) {
    const count = Account.getValue(`cart.${item.id}`)
    if (typeof count !== "number" || Number.isNaN(count) || count < 1) {
      continue;
    }
    total += count * item.price;
  }
}

$(document).ready(function() {
  displayCartItems();
  $(".back-button").on("click", function() {
    window.location.href = "../";
  });
  $(".cart").on("click", ".cart-item-delete", function() {
    const id = $(this).closest(".cart-item").data("id");
    deleteCartItem(id);
  });
  $(".cart").on("click", ".cart-item-arrows", function(e) {
    const numberElem = $(this).closest(".cart-item-counter").find(".cart-item-counter-text")
    const id = $(this).closest(".cart-item").data("id");
    const count = Account.getValue(`cart.${id}`);

    const rect = this.getBoundingClientRect();
    const half = rect.height / 2;
    let addCoeff = 0;
    if (e.clientY >= rect.top && e.clientY < rect.top + half) {
      Account.setValue(`cart.${id}`, count + 1);
      addCoeff = -1;
      numberElem.text(count + 1);
    } else {
      Account.setValue(`cart.${id}`, count - 1);
      addCoeff = 1;
      numberElem.text(count - 1);
      if (count <= 1) {
        deleteCartItem(id);
      }
    }
    let currentPrice = parseFloat($(".checkout-button-price").text().replace('$', ''));
    let newPrice = currentPrice - storeItems[id].price * addCoeff;
    $(".checkout-button-price").text(`$${newPrice.toFixed(2)}`);
  });
  const cardNumberInput = document.getElementById("card-number");
  const cvcInput = document.getElementById("cvc");
  const nameInput = document.getElementById("name");

  nameInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/(?<=^| )\w/g, c => c.toUpperCase());
    e.target.value = value;
  })

  cvcInput.addEventListener("input", () => {
    let value = cvcInput.value.replace(/\D/g, ""); // strip non-digits
    if (value.length > 3) value = value.slice(0, 3); // limit to 3 digits
    cvcInput.value = value;
  });

  cardNumberInput.addEventListener("input", () => {
    let value = cardNumberInput.value.replace(/\D/g, ""); // strip non-digits
    if (value.length > 16) value = value.slice(0, 16); // limit to 16 digits
    cardNumberInput.value = value.replace(/(.{4})/g, "$1 ").trim(); // format with spaces
  });

  cardNumberInput.addEventListener("keydown", (e) => {
    const { selectionStart } = cardNumberInput;
    if (e.key === "Backspace" && selectionStart > 0) {
      if (cardNumberInput.value[selectionStart - 1] === " ") {
        e.preventDefault();
        cardNumberInput.setSelectionRange(selectionStart - 1, selectionStart - 1);
      }
    }
  });
  $(".expiration").on("input", function() {
    this.value = this.value.replace(/\D/g, "");
    if (this.value.length > 2) {
      this.value = this.value.slice(0, 2);
    }
    if (this.id === "expiration-month") {
      if (this.value > 12) {
        this.value = 12;
      }
      if (this.value.toString().length === 1 && this.value > 1) {
        this.value = "0" + this.value;
      }
    }
  });
})