<template>
  <div class="go-back" @click="switchBetweenSections('main')">
    <GoBackIcon />
  </div>
</template>

<script setup lang="ts">
  import switchBetweenSections from '~/composables/SwitchBetweenSections';
  import GoBackIcon from '~/assets/icons/go-back.svg?component';
</script>

<style scoped lang="scss">
  .go-back {
    position: relative;
    height: 30px;
    width: 30px;
    @include center;
    border-radius: 7px;
    background: rgba($color-gray, 0.6);

    svg {
      position: relative;
      height: 10px;
      width: auto;
      color: green;
    }
  }
</style>
