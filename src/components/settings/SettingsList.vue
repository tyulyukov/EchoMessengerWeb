<script>
import { defineComponent } from "vue";

export default defineComponent({
  setup() {

  }
})
</script>

<template>
  <div>
    <div class="settings-header">
      <img @click="$emit('openChats')"
           class="button-go-back"
           src="../../assets/img/arrow down.png"
           alt="Back to chats">
    </div>

    <div class="settings-list">
      <div class="settings-card settings-card-active">
        <span>My account</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-header {
  display: flex;
  margin-bottom: 1rem;
}

.button-go-back {
  transform: rotateZ(90deg) scale(1);
  --size: 1.65rem;
  width: var(--size);
  height: var(--size);
  transition: 300ms;
  cursor: pointer;
}

.button-go-back:hover {
  transform: rotateZ(90deg) scale(0.8);
}

.settings-card {
  margin: 0.525rem;
  padding: 0.45rem;
  border-radius: 1rem;
  cursor: pointer;
  display: flex;
}

.settings-card-active {
  background-color: var(--vt-c-blue);
}

.settings-card span {
  justify-items: center;
}
</style>