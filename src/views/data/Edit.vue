<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDataStore } from '../../stores/data.store'

const route = useRoute()
const router = useRouter()
const dataStore = useDataStore()

const form = ref({
  id: '',
  name: '',
  description: ''
})

const isLoading = ref(false)
const error = ref(null)

// Load item data saat komponen dimount
onMounted(async () => {
  try {
    isLoading.value = true
    await dataStore.fetchItem(route.params.id)
    
    if (dataStore.currentItem) {
      form.value = {
        id: dataStore.currentItem.id,
        name: dataStore.currentItem.name,
        description: dataStore.currentItem.description
      }
    } else {
      router.push('/not-found')
    }
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
})

const handleSubmit = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    await dataStore.updateItem(route.params.id, {
      name: form.value.name,
      description: form.value.description
    })
    
    router.push('/data')
  } catch (err) {
    error.value = err.response?.data?.message || err.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto py-8 px-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Edit Data</h1>
      <router-link 
        to="/data" 
        class="text-gray-500 hover:text-gray-700"
      >
        Kembali
      </router-link>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !form.id" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">Memuat data...</p>
    </div>

    <!-- Form Edit -->
    <div v-else class="bg-white shadow rounded-lg p-6">
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
            Nama Item
          </label>
          <input
            v-model="form.name"
            id="name"
            type="text"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
            Deskripsi
          </label>
          <textarea
            v-model="form.description"
            id="description"
            rows="4"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>

        <div class="flex items-center justify-between">
          <button
            type="submit"
            :disabled="isLoading"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            <span v-if="isLoading">Menyimpan...</span>
            <span v-else>Simpan Perubahan</span>
          </button>

          <button
            type="button"
            @click="router.push('/data')"
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  </div>
</template>