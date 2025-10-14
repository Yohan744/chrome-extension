<template>
  <main>
    <MainWrapper />
    <AddWrapper />
  </main>
</template>

<script setup lang="ts">
  import MainWrapper from '~/components/MainWrapper.vue';
  import AddWrapper from '~/components/AddWrapper.vue';
</script>

<style scoped lang="scss">
  main {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
  }
</style>
