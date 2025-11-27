<template>
  <div class="main-wrapper">
    <div class="btn-wrapper" @click="handleToggle">
      <slot name="btn"></slot>
    </div>

    <div ref="popIn" class="content-wrapper">
      <slot name="content"></slot>
    </div>

    <div ref="overlay" class="background" :class="{ open: isOpen }" @click="handleToggle" />
  </div>
</template>

<script setup lang="ts">
  import gsap from 'gsap';

  const isOpen = ref<boolean>(false);
  const isAnimating = ref<boolean>(false);

  const popIn = ref<HTMLElement | null>(null);
  const overlay = ref<HTMLElement | null>(null);

  const handleToggle = () => {
    if (isAnimating.value) return;
    isOpen.value = !isOpen.value;
  };

  watch(
    () => isOpen.value,
    (state: boolean) => {
      animatePopIn(state);
    }
  );

  const animatePopIn = (state: boolean) => {
    if (isAnimating.value) return;
    gsap.to(popIn.value, {
      opacity: state ? 1 : 0,
      scale: 1,
      overwrite: true,
      force3D: true,
      pointerEvents: state ? 'all' : 'none',
      duration: state ? 0.6 : 0.3,
      ease: state ? 'power3.out' : 'sine.in'
    });

    gsap.to(overlay.value, {
      opacity: state ? 1 : 0,
      pointerEvents: state ? 'all' : 'none',
      overwrite: true,
      duration: state ? 0.6 : 0.3,
      ease: state ? 'power3.out' : 'sine.in',
      onStart: () => {
        isAnimating.value = true;
      },
      onComplete: () => {
        if (!state) {
          gsap.set(popIn.value, {
            scale: 0.8
          });
        }
        gsap.delayedCall(0, () => (isAnimating.value = false));
      }
    });
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
      transform: translate3d(-50%, 0, 0) scale(0.75);
      opacity: 0;
      z-index: z('popUp-content');
      border-radius: 7px;
      backdrop-filter: blur(7px);
      background: $color-popup-bg;
    }

    .background {
      position: fixed;
      inset: 0;
      height: 100%;
      width: 100%;
      pointer-events: none;
      opacity: 0;
      background: rgba($color-black, 0.425);
      z-index: 1;

      &.open {
        z-index: z('popUp-background');
      }
    }
  }
</style>
