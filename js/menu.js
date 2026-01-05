document.addEventListener('DOMContentLoaded', function () {
    const itemsRow = document.getElementById('itemsRow');
    const search = document.getElementById('searchInput');
    const category = document.getElementById('categoryFilter');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    const clearBtn = document.getElementById('clearFilters');

    let allItems = [];

    function render(items) {
        itemsRow.innerHTML = '';
        if (!items.length) {
            itemsRow.innerHTML = '<p class="text-muted">No items found.</p>';
            return;
        }
        items.forEach(it => {
            const col = document.createElement('div'); col.className = 'col';
            col.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <img src="${it.image||'images/products/pumpkinpiesmall.jpg'}" class="card-img-top" style="height:180px;object-fit:cover;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${it.name}</h5>
                        <p class="card-text text-muted mb-2">${it.category||''}</p>
                        <p class="card-text">${(it.description||'').slice(0,100)}</p>
                        <div class="mt-auto d-flex justify-content-between align-items-center">
                            <strong>$${(parseFloat(it.price)||0).toFixed(2)}</strong>
                            <div>
                                <a class="btn btn-sm btn-outline-primary" href="details.html?id=${it.id}">Details</a>
                                <button class="btn btn-sm btn-success ms-1" data-id="${it.id}">Add to cart</button>
                            </div>
                        </div>
                    </div>
                </div>`;
            itemsRow.appendChild(col);
        });
    }

    function applyFilters() {
        const q = search.value.trim().toLowerCase();
        const cat = category.value;
        const min = parseFloat(minPrice.value) || 0;
        const max = parseFloat(maxPrice.value) || Infinity;
        const filtered = allItems.filter(it => {
            if (q && !(it.name||'').toLowerCase().includes(q)) return false;
            if (cat && (it.category||'') !== cat) return false;
            const price = parseFloat(it.price) || 0;
            if (price < min || price > max) return false;
            return true;
        });
        render(filtered);
    }

    function load() {
        UI.showSpinner('Loading items...');
        window.API.getItems().then(items => {
            allItems = items;
            render(items);
        }).catch(err => { itemsRow.innerHTML = '<p class="text-danger">Error loading items</p>'; console.error(err); UI.showToast('error', 'Error loading items'); })
        .finally(() => UI.hideSpinner());
    }

    itemsRow.addEventListener('click', function (e) {
        if (e.target.tagName === 'BUTTON' && e.target.dataset.id) {
            const id = e.target.dataset.id;
            const item = allItems.find(x => x.id == id);
            if (!item) return UI.showToast('error', 'Item not found');
            addToCart(item);
            UI.showToast('success', 'Added to cart');
        }
    });

    function addToCart(item) {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find(c => c.id == item.id);
        if (existing) existing.qty = (existing.qty || 1) + 1;
        else cart.push({ id: item.id, name: item.name, price: parseFloat(item.price)||0, qty: 1, image: item.image });
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    search.addEventListener('input', () => applyFilters());
    category.addEventListener('change', () => applyFilters());
    minPrice.addEventListener('input', () => applyFilters());
    maxPrice.addEventListener('input', () => applyFilters());
    clearBtn.addEventListener('click', () => { search.value=''; category.value=''; minPrice.value=''; maxPrice.value=''; load(); });

    load();
});
