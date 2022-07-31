import { defineStore } from 'pinia';
import { useApiStore } from "./api";
import { useAuthUserStore } from "./user";

export const useChatsStore = defineStore('chats', {
    state: () => ({
        chats: null,
        error: null,
        loading: false,
        internalError: null
    }),
    actions: {
        loadChats() {
            const apiStore = useApiStore()

            fetch(apiStore.combineUrl('chats/'), {
                method: 'GET',
                headers: {
                    'authorization': apiStore.jwt
                },
            })
                .then(res => {
                    this.loading = false

                    if (res && res.status === 200) {
                        return res.json()
                    }
                    else if (res && res.status === 401) {
                        const authUserStore = useAuthUserStore()

                        authUserStore.clearUser()
                        apiStore.forgetJwt()
                        this.$router.push('/auth')
                        return;
                    }
                    else if (res && res.status === 500) {
                        this.error = "Server error"
                        return;
                    }
                })
                .then(data => {
                    if (data) {
                        this.chats = data
                    }
                })
                .catch(err => {
                    this.internalError = err
                    this.error = "No connection..."
                })
        }
    }
})