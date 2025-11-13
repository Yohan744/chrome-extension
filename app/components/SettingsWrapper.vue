<template>
  <section id="settings-wrapper">
    <GoBack :title="title" />
    <AddCustomCategory />
    <h4 v-if="CategoriesRef?.selectedCategory" class="delete-category-title">Delete category</h4>
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

  const CategoriesRef = ref<InstanceType<typeof Categories> | null>(null);
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

    .delete-category-title {
      position: relative;
      margin-top: 15px;
      font-size: 17px;
      font-variation-settings: 'wght' 600;
    }
  }
</style>
