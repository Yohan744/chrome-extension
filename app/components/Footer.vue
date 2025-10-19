<template>
  <footer>
    <div @click="switchBetweenSections('main')"></div>
    <div @click="switchBetweenSections('add')"></div>
    <div @click="switchBetweenSections('settings')"></div>
  </footer>
</template>

<script setup lang="ts">
  import switchBetweenSections from '~/composables/SwitchBetweenSections';
</script>

<style scoped lang="scss">
  footer {
    position: absolute;
    bottom: 0;
    left: 0;
    height: $footer-height;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    z-index: z('footer');
    background: red;

    div {
      position: relative;
      height: 35px;
      width: 35px;
      background: blue;
      border-radius: 7px;
      cursor: pointer;
    }
  }
</style>
