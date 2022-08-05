<script>
import { defineComponent } from "vue";
import { useChatsStore } from "../stores/chats";
import { useApiStore } from "../stores/api";
import { formatDate } from "../util/dateFormat";

export default defineComponent({
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
    }
  }
})
</script>

<template>
  <div class="chat-info-row">
    <div class="chat-info-container">
      <div class="chat-info">
        <div class="avatar" v-bind:style="'background-image: url(' + apiStore.combineUrl(targetUser.avatarUrl) + ')'"></div>

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
          <div class="messages">
<!--            <div class="message" v-for="i in 50">{{i}}</div>-->
          </div>
        </div>
      </div>
    </div>

    <div class="messages-footer">
      <div class="send-message-panel">
        <div class="send-message-container">
          <div class="send-message-input">
            <img class="send-message-attachments-button selectable" src="../assets/img/attachment.png">
            <div contenteditable="true" class="send-message-input-text"></div>
            <img class="send-message-button selectable" src="../assets/img/send.png">
          </div>
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

.avatar {
  --avatar-diameter: 2.5rem !important;
  min-width: var(--avatar-diameter);
  min-height: var(--avatar-diameter);
  max-width: var(--avatar-diameter);
  max-height: var(--avatar-diameter);
  margin-right: 0.625rem;
  height: 2.5rem !important;
  background-size: cover;
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
  /*display: flex;
  flex-direction: column;
  align-items: center;*/
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
  bottom: calc(0px - env(safe-area-inset-bottom));
}

.messages {
  width: 100%;
  max-width: 45.5rem;
  min-height: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  padding: 1rem 1rem 0 1.125rem;
}

.message {
  padding: 5px;
  background-color: var(--vt-c-blue);
  color: var(--vt-c-white);
  margin: 5px;
  border-radius: 20%;
  display: flex;
  align-items: flex-end;
  position: relative;
}

.messages-footer {
  transform: translateY(-60px);
  width: 100%;
  /*max-width: 45.5rem;*/
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 0 1rem env(safe-area-inset-bottom) 1rem;
  top: env(safe-area-inset-bottom);
}

.send-message-panel {
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  margin-bottom: 1.25rem;
  align-items: flex-end;
}

.send-message-container {
  flex-grow: 1;
  max-width: calc(100% - 4rem);
  box-shadow: 0 2px 2px var(--vt-c-black);
  background: var(--vt-c-secondary-steel-gray);
  border-radius: 0.75rem;
  padding: 0.35rem;
}

.send-message-input {
  display: flex;
}

.send-message-attachments-button, .send-message-button {
  width: 30px;
  height: 30px;
}

.send-message-input-text {
  flex-grow: 1;
  display: block;
  background-color: var(--vt-c-secondary-steel-gray);
  color: var(--vt-c-white);
  border: none;
  font-weight: lighter;
  /*font-size: 10.4pt;*/
  resize: none;
  text-align: left;
  overflow: auto;
  max-height: 6rem;
  padding: 2px;
}

.send-message-input-text:focus {
  outline: none !important;
  border: none;
}
</style>