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
    isOnline: {
      type: Boolean,
      required: true
    },
    chatId: {
      type: String,
      required: true
    },
  },
  methods: {
    getStatusIconClass() {
      let classList = ''

      if (this.isOnline)
        classList += 'online-status-icon'
      else
        classList += 'offline-status-icon'

      if (this.chatsStore.$state.selectedChatId && this.chatsStore.$state.selectedChatId == this.chatId)
        classList += ' status-active'

      return classList
    }
  }
})
</script>

<template>
  <div class="status-icon-container">
    <div v-bind:class="getStatusIconClass()">

    </div>
  </div>

</template>

<style scoped>
.status-icon-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.online-status-icon, .offline-status-icon {
  position: absolute;
  --diameter: 0.525rem;
  width: var(--diameter);
  height: var(--diameter);
  border-radius: 50%;
  transition: 300ms ease;
  right: 0;
  bottom: 0;
  outline: var(--vt-c-main-vulkan) solid 0.2rem;
}

.offline-status-icon {
  background-color: var(--vt-c-text-dark-2);
}

.online-status-icon {
  background-color: var(--vt-c-active-wild-watermelon);
}

.offline-status-icon.status-active {
  background-color: var(--vt-c-white);
}

.online-status-icon.status-active {
  background-color: #FF1493;
}

.status-active {
  outline-color: var(--vt-c-blue);
}
</style>