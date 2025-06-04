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
    function showButtonFeedbackSingleProduct(button, message, isAdded) {
        const originalText = 'Aggiungi al carrello'; // Testo originale del bottone
        if (!button.dataset.originalText) {
            button.dataset.originalText = originalText;
        }

        let feedbackMessage = '';
        if (isAdded) {
            feedbackMessage = 'Aggiunto!'; // Testo conciso per "aggiunto"
        } else {
            feedbackMessage = 'Nel carrello'; // Testo conciso per "già nel carrello"
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
            button.style.backgroundColor = '#804AF2'; // VIOLA: Ripristina colore originale
            button.style.color = '#ffffff';
            button.classList.remove('added', 'in-cart');
            checkButtonCartStatusSingleProduct(button, button.dataset.productId); // Ricontrolla lo stato effettivo
        }, 2000);
    }

    // Funzione per controllare lo stato del carrello all'avvio e dopo le modifiche
    function checkButtonCartStatusSingleProduct(button, productId) {
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
            button.style.backgroundColor = '#804AF2'; // VIOLA: Colore predefinito
            button.style.color = '#ffffff';
            button.classList.remove('in-cart', 'added');
        }
    }

    // Funzione per aggiornare l'icona del cuore
    function updateHeartIcon(id) {
        if (heartIconSingleProduct) {
            let favorites = window.getUserFavorites(); // Usa la funzione globale
            if (favorites.includes(id)) {
                heartIconSingleProduct.classList.add('liked'); // Usa la classe 'liked'
            } else {
                heartIconSingleProduct.classList.remove('liked');
            }
        }
    }

    // --- LOGICA DI CARICAMENTO E POPOLAMENTO DEL PRODOTTO ---
    if (productId && typeof products !== 'undefined') {
        const product = products.find(p => p.id === productId);

        if (product) {
            // Popola gli elementi HTML esistenti
            if (productBrandElem) productBrandElem.textContent = product.brand;
            if (productTitleElem) productTitleElem.textContent = product.title;

            if (carouselInner && product.images && product.images.length > 0) {
                carouselInner.innerHTML = ''; // Pulisci prima di aggiungere
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
            } else if (carouselInner) {
                carouselInner.innerHTML = '<div class="text-white text-center">Immagini non disponibili.</div>';
            }

            if (productDescriptionElem) productDescriptionElem.innerHTML = `<p>${product.description.replace(/\n/g, '</p><p>')}</p>`;
            if (productPriceElem) productPriceElem.textContent = `€ ${product.price.toFixed(2)}`; // Corretto simbolo euro e toFixed

            // Inizializza l'icona del cuore
            updateHeartIcon(productId);
            if (heartIconSingleProduct) {
                heartIconSingleProduct.addEventListener('click', () => {
                    let favorites = window.getUserFavorites(); // Usa la funzione globale
                    if (favorites.includes(productId)) {
                        favorites = favorites.filter(id => id !== productId);
                    } else {
                        favorites.push(productId);
                    }
                    window.saveUserFavorites(favorites); // Salva i preferiti aggiornati
                    updateHeartIcon(productId); // Aggiorna l'icona dopo la modifica
                });
            }

            // Inizializza il pulsante Aggiungi al Carrello
            if (addToCartButton) {
                checkButtonCartStatusSingleProduct(addToCartButton, productId); // Controlla lo stato iniziale

                addToCartButton.addEventListener('click', () => {
                    let cart = window.getUserCart(); // Usa la funzione globale

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
                        showButtonFeedbackSingleProduct(addToCartButton, 'Aggiunto', true);
                    } else {
                        showButtonFeedbackSingleProduct(addToCartButton, 'Nel carrello', false);
                    }
                    window.updateCartCount(); // Chiama la funzione globale per aggiornare il contatore
                });
            }
            window.updateCartCount(); // Aggiorna il contatore all'avvio della pagina singleProduct

        } else {
            console.error('Prodotto non trovato per l\'ID:', productId);
            if (productTitleElem) productTitleElem.textContent = 'Prodotto non disponibile';
            if (productDescriptionElem) productDescriptionElem.textContent = 'Siamo spiacenti, il prodotto richiesto non è stato trovato.'; 
            if (addToCartButton) addToCartButton.style.display = 'none';
            if (heartIconSingleProduct) heartIconSingleProduct.style.display = 'none';
            if (backToCatalogArrowInCard) backToCatalogArrowInCard.style.display = 'none';
        }
    } else {
        console.error('ID del prodotto non trovato nell\'URL o i dati dei prodotti non sono stati caricati.');
        if (productTitleElem) productTitleElem.textContent = 'Errore di caricamento';
        if (productDescriptionElem) productDescriptionElem.textContent = 'Non è stato possibile caricare i dettagli del prodotto. Riprova più tardi o torna al catalogo.';
        if (addToCartButton) addToCartButton.style.display = 'none';
        if (heartIconSingleProduct) heartIconSingleProduct.style.display = 'none';
        if (backToCatalogArrowInCard) backToCatalogArrowInCard.style.display = 'none';
    }
});

