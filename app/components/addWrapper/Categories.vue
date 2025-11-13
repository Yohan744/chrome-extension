<template>
  <div ref="categoriesWrapper" class="categories-wrapper">
    <div class="wrapper">
      <div
        v-for="category in visibleCategories"
        :key="category.id"
        class="category"
        :style="{ background: category.color }"
        @click="e => handleClickOnCategory(e)"
      >
        {{ category.name }}
      </div>

      <div v-if="props.isInAddWrapper" class="add" @click="emit('addCategoryClicked')">
        <PlusIcon />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import ChromeStorageHelper from '~/composables/ChromeStorageHelper';
  import type { ICategoryType } from '~/types/ICategoryType';
  import PlusIcon from '~/assets/icons/plus.svg?component';
  import { ICustomEvents } from '~/constants/ICustomEvents';
  import { useGlobalEvents } from '~/composables/GlobalEvents';

  const selectedCategory = ref<HTMLElement | null>(null);

  const props = defineProps<{
    isInAddWrapper?: boolean;
    canDeleteCategories?: boolean;
  }>();

  const cleanUpCategoriesSelection = () => {
    const categoryElements = categoriesWrapper.value?.querySelectorAll('.category');
    if (!categoryElements || categoryElements.length === 0) return;
    selectedCategory.value = null;
    categoryElements.forEach(el => {
      el.classList.remove('disabled');
      el.classList.remove('enabled');
    });
  };

  const deleteCategory = () => {
    const category = selectedCategory.value;
    if (!category || !props.canDeleteCategories) return;

    console.log('delete');
  };

  defineExpose({
    cleanUpCategoriesSelection,
    deleteCategory,
    selectedCategory
  });

  const emit = defineEmits(['categoryIsSelected', 'addCategoryClicked']);

  const events = useGlobalEvents();

  const categoriesWrapper = ref<HTMLElement | null>(null);
  const categories = ref<ICategoryType[] | null>(await ChromeStorageHelper.getInstance().getCategories());
  const visibleCategories = computed<ICategoryType[]>(() =>
    categories.value ? categories.value.filter(c => c.id !== 'custom-category') : []
  );

  const handleClickOnCategory = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    const categoryElements = categoriesWrapper.value?.querySelectorAll('.category');

    if (!categoryElements || categoryElements.length === 0 || !target) return;

    const isTargetDisabled = target.classList.contains('disabled');
    const anyDisabled = Array.from(categoryElements).some(el => el.classList.contains('disabled'));

    if (!isTargetDisabled && anyDisabled) {
      cleanUpCategoriesSelection();
      return;
    }

    categoryElements.forEach(el => {
      if (el !== target) {
        el.classList.add('disabled');
        if (props.canDeleteCategories) el.classList.remove('enabled');
      } else {
        el.classList.remove('disabled');
        if (props.canDeleteCategories) {
          el.classList.add('enabled');
          selectedCategory.value = target;
        } else emit('categoryIsSelected', target.innerText);
      }
    });
  };

  onMounted(async () => {
    events.on(ICustomEvents.storageInitiated, async () => {
      categories.value = await ChromeStorageHelper.getInstance().getCategories();
    });

    events.on(ICustomEvents.newCategoryCreated, async () => {
      categories.value = await ChromeStorageHelper.getInstance().getCategories();
    });
  });
</script>

<style scoped lang="scss">
  .categories-wrapper {
    position: relative;
    margin: 15px 0 25px;
    height: 180px;
    width: 100%;
    display: flex;

    .wrapper {
      position: relative;
      gap: 9px;
      height: fit-content;
      max-height: 100%;
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
      overflow-y: scroll;

      .category {
        position: relative;
        padding: 0 14px;
        height: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 7px;
        user-select: none;
        cursor: pointer;
        filter: grayscale(0);
        opacity: 1;
        font-size: 13px;
        font-variation-settings: 'wght' 450;
        transition:
          filter $transition-time $default-ease,
          opacity $transition-time $default-ease;

        &.disabled {
          filter: grayscale(0.6);
          opacity: 0.4;
        }

        @include has-hover {
          opacity: 0.7;
        }
      }

      .add {
        position: relative;
        height: 30px;
        width: 38px;
        border-radius: 7px;
        cursor: pointer;
        @include center();
        @include light-border;
        background: rgba($color-gray, 0.6);
        transition: background $transition-time $default-ease;

        @include has-hover {
          background: rgba($color-gray, 0.4);
        }

        svg {
          position: relative;
          height: 15px;
          stroke-width: 2px;
          color: $color-white;
        }
      }
    }

    &:before {
      position: absolute;
      content: '';
      bottom: 0;
      left: 0;
      height: 1px;
      width: 100%;
      z-index: 1;
      background: linear-gradient(rgba($color-black, 0) 0%, rgba($color-black, 0.25) 50%, rgba($color-black, 1) 100%);
    }
  }
</style>
