<script>
import { useAuthLoginStore } from "../stores/login";
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    const authLoginStore = useAuthLoginStore()

    return {
      authLoginStore
    }
  },
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    logIn() {
      this.authLoginStore.logIn(this.username, this.password);
    }
  }
})
</script>

<template>
  <div class="center">
    <div class="auth-form">
      <img class="logo" src="/src/assets/echo.png">
      <h1>Welcome Back!</h1>
      <p class="note">Login to your account</p>

      <div v-if="authLoginStore.$state.error" class="alert alert-dark">{{authLoginStore.$state.error}}</div>

      <form>
        <div class="input-group">
          <label>Username</label>
          <input v-model="username" id="username" class="form-control" type="text" autocomplete="false">
        </div>

        <div class="input-group">
          <label>Password</label>
          <input v-model="password" id="password" class="form-control" type="password">
        </div>
      </form>

      <button v-if="!authLoginStore.$state.loading" :disabled="username === '' || password === ''" @click="logIn" class="btn btn-primary btn-submit">Login</button>
      <div v-else class="spinner-border" style="margin: 1.75rem 0;"></div>
      <br>

      <a href="/register">Create an account</a>
    </div>
  </div>
</template>
