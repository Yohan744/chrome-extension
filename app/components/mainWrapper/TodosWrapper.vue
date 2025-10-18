<template>
  <div class="todos-wrapper">
    <SingleTodo v-for="todo in todos" :key="todo.id" :todo-item="todo" />
  </div>
</template>

<script setup lang="ts">
  import SingleTodo from '~/components/mainWrapper/SingleTodo.vue';
  import ChromeStorageHelper from '~/composables/ChromeStorageHelper';
  import type { ITodoType } from '~/types/ITodoType';

  await ChromeStorageHelper.getInstance().initDefaultStorage();
  await ChromeStorageHelper.getInstance().migrateOldTodos();

  const todos = ref<ITodoType[]>(await ChromeStorageHelper.getInstance().getTodos());
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
    background: $color-magenta;
    opacity: 0.3;
  }
</style>
