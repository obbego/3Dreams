document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    const productBrandElem = document.getElementById('product-brand');
    const productTitleElem = document.getElementById('product-title');
    // Rimosso productImageElem perché ora c'è un carosello
    const carouselInner = document.getElementById('carousel-inner'); // Nuovo riferimento al carosello
    const productDescriptionElem = document.getElementById('product-description');
    const productPriceElem = document.getElementById('product-price');
    const addToCartButton = document.getElementById('add-to-cart-single-product');
    const cartNotificationMessage = document.getElementById('cart-notification-message');
    const heartIconSingleProduct = document.getElementById('heart-icon-single-product');
    const backToCatalogArrowInCard = document.getElementById('back-to-catalog-arrow-in-card');

    function showNotification(message, isSuccess = true) {
        cartNotificationMessage.textContent = message;
        cartNotificationMessage.style.display = 'block';
        cartNotificationMessage.classList.remove('text-success', 'text-warning');

        if (isSuccess) {
            cartNotificationMessage.classList.add('text-success');
        } else {
            cartNotificationMessage.classList.add('text-warning');
        }

        setTimeout(() => {
            cartNotificationMessage.style.display = 'none';
            cartNotificationMessage.textContent = '';
        }, 3000);
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

    if (productId && typeof products !== 'undefined') {
        const product = products.find(p => p.id === productId);

        if (product) {
            productBrandElem.textContent = product.brand;
            productTitleElem.textContent = product.title;

            // NUOVO: Popola il carosello con le immagini
            if (product.images && product.images.length > 0) {
                carouselInner.innerHTML = ''; // Pulisci qualsiasi contenuto precedente
                product.images.forEach((imageSrc, index) => {
                    const carouselItem = document.createElement('div');
                    carouselItem.classList.add('carousel-item');
                    if (index === 0) {
                        carouselItem.classList.add('active'); // La prima immagine è attiva
                    }

                    const img = document.createElement('img');
                    img.src = imageSrc;
                    img.alt = product.title + ' ' + (index + 1);
                    img.classList.add('d-block', 'w-100', 'product-carousel-image'); // Aggiunto product-carousel-image per lo stile CSS

                    carouselItem.appendChild(img);
                    carouselInner.appendChild(carouselItem);
                });
            } else {
                // Gestisci il caso in cui non ci siano immagini (o fallback)
                carouselInner.innerHTML = '<div class="text-white text-center">Immagini non disponibili.</div>';
            }

            productDescriptionElem.innerHTML = `<p>${product.description.replace(/\n/g, '</p><p>')}</p>`;
            productPriceElem.textContent = `$ ${product.price}`;

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

            addToCartButton.addEventListener('click', () => {
                let cart = JSON.parse(localStorage.getItem("cart")) || [];
                if (!cart.includes(productId)) {
                    cart.push(productId);
                    localStorage.setItem("cart", JSON.stringify(cart));
                    showNotification(`${product.title} aggiunto al carrello!`, true);
                } else {
                    showNotification(`${product.title} è già nel carrello.`, false);
                }
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