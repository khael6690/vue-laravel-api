<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth.store'

const authStore = useAuthStore()

// Fetch user on app initialization if token exists
if (authStore.token) {
  authStore.fetchUser()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="text-lg font-semibold text-gray-900">
              My App
            </router-link>
          </div>
          <div class="flex items-center space-x-4">
            <template v-if="authStore.user">
              <span class="text-sm text-gray-500">Hello, {{ authStore.user.name }}</span>
              <button @click="authStore.logout" class="text-sm text-gray-500 hover:text-gray-700">
                Logout
              </button>
            </template>
            <template v-else>
              <router-link to="/login" class="text-sm text-gray-500 hover:text-gray-700">
                Login
              </router-link>
              <router-link to="/register" class="text-sm text-gray-500 hover:text-gray-700">
                Register
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <RouterView />
    </main>
  </div>
</template>