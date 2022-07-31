<script>
import { useAuthUserStore } from "../stores/user";
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    const authUserStore = useAuthUserStore()

    return {
      authUserStore
    }
  },
  methods: {
    confirmJwt() {
      this.authUserStore.confirmJwt()
    }
  },
  mounted() {
    this.confirmJwt()
  }
})
</script>

<template>
  <main>
    <h1>Echo Messenger</h1>
    <a href="https://server-echo.herokuapp.com">Server</a>
  </main>
</template>
