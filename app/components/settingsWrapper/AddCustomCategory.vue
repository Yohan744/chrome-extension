<template>
  <h4 class="add-custom-category-title">Add custom category</h4>

  <div class="wrapper">
    <SingleTodo :todo-item="fakeTodo" :is-for-custom-category="true" />

    <div class="bottom-part">
      <ChooseColor :category="category" @color-selected="handleColorSelected" @update-category="updateCategory" />
      <ChooseIcon :category="category" @icon-selected="handleIconSelected" @update-category="updateCategory" />

      <label>
        <input
          ref="categoryInputRef"
          class="category-input"
          type="text"
          maxlength="18"
          autocomplete="off"
          placeholder="Category name"
          @input="handleInput"
        />
      </label>

      <button class="create" :class="{ active: categoryName !== '' }" @click="handleCategoryCreation">Create</button>
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
  import DOMPurify from 'dompurify';

  const events = useGlobalEvents();

  const categoryInputRef = ref<HTMLInputElement | null>(null);
  const category = ref<ICategoryType | null>(null);

  const colorSelected = ref<string | null>(null);
  const iconSelected = ref<string | null>(null);
  const categoryName = ref<string>('');

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
    colorSelected.value = category.value?.color || null;
    iconSelected.value = category.value?.iconName || null;
  };

  const handleColorSelected = (color: string) => {
    colorSelected.value = color;
  };

  const handleIconSelected = (iconName: string) => {
    iconSelected.value = iconName;
  };

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    target.value = DOMPurify.sanitize(target.value)
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ');

    categoryName.value = target.value.trim();
  };

  const handleCategoryCreation = async () => {
    if (!colorSelected.value || !iconSelected.value || !categoryName.value || categoryName.value === '') return;

    await ChromeStorageHelper.getInstance().addCategory({
      id: crypto.randomUUID(),
      name: categoryName.value,
      iconName: iconSelected.value,
      color: colorSelected.value
    });

    categoryName.value = '';

    events.trigger(ICustomEvents.newCategoryCreated);
    categoryInputRef.value!.value = '';
  };

  const clean = () => {
    categoryName.value = '';
    categoryInputRef.value!.value = '';
  };

  defineExpose({
    clean
  });
</script>

<style scoped lang="scss">
  .add-custom-category-title {
    position: relative;
    margin-top: 30px;
    font-size: 17px;
    font-variation-settings: 'wght' 600;
  }

  .wrapper {
    position: relative;
    padding: 15px;
    margin-top: 15px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    border-radius: 7px;
    background: rgba($color-gray, 0.2);

    .bottom-part {
      position: relative;
      margin-top: 13px;
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      gap: 9px;

      label {
        position: relative;
        height: 100%;
        display: flex;
        flex-grow: 1;

        .category-input {
          position: relative;
          padding: 8px 12px;
          height: 100%;
          display: flex;
          flex-grow: 1;
          width: 100%;
          border-radius: 7px;
          border: none;
          background: rgba($color-gray, 0.44);
          font-size: 12px;
          font-variation-settings: 'wght' 475;

          &:focus {
            border: none;
            outline: none;
          }

          &::placeholder {
            color: rgba($color-white, 0.35);
          }
        }
      }

      .create {
        position: relative;
        height: 100%;
        width: 80px;
        padding: 6px;
        @include center();
        border: none;
        background: linear-gradient(120deg, $color-blue-violet 0%, $color-orchid 70%);
        border-radius: 7px;
        cursor: pointer;
        font-size: 12px;
        font-variation-settings: 'wght' 550;
        color: $color-white;
        opacity: 0.35;
        filter: grayscale(1);
        pointer-events: none;
        transition:
          opacity $transition-time $default-ease,
          filter $transition-time $default-ease;

        &:hover {
          opacity: 0.7;
        }

        &.active {
          opacity: 1;
          filter: grayscale(0);
          pointer-events: all;
        }
      }
    }
  }
</style>
