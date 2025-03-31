<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDataStore } from '../../stores/data.store'

const route = useRoute()
const router = useRouter()
const dataStore = useDataStore()

const isLoading = ref(true)
const item = ref(null)

onMounted(async () => {
    try {
        item.value = await dataStore.fetchItem(route.params.id)
    } catch (error) {
        router.push('/data')
    } finally {
        isLoading.value = false
    }
})
</script>

<template>
    <div class="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Detail Data</h1>
            <button @click="router.push('/data')"
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                Back to List
            </button>
        </div>

        <div v-if="isLoading" class="text-center py-8">
            Loading detail data...
        </div>

        <div v-else-if="!item" class="text-center py-8 text-red-500">
            Data not found
        </div>

        <div v-else class="space-y-4">
            <div class="border-b border-gray-200 pb-4">
                <h2 class="text-lg font-medium text-gray-900">Basic Information</h2>
                <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label class="block text-sm font-medium text-gray-500">ID</label>
                        <p class="mt-1 text-sm text-gray-900">{{ item.id }}</p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-500">Name</label>
                        <p class="mt-1 text-sm text-gray-900">{{ item.name }}</p>
                    </div>
                </div>
            </div>

            <div class="border-b border-gray-200 pb-4">
                <h2 class="text-lg font-medium text-gray-900">Description</h2>
                <p class="mt-2 text-sm text-gray-700 whitespace-pre-line">{{ item.description }}</p>
            </div>

            <div v-if="item.created_at" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label class="block text-sm font-medium text-gray-500">Created At</label>
                    <p class="mt-1 text-sm text-gray-900">
                        {{ new Date(item.created_at).toLocaleString() }}
                    </p>
                </div>
                <div v-if="item.updated_at">
                    <label class="block text-sm font-medium text-gray-500">Updated At</label>
                    <p class="mt-1 text-sm text-gray-900">
                        {{ new Date(item.updated_at).toLocaleString() }}
                    </p>
                </div>
            </div>

            <div class="pt-4 flex justify-end space-x-3">
                <!-- <router-link :to="{ name: 'data.edit', params: { id: item.id } }"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700">
                    Edit
                </router-link> -->
            </div>
        </div>
    </div>
</template>