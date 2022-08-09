<script>
import { defineComponent } from "vue";
import { useAuthUserStore } from "../../stores/user";
import { formatTime } from "../../util/dateFormat";
import CheckMarks from "./CheckMarks.vue";
import { useChatsStore } from "../../stores/chats";

export default defineComponent({
  components: { CheckMarks },
  setup() {
    const authUserStore = useAuthUserStore()
    const chatsStore = useChatsStore()

    return {
      authUserStore,
      chatsStore,
      formatTime
    }
  },
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  methods: {
    getMessageCardClass() {
      let classList = 'message'

      if (this.authUserStore.id == this.message.sender._id)
        classList += ' own'

      return classList
    }
  }
})
</script>

<template>
  <div v-bind:class="getMessageCardClass()">
    <div class="message-content">
      <div class="message-content-inner">
        <p>
          {{ message.content }}
          <span class="message-meta">
            {{ formatTime(message.sentAt) }}
            <CheckMarks v-if="message.sender._id == authUserStore.id"
                        :have-seen="message.haveSeen" />
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message {
  display: flex;
  align-items: flex-end;
  margin-bottom: 0.375rem;
  position: relative;
}

.message-content {
  max-width: 25rem;
  color: var(--vt-c-white);
  border-radius: 1.25rem;
  display: flex;
  align-items: flex-end;
  position: relative;
  padding: 0.45rem 0.7rem 0.4rem;
  background-color: #1C1D26;
}

.own {
  flex-direction: row-reverse;
}

.own .message-content {
  background-color: var(--vt-c-blue);
}

.message-content p {
  margin: 0;
  word-break: break-word;
  white-space: pre-wrap;
  line-height: 1.3125;
  text-align: initial;
  display: flow-root;
  unicode-bidi: plaintext;
  font-size: 11.5pt;
  font-weight: 400;
}

.message-meta {
  color: var(--vt-c-text-dark-2);
  position: relative;
  top: 0.3rem;
  float: right;
  line-height: 1.35;
  height: 1rem;
  margin-left: 0.4375rem;
  margin-right: -0.35rem;
  font-size: 11pt;
}

.message-meta .check-marks {
  margin-top: 0.15rem;
  margin-left: -0.5rem;
}
</style>