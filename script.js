/** MOBILE NAV **/
const navToggle = document.getElementById("nav-toggle");
const nav = document.getElementById("main-nav");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", !expanded);
    nav.setAttribute("aria-hidden", expanded);
  });
}

/** YEAR **/
document.getElementById("year").textContent = new Date().getFullYear();

/** LIGHTBOX **/
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

/** CART SYSTEM **/
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  document.getElementById("cart-count").textContent = cart.length;
}

// ADD TO CART BUTTONS
document.querySelectorAll(".add-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const product = btn.dataset.product;

    const cart = getCart();
    cart.push({
      name: product,
      price: 1
    });

    saveCart(cart);

    alert(`${product} added to cart`);
  });
});

// CART ICON CLICK → CHECKOUT PAGE
document.getElementById("cart-icon").addEventListener("click", () => {
  window.location.href = "checkout.html";
});

// INITIAL COUNTER
updateCartCount();
