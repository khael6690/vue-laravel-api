<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDataStore } from '../../stores/data.store'

const router = useRouter()
const dataStore = useDataStore()

onMounted(() => {
    dataStore.fetchItems()
})

const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
        await dataStore.deleteItem(id)
    }
}
</script>

<template>
    <div class="container mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Data Items</h1>
            <router-link to="/data/create" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Create New
            </router-link>
        </div>

        <div v-if="dataStore.isLoading && !dataStore.items.length" class="text-center py-8">
            Loading...
        </div>

        <div v-else-if="dataStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {{ dataStore.error }}
        </div>

        <div v-else-if="!dataStore.items.length" class="text-center py-8">
            No items found
        </div>

        <div v-else class="bg-white shadow rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="item in dataStore.items" :key="item.id">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.id }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.name }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.description }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <router-link :to="{ name: 'data.detail', params: { id: item.id } }"
                                class="text-blue-600 hover:text-blue-900 mr-3">
                                Detail
                            </router-link>
                            <router-link :to="{ name: 'data.edit', params: { id: item.id } }"
                                class="text-indigo-600 hover:text-indigo-900 mr-3">
                                Edit
                            </router-link>
                            <button @click="handleDelete(item.id)" class="text-red-600 hover:text-red-900"
                                :disabled="dataStore.isLoading">
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>