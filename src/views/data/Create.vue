<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '../../stores/data.store'

const router = useRouter()
const dataStore = useDataStore()

const form = ref({
    name: '',
    description: ''
})

const handleSubmit = async () => {
    try {
        await dataStore.createItem(form.value)
        router.push('/data')
    } catch (error) {
        console.error('Create error:', error)
    }
}
</script>

<template>
    <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 class="text-2xl font-bold mb-6">Create New Item</h1>

        <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                <input v-model="form.name" type="text" id="name" required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            </div>

            <div>
                <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                <textarea v-model="form.description" id="description" rows="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
            </div>

            <div v-if="dataStore.error" class="text-red-500 text-sm">
                {{ dataStore.error }}
            </div>

            <div class="flex justify-end space-x-3">
                <router-link to="/data"
                    class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Cancel
                </router-link>
                <button type="submit" :disabled="dataStore.isLoading"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                    {{ dataStore.isLoading ? 'Saving...' : 'Save' }}
                </button>
            </div>
        </form>
    </div>
</template>