<template>
  <h4 class="add-custom-category-title">Add custom category</h4>

  <div class="wrapper">
    <SingleTodo :todo-item="{ ...fakeTodo }" />
  </div>
</template>

<script setup lang="ts">
  import type { ITodoType } from '~/types/ITodoType';
  import SingleTodo from '~/components/mainWrapper/SingleTodo.vue';

  const fakeTodo: ITodoType = {
    id: 'x',
    task: 'Hello World',
    categoryId: 'custom-category',
    order: 999
  };
</script>

<style scoped lang="scss">
  .add-custom-category-title {
    position: relative;
    margin-top: 30px;
    font-size: 18px;
    font-variation-settings: 'wght' 650;
  }

  .wrapper {
    position: relative;
    padding: 10px;
    margin-top: 20px;
    width: 100%;
    border-radius: 7px;
    background: rgba($color-gray, 0.4);
  }
</style>
