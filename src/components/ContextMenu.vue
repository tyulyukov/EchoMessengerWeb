<script>

import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    /*const positionY =
        this.clientY + contextMenu.scrollHeight >= window.innerHeight
            ? window.innerHeight - contextMenu.scrollHeight - 20
            : this.clientY;
    const positionX =
        this.clientX + contextMenu.scrollWidth >= window.innerWidth
            ? window.innerWidth - contextMenu.scrollWidth - 20
            : this.clientX;*/

    console.log(this.clientX, this.clientY)
  },
  props: {
    clientX: {
      type: Number,
      required: true
    },
    clientY: {
      type: Number,
      required: true
    },
  },
  methods: {
    closeContextMenu(event) {
      this.$emit('closeContextMenu', event)
    }
  }
})
</script>

<template>
  <div @mousedown="closeContextMenu" class="context-menu-wrapper">
    <ul class="context-menu">
      <li><button>Reply</button></li>
      <li><button>Edit</button></li>
      <li><button>Delete</button></li>
    </ul>
  </div>
</template>

<style scoped>
.context-menu-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
}

.context-menu {
  --menu-border: rgba(255, 255, 255, 0.08);
  --menu-bg: linear-gradient(
      45deg,
      rgba(10, 20, 28, 0.2) 0%,
      rgba(10, 20, 28, 0.7) 100%
  );
  --item-border: rgba(255, 255, 255, 0.1);
  --item-color: #fff;
  --item-bg-hover: rgba(255, 255, 255, 0.1);

  overflow: hidden;
  background: var(--menu-bg);
  backdrop-filter: blur(5px);
  position: fixed;
  animation: menuAnimation 0.4s 0s both;
  transform-origin: left;
  list-style: none;
  margin: 4px;
  padding: 0;
  top: v-bind(clientX);
  left: v-bind(clientY);
  display: flex;
  flex-direction: column;
  z-index: 9999;
  box-shadow: 0 0 0 1px var(--menu-border), 0 2px 2px rgb(0 0 0 / 3%),
  0 4px 4px rgb(0 0 0 / 4%), 0 10px 8px rgb(0 0 0 / 5%),
  0 15px 15px rgb(0 0 0 / 6%), 0 30px 30px rgb(0 0 0 / 7%),
  0 70px 65px rgb(0 0 0 / 9%);
}

.context-menu li {
   padding: 4px;
 }

.context-menu button {
  color: var(--item-color);
  background: 0;
  border: 0;
  white-space: nowrap;
  width: 100%;
  border-radius: 4px;
  padding: 6px 24px 6px 7px;
  text-align: left;
  display: flex;
  align-items: center;
  font-size: 14px;
  width: 100%;
  animation: menuItemAnimation 0.2s 0s both;
  font-family: "Inter", sans-serif;
  cursor: pointer;
}

.context-menu li:hover {
   background-color: var(--item-bg-hover);
}

/*&[data-theme="light"] {
   --menu-bg: linear-gradient(
       45deg,
       rgba(255, 255, 255, 0.45) 0%,
       rgba(255, 255, 255, 0.85) 100%
   );
   --menu-border: rgba(0, 0, 0, 0.08);
   --item-border: rgba(0, 0, 0, 0.1);
   --item-color: rgb(10, 20, 28);
   --item-bg-hover: rgba(10, 20, 28, 0.09);
 }*/

@keyframes menuAnimation {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }

  100% {
    /*height: var(--height);*/
    opacity: 1;
    border-radius: 8px;
    transform: scale(1);
  }
}

@keyframes menuItemAnimation {
  0% {
    opacity: 0;
    transform: translateX(-10px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

</style>