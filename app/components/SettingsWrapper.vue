<template>
  <section id="settings-wrapper" class="active">
    <h1 class="title">Settings</h1>
    <AddCustomCategory />
    <DeleteCategories />

    <a class="support-btn" href="https://buymeacoffee.com/yohan_qns" target="_blank">Support me</a>
  </section>
</template>

<script setup lang="ts">
  import AddCustomCategory from './settingsWrapper/AddCustomCategory.vue';
  import DeleteCategories from '~/components/settingsWrapper/DeleteCategories.vue';
</script>

<style scoped lang="scss">
  #settings-wrapper {
    position: absolute;
    padding: 30px 20px calc($footer-height + 20px);
    inset: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-content: flex-start;
    background: linear-gradient($color-indigo 0, $color-rebecca-purple 0, $color-black 40%);
    //pointer-events: none;
    //opacity: 0;

    .title {
      position: relative;
      font-size: 28px;
      line-height: 1.25;
      font-variation-settings: 'wght' 800;
    }

    .support-btn {
      position: relative;
      margin: auto auto 0;
      font-size: 8px;
      color: rgba($color-white, 0.5);

      &:before {
        position: absolute;
        content: '';
        bottom: -3px;
        left: 50%;
        transform: translateX(-50%);
        height: 1px;
        width: 100%;
        background: rgba($color-white, 0.5);
      }
    }
  }
</style>
