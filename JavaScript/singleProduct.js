document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    const productBrandElem = document.getElementById('product-brand');
    const productTitleElem = document.getElementById('product-title');
    const carouselInner = document.getElementById('carousel-inner');
    const productDescriptionElem = document.getElementById('product-description');
    const productPriceElem = document.getElementById('product-price');
    const addToCartButton = document.getElementById('add-to-cart-single-product');
    const heartIconSingleProduct = document.getElementById('heart-icon-single-product');
    const backToCatalogArrowInCard = document.getElementById('back-to-catalog-arrow-in-card');

    // Funzione per mostrare feedback direttamente sul bottone
    function showButtonFeedback(button, message, isAdded) {
        const originalText = 'AGGIUNGI AL CARRELLO';
        // Salva il testo originale del bottone per poterlo ripristinare
        if (!button.dataset.originalText) {
            button.dataset.originalText = originalText;
        }

        button.innerHTML = isAdded ? `<i class="fas fa-check"></i> ${message}` : message; // Aggiunge icona per "aggiunto"
        button.disabled = true; // Disabilita il bottone per evitare click multipli
        button.style.backgroundColor = isAdded ? '#28a745' : '#ffc107'; // Verde per aggiunto, giallo per già presente
        button.style.color = isAdded ? '#ffffff' : '#000000'; // Testo bianco per verde, scuro per giallo

        // Ripristina il bottone dopo un breve periodo
        setTimeout(() => {
            button.innerHTML = button.dataset.originalText;
            button.disabled = false;
            button.style.backgroundColor = '#000000'; // Colore originale
            button.style.color = '#ffffff';
            // Aggiorna lo stato del bottone dopo il timeout per riflettere se è ancora nel carrello
            checkCartStatus(productId);
        }, 2000); // 2 secondi
    }

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    function updateHeartIcon(id) {
        if (heartIconSingleProduct) {
            if (favorites.includes(id)) {
                heartIconSingleProduct.classList.add('text-danger');
            } else {
                heartIconSingleProduct.classList.remove('text-danger');
            }
        }
    }

    // Funzione per controllare lo stato del carrello all'avvio e dopo le modifiche
    function checkCartStatus(id) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const productInCart = cart.find(item => item.id === id); 

        if (productInCart) {
            addToCartButton.innerHTML = `<i class="fas fa-check"></i> GIÀ NEL CARRELLO`;
            addToCartButton.disabled = true;
            addToCartButton.style.backgroundColor = '#ffc107'; // Giallo
            addToCartButton.style.color = '#000000'; // Testo scuro
        } else {
            addToCartButton.innerHTML = 'AGGIUNGI AL CARRELLO';
            addToCartButton.disabled = false;
            addToCartButton.style.backgroundColor = '#000000'; // Nero
            addToCartButton.style.color = '#ffffff';
        }
    }

    // Funzione per aggiornare il contatore del carrello nella navbar
    function updateCartCount() {
        const cartCountElement = document.getElementById("cart-count");
        if (cartCountElement) {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            // Calcola la somma delle quantità di tutti i prodotti nel carrello
            // Aggiunto (item.quantity || 0) per robustezza nel caso quantity fosse undefined
            cartCountElement.textContent = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        }
    }


    if (productId && typeof products !== 'undefined') {
        const product = products.find(p => p.id === productId);

        if (product) {
            productBrandElem.textContent = product.brand;
            productTitleElem.textContent = product.title;

            if (product.images && product.images.length > 0) {
                carouselInner.innerHTML = '';
                product.images.forEach((imageSrc, index) => {
                    const carouselItem = document.createElement('div');
                    carouselItem.classList.add('carousel-item');
                    if (index === 0) {
                        carouselItem.classList.add('active');
                    }

                    const img = document.createElement('img');
                    img.src = imageSrc;
                    img.alt = product.title + ' ' + (index + 1);
                    img.classList.add('d-block', 'w-100', 'product-carousel-image');

                    carouselItem.appendChild(img);
                    carouselInner.appendChild(carouselItem); 
                });
            } else {
                carouselInner.innerHTML = '<div class="text-white text-center">Immagini non disponibili.</div>';
            }

            productDescriptionElem.innerHTML = `<p>${product.description.replace(/\n/g, '</p><p>')}</p>`;
            productPriceElem.textContent = `$ ${product.price.toFixed(2)}`; 

            updateHeartIcon(productId);

            if (heartIconSingleProduct) {
                heartIconSingleProduct.addEventListener('click', () => {
                    if (favorites.includes(productId)) {
                        favorites = favorites.filter(id => id !== productId);
                    } else {
                        favorites.push(productId);
                    }
                    localStorage.setItem("favorites", JSON.stringify(favorites));
                    updateHeartIcon(productId);
                });
            }

            // Aggiungi un controllo iniziale sullo stato del carrello al caricamento della pagina
            checkCartStatus(productId);
            updateCartCount(); // Aggiorna il contatore all'avvio della pagina singleProduct


            addToCartButton.addEventListener('click', () => {
                let cart = JSON.parse(localStorage.getItem("cart")) || [];
                const existingProductIndex = cart.findIndex(item => item.id === productId);

                if (existingProductIndex === -1) { 
                    // Aggiungi l'oggetto prodotto completo con quantità 1
                    const productToAdd = {
                        id: product.id,
                        name: product.title, 
                        price: product.price,
                        quantity: 1,
                        image: product.images && product.images.length > 0 ? product.images[0] : 'assets/placeholder.jpg' 
                    };
                    cart.push(productToAdd);
                    localStorage.setItem("cart", JSON.stringify(cart));
                    console.log("Prodotto aggiunto al carrello:", productToAdd); // Debug: cosa viene aggiunto
                    console.log("Contenuto carrello in localStorage:", JSON.parse(localStorage.getItem("cart"))); // Debug: cosa c'è nel localStorage
                    showButtonFeedback(addToCartButton, 'AGGIUNTO AL CARRELLO', true);
                } else {
                    // Prodotto già presente, mostra messaggio
                    showButtonFeedback(addToCartButton, 'GIÀ NEL CARRELLO', false);
                }
                updateCartCount(); // Aggiorna il contatore dopo ogni aggiunta/tentativo
            });

        } else {
            console.error('Prodotto non trovato per l\'ID:', productId);
            productTitleElem.textContent = 'Prodotto non disponibile';
            productDescriptionElem.textContent = 'Siamo spiacenti, il prodotto richiesto non è stato trovato.';
            addToCartButton.style.display = 'none';
            if (heartIconSingleProduct) heartIconSingleProduct.style.display = 'none';
            if (backToCatalogArrowInCard) backToCatalogArrowInCard.style.display = 'none';
        }
    } else {
        console.error('ID del prodotto non trovato nell\'URL o i dati dei prodotti non sono stati caricati.');
        productTitleElem.textContent = 'Errore di caricamento';
        productDescriptionElem.textContent = 'Non è stato possibile caricare i dettagli del prodotto. Riprova più tardi o torna al catalogo.';
        addToCartButton.style.display = 'none';
        if (heartIconSingleProduct) heartIconSingleProduct.style.display = 'none';
        if (backToCatalogArrowInCard) backToCatalogArrowInCard.style.display = 'none';
    }
});