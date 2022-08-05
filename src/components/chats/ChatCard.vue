<script>
import { defineComponent } from "vue";
import { useChatsStore } from "../../stores/chats";
import { useApiStore } from "../../stores/api";
import { useAuthUserStore } from "../../stores/user";
import { formatDate } from "../../util/dateFormat";
import CheckMarks from "./CheckMarks.vue";
import NotificationBadge from "./NotificationBadge.vue";

export default defineComponent({
  components: { NotificationBadge, CheckMarks },
  setup() {
    const chatsStore = useChatsStore()
    const apiStore = useApiStore()
    const authUserStore = useAuthUserStore()

    return {
      chatsStore,
      apiStore,
      authUserStore,
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
        return this.chat.messages[0];

      return null;
    },
    targetUser() {
      return this.chatsStore.getTargetUser(this.chat)
    }
  },
  methods:{
    getCardClass() {
      if (this.chatsStore.$state.selectedChat && this.chatsStore.$state.selectedChat._id == this.chat._id)
        return "card card-active"

      return "card"
    }
  }
})
</script>

<template>
  <div @click="chatsStore.selectChat(this.chat)" v-bind:class="getCardClass()">
    <div class="avatar" v-bind:style="'background-image: url(' + apiStore.combineUrl(targetUser.avatarUrl) + ')'"></div>

    <div class="card-body">

      <div class="activity">
        <div class="username">
          <p>{{ targetUser.username }}</p>
        </div>
        <div class="last-activity">
          <p v-if="lastMessage">{{ lastMessage.content }}<span class="muted" v-if="lastMessage.edits.length > 0"> edited</span></p>
          <p class="muted" v-else>Start the conversation</p>
        </div>
      </div>

      <div v-if="lastMessage" class="meta-info">
        <div class="time-info">
          <span>{{ formatDate(lastMessage.sentAt) }}</span>
        </div>
        <div class="additional-info">
          <NotificationBadge v-if="this.chat.unreadMessagesCount > 0"
                             :chat="this.chat" />
          <CheckMarks v-else-if="lastMessage.sender._id === this.authUserStore.id"
                      :haveSeen="lastMessage.haveSeen"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .card {
    border-radius: 20px;
    background-color: var(--vt-c-main-vulkan);
    transition: 300ms ease;
    padding: 15px;
    display: flex;
    width: 100%;
    max-width: 100%;
    min-width: 100%;
    cursor: pointer;
  }

  .card .avatar {
    --avatar-diameter: 50px;
    min-width: var(--avatar-diameter);
    min-height: var(--avatar-diameter);
    max-width: var(--avatar-diameter);
    max-height: var(--avatar-diameter);
    background-size: cover;
    border-radius: 50%;
    border: 2px solid var(--vt-c-divider-dark-1);
    margin-right: 10px;
    transition: 300ms ease;
  }

  .card:not(.card-active):hover {
    background-color: var(--vt-c-secondary-steel-gray);
  }

  .card-active {
    background-color: var(--vt-c-blue);
  }

  .card-active .avatar {
    border: 2px solid var(--vt-c-white);
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


</style>