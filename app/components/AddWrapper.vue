<template>
  <section id="add-wrapper">
    <h1>add wrapper</h1>
    <button @click="onClick">switch</button>
  </section>
</template>

<script setup lang="ts">
  import switchBetweenSections from '~/composables/switchBetweenSections';

  const onClick = () => {
    switchBetweenSections('backward');
  };
</script>

<style scoped lang="scss">
  #add-wrapper {
    position: absolute;
    inset: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    background: linear-gradient($color-indigo 0, $color-rebecca-purple 0, $color-black 40%);
    pointer-events: none;
    opacity: 0;
  }
</style>
