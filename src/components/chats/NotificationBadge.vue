<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    notifications: {
      type: Number,
      required: true
    }
  }
})
</script>

<template>
  <div class="badge">
    <div class="center">
      {{ notifications }}
    </div>
  </div>
</template>

<style scoped>
.badge {
  padding: 0px 15px;
  border-radius: 43%;
  background-color: red;
  transition: 300ms;
  color: var(--vt-c-white);
}
</style>