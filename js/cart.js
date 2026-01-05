document.addEventListener('DOMContentLoaded', function () {
    const area = document.getElementById('cartArea');
    function render() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (!cart.length) { area.innerHTML = '<p>Your cart is empty. <a href="menu.html">Browse the menu</a></p>'; return; }
        let total = 0;
        area.innerHTML = '<div class="table-responsive"><table class="table"><thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th><th></th></tr></thead><tbody id="cartBody"></tbody></table></div>';
        const tbody = document.getElementById('cartBody');
        cart.forEach((c, i) => {
            const tr = document.createElement('tr');
            const lineTotal = (c.price || 0) * (c.qty || 1);
            total += lineTotal;
            tr.innerHTML = `
                <td>${c.name}</td>
                <td><input type="number" min="1" value="${c.qty}" data-index="${i}" class="form-control form-control-sm qty"></td>
                <td>$${(c.price||0).toFixed(2)}</td>
                <td>$${lineTotal.toFixed(2)}</td>
                <td><button class="btn btn-sm btn-danger remove" data-index="${i}">Remove</button></td>`;
            tbody.appendChild(tr);
        });
        const footer = document.createElement('div');
        footer.className = 'mt-3 text-end';
        footer.innerHTML = `<h5>Total: $${total.toFixed(2)}</h5><a href="checkout.html" class="btn btn-success">Checkout</a>`;
        area.appendChild(footer);
        tbody.addEventListener('change', function (e) {
            if (e.target.classList.contains('qty')) {
                const idx = e.target.dataset.index; const v = parseInt(e.target.value) || 1;
                const cart = JSON.parse(localStorage.getItem('cart') || '[]'); cart[idx].qty = v; localStorage.setItem('cart', JSON.stringify(cart)); render();
            }
        });
        tbody.addEventListener('click', function (e) {
            if (e.target.classList.contains('remove')) {
                const idx = e.target.dataset.index; const cart = JSON.parse(localStorage.getItem('cart') || '[]'); cart.splice(idx,1); localStorage.setItem('cart', JSON.stringify(cart)); render();
            }
        });
    }
    render();
});
