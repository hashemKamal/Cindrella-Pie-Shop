document.addEventListener('DOMContentLoaded', function () {
    const tbody = document.querySelector('#itemsTable tbody');

    function load() {
        tbody.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';
        window.API.getItems().then(items => {
            tbody.innerHTML = '';
            items.forEach(it => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${it.id}</td>
                    <td><img src="${it.image||'images/products/pumpkinpiesmall.jpg'}" width="60"></td>
                    <td>${it.name}</td>
                    <td>${it.category||''}</td>
                    <td>$${(parseFloat(it.price)||0).toFixed(2)}</td>
                    <td>
                        <a class="btn btn-sm btn-outline-primary" href="edit-item.html?id=${it.id}">Edit</a>
                        <button class="btn btn-sm btn-danger ms-1" data-id="${it.id}">Delete</button>
                    </td>`;
                tbody.appendChild(tr);
            });
        }).catch(err => { tbody.innerHTML = '<tr><td colspan="6">Error loading items</td></tr>'; console.error(err); });
    }

    tbody.addEventListener('click', function (e) {
        if (e.target.tagName === 'BUTTON' && e.target.dataset.id) {
            const id = e.target.dataset.id;
            UI.confirm('Delete item', 'Delete item #' + id + '?').then(ok => {
                if (!ok) return;
                UI.showSpinner('Deleting...');
                window.API.deleteItem(id).then(()=>{ UI.showToast('success','Deleted'); load(); }).catch(err=>UI.showToast('error','Error: '+err.message)).finally(()=>UI.hideSpinner());
            });
        }
    });

    load();
});
