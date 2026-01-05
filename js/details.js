document.addEventListener('DOMContentLoaded', function () {
    const content = document.getElementById('content');
    const qs = new URLSearchParams(location.search);
    const id = qs.get('id');
    if (!id) { content.innerHTML = '<p class="text-danger">No item id provided</p>'; return; }

    UI.showSpinner('Loading item...');
    window.API.getItem(id).then(it => {
        content.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <img src="${it.image||'images/products/pumpkinpie.jpg'}" class="img-fluid rounded">
                </div>
                <div class="col-md-6">
                    <h1>${it.name}</h1>
                    <p class="text-muted">${it.category||''}</p>
                    <h3>$${(parseFloat(it.price)||0).toFixed(2)}</h3>
                    <p>${it.description||''}</p>
                    <button id="addBtn" class="btn btn-success">Add to cart</button>
                </div>
            </div>`;
        document.getElementById('addBtn').addEventListener('click', ()=>{
            const cart = JSON.parse(localStorage.getItem('cart')||'[]');
            const existing = cart.find(c=>c.id==it.id);
            if(existing) existing.qty = (existing.qty||1)+1; else cart.push({id: it.id, name: it.name, price: parseFloat(it.price)||0, qty:1, image: it.image});
            localStorage.setItem('cart', JSON.stringify(cart));
            UI.showToast('success', 'Added to cart');
        });
    }).catch(err => { content.innerHTML = '<p class="text-danger">Error loading item</p>'; console.error(err); });
    

});
