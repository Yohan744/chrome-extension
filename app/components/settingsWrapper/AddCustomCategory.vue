<template>
  <h4 class="add-custom-category-title">Add custom category</h4>

  <div class="wrapper">
    <SingleTodo v-if="fakeTodo" :todo-item="{ ...fakeTodo }" />

    <div class="bottom-part">
      <ChooseColor />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ITodoType } from '~/types/ITodoType';
  import SingleTodo from '~/components/mainWrapper/SingleTodo.vue';
  import ChooseColor from '~/components/settingsWrapper/ChooseColor.vue';
  import { useGlobalEvents } from '~/composables/GlobalEvents';
  import { ICustomEvents } from '~/constants/ICustomEvents';

  const events = useGlobalEvents();

  const fakeTodo = ref<ITodoType | null>(null);

  onMounted(async () => {
    events.on(ICustomEvents.storageInitiated, async () => {
      fakeTodo.value = {
        id: 'x',
        task: 'Hello World',
        categoryId: 'custom-category',
        order: 999
      };
    });
  });
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
    padding: 15px 10px;
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    border-radius: 7px;
    background: rgba($color-gray, 0.4);

    .bottom-part {
      position: relative;
      margin-top: 20px;
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    }
  }
</style>
