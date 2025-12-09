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
document.getElementById("year").textContent = new Date().getFullYear();

// Lightbox (preview)
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

// ------------------------------
// META & GA TRACKING
// ------------------------------

function trackAddToCart(product) {
  fbq('track', 'AddToCart', { content_name: product, value: 0, currency: "BHD" });
  gtag('event', 'add_to_cart', { item_name: product });
}

function trackOrder(amount, product) {
  fbq('track', 'Purchase', { value: amount, currency: "BHD", content_name: product });
  gtag('event', 'purchase', {
    value: amount,
    currency: "BHD",
    item_name: product,
    transaction_id: Date.now()
  });
}

function trackComment() {
  fbq('trackCustom', 'CommentActivity');
  gtag('event', 'comment_activity');
}
