<template>
  <section id="main-wrapper">
    <MainWrapperTopPart />
    <MainWrapperTodosWrapper />
  </section>
</template>

<script setup lang="ts">
  import MainWrapperTopPart from '~/components/mainWrapper/TopPart.vue';
  import MainWrapperTodosWrapper from '~/components/mainWrapper/TodosWrapper.vue';
</script>

<style scoped lang="scss">
  #main-wrapper {
    position: absolute;
    gap: 50px;
    padding: 20px;
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
