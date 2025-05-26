document.addEventListener("DOMContentLoaded", function () {
  const categoryFilter = document.getElementById("category-filter");
  const sortFilter = document.getElementById("sort-filter");
  const searchBar = document.getElementById("search-bar");
  const productCards = Array.from(document.querySelectorAll(".product-card"));
  const productRow = document.getElementById("product-row");
  const cartCount = document.getElementById("cart-count");

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  //Aggiorna conteggio carrello
  function updateCartCount() {
    cartCount.textContent = cart.length;
  }

  //Inizializza cuori
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

  //Inizializza pulsanti carrello
  function initAddToCartButtons() {
    document.querySelectorAll(".add-to-cart-btn").forEach(button => {
      button.addEventListener("click", function () {
        const card = button.closest(".product-card");
        const productId = card.id;
        if (!cart.includes(productId)) {
          cart.push(productId);
          localStorage.setItem("cart", JSON.stringify(cart));
          updateCartCount();
        }
      });
    });
  }

  //Filtra per categoria
  categoryFilter.addEventListener("change", () => applyFilters());

  //Ordina prodotti
  sortFilter.addEventListener("change", () => applyFilters());

  //Cerca nel nome
  searchBar.addEventListener("input", () => applyFilters());

  function applyFilters() {
    const selectedCategory = categoryFilter.value;
    const selectedSort = sortFilter.value;
    const searchTerm = searchBar.value.toLowerCase();

    let filteredCards = productCards.filter(card => {
      const category = card.dataset.category;
      const name = card.dataset.name.toLowerCase();
      return (selectedCategory === "all" || category === selectedCategory) &&
             name.includes(searchTerm);
    });

    filteredCards.sort((a, b) => {
      const priceA = parseFloat(a.dataset.price);
      const priceB = parseFloat(b.dataset.price);
      const nameA = a.dataset.name.toLowerCase();
      const nameB = b.dataset.name.toLowerCase();

      switch (selectedSort) {
        case "price-asc": return priceA - priceB;
        case "price-desc": return priceB - priceA;
        case "name-asc": return nameA.localeCompare(nameB);
        case "name-desc": return nameB.localeCompare(nameA);
        default: return 0;
      }
    });

    productRow.innerHTML = "";
    filteredCards.forEach(card => productRow.appendChild(card));
  }

  //Inizializzazione
  updateCartCount();
  initHearts();
  initAddToCartButtons();
  applyFilters();
});

