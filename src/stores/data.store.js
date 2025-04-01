import { defineStore } from 'pinia'
import dataApi from '../api/data'

export const useDataStore = defineStore('data', {
    state: () => ({
        items: [],
        pagination: {
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 0,
            links: {}
        },
        sortField: 'id',
        sortDirection: 'asc',
        searchQuery: '',
        currentItem: null,
        isLoading: false,
        error: null
    }),
    actions: {
        async fetchItems({ page = 1, per_page = 10, sort_by = null, sort_direction = null, search = '' } = {}) {
            this.isLoading = true;
            try {
                // Update state sort di store jika ada parameter yang dikirim
                if (sort_by) this.sortField = sort_by;
                if (sort_direction) this.sortDirection = sort_direction;

                const response = await dataApi.getItems({
                    page,
                    per_page,
                    sort_by: sort_by === 'index' ? 'id' : sort_by,  // Gunakan parameter atau fallback ke state
                    sort_direction: sort_direction || this.sortDirection,
                    search: typeof search === 'string' ? search : String(search)
                });

                // Jika sorting by index, atur ulang items berdasarkan nomor urut
                this.items = sort_by === 'index'
                    ? this.sortByIndex(response.data.data, sort_direction)
                    : response.data.data;
                this.pagination = {
                    current_page: response.data.meta.current_page,
                    last_page: response.data.meta.last_page,
                    per_page: response.data.meta.per_page,
                    total: response.data.meta.total
                };
            } catch (error) {
                this.error = error.response?.data?.message || error.message;
            } finally {
                this.isLoading = false;
            }
        },

        sortByIndex(items, direction) {
            return [...items].sort((a, b) => {
                // Karena index dihitung dari posisi pagination,
                // kita perlu mempertahankan urutan asli dari backend
                // dan hanya mengubah tampilan saja
                return direction === 'asc' ? 1 : -1;
            });
        },
        async createItem(itemData) {
            this.isLoading = true
            try {
                const { data } = await dataApi.createItem(itemData)
                this.items = [data, ...this.items];
                return data
            } catch (error) {
                this.error = error.response?.data?.message || error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },
        async updateItem(id, itemData) {
            this.isLoading = true
            try {
                const { data } = await dataApi.updateItem(id, itemData)
                const index = this.items.findIndex(item => item.id === id)
                if (index !== -1) {
                    this.items.splice(index, 1, data)
                }
                this.currentItem = data
                return data
            } catch (error) {
                this.error = error.response?.data?.message || error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },
        async deleteItem(id) {
            this.isLoading = true
            try {
                await dataApi.deleteItem(id)
                this.items = this.items.filter(item => item.id !== id)
            } catch (error) {
                this.error = error.response?.data?.message || error.message
                throw error
            } finally {
                this.isLoading = false
            }
        },
        async fetchItem(id) {
            this.isLoading = true
            try {
                const { data } = await dataApi.getItem(id)
                this.currentItem = data.data
                return data.data
            } catch (error) {
                this.error = error.response?.data?.message || error.message
                throw error
            } finally {
                this.isLoading = false
            }
        }
    }
})