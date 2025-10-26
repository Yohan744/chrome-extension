<template>
  <section id="settings-wrapper" class="active">
    <h1 class="title">Settings</h1>
    <AddCustomCategory />
  </section>
</template>

<script setup lang="ts">
  import AddCustomCategory from './settingsWrapper/AddCustomCategory.vue';
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
  }
</style>
