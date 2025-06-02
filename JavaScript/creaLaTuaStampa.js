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
    const cartCountElement = document.getElementById('cart-count'); 

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

    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cartCountElement.textContent = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    }

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

        estimatedPriceElem.textContent = `$ ${currentCustomPrintConfig.price.toFixed(2)}`;

        // LOGICA DI VALIDAZIONE E STILE DEL BOTTONE
        const isImageUploaded = currentCustomPrintConfig.image !== '';
        const isMaterialSelected = currentCustomPrintConfig.details.material !== '';
        const areDimensionsValid = width > 0 && height > 0 && depth > 0;
        const isPriceCalculated = currentCustomPrintConfig.price > 0;

        if (isImageUploaded && isMaterialSelected && areDimensionsValid && isPriceCalculated) {
            addToCartButton.disabled = false;
            addToCartButton.classList.add('active-button'); // AGGIUNGI CLASSE
        } else {
            addToCartButton.disabled = true;
            addToCartButton.classList.remove('active-button'); // RIMUOVI CLASSE
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
                alert("Errore durante la lettura del file. Assicurati che sia un'immagine valida.");
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

        button.innerHTML = isAdded ? `<i class="fas fa-check"></i> ${message}` : message;
        button.disabled = true; // Il bottone è disabilitato durante il feedback
        // Rimuoviamo la classe active-button durante il feedback, per mostrare solo il colore di feedback
        button.classList.remove('active-button'); 
        button.style.backgroundColor = isAdded ? '#28a745' : '#ffc107'; 
        button.style.color = '#ffffff';

        setTimeout(() => {
            button.innerHTML = button.dataset.originalText;
            button.style.backgroundColor = ''; 
            button.style.color = '';
            calculatePrice(); // Questa chiamata ripristinerà lo stato e lo stile corretto del bottone
        }, 2000); 
    }

    addToCartButton.addEventListener('click', (event) => {
        event.preventDefault(); 

        if (!addToCartButton.disabled) {
            currentCustomPrintConfig.id = generateUniqueId();
            
            const itemToAdd = { ...currentCustomPrintConfig }; 

            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            cart.push(itemToAdd);
            localStorage.setItem("cart", JSON.stringify(cart));

            showButtonFeedback(addToCartButton, 'AGGIUNTO AL CARRELLO', true);

            updateCartCount();

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

    updateCartCount(); 
    calculatePrice(); 
});