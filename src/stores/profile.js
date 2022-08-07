import { defineStore } from 'pinia';
import { useApiStore } from "./api";
import { useAuthUserStore } from "./user";

export const useSettingsProfileStore = defineStore('settings/profile', {
    state: () => ({
        error: null,
        loading: false,
        internalError: null
    }),
    actions: {
        changeUsername (username) {
            this.$reset()
            const apiStore = useApiStore()

            this.loading = true

            fetch(apiStore.combineUrl('profile/update/username'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': apiStore.jwt
                },
                body: JSON.stringify({username})
            })
                .then(res => {
                    this.loading = false

                    if (res && res.status === 200) {
                        return res.json()
                    }
                    else if (res && res.status === 401) {
                        this.error = "Not authorized"

                        const authUserStore = useAuthUserStore()

                        authUserStore.clearUser()
                        apiStore.forgetJwt()
                        this.$router.push('/auth')
                        return;
                    }
                    else if (res && res.status === 400) {
                        this.error = "Username must be not empty"
                        return;
                    }
                    else if (res && res.status === 405) {
                        this.error = "This username is already busy"
                        return;
                    }
                    else if (res && res.status === 406) {
                        this.error = "Username must contain at least 5 symbols and less than 20 symbols. Username must have only latin letters or/and digits. Allowed special symbols: . - _"
                        return;
                    }
                    else if (res && res.status === 500) {
                        this.error = "Server error"
                        return;
                    }
                })
                .then(data => {
                    if (!this.error) {
                        const authUserStore = useAuthUserStore()

                        authUserStore.$patch({
                            username: username
                        })
                    }
                })
                .catch(err => {
                    this.loading = false
                    this.internalError = err
                    this.error = "No connection..."
                })
        },
        changeAvatar(file) {
            this.$reset()
            const apiStore = useApiStore()

            this.loading = true

            let data = new FormData()
            data.append('file', file)

            fetch(apiStore.combineUrl('media/upload/avatar/'), {
                method: 'POST',
                headers: {
                    'authorization': apiStore.jwt
                },
                body: data
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
                    else if (res && res.status === 422) {
                        this.error = "File has unsupported type. Supported types: .jpg, .png"
                        return;
                    }
                    else if (res && res.status === 500) {
                        this.error = "Server error"
                        return;
                    }
                })
                .then(res => {
                    if (!this.error && res && res.avatarUrl && res.originalAvatarUrl) {
                        this.loading = true

                        fetch(apiStore.combineUrl('profile/update/avatar'), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'authorization': apiStore.jwt
                            },
                            body: JSON.stringify({ avatarUrl: res.avatarUrl, originalAvatarUrl: res.originalAvatarUrl })
                        })
                            .then(res => {
                                this.loading = false

                                if (res && res.status === 200) {
                                    return res.json()
                                }
                                else if (res && res.status === 400) {
                                    this.error = "Failed to upload avatar"
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
                                if (!this.error && data && res.avatarUrl && res.originalAvatarUrl) {
                                    const authUserStore = useAuthUserStore()

                                    authUserStore.$patch({
                                        avatarUrl: res.avatarUrl,
                                        originalAvatarUrl: res.originalAvatarUrl
                                    })
                                }
                            })
                            .catch(err => {
                                this.loading = false
                                this.internalError = err
                                this.error = "No connection..."
                            })
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