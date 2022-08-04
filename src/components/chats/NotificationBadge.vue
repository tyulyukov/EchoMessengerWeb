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
      return this.chat.unreadMessagesCount
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
    <div class="center">
      {{ notifications }}
    </div>
  </div>
</template>

<style scoped>
.badge {
  padding: 0px 15px;
  border-radius: 43%;
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