<template>
  <footer>
    <div class="icon-wrapper" @click="switchBetweenSections('main')">
      <HomeIcon />
    </div>
    <div class="icon-wrapper" @click="switchBetweenSections('add')">
      <PlusIcon />
    </div>
    <div class="icon-wrapper" @click="switchBetweenSections('settings')">
      <SettingsIcon />
    </div>
  </footer>
</template>

<script setup lang="ts">
  import switchBetweenSections from '~/composables/SwitchBetweenSections';
  import HomeIcon from '~/assets/icons/home.svg?component';
  import PlusIcon from '~/assets/icons/plus.svg?component';
  import SettingsIcon from '~/assets/icons/settings.svg?component';
</script>

<style scoped lang="scss">
  footer {
    position: absolute;
    padding: 0 10%;
    bottom: 0;
    left: 0;
    height: $footer-height;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    z-index: z('footer');
    //background: red;

    .icon-wrapper {
      position: relative;
      padding: 3px;
      aspect-ratio: 1;
      //background: blue;
      border-radius: 7px;
      cursor: pointer;

      svg {
        position: relative;
        height: 20px;
        width: auto;
      }
    }
  }
</style>
