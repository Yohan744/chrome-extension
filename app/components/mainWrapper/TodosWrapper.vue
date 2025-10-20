<template>
  <div class="todos-wrapper">
    <SingleTodo v-for="todo in todos" :key="todo.id" :todo-item="todo" />
  </div>
</template>

<script setup lang="ts">
  import SingleTodo from '~/components/mainWrapper/SingleTodo.vue';
  import ChromeStorageHelper from '~/composables/ChromeStorageHelper';
  import type { ITodoType } from '~/types/ITodoType';
  import { useGlobalEvents } from '~/composables/GlobalEvents';
  import { ICustomEventsType } from '~/types/ICustomEventsType';

  const events = useGlobalEvents();
  const todos = ref<ITodoType[]>(await ChromeStorageHelper.getInstance().getTodos());

  onMounted(async () => {
    events.on(ICustomEventsType.taskCreated, async () => {
      todos.value = await ChromeStorageHelper.getInstance().getTodos();
    });

    events.on(ICustomEventsType.storageInitiated, async () => {
      todos.value = await ChromeStorageHelper.getInstance().getTodos();
    });

    events.on(ICustomEventsType.migrationDone, async () => {
      todos.value = await ChromeStorageHelper.getInstance().getTodos();
    });
  });
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
