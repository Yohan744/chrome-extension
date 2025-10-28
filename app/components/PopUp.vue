<template>
  <div class="main-wrapper">
    <div class="btn-wrapper" @click="handleToggle">
      <slot name="btn"></slot>
    </div>

    <div class="content-wrapper" :class="{ open: isOpen }">
      <slot name="content"></slot>
    </div>

    <div class="background" :class="{ open: isOpen }" @click="handleToggle" />
  </div>
</template>

<script setup lang="ts">
  const isOpen = ref(false);

  const handleToggle = () => {
    isOpen.value = !isOpen.value;
  };
</script>

<style scoped lang="scss">
  .main-wrapper {
    position: relative;

    .btn-wrapper {
      position: relative;
      z-index: z('popUp-btn');
    }

    .content-wrapper {
      position: absolute;
      top: 38px;
      left: 0;
      pointer-events: none;
      transform: translate3d(0, 10px, 0);
      opacity: 0;
      z-index: z('popUp-content');
      transition:
        opacity $transition-time $default-ease,
        transform $transition-time $default-ease;

      &.open {
        pointer-events: all;
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }

    .background {
      position: fixed;
      inset: 0;
      height: 100%;
      width: 100%;
      pointer-events: none;
      opacity: 0;
      z-index: 1;

      &.open {
        pointer-events: all;
        opacity: 1;
        z-index: z('popUp-background');
      }
    }
  }
</style>
