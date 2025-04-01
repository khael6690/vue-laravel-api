<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '../stores/auth.store'
import { useDataStore } from '../stores/data.store'

const authStore = useAuthStore()
const dataStore = useDataStore()

onMounted(async () => {
    if (authStore.token) {
        await dataStore.fetchItems()
    }
})
</script>

<template>
    <div class="container mx-auto px-4 py-8">
        <!-- Welcome Section -->
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-gray-800 mb-4">
                Selamat Datang, {{ authStore.user?.name || 'Pengguna' }}!
            </h1>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                Sistem Manajemen Data Terintegrasi dengan Laravel 11 API
            </p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Total Data</h3>
                <p class="text-3xl font-bold text-gray-800">
                    {{ dataStore.pagination.total }}
                </p>
                <p class="text-sm text-gray-500 mt-2">Item tersimpan</p>
            </div>

            <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Status Sistem</h3>
                <p class="text-3xl font-bold text-gray-800">
                    {{ authStore.token ? 'Aktif' : 'Offline' }}
                </p>
                <p class="text-sm text-gray-500 mt-2">Koneksi API</p>
            </div>

            <div class="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Versi Aplikasi</h3>
                <p class="text-3xl font-bold text-gray-800">1.0.0</p>
                <p class="text-sm text-gray-500 mt-2">Laravel + Vue 3</p>
            </div>
        </div>

        <!-- Recent Data Section -->
        <div class="bg-white shadow rounded-lg overflow-hidden">
            <div class="p-6 border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-semibold text-gray-800">Data Terbaru</h2>
                    <router-link to="/data/create"
                        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Tambah Data
                    </router-link>
                </div>
            </div>

            <div v-if="dataStore.isLoading && !dataStore.items.length" class="p-8 text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p class="mt-4 text-gray-600">Memuat data...</p>
            </div>

            <div v-else-if="!dataStore.items.length" class="p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="mt-4 text-gray-600">Belum ada data tersedia</p>
                <router-link to="/data/create" class="mt-2 inline-block px-4 py-2 text-blue-600 hover:text-blue-800">
                    Tambah data pertama Anda
                </router-link>
            </div>

            <ul v-else class="divide-y divide-gray-200">
                <li v-for="item in dataStore.items.slice(0, 3)" :key="item.id"
                    class="hover:bg-gray-50 transition-colors">
                    <router-link :to="{ name: 'data.detail', params: { id: item.id } }" class="block p-6">
                        <div class="flex justify-between items-start">
                            <div>
                                <h3 class="text-lg font-medium text-gray-800">{{ item.name }}</h3>
                                <p class="mt-1 text-sm text-gray-600 line-clamp-2">
                                    {{ item.description || 'Tidak ada deskripsi' }}
                                </p>
                            </div>
                            <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                ID: {{ item.id }}
                            </span>
                        </div>
                    </router-link>
                </li>
            </ul>

            <div v-if="dataStore.items.length > 3" class="p-4 border-t border-gray-200 text-center">
                <router-link to="/data" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Lihat semua data →
                </router-link>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="mt-8 grid grid-cols-2 gap-4">
            <router-link to="/data"
                class="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center">
                <div class="bg-blue-100 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <div>
                    <h3 class="font-medium text-gray-800">Kelola Data</h3>
                    <p class="text-sm text-gray-500">Lihat dan edit semua data</p>
                </div>
            </router-link>

            <!-- <router-link v-if="authStore.user" to="/profile"
                class="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex items-center">
                <div class="bg-purple-100 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <div>
                    <h3 class="font-medium text-gray-800">Profil Anda</h3>
                    <p class="text-sm text-gray-500">Kelola akun pengguna</p>
                </div>
            </router-link> -->
        </div>
    </div>
</template>