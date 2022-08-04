<script>
import { defineComponent } from "vue";
import { useChatsStore } from "../../stores/chats";
import ChatCard from "./ChatCard.vue";

export default defineComponent({
  components: {ChatCard},
  setup() {
    const chatsStore = useChatsStore()

    return {
      chatsStore
    }
  },
  computed: {
    sortedChats() {
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
  <div class="search-header">
    <form class="search-form">
      <input :disabled="chatsStore.$state.loading" class="search" type="text" placeholder="   &#xF002;  Search" style="font-family:Arial, FontAwesome" />
    </form>
  </div>

  <div class="chats-list">
    <div v-if="chatsStore.$state.loading" class="center">
      <div class="spinner-border"></div>
    </div>
    <div v-if="chatsStore.$state.error" class="center">
      <img class="selectable"
           @click="chatsStore.loadChats"
           src="src/assets/img/refresh.png"
           style="width: 35px; height: 35px"/>
    </div>
    <ChatCard v-else-if="chatsStore.$state.chats"
              v-for="chat in sortedChats"
              :key="chat._id"
              :chat="chat" />
  </div>
</template>

<style>
.search-header {
  padding-bottom: 2rem;
  height: 4.5rem;
}

.search-form {
  width: 100%;
  height: 100%;
}

.search {
  width: 100%;
  height: 100%;
  border-radius: 15px;
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
  /*box-shadow: 0 0 5px #719ECE;*/
}

.chats-list {
  padding-bottom: 2rem;
  overflow: auto;
  width: 100%;
}
</style>