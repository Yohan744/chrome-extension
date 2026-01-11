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

      <button
        class="create"
        :class="{
          active: categoryName !== '' && !checkIfCategoryAlreadyExists(categoryName) && allCategories.length < 51
        }"
        @click="handleCategoryCreation"
      >
        Create
      </button>
    </div>

    <p class="warning-text" :class="{ visible: allCategories.length >= 51 && categoryName !== '' }">
      The limit of 50 categories has been exceeded
    </p>
  </div>
</template>

<script setup lang="ts">
  import type { ITodoType } from '~/types/ITodoType';
  import SingleTodo from '~/components/mainWrapper/SingleTodo.vue';
  import ChooseColor from '~/components/settingsWrapper/ChooseColor.vue';
  import ChooseIcon from '~/components/settingsWrapper/ChooseIcon.vue';
  import type { ICategoryType, IColorType } from '~/types/ICategoryType';
  import { useGlobalEvents } from '~/composables/GlobalEvents';
  import { ICustomEvents } from '~/constants/ICustomEvents';
  import ChromeStorageHelper from '~/composables/ChromeStorageHelper';
  import DOMPurify from 'dompurify';

  const events = useGlobalEvents();

  const categoryInputRef = ref<HTMLInputElement | null>(null);
  const category = ref<ICategoryType | null>(null);
  const allCategories = ref<ICategoryType[]>([]);

  const colorSelected = ref<IColorType | null>(null);
  const iconSelected = ref<string | null>(null);
  const categoryName = ref<string>('');

  const fakeTodo = ref<ITodoType>({
    id: 'custom-category',
    task: 'Hello world',
    categoryId: 'custom-category',
    order: 999
  });

  onMounted(async () => {
    await updateCategory();
    allCategories.value = await ChromeStorageHelper.getInstance().getCategories();

    events.on(ICustomEvents.storageInitiated, async () => {
      await updateCategory();
    });

    events.on(ICustomEvents.newCategoryCreated, async () => {
      allCategories.value = await ChromeStorageHelper.getInstance().getCategories();
    });

    events.on(ICustomEvents.categoryDeleted, async categoryID => {
      allCategories.value = allCategories.value.filter(category => category.id !== categoryID);
    });
  });

  const updateCategory = async () => {
    category.value = await ChromeStorageHelper.getInstance().getCategoryById('custom-category');
    colorSelected.value = category.value?.color || null;
    iconSelected.value = category.value?.iconName || null;
  };

  const handleColorSelected = (color: IColorType) => {
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

  const checkIfCategoryAlreadyExists = (name: string) => {
    return allCategories.value.some(
      category =>
        category.name
          .toLowerCase()
          .replace(/<[^>]*>/g, '')
          .replace(/\s+/g, ' ') ===
        name
          .toLowerCase()
          .replace(/<[^>]*>/g, '')
          .replace(/\s+/g, ' ')
    );
  };

  const handleCategoryCreation = async () => {
    if (
      !colorSelected.value ||
      !iconSelected.value ||
      !categoryName.value ||
      categoryName.value === '' ||
      checkIfCategoryAlreadyExists(categoryName.value) ||
      allCategories.value.length >= 51
    )
      return;

    const id = crypto.randomUUID();

    await ChromeStorageHelper.getInstance().addCategory({
      id: id,
      name: categoryName.value,
      iconName: iconSelected.value,
      color: colorSelected.value
    });

    categoryName.value = '';

    events.trigger(ICustomEvents.newCategoryCreated, id);
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

        @include has-hover {
          opacity: 0.75;
        }

        &.active {
          opacity: 1;
          filter: grayscale(0);
          pointer-events: all;
        }
      }
    }

    .warning-text {
      position: absolute;
      margin: 0 auto;
      bottom: -18px;
      left: 50%;
      width: 100%;
      text-align: center;
      font-size: 9px;
      color: #e30b0b;
      opacity: 0;
      pointer-events: none;
      user-select: none;
      transform: translate3d(-50%, 0, 0) scale(0.875) rotateX(90deg);
      transition:
        opacity calc($transition-time * 1.25) $default-ease,
        transform calc($transition-time * 1.25) $default-ease;

      &.visible {
        opacity: 1;
        transform: translate3d(-50%, 0, 0) scale(1) rotateX(0);
      }
    }
  }
</style>
