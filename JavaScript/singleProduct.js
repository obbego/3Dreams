// JavaScript/singleProduct.js

document.addEventListener('DOMContentLoaded', () => {
  // Ottieni l'ID del prodotto dal parametro di query nell'URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  // Recupera gli elementi HTML
  const productBrandElem = document.getElementById('product-brand');
  const productTitleElem = document.getElementById('product-title');
  const productImageElem = document.getElementById('product-image');
  const productDescriptionElem = document.getElementById('product-description');
  const productPriceElem = document.getElementById('product-price');
  const addToCartButton = document.getElementById('add-to-cart-single-product');
  // NUOVO: Ottieni il riferimento all'elemento del messaggio
  const cartNotificationMessage = document.getElementById('cart-notification-message');


  // Funzione per mostrare un messaggio temporaneo
  function showNotification(message, isSuccess = true) {
    cartNotificationMessage.textContent = message;
    cartNotificationMessage.style.display = 'block'; // Mostra il messaggio
    cartNotificationMessage.classList.remove('text-success', 'text-warning'); // Rimuovi classi precedenti

    if (isSuccess) {
      cartNotificationMessage.classList.add('text-success'); // Colore verde per successo
    } else {
      cartNotificationMessage.classList.add('text-warning'); // Colore giallo/arancione per avviso
    }

    // Nascondi il messaggio dopo 3 secondi
    setTimeout(() => {
      cartNotificationMessage.style.display = 'none';
      cartNotificationMessage.textContent = ''; // Pulisci il testo
    }, 3000);
  }


  // Verifica che i dati dei prodotti siano caricati (dall'array 'products' in productsData.js)
  // e che l'ID del prodotto esista
  if (productId && typeof products !== 'undefined') {
    // Trova il prodotto nell'array 'products'
    const product = products.find(p => p.id === productId);

    if (product) {
      // Popola gli elementi HTML con i dati del prodotto
      productBrandElem.textContent = product.brand;
      productTitleElem.textContent = product.title;
      productImageElem.src = product.image;
      productImageElem.alt = product.title;
      // Per la descrizione, sostituisci i caratteri di nuova riga con tag <p> per un HTML corretto
      // Questo crea un paragrafo per ogni riga di testo nella descrizione
      productDescriptionElem.innerHTML = `<p>${product.description.replace(/\n/g, '</p><p>')}</p>`;
      productPriceElem.textContent = `$ ${product.price}`;

      // Aggiungi event listener per il pulsante "Aggiungi al carrello"
      addToCartButton.addEventListener('click', () => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (!cart.includes(productId)) {
          cart.push(productId);
          localStorage.setItem("cart", JSON.stringify(cart));
          // Sostituisci l'alert con la funzione di notifica personalizzata
          showNotification(`${product.title} aggiunto al carrello!`, true);
          // Opzionale: puoi aggiungere qui la logica per aggiornare il conteggio del carrello nella navbar
          // se il conteggio è un elemento separato accessibile globalmente o tramite un evento.
        } else {
          // Sostituisci l'alert con la funzione di notifica personalizzata
          showNotification(`${product.title} è già nel carrello.`, false);
        }
      });

    } else {
      // Caso in cui il prodotto non viene trovato nell'array 'products'
      console.error('Prodotto non trovato per l\'ID:', productId);
      // Puoi reindirizzare a una pagina 404 o al catalogo
      // window.location.href = 'catalogo.html';
      // Oppure mostrare un messaggio all'utente
      productTitleElem.textContent = 'Prodotto non disponibile';
      productDescriptionElem.textContent = 'Siamo spiacenti, il prodotto richiesto non è stato trovato.';
      addToCartButton.style.display = 'none'; // Nasconde il pulsante del carrello se il prodotto non esiste
    }
  } else {
    // Caso in cui l'ID del prodotto non è presente nell'URL o l'array 'products' non è definito
    console.error('ID del prodotto non trovato nell\'URL o i dati dei prodotti non sono stati caricati.');
    // Puoi reindirizzare a una pagina 404 o al catalogo
    // window.location.href = 'catalogo.html';
    // Oppure mostrare un messaggio all'utente
    productTitleElem.textContent = 'Errore di caricamento';
    productDescriptionElem.textContent = 'Non è stato possibile caricare i dettagli del prodotto. Riprova più tardi o torna al catalogo.';
    addToCartButton.style.display = 'none';
  }
});