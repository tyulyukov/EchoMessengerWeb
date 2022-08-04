<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    haveSeen: {
      type: Boolean
    }
  }
})
</script>

<template>
  <div class="check-marks">
    <div class="check-mark first-check-mark">
      <div class="first-part-container">
        <div class="first-part" />
      </div>
      <div class="second-part-container">
        <div class="second-part" />
      </div>
    </div>
    <div v-if="haveSeen" class="check-mark second-check-mark">
      <div class="second-part-container">
        <div class="second-part" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.check-marks {
  display: flex;
  float: right;
  padding: 0 5px;
}

.check-mark {
  display: inline-flex;
}

.check-mark .first-part, .second-part {
  background-color: var(--vt-c-white);
  width: 2px;
}

.check-mark .first-part-container {
  margin: 5px 2px 0 5px;
}

.check-mark .second-part-container {
  margin: 0 2px 0 2px;
}

.first-part {
  height: 8px;
  transform: rotateZ(-45deg);
}

.second-part {
  height: 13px;
  transform: rotateZ(45deg);
}
</style>