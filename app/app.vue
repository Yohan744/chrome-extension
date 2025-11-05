<template>
  <main>
    <MainWrapper />
    <AddWrapper />
    <SettingsWrapper />
    <Footer />
  </main>
</template>

<script setup lang="ts">
  import MainWrapper from '~/components/MainWrapper.vue';
  import AddWrapper from '~/components/AddWrapper.vue';
  import SettingsWrapper from '~/components/SettingsWrapper.vue';
  import Footer from '~/components/Footer.vue';
  import ChromeStorageHelper from '~/composables/ChromeStorageHelper';
  import ChromeBadgeHelper from '~/composables/ChromeBadgeTextHelper';

  onMounted(async () => {
    await ChromeStorageHelper.getInstance().initDefaultStorage();
    await ChromeStorageHelper.getInstance().migrateOldTodos();
    ChromeBadgeHelper.getInstance().init();
  });
</script>

<style scoped lang="scss">
  main {
    position: relative;
    height: 100%;
    width: 100%;
  }
</style>
