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
      @include center;
      opacity: 1;
      transition: opacity $transition-time $default-ease;
      z-index: z('popUp-btn');

      @include has-hover {
        opacity: 0.7;
      }
    }

    .content-wrapper {
      position: fixed;
      margin: 10px auto 0;
      left: 50%;
      max-height: 165px;
      width: 75.9%;
      pointer-events: none;
      @include light-border;
      transform: translate3d(-50%, 10px, 0);
      opacity: 0;
      z-index: z('popUp-content');
      border-radius: 7px;
      backdrop-filter: blur(7px);
      background: $color-popup-bg;
      transition:
        opacity $transition-time $default-ease,
        transform $transition-time $default-ease;

      &.open {
        pointer-events: all;
        opacity: 1;
        transform: translate3d(-50%, 0, 0);
      }
    }

    .background {
      position: fixed;
      inset: 0;
      height: 100%;
      width: 100%;
      pointer-events: none;
      opacity: 0;
      background: rgba($color-black, 0.35);
      z-index: 1;
      transition: opacity $transition-time $default-ease;

      &.open {
        pointer-events: all;
        opacity: 1;
        z-index: z('popUp-background');
      }
    }
  }
</style>
