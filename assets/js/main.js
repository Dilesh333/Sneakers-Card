/*----- MENU -----*/
const showMenu = (toggleId, navId) => {
  const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId);

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("show");
    });
  }
};
showMenu("nav-toggle", "nav-menu");

/*----- CAMBIO COLORS -----*/
const sizes = document.querySelectorAll(".size__tallas");
const colors = document.querySelectorAll(".sneaker__color");
const sneaker = document.querySelectorAll(".sneaker__img");

function changeSize() {
  sizes.forEach((size) => size.classList.remove("active"));
  this.classList.add("active");
}

function changeColor() {
  let primary = this.getAttribute("primary");
  let color = this.getAttribute("color");
  let sneakerColor = document.querySelector(`.sneaker__img[color="${color}"]`);

  colors.forEach((c) => c.classList.remove("active"));
  this.classList.add("active");

  document.documentElement.style.setProperty("--primary", primary);

  sneaker.forEach((s) => s.classList.remove("shows"));
  sneakerColor.classList.add("shows");
}

sizes.forEach((size) => size.addEventListener("click", changeSize));
colors.forEach((c) => c.addEventListener("click", changeColor));

/*----- QUANTITY FEATURES -----*/
const decreaseBtn = document.getElementById("decrease");
const increaseBtn = document.getElementById("increase");
const quantityValue = document.getElementById("quantity-value");

let quantity = 1;

increaseBtn.addEventListener("click", () => {
  quantity++;
  quantityValue.textContent = quantity;
});

decreaseBtn.addEventListener("click", () => {
  if (quantity > 1) {
    quantity--;
    quantityValue.textContent = quantity;
  }
});

/*----- CART BADGE -----*/
const cartCount = document.getElementById("cart-count");

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update cart icon badge
function updateCartBadge() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
}
updateCartBadge();

/*----- ADD TO CART FUNCTIONALITY -----*/
const addToCartBtn = document.getElementById("add-to-cart");

addToCartBtn.addEventListener("click", () => {
  // Get selected size
  const selectedSize = document.querySelector(".size__tallas.active");
  const size = selectedSize ? selectedSize.textContent.trim() : null;

  // Get selected color
  const selectedColorBtn = document.querySelector(".sneaker__color.active");
  const color = selectedColorBtn ? selectedColorBtn.getAttribute("color") : null;

  // Get quantity
  const quantity = parseInt(quantityValue.textContent);

  // Check if all fields are selected
  if (!size || !color) {
    alert("Please select both size and color before adding to cart.");
    return;
  }

  // Create cart item object
  const cartItem = {
    product: "Sneaker",
    size: size,
    color: color,
    quantity: quantity,
  };

  // Add to cart
  cart.push(cartItem);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();

  Toastify({
    text: `${cartItem.quantity}x Sneaker added to cart (Color: ${cartItem.color}, Size: ${cartItem.size})`,
    duration: 3000,
    gravity: "bottom",
    position: "right",
    backgroundColor: "#111",
    stopOnFocus: true,
  }).showToast();
});

/*----- CART POPUP FUNCTIONALITY -----*/
const cartPopup = document.getElementById("cart-popup");
const cartItemsContainer = document.getElementById("cart-items");
const closeCartBtn = document.getElementById("close-cart");
const cartIcon = document.querySelector(".nav__shop");

cartIcon.addEventListener("click", () => {
  renderCartItems();
  cartPopup.classList.add("open");
});

closeCartBtn.addEventListener("click", () => {
  cartPopup.classList.remove("open");
});

function renderCartItems() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cart.forEach((item, index) => {
    const itemEl = document.createElement("div");
    itemEl.classList.add("cart-item");
    itemEl.innerHTML = `
      <img src="assets/img/NikeAirMaxMotion2.png" class="cart-item-img">
      <div class="cart-item-details">
        <strong>${item.product}</strong><br>
        Size: ${item.size} <br>
        Color: ${item.color}
        <div class="cart-item-qty">
          <button onclick="updateItemQty(${index}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateItemQty(${index}, 1)">+</button>
          <span class="cart-item-remove" onclick="removeCartItem(${index})">✕</span>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(itemEl);
  });
}

window.updateItemQty = function (index, change) {
  cart[index].quantity += change;
  if (cart[index].quantity < 1) cart[index].quantity = 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
  renderCartItems();
};

window.removeCartItem = function (index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
  renderCartItems();
};
