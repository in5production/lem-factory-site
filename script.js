/* ---------------------------
   Basic UI: nav + year
   --------------------------- */
const navToggle = document.getElementById("nav-toggle");
const mainNav = document.getElementById("main-nav");
if (navToggle) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", !expanded);
    mainNav.setAttribute("aria-hidden", expanded);
  });
}
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------------------------
   Lightbox preview
   --------------------------- */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
document.querySelectorAll(".card img").forEach(img => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightbox.style.display = "flex";
  });
});
lightbox.addEventListener("click", () => lightbox.style.display = "none");

/* ---------------------------
   Country detection (IP-based)
   - uses ipapi.co (free)
   - stores visitorCountry
   --------------------------- */
let visitorCountry = "Unknown";
async function detectCountry() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) throw new Error('geo fail');
    const data = await res.json();
    visitorCountry = data.country_name || data.country || "Unknown";
  } catch (err) {
    console.warn('Country detection failed', err);
    visitorCountry = "Unknown";
  }
  document.getElementById('visitor-country')?.textContent = visitorCountry;
}
detectCountry();

/* ---------------------------
   CART: localStorage-backed
   - structure: { sku, title, price, qty }
   --------------------------- */
const CART_KEY = 'lemfactory_cart_v1';
let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCartCount();
  renderCartItems();
}

function findItemIndex(sku) {
  return cart.findIndex(i => i.sku === sku);
}

function addToCart({ sku, title, price }, qty = 1) {
  const idx = findItemIndex(sku);
  if (idx === -1) {
    cart.push({ sku, title, price: Number(price), qty });
  } else {
    cart[idx].qty += qty;
  }
  saveCart();
  // Track event (Meta + GA) with country
  fbq('track', 'AddToCart', { content_name: title, value: Number(price)*qty, currency: "BHD", country: visitorCountry });
  gtag('event', 'add_to_cart', { item_name: title, value: Number(price)*qty, currency: 'BHD', country: visitorCountry });
}

/* Attach add-to-cart buttons */
document.querySelectorAll('.add-cart').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    const sku = card.dataset.sku || `sku-${Date.now()}`;
    const price = card.dataset.price || card.getAttribute('data-price') || 0;
    const title = card.querySelector('h3')?.innerText || 'Product';
    addToCart({ sku, title, price }, 1);
  });
});

/* ---------------------------
   Cart UI: count & modal
   --------------------------- */
const cartToggle = document.getElementById('cart-toggle');
const cartModal = document.getElementById('cart-modal');
const cartClose = document.getElementById('cart-close');
const cartItemsEl = document.getElementById('cart-items');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const cartCountEl = document.getElementById('cart-count');

cartToggle.addEventListener('click', () => {
  cartModal.style.display = 'flex';
  cartModal.setAttribute('aria-hidden', 'false');
});
cartClose.addEventListener('click', () => {
  cartModal.style.display = 'none';
  cartModal.setAttribute('aria-hidden', 'true');
});
document.getElementById('clear-cart').addEventListener('click', () => {
  cart = [];
  saveCart();
});
document.getElementById('checkout').addEventListener('click', () => {
  simulateCheckout();
});

/* Render cart count */
function renderCartCount() {
  const qty = cart.reduce((s, i) => s + i.qty, 0);
  cartCountEl.textContent = qty;
}

/* Render cart items */
function renderCartItems() {
  cartItemsEl.innerHTML = '';
  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p>Your cart is empty.</p>';
    cartSubtotalEl.textContent = '0.00';
    return;
  }
  let subtotal = 0;
  cart.forEach(item => {
    subtotal += item.price * item.qty;
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <div class="cart-row-left">
        <div class="cart-title">${item.title}</div>
        <div class="cart-sku">${item.sku}</div>
      </div>
      <div class="cart-row-right">
        <button class="qty-minus" data-sku="${item.sku}">−</button>
        <span class="qty">${item.qty}</span>
        <button class="qty-plus" data-sku="${item.sku}">+</button>
        <div class="line-price">${(item.price * item.qty).toFixed(2)} BHD</div>
      </div>
    `;
    cartItemsEl.appendChild(row);
  });

  cartSubtotalEl.textContent = subtotal.toFixed(2);

  // attach qty handlers
  cartItemsEl.querySelectorAll('.qty-plus').forEach(b => {
    b.addEventListener('click', () => {
      const sku = b.dataset.sku;
      cart[findItemIndex(sku)].qty++;
      saveCart();
    });
  });
  cartItemsEl.querySelectorAll('.qty-minus').forEach(b => {
    b.addEventListener('click', () => {
      const sku = b.dataset.sku;
      const idx = findItemIndex(sku);
      if (idx !== -1) {
        cart[idx].qty--;
        if (cart[idx].qty <= 0) cart.splice(idx, 1);
        saveCart();
      }
    });
  });
}

/* ---------------------------
   Simulate checkout (demo)
   - Sends Purchase event with items, value, country
   - Clears cart
   --------------------------- */
function simulateCheckout() {
  if (cart.length === 0) return alert('Cart is empty');

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const items = cart.map(i => ({ sku: i.sku, name: i.title, quantity: i.qty, price: i.price }));

  // Track Purchase
  fbq('track', 'Purchase', { value: total.toFixed(2), currency: "BHD", contents: items, country: visitorCountry });
  gtag('event', 'purchase', { value: total, currency: 'BHD', items, country: visitorCountry });

  // Optionally you can send order to your server here

  alert(`Order simulated — total ${total.toFixed(2)} BHD. Thank you!`);
  cart = [];
  saveCart();
  cartModal.style.display = 'none';
}

/* Initialize UI */
renderCartCount();
renderCartItems();

/* Make sure country displayed updated after detection */
setTimeout(() => {
  document.getElementById('visitor-country').textContent = visitorCountry;
}, 1200);
