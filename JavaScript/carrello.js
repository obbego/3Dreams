// Carrello inizialmente vuoto
const cartProducts = [];

const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElem = document.getElementById('cart-total');
const emptyCartBtn = document.getElementById('empty-cart-btn');
const checkoutBtn = document.getElementById('checkout-btn');

function renderCart() {
  cartItemsContainer.innerHTML = '';
  let total = 0;

  if (cartProducts.length === 0) {
    const emptyRow = document.createElement('tr');
    const emptyTd = document.createElement('td');
    emptyTd.colSpan = 5;
    emptyTd.className = 'text-center';
    emptyTd.textContent = 'Il carrello è vuoto.';
    emptyRow.appendChild(emptyTd);
    cartItemsContainer.appendChild(emptyRow);
  } else {
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
  }

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
    // Logica di checkout qui
  }
});

// All'avvio
renderCart();
