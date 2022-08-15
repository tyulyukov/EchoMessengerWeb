import { defineStore } from 'pinia';

export const useApiStore = defineStore('api', {
    state: () => ({
        serverUrl: 'http://localhost:4224/',
        /*serverUrl: 'https://server-echo.herokuapp.com/',*/
        jwt: localStorage.getItem('jwt') || null
    }),
    getters: {
        combineUrl: (state) => {
            return (resource) => {
                let url1 = state.serverUrl.replace(/\/+$/, '');
                let url2 = resource.replace(/^\//, '');

                return url1 + '/' + url2;
            }
        },
    },
    actions: {
        rememberJwt(jwt) {
            this.jwt = jwt
            localStorage.setItem('jwt', jwt)
        },
        forgetJwt() {
            this.jwt = null
            localStorage.removeItem('jwt')
        }
    }
})