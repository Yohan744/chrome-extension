<template>
  <div class="link-wrapper">
    <a
      class="link"
      href="mailto:hello@yohan-quinquis.me?subject=%20To%20do%20list%20extension%20feedback"
      target="_blank"
    >
      Feedback
    </a>
    <div class="separator" />
    <a class="link" href="https://buymeacoffee.com/yohan_qns" target="_blank">Support</a>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
  .link-wrapper {
    position: relative;
    margin: auto auto 0;
    @include center;
    gap: 12px;

    .link {
      position: relative;
      font-size: 7px;
      color: rgba($color-white, 0.5);
      transition: color $transition-time $default-ease;

      &:before {
        position: absolute;
        content: '';
        bottom: -3px;
        left: 0;
        transform-origin: 100% 0;
        transform: scaleX(0);
        height: 0.1em;
        width: 100%;
        background: rgba($color-white, 0.75);
        transition: transform calc($transition-time * 0.65) $default-ease;
      }

      @include has-hover {
        color: rgba($color-white, 1);

        &:before {
          transform-origin: 0 0;
          transform: scaleX(1);
        }
      }
    }

    .separator {
      position: relative;
      height: 100%;
      width: 1px;
      background: rgba($color-gray, 0.5);
    }
  }
</style>
