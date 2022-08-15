<script>
import { defineComponent } from "vue";
import { convert2digits } from "../util/dateFormat";

export default defineComponent({
  setup() {
    return {
      convert2digits
    }
  },
  props: {
    date: {
      type: Date,
      required: true
    }
  }
})
</script>

<template>
  <div class="date-card">
    <div class="line-date-card" />
    <span class="date-card-content">{{ `${convert2digits(date.getDate())}.${convert2digits(date.getMonth() + 1)}` }}</span>
    <div class="line-date-card" />
  </div>
</template>

<style scoped>
.date-card {
  display: inline-flex;
  justify-content: space-around;
  width: 100%;
  color: var(--color-text);
  font-weight: lighter;
  margin: 0.5rem 0;
}

.date-card .line-date-card {
  height: 1px;
  width: 100%;
  background-color: var(--color-text);
  margin: auto 0.5rem;
  border-radius: 1rem;
}
</style>