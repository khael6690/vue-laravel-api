import api from './index'

export default {
    getItems(params) {
        const safeParams = {
            ...params,
            search: params.search ? String(params.search) : undefined
        }

        return api.get('/items', {
            params: safeParams
        });
    },
    getItem(id) {
        return api.get(`/items/${id}`)
    },
    createItem(data) {
        return api.post('/items', data)
    },
    updateItem(id, data) {
        return api.put(`/items/${id}`, data)
    },
    deleteItem(id) {
        return api.delete(`/items/${id}`)
    }
}