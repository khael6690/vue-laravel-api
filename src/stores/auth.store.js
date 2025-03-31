import { defineStore } from 'pinia'
import authApi from '../api/auth'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
        isLoading: false,
        error: null
    }),
    actions: {
        async login(credentials) {
            this.isLoading = true
            this.error = null
            try {
                const { data } = await authApi.login(credentials)
                this.user = data.user
                this.token = data.token
                localStorage.setItem('token', data.token)
                return true
            } catch (error) {
                this.error = error.response?.data?.message || error.message
                return false
            } finally {
                this.isLoading = false
            }
        },
        async register(userData) {
            this.isLoading = true
            this.error = null
            try {
                const { data } = await authApi.register(userData)
                this.user = data.user
                this.token = data.token
                localStorage.setItem('token', data.token)
                return true
            } catch (error) {
                this.error = error.response?.data?.message || error.message
                return false
            } finally {
                this.isLoading = false
            }
        },
        async logout() {
            try {
                await authApi.logout()
                this.user = null
                this.token = null
                localStorage.removeItem('token')
            } catch (error) {
                console.error('Logout error:', error)
            }
        },
        async fetchUser() {
            if (this.token) {
                try {
                    const { data } = await authApi.getUser()
                    this.user = data
                } catch (error) {
                    this.token = null
                    localStorage.removeItem('token')
                }
            }
        }
    }
})