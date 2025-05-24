// ===== Utility per localStorage =====
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// ===== Aggiungi al carrello =====
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.add-to-cart');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      const name = button.dataset.name;
      const price = parseFloat(button.dataset.price);

      let cart = getCart();
      const existing = cart.find(item => item.id === id);

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ id, name, price, quantity: 1 });
      }

      saveCart(cart);
      alert(`Aggiunto "${name}" al carrello!`);
    });
  });

  // ===== Mostra carrello se presente nella pagina =====
  const cartContainer = document.getElementById('cart-container');
  if (cartContainer) {
    renderCart();
  }
});

// ===== Rendering del carrello =====
function renderCart() {
  const cart = getCart();
  const container = document.getElementById('cart-container');
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<p>Il carrello è vuoto.</p>';
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const row = document.createElement('div');
    row.className = 'cart-item mb-2';
    row.innerHTML = `
      <strong>${item.name}</strong> - €${item.price.toFixed(2)} x ${item.quantity}
      = €${itemTotal.toFixed(2)}
      <button class="btn btn-sm btn-danger ms-2 remove-item" data-id="${item.id}">Rimuovi</button>
    `;
    container.appendChild(row);
  });

  const totalRow = document.createElement('div');
  totalRow.className = 'mt-3 fw-bold';
  totalRow.textContent = `Totale: €${total.toFixed(2)}`;
  container.appendChild(totalRow);

  // Eventi per rimuovere prodotti
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      let cart = getCart();
      cart = cart.filter(item => item.id !== id);
      saveCart(cart);
      renderCart(); // Ricarica la lista
    });
  });
}
