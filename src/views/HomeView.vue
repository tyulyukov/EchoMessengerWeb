<script>
import { defineComponent } from "vue";
import { useAuthUserStore } from "../stores/user";
import { useChatsStore } from "../stores/chats";
import { useApiStore } from "../stores/api";
import { useOnlineStore } from "../stores/online";
import ChatsList from "../components/chats/ChatsList.vue";
import SelectChatView from "./chats/SelectChatView.vue";
import ChatView from "./chats/ChatView.vue";
import SettingsList from "../components/settings/SettingsList.vue";
import MyAccountSettingsView from "./settings/MyAccountSettingsView.vue";
import createSocket from "../util/socket";

export default defineComponent({
  components: { MyAccountSettingsView, SettingsList, SelectChatView, ChatsList, ChatView },
  emits: ['openChats', 'openSettings'],
  setup() {
    const apiStore = useApiStore()
    const authUserStore = useAuthUserStore()
    const chatsStore = useChatsStore()
    const onlineStore = useOnlineStore()

    const socket = createSocket(apiStore.serverUrl, apiStore.jwt)

    return {
      authUserStore,
      chatsStore,
      onlineStore,
      apiStore,
      socket
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
    const onlineStore = useOnlineStore()
    const chatsStore = useChatsStore()
    const authUserStore = useAuthUserStore()

    this.socket.on('users online', function (users) {
      onlineStore.usersConnected(users)
    })

    this.socket.on('user connected', function (user) {
      onlineStore.userConnected(user)
    })

    this.socket.on('user disconnected', function (user) {
      onlineStore.userDisconnected(user)
    })

    this.socket.on('chat created', function (chat) {
      chatsStore.addChat(chat)
    })

    this.socket.on('message sent', function (message) {
      if (!chatsStore.chats)
        return

      for (let i = 0; i < chatsStore.chats.length; i++) {
        if (chatsStore.chats[i]._id === message.chat._id || chatsStore.chats[i]._id === message.chat) {
          let messageIndex = chatsStore.chats[i].messages.findIndex(e => e._id === message._id)
          message.sent = true

          if (messageIndex == -1) {
            chatsStore.chats[i].messages.push(message)

            if (message.sender._id !== authUserStore.id)
              chatsStore.chats[i].unreadMessagesCount++
          }
          else {
            chatsStore.chats[i].messages[messageIndex] = message
          }
          break
        }
      }
    })

    // TODO on send message failed add attribute to a message 'sendFailed'

    this.socket.on('message edited', function (message) {
      if (!chatsStore.chats)
        return

      for (let i = 0; i < chatsStore.chats.length; i++) {
        if (chatsStore.chats[i]._id === message.chat._id || chatsStore.chats[i]._id === message.chat) {
          let messageIndex = chatsStore.chats[i].messages.findIndex(e => e._id === message._id)

          if (messageIndex >= 0)
            chatsStore.chats[i].messages[messageIndex] = message

          break
        }
      }
    })

    this.socket.on('message deleted', function (targetUserId, messageId) {
      if (!chatsStore.chats)
        return

      for (let i = 0; i < chatsStore.chats.length; i++) {
        if (chatsStore.chats[i].receiver._id === targetUserId || chatsStore.chats[i].sender._id === targetUserId) {
          let messageIndex = chatsStore.chats[i].messages.findIndex(e => e._id === messageId)

          if (messageIndex >= 0)
            chatsStore.chats[i].messages.splice(messageIndex, 1)

          break
        }
      }
    })

    this.socket.on('message read', function (targetUserId, messageId) {
      if (!chatsStore.chats)
        return

      for (let i = 0; i < chatsStore.chats.length; i++) {
        if (chatsStore.chats[i].receiver._id === targetUserId || chatsStore.chats[i].sender._id === targetUserId) {
          let messageIndex = chatsStore.chats[i].messages.findIndex(e => e._id === messageId)

          if (messageIndex >= 0)
            chatsStore.chats[i].messages[messageIndex].haveSeen = true

          break
        }
      }
    })

    let typingTimer;

    this.socket.on('user typing', function(targetUserId) {
      if (!chatsStore.chats)
        return

      for (let i = 0; i < chatsStore.chats.length; i++) {
        if (chatsStore.chats[i].receiver._id === targetUserId || chatsStore.chats[i].sender._id === targetUserId) {
          chatsStore.chats[i].userTyping = true;
          clearTimeout(typingTimer);
          typingTimer = setTimeout(() => {
            chatsStore.chats[i].userTyping = false;
          }, 3100);
          break
        }
      }
    })

    this.socket.connect();

    this.confirmJwt()
    this.loadChats()
  },
  unmounted() {
    this.socket.disconnect()
  }
})
</script>

<template>
  <div v-if="!authUserStore.loggedIn" class="center">
    <div class="spinner-border"></div>
  </div>
  <div v-else class="columns">
    <div class="left-column">
      <ChatsList v-if="this.openedTab == this.chatsTabName" @openSettings="openSettings" />
      <SettingsList v-else-if="this.openedTab == this.settingsTabName" @openChats="openChats" />
    </div>
    <div class="middle-column">
      <div class="middle-column-container">
        <SelectChatView v-if="this.openedTab == this.chatsTabName && !chatsStore.$state.selectedChatId" />
        <ChatView v-else-if="this.openedTab == this.chatsTabName"
                  :socket="this.socket"
                  :chat="chatsStore.getChatById(chatsStore.$state.selectedChatId)" />
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
  transition: 300ms;
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

@media (max-width: 600px) {
  .columns {
    overflow: hidden;
  }

  .left-column {
    width: 100vw;
    max-width: none;
    position: fixed;
    transition: 350ms ease;
    transform: translateX(0vw);
  }

  .middle-column {
    width: 100vw;
    max-width: none;
    transition: 350ms ease;
    position: fixed;
    transform: translateX(100vw);
  }

  .left-column-closed .left-column {
    transform: translateX(-100vw);
  }

  .left-column-closed .middle-column {
    display: flex !important;
    transform: translateX(0vw);
  }

  .button-close-chat {
    display: flex !important;
  }
}

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