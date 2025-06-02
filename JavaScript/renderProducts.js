// Funzione per creare la card HTML di un prodotto
function createProductCard(product) {
  return `
    <div class="col">
      <div class="card prodotto-card text-white">
        <img src="${product.images[0]}" class="card-img-top" alt="${product.title}">
        <div class="card-body p-2">
          <h7 class="card-title small-text">Materiale</h7>
          <h6 class="card-title fw-bold small-text">${product.title}</h6>
          <p class="card-text small">€ ${product.price}</p>
        </div>
        <i class="fas fa-heart heart-icon"></i>
        <button class="btn add-to-cart-btn">Aggiungi al carrello</button>
      </div>
    </div>
  `;
}

// Mostra i primi 4 prodotti in evidenza
function renderFeaturedProducts() {
  const featured = products.slice(0, 4); // puoi cambiare la logica
  document.getElementById("featured-products").innerHTML = featured.map(createProductCard).join('');
}

// Mostra i successivi 2 nuovi arrivi
function renderNewArrivals() {
  const arrivals = products.slice(4, 6); // puoi cambiarla con .filter(...) se hai un flag "new"
  document.getElementById("new-arrivals").innerHTML = arrivals.map(createProductCard).join('');
}

// Avvia il rendering dopo il caricamento della pagina
document.addEventListener("DOMContentLoaded", () => {
  renderFeaturedProducts();
  renderNewArrivals();
});
