<script>
import { defineComponent } from "vue";
import { useApiStore } from "../../stores/api";
import { useChatsStore } from "../../stores/chats";

export default defineComponent({
  setup() {
    const apiStore = useApiStore()
    const chatsStore = useChatsStore()

    return {
      apiStore,
      chatsStore
    }
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  methods: {
    createChat() {
      this.$emit('closeSearch')
      this.chatsStore.createChat(this.user._id)
    }
  }
})
</script>

<template>
  <div @click="createChat" class="search-card">
    <div class="avatar" v-bind:style="'background-image: url(' + user.avatarUrl + ')'"></div>

    <div class="username">{{ user.username }}</div>
  </div>
</template>

<style scoped>
  .search-card {
    padding: 0.55rem;
    display: flex;
    width: 100%;
    max-width: 100%;
    min-width: 100%;
    cursor: pointer;
    border-bottom: 0.0625rem solid var(--color-border);
  }

  .search-card .avatar {
    --avatar-diameter: 2.5rem;
    min-width: var(--avatar-diameter);
    min-height: var(--avatar-diameter);
    max-width: var(--avatar-diameter);
    max-height: var(--avatar-diameter);
    background-size: cover;
    border-radius: 50%;
    border: 0.125rem solid var(--vt-c-divider-dark-1);
    margin-right: 0.725rem;
    transition: 300ms ease;
  }

  .search-card .username {
    font-size: 1.125rem;
    line-height: 1.375rem;
    margin: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: auto 0;
  }
</style>