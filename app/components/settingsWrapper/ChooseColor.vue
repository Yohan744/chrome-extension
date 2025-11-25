<template>
  <PopUp>
    <template #btn>
      <div class="btn">
        <div class="color" :style="{ background: category?.color }" />
      </div>
    </template>

    <template #content>
      <div class="content">
        <div
          v-for="color in colors"
          :key="color"
          :class="{ active: color === category?.color }"
          class="color"
          :data-color="color"
          @click="e => handleColorClick(e)"
        >
          <div :style="{ '--color': color }" />
        </div>
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
    height: 31px;
    width: 31px;
    border-radius: 7px;
    padding: 8px;
    z-index: z('popUp-btn');
    cursor: pointer;
    transition: background $transition-time $default-ease;
    background: rgba($color-gray, 0.4);

    .color {
      position: relative;
      height: 100%;
      width: 100%;
      border-radius: 3px;
    }
  }

  .content {
    position: relative;
    height: fit-content;
    width: 100%;
    padding: 10px;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 10px;
    border-radius: 7px;
    background: rgba($color-gray, 0.85);

    .color {
      position: relative;
      height: 28px;
      width: 28px;
      border-radius: 7px;
      border: 1px solid rgba($color-gray, 0.2);
      padding: 4px;
      cursor: pointer;
      background: rgba($color-gray, 0.4);

      div {
        position: relative;
        height: 100%;
        width: 100%;
        border-radius: 3px;
        background: var(--color);
        pointer-events: none;
      }

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
        //&:before {
        //  opacity: 1;
        //  transform: translate3d(-50%, 0, 0);
        //}

        border: 1px solid rgba($color-gray, 1);
      }
    }
  }
</style>
