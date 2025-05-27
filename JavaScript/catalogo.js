document.addEventListener("DOMContentLoaded", function () {
  const categoryFilter = document.getElementById("category-filter");
  const sortFilter = document.getElementById("sort-filter");
  const searchBar = document.getElementById("search-bar");
  const productRow = document.getElementById("product-row");
  // cartCount is now handled by commonCart.js

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Inizializza cuori (favorites)
  function initHearts() {
    document.querySelectorAll(".heart-icon").forEach(icon => {
      const productId = icon.dataset.productId;
      icon.classList.toggle("text-danger", favorites.includes(productId));

      icon.addEventListener("click", function () {
        if (favorites.includes(productId)) {
          favorites = favorites.filter(id => id !== productId);
        } else {
          favorites.push(productId);
        }
        localStorage.setItem("favorites", JSON.stringify(favorites));
        icon.classList.toggle("text-danger");
      });
    });
  }

  // Genera e filtra i prodotti
  function applyFilters() {
    const selectedCategory = categoryFilter.value;
    const selectedSort = sortFilter.value;
    const searchTerm = searchBar.value.toLowerCase();

    // Filtra direttamente dall'array 'products'
    let filteredProducts = products.filter(product => {
      const category = product.category;
      const name = product.title.toLowerCase();
      return (selectedCategory === "all" || category === selectedCategory) &&
             name.includes(searchTerm);
    });

    // Ordina i prodotti
    filteredProducts.sort((a, b) => {
      const priceA = parseFloat(a.price);
      const priceB = parseFloat(b.price);
      const nameA = a.title.toLowerCase();
      const nameB = b.title.toLowerCase();

      switch (selectedSort) {
        case "price-asc": return priceA - priceB;
        case "price-desc": return priceB - priceA;
        case "name-asc": return nameA.localeCompare(nameB);
        case "name-desc": return nameB.localeCompare(nameA);
        default: return 0;
      }
    });

    // Pulisci il contenitore dei prodotti
    productRow.innerHTML = "";

    // Aggiungi le schede prodotto filtrate e ordinate
    filteredProducts.forEach(product => {
      const productCardHtml = `
        <div class="col-6 col-md-4 col-lg-3 product-card" id="${product.id}" data-category="${product.category}" data-price="${product.price}" data-name="${product.title}">
          <div class="card prodotto-card text-white">
            <a href="singleProduct.html?id=${product.id}" class="text-white text-decoration-none product-link">
              <img src="${product.image.replace('_singolo', '')}" class="card-img-top product-image" alt="${product.title}">
              <div class="card-body product-body">
                <h7 class="card-title material-title">${product.material}</h7>
                <h5 class="card-title fw-bold product-name">${product.title}</h5>
                <p class="card-text product-price">€ ${product.price}</p>
              </div>
            </a>
            <i class="fas fa-heart heart-icon" data-product-id="${product.id}"></i>
            <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">Aggiungi al carrello</button>
          </div>
        </div>
      `;
      productRow.innerHTML += productCardHtml;
    });

    // Re-inizializza gli event listener per i cuori e il carrello dopo aver ricreato le card
    initHearts();
    setupAddToCartButtons(products); // from commonCart.js
  }

  // Event listener per filtri e barra di ricerca
  categoryFilter.addEventListener("change", () => applyFilters());
  sortFilter.addEventListener("change", () => applyFilters());
  searchBar.addEventListener("input", () => applyFilters());

  // Chiamate di inizializzazione
  applyFilters(); // Popola il catalogo
});