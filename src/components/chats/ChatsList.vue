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
})
</script>

<template>
  <div class="search-header">
    <form class="search-form">
      <input type="text" class="search">
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
              v-for="chat in chatsStore.$state.chats"
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