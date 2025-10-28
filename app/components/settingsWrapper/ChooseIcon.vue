<template>
  <PopUp>
    <template #btn>
      <div class="btn" :style="{ background: props.category?.color }">
        <Icon :icon-name="props.category?.iconName" :color="props.category?.color" />
      </div>
    </template>

    <template #content>
      <div class="content">
        <div v-for="icon in icons" :key="icon" class="icon" @click="e => handleIconClick(e)">
          <Icon :icon-name="icon" />
        </div>
      </div>
    </template>
  </PopUp>
</template>

<script setup lang="ts">
  import PopUp from '~/components/PopUp.vue';
  // import { ICustomEvents } from '~/constants/ICustomEvents';
  // import { useGlobalEvents } from '~/composables/GlobalEvents';
  import type { ICategoryType } from '~/types/ICategoryType';
  import Icon from '~/components/Icon.vue';
  import { IIcons } from '~/constants/IIcons';

  const icons = IIcons;
  // const events = useGlobalEvents();

  // const emits = defineEmits(['iconSelected', 'updateCategory']);

  const props = defineProps<{
    category: ICategoryType | null;
  }>();

  const handleIconClick = async (e: MouseEvent) => {
    console.log('click', e);
  };
</script>

<style scoped lang="scss">
  .btn {
    position: relative;
    height: 25px;
    width: 25px;
    border-radius: 7px;
    z-index: z('popUp-btn');
    cursor: pointer;
    transition: background $transition-time $default-ease;
  }

  .content {
    position: absolute;
    padding: 10px;
    top: 35px;
    left: -2px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    border-radius: 7px;
    background: rgba($color-gray, 1);

    .color {
      position: relative;
      height: 25px;
      width: 25px;
      border-radius: 7px;
      cursor: pointer;
      background: var(--color);

      &:before {
        position: absolute;
        content: '';
        bottom: -5px;
        left: 50%;
        height: 2px;
        width: 60%;
        border-radius: 7px;
        opacity: 0;
        transform: translate3d(-50%, 4px, 0);
        background: var(--color);
        transition:
          opacity $transition-time $default-ease,
          transform $transition-time $default-ease;
      }

      &.active {
        &:before {
          opacity: 1;
          transform: translate3d(-50%, 0, 0);
        }
      }
    }
  }
</style>
