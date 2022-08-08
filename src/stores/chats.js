import { defineStore } from 'pinia';
import { useApiStore } from "./api";
import { useAuthUserStore } from "./user";

export const useChatsStore = defineStore('chats', {
    state: () => ({
        chats: null,
        selectedChat: null,
        error: null,
        loading: false,
        internalError: null
    }),
    getters: {
        getTargetUser: () => {
            return (chat) => {
                if (!chat || !chat.sender || !chat.receiver)
                    return undefined;

                const authUserStore = useAuthUserStore()

                if (chat.sender._id === authUserStore.id)
                    return chat.receiver

                return chat.sender
            }
        },
    },
    actions: {
        loadChats() {
            this.$reset()
            const apiStore = useApiStore()

            this.loading = true

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
                        this.chats = data
                    }
                })
                .catch(err => {
                    this.loading = false
                    this.internalError = err
                    this.error = "No connection..."
                })
        },
        selectChat(chat) {
            this.selectedChat = chat
        },
        createChat(receiverId) {
            const apiStore = useApiStore()

            this.loading = true

            fetch(apiStore.combineUrl('chats/create'), {
                method: 'POST',
                headers: {
                    'authorization': apiStore.jwt,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ receiverId })
            })
                .then(res => {
                    this.loading = false

                    if (res && res.status === 201) {
                        return res.json()
                    }
                    else if (res && res.status === 400) {
                        this.error = "Receiver id is not provided"
                        return;
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
                    if (data && data._id) {
                        if (!this.chats.some(e => e._id === data._id)) {
                            this.chats.push(data)
                            console.log('added new')
                        }

                        this.selectedChat = data
                    }
                })
                .catch(err => {
                    this.loading = false
                    this.internalError = err
                    this.error = "No connection..."
                })
        }
    }
})