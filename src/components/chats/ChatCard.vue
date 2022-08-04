<script>
import { defineComponent } from "vue";
import { useChatsStore } from "../../stores/chats";
import { useApiStore } from "../../stores/api";
import { useAuthUserStore } from "../../stores/user";
import { formatDate } from "../../util/dateFormat";

export default defineComponent({
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
    chat: Object
  },
  computed: {
    targetUser() {
      if (this.chat.sender._id === this.authUserStore.id)
        return this.chat.receiver

      return this.chat.sender
    },
    lastMessage() {
      if (this.chat.messages && this.chat.messages.length >= 1)
        return this.chat.messages[0];

      return null;
    }
  },
})
</script>

<template>
  <div class="card">
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

      <div class="meta-info">
        <div class="time-info">
          <span v-if="lastMessage">{{ formatDate(lastMessage.sentAt) }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
  .card {
    border-radius: 20px;
    background-color: var(--vt-c-main-vulkan);
    transition: background-color 300ms;
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
  }

  .card:hover {
    background-color: var(--vt-c-secondary-steel-gray);
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