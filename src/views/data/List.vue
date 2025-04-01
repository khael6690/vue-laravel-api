<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDataStore } from '../../stores/data.store'
import { debounce } from 'lodash'

const route = useRoute()
const router = useRouter()
const dataStore = useDataStore()
const searchQuery = ref(route.query.search || '')

// State untuk sorting
const sortField = ref(route.query.sort_by || 'id')
const sortDirection = ref(route.query.sort_direction || 'asc')

// Default perPage options
const perPageOptions = [10, 20, 30, 50]
const localPerPage = ref(route.query.per_page ? parseInt(route.query.per_page) : 10)

// Computed untuk icon sort
const sortIcon = (field) => {
    if (sortField.value !== field) return '⇅'
    return sortDirection.value === 'asc' ? '↑' : '↓'
}

// Fungsi debounce untuk search
const debouncedSearch = debounce(() => {
    const query = {
        page: 1,
        per_page: route.query.per_page || 10,
        ...(searchQuery.value ? { search: String(searchQuery.value) } : {}) // Pastikan search adalah string
    }

    // Hanya update query jika ada perubahan
    if (route.query.search !== query.search || route.query.page !== query.page) {
        router.replace({ query })
        dataStore.fetchItems(query)
    }
}, 500)

// Debounce search untuk mengurangi request berlebihan
const handleSearch = () => {
    debouncedSearch()
}

const clearSearch = () => {
    searchQuery.value = ''
    const query = { ...route.query }
    delete query.search
    router.replace({ query: { ...query, page: 1 } }) // Kembali ke halaman 1
    dataStore.fetchItems({
        page: 1,
        per_page: query.per_page || 10
    })
}

// Load data dengan sorting
const loadData = () => {
    dataStore.fetchItems({
        page: route.query.page || 1,
        per_page: route.query.per_page || 10,
        search: route.query.search ? String(route.query.search) : '', // Pastikan string
        sort_by: sortField.value, // Gunakan ref lokal, bukan dari store
        sort_direction: sortDirection.value // Gunakan ref lokal, bukan dari store
    })
}

// Handle sorting
const handleSort = (field) => {
    if (sortField.value === field) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortField.value = field
        sortDirection.value = 'asc'
    }

    // Kembali ke halaman pertama saat sorting berubah
    router.push({
        query: {
            ...route.query,
            sort_by: sortField.value,
            sort_direction: sortDirection.value,
            page: 1
        }
    })

    loadData()
}

// Load data saat komponen mount atau query berubah
onMounted(() => {
    if (route.query.search) {
        searchQuery.value = String(route.query.search) // Pastikan string
    }
    loadData()
})

// Watch perubahan query
watch(
    () => route.query,
    (newQuery) => {
        if (newQuery.search !== searchQuery.value) {
            searchQuery.value = newQuery.search ? String(newQuery.search) : '' // Pastikan string
        }
        loadData()
    },
    { immediate: true }
)


const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
        await dataStore.deleteItem(id)
        loadData() // Refresh data dengan parameter yang sama
    }
}

const changePage = (page) => {
    router.push({
        query: {
            ...route.query,
            page: page > 0 ? page : 1
        }
    })
}

const changePerPage = (perPage) => {
    localPerPage.value = perPage
    router.push({
        query: {
            ...route.query,
            per_page: perPage,
            page: 1 // Selalu kembali ke halaman pertama saat ganti perPage
        }
    })
}

const getRowNumber = (index) => {
    const currentPage = dataStore.pagination.current_page || 1;
    const perPage = dataStore.pagination.per_page || 10;

    // Jika sorting by index descending, hitung dari belakang
    if (dataStore.sortField === 'index' && dataStore.sortDirection === 'desc') {
        return dataStore.pagination.total - ((currentPage - 1) * perPage + index);
    }

    return (currentPage - 1) * perPage + index + 1;
};

const displayedPages = computed(() => {
    const current = dataStore.pagination.current_page;
    const last = dataStore.pagination.last_page;
    const pages = [];

    // Tentukan range halaman yang ditampilkan
    const start = Math.max(1, current - 2);
    const end = Math.min(last, current + 2);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return pages;
});
</script>

<template>
    <div class="container mx-auto px-4 py-8">
        <!-- Search Input -->
        <div class="mb-6 flex justify-between items-center">
            <div class="w-full max-w-md">
                <label for="search" class="sr-only">Search</label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <input id="search" v-model="searchQuery" @input="handleSearch"
                        class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Search by name, description..." type="search">
                    <button v-if="searchQuery" @click="clearSearch"
                        class="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
            <router-link to="/data/create" class="ml-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Create New
            </router-link>
        </div>

        <!-- Per Page Selector -->
        <div class="flex justify-between items-center mb-4">
            <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-700">Items per page:</span>
                <select v-model="localPerPage" @change="changePerPage(localPerPage)"
                    class="border rounded px-3 py-1 text-sm">
                    <option v-for="option in perPageOptions" :key="option" :value="option">
                        {{ option }}
                    </option>
                </select>
            </div>
        </div>

        <!-- Loading, Error, Empty States -->
        <div v-if="dataStore.isLoading && !dataStore.items.length" class="text-center py-8">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto"></div>
        </div>

        <div v-else-if="dataStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ dataStore.error }}
        </div>

        <div v-else-if="!dataStore.items.length" class="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="mt-2 text-gray-600">No items found</p>
        </div>

        <div v-else>
            <div class="bg-white shadow rounded-lg overflow-hidden mb-6">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                @click="handleSort('index')">
                                <div class="flex items-center">
                                    No
                                    <span class="ml-1">{{ sortIcon('index') }}</span>
                                </div>
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                @click="handleSort('id')">
                                <div class="flex items-center">
                                    ID
                                    <span class="ml-1">{{ sortIcon('id') }}</span>
                                </div>
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                @click="handleSort('name')">
                                <div class="flex items-center">
                                    Name
                                    <span class="ml-1">{{ sortIcon('name') }}</span>
                                </div>
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                @click="handleSort('description')">
                                <div class="flex items-center">
                                    Description
                                    <span class="ml-1">{{ sortIcon('description') }}</span>
                                </div>
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="(item, index) in dataStore.items" :key="item.id">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ getRowNumber(index) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.id }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.name }}
                            </td>
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

            <!-- Pagination Controls -->
            <div class="flex items-center justify-between mt-6">
                <div class="text-sm text-gray-700">
                    Showing {{ dataStore.items.length }} of {{ dataStore.pagination.total }} items
                    (Page {{ dataStore.pagination.current_page }} of {{ dataStore.pagination.last_page }})
                </div>

                <div class="flex space-x-1">
                    <!-- Previous Button -->
                    <button @click="changePage(dataStore.pagination.current_page - 1)"
                        :disabled="dataStore.pagination.current_page === 1"
                        class="px-3 py-1 border rounded-md text-sm disabled:opacity-50 cursor-pointer">
                        Previous
                    </button>

                    <!-- First Page -->
                    <button v-if="dataStore.pagination.current_page > 3" @click="changePage(1)"
                        class="px-3 py-1 border rounded-md text-sm cursor-pointer">
                        1
                    </button>
                    <span v-if="dataStore.pagination.current_page > 4" class="px-2 py-1">...</span>

                    <!-- Pages Around Current -->
                    <template v-for="page in displayedPages" :key="page">
                        <button @click="changePage(page)" class="px-3 py-1 border rounded-md text-sm cursor-pointer"
                            :class="{
                                'bg-indigo-600 text-white': page === dataStore.pagination.current_page,
                                'hover:bg-gray-100': page !== dataStore.pagination.current_page
                            }">
                            {{ page }}
                        </button>
                    </template>

                    <span v-if="dataStore.pagination.current_page < dataStore.pagination.last_page - 3"
                        class="px-2 py-1">...</span>

                    <!-- Last Page -->
                    <button v-if="dataStore.pagination.current_page < dataStore.pagination.last_page - 2"
                        @click="changePage(dataStore.pagination.last_page)"
                        class="px-3 py-1 border rounded-md text-sm cursor-pointer">
                        {{ dataStore.pagination.last_page }}
                    </button>

                    <!-- Next Button -->
                    <button @click="changePage(dataStore.pagination.current_page + 1)"
                        :disabled="dataStore.pagination.current_page === dataStore.pagination.last_page"
                        class="px-3 py-1 border rounded-md text-sm disabled:opacity-50 cursor-pointer">
                        Next
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
th {
    transition: background-color 0.2s ease;
}

.sort-active {
    background-color: #f3f4f6;
    /* bg-gray-100 */
    font-weight: 600;
}
</style>