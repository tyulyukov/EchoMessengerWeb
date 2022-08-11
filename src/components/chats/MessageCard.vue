<script>
import { defineComponent } from "vue";
import { useAuthUserStore } from "../../stores/user";
import { formatTime, isSameDate } from "../../util/dateFormat";
import CheckMarks from "./CheckMarks.vue";
import DateCard from "../DateCard.vue";
import { useChatsStore } from "../../stores/chats";

export default defineComponent({
  components: { CheckMarks, DateCard },
  setup() {
    const authUserStore = useAuthUserStore()
    const chatsStore = useChatsStore()

    return {
      authUserStore,
      chatsStore,
      formatTime,
      isSameDate
    }
  },
  props: {
    message: {
      type: Object,
      required: true
    },
    chat: {
      type: Object,
      required: true
    }
  },
  computed: {
    prevMessage() {
      let messageIndex = this.chat.messages.findIndex(e => e._id === this.message._id)

      if (messageIndex > 0) {
        return this.chat.messages[messageIndex - 1]
      }
      else {
        return undefined
      }
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
  <DateCard v-if="!prevMessage || !isSameDate(prevMessage.sentAt, message.sentAt)"
            :date="new Date(message.sentAt)" />

  <div v-bind:id="'message-' + message._id" v-bind:class="getMessageCardClass()">
    <div class="message-content">
      <div class="message-content-inner">
        <span>
          {{ message.content }}
          <div v-if="message.sent === false" class="spinner-border"></div>
          <span v-else-if="message.sendFailed === true" class="error">error</span>
          <span v-else class="message-meta">
            <span v-if="message.edits && message.edits.length > 0" class="message-edited">
              edited
            </span>
            <span>{{ formatTime(message.sentAt) }}</span>
            <CheckMarks v-if="message.sender._id == authUserStore.id"
                        :have-seen="message.haveSeen" />
          </span>

        </span>
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
  word-break: break-word;
  white-space: pre-line;
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
  line-height: 1.3125;
  text-align: initial;
  display: flow-root;
  unicode-bidi: plaintext;
  font-size: 11.5pt;
  font-weight: 400;
}

.message-content-inner .spinner-border {
  --diameter: 0.75rem;
  width: var(--diameter);
  height: var(--diameter);
}

.message-meta {
  color: var(--vt-c-text-dark-2);
  position: relative;
  top: 0.3rem;
  float: right;
  line-height: 1.35;
  height: 1rem;
  margin-left: 0.4375rem;
  margin-right: -0.4rem;
  font-size: 11pt;
}

.message-meta span {
  margin-right: 0.1rem;
}

.message-meta .check-marks {
  margin-top: 0.15rem;
  margin-left: -0.5rem;
}

.own .error {
  padding: 0 0.3rem;
  border-radius: 5rem;
  background-color: red;
  display: inherit;
  color: white;
}
</style>