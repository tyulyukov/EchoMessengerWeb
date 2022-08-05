<script>
import { defineComponent } from "vue";
import TextCard from "../components/TextCard.vue";

export default defineComponent({
  components: { TextCard }
})
</script>

<template>
  <div class="center">
    <TextCard :text="'Select chat'" />
  </div>
</template>