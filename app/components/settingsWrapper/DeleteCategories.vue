<template>
  <h4 class="delete-category-title">Delete category</h4>
  <Categories :can-delete-categories="true" />
</template>

<script setup lang="ts">
  import Categories from '~/components/addWrapper/Categories.vue';
</script>

<style scoped lang="scss">
  .delete-category-title {
    position: relative;
    margin-top: 30px;
    font-size: 18px;
    font-variation-settings: 'wght' 650;
  }
</style>
