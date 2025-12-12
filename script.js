// Mobile nav toggle
const navToggle = document.getElementById("nav-toggle");
const nav = document.getElementById("main-nav");
if (navToggle) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", !expanded);
    nav.setAttribute("aria-hidden", expanded);
  });
}

// Dynamic year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Lightbox click-to-zoom
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

document.querySelectorAll(".card img").forEach(img => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightbox.style.display = "flex";
  });
});
lightbox.addEventListener("click", () => lightbox.style.display = "none");

// -------------------- CART & Analytics --------------------
const CART_KEY = 'lemfactory_cart_v1';
const cartCountEl = document.getElementById('cart-count');

// Load cart from localStorage
function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}
function updateCartCounter() {
  const items = loadCart();
  const count = items.length;
  if (cartCountEl) cartCountEl.textContent = count;
}
updateCartCounter();

// Add to cart behavior + analytics events
document.querySelectorAll('.add-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.product || 'Product';
    const price = parseFloat(btn.dataset.price || '1.00');

    // Add to local cart
    const cart = loadCart();
    cart.push({ name, price, addedAt: new Date().toISOString() });
    saveCart(cart);
    updateCartCounter();

    // GA4 event
    if (typeof gtag === 'function') {
      gtag('event', 'add_to_cart', {
        currency: 'USD',
        value: price,
        items: [{ item_name: name }]
      });
    }

    // FB Pixel event
    if (typeof fbq === 'function') {
      fbq('track', 'AddToCart', {
        content_name: name,
        value: price,
        currency: 'USD'
      });
    }

    // Simple visual feedback
    btn.textContent = 'Added ✓';
    setTimeout(() => btn.textContent = `Add to Cart — $${price.toFixed(2)}`, 1200);
  });
});

// Cart icon -> go to checkout page
const cartIcon = document.getElementById('cart-icon');
if (cartIcon) cartIcon.addEventListener('click', () => {
  window.location.href = 'checkout.html';
});
