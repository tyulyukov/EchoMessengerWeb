<script setup>
defineProps({
  chat: {
    required: false
  }
})
</script>

<template>
  <div class="card"></div>
</template>

<style scoped>
  .card {
    border-radius: 20px;
    height: 5rem;
    background-color: var(--vt-c-main-vulkan);
    transition: background-color 300ms;
  }

  .card:hover {
    background-color: var(--vt-c-secondary-steel-gray);
  }
</style>