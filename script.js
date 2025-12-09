// script.js - Final stable cart + UI handlers

// Use a single cart key for localStorage
const CART_KEY = 'lemfactory_cart_v2';

function domReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

domReady(() => {
  // MOBILE NAV toggle (keeps existing behavior)
  const navToggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", !expanded);
      nav.setAttribute("aria-hidden", expanded);
    });
  }

  // YEAR
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // LIGHTBOX (click image -> open)
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  document.querySelectorAll(".card img").forEach(img => {
    img.addEventListener("click", (e) => {
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = img.src;
      lightbox.style.display = "flex";
    });
  });
  if (lightbox) {
    lightbox.addEventListener("click", () => { lightbox.style.display = "none"; });
  }

  // CART helpers
  function loadCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('Failed parsing cart', e);
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCounter();
  }

  function updateCartCounter() {
    const counter = document.getElementById("cart-count");
    if (!counter) return;
    const cart = loadCart();
    // show total quantity (sum of qty)
    const totalQty = cart.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
    counter.textContent = totalQty;
  }

  // Adds product (merges if same name)
  function addToCart(productObj) {
    if (!productObj || !productObj.name) return;
    const cart = loadCart();
    const idx = cart.findIndex(i => i.sku && productObj.sku ? i.sku === productObj.sku : i.name === productObj.name);
    if (idx === -1) {
      cart.push({ sku: productObj.sku || productObj.name, name: productObj.name, price: Number(productObj.price || 1), qty: Number(productObj.qty || 1) });
    } else {
      cart[idx].qty = Number(cart[idx].qty || 0) + Number(productObj.qty || 1);
    }
    saveCart(cart);

    // Optional: send tracking events here (fbq/gtag) if configured
    try {
      if (typeof fbq === 'function') {
        fbq('track', 'AddToCart', { content_name: productObj.name, value: productObj.price || 1, currency: 'USD' });
      }
    } catch(e){}
    try {
      if (typeof gtag === 'function') {
        gtag('event', 'add_to_cart', { item_name: productObj.name, value: productObj.price || 1, currency: 'USD' });
      }
    } catch(e){}

    // small UI confirmation (non-blocking)
    showTempToast(`${productObj.name} added to cart`);
  }

  // Temporary toast in top-right for user feedback
  function showTempToast(text, ms = 1400) {
    let t = document.createElement('div');
    t.className = 'temp-toast';
    t.textContent = text;
    Object.assign(t.style, {
      position: 'fixed', top: '90px', right: '24px', background: '#111', color: '#fff', padding: '8px 12px',
      borderRadius: '8px', zIndex: 4000, opacity: 0, transition: 'opacity 0.18s'
    });
    document.body.appendChild(t);
    requestAnimationFrame(()=> t.style.opacity = 1);
    setTimeout(()=> {
      t.style.opacity = 0;
      setTimeout(()=> t.remove(), 220);
    }, ms);
  }

  // Attach Add-to-cart buttons
  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const name = btn.getAttribute('data-product') || btn.dataset.product || btn.textContent.trim();
      // price fixed to $1 as requested
      addToCart({ name, price: 1, sku: name.toLowerCase().replace(/\s+/g, '-') });
    });
  });

  // Cart icon click => go to checkout page
  const cartIcon = document.getElementById('cart-icon');
  if (cartIcon) {
    cartIcon.addEventListener('click', () => {
      window.location.href = 'checkout.html';
    });
  }

  // initialize counter
  updateCartCounter();
});
