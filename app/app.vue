<template>
  <main>
    <MainWrapper />
    <AddWrapper />
    <SettingsWrapper />
    <WhatsNewPopup v-if="showWhatsNew" @close="handleWhatsNewClose" />
  </main>
</template>

<script setup lang="ts">
  import MainWrapper from '~/components/MainWrapper.vue';
  import AddWrapper from '~/components/AddWrapper.vue';
  import SettingsWrapper from '~/components/SettingsWrapper.vue';
  import WhatsNewPopup from '~/components/WhatsNewPopup.vue';
  import ChromeStorageHelper from '~/composables/ChromeStorageHelper';
  import ChromeBadgeHelper from '~/composables/ChromeBadgeTextHelper';

  const CURRENT_VERSION = chrome.runtime.getManifest().version;
  const showWhatsNew = ref<boolean>(false);

  const handleWhatsNewClose = async () => {
    showWhatsNew.value = false;
    await ChromeStorageHelper.getInstance().setLastSeenVersion(CURRENT_VERSION);
  };

  onMounted(async () => {
    await ChromeStorageHelper.getInstance().initDefaultStorage();
    await ChromeStorageHelper.getInstance().migrateOldTodos();
    await ChromeBadgeHelper.getInstance().init();

    const lastSeen = await ChromeStorageHelper.getInstance().getLastSeenVersion();
    if (lastSeen !== CURRENT_VERSION) showWhatsNew.value = true;
  });
</script>

<style scoped lang="scss">
  main {
    position: relative;
    height: 100%;
    width: 100%;
    background: linear-gradient($color-indigo 0, $color-rebecca-purple 0, $color-black 40%);
  }
</style>
