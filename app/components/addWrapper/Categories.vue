<template>
  <h4 class="category-title">Categories</h4>

  <div class="categories-wrapper">
    <div v-for="category in categories" :key="category.id" class="category" :style="{ background: category.color }">
      {{ category.name }}
    </div>
    <div class="add"></div>
  </div>
</template>

<script setup lang="ts">
  import ChromeStorageHelper from '~/composables/ChromeStorageHelper';
  import type { ICategoryType } from '~/types/ICategoryType';

  const categories = ref<ICategoryType[] | null>(await ChromeStorageHelper.getInstance().getCategories());
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
      font-variation-settings: 'wght' 480;
    }

    .add {
      position: relative;
      height: 25px;
      width: 25px;
      border-radius: 7px;
      cursor: pointer;
      border: 2px solid $color-gray;
    }
  }
</style>
