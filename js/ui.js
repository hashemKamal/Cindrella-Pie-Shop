// UI helper: toasts, confirm modal, spinner overlay using Bootstrap 5
(function () {
    const UI = {};

    function ensureToastContainer() {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.style.position = 'fixed';
            container.style.top = '1rem';
            container.style.right = '1rem';
            container.style.zIndex = '1080';
            document.body.appendChild(container);
        }
        return container;
    }

    UI.showToast = function (type, message, title) {
        const container = ensureToastContainer();
        const toast = document.createElement('div');
        toast.className = 'toast align-items-center text-bg-' + (type === 'error' ? 'danger' : (type === 'success' ? 'success' : 'secondary')) + ' border-0';
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        toast.style.minWidth = '220px';
        toast.innerHTML = `
            <div class="d-flex">
              <div class="toast-body">${title ? '<strong>'+title+'</strong><br>' : ''}${message}</div>
              <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>`;
        container.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast, { delay: 4000 });
        bsToast.show();
        toast.addEventListener('hidden.bs.toast', () => toast.remove());
        return bsToast;
    };

    // Confirm modal (returns Promise<boolean>)
    UI.confirm = function (title, message) {
        return new Promise((resolve) => {
            // create modal DOM
            const modalId = 'uiConfirmModal';
            let modal = document.getElementById(modalId);
            if (modal) modal.remove();
            modal = document.createElement('div');
            modal.id = modalId;
            modal.className = 'modal fade';
            modal.tabIndex = -1;
            modal.innerHTML = `
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">${title||'Confirm'}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body"><p>${message||''}</p></div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" id="uiConfirmOk">Yes</button>
                  </div>
                </div>
              </div>`;
            document.body.appendChild(modal);
            const bsModal = new bootstrap.Modal(modal, { backdrop: 'static' });
            modal.addEventListener('hidden.bs.modal', () => { resolve(false); modal.remove(); });
            modal.querySelector('#uiConfirmOk').addEventListener('click', () => { resolve(true); bsModal.hide(); });
            bsModal.show();
        });
    };

    // Spinner overlay
    UI.showSpinner = function (message) {
        let overlay = document.getElementById('uiSpinnerOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'uiSpinnerOverlay';
            overlay.style.position = 'fixed';
            overlay.style.top = '0'; overlay.style.left = '0'; overlay.style.right = '0'; overlay.style.bottom = '0';
            overlay.style.zIndex = '1070';
            overlay.style.background = 'rgba(0,0,0,0.35)';
            overlay.innerHTML = `<div class="d-flex h-100 align-items-center justify-content-center"><div class="text-center text-white"><div class="spinner-border text-light" role="status"><span class="visually-hidden">Loading...</span></div><div class="mt-2">${message||'Loading...'}</div></div></div>`;
            document.body.appendChild(overlay);
        }
        overlay.style.display = 'block';
    };

    UI.hideSpinner = function () {
        const overlay = document.getElementById('uiSpinnerOverlay');
        if (overlay) overlay.style.display = 'none';
    };

    window.UI = UI;
})();
