import { defineStore } from 'pinia';
import {useChatsStore} from "./chats";

export const useOnlineStore = defineStore('online', {
    state: () => ({
        onlineUsers: [],
    }),
    getters: {
        isUserOnline: (state) => {
            return (userId) => {
                if (!userId || state.onlineUsers.length == 0)
                    return false;

                for (const onlineUserId of state.onlineUsers)
                    if (onlineUserId == userId)
                        return true

                return false
            }
        },
    },
    actions: {
        usersConnected(users) {
            this.onlineUsers = users
        },
        userConnected(userId) {
            let exists = false

            for (const onlineUserId of this.onlineUsers)
                if (onlineUserId == userId) {
                    exists = true
                    break
                }

            if (!exists)
                this.onlineUsers.push(userId)
        },
        userDisconnected(userId) {
            const chatsStore = useChatsStore()
            if (!chatsStore.chats || chatsStore.chats.length == 0)
                return

            for (let i = 0; i < chatsStore.chats.length; i++) {
                if (chatsStore.chats[i].receiver._id === userId)
                    chatsStore.chats[i].receiver.lastOnlineAt = Date.now()
                else if (chatsStore.chats[i].sender._id === userId)
                    chatsStore.chats[i].sender.lastOnlineAt = Date.now()
            }

            for(let i = 0; i < this.onlineUsers.length; i++)
                if (this.onlineUsers[i] === userId)
                    this.onlineUsers.splice(i, 1);
        }
    }
})