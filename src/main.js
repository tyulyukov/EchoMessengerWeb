import { createApp, markRaw } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from "pinia";
import { useApiStore } from "./stores/api";

import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

router.beforeEach((to, from, next) => {
    const authUserStore = useApiStore()

    if (!authUserStore.jwt && to.path !== '/auth' && to.path !== '/signup') next('/auth')
    else if (authUserStore.jwt && (to.path === '/auth' || to.path === '/signup')) next(from.path)
    else next()
})

pinia.use(({ store }) => {
    store.$router = markRaw(router)
});

app.use(pinia)
app.use(router)

app.mount('#app')
