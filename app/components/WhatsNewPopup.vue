<template>
  <div ref="overlayRef" class="whats-new-overlay" />
  <div ref="popupRef" class="whats-new-popup">
    <div class="popup-content">
      <p class="version-label">v{{ appVersion }}</p>
      <h2 class="title">Good news, new update !</h2>

      <ul class="features">
        <li>
          <span class="dot" />
          <span>Faster animations for a smoother experience</span>
        </li>
        <li>
          <span class="dot" />
          <span>
            Edit a task by double-clicking it, then press
            <kbd>Enter</kbd>
            to save
          </span>
        </li>
      </ul>

      <p class="thank-you">
        Thank you for using the app ! If you enjoy it, consider
        <a
          href="https://chromewebstore.google.com/detail/to-do-list-keep-it-simple/dhbalflkcneafhdchlphigpflfddfalk/reviews"
          target="_blank"
          rel="noopener"
        >
          leaving a review
        </a>
        or even
        <a href="https://buymeacoffee.com/yohan_qns" target="_blank" rel="noopener">buying me a coffee</a>
        , it means a lot.
      </p>
    </div>

    <button class="close-button" @click="close">Got it</button>
  </div>
</template>

<script setup lang="ts">
  import gsap from 'gsap';

  const emit = defineEmits<{
    close: [];
  }>();

  const appVersion = chrome.runtime.getManifest().version;
  const overlayRef = ref<HTMLElement | null>(null);
  const popupRef = ref<HTMLElement | null>(null);
  const isAnimating = ref<boolean>(false);

  const close = () => {
    if (isAnimating.value) return;
    isAnimating.value = true;

    gsap.to(popupRef.value, {
      opacity: 0,
      scale: 0.9,
      yPercent: -50,
      duration: 0.3,
      ease: 'sine.in',
      overwrite: true,
      force3D: true
    });

    gsap.to(overlayRef.value, {
      opacity: 0,
      duration: 0.3,
      ease: 'sine.in',
      overwrite: true,
      onComplete: () => {
        emit('close');
      }
    });
  };

  onMounted(() => {
    isAnimating.value = true;

    gsap.set(popupRef.value, { opacity: 0, scale: 0.92, yPercent: -50, force3D: true });
    gsap.set(overlayRef.value, { opacity: 0 });

    gsap.to(overlayRef.value, {
      opacity: 1,
      delay: 0.9,
      duration: 0.6,
      ease: 'power3.out'
    });

    gsap.to(popupRef.value, {
      opacity: 1,
      scale: 1,
      yPercent: -50,
      delay: 0.9,
      duration: 0.6,
      ease: 'power3.out',
      force3D: true,
      onComplete: () => {
        isAnimating.value = false;
      }
    });
  });
</script>

<style scoped lang="scss">
  .whats-new-overlay {
    position: fixed;
    inset: 0;
    background: rgba($color-black, 0.5);
    z-index: z('whatsNew-overlay');
  }

  .whats-new-popup {
    position: fixed;
    top: 50%;
    left: 20px;
    right: 20px;
    z-index: z('whatsNew-content');
    border-radius: 10px;
    background: $color-popup-bg;
    backdrop-filter: blur(7px);
    @include light-border;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .popup-content {
      padding: 28px 22px 22px;
      display: flex;
      flex-direction: column;

      .version-label {
        font-size: 11px;
        font-variation-settings: 'wght' 550;
        color: $color-orchid;
        letter-spacing: 0.08em;
        margin-bottom: 10px;
      }

      .title {
        font-size: 20px;
        line-height: 1.25;
        font-variation-settings: 'wght' 750;
        color: $color-white;
        margin-bottom: 10px;
      }

      .features {
        display: flex;
        flex-direction: column;
        gap: 11px;
        list-style: none;
        padding-left: 12px;
        margin-bottom: 20px;

        li {
          margin: 5px 0;
          display: flex;
          align-items: flex-start;
          gap: 7px;
          font-size: 13.5px;
          line-height: 1.5;
          font-variation-settings: 'wght' 450;
          color: rgba($color-white, 0.8);

          .dot {
            flex-shrink: 0;
            margin-top: 7px;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: $color-orchid;
          }

          kbd {
            display: inline-block;
            padding: 1px 5px;
            border-radius: 4px;
            font-size: 11px;
            font-family: inherit;
            background: rgba($color-white, 0.1);
            border: 1px solid rgba($color-white, 0.15);
          }
        }
      }

      .thank-you {
        font-size: 12px;
        line-height: 1.55;
        font-variation-settings: 'wght' 400;
        color: rgba($color-white, 0.5);

        a {
          color: rgba($color-white, 0.75);
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color $transition-time $default-ease;

          @include has-hover {
            color: $color-white;
          }
        }
      }
    }

    .close-button {
      margin: 0 22px 24px;
      padding: 13px;
      border: none;
      border-radius: 7px;
      background: linear-gradient(30deg, $color-blue-violet 0%, $color-orchid 70%);
      color: $color-white;
      font-size: 15px;
      font-variation-settings: 'wght' 550;
      font-family: inherit;
      cursor: pointer;
      transition: opacity $transition-time $default-ease;

      @include has-hover {
        opacity: 0.8;
      }
    }
  }
</style>
