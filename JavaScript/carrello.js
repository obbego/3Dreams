// JavaScript/carrello.js

// Nota: cart, updateCartCount, saveCart, addToCart sono ora definiti in commonCart.js

document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalDisplay = document.getElementById("cart-total");
    const clearCartBtn = document.getElementById("clear-cart");

    // Funzione per disegnare carrello nel DOM
    function renderCart() {
        cartItemsContainer.innerHTML = "";

        // products deve essere disponibile globalmente qui (caricato da productsData.js)
        if (typeof products === 'undefined') {
            cartItemsContainer.innerHTML = "<p>Errore: Impossibile caricare i dati dei prodotti.</p>";
            cartTotalDisplay.textContent = "";
            return;
        }

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<p>Il carrello è vuoto.</p>";
            cartTotalDisplay.textContent = "";
            return;
        }

        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (!product) {
                console.warn(`Prodotto con ID ${item.id} non trovato nei dati.`);
                return; // Salta questo articolo se il prodotto non è trovato
            }

            const itemDiv = document.createElement("div");
            itemDiv.className = "cart-item d-flex align-items-center mb-3";

            itemDiv.innerHTML = `
                <img src="${product.image}" alt="${product.title}" style="width:80px; height:auto; margin-right:15px;" />
                <div class="flex-grow-1">
                    <h5>${product.title}</h5>
                    <p>Prezzo unitario: €${product.price.toFixed(2)}</p>
                    <p>Quantità:
                        <button class="btn btn-sm btn-secondary decrease-qty" data-id="${item.id}">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-secondary increase-qty" data-id="${item.id}">+</button>
                    </p>
                    <p>Totale: €${(product.price * item.quantity).toFixed(2)}</p>
                </div>
                <button class="btn btn-danger btn-sm remove-item" data-id="${item.id}">Rimuovi</button>
            `;

            cartItemsContainer.appendChild(itemDiv);
        });

        // Calcola totale carrello
        const total = cart.reduce((sum, item) => {
            const product = products.find(p => p.id === item.id);
            return sum + (product ? product.price * item.quantity : 0);
        }, 0);

        cartTotalDisplay.textContent = `Totale carrello: €${total.toFixed(2)}`;
    }

    // Eventi per i bottoni +, -, rimuovi
    cartItemsContainer.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (!id) return;

        if (e.target.classList.contains("increase-qty")) {
            cart = cart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
            saveCart();
            renderCart();
        }

        if (e.target.classList.contains("decrease-qty")) {
            cart = cart.map(item => {
                if (item.id === id) {
                    const newQty = item.quantity - 1;
                    return newQty > 0 ? { ...item, quantity: newQty } : null;
                }
                return item;
            }).filter(Boolean); // Rimuove gli elementi null (quantità 0)
            saveCart();
            renderCart();
        }

        if (e.target.classList.contains("remove-item")) {
            cart = cart.filter(item => item.id !== id);
            saveCart();
            renderCart();
        }
    });

    // Svuota carrello
    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", () => {
            cart = [];
            saveCart();
            renderCart();
        });
    }

    // Inizializza il render del carrello quando la pagina è pronta
    renderCart();
});