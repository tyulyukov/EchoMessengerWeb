<script>
import { defineComponent } from "vue";
import { useChatsStore } from "../../stores/chats";
import { useApiStore } from "../../stores/api";
import { useAuthUserStore } from "../../stores/user";
import { formatDate } from "../../util/dateFormat";
import CheckMarks from "./CheckMarks.vue";
import NotificationBadge from "./NotificationBadge.vue";
import OnlineStatus from "./OnlineStatus.vue";
import {useOnlineStore} from "../../stores/online";
import UserTypingIndicator from "./UserTypingIndicator.vue";

export default defineComponent({
  components: { UserTypingIndicator, NotificationBadge, CheckMarks, OnlineStatus },
  setup() {
    const chatsStore = useChatsStore()
    const apiStore = useApiStore()
    const authUserStore = useAuthUserStore()
    const onlineStore = useOnlineStore()

    return {
      chatsStore,
      apiStore,
      authUserStore,
      onlineStore,
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
    lastMessage() {
      if (this.chat.messages && this.chat.messages.length >= 1)
        return this.chat.messages[this.chat.messages.length - 1];

      return null;
    },
    targetUser() {
      return this.chatsStore.getTargetUser(this.chat)
    }
  },
  methods:{
    getCardClass() {
      if (this.chatsStore.$state.selectedChatId && this.chatsStore.$state.selectedChatId == this.chat._id)
        return "card card-active"

      return "card"
    },
    cardClick() {
      this.chatsStore.selectChat(this.chat)

      let columns = document.getElementsByClassName('columns')[0]
      if (!columns.classList.contains('left-column-closed'))
        columns.classList.add('left-column-closed')
    }
  }
})
</script>

<template>
  <div @click="cardClick" v-bind:class="getCardClass()">
    <div class="avatar" v-bind:style="'background-image: url(' + targetUser.avatarUrl + ')'">
      <OnlineStatus :chatId="this.chat._id"
                    :isOnline="onlineStore.isUserOnline(targetUser._id)" />
    </div>

    <div class="card-body">

      <div class="activity">
        <div class="username">
          <p>{{ targetUser.username }}</p>
        </div>
        <div class="last-activity">
          <span class="user-typing" v-if="chat.userTyping">
            <UserTypingIndicator />
            typing
          </span>
          <p v-else-if="lastMessage">{{ lastMessage.content }}<span class="muted" v-if="lastMessage.edits.length > 0"> edited</span></p>
          <p class="muted" v-else>Start the conversation</p>
        </div>
      </div>

      <div v-if="lastMessage && lastMessage.sent == false" class="meta-info">
        <div class="spinner-border"></div>
      </div>
      <div v-else-if="lastMessage" class="meta-info">
        <div class="time-info">
          <span>{{ formatDate(lastMessage.sentAt) }}</span>
        </div>
        <div class="additional-info">
          <NotificationBadge v-if="this.chat.unreadMessagesCount > 0"
                             :chatId="this.chat._id"
                             :notifications-count="this.chat.unreadMessagesCount" />
          <CheckMarks v-else-if="lastMessage.sender._id === this.authUserStore.id"
                      :haveSeen="lastMessage.haveSeen"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .card {
    border-radius: 1.25rem;
    background-color: var(--vt-c-main-vulkan);
    transition: 300ms ease;
    padding: 0.95rem;
    display: flex;
    width: 100%;
    max-width: 100%;
    min-width: 100%;
    cursor: pointer;
  }

  .card .avatar {
    --avatar-diameter: 3.125rem;
    min-width: var(--avatar-diameter);
    min-height: var(--avatar-diameter);
    max-width: var(--avatar-diameter);
    max-height: var(--avatar-diameter);
    background-size: cover;
    background-position: center;
    border-radius: 50%;
    border: 0.125rem solid var(--vt-c-divider-dark-1);
    margin-right: 0.625rem;
    transition: 300ms ease;
  }

  .card:not(.card-active):hover {
    background-color: var(--vt-c-secondary-steel-gray);
  }

  .card-active {
    background-color: var(--vt-c-blue);
  }

  .card-active .avatar {
    border: 0.125rem solid var(--vt-c-white);
  }

  .card-body {
    display: flex;
    justify-content: space-between;
    width: 100%;
    overflow: hidden;
  }

  .card-body div {
    display: inline-block;
  }

  .card-body div div {
    display: block;
    overflow: hidden;
  }

  .activity {
    overflow: hidden;
  }

  .activity div p {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .meta-info {
    justify-content: right;
  }

  .meta-info .spinner-border {
    --diameter: 1rem;
    width: var(--diameter);
    height: var(--diameter);
    margin-top: 0.35rem;
  }

  .user-typing {
    color: var(--vt-c-active-wild-watermelon);
  }

  .user-typing .typing-indicator {
    display: inline-flex;
  }
</style>