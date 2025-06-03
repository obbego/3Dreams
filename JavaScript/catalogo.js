document.addEventListener("DOMContentLoaded", function () {

    const categoryFilter = document.getElementById("category-filter");
    const sortFilter = document.getElementById("sort-filter");
    const searchBar = document.getElementById("search-input-bar");
    const productRow = document.getElementById("product-row");

    function initHearts() {
        document.querySelectorAll(".heart-icon").forEach(icon => {
            const productId = icon.dataset.productId;
            // AGGIORNATO: Usa getUserFavorites() per leggere i preferiti
            let favorites = window.getUserFavorites();

            // AGGIORNATO: Usa la classe 'liked' per coerenza con homepage
            icon.classList.toggle("liked", favorites.includes(productId));

            icon.addEventListener("click", function (event) {
                event.stopPropagation(); // Evita che il click si propaghi alla card intera
                // AGGIORNATO: Usa getUserFavorites() e saveUserFavorites()
                favorites = window.getUserFavorites(); // Rileggi i preferiti per l'ultimo stato
                if (favorites.includes(productId)) {
                    favorites = favorites.filter(id => id !== productId);
                    icon.classList.remove("liked");
                } else {
                    favorites.push(productId);
                    icon.classList.add("liked");
                }
                window.saveUserFavorites(favorites); // Salva i preferiti aggiornati
                applyFilters(); // Ri-applica i filtri quando i preferiti cambiano (se il filtro preferiti è attivo)
            });
        });
    }

    function initAddToCartButtons() {
        document.querySelectorAll(".add-to-cart-btn").forEach(button => {
            const productId = button.dataset.productId;

            checkButtonCartStatus(button, productId);

            button.addEventListener("click", function (event) {
                event.stopPropagation(); // Evita che il click si propaghi alla card intera
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
                    window.updateCartCount(); // Chiama la funzione globale per aggiornare il contatore
                } else {
                    console.error("Prodotto non trovato nell'array 'products' per ID:", productId);
                }
            });
        });
    }

    // Mostra feedback sul bottone dopo il click
    function showButtonFeedback(button, message, isAdded) {
        const originalText = 'Aggiungi al carrello';
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
            button.style.backgroundColor = '#804AF2'; // VIOLA: Ripristina al colore originale del bottone catalogo
            button.style.color = '#ffffff'; // Ripristina testo bianco
            button.classList.remove('added', 'in-cart'); // Rimuovi le classi di stato
            checkButtonCartStatus(button, button.dataset.productId); // Ricontrolla lo stato effettivo
        }, 2000);
    }

    // Controlla lo stato del bottone in base al carrello
    function checkButtonCartStatus(button, productId) {
        const cart = window.getUserCart(); // Usa la funzione globale
        const productInCart = cart.find(item => item.id === productId);

        if (productInCart) {
            button.innerHTML = `<i class="fas fa-check"></i> Nel carrello`; // Testo su una riga
            button.disabled = true;
            button.style.backgroundColor = '#f7d04d'; // Giallo per "Nel Carrello"
            button.style.color = '#333';
            button.classList.add('in-cart');
            button.classList.remove('added');
        } else {
            button.innerHTML = 'Aggiungi al carrello'; // Testo con capitalizzazione corretta
            button.disabled = false;
            button.style.backgroundColor = '#804AF2'; // VIOLA: Colore predefinito per il catalogo
            button.style.color = '#ffffff';
            button.classList.remove('in-cart', 'added');
        }
    }

    // Genera e filtra i prodotti
    function applyFilters() {
        const selectedCategory = categoryFilter.value;
        const selectedSort = sortFilter.value;
        const searchTerm = searchBar.value.toLowerCase();

        // AGGIORNATO: Usa getUserFavorites() per ottenere i preferiti
        const favorites = window.getUserFavorites();

        let filteredProducts = products.filter(product => {
            const category = product.category;
            const name = product.title.toLowerCase();

            const matchesCategory = (selectedCategory === "all" ||
                                     (selectedCategory === "favorites" && favorites.includes(product.id)) ||
                                     (selectedCategory !== "favorites" && category === selectedCategory));

            const matchesSearch = name.includes(searchTerm);

            return matchesCategory && matchesSearch;
        });

        filteredProducts.sort((a, b) => {
            const priceA = parseFloat(a.price);
            const priceB = parseFloat(b.price);
            const nameA = a.title.toLowerCase();
            const nameB = b.title.toLowerCase();

            switch (selectedSort) {
                case "price-asc":
                    return priceA - priceB;
                case "price-desc":
                    return priceB - priceA;
                case "name-asc":
                    return nameA.localeCompare(nameB);
                case "name-desc":
                    return nameB.localeCompare(nameA);
                default:
                    return 0;
            }
        });

        productRow.innerHTML = "";

        if (filteredProducts.length === 0) {
            let message = "Nessun prodotto trovato con i filtri selezionati.";
            if (selectedCategory === "favorites") {
                message = "Non hai ancora aggiunto prodotti ai preferiti.";
            }
            productRow.innerHTML = `<div class="col-12 text-center text-white py-5"><h3>${message}</h3></div>`;
        } else {
            filteredProducts.forEach(product => {
                const productCardHtml = `
                    <div class="col-6 col-md-4 col-lg-3 product-card" id="${product.id}" data-category="${product.category}" data-price="${product.price}" data-name="${product.title}">
                        <div class="card prodotto-card text-white">
                            <a href="singleProduct.html?id=${product.id}" class="text-white text-decoration-none product-link">
                                <img src="${product.images[0]}" class="card-img-top product-image" alt="${product.title}">
                                <div class="card-body product-body">
                                    <h6 class="card-title material-title">${product.material}</h6>
                                    <h5 class="card-title fw-bold product-name">${product.title}</h5>
                                    <p class="card-text product-price">€ ${product.price.toFixed(2)}</p>
                                </div>
                            </a>
                            <i class="fas fa-heart heart-icon" data-product-id="${product.id}"></i>
                            <button class="btn add-to-cart-btn" data-product-id="${product.id}">Aggiungi al carrello</button>
                        </div>
                    </div>
                `;
                productRow.innerHTML += productCardHtml;
            });
        }

        initHearts();
        initAddToCartButtons();
    }

    // Event listener per filtri e barra di ricerca
    categoryFilter.addEventListener("change", () => applyFilters());
    sortFilter.addEventListener("change", () => applyFilters());
    searchBar.addEventListener("input", () => applyFilters());

    // Chiamate di inizializzazione
    window.updateCartCount(); // Chiama la funzione globale per aggiornare il contatore
    applyFilters();

});
