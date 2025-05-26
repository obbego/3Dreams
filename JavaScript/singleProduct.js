// JavaScript/catalogo.js
document.addEventListener("DOMContentLoaded", function () {
  // ... altre costanti e funzioni ...

  // Questa è la parte cruciale che genera le schede
  function applyFilters() {
    // ... (logica di filtro e ordinamento) ...

    productRow.innerHTML = ""; // Questo pulisce il contenitore

    // Questo ciclo deve popolare il contenitore con i prodotti
    filteredProducts.forEach(product => {
      const productCardHtml = `
        <div class="col-6 col-md-4 col-lg-3 product-card" id="${product.id}" data-category="${product.category}" data-price="${product.price}" data-name="${product.title}">
          <div class="card prodotto-card text-white">
            <a href="singleProduct.html?id=${product.id}" class="text-white text-decoration-none product-link">
              <img src="${product.image.replace('_singolo', '')}" class="card-img-top product-image" alt="${product.title}">
              <div class="card-body product-body">
                <h7 class="card-title material-title">${product.material}</h7>
                <h5 class="card-title fw-bold product-name">${product.title}</h5>
                <p class="card-text product-price">$ ${product.price}</p>
              </div>
            </a>
            <i class="fas fa-heart heart-icon" data-product-id="${product.id}"></i>
            <button class="btn add-to-cart-btn" data-product-id="${product.id}">Aggiungi al carrello</button>
          </div>
        </div>
      `;
      productRow.innerHTML += productCardHtml; // Qui le schede vengono aggiunte
    });

    // Queste funzioni devono essere chiamate DOPO che le card sono state generate
    initHearts();
    initAddToCartButtons();
  }

  // ... (altri event listener) ...

  applyFilters(); // Questa riga è fondamentale per popolare la pagina all'inizio
});