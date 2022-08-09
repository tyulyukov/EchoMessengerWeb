<script>
import { defineComponent } from "vue";
import { useChatsStore } from "../../stores/chats";
import { useApiStore } from "../../stores/api";
import { formatDate } from "../../util/dateFormat";
import MessageCard from "../../components/chats/MessageCard.vue";

export default defineComponent({
  components: { MessageCard },
  setup() {
    const chatsStore = useChatsStore()
    const apiStore = useApiStore()

    return {
      chatsStore,
      apiStore,
      formatDate
    }
  },
  props: {
    chat: {
      type: Object,
      required: true
    }
  },
  computed: {
    targetUser() {
      return this.chatsStore.getTargetUser(this.chat)
    },
  },
  methods: {
    scrollChanged(event) {
      if (event.target.offsetTop )
      console.log(event)
    }
  }
})
</script>

<template>
  <div class="chat-info-row">
    <div class="chat-info-container">
      <div class="chat-info">
        <div class="avatar" v-bind:style="'background-image: url(' + targetUser.avatarUrl + ')'"></div>

        <div class="info">
          <span class="username">{{ targetUser.username }}</span>
          <span class="offline-status"><span class="status-icon">•</span> last online {{ this.formatDate(targetUser.lastOnlineAt) }}</span>
        </div>
      </div>
    </div>
  </div>

  <div class="chat-row">
    <div class="messages-container">
      <div class="messages-wrapper">
        <div class="messages-list">
          <div @wheel="scrollChanged" class="messages">
            <MessageCard v-for="message in chat.messages"
                         :key="message._id"
                         :message="message" />
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
          <div contenteditable="true" class="send-message-input-text"></div>
          <img class="send-message-button selectable" src="../../assets/img/send.png">
        </div>
      </div>
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

.username {
  font-size: 1.125rem;
  line-height: 1.375rem;
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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

.messages {
  width: 100%;
  min-height: 100%;
  padding: 0.25rem 2rem;
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
  max-height: 6rem;
  padding: 0 0.5rem;
}

.send-message-input-text:focus {
  outline: none !important;
  border: none;
}
</style>