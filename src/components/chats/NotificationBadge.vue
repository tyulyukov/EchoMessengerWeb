<script>
import { defineComponent } from "vue";
import {useChatsStore} from "../../stores/chats";

export default defineComponent({
  setup() {
    const chatsStore = useChatsStore()

    return {
      chatsStore
    }
  },
  props: {
    chat: {
      type: Object,
      required: true
    },
  },
  computed: {
    notifications() {
      if (this.chat.unreadMessagesCount < 1000)
        return this.chat.unreadMessagesCount

      return '999+'
    }
  },
  methods:{
    getBadgeClass() {
      if (this.chatsStore.$state.selectedChat == this.chat._id)
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
  border-radius: 43%;
  width: 100%;
  background-color: red;
  transition: 300ms;
  color: var(--vt-c-white);
  transition: 300ms ease;
}

.badge-active {
  background-color: var(--vt-c-white);
  color: var(--vt-c-blue);
}
</style>