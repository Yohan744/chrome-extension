<template>
  <div ref="categoriesWrapper" class="categories-wrapper">
    <div
      v-for="category in visibleCategories"
      :key="category.id"
      class="category"
      :style="{ background: category.color }"
      @click="e => handleClickOnCategory(e)"
    >
      {{ category.name }}
      <div v-if="props.canDeleteCategories" class="delete-btn" @click="e => deleteCategory(e)" />
    </div>

    <div v-if="props.isInAddWrapper" class="add" @click="switchBetweenSections('settings')">
      <PlusIcon />
    </div>
  </div>
</template>

<script setup lang="ts">
  import ChromeStorageHelper from '~/composables/ChromeStorageHelper';
  import type { ICategoryType } from '~/types/ICategoryType';
  import PlusIcon from '~/assets/icons/plus.svg?component';
  import switchBetweenSections from '~/composables/SwitchBetweenSections';
  import { ICustomEvents } from '~/constants/ICustomEvents';
  import { useGlobalEvents } from '~/composables/GlobalEvents';

  const props = defineProps<{
    isInAddWrapper?: boolean;
    canDeleteCategories?: boolean;
  }>();

  const cleanUpCategoriesSelection = () => {
    const categoryElements = categoriesWrapper.value?.querySelectorAll('.category');
    if (!categoryElements || categoryElements.length === 0) return;
    categoryElements.forEach(el => {
      el.classList.remove('disabled');
      el.classList.remove('enabled');
    });
  };

  defineExpose({
    cleanUpCategoriesSelection
  });

  const emit = defineEmits(['categoryIsSelected']);

  const events = useGlobalEvents();

  const categoriesWrapper = ref<HTMLElement | null>(null);
  const categories = ref<ICategoryType[] | null>(await ChromeStorageHelper.getInstance().getCategories());
  const visibleCategories = computed<ICategoryType[]>(() =>
    categories.value ? categories.value.filter(c => c.id !== 'custom-category') : []
  );

  const handleClickOnCategory = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    const categoryElements = categoriesWrapper.value?.querySelectorAll('.category');

    if (!categoryElements || categoryElements.length === 0 || !target) return;

    const isTargetDisabled = target.classList.contains('disabled');
    const anyDisabled = Array.from(categoryElements).some(el => el.classList.contains('disabled'));

    if (!isTargetDisabled && anyDisabled) {
      cleanUpCategoriesSelection();
      return;
    }

    categoryElements.forEach(el => {
      if (el !== target) {
        el.classList.add('disabled');
        if (props.canDeleteCategories) el.classList.remove('enabled');
      } else {
        el.classList.remove('disabled');
        if (props.canDeleteCategories) {
          el.classList.add('enabled');
        } else emit('categoryIsSelected', target.innerText);
      }
    });
  };

  const deleteCategory = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    if (!target) return;

    console.log('delete');
  };

  onMounted(async () => {
    events.on(ICustomEvents.storageInitiated, async () => {
      categories.value = await ChromeStorageHelper.getInstance().getCategories();
    });

    events.on(ICustomEvents.newCategoryCreated, async () => {
      categories.value = await ChromeStorageHelper.getInstance().getCategories();
    });
  });
</script>

<style scoped lang="scss">
  .categories-wrapper {
    position: relative;
    margin-top: 10px;
    padding-top: 10px;
    gap: 9px;
    max-height: 200px;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    overflow-y: scroll;

    .category {
      position: relative;
      padding: 0 14px;
      height: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 7px;
      user-select: none;
      cursor: pointer;
      filter: grayscale(0);
      opacity: 1;
      font-size: 14px;
      font-variation-settings: 'wght' 450;
      transition:
        filter $transition-time $default-ease,
        opacity $transition-time $default-ease;

      .delete-btn {
        position: absolute;
        top: 0;
        right: 0;
        height: 18px;
        width: 18px;
        background: $color-white;
        cursor: pointer;
        border-radius: 50px;
        z-index: 1;
        pointer-events: none;
        opacity: 0;
        transform: translate3d(50%, -50%, 0);
        transition: opacity calc($transition-time * 0.65) $default-ease;

        &:before,
        &:after {
          position: absolute;
          content: '';
          top: 50%;
          left: 50%;
          height: 2px;
          width: 60%;
          border-radius: 3px;
          background: $color-black;
          transform: translate3d(-50%, -50%, 0) rotate(45deg) scaleY(0.8);
          transition: transform calc($transition-time * 0.65) $default-ease;
        }

        &:after {
          transform: translate3d(-50%, -50%, 0) rotate(-45deg) scaleY(0.8);
        }

        @include has-hover {
          &:before,
          &:after {
            transform: translate3d(-50%, -50%, 0) rotate(0deg);
          }
        }
      }

      &.disabled {
        filter: grayscale(0.6);
        opacity: 0.4;
      }

      &.enabled {
        .delete-btn {
          pointer-events: auto;
          opacity: 1;
        }
      }

      @include has-hover {
        opacity: 0.7;
      }
    }

    .add {
      position: relative;
      height: 25px;
      width: 25px;
      border-radius: 7px;
      cursor: pointer;
      @include center();
      border: 2px dashed $color-gray;
      transition: border $transition-time $default-ease;

      @include has-hover {
        border-color: rgba($color-white, 0.75);

        svg {
          color: rgba($color-white, 0.75);
          transform: scale3d(0.7, 0.7, 0.7);
        }
      }

      svg {
        position: relative;
        height: 18px;
        stroke-width: 2px;
        color: $color-gray;
        transform: scale3d(1, 1, 1);
        transition:
          color $transition-time $default-ease,
          transform calc($transition-time * 0.75) $default-ease;
      }
    }
  }
</style>
