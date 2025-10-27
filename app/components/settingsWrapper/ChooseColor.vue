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
          :class="{ active: color === category?.color }"
          :style="{ backgroundColor: color }"
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
  const category = ref<ICategoryType | null>(null);

  onMounted(async () => {
    await updateCategory();

    events.on(ICustomEvents.storageInitiated, async () => {
      await updateCategory();
    });
  });

  const updateCategory = async () => {
    category.value = await ChromeStorageHelper.getInstance().getCategoryById('custom-category');
  };

  const handleColorClick = async (e: MouseEvent) => {
    if (!category.value || !e.target) return;

    const target = e.target as HTMLElement;
    const color = target.getAttribute('data-color');
    if (!color || color === category.value.color) return;
    await ChromeStorageHelper.getInstance().updateCategory(category.value.id, { color: color });
    await updateCategory();
    events.trigger(ICustomEvents.customCategoryNewColor);
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
    top: 40px;
    left: -3px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    border-radius: 7px;
    background: rgba($color-gray, 0.85);

    .color {
      position: relative;
      height: 25px;
      width: 25px;
      border-radius: 7px;
      cursor: pointer;

      &.active {
        border: 3px solid white;
      }
    }
  }
</style>
