<template>
  <section id="main-wrapper" class="active">
    <TopPart />
    <TodosWrapper />
  </section>
</template>

<script setup lang="ts">
  import TopPart from '~/components/mainWrapper/TopPart.vue';
  import TodosWrapper from '~/components/mainWrapper/TodosWrapper.vue';
</script>

<style scoped lang="scss">
  #main-wrapper {
    position: absolute;
    gap: 10px;
    padding: 30px 20px 20px;
    inset: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-content: flex-start;
    background: linear-gradient($color-indigo 0, $color-rebecca-purple 0, $color-black 40%);
  }
</style>
