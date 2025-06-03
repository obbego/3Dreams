document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElem = document.getElementById('cart-total');
    const emptyCartBtn = document.getElementById('empty-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartFeedbackMessage = document.getElementById('cart-feedback-message');

    let cartProducts = window.getUserCart();

    // Funzione per mostrare i messaggi di feedback stilizzati
    function showCartFeedback(message, type = 'info') { // type: 'success', 'warning', 'info'
        cartFeedbackMessage.textContent = message;
        cartFeedbackMessage.classList.remove('success', 'warning'); // Rimuovi classi precedenti

        if (type === 'success') {
            cartFeedbackMessage.classList.add('success');
        } else if (type === 'warning') {
            cartFeedbackMessage.classList.add('warning');
        }
        // Per 'info' non aggiungiamo classi specifiche, userà lo stile predefinito

        cartFeedbackMessage.classList.add('show'); // Rendi visibile

        setTimeout(() => {
            cartFeedbackMessage.classList.remove('show'); // Nascondi dopo un po'
            setTimeout(() => {
                cartFeedbackMessage.textContent = ''; // Pulisci il testo dopo la transizione
            }, 500); // Deve essere uguale alla durata della transizione CSS
        }, 3000); // Messaggio visibile per 3 secondi
    }

    // Funzione per incrementare la quantità di un prodotto nel carrello
    function incrementQuantity(productId) {
        const item = cartProducts.find(p => p.id === productId);
        if (item) {
            item.quantity++;
            window.saveUserCart(cartProducts);
            renderCart();
            window.updateCartCount();
        }
    }

    // Funzione per decrementare la quantità di un prodotto nel carrello
    function decrementQuantity(productId) {
        const item = cartProducts.find(p => p.id === productId);
        if (item && item.quantity > 1) {
            item.quantity--;
            window.saveUserCart(cartProducts);
            renderCart();
            window.updateCartCount();
        } else if (item && item.quantity === 1) {
            removeProductFromCart(productId);
        }
    }

    // Funzione per rimuovere un prodotto dal carrello
    function removeProductFromCart(productId) {
        cartProducts = cartProducts.filter(p => p.id !== productId);
        window.saveUserCart(cartProducts);
        renderCart();
        window.updateCartCount();
        showCartFeedback('Prodotto rimosso dal carrello.', 'info');
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cartProducts.length === 0) {
            const emptyRow = document.createElement('tr');
            const emptyTd = document.createElement('td');
            emptyTd.colSpan = 5;
            emptyTd.className = 'text-center cart-empty-message'; // Usa la classe per lo stile
            emptyTd.textContent = 'Il carrello è vuoto.';
            emptyRow.appendChild(emptyTd);
            cartItemsContainer.appendChild(emptyRow);
        } else {
            cartProducts.forEach((prod) => {
                const row = document.createElement('tr');

                const productInfoTd = document.createElement('td');
                const productDiv = document.createElement('div');
                productDiv.classList.add('d-flex', 'align-items-center');

                const img = document.createElement('img');
                img.src = prod.image || 'assets/placeholder.jpg';
                img.alt = prod.name;
                img.style.width = '50px';
                img.style.height = '50px';
                img.style.marginRight = '10px';
                img.style.borderRadius = '5px';
                img.style.objectFit = 'cover';

                const productNameSpan = document.createElement('span');
                productNameSpan.textContent = prod.name;
                productNameSpan.classList.add('text-white');

                productDiv.appendChild(img);
                productDiv.appendChild(productNameSpan);
                productInfoTd.appendChild(productDiv);

                const prezzoTd = document.createElement('td');
                prezzoTd.textContent = `€ ${(typeof prod.price === 'number' ? prod.price.toFixed(2) : 'N/A')}`;
                prezzoTd.classList.add('text-white');

                const quantitaTd = document.createElement('td');
                const qtyControlDiv = document.createElement('div');
                qtyControlDiv.classList.add('input-group', 'input-group-sm');

                const decrementBtn = document.createElement('button');
                decrementBtn.className = 'btn btn-outline-secondary btn-qty-control';
                decrementBtn.innerHTML = '<i class="fas fa-minus"></i>';
                decrementBtn.addEventListener('click', () => decrementQuantity(prod.id));

                const inputQty = document.createElement('input');
                inputQty.type = 'number';
                inputQty.min = 1;
                inputQty.value = prod.quantity;
                inputQty.className = 'form-control text-center bg-dark text-white qty-input';
                inputQty.style.width = '60px';
                inputQty.addEventListener('change', (e) => {
                    const val = parseInt(e.target.value);
                    if (isNaN(val) || val < 1) {
                        e.target.value = prod.quantity;
                        return;
                    }
                    prod.quantity = val;
                    window.saveUserCart(cartProducts);
                    renderCart();
                    window.updateCartCount();
                });

                const incrementBtn = document.createElement('button');
                incrementBtn.className = 'btn btn-outline-secondary btn-qty-control';
                incrementBtn.innerHTML = '<i class="fas fa-plus"></i>';
                incrementBtn.addEventListener('click', () => incrementQuantity(prod.id));

                qtyControlDiv.appendChild(decrementBtn);
                qtyControlDiv.appendChild(inputQty);
                qtyControlDiv.appendChild(incrementBtn);
                quantitaTd.appendChild(qtyControlDiv);

                const totaleProdotto = (typeof prod.price === 'number' ? prod.price : 0) * (typeof prod.quantity === 'number' ? prod.quantity : 0);
                total += totaleProdotto;
                const totaleTd = document.createElement('td');
                totaleTd.textContent = `€ ${totaleProdotto.toFixed(2)}`;
                totaleTd.classList.add('text-white');

                const removeTd = document.createElement('td');
                const removeBtn = document.createElement('button');
                removeBtn.className = 'btn btn-danger remove-btn';
                removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
                removeBtn.addEventListener('click', () => {
                    removeProductFromCart(prod.id);
                });
                removeTd.appendChild(removeBtn);

                row.append(productInfoTd, prezzoTd, quantitaTd, totaleTd, removeTd);
                cartItemsContainer.appendChild(row);
            });
        }

        cartTotalElem.textContent = total.toFixed(2);
    }

    emptyCartBtn.addEventListener('click', () => {
        if (cartProducts.length > 0) {
            cartProducts.length = 0;
            window.saveUserCart(cartProducts);
            renderCart();
            window.updateCartCount();
            showCartFeedback('Il carrello è stato svuotato!', 'warning');
        } else {
            showCartFeedback('Il carrello è già vuoto!', 'info');
        }
    });

    checkoutBtn.addEventListener('click', () => {
        if (cartProducts.length === 0) {
            showCartFeedback('Il carrello è vuoto! Aggiungi prodotti prima di procedere.', 'warning');
        } else {
            showCartFeedback('Procedo all\'acquisto!', 'success'); // Messaggio senza la nota di implementazione
            // Qui aggiungi il codice per svuotare il carrello DOPO un acquisto simulato
            cartProducts.length = 0;
            window.saveUserCart(cartProducts);
            renderCart();
            window.updateCartCount();
        }
    });

    renderCart(); // Renderizza il carrello all'avvio della pagina
    window.updateCartCount(); // Assicurati che il contatore nella navbar sia aggiornato all'avvio
});
