<template>
  <PopUp>
    <template #btn>
      <div class="btn">
        <Icon :icon-name="props.category?.iconName" />
      </div>
    </template>

    <template #content>
      <div class="content">
        <div v-for="icon in icons" :key="icon" class="icon-wrapper" @click="e => handleIconClick(e)">
          <Icon :data-icon="icon" :icon-name="icon" />
        </div>
      </div>
    </template>
  </PopUp>
</template>

<script setup lang="ts">
  import PopUp from '~/components/PopUp.vue';
  import { ICustomEvents } from '~/constants/ICustomEvents';
  import { useGlobalEvents } from '~/composables/GlobalEvents';
  import type { ICategoryType } from '~/types/ICategoryType';
  import Icon from '~/components/Icon.vue';
  import { IIcons } from '~/constants/IIcons';
  import ChromeStorageHelper from '~/composables/ChromeStorageHelper';

  const icons = IIcons;
  const events = useGlobalEvents();

  const emits = defineEmits(['iconSelected', 'updateCategory']);

  const props = defineProps<{
    category: ICategoryType | null;
  }>();

  const handleIconClick = async (e: MouseEvent) => {
    if (!props.category || !e.target) return;

    const target = e.target as HTMLElement;
    const iconName = target.getAttribute('data-icon');
    if (!iconName || iconName === props.category.iconName) return;
    await ChromeStorageHelper.getInstance().updateCategory(props.category.id, { iconName: iconName });
    events.trigger(ICustomEvents.updatedCustomCategory);
    emits('iconSelected', iconName);
    emits('updateCategory');
  };
</script>

<style scoped lang="scss">
  .btn {
    position: relative;
    padding: 6px;
    border-radius: 7px;
    cursor: pointer;
    background: rgba($color-gray, 0.4);
  }

  .content {
    position: relative;
    padding: 10px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    border-radius: 7px;
    background: rgba($color-gray, 1);

    .icon-wrapper {
      position: relative;
      padding: 7px;
      border-radius: 7px;
      cursor: pointer;
      background: rgba($color-white, 0.8);

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
        background: $color-white;
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
