<template>
  <h4 class="category-title">Categories</h4>

  <div ref="categoriesWrapper" class="categories-wrapper">
    <div
      v-for="category in categories"
      :key="category.id"
      class="category"
      :style="{ background: category.color }"
      @click="e => handleClickOnCategory(e)"
    >
      {{ category.name }}
    </div>

    <div class="add" @click="switchBetweenSections('settings')">
      <PlusIcon />
    </div>
  </div>
</template>

<script setup lang="ts">
  import ChromeStorageHelper from '~/composables/ChromeStorageHelper';
  import type { ICategoryType } from '~/types/ICategoryType';
  import PlusIcon from '~/assets/icons/plus.svg?component';
  import switchBetweenSections from '~/composables/SwitchBetweenSections';

  const cleanUpCategoriesSelection = () => {
    const categoryElements = categoriesWrapper.value?.querySelectorAll('.category');
    if (!categoryElements || categoryElements.length === 0) return;
    categoryElements.forEach(el => {
      el.classList.remove('disabled');
    });
  };

  defineExpose({
    cleanUpCategoriesSelection
  });

  const emit = defineEmits(['categoryIsSelected']);

  const categoriesWrapper = ref<HTMLElement | null>(null);
  const categories = ref<ICategoryType[] | null>(await ChromeStorageHelper.getInstance().getCategories());

  const handleClickOnCategory = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    if (!target) return;
    const categoryElements = categoriesWrapper.value?.querySelectorAll('.category');
    if (!categoryElements || categoryElements.length === 0) return;
    categoryElements.forEach(el => {
      if (el !== target) {
        el.classList.add('disabled');
      } else {
        el.classList.remove('disabled');
        emit('categoryIsSelected', target.innerText);
      }
    });
  };
</script>

<style scoped lang="scss">
  .category-title {
    position: relative;
    margin-top: 40px;
    font-size: 18px;
    font-variation-settings: 'wght' 650;
  }

  .categories-wrapper {
    position: relative;
    margin-top: 20px;
    gap: 10px;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;

    .category {
      position: relative;
      padding: 0 15px;
      height: 38px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 7px;
      user-select: none;
      cursor: pointer;
      filter: grayscale(0);
      opacity: 1;
      font-variation-settings: 'wght' 480;
      transition:
        filter $transition-time $default-ease,
        opacity $transition-time $default-ease;

      &.disabled {
        filter: grayscale(1);
        opacity: 0.75;
      }
    }

    .add {
      position: relative;
      height: 25px;
      width: 25px;
      border-radius: 7px;
      cursor: pointer;
      @include center();
      border: 2px dashed $color-gray;
      transition: border $transition-time $default-ease;

      @include has-hover {
        &:hover {
          border-color: rgba($color-white, 0.85);

          svg {
            color: rgba($color-white, 0.85);
          }
        }
      }

      svg {
        position: relative;
        height: 15px;
        color: $color-gray;
        transition: color $transition-time $default-ease;
      }
    }
  }
</style>
