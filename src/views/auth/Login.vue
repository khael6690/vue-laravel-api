<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
    email: '',
    password: ''
})

const handleSubmit = async () => {
    const success = await authStore.login(form.value)
    if (success) {
        router.push('/')
    }
}
</script>

<template>
    <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 class="text-2xl font-bold mb-6">Login</h1>

        <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input v-model="form.email" type="email" id="email" required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            </div>

            <div>
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <input v-model="form.password" type="password" id="password" required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            </div>

            <div v-if="authStore.error" class="text-red-500 text-sm">
                {{ authStore.error }}
            </div>

            <button type="submit" :disabled="authStore.isLoading"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                {{ authStore.isLoading ? 'Logging in...' : 'Login' }}
            </button>
        </form>

        <div class="mt-4 text-center">
            <router-link to="/register" class="text-indigo-600 hover:text-indigo-800 text-sm">
                Don't have an account? Register
            </router-link>
        </div>
    </div>
</template>