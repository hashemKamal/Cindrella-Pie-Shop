
(function () {
  // Using the mockapi.io base URL provided by you. This base URL points to the
  // project namespace; API helper will call endpoints like GET /items ->
  const BASE_URL = 'https://68fbb09b94ec96066026ea9d.mockapi.io/menu';

    const client = axios.create({ baseURL: BASE_URL, timeout: 10000 });

    window.API = {
        getItems(params) { return client.get('/items', { params }).then(r => r.data); },
        getItem(id) { return client.get(`/items/${id}`).then(r => r.data); },
        createItem(data) { return client.post('/items', data).then(r => r.data); },
        updateItem(id, data) { return client.put(`/items/${id}`, data).then(r => r.data); },
        deleteItem(id) { return client.delete(`/items/${id}`).then(r => r.data); }
    };
})();
