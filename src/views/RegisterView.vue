<script>
import { defineComponent } from "vue";
import { useAuthRegisterStore } from "../stores/register";

export default defineComponent({
  setup() {
    const authRegisterStore = useAuthRegisterStore()

    return {
      authRegisterStore
    }
  },
  data() {
    return {
      username: '',
      password: '',
      repeatPassword: '',
    }
  },
  methods: {
    register() {
      this.authRegisterStore.register(this.username, this.password, this.repeatPassword);
    }
  }
})
</script>

<template>
  <div class="center">
    <div class="auth-form">
      <img class="logo" src="/src/assets/echo.png">
      <h1>Get Started!</h1>
      <p class="note">Register your account</p>

      <div v-if="authRegisterStore.$state.error" class="alert alert-dark">{{authRegisterStore.$state.error}}</div>

      <form>
        <div class="input-group">
          <label>Username</label>
          <input v-model="username" id="username" class="form-control" type="text" autocomplete="false">
        </div>

        <div class="input-group">
          <label>Password</label>
          <input v-model="password" id="password" class="form-control" type="password">
        </div>

        <div class="input-group">
          <label>Repeat Password</label>
          <input v-model="repeatPassword" id="repeat_password" class="form-control" type="password">
        </div>
      </form>

      <button v-if="!authRegisterStore.$state.loading" :disabled="username === '' || password === '' || repeatPassword === ''" @click="register" class="btn btn-primary btn-submit">Register</button>
      <div v-else class="spinner-border" style="margin: 1.75rem 0;"></div>
      <br>

      <a href="/auth">Already registered</a>
    </div>
  </div>
</template>
