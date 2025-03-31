import { defineStore } from 'pinia'
import dataApi from '../api/data'

export const useDataStore = defineStore('data', {
    state: () => ({
        items: [],
        currentItem: null,
        isLoading: false,
        error: null
    }),
    actions: {
        async fetchItems() {
            this.isLoading = true
            try {
                const response = await dataApi.getItems()
                this.items = response.data.data
                this.pagination = {
                    links: response.data.links,
                    meta: response.data.meta
                }
            } catch (error) {
                this.error = error.response?.data?.message || error.message
            } finally {
                this.isLoading = false
            }
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