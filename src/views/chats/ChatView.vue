<script>
import { defineComponent, ref } from "vue";
import { useChatsStore } from "../../stores/chats";
import { useApiStore } from "../../stores/api";
import { useAuthUserStore } from "../../stores/user";
import { useOnlineStore } from "../../stores/online";
import { formatDate } from "../../util/dateFormat";
import MessageCard from "../../components/chats/MessageCard.vue";
import DateCard from "../../components/DateCard.vue";
import { v4 as uuidv4 } from 'uuid';
import { isNullOrWhiteSpace } from "../../util/validation";
import UserTypingIndicator from "../../components/chats/UserTypingIndicator.vue";

export default defineComponent({
  components: { UserTypingIndicator, MessageCard, DateCard },
  setup() {
    const chatsStore = useChatsStore()
    const apiStore = useApiStore()
    const onlineStore = useOnlineStore()
    const authUserStore = useAuthUserStore()

    return {
      chatsStore,
      apiStore,
      onlineStore,
      authUserStore,
      formatDate
    }
  },
  props: {
    chat: {
      type: Object,
      required: true
    },
    socket: {
      type: Object,
      required: true
    }
  },
  computed: {
    targetUser() {
      return this.chatsStore.getTargetUser(this.chat)
    },
    unreadMessages() {
      return this.chat.messages.filter(e => e.haveSeen == false && e.sender._id !== this.authUserStore.id)
    },
    getStatusClass() {
      return this.onlineStore.isUserOnline(this.targetUser._id) ? "online-status" : "offline-status"
    }
  },
  methods: {
    scrollChanged(event) {
      let messagesContainer = document.getElementById('messages-list')
      this.chat.scrollBottom = messagesContainer.scrollHeight - messagesContainer.scrollTop

      this.readMessages()

      if (event.target.scrollTop === 0 && !this.chat.allMessagesLoaded) {
        let lastMessage = this.chat.messages[0]
        let lastMessageContainer = undefined

        if (lastMessage)
          lastMessageContainer = document.getElementById('message-' + lastMessage._id)

        this.loadMessages(function () {
          if (lastMessageContainer)
            lastMessageContainer.scrollIntoView()
        })
      }
    },
    readMessages() {
      let messagesContainer = document.getElementById('messages-list')

      if (!this.chat.loadingMessages) {
        for (const unreadMessage of this.unreadMessages) {
          const messageContainer = document.getElementById('message-' + unreadMessage._id)

          if (messageContainer) {
            const position = messageContainer.getBoundingClientRect()
            const containerPosition = messagesContainer.getBoundingClientRect()

            if (position.top + position.height > containerPosition.top
             && position.bottom - position.height <= containerPosition.bottom) {
              /*console.log(unreadMessage.content, 'is partially visible in screen');*/

              this.socket.emit('read message', unreadMessage._id)

              if (this.chat.unreadMessagesCount && this.chat.unreadMessagesCount > 0)
                this.chat.unreadMessagesCount--

              let messageIndex = this.chat.messages.findIndex(e => e._id === unreadMessage._id)

              if (messageIndex >= 0)
                this.chat.messages[messageIndex].haveSeen = true;
            }
          }
        }
      }
    },
    loadMessages(callback) {
      this.chatsStore.loadMessages(this.chat, callback)
    },
    handleInputDraftMessage(event) {
      this.chat.draftMessage = event.target.value
    },
    handleKeyUp(event) {
      if (!this.chat.lastTypingAt || this.chat.lastTypingAt.getTime() + 3000 < new Date().getTime() ) {
        this.chat.lastTypingAt = new Date()
        this.socket.emit('user typing', this.targetUser._id)
      }

      if (event.keyCode == 13)
        this.sendMessage()
    },
    sendMessage() {
      const content = this.chat.draftMessage.trim()
      this.chat.draftMessage = ''

      if (isNullOrWhiteSpace(content))
        return

      const messageId = uuidv4()

      this.socket.emit('send message', messageId, this.chat._id, content)

      const message = {
        _id: messageId,
        content: content,
        sent: false,
        haveSeen: false,
        sentAt: new Date(),
        editedAt: new Date(),
        edits: [],
        sender: {
          _id: this.authUserStore.id
        }
      }

      this.chat.messages.push(message)
    },
    closeChat() {
      let leftColumn = document.getElementsByClassName('left-column')[0]
      if (leftColumn.classList.contains('closed'))
        leftColumn.classList.remove('closed')
    }
  },
  mounted() {
    if (!this.chat.viewLoaded) {
      this.chat.viewLoaded = true
      let chatId = this.chat._id
      let readMessages = this.readMessages

      let anchor = document.getElementById('bottom-anchor')

      this.loadMessages(function () {
        anchor.scrollIntoView()

        /*setTimeout(function() {
          anchor.scrollIntoView()
        }, 1);*/

        setTimeout(function() {
          anchor.scrollIntoView()

          const chatsStore = useChatsStore()
          if (chatsStore.selectedChatId === chatId)
            readMessages()
        }, 10);
      })
    }
  },
  updated() {
    if (this.chat.scrollBottom) {
      let messagesContainer = document.getElementById('messages-list')
      messagesContainer.scrollTop = messagesContainer.scrollHeight - this.chat.scrollBottom
    }

    if (!this.chat.loadingMessages)
      this.readMessages()

    if (!this.chat.viewLoaded) {
      this.chat.viewLoaded = true
      let chatId = this.chat._id
      let readMessages = this.readMessages

      let anchor = document.getElementById('bottom-anchor')

      this.loadMessages(function () {
        anchor.scrollIntoView()

        /*setTimeout(function() {
          anchor.scrollIntoView()
        }, 1);
*/
        setTimeout(function() {
          anchor.scrollIntoView()

          const chatsStore = useChatsStore()
          if (chatsStore.selectedChatId === chatId)
            readMessages()
        }, 10);
      })
    }
  }
})
</script>

<template>
  <div class="chat-info-row">
    <div class="chat-info-container">
      <img @click="closeChat"
           class="button-close-chat"
           src="../../assets/img/arrow-down.png"
           alt="Back to chats"/>

      <div class="chat-info">
        <div class="avatar" v-bind:style="'background-image: url(' + targetUser.avatarUrl + ')'"></div>

        <div class="info">
          <span class="username">{{ targetUser.username }}</span>
          <span v-bind:class="getStatusClass">
            <span v-if="chat.userTyping">
              <UserTypingIndicator />
              typing
            </span>
            <span v-else>
              <span class="status-icon">• </span>
              <span v-if="onlineStore.isUserOnline(this.targetUser._id)">online</span>
              <span v-else>last online {{ this.formatDate(targetUser.lastOnlineAt) }}</span>
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>

  <div class="chat-row">
    <div class="messages-container">
      <div class="messages-wrapper">
        <div @scroll="scrollChanged" id="messages-list" class="messages-list">
          <div id="messages">
            <DateCard v-if="chat.allMessagesLoaded" :date="new Date(chat.createdAt)" />
            <div v-if="chat.allMessagesLoaded" class="messages-chat-info">
              <div class="avatar" v-bind:style="'background-image: url(' + targetUser.avatarUrl + ')'"></div>

              <div class="username">{{ targetUser.username }}</div>
              <p class="note">This is the beginning of your direct messages with this user.</p>
            </div>

            <MessageCard v-for="message in chat.messages"
                         :key="message._id"
                         :chat="chat"
                         :message="message" />
            <div id="bottom-anchor"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="send-message-row">
    <div class="send-message-panel">
      <div class="send-message-container">
        <div class="send-message-input">
          <img class="send-message-attachments-button selectable" src="../../assets/img/attachment.png">
          <input @keyup="handleKeyUp" @input="handleInputDraftMessage" v-bind:value="this.chat.draftMessage" type="text" class="send-message-input-text" />
          <img @click="sendMessage" class="send-message-button selectable" src="../../assets/img/send.png">
        </div>
      </div>
    </div>
  </div>

  <div v-if="this.chat.loadingMessages" class="loading-background">
    <div class="center">
      <div class="spinner-border"></div>
    </div>
  </div>
</template>

<style scoped>
.chat-info-row {
  display: flex;
  align-items: center;
  width: 100%;
  box-shadow: 0 2px 2px var(--vt-c-black);
  background: var(--vt-c-secondary-steel-gray);
  position: relative;
  padding: 0.5rem max(0.8125rem, env(safe-area-inset-right)) 0.5rem max(1.5rem, env(safe-area-inset-left));
}

.chat-info-container {
  overflow: hidden;
  display: flex;
}

.chat-info {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  overflow: hidden;
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

.chat-info .avatar {
  --avatar-diameter: 2.5rem !important;
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

.messages-chat-info .avatar {
  --avatar-diameter: 8rem;
  min-width: var(--avatar-diameter);
  min-height: var(--avatar-diameter);
  max-width: var(--avatar-diameter);
  max-height: var(--avatar-diameter);
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  border: 0.125rem solid var(--vt-c-divider-dark-1);
  transition: 300ms ease;
}

.username {
  font-size: 1.125rem;
  line-height: 1.375rem;
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.messages-chat-info .username {
  font-size: 2rem;
  line-height: 2.1rem;
}

.online-status, .offline-status {
  font-size: .825rem;
  line-height: 1.125rem;
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: 300ms ease;
}

.offline-status {
  color: var(--vt-c-text-dark-2);
}

.online-status {
  color: var(--vt-c-active-wild-watermelon);
}

.status-icon {
  font-size: 14pt;
}

.chat-row {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.messages-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}

.messages-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}

.messages-list {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  margin-bottom: 0.5rem;
  position: relative;
}

/*noinspection CssInvalidPropertyValue*/
@supports (overflow: overlay) {
  .messages-list {
    overflow-y: overlay;
  }
}

#messages {
  width: 100%;
  min-height: 100%;
  padding: 0.5rem 2rem;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
}

.send-message-row {
  width: 100%;
  position: relative;
  display: flex;
  align-items: flex-end;
}

.send-message-panel {
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  margin-bottom: 1.25rem;
  align-items: flex-end;
  padding: 0 2rem;
}

.send-message-container {
  flex-grow: 1;
  box-shadow: 0 2px 2px var(--vt-c-black);
  background: var(--vt-c-secondary-steel-gray);
  border-radius: 0.75rem;
  padding: 0.35rem;
}

.send-message-input {
  display: flex;
}

.send-message-attachments-button, .send-message-button {
  --size: 1.75rem;
  width: var(--size);
  height: var(--size);
}

.send-message-input-text {
  flex-grow: 1;
  display: block;
  background-color: var(--vt-c-secondary-steel-gray);
  color: var(--vt-c-white);
  border: none;
  font-weight: lighter;
  resize: none;
  text-align: left;
  overflow: auto;
  word-break: break-word;
  white-space: pre-wrap;
  max-height: 6rem;
  padding: 0 0.5rem;
}

.send-message-input-text:focus {
  outline: none !important;
  border: none;
}

.loading-background {
  background-color: rgba(0, 0, 0, 0.5);
  height: 100%;
  overflow: hidden;
  position: absolute;
  width: 100%;
  z-index: 999;
}
</style>