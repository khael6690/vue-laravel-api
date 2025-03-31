import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import DataList from '../views/data/List.vue'
import DataCreate from '../views/data/Create.vue'
import DataEdit from '../views/data/Edit.vue'
import DetailView from '../views/data/Detail.vue'
import { useAuthStore } from '../stores/auth.store'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            meta: { requiresAuth: true }
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta: { guestOnly: true }
        },
        {
            path: '/register',
            name: 'register',
            component: Register,
            meta: { guestOnly: true }
        },
        {
            path: '/data',
            name: 'data.list',
            component: DataList,
            meta: { requiresAuth: true }
        },
        {
            path: '/data/create',
            name: 'data.create',
            component: DataCreate,
            meta: { requiresAuth: true }
        },
        {
            path: '/data/:id/edit',
            name: 'data.edit',
            component: DataEdit,
            meta: { requiresAuth: true },
            props: true
        },
        {
            path: '/data/:id/detail',
            name: 'data.detail',
            component: DetailView,
            meta: { requiresAuth: true },
            props: true
        }
    ]
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    if (!authStore.user && authStore.token) {
        try {
            await authStore.fetchUser()
        } catch (error) {
            authStore.logout()
            return next('/login')
        }
    }

    if (to.meta.requiresAuth && !authStore.token) {
        return next('/login')
    }

    if (to.meta.guestOnly && authStore.token) {
        return next('/')
    }

    next()
})

export default router