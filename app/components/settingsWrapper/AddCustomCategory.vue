<template>
  <h4 class="add-custom-category-title">Add custom category</h4>

  <div class="wrapper">
    <SingleTodo :todo-item="fakeTodo" :is-for-custom-category="true" />

    <div class="bottom-part">
      <ChooseColor :category="category" @color-selected="handleColorSelected" @update-category="updateCategory" />
      <ChooseIcon :category="category" @icon-selected="handleIconSelected" @update-category="updateCategory" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ITodoType } from '~/types/ITodoType';
  import SingleTodo from '~/components/mainWrapper/SingleTodo.vue';
  import ChooseColor from '~/components/settingsWrapper/ChooseColor.vue';
  import ChooseIcon from '~/components/settingsWrapper/ChooseIcon.vue';
  import type { ICategoryType } from '~/types/ICategoryType';
  import { useGlobalEvents } from '~/composables/GlobalEvents';
  import { ICustomEvents } from '~/constants/ICustomEvents';
  import ChromeStorageHelper from '~/composables/ChromeStorageHelper';

  const events = useGlobalEvents();

  const category = ref<ICategoryType | null>(null);

  const colorSelected = ref<string | null>(null);
  const iconSelected = ref<string | null>(null);

  const fakeTodo = ref<ITodoType>({
    id: 'x',
    task: 'Hello World',
    categoryId: 'custom-category',
    order: 999
  });

  onMounted(async () => {
    await updateCategory();

    events.on(ICustomEvents.storageInitiated, async () => {
      await updateCategory();
    });
  });

  const updateCategory = async () => {
    category.value = await ChromeStorageHelper.getInstance().getCategoryById('custom-category');
  };

  const handleColorSelected = (color: string) => {
    colorSelected.value = color;
  };

  const handleIconSelected = (iconName: string) => {
    iconSelected.value = iconName;
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
      gap: 10px;
    }
  }
</style>
