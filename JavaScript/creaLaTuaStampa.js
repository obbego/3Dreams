document.addEventListener('DOMContentLoaded', () => {
    // Riferimenti agli elementi DOM
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const previewPlaceholder = document.getElementById('previewPlaceholder');
    const fileNameSpan = document.getElementById('fileName');
    const dimensionWidth = document.getElementById('dimensionWidth');
    const dimensionHeight = document.getElementById('dimensionHeight');
    const dimensionDepth = document.getElementById('dimensionDepth');
    const calculatedVolumeSpan = document.getElementById('calculatedVolume');
    const materialSelect = document.getElementById('materialSelect');
    const estimatedPriceElem = document.getElementById('estimatedPrice');
    const addToCartButton = document.getElementById('addToCartCustomPrint');
    // const cartCountElement = document.getElementById('cart-count'); // Rimosso, useremo window.updateCartCount()

    // Tariffe per materiale (prezzo per cm³) - Esempi, puoi modificarli
    const materialRates = {
        'PLA': 0.05,
        'ABS': 0.07,
        'Resina': 0.15,
        'PETG': 0.09
    };

    let currentCustomPrintConfig = {
        id: '',
        name: 'Stampa Personalizzata',
        price: 0,
        quantity: 1,
        image: '',
        details: {
            dimensions: { width: 0, height: 0, depth: 0 },
            material: '',
            volume: 0
        }
    };

    function generateUniqueId() {
        return 'custom-print-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    // Rimosso: updateCartCount() locale, useremo window.updateCartCount()

    // Funzione per calcolare il prezzo stimato E gestire l'abilitazione/stile del bottone
    function calculatePrice() {
        const width = parseFloat(dimensionWidth.value) || 0;
        const height = parseFloat(dimensionHeight.value) || 0;
        const depth = parseFloat(dimensionDepth.value) || 0;
        const material = materialSelect.value;

        const volume = width * height * depth;
        calculatedVolumeSpan.textContent = volume.toFixed(2);

        let estimatedPrice = 0;
        if (volume > 0 && materialRates[material]) {
            estimatedPrice = volume * materialRates[material];
            estimatedPrice += 10;
        }

        // Aggiorna la configurazione corrente della stampa personalizzata
        currentCustomPrintConfig.details.dimensions = { width, height, depth };
        currentCustomPrintConfig.details.material = material;
        currentCustomPrintConfig.details.volume = volume;
        currentCustomPrintConfig.price = parseFloat(estimatedPrice.toFixed(2));

        estimatedPriceElem.textContent = `€ ${currentCustomPrintConfig.price.toFixed(2)}`; // Simbolo euro

        // LOGICA DI VALIDAZIONE E STILE DEL BOTTONE
        const isImageUploaded = currentCustomPrintConfig.image !== '';
        const isMaterialSelected = currentCustomPrintConfig.details.material !== '';
        const areDimensionsValid = width > 0 && height > 0 && depth > 0;
        const isPriceCalculated = currentCustomPrintConfig.price > 0;

        // AGGIORNATO: Controlla se il prodotto personalizzato è già nel carrello dell'utente corrente
        const cart = window.getUserCart();
        const productInCart = cart.find(item =>
            item.details &&
            item.details.dimensions.width === width &&
            item.details.dimensions.height === height &&
            item.details.dimensions.depth === depth &&
            item.details.material === material &&
            item.name === currentCustomPrintConfig.name // Per distinguere stampe personalizzate
        );


        if (isImageUploaded && isMaterialSelected && areDimensionsValid && isPriceCalculated) {
            addToCartButton.disabled = false;
            // AGGIORNATO: Imposta lo stile del bottone in base alla presenza nel carrello
            if (productInCart) {
                addToCartButton.innerHTML = `<i class="fas fa-check"></i> Nel carrello`;
                addToCartButton.style.backgroundColor = '#f7d04d'; // Giallo
                addToCartButton.style.color = '#333';
                addToCartButton.classList.add('in-cart');
                addToCartButton.classList.remove('active-button', 'added');
            } else {
                addToCartButton.innerHTML = `Aggiungi al carrello`;
                addToCartButton.style.backgroundColor = '#804AF2'; // Viola
                addToCartButton.style.color = '#ffffff';
                addToCartButton.classList.add('active-button');
                addToCartButton.classList.remove('in-cart', 'added');
            }
        } else {
            addToCartButton.innerHTML = `Aggiungi al carrello`; // Testo predefinito
            addToCartButton.disabled = true;
            addToCartButton.style.backgroundColor = '#804AF2'; // Viola (disabilitato)
            addToCartButton.style.color = '#ffffff';
            addToCartButton.classList.remove('active-button', 'in-cart', 'added');
        }
    }

    imageUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            fileNameSpan.textContent = file.name;
            previewPlaceholder.style.display = 'none';

            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                currentCustomPrintConfig.image = e.target.result;
                calculatePrice();
            };
            reader.onerror = function(e) {
                console.error("FileReader error:", e.target.error);
                // alert("Errore durante la lettura del file. Assicurati che sia un'immagine valida."); // Rimosso alert
                fileNameSpan.textContent = 'Nessun file selezionato';
                imagePreview.src = 'https://placehold.co/300x300/333333/FFFFFF?text=Anteprima+Immagine';
                previewPlaceholder.style.display = 'block';
                currentCustomPrintConfig.image = '';
                calculatePrice();
            };
            reader.readAsDataURL(file);
        } else {
            fileNameSpan.textContent = 'Nessun file selezionato';
            imagePreview.src = 'https://placehold.co/300x300/333333/FFFFFF?text=Anteprima+Immagine';
            previewPlaceholder.style.display = 'block';
            currentCustomPrintConfig.image = '';
            calculatePrice();
        }
    });

    dimensionWidth.addEventListener('input', calculatePrice);
    dimensionHeight.addEventListener('input', calculatePrice);
    dimensionDepth.addEventListener('input', calculatePrice);
    materialSelect.addEventListener('change', calculatePrice);

    // Funzione per mostrare feedback direttamente sul bottone
    function showButtonFeedback(button, message, isAdded) {
        const originalText = 'Aggiungi al Carrello';
        if (!button.dataset.originalText) {
            button.dataset.originalText = originalText;
        }

        let feedbackMessage = '';
        if (isAdded) {
            feedbackMessage = 'Aggiunto!';
        } else {
            feedbackMessage = 'Nel carrello';
        }

        button.innerHTML = `<i class="fas fa-check"></i> ${feedbackMessage}`;
        button.disabled = true;
        button.classList.remove('active-button'); // Rimuoviamo la classe active-button durante il feedback

        if (isAdded) {
            button.style.backgroundColor = '#28a745'; // Verde
            button.style.color = '#ffffff';
            button.classList.add('added');
            button.classList.remove('in-cart');
        } else {
            button.style.backgroundColor = '#f7d04d'; // Giallo
            button.style.color = '#333';
            button.classList.add('in-cart');
            button.classList.remove('added');
        }

        setTimeout(() => {
            button.innerHTML = button.dataset.originalText;
            // Non ripristinare il colore qui, calculatePrice() lo farà
            // button.style.backgroundColor = '';
            // button.style.color = '';
            calculatePrice(); // Questa chiamata ripristinerà lo stato e lo stile corretto del bottone
        }, 2000);
    }

    addToCartButton.addEventListener('click', (event) => {
        event.preventDefault();

        if (!addToCartButton.disabled) {
            currentCustomPrintConfig.id = generateUniqueId();

            const itemToAdd = { ...currentCustomPrintConfig };

            // AGGIORNATO: Usa window.getUserCart() e window.saveUserCart()
            let cart = window.getUserCart();

            // Controlla se una stampa personalizzata con le stesse specifiche è già nel carrello
            const existingCustomPrintIndex = cart.findIndex(item =>
                item.name === 'Stampa Personalizzata' &&
                item.details &&
                item.details.dimensions.width === itemToAdd.details.dimensions.width &&
                item.details.dimensions.height === itemToAdd.details.dimensions.height &&
                item.details.dimensions.depth === itemToAdd.details.dimensions.depth &&
                item.details.material === itemToAdd.details.material
            );

            if (existingCustomPrintIndex === -1) {
                cart.push(itemToAdd);
                window.saveUserCart(cart); // Salva il carrello dell'utente
                showButtonFeedback(addToCartButton, 'Aggiunto', true);
            } else {
                // Se già presente, mostra feedback "Nel carrello"
                showButtonFeedback(addToCartButton, 'Nel carrello', false);
            }

            window.updateCartCount(); // Aggiorna il contatore nella navbar

            // Resetta il form e lo stato della configurazione per una nuova stampa
            document.getElementById('customPrintForm').reset();
            imagePreview.src = 'https://placehold.co/300x300/333333/FFFFFF?text=Anteprima+Immagine';
            previewPlaceholder.style.display = 'block';
            fileNameSpan.textContent = 'Nessun file selezionato';

            currentCustomPrintConfig = {
                id: '',
                name: 'Stampa Personalizzata',
                price: 0,
                quantity: 1,
                image: '',
                details: {
                    dimensions: { width: 0, height: 0, depth: 0 },
                    material: '',
                    volume: 0
                }
            };
            // calculatePrice() è già chiamata alla fine di showButtonFeedback, quindi non serve qui
        }
    });

    // AGGIORNATO: Chiama updateCartCount() e calculatePrice() all'avvio
    window.updateCartCount();
    calculatePrice();
});
