<template>
  <section id="settings-wrapper">
    <GoBackButton />
    <h1 class="title">Settings</h1>
    <AddCustomCategory />
    <h4 class="delete-category-title">Delete category</h4>
    <Categories :can-delete-categories="true" />
    <a class="support-btn" href="https://buymeacoffee.com/yohan_qns" target="_blank">Support me</a>
  </section>
</template>

<script setup lang="ts">
  import AddCustomCategory from './settingsWrapper/AddCustomCategory.vue';
  import Categories from '~/components/addWrapper/Categories.vue';
  import GoBackButton from '~/components/GoBackButton.vue';
</script>

<style scoped lang="scss">
  #settings-wrapper {
    position: absolute;
    padding: 30px 20px 20px;
    inset: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-content: flex-start;
    background: linear-gradient($color-indigo 0, $color-rebecca-purple 0, $color-black 40%);
    pointer-events: none;
    opacity: 0;

    .title {
      position: relative;
      font-size: 28px;
      line-height: 1.25;
      font-variation-settings: 'wght' 800;
    }

    .delete-category-title {
      position: relative;
      margin-top: 30px;
      font-size: 18px;
      font-variation-settings: 'wght' 650;
    }

    .support-btn {
      position: relative;
      margin: auto auto 0;
      font-size: 8px;
      color: rgba($color-white, 0.75);
      transition: color calc($transition-time * 0.65) $default-ease;

      &:before {
        position: absolute;
        content: '';
        bottom: -3px;
        left: 0;
        transform-origin: right;
        transform: scaleX(0);
        opacity: 0;
        height: 1px;
        width: 100%;
        background: rgba($color-white, 0.75);
        transition:
          transform calc($transition-time * 0.65) $default-ease,
          opacity calc($transition-time * 0.65) $default-ease,
          background calc($transition-time * 0.65) $default-ease;
      }

      @include has-hover {
        color: rgba($color-white, 1);

        &:before {
          opacity: 1;
          transform-origin: left;
          transform: scaleX(1);
          background: rgba($color-white, 1);
        }
      }
    }
  }
</style>
