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

var cart;
if (Account.getValue("cart") === undefined) {
  cart = Object.keys(storeItems).reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {});
  Account.setValue("cart", cart);
} else {
  cartContents = Account.getValue("cart");
}

function addToCart(itemId) {
  if (cartContents[itemId] === undefined) {
    cartContents[itemId] = 0;
  }
  cartContents[itemId]++;
  Account.setValue(`cart.${itemId}`, cartContents[itemId]);
}

const itemsContainer = $(".items");
const searchInput = $("#search-input");
const sortInput = $(".sort-by");
var sortingReversed = false;

function displayItems({
  items,
  filter = "",
  sortBy = "featured",
  reversed = false,
}) {
  itemsContainer.empty();

  let itemStore = Object.values(items);
  itemStore = itemStore.sort((a, b) => {
    let itemA = a;
    let itemB = b;
    if (reversed) {
      [itemA, itemB] = [itemB, itemA];
    }

    if (sortBy === "alphabetical") {
      return itemA.name.localeCompare(itemB.name);
    } else if (sortBy === "price") {
      return itemA.price - itemB.price;
    } else {
      return reversed ? -1 : 1;
    }
  });
  for (item of itemStore) {
    if (!item.name.toLowerCase().includes(filter)) continue;
    const price = item.price
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const itemElement = `
      <div class="item">
        <img class="image" src="/images/tangini/item/${item.image}" />
        <div class="item-text">
          <div class="item-title">${item.name}</div>
          <div class="item-description">${item.description}</div>
          <div class="item-price">$${price}</div>
        </div>
        <div class="add-to-cart" data-id="${item.id}">
          <div class="text">Add to cart</div>
        </div>
      </div>
    `;
    itemsContainer.append(itemElement);
  }
  if (itemsContainer.children().length === 0) {
    itemsContainer.append("<span>Sorry, no items were found.</span>");
  }
}

$(document).ready(function() {
  for (let item of Object.values(storeItems)) {
    const img = new Image();
    img.src = `/images/tangini/item/${item.image}`;
  }
  displayItems({ items: storeItems });
  searchInput.on("input", function() {
    const filter = searchInput.val().toLowerCase();
    displayItems({
      items: storeItems,
      sortBy: sortInput.val(),
      reversed: sortingReversed,
      filter: filter,
    });
  });
  sortInput.on("change", function() {
    displayItems({
      items: storeItems,
      sortBy: sortInput.val(),
      reversed: sortingReversed,
    });
  });
  $("#sort-by-arrow").on("click", function() {
    sortingReversed = !sortingReversed;
    $(this).toggleClass("reversed");
    displayItems({
      items: storeItems,
      sortBy: sortInput.val(),
      reversed: sortingReversed,
    });
  });

  $(".view-toggle").on("click", function() {
    itemsContainer.toggleClass("list");
    $(".view-option").toggleClass("active");
  });
  $(".items").on("click", ".item .add-to-cart", function(e) {
    const itemId = $(this).data("id");
    const item = storeItems[itemId];
    console.log(`Added "${item.name}" to cart`);
    $(this).find(".text").text("Added!");
    setTimeout(
      function() {
        $(this).find(".text").text("Add to cart");
      }.bind(this),
      1000,
    );
    addToCart(itemId);
  });
  $("#cart-button").on("click", function() {
    window.location.href = "./cart";
  });
});