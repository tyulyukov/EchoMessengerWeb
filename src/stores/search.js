import { defineStore } from 'pinia';
import { useApiStore } from "./api";
import { useAuthUserStore } from "./user";

export const useSearchStore = defineStore('search', {
    state: () => ({
        users: null,
        error: null,
        loading: false,
        internalError: null
    }),
    actions: {
        search(query) {
            this.clearSearch()
            const apiStore = useApiStore()

            this.loading = true

            fetch(apiStore.combineUrl('users/search'), {
                method: 'POST',
                headers: {
                    'authorization': apiStore.jwt,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query })
            })
                .then(res => {
                    this.loading = false

                    if (res && res.status === 200) {
                        return res.json()
                    }
                    else if (res && res.status === 401) {
                        this.error = "Not authorized"

                        const authUserStore = useAuthUserStore()
                        authUserStore.logOut()

                        return;
                    }
                    else if (res && res.status === 500) {
                        this.error = "Server error"
                        return;
                    }
                })
                .then(data => {
                    if (data) {
                        this.users = data
                    }
                })
                .catch(err => {
                    this.loading = false
                    this.internalError = err
                    this.error = "No connection..."
                })
        },
        clearSearch() {
            this.$reset()
        }
    }
})