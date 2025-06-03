// productsData.js (Assicurati che questo file contenga l'array 'products')

// Funzione per ottenere N prodotti casuali unici da un array
function getRandomProducts(arr, num) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

// Funzione per creare la card HTML di un prodotto
function createProductCard(product) {
    return `
        <div class="col">
            <div class="card prodotto-card text-white clickable-card" data-product-id="${product.id}">
                <img src="${product.images[0]}" class="card-img-top" alt="${product.title}">
                <div class="card-body">
                    <h6 class="card-title small-text">${product.material || 'Materiale sconosciuto'}</h6>
                    <h5 class="card-title fw-bold">${product.title}</h5>
                    <p class="card-text small">€ ${product.price.toFixed(2)}</p>
                </div>
                <i class="fas fa-heart heart-icon" data-product-id="${product.id}"></i>
                <button class="btn add-to-cart-btn" data-product-id="${product.id}">Aggiungi al carrello</button>
            </div>
        </div>
    `;
}

function initClickableCards() {
    document.querySelectorAll(".clickable-card").forEach(card => {
        card.style.cursor = "pointer";
        card.addEventListener("click", (event) => {
            // Per evitare che il click sul cuore o sul bottone attivi il redirect
            if (event.target.closest(".add-to-cart-btn") || event.target.closest(".heart-icon")) return;

            const productId = card.dataset.productId;
            if (productId) {
                window.location.href = `singleProduct.html?id=${productId}`;
            }
        });
    });
}

function initHeartIcons() {
    document.querySelectorAll(".heart-icon").forEach(heart => {
        const productId = heart.dataset.productId;
        // AGGIORNATO: Usa getUserFavorites() per leggere i preferiti
        let favorites = window.getUserFavorites();

        // Imposta colore iniziale
        if (favorites.includes(productId)) {
            heart.classList.add("liked");
        }

        heart.addEventListener("click", (event) => {
            event.stopPropagation(); // Evita che il click si propaghi alla card intera
            // AGGIORNATO: Usa getUserFavorites() e saveUserFavorites()
            favorites = window.getUserFavorites(); // Rileggi i preferiti per l'ultimo stato
            if (favorites.includes(productId)) {
                // Rimuovi dai preferiti
                favorites = favorites.filter(id => id !== productId);
                heart.classList.remove("liked");
            } else {
                // Aggiungi ai preferiti
                favorites.push(productId);
                heart.classList.add("liked");
            }
            window.saveUserFavorites(favorites); // Salva i preferiti aggiornati
        });
    });
}

// Controlla lo stato del bottone in base al carrello
function checkButtonCartStatus(button, productId) {
    // AGGIORNATO: Usa getUserCart() per leggere il carrello
    const cart = window.getUserCart();
    const productInCart = cart.find(item => item.id === productId);

    if (productInCart) {
        button.innerHTML = `<i class="fas fa-check"></i> Nel carrello`; // Testo con capitalizzazione corretta
        button.disabled = true;
        button.style.backgroundColor = '#f7d04d'; // Giallo per "Nel Carrello"
        button.style.color = '#333'; // Testo scuro
        button.classList.add('in-cart'); // Mantieni la classe per coerenza CSS
        button.classList.remove('added');
    } else {
        button.innerHTML = 'Aggiungi al carrello'; // Testo con capitalizzazione corretta
        button.disabled = false;
        button.style.backgroundColor = '#804AF2'; // VIOLA: Colore originale del bottone Home
        button.style.color = '#ffffff'; // Testo bianco
        button.classList.remove('in-cart', 'added');
    }
}

// Mostra feedback sul bottone dopo il click
function showButtonFeedback(button, message, isAdded) {
    const originalText = 'Aggiungi al carrello'; // Testo con capitalizzazione corretta
    if (!button.dataset.originalText) {
        button.dataset.originalText = originalText;
    }

    let feedbackMessage = '';
    if (isAdded) {
        feedbackMessage = 'Aggiunto!'; // Testo conciso
    } else {
        feedbackMessage = 'Nel carrello'; // Testo conciso
    }

    button.innerHTML = `<i class="fas fa-check"></i> ${feedbackMessage}`;
    button.disabled = true;

    if (isAdded) {
        button.style.backgroundColor = '#28a745'; // Verde per "Aggiunto"
        button.style.color = '#ffffff';
        button.classList.add('added');
        button.classList.remove('in-cart');
    } else {
        button.style.backgroundColor = '#f7d04d'; // Giallo per "Già nel carrello"
        button.style.color = '#333';
        button.classList.add('in-cart');
        button.classList.remove('added');
    }

    setTimeout(() => {
        button.innerHTML = button.dataset.originalText;
        button.disabled = false;
        button.style.backgroundColor = '#804AF2'; // VIOLA: Ripristina colore originale Home
        button.style.color = '#ffffff'; // Ripristina colore testo originale
        button.classList.remove('added', 'in-cart'); // Rimuovi le classi di stato
        checkButtonCartStatus(button, button.dataset.productId); // Ricontrolla lo stato effettivo
    }, 2000);
}

// Inizializza i pulsanti Aggiungi al Carrello nella home page
function initAddToCartButtonsHome() {
    document.querySelectorAll(".add-to-cart-btn").forEach(button => {
        const productId = button.dataset.productId;

        checkButtonCartStatus(button, productId); // Controlla lo stato iniziale

        button.addEventListener("click", function () {
            // AGGIORNATO: Usa getUserCart() e saveUserCart()
            let cart = window.getUserCart();
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
                    window.saveUserCart(cart); // Salva il carrello aggiornato
                    showButtonFeedback(button, 'Aggiunto', true); // Passa 'Aggiunto' come messaggio
                } else {
                    showButtonFeedback(button, 'Nel carrello', false); // Passa 'Nel carrello' come messaggio
                }
                window.updateCartCount(); // Chiama la funzione globale
            } else {
                console.error("Prodotto non trovato nell'array 'products' per ID:", productId);
            }
        });
    });
}

// Mostra 4 prodotti casuali in evidenza
function renderFeaturedProducts() {
    const featured = getRandomProducts(products, 4);
    document.getElementById("featured-products").innerHTML = featured.map(createProductCard).join('');
}

// Mostra 4 nuovi arrivi casuali
function renderNewArrivals() {
    const arrivals = getRandomProducts(products, 4);
    document.getElementById("new-arrivals").innerHTML = arrivals.map(createProductCard).join('');
}

// Script per la sezione Founders (gestione toggle via CSS)
document.addEventListener("DOMContentLoaded", () => {
    // Il toggle è gestito via CSS tramite l'input checkbox e le proprietà max-height/opacity
});

// Avvia il rendering e inizializza i pulsanti dopo il caricamento della pagina
document.addEventListener("DOMContentLoaded", () => {
    renderFeaturedProducts();
    renderNewArrivals();
    initAddToCartButtonsHome();
    initHeartIcons();
    initClickableCards();
    window.updateCartCount(); // Chiama la funzione globale per aggiornare il contatore
});
