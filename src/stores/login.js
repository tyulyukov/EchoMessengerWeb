import { defineStore } from 'pinia';
import { useApiStore } from "./api";
import { useAuthUserStore } from "./user";

export const useAuthLoginStore = defineStore('auth/login', {
    state: () => ({
        error: null,
        loading: false,
        internalError: null
    }),
    actions: {
        logIn (username, password) {
            this.$reset()
            const apiStore = useApiStore()

            this.loading = true

            fetch(apiStore.combineUrl('auth/login'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password})
            })
                .then(res => {
                    this.loading = false

                    if (res && res.status === 200) {
                        return res.json()
                    }
                    else if (res && res.status === 400) {
                        this.error = "Incorrect username/password"
                        return;
                    }
                    else if (res && res.status === 500) {
                        this.error = "Server error"
                        return;
                    }
                })
                .then(data => {
                    if (data && data.user && data.token) {
                        const authUserStore = useAuthUserStore()

                        authUserStore.updateUser(data.user)
                        apiStore.rememberJwt(data.token)

                        this.$router.push({path: '/'})
                    }
                })
                .catch(err => {
                    this.internalError = err
                    this.error = "No connection..."
                })
        }
    }
})