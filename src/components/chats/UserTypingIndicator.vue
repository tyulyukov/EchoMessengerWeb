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
})
</script>

<template>
  <div class="typing-indicator">
    <div class="typing-indicator-block">
      <div class="typing-indicator-dot"></div>
      <div class="typing-indicator-dot"></div>
      <div class="typing-indicator-dot"></div>
    </div>
  </div>
</template>

<style scoped>
.typing-indicator {
  align-items: center;
  display: inline-flex;
  height: 17px;
}

.typing-indicator-block .typing-indicator-dot {
  background-color: var(--vt-c-active-wild-watermelon);
}

.typing-indicator-dot {
  animation: typingAnimation 1.5s infinite ease-in-out;
  border-radius: 50%;
  display: inline-block;
  --diameter: 0.25rem;
  width: var(--diameter);
  height: var(--diameter);
  margin-right: 2px;
}

@keyframes typingAnimation{
  0%{
    -webkit-transform:translateY(0px)
  }
  28%{
    -webkit-transform:translateY(-5px)
  }
  44%{
    -webkit-transform:translateY(0px)
  }
}

.typing-indicator-dot:nth-child(1){
  animation-delay:200ms;
}
.typing-indicator-dot:nth-child(2){
  animation-delay:300ms;
}
.typing-indicator-dot:nth-child(3){
  animation-delay:400ms;
}
</style>