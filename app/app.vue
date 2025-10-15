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
</script>

<style scoped lang="scss">
  main {
    position: relative;
    height: 100%;
    width: 100%;
  }
</style>
