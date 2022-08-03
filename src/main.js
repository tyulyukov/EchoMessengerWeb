import { createApp, markRaw } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from "pinia";
import { useApiStore } from "./stores/api";

import './assets/main.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faRotateRight } from '@fortawesome/free-solid-svg-icons'

library.add(faRotateRight)

const app = createApp(App)
const pinia = createPinia()

router.beforeEach((to, from, next) => {
    const authUserStore = useApiStore()

    if (!authUserStore.jwt && to.path !== '/auth' && to.path !== '/register') next('/auth')
    else if (authUserStore.jwt && (to.path === '/auth' || to.path === '/register')) next(from.path)
    else next()
})

pinia.use(({ store }) => {
    store.$router = markRaw(router)
});

app.use(pinia)
app.use(router)

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
