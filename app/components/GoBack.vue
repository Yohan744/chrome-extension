<template>
  <div class="go-back">
    <div class="button" :style="{ marginTop: props.marginTop ? '4px' : '0' }" @click="switchBetweenSections('main')">
      <GoBackIcon />
    </div>

    <h1 class="title" v-html="props.title" />
  </div>
</template>

<script setup lang="ts">
  import switchBetweenSections from '~/composables/SwitchBetweenSections';
  import GoBackIcon from '~/assets/icons/go-back.svg?component';

  const props = defineProps<{
    title: string;
    marginTop?: boolean;
  }>();
</script>

<style scoped lang="scss">
  .go-back {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 15px;

    .button {
      position: relative;
      margin-bottom: 20px;
      height: 35px;
      width: 45px;
      @include center;
      border-radius: 7px;
      cursor: pointer;
      background: rgba($color-gray, 0.5);
      transition: background $transition-time $default-ease;

      @include has-hover {
        background: rgba($color-gray, 0.9);
      }

      svg {
        position: relative;
        height: auto;
        width: 18px;
        color: $color-white;
      }
    }

    .title {
      position: relative;
      font-size: 27px;
      line-height: 1.25;
      font-variation-settings: 'wght' 800;
    }
  }
</style>
