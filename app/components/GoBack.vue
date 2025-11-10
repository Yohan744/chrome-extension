<template>
  <div class="go-back" :class="{ addWrapper: props.isAddWrapper }">
    <div class="button" @click="switchBetweenSections('main')">
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
    isAddWrapper?: boolean;
  }>();
</script>

<style scoped lang="scss">
  .go-back {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 15px;

    &.addWrapper {
      align-items: flex-start;

      .button {
        margin-top: 4px;
      }

      .title {
        line-height: 1.25;
      }
    }

    .button {
      position: relative;
      height: 35px;
      width: 45px;
      @include center;
      border-radius: 7px;
      cursor: pointer;
      background: rgba($color-gray, 0.9);
      transition: background $transition-time $default-ease;

      @include has-hover {
        background: rgba($color-gray, 0.6);
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
      line-height: 1;
      font-variation-settings: 'wght' 800;
    }
  }
</style>
