<script>
import { defineComponent } from "vue";
import { useChatsStore } from "../../stores/chats";

export default defineComponent({
  setup() {
    const chatsStore = useChatsStore()

    return {
      chatsStore
    }
  },
  props: {
    chatId: {
      type: String,
      required: true
    },
    notificationsCount: {
      type: Number,
      required: true
    }
  },
  computed: {
    notifications() {
      if (this.notificationsCount < 1000)
        return this.notificationsCount

      return '999+'
    }
  },
  methods:{
    getBadgeClass() {
      if (this.chatsStore.$state.selectedChatId && this.chatsStore.$state.selectedChatId == this.chatId)
        return "badge badge-active"

      return "badge"
    }
  }
})
</script>

<template>
  <div v-bind:class="getBadgeClass()">
    <span>{{ notifications }}</span>
  </div>
</template>

<style scoped>
.badge {
  text-align: center;
  border-radius: 3.875rem;
  width: 100%;
  background-color: red;
  color: var(--vt-c-white);
  transition: 300ms ease;
}

.badge-active {
  background-color: var(--vt-c-white);
  color: var(--vt-c-blue);
}
</style>