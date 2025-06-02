document.addEventListener("DOMContentLoaded", function () {

    const categoryFilter = document.getElementById("category-filter");
    const sortFilter = document.getElementById("sort-filter");
    const searchBar = document.getElementById("search-input-bar"); 
    const productRow = document.getElementById("product-row");
    const cartCountElement = document.getElementById("cart-count"); 
    // Rimuoviamo favoriteFilterToggle in quanto non usiamo più la checkbox separata

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cartCountElement.textContent = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    }

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
                applyFilters(); // Aggiunto: ri-applica i filtri quando i preferiti cambiano
            });
        });
    }

    function initAddToCartButtons() {
        document.querySelectorAll(".add-to-cart-btn").forEach(button => {
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


    // Genera e filtra i prodotti - MODIFICATO PER IL FILTRO PREFERITI NEL DROPDOWN
    function applyFilters() {
        const selectedCategory = categoryFilter.value;
        const selectedSort = sortFilter.value;
        const searchTerm = searchBar.value.toLowerCase();
        // Rimuoviamo showFavoritesOnly in quanto non usiamo più la checkbox

        let filteredProducts = products.filter(product => {
            const category = product.category;
            const name = product.title.toLowerCase();
            
            // Condizione per la categoria selezionata, inclusi "favorites"
            const matchesCategory = (selectedCategory === "all" || 
                                     (selectedCategory === "favorites" && favorites.includes(product.id)) ||
                                     (selectedCategory !== "favorites" && category === selectedCategory));

            const matchesSearch = name.includes(searchTerm);

            // Combina le condizioni: categoria (o preferiti) E ricerca
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

        // Se non ci sono prodotti filtrati (e non è stato selezionato solo "Preferiti" senza averne), mostra un messaggio
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
                                    <h7 class="card-title material-title">${product.material}</h7>
                                    <h5 class="card-title fw-bold product-name">${product.title}</h5>
                                    <p class="card-text product-price">$ ${product.price.toFixed(2)}</p>
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
    // Rimuoviamo l'event listener per favoriteFilterToggle

    // Chiamate di inizializzazione
    updateCartCount(); 
    applyFilters(); 

});