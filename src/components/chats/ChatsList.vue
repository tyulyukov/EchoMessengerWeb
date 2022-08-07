<script>
import { defineComponent } from "vue";
import { useChatsStore } from "../../stores/chats";
import ChatCard from "./ChatCard.vue";
import { useAuthUserStore } from "../../stores/user";
import { useApiStore } from "../../stores/api";

export default defineComponent({
  components: { ChatCard },
  setup() {
    const chatsStore = useChatsStore()
    const authUserStore = useAuthUserStore()
    const apiStore = useApiStore()

    return {
      chatsStore,
      authUserStore,
      apiStore
    }
  },
  computed: {
    sortedChats() {
      if (!this.authUserStore.loggedIn)
        return []

      let chats = this.chatsStore.$state.chats

      if (!chats || chats.length == 0)
        return []

      chats.sort((a,b) => {
        let aLastSentAt, bLastSentAt;

        if (a.messages && a.messages.length > 0)
          aLastSentAt = new Date(a.messages[0].sentAt)
        else
          aLastSentAt = new Date(a.createdAt)

        if (b.messages && b.messages.length > 0)
          bLastSentAt = new Date(b.messages[0].sentAt)
        else
          bLastSentAt = new Date(b.createdAt)

        return bLastSentAt.getTime() - aLastSentAt.getTime()
      })

      return chats
    }
  }
})
</script>

<template>
  <div>
    <div class="search-header">
      <div @click="$emit('openSettings')" class="settings-button selectable" v-bind:style="'background-image: url(' + apiStore.combineUrl(authUserStore.avatarUrl) + ')'"></div>

      <form class="search-form">
        <input :disabled="chatsStore.$state.loading || chatsStore.$state.error || chatsStore.$state.internalError" class="search" type="text" placeholder="   &#xF002;  Search" style="font-family:Arial, FontAwesome" />
      </form>
    </div>

    <div class="chats-list">
      <div v-if="chatsStore.$state.loading" class="center">
        <div class="spinner-border"></div>
      </div>
      <div v-else-if="chatsStore.$state.error" class="center">
        <img class="selectable"
             @click="chatsStore.loadChats"
             src="/src/assets/img/refresh.png"
             style="width: 2.125rem; height: 2.125rem"/>
      </div>
      <ChatCard v-else-if="sortedChats && sortedChats.length > 0"
                v-for="chat in sortedChats"
                :key="chat._id"
                :chat="chat" />
    </div>
  </div>
</template>

<style>
.search-header {
  padding-bottom: 2rem;
  display: flex;
}

.search-header .settings-button {
  --avatar-diameter: 2.25rem !important;
  min-width: var(--avatar-diameter);
  min-height: var(--avatar-diameter);
  max-width: var(--avatar-diameter);
  max-height: var(--avatar-diameter);
  background-size: cover;
  border-radius: 50%;
  border: 1px solid var(--vt-c-divider-dark-1);
  transition: 300ms ease;
  cursor: pointer;
  margin-right: 0.55rem;
}

.search-form {
  width: 100%;
}

.search {
  width: 100%;
  height: 100%;
  border-radius: 0.9375rem;
  display: block;
  background-color: var(--vt-c-secondary-steel-gray);
  color: var(--vt-c-white);
  border: none;
  font-weight: lighter;
  font-size: 13pt;
  text-align: left;
  transition: border 0.2s;
}

.search:focus {
  outline: none !important;
  border: none;
}

.chats-list {
  padding-bottom: 2rem;
  overflow: auto;
  width: 100%;
}
</style>