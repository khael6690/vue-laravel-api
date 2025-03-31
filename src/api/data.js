import api from './index'

export default {
    getItems() {
        return api.get('/items')
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