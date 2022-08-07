<script>
import { defineComponent } from "vue";
import { useApiStore } from "../../stores/api";
import { useAuthUserStore } from "../../stores/user";

export default defineComponent({
  setup() {
    const apiStore = useApiStore()
    const authUserStore = useAuthUserStore()

    return {
      apiStore,
      authUserStore
    }
  },
  data() {
    return {
      newUsername: this.authUserStore.$state.username,
    }
  },
  methods: {
    changeUsername() {
      console.log('changed to', this.newUsername)
    }
  }
})
</script>

<template>
  <div class="rows">
    <div class="settings-header-row">
      <div class="settings-header">
        <span>My account</span>
      </div>
    </div>

    <div class="settings-row">
      <p>Profile</p>
      <div class="profile-info">
        <div class="avatar" v-bind:style="'background-image: url(' + apiStore.combineUrl(authUserStore.avatarUrl) + ')'"></div>
        <div class="input-group">
<!--          <div class="alert alert-danger">
            <span>Error!</span>
          </div>-->
          <label>Username</label>
          <div class="submit-group">
            <input v-model="this.newUsername" class="form-control" type="text">
            <button @click="changeUsername()" :disabled="newUsername === authUserStore.$state.username || newUsername == ''" class="btn btn-primary btn-submit">Save</button>
          </div>
        </div>
      </div>

      <p>Password</p>
    </div>
  </div>
</template>

<style scoped>
.rows {
  width: 100%;
  height: 100%;
  padding: 2rem;
}

.settings-header-row {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
}

.settings-header {
  display: flex;
  border-bottom: 0.0625rem solid var(--color-border);
  margin-bottom: 0.25rem;
  width: 100%;
  justify-content: center;
}

.settings-header span {
  align-items: center;
  font-weight: normal;
  font-size: 20pt;
}

.settings-row {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.settings-row p {
  font-weight: normal;
  font-size: 18pt;
  margin: 0.75rem 0;
}

.settings-row .avatar {
  --avatar-diameter: 7.5rem !important;
  min-width: var(--avatar-diameter);
  min-height: var(--avatar-diameter);
  max-width: var(--avatar-diameter);
  max-height: var(--avatar-diameter);
  height: var(--avatar-diameter) !important;
  margin-right: 0.625rem;
  background-size: cover;
  border-radius: 50%;
  border: 2px solid var(--vt-c-divider-dark-1);
  transition: 300ms ease;
}

.profile-info {
  display: flex;
}

.form-control {
  text-align: left;
}

.input-group {
  width: 100%;
  margin: auto 0;
}

.submit-group {
  display: flex;
  width: 100%;;
}

.btn-submit {
  margin: 0 0 0 0.45rem;
  border-radius: 0.75rem;
  width: 10rem;
}
</style>