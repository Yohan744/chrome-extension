<template>
  <div class="single-todo">
    <TodoCheckbox @checked="handleCheckboxClick" />
    <div class="right-part" :style="{ background: category?.color }">
      {{ props.todoItem.task }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import TodoCheckbox from '~/components/mainWrapper/TodoCheckbox.vue';
  import type { ITodoType } from '~/types/ITodoType';
  import type { ICategoryType } from '~/types/ICategoryType';

  const props = defineProps<{
    todoItem: ITodoType;
  }>();

  const category = ref<ICategoryType | null>(
    await ChromeStorageHelper.getInstance().getCategoryById(props.todoItem.categoryId)
  );

  const handleCheckboxClick = () => {
    console.log('Checkbox checked!');
  };
</script>

<style scoped lang="scss">
  .single-todo {
    position: relative;
    height: auto;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;

    .right-part {
      position: relative;
      padding: 20px;
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 10px;
      border-radius: 10px;
      font-size: 14px;
      background: rgba($color-gray, 0.4);
    }
  }
</style>
