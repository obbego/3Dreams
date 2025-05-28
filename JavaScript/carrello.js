// Esempio dati fittizi (da sostituire con dati reali o caricati dal server/localStorage)
const cartProducts = [
    {id: 1, nome: "Prodotto A", prezzo: 15.99, quantita: 2},
    {id: 2, nome: "Prodotto B", prezzo: 9.99, quantita: 1},
    {id: 3, nome: "Prodotto C", prezzo: 20.50, quantita: 3},
  ];
  
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotalElem = document.getElementById('cart-total');
  const emptyCartBtn = document.getElementById('empty-cart-btn');
  const checkoutBtn = document.getElementById('checkout-btn');
  
  function renderCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
  
    cartProducts.forEach((prod, index) => {
      const row = document.createElement('tr');
  
      // prodotto
      const nomeTd = document.createElement('td');
      nomeTd.textContent = prod.nome;
  
      // prezzo unitario
      const prezzoTd = document.createElement('td');
      prezzoTd.textContent = `€ ${prod.prezzo.toFixed(2)}`;
  
      // quantità input
      const quantitaTd = document.createElement('td');
      const inputQty = document.createElement('input');
      inputQty.type = 'number';
      inputQty.min = 1;
      inputQty.value = prod.quantita;
      inputQty.className = 'qty-input';
      inputQty.addEventListener('change', (e) => {
        const val = parseInt(e.target.value);
        if (val < 1 || isNaN(val)) {
          e.target.value = prod.quantita;
          return;
        }
        prod.quantita = val;
        renderCart();
      });
      quantitaTd.appendChild(inputQty);
  
      // totale prodotto
      const totaleProdotto = prod.prezzo * prod.quantita;
      total += totaleProdotto;
      const totaleTd = document.createElement('td');
      totaleTd.textContent = `€ ${totaleProdotto.toFixed(2)}`;
  
      // bottone rimuovi
      const removeTd = document.createElement('td');
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
      removeBtn.addEventListener('click', () => {
        cartProducts.splice(index, 1);
        renderCart();
      });
      removeTd.appendChild(removeBtn);
  
      row.append(nomeTd, prezzoTd, quantitaTd, totaleTd, removeTd);
      cartItemsContainer.appendChild(row);
    });
  
    cartTotalElem.textContent = total.toFixed(2);
  }
  
  emptyCartBtn.addEventListener('click', () => {
    cartProducts.length = 0;
    renderCart();
  });
  
  checkoutBtn.addEventListener('click', () => {
    if (cartProducts.length === 0) {
      alert('Il carrello è vuoto!');
    } else {
      alert('Procedo all\'acquisto!');
      // Qui puoi aggiungere la logica di checkout o reindirizzare
    }
  });
  
  // All'avvio
  renderCart();
  