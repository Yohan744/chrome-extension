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
          :style="{ '--color': color, '--color-rgb': hexToRgb(color) }"
          :class="{ active: color === category?.color }"
          class="color"
          :data-color="color"
          @click="e => handleColorClick(e)"
        >
          <div />
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

  const hexToRgb = (hex: string) => {
    const h = hex.replace('#', '');
    const bigint = parseInt(
      h.length === 3
        ? h
            .split('')
            .map(c => c + c)
            .join('')
        : h,
      16
    );
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
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
    padding: 25px 20px 20px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 10px;

    .color {
      position: relative;
      height: 30px;
      width: 30px;
      border-radius: 7px;
      cursor: pointer;
      border: 2px solid rgba($color-gray, 0.15);
      transition: border $transition-time $default-ease;

      div {
        position: relative;
        height: 100%;
        width: 100%;
        border-radius: 3px;
        background: var(--color);
        pointer-events: none;
        transform: scale(0.55);
        transition:
          transform $transition-time $default-ease,
          border-radius $transition-time $default-ease;
      }

      &.active {
        border: 2px solid rgba(var(--color-rgb), 1);

        div {
          border-radius: 3px;
          transform: scale(0.7);
        }
      }
    }
  }
</style>
