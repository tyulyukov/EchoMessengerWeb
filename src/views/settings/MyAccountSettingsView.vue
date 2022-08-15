<script>
import { defineComponent } from "vue";
import { useApiStore } from "../../stores/api";
import { useAuthUserStore } from "../../stores/user";
import { useSettingsProfileStore } from "../../stores/profile";

export default defineComponent({
  setup() {
    const apiStore = useApiStore()
    const authUserStore = useAuthUserStore()
    const settingsProfileStore = useSettingsProfileStore()

    return {
      apiStore,
      authUserStore,
      settingsProfileStore
    }
  },
  data() {
    return {
      newUsername: this.authUserStore.$state.username,
      oldPassword: '',
      newPassword: ''
    }
  },
  methods: {
    changeUsername() {
      this.settingsProfileStore.changeUsername(this.newUsername)
    },
    changeAvatar(event) {
      if (event.target.files.length == 1) {
        this.settingsProfileStore.changeAvatar(event.target.files[0])
      }
    },
    changePassword() {
      this.settingsProfileStore.changePassword(this.oldPassword, this.newPassword)
    },
    logOut() {
      this.authUserStore.logOut()
    },
    closeSetting() {
      let leftColumn = document.getElementsByClassName('left-column')[0]
      if (leftColumn.classList.contains('closed'))
        leftColumn.classList.remove('closed')
    }
  }
})
</script>

<template>
  <div class="rows">
    <img @click="closeSetting"
         class="button-close-chat"
         src="../../assets/img/arrow-down.png"
         alt="Back to settings"/>

    <div class="settings-header-row">
      <div class="settings-header">
        <span>My account</span>
      </div>
    </div>

    <div class="settings-row">
      <p>Profile</p>
      <div class="profile-info">
        <div class="avatar" v-bind:style="'background-image: url(' + authUserStore.avatarUrl + ')'">
          <div v-if="!settingsProfileStore.$state.loading">
            <label for="avatar-input">
              <div class="avatar-overlay">
                <img src="../../assets/img/image.png">
              </div>
            </label>

            <input @change="changeAvatar" id="avatar-input" type="file" accept=".jpg,.jpeg,.png">
          </div>

          <div v-else class="loading-overlay center">
            <div class="spinner-border"></div>
          </div>
        </div>
        <div class="input-group">
          <div v-if="settingsProfileStore.$state.error" class="alert alert-danger">
            <span>{{ settingsProfileStore.$state.error }}</span>
          </div>
          <div v-else-if="settingsProfileStore.$state.success" class="alert alert-success">
            <span>{{ settingsProfileStore.$state.success }}</span>
          </div>
          <label>Username</label>
          <div class="submit-group">
            <input v-model="this.newUsername" class="form-control" type="text">
            <button v-if="!settingsProfileStore.$state.loading" @click="changeUsername" :disabled="newUsername === authUserStore.$state.username || newUsername == ''" class="btn btn-primary btn-submit">Save</button>
            <div v-else class="spinner-border"></div>
          </div>
        </div>
      </div>

      <p>Password</p>
      <div class="password-info">
        <div v-if="settingsProfileStore.$state.passwordError" class="alert alert-danger">
          <span>{{ settingsProfileStore.$state.passwordError }}</span>
        </div>
        <div v-else-if="settingsProfileStore.$state.passwordSuccess" class="alert alert-success">
          <span>{{ settingsProfileStore.$state.passwordSuccess }}</span>
        </div>

        <div class="input-group">
          <label>Old password</label>
          <input v-model="this.oldPassword" class="form-control" type="password">
        </div>

        <div class="input-group">
          <label>New password</label>
          <input v-model="this.newPassword" class="form-control" type="password">
        </div>

        <button v-if="!settingsProfileStore.$state.loading" @click="changePassword" :disabled="newPassword == '' || oldPassword == ''" class="btn btn-primary btn-submit">Save</button>
        <div v-else class="spinner-border"></div>
      </div>

      <button @click="logOut" class="btn btn-danger btn-submit">Log out</button>
    </div>
  </div>
</template>

<style scoped>
.rows {
  width: 100%;
  height: 100%;
  padding: 2rem;
  overflow: auto;
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
  overflow: hidden;
  position: relative;
}

.settings-row p {
  font-weight: 500;
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
  background-position: center;
  border-radius: 50%;
  border: 2px solid var(--vt-c-divider-dark-1);
  transition: 300ms ease;
}

.avatar .loading-overlay {
  background-color: var(--vt-c-black);
  outline: 2px solid var(--vt-c-black);
  opacity: 0.5;
}

.avatar .avatar-overlay {
  width: 100%;
  height: 100%;
  background-color: var(--vt-c-black);
  outline: 2px solid var(--vt-c-black);
  opacity: 0;
  transition: 100ms;
  padding: 2rem;
  border-radius: 50%;
}

.avatar label, img {
  width: 100%;
  height: 100%;
}

.avatar input {
  display: none;
}

.avatar .avatar-overlay:hover {
  opacity: 0.5;
}

.profile-info {
  display: flex;
}

.password-info {
  display: block;
  max-width: 18rem;
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
  width: 100%;
}

.btn-submit {
  border-radius: 0.75rem;
  width: 10rem;
  margin: 0.5rem 0 0 0;
}

.submit-group .btn-submit {
  margin: 0 0 0 0.45rem;
}

.button-close-chat {
  display: none;
  transform: rotateZ(90deg) scale(1);
  --size: 1.65rem;
  width: var(--size);
  height: var(--size);
  transition: 300ms;
  cursor: pointer;
  margin: auto 1rem auto 0;
}

.button-close-chat:hover {
  transform: rotateZ(90deg) scale(0.8);
}

@media (max-width: 600px) {
  .avatar {
    --small-avatar-diameter: 5rem !important;
    min-width: var(--small-avatar-diameter) !important;
    min-height: var(--small-avatar-diameter) !important;
    max-width: var(--small-avatar-diameter) !important;
    max-height: var(--small-avatar-diameter) !important;
  }
}
</style>