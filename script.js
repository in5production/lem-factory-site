// MOBILE NAV
const navToggle = document.getElementById("nav-toggle");
const nav = document.getElementById("main-nav");

navToggle?.addEventListener("click", () => {
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", !expanded);
  nav.setAttribute("aria-hidden", expanded);
});

// YEAR
document.getElementById("year").textContent = new Date().getFullYear();

// LIGHTBOX
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

document.querySelectorAll(".card img").forEach(img => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightbox.style.display = "flex";
  });
});

lightbox.addEventListener("click", () => {
  lightbox.style.display = "none";
});

// CART DATA
function loadCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCounter();
}

function updateCartCounter() {
  const cart = loadCart();
  document.getElementById("cart-count").textContent = cart.length;
}

// ADD TO CART
document.querySelectorAll(".add-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const product = btn.getAttribute("data-product");
    const cart = loadCart();
    cart.push({ name: product, price: 1 });
    saveCart(cart);

    alert(`${product} added to cart.`);
  });
});

// CLICK CART ICON → CHECKOUT
document.getElementById("cart-icon").addEventListener("click", () => {
  window.location.href = "checkout.html";
});

// INITIAL COUNTER
updateCartCounter();
