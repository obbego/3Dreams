// JavaScript/commonCart.js

// Carica carrello da localStorage o crea un array vuoto
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Funzione per aggiornare il contatore nel navbar (dovrebbe essere chiamata all'inizializzazione e ogni volta che il carrello cambia)
function updateCartCount() {
    const cartCountElem = document.getElementById("cart-count");
    if (cartCountElem) { // Assicurati che l'elemento esista
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElem.textContent = totalQuantity;
    }
}

// Funzione per salvare carrello in localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount(); // Aggiorna il contatore ogni volta che il carrello viene salvato
}

// Funzione globale per aggiungere prodotti al carrello
// Questa sarà accessibile da catalogo.js
window.addToCart = function(productId) {
    // products deve essere disponibile globalmente qui (caricato da productsData.js)
    if (typeof products === 'undefined') {
        console.error("Errore: L'array 'products' non è definito. Assicurati che productsData.js sia caricato prima di commonCart.js.");
        return;
    }

    const productToAdd = products.find(p => p.id === productId);
    if (!productToAdd) {
        console.error(`Prodotto con ID ${productId} non trovato.`);
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    saveCart();
    console.log(`Prodotto aggiunto: ${productToAdd.title}. Carrello attuale:`, cart);
    // Non chiamare renderCart qui, renderCart è specifico della pagina carrello
};

// Funzione per impostare i listener sui bottoni "Aggiungi al carrello"
// Usata nel catalogo
window.setupAddToCartButtons = function() {
    document.querySelectorAll(".add-to-cart-btn").forEach(button => {
        button.onclick = null; // Rimuovi eventuali listener precedenti per evitare duplicati
        button.addEventListener("click", (event) => {
            const productId = event.target.dataset.productId;
            if (productId) {
                window.addToCart(productId);
            }
        });
    });
};

// Inizializza il contatore del carrello all'avvio della pagina
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
});