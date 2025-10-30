// Basic interactivity: mobile nav + product modal + year
document.addEventListener('DOMContentLoaded', () => {
  // year
  document.getElementById('year').textContent = new Date().getFullYear();

  // nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    nav.setAttribute('aria-hidden', String(expanded));
  });

  // product modal
  const modal = document.getElementById('product-modal');
  const modalBody = document.getElementById('modal-body');
  const modalTitle = document.getElementById('modal-title');
  const closeBtn = document.getElementById('modal-close');

  function openModal(title, contentHtml) {
    modalTitle.textContent = title;
    modalBody.innerHTML = contentHtml;
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'flex';
  }
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
  }
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  const productButtons = document.querySelectorAll('.open-product');
  productButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const product = btn.getAttribute('data-product') || 'Product';
      // Basic product details derived from the spec; extend as needed.
      const content = `
        <p><strong>${product}</strong></p>
        <ul>
          <li>Type: Sugar-Free / Fitness &amp; Performance</li>
          <li>Net weight: 250 ml (for cans)</li>
          <li>Target caffeine: 32 mg / 100 ml (≈ 80 mg / 250 ml)</li>
          <li>Ingredients: Carbonated water; Natural caffeine; L-Carnitine; B-Vitamins; L-Theanine; Herbal extracts; Natural flavors; Stevia/Monk Fruit; Citric acid; Preservatives (potassium sorbate, sodium benzoate)</li>
        </ul>
        <p class="muted">Note: technical specs & nutritional values to be confirmed by lab prior to printing.</p>
      `;
      openModal(product, content);
    });
  });

  // Escape closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});
