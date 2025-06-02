document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElem = document.getElementById('cart-total');
    const emptyCartBtn = document.getElementById('empty-cart-btn');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Funzione per caricare il carrello da localStorage
    function loadCartFromLocalStorage() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        console.log("Carrello caricato da localStorage:", cart); // Debug: cosa viene caricato
        return cart;
    }

    // Funzione per salvare il carrello in localStorage
    function saveCartToLocalStorage(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log("Carrello salvato in localStorage:", cart); // Debug: cosa viene salvato
        // Aggiorna il contatore del carrello nella navbar ogni volta che il carrello viene salvato
        const cartCountElement = document.getElementById("cart-count");
        if (cartCountElement) {
            cartCountElement.textContent = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        }
    }

    let cartProducts = loadCartFromLocalStorage(); // Carica il carrello all'avvio

    // Funzione per incrementare la quantità di un prodotto nel carrello
    function incrementQuantity(productId) {
        const item = cartProducts.find(p => p.id === productId);
        if (item) {
            item.quantity++;
            saveCartToLocalStorage(cartProducts);
            renderCart();
        }
    }

    // Funzione per decrementare la quantità di un prodotto nel carrello
    function decrementQuantity(productId) {
        const item = cartProducts.find(p => p.id === productId);
        if (item && item.quantity > 1) {
            item.quantity--;
            saveCartToLocalStorage(cartProducts);
            renderCart();
        } else if (item && item.quantity === 1) {
            removeProductFromCart(productId);
        }
    }

    // Funzione per rimuovere un prodotto dal carrello
    function removeProductFromCart(productId) {
        cartProducts = cartProducts.filter(p => p.id !== productId);
        saveCartToLocalStorage(cartProducts);
        renderCart();
    }


    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cartProducts.length === 0) {
            const emptyRow = document.createElement('tr');
            const emptyTd = document.createElement('td');
            emptyTd.colSpan = 5;
            emptyTd.className = 'text-center text-white'; 
            emptyTd.textContent = 'Il carrello è vuoto.';
            emptyRow.appendChild(emptyTd);
            cartItemsContainer.appendChild(emptyRow);
        } else {
            cartProducts.forEach((prod) => {
                const row = document.createElement('tr');

                // Immagine e Nome prodotto (usiamo prod.name e prod.image)
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


                // Prezzo unitario
                const prezzoTd = document.createElement('td');
                // *** CORREZIONE PER toFixed() QUI ***
                // Controlla se prod.price è un numero prima di chiamare toFixed
                prezzoTd.textContent = `€ ${(typeof prod.price === 'number' ? prod.price.toFixed(2) : 'N/A')}`;
                prezzoTd.classList.add('text-white');

                // Quantità con bottoni +/-
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
                    saveCartToLocalStorage(cartProducts); 
                    renderCart(); 
                });

                const incrementBtn = document.createElement('button');
                incrementBtn.className = 'btn btn-outline-secondary btn-qty-control';
                incrementBtn.innerHTML = '<i class="fas fa-plus"></i>';
                incrementBtn.addEventListener('click', () => incrementQuantity(prod.id));

                qtyControlDiv.appendChild(decrementBtn);
                qtyControlDiv.appendChild(inputQty);
                qtyControlDiv.appendChild(incrementBtn);
                quantitaTd.appendChild(qtyControlDiv);

                // Totale prodotto
                // Assicurati che price e quantity siano numeri prima di moltiplicare
                const totaleProdotto = (typeof prod.price === 'number' ? prod.price : 0) * (typeof prod.quantity === 'number' ? prod.quantity : 0);
                total += totaleProdotto;
                const totaleTd = document.createElement('td');
                totaleTd.textContent = `€ ${totaleProdotto.toFixed(2)}`;
                totaleTd.classList.add('text-white');

                // Bottone rimuovi
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
        cartProducts.length = 0; 
        saveCartToLocalStorage(cartProducts); 
        renderCart(); 
    });

    checkoutBtn.addEventListener('click', () => {
        if (cartProducts.length === 0) {
            alert('Il carrello è vuoto!');
        } else {
            alert('Procedo all\'acquisto!');
        }
    });

    renderCart();

    // Aggiorna il contatore della navbar all'avvio della pagina carrello.html
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        cartCountElement.textContent = cartProducts.reduce((sum, item) => sum + (item.quantity || 0), 0);
    }
});