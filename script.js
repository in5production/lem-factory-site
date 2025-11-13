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

// Lightbox click-to-zoom
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
