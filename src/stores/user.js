import { defineStore } from 'pinia';
import { useApiStore } from "./api";
import { useChatsStore } from "./chats";
import { useSettingsProfileStore } from "./profile";

export const useAuthUserStore = defineStore('auth/user', {
    state: () => ({
        id: null,
        username: '',
        description: '',
        avatarUrl: '',
        originalAvatarUrl: '',
        createdAt: '',
    }),
    getters: {
        loggedIn: (state) => state.id !== null,
    },
    actions: {
        updateUser (payload) {
            this.id = payload._id
            this.username = payload.username
            this.description = payload.description
            this.avatarUrl = payload.avatarUrl
            this.originalAvatarUrl = payload.originalAvatarUrl
            this.createdAt = payload.createdAt
        },
        clearUser () {
            this.$reset()
        },
        logOut () {
            const apiStore = useApiStore()
            const chatsStore = useChatsStore()
            const settingsProfile = useSettingsProfileStore()

            this.clearUser()
            apiStore.forgetJwt()
            chatsStore.$reset()
            settingsProfile.$reset()

            this.$router.push('/auth')
        },
        confirmJwt () {
            if (this.loggedIn)
                return;

            const apiStore = useApiStore()

            if (apiStore.jwt)
            {
                fetch(apiStore.combineUrl('auth/jwt'), {
                    method: 'GET',
                    headers: {
                        'authorization': apiStore.jwt,
                        'Content-Type': 'application/json'
                    },
                })
                    .then(res => {
                        if (res && res.status === 200) {
                            return res.json()
                        }
                        else if (res && res.status === 401) {
                            this.logOut()
                        }
                    })
                    .then(data => {
                        if (data)
                            this.updateUser(data)
                    })
            }
            else
            {
                this.clearUser()
            }
        },
    }
})