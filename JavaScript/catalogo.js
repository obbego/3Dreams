document.addEventListener("DOMContentLoaded", function () {

    const categoryFilter = document.getElementById("category-filter");
    const sortFilter = document.getElementById("sort-filter");
    const searchBar = document.getElementById("search-input-bar");
    const productRow = document.getElementById("product-row");

    const urlParams = new URLSearchParams(window.location.search);
    const initialCategory = urlParams.get('categoria');
    if (initialCategory) categoryFilter.value = initialCategory;

    function initHearts() {
        document.querySelectorAll(".heart-icon").forEach(icon => {
            const productId = icon.dataset.productId;
            let favorites = window.getUserFavorites();
            icon.classList.toggle("liked", favorites.includes(productId));

            icon.addEventListener("click", function (event) {
                event.stopPropagation();
                favorites = window.getUserFavorites();
                if (favorites.includes(productId)) {
                    favorites = favorites.filter(id => id !== productId);
                    icon.classList.remove("liked");
                } else {
                    favorites.push(productId);
                    icon.classList.add("liked");
                }
                window.saveUserFavorites(favorites);
                applyFilters();
            });
        });
    }

    function initAddToCartButtons() {
        document.querySelectorAll(".add-to-cart-btn").forEach(button => {
            const productId = button.dataset.productId;
            checkButtonCartStatus(button, productId);

            button.addEventListener("click", function (event) {
                event.stopPropagation();
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
                            image: product.images?.[0] || 'assets/placeholder.jpg'
                        };
                        cart.push(productToAdd);
                        window.saveUserCart(cart);
                        showButtonFeedback(button, 'Aggiunto', true);
                    } else {
                        showButtonFeedback(button, 'Nel carrello', false);
                    }
                    window.updateCartCount();
                } else {
                    console.error("Prodotto non trovato per ID:", productId);
                }
            });
        });
    }

    function showButtonFeedback(button, message, isAdded) {
        const originalText = 'Aggiungi al carrello';
        if (!button.dataset.originalText) {
            button.dataset.originalText = originalText;
        }

        button.innerHTML = `<i class="fas fa-check"></i> ${message}`;
        button.disabled = true;

        if (isAdded) {
            button.style.backgroundColor = '#28a745';
            button.style.color = '#ffffff';
            button.classList.add('added');
            button.classList.remove('in-cart');
        } else {
            button.style.backgroundColor = '#f7d04d';
            button.style.color = '#333';
            button.classList.add('in-cart');
            button.classList.remove('added');
        }

        setTimeout(() => {
            button.innerHTML = button.dataset.originalText;
            button.disabled = false;
            button.style.backgroundColor = '#804AF2';
            button.style.color = '#ffffff';
            button.classList.remove('added', 'in-cart');
            checkButtonCartStatus(button, button.dataset.productId);
        }, 2000);
    }

    function checkButtonCartStatus(button, productId) {
        const cart = window.getUserCart();
        const productInCart = cart.find(item => item.id === productId);

        if (productInCart) {
            button.innerHTML = `<i class="fas fa-check"></i> Nel carrello`;
            button.disabled = true;
            button.style.backgroundColor = '#f7d04d';
            button.style.color = '#333';
            button.classList.add('in-cart');
            button.classList.remove('added');
        } else {
            button.innerHTML = 'Aggiungi al carrello';
            button.disabled = false;
            button.style.backgroundColor = '#804AF2';
            button.style.color = '#ffffff';
            button.classList.remove('in-cart', 'added');
        }
    }

    function applyFilters() {
        const selectedCategory = categoryFilter.value;
        const selectedSort = sortFilter.value;
        const searchTerm = searchBar.value.toLowerCase();
        const favorites = window.getUserFavorites();

        let filteredProducts = products.filter(product => {
            const category = product.category;
            const name = product.title.toLowerCase();

            const matchesCategory =
                selectedCategory === "all" ||
                (selectedCategory === "favorites" && favorites.includes(product.id)) ||
                (selectedCategory !== "favorites" && category === selectedCategory);

            const matchesSearch = name.includes(searchTerm);
            return matchesCategory && matchesSearch;
        });

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

        productRow.innerHTML = "";

        if (filteredProducts.length === 0) {
            const message = selectedCategory === "favorites"
                ? "Non hai ancora aggiunto prodotti ai preferiti."
                : "Nessun prodotto trovato con i filtri selezionati.";
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
                    </div>`;
                productRow.innerHTML += productCardHtml;
            });
        }

        initHearts();
        initAddToCartButtons();
    }

    categoryFilter.addEventListener("change", () => applyFilters());
    sortFilter.addEventListener("change", () => applyFilters());
    searchBar.addEventListener("input", () => applyFilters());

    window.updateCartCount();
    applyFilters();
});
