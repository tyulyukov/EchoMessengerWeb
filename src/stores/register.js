import { defineStore } from 'pinia';
import { useApiStore } from "./api";
import { useAuthLoginStore } from "./login";

export const useAuthRegisterStore = defineStore('auth/register', {
    state: () => ({
        error: null,
        loading: false,
        internalError: null,
    }),
    actions: {
        register (username, password, repeatPassword) {
            this.$reset();

            if (password !== repeatPassword) {
                this.error = "Passwords are not matching"
                return;
            }

            const apiStore = useApiStore()

            this.loading = true

            fetch(apiStore.combineUrl('auth/register'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password})
            })
                .then(res => {
                    this.loading = false

                    if (res && res.status === 201) {
                        return res.json()
                    }
                    else if (res && res.status === 400) {
                        this.error = "Fields must be not empty"
                        return
                    }
                    else if (res && res.status === 403) {
                        this.error = "Password must contain at least 8 symbols. It must have letters and digits"
                        return;
                    }
                    else if (res && res.status === 406) {
                        this.error = "Username must contain at least 5 symbols and less than 20 symbols. Username must have only latin letters or/and digits. Allowed special symbols: . - _"
                        return;
                    }
                    else if (res && res.status === 405) {
                        this.error = "This username is already busy"
                        return;
                    }
                    else if (res && res.status === 500) {
                        this.error = "Server error"
                        return;
                    }
                })
                .then(data => {
                    if (data) {
                        const authLoginStore = useAuthLoginStore()

                        authLoginStore.logIn(username, password)
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