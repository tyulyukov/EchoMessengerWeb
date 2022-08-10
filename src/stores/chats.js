import { defineStore } from 'pinia';
import { useApiStore } from "./api";
import { useAuthUserStore } from "./user";

export const useChatsStore = defineStore('chats', {
    state: () => ({
        chats: null,
        selectedChatId: null,
        error: null,
        loading: false,
        internalError: null,
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
        getChatById: (state) => {
            return (id) => {
                if (!id || !state.chats || state.chats.length == 0)
                    return undefined

                for (const chat of state.chats)
                    if (chat._id == id)
                        return chat

                return undefined
            }
        }
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
            this.selectedChatId = chat._id
        },
        loadMessages(chat, callback = null) {
            const apiStore = useApiStore()
            let chatIndex = -1

            if (!this.chats || this.chats.length == 0 || chat.allMessagesLoaded || chat.loadingMessages)
                return;

            for (let i = 0; i < this.chats.length; i++) {
                if (this.chats[i]._id === chat._id) {
                    chatIndex = i
                    break
                }
            }

            if (chatIndex == -1)
                return;

            this.chats[chatIndex].loadingMessages = true
            const from = this.chats[chatIndex].messages.length || 0
            const loadingCount = 25

            fetch(apiStore.combineUrl('chats/' + this.chats[chatIndex]._id + '/messages?from=' + from + '&count=' + loadingCount), {
                method: 'GET',
                headers: {
                    'authorization': apiStore.jwt
                }
            })
                .then(res => {
                    this.chats[chatIndex].loadingMessages = false

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
                    if (data && !this.error) {
                        this.chats[chatIndex].loadingMessages = true

                        if (data.length < loadingCount)
                            this.chats[chatIndex].allMessagesLoaded = true

                        for (const message of data) {
                            this.chats[chatIndex].messages.splice(0, 0, message);
                        }

                        if (callback)
                            callback()

                        this.chats[chatIndex].loadingMessages = false
                    }
                })
                .catch(err => {
                    this.loading = false
                    this.internalError = err
                    this.error = "No connection..."
                })
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
                        this.addChat(data)

                        this.selectedChatId = data._id
                    }
                })
                .catch(err => {
                    this.loading = false
                    this.internalError = err
                    this.error = "No connection..."
                })
        },
        addChat(chat) {
            if (!this.chats.some(e => e._id === chat._id)) {
                this.chats.push(chat)
            }
        }
    }
})