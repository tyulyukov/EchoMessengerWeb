import { defineStore } from 'pinia';

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
            for(let i = 0; i < this.onlineUsers.length; i++)
                if (this.onlineUsers[i] === userId)
                    this.onlineUsers.splice(i, 1);
        }
    }
})