<template>
  <section id="settings-wrapper">
    <GoBack :title="title" @go-back-clicked="handleGoBackClicked" />
    <AddCustomCategory ref="AddCustomCategoryRef" />
    <div class="delete-category-wrapper">
      <div class="title">Delete category</div>
      <button
        :class="{ active: CategoriesRef?.selectedCategory }"
        class="button"
        @click="CategoriesRef?.deleteCategory"
      >
        Delete
      </button>
    </div>
    <Categories ref="CategoriesRef" :can-delete-categories="true" />
    <SettingsFooter />
  </section>
</template>

<script setup lang="ts">
  import AddCustomCategory from './settingsWrapper/AddCustomCategory.vue';
  import Categories from '~/components/addWrapper/Categories.vue';
  import GoBack from '~/components/GoBack.vue';
  import SettingsFooter from '~/components/settingsWrapper/SettingsFooter.vue';

  const title = 'Settings';

  const AddCustomCategoryRef = ref<InstanceType<typeof AddCustomCategory> | null>(null);
  const CategoriesRef = ref<InstanceType<typeof Categories> | null>(null);

  const handleGoBackClicked = () => {
    CategoriesRef.value?.cleanUpCategoriesSelection();
    AddCustomCategoryRef.value?.clean();
  };
</script>

<style scoped lang="scss">
  #settings-wrapper {
    position: absolute;
    padding: 30px 20px 20px;
    inset: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-content: flex-start;
    background: linear-gradient($color-indigo 0, $color-rebecca-purple 0, $color-black 40%);
    pointer-events: none;
    opacity: 0;

    .delete-category-wrapper {
      position: relative;
      margin-top: 25px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 15px;

      .title {
        position: relative;
        font-size: 17px;
        font-variation-settings: 'wght' 600;
      }

      .button {
        position: relative;
        height: 30px;
        width: 72px;
        @include center();
        border: none;
        background: linear-gradient(120deg, $color-blue-violet 0%, $color-orchid 70%);
        border-radius: 7px;
        cursor: pointer;
        font-size: 10px;
        font-variation-settings: 'wght' 550;
        color: $color-white;
        opacity: 0.35;
        filter: grayscale(1);
        pointer-events: none;
        transition:
          opacity $transition-time $default-ease,
          filter $transition-time $default-ease;

        &.active {
          opacity: 1;
          filter: grayscale(0);
          pointer-events: all;
        }

        &:hover {
          opacity: 0.7;
        }
      }
    }
  }
</style>
