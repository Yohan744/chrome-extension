<template>
  <section id="main-wrapper">
    <h1>Main wrapper</h1>
    <button @click="onClick">switch</button>
  </section>
</template>

<script setup lang="ts">
  import switchBetweenSections from '~/composables/switchBetweenSections';

  const onClick = () => {
    switchBetweenSections('forward');
  };
</script>

<style scoped lang="scss">
  #main-wrapper {
    position: absolute;
    inset: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    background: linear-gradient($color-indigo 0, $color-rebecca-purple 0, $color-black 40%);
  }
</style>
