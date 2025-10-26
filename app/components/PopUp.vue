<template>
  <div @click="handleToggle">
    <slot name="btn"></slot>
  </div>

  <div class="content-wrapper" :class="{ open: isOpen }">
    <slot name="content"></slot>
  </div>

  <div class="background" :class="{ open: isOpen }" @click="handleToggle" />
</template>

<script setup lang="ts">
  const isOpen = ref(false);

  const handleToggle = () => {
    isOpen.value = !isOpen.value;
  };
</script>

<style scoped lang="scss">
  .content-wrapper {
    pointer-events: none;
    opacity: 0;
    z-index: z('popUp-content');

    &.open {
      pointer-events: all;
      opacity: 1;
    }
  }

  .background {
    position: fixed;
    inset: 0;
    height: 100%;
    width: 100%;
    pointer-events: none;
    opacity: 0;
    z-index: z('popUp-background');

    &.open {
      pointer-events: all;
      opacity: 1;
    }
  }
</style>
