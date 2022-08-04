<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    text: {
      type: String,
      required: true
    }
  }
})
</script>

<template>
  <div class="center">
    <div class="text-card">
      <span>{{ text }}</span>
    </div>
  </div>
</template>

<style scoped>
.text-card {
  padding: 0.25rem 3rem;
  background-color: var(--vt-c-main-vulkan);
  color: var(--color-text);
  border-radius: 25px;
  font-weight: lighter;
}
</style>