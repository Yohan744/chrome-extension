<template>
  <div class="todos-wrapper">
    <SingleTodo v-for="n in 15" :key="n" :index="n" />
  </div>
</template>

<script setup>
  import SingleTodo from '~/components/mainWrapper/SingleTodo.vue';
  import ChromeStorageHelper from '~/composables/ChromeStorageHelper';

  ChromeStorageHelper.getInstance().initDefaultStorage();
</script>

<style scoped lang="scss">
  .todos-wrapper {
    position: relative;
    height: auto;
    width: 100%;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 20px;
    overflow-y: scroll;
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
</style>
