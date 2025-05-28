document.addEventListener('DOMContentLoaded', () => {
    // Riferimenti agli elementi DOM
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const previewPlaceholder = document.getElementById('previewPlaceholder');
    const fileNameSpan = document.getElementById('fileName'); // Elemento per mostrare il nome del file
    const dimensionWidth = document.getElementById('dimensionWidth');
    const dimensionHeight = document.getElementById('dimensionHeight');
    const dimensionDepth = document.getElementById('dimensionDepth');
    const calculatedVolumeSpan = document.getElementById('calculatedVolume');
    const materialSelect = document.getElementById('materialSelect');
    const estimatedPriceElem = document.getElementById('estimatedPrice');
    const addToCartButton = document.getElementById('addToCartCustomPrint');

    // Tariffe per materiale (prezzo per cm³) - Esempi, puoi modificarli
    const materialRates = {
        'PLA': 0.05,    // 5 centesimi per cm³
        'ABS': 0.07,    // 7 centesimi per cm³
        'Resina': 0.15, // 15 centesimi per cm³ (più costosa per dettaglio)
        'PETG': 0.09    // 9 centesimi per cm³
    };

    // Variabili per memorizzare i dati della stampa personalizzata
    let customPrintData = {
        id: '', // ID unico per la stampa personalizzata
        name: 'Stampa Personalizzata',
        imageUrl: '', // Base64 dell'immagine per il carrello
        dimensions: { width: 0, height: 0, depth: 0 },
        material: '',
        price: 0
    };

    // Funzione per generare un ID unico (semplice)
    function generateUniqueId() {
        return 'custom-print-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    // Funzione per calcolare il prezzo stimato
    function calculatePrice() {
        const width = parseFloat(dimensionWidth.value) || 0;
        const height = parseFloat(dimensionHeight.value) || 0;
        const depth = parseFloat(dimensionDepth.value) || 0;
        const material = materialSelect.value;

        // Aggiorna i dati della stampa personalizzata
        customPrintData.dimensions = { width, height, depth };
        customPrintData.material = material;

        const volume = width * height * depth;
        calculatedVolumeSpan.textContent = volume.toFixed(2); // Mostra il volume calcolato

        let estimatedPrice = 0;
        if (volume > 0 && materialRates[material]) {
            estimatedPrice = volume * materialRates[material];
            // Aggiungi un costo base per la lavorazione/setup
            estimatedPrice += 10; // Esempio di costo base
        }

        customPrintData.price = parseFloat(estimatedPrice.toFixed(2)); // Arrotonda a 2 decimali
        estimatedPriceElem.textContent = `$ ${customPrintData.price.toFixed(2)}`;

        // Abilita/disabilita il bottone "Aggiungi al Carrello"
        if (customPrintData.price > 0 && customPrintData.imageUrl !== '') {
            addToCartButton.disabled = false;
        } else {
            addToCartButton.disabled = true;
        }
    }

    // Event Listener per il caricamento dell'immagine
    imageUpload.addEventListener('change', function() {
        console.log("Evento 'change' dell'input file attivato."); // DEBUG: Controlla se l'evento si attiva
        const file = this.files[0];
        if (file) {
            console.log("File selezionato:", file.name, "Tipo:", file.type, "Dimensione:", file.size, "bytes"); // DEBUG: Dettagli del file
            fileNameSpan.textContent = file.name; // Mostra il nome del file
            previewPlaceholder.style.display = 'none'; // Nasconde il placeholder testuale

            const reader = new FileReader();
            reader.onload = function(e) {
                console.log("FileReader onload triggered. Base64 URL length:", e.target.result.length); // DEBUG: Controlla se questa riga appare
                imagePreview.src = e.target.result;
                customPrintData.imageUrl = e.target.result; // Salva l'immagine come Base64
                calculatePrice(); // Ricalcola il prezzo dopo il caricamento dell'immagine
            };
            reader.onerror = function(e) {
                console.error("FileReader error:", e.target.error); // DEBUG: Cattura errori del FileReader
                alert("Errore durante la lettura del file. Assicurati che sia un'immagine valida.");
                fileNameSpan.textContent = 'Nessun file selezionato';
                imagePreview.src = 'https://placehold.co/300x300/333333/FFFFFF?text=Anteprima+Immagine';
                previewPlaceholder.style.display = 'block';
                customPrintData.imageUrl = '';
                calculatePrice();
            };
            reader.readAsDataURL(file); // Legge il file come URL Base64
        } else {
            console.log("Nessun file selezionato."); // DEBUG: Nessun file
            fileNameSpan.textContent = 'Nessun file selezionato';
            imagePreview.src = 'https://placehold.co/300x300/333333/FFFFFF?text=Anteprima+Immagine';
            previewPlaceholder.style.display = 'block';
            customPrintData.imageUrl = '';
            calculatePrice(); // Ricalcola il prezzo se l'immagine viene rimossa
        }
    });

    // Event Listeners per le dimensioni e il materiale
    dimensionWidth.addEventListener('input', calculatePrice);
    dimensionHeight.addEventListener('input', calculatePrice);
    dimensionDepth.addEventListener('input', calculatePrice);
    materialSelect.addEventListener('change', calculatePrice);

    // Funzione per mostrare feedback direttamente sul bottone (copiata da singleProduct.js)
    function showButtonFeedback(button, message, isAdded) {
        const originalText = 'Aggiungi al Carrello'; // Testo originale per questo bottone
        if (!button.dataset.originalText) {
            button.dataset.originalText = originalText;
        }

        button.innerHTML = isAdded ? `<i class="fas fa-check"></i> ${message}` : message;
        button.disabled = true;
        button.style.backgroundColor = isAdded ? '#28a745' : '#ffc107'; // Verde per aggiunto, giallo per già presente
        button.style.color = '#ffffff';

        setTimeout(() => {
            button.innerHTML = button.dataset.originalText;
            button.disabled = false;
            button.style.backgroundColor = '#804AF2'; // Colore originale del bottone
            button.style.color = '#ffffff';
        }, 2000); // 2 secondi
    }

    // Event Listener per il bottone "Aggiungi al Carrello"
    addToCartButton.addEventListener('click', () => {
        if (!addToCartButton.disabled) {
            // Genera un ID unico per questa stampa personalizzata
            customPrintData.id = generateUniqueId();

            // Recupera il carrello e le stampe personalizzate da localStorage
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            let customPrints = JSON.parse(localStorage.getItem("customPrints")) || [];

            // Aggiungi l'ID della stampa personalizzata al carrello principale
            cart.push(customPrintData.id);
            localStorage.setItem("cart", JSON.stringify(cart));

            // Aggiungi i dettagli completi della stampa personalizzata a un array separato
            customPrints.push(customPrintData);
            localStorage.setItem("customPrints", JSON.stringify(customPrints));

            // Feedback visivo
            showButtonFeedback(addToCartButton, 'AGGIUNTO AL CARRELLO', true);

            // Resetta il form per una nuova stampa (opzionale)
            document.getElementById('customPrintForm').reset();
            imagePreview.src = 'https://placehold.co/300x300/333333/FFFFFF?text=Anteprima+Immagine';
            previewPlaceholder.style.display = 'block';
            fileNameSpan.textContent = 'Nessun file selezionato';
            calculatePrice(); // Resetta il prezzo
        }
    });

    // Chiamata iniziale per impostare il prezzo e lo stato del bottone
    calculatePrice();
});
