<template>
  <div
    ref="categoriesWrapper"
    class="categories-wrapper"
    :style="{ height: props.canDeleteCategories ? '140px' : '185px' }"
  >
    <div ref="WrapperRef" class="wrapper">
      <div
        v-for="category in visibleCategories"
        :key="category.id"
        :data-id="category.id"
        class="category"
        :style="{ background: category.color.hex, color: category.color.textColor }"
        @click="e => handleClickOnCategory(e)"
      >
        <Icon :icon-name="category?.iconName" :color="category.color.textColor" />
        <p class="text">{{ category.name }}</p>
      </div>

      <div v-if="props.isInAddWrapper" class="add" @click="emit('addCategoryClicked')">
        <PlusIcon />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import ChromeStorageHelper from '~/composables/ChromeStorageHelper';
  import type { ICategoryType } from '~/types/ICategoryType';
  import PlusIcon from '~/assets/icons/plus.svg?component';
  import { ICustomEvents } from '~/constants/ICustomEvents';
  import { useGlobalEvents } from '~/composables/GlobalEvents';
  import gsap from 'gsap';
  import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
  import Icon from '~/components/Icon.vue';

  if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollToPlugin);
  }

  const selectedCategory = ref<HTMLElement | null>(null);
  const WrapperRef = ref<HTMLElement | null>(null);
  const isAnimatingCategoryDeletion = ref(false);
  const events = useGlobalEvents();

  const props = defineProps<{
    isInAddWrapper?: boolean;
    canDeleteCategories?: boolean;
  }>();

  const cleanUpCategoriesSelection = (scrollToTop: boolean = true) => {
    const categoryElements = categoriesWrapper.value?.querySelectorAll('.category');
    selectedCategory.value = null;
    if (scrollToTop) WrapperRef.value?.scrollTo({ top: 0, behavior: 'instant' });
    if (!categoryElements || categoryElements.length === 0) return;
    categoryElements.forEach(el => {
      el.classList.remove('disabled');
      el.classList.remove('enabled');
    });
  };

  const deleteCategory = () => {
    const category = selectedCategory.value;
    if (!category || !props.canDeleteCategories || isAnimatingCategoryDeletion.value) return;

    const categoryWidth = category.offsetWidth;
    const categoryID = category.getAttribute('data-id');
    const iconElement = category.querySelector('.icon') as HTMLElement;
    const textElement = category.querySelector('.text') as HTMLElement;

    if (!categoryID || !categoryWidth || !iconElement || !textElement) return;

    isAnimatingCategoryDeletion.value = true;

    gsap.set(category, {
      width: `${categoryWidth}px`,
      padding: '0px'
    });

    const tl = gsap.timeline({
      overwrite: true,
      force3D: true,
      onComplete: () => {
        tl.kill();
        category.remove();
        cleanUpCategoriesSelection(false);
        isAnimatingCategoryDeletion.value = false;
        ChromeStorageHelper.getInstance().deleteCategory(categoryID);
        events.trigger(ICustomEvents.categoryDeleted, categoryID);
      }
    });

    tl.to(
      [textElement, iconElement],
      {
        opacity: 0,
        duration: 0.7,
        ease: 'power1.out'
      },
      0
    );

    tl.to(
      category,
      {
        clipPath: 'inset(0 100% 0 0 round 7px)',
        duration: 1.15,
        ease: 'power2.out'
      },
      0.15
    );

    tl.to(
      category,
      {
        marginRight: `-9px`,
        width: 0,
        duration: 1,
        ease: 'power2.out'
      },
      0.65
    );
  };

  const animateCategoryApparition = (categoryElement: HTMLElement) => {
    gsap.set(categoryElement, {
      opacity: 0,
      scale: 0
    });

    const tl = gsap.timeline({
      overwrite: true,
      force3D: true,
      onComplete: () => {
        tl.kill();
      }
    });

    const hasEnoughSpaceToScroll = WrapperRef.value
      ? WrapperRef.value.scrollHeight > WrapperRef.value.clientHeight
      : false;

    if (hasEnoughSpaceToScroll) {
      tl.to(
        WrapperRef.value,
        {
          scrollTo: { y: 'max' },
          duration: 0.85,
          ease: 'power2.inOut'
        },
        0
      );
    }

    tl.to(
      categoryElement,
      {
        opacity: 1,
        scale: 1,
        duration: 0.75,
        ease: 'power3.out'
      },
      hasEnoughSpaceToScroll ? 0.85 : 0
    );

    tl.to(
      WrapperRef.value,
      {
        scrollTo: { y: 0 },
        duration: 0.6,
        ease: 'power2.inOut'
      },
      hasEnoughSpaceToScroll ? 1.85 : 0
    );
  };

  defineExpose({
    cleanUpCategoriesSelection,
    deleteCategory,
    selectedCategory
  });

  const emit = defineEmits(['categoryIsSelected', 'addCategoryClicked']);

  const categoriesWrapper = ref<HTMLElement | null>(null);
  const categories = ref<ICategoryType[] | null>(await ChromeStorageHelper.getInstance().getCategories());
  const visibleCategories = computed<ICategoryType[]>(() =>
    categories.value ? categories.value.filter(c => c.id !== 'custom-category') : []
  );

  const handleClickOnCategory = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    const categoryElements = categoriesWrapper.value?.querySelectorAll('.category');

    if (!categoryElements || categoryElements.length === 0 || !target || isAnimatingCategoryDeletion.value) return;

    const isTargetDisabled = target.classList.contains('disabled');
    const anyDisabled = Array.from(categoryElements).some(el => el.classList.contains('disabled'));

    if (!isTargetDisabled && anyDisabled) {
      cleanUpCategoriesSelection(false);
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
          selectedCategory.value = target;
        } else emit('categoryIsSelected', target.innerText);
      }
    });
  };

  onMounted(async () => {
    events.on(ICustomEvents.storageInitiated, async () => {
      categories.value = await ChromeStorageHelper.getInstance().getCategories();
    });

    events.on(ICustomEvents.newCategoryCreated, async categoryID => {
      categories.value = await ChromeStorageHelper.getInstance().getCategories();
      cleanUpCategoriesSelection(false);
      if (props.isInAddWrapper && !props.canDeleteCategories) return;
      await nextTick();
      const categoryToAnimate = categoriesWrapper.value?.querySelector(
        `.category[data-id="${categoryID}"]`
      ) as HTMLElement;
      if (!categoryToAnimate) return;
      animateCategoryApparition(categoryToAnimate);
    });

    events.on(ICustomEvents.categoryDeleted, async categoryID => {
      if (!categories.value) return;
      categories.value = categories.value.filter(category => category.id !== categoryID);
    });
  });
</script>

<style scoped lang="scss">
  .categories-wrapper {
    position: relative;
    margin: 15px 0 0;
    width: 100%;
    display: flex;

    .wrapper {
      position: relative;
      padding-bottom: 15px;
      gap: 9px;
      height: fit-content;
      max-height: 100%;
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
      scroll-behavior: smooth;
      scrollbar-width: none;
      -ms-overflow-style: none;
      overflow-x: hidden;
      overflow-y: scroll;

      .category {
        position: relative;
        padding: 0 11px 0 10px;
        height: 35px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 7px;
        user-select: none;
        cursor: pointer;
        filter: grayscale(0);
        opacity: 1;
        clip-path: inset(0 0 0 0 round 7px);
        will-change: opacity, filter, clip-path, margin, width, padding;
        transition:
          filter $transition-time $default-ease,
          opacity $transition-time $default-ease;

        &.disabled {
          filter: grayscale(0.6) !important;
          opacity: 0.4 !important;
        }

        @include has-hover {
          opacity: 0.75 !important;
        }

        :deep(.icon) {
          margin-right: 7px;
          height: 15px;
        }

        .text {
          position: relative;
          font-size: 13px;
          font-variation-settings: 'wght' 500;
        }
      }

      .add {
        position: relative;
        height: 30px;
        width: 38px;
        border-radius: 7px;
        cursor: pointer;
        @include center();
        @include light-border;
        background: rgba($color-gray, 0.6);
        transition: background $transition-time $default-ease;

        @include has-hover {
          background: rgba($color-gray, 0.4);
        }

        svg {
          position: relative;
          height: 15px;
          stroke-width: 2px;
          color: $color-white;
        }
      }
    }

    &:before {
      position: absolute;
      content: '';
      bottom: 0;
      left: 0;
      height: 50px;
      width: 100%;
      z-index: 1;
      pointer-events: none;
      background: linear-gradient(rgba($color-black, 0) 0%, rgba($color-black, 0.25) 50%, rgba($color-black, 1) 100%);
    }
  }
</style>
