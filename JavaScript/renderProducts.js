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
        <i class="fas fa-heart heart-icon" data-product-id="${product.id}"></i>
        <button class="btn add-to-cart-btn" data-product-id="${product.id}">Aggiungi al carrello</button>
      </div>
    </div>
  `;
}

// Funzione per aggiornare il conteggio del carrello nella home, se hai un elemento simile
function updateCartCount() {
  const cartCountElement = document.getElementById("cart-count");
  if (!cartCountElement) return;
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartCountElement.textContent = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
}

// Controlla lo stato del bottone in base al carrello
function checkButtonCartStatus(button, productId) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const productInCart = cart.find(item => item.id === productId);

  if (productInCart) {
    button.innerHTML = `<i class="fas fa-check"></i> NEL CARRELLO`;
    button.disabled = true;
    button.style.backgroundColor = '#ffc107';
    button.style.color = '#000000';
  } else {
    button.innerHTML = 'Aggiungi al carrello';
    button.disabled = false;
    button.style.backgroundColor = '';
    button.style.color = '';
  }
}

// Mostra feedback sul bottone dopo il click
function showButtonFeedback(button, message, isAdded) {
  const originalText = 'Aggiungi al carrello';
  if (!button.dataset.originalText) {
    button.dataset.originalText = originalText;
  }

  button.innerHTML = isAdded ? `<i class="fas fa-check"></i> ${message}` : message;
  button.disabled = true;
  button.style.backgroundColor = isAdded ? '#28a745' : '#ffc107';
  button.style.color = isAdded ? '#ffffff' : '#000000';

  setTimeout(() => {
    button.innerHTML = button.dataset.originalText;
    button.disabled = false;
    button.style.backgroundColor = '';
    button.style.color = '';
    checkButtonCartStatus(button, button.dataset.productId);
  }, 2000);
}

// Inizializza i pulsanti Aggiungi al Carrello nella home page
function initAddToCartButtonsHome() {
  document.querySelectorAll("#featured-products .add-to-cart-btn, #new-arrivals .add-to-cart-btn").forEach(button => {
    const productId = button.dataset.productId;

    checkButtonCartStatus(button, productId);

    button.addEventListener("click", function () {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const product = products.find(p => p.id === productId);

      if (product) {
        const existingProductIndex = cart.findIndex(item => item.id === productId);

        if (existingProductIndex === -1) {
          const productToAdd = {
            id: product.id,
            name: product.title,
            price: product.price,
            quantity: 1,
            image: product.images && product.images.length > 0 ? product.images[0] : 'assets/placeholder.jpg'
          };
          cart.push(productToAdd);
          localStorage.setItem("cart", JSON.stringify(cart));
          showButtonFeedback(button, 'AGGIUNTO', true);
        } else {
          showButtonFeedback(button, 'GIÀ NEL CARRELLO', false);
        }
        updateCartCount();
      } else {
        console.error("Prodotto non trovato nell'array 'products' per ID:", productId);
      }
    });
  });
}

// Mostra i primi 4 prodotti in evidenza
function renderFeaturedProducts() {
  const featured = products.slice(0, 4);
  document.getElementById("featured-products").innerHTML = featured.map(createProductCard).join('');
}

// Mostra i successivi 2 nuovi arrivi
function renderNewArrivals() {
  const arrivals = products.slice(4, 6);
  document.getElementById("new-arrivals").innerHTML = arrivals.map(createProductCard).join('');
}

// Avvia il rendering e inizializza i pulsanti dopo il caricamento della pagina
document.addEventListener("DOMContentLoaded", () => {
  renderFeaturedProducts();
  renderNewArrivals();
  initAddToCartButtonsHome();
  updateCartCount();
});
