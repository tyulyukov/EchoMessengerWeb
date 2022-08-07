<script>
import { defineComponent } from "vue";
import { useAuthUserStore } from "../stores/user";
import { useChatsStore } from "../stores/chats";
import ChatsList from "../components/chats/ChatsList.vue";
import SelectChatView from "./chats/SelectChatView.vue";
import ChatView from "./chats/ChatView.vue";
import SettingsList from "../components/settings/SettingsList.vue";
import MyAccountSettingsView from "./settings/MyAccountSettingsView.vue";

export default defineComponent({
  components: { MyAccountSettingsView, SettingsList, SelectChatView, ChatsList, ChatView },
  emits: ['openChats', 'openSettings'],
  setup() {
    const authUserStore = useAuthUserStore()
    const chatsStore = useChatsStore()

    return {
      authUserStore,
      chatsStore
    }
  },
  data() {
    return {
      openedTab: 'chats',
    }
  },
  computed: {
    chatsTabName() { return 'chats' },
    settingsTabName() { return 'settings' },
  },
  methods: {
    confirmJwt() {
      this.authUserStore.confirmJwt()
    },
    loadChats() {
      this.chatsStore.loadChats()
    },
    openSettings() {
      this.openedTab = this.settingsTabName
    },
    openChats() {
      this.openedTab = this.chatsTabName
    }
  },
  mounted() {
    this.confirmJwt()
    this.loadChats()
  }
})
</script>

<template>
  <div v-if="authUserStore.loggedIn" class="columns">
    <div class="left-column">
      <ChatsList v-if="this.openedTab == this.chatsTabName" @openSettings="openSettings" />
      <SettingsList v-else-if="this.openedTab == this.settingsTabName" @openChats="openChats" />
    </div>
    <div class="middle-column">
      <div class="middle-column-container">
        <SelectChatView v-if="this.openedTab == this.chatsTabName && !chatsStore.$state.selectedChat" />
        <ChatView v-else-if="this.openedTab == this.chatsTabName" :chat="chatsStore.$state.selectedChat" />
        <MyAccountSettingsView v-else-if="this.openedTab == this.settingsTabName" />
      </div>
    </div>
  </div>
</template>

<style>
.columns {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 100%;
  width: 100%;
  height: 100%;
}

.left-column {
  min-width: 12rem;
  width: 33vw;
  max-width: 26.5rem;
  height: 100vh;
  max-height: 100vh;
  background-color: var(--vt-c-main-vulkan);
  padding: 1rem;
  overflow: auto;
}

@media (min-width: 1281px){
  .left-column {
    width: 16vw;
    max-width: 22vw;
  }
}

@media (min-width: 1025px) {
  .left-column {
    width: 25vw;
    max-width: 33vw;
  }
}

@media (min-width: 961px) {
  .left-column {
    max-width: 40vw;
  }
}

/*@media (max-width: 600px) {
  .left-column {
    max-width: none;
    transform: translate3d(-20vw, 0, 0);
    left: env(safe-area-inset-left) !important;
    width: calc(100vw - env(safe-area-inset-left)) !important;
  }
}

@media (max-width: 925px) {
  .left-column {
    position: fixed;
    left: 0;
    top: 0;
    height: calc(1vh*100);
    width: 26.5rem !important;
    transform: translate3d(-5rem, 0, 0);
    transition: transform 300ms cubic-bezier(0.33, 1, 0.68, 1);
  }
}*/

.middle-column {
  display: flex;
  justify-content: center;
  height: 100%;
  position: relative;
  z-index: 1;
  min-width: 0;
}

.middle-column-container {
  border-left: 0.0625rem solid var(--color-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>