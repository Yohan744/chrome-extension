<template>
  <PopUp>
    <template #btn>
      <div class="btn" :style="{ background: category?.color }" />
    </template>

    <template #content>
      <div class="content">
        <div
          v-for="color in colors"
          :key="color"
          :style="{ '--color': color }"
          :class="{ active: color === category?.color }"
          class="color"
          :data-color="color"
          @click="e => handleColorClick(e)"
        />
      </div>
    </template>
  </PopUp>
</template>

<script setup lang="ts">
  import PopUp from '~/components/PopUp.vue';
  import { IColors } from '~/constants/IColors';
  import type { ICategoryType } from '~/types/ICategoryType';
  import ChromeStorageHelper from '~/composables/ChromeStorageHelper';
  import { ICustomEvents } from '~/constants/ICustomEvents';
  import { useGlobalEvents } from '~/composables/GlobalEvents';

  const colors = IColors;
  const events = useGlobalEvents();

  const emits = defineEmits(['colorSelected', 'updateCategory']);

  const props = defineProps<{
    category: ICategoryType | null;
  }>();

  const handleColorClick = async (e: MouseEvent) => {
    if (!props.category || !e.target) return;

    const target = e.target as HTMLElement;
    const color = target.getAttribute('data-color');
    if (!color || color === props.category.color) return;
    await ChromeStorageHelper.getInstance().updateCategory(props.category.id, { color: color });
    events.trigger(ICustomEvents.updatedCustomCategory);
    emits('colorSelected', color);
    emits('updateCategory');
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
    position: relative;
    padding: 10px;
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
