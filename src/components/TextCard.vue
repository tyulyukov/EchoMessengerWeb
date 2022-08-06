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
  <div class="text-card">
    <span>{{ text }}</span>
  </div>
</template>

<style scoped>
.text-card {
  padding: 0.25rem 3rem;
  background-color: var(--vt-c-main-vulkan);
  color: var(--color-text);
  border-radius: 1.55rem;
  font-weight: lighter;
}
</style>