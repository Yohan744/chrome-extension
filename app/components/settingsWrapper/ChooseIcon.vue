<template>
  <PopUp>
    <template #btn>
      <div class="btn">
        <Icon :icon-name="props.category?.iconName" />
      </div>
    </template>

    <template #content>
      <div class="content">
        <div
          v-for="icon in icons"
          :key="icon"
          class="icon-wrapper"
          :class="{ active: icon === category?.iconName }"
          @click="e => handleIconClick(e)"
        >
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
  import gsap from 'gsap';

  const icons = IIcons;
  const events = useGlobalEvents();
  const isAnimating = ref<boolean>(false);

  const emits = defineEmits(['iconSelected', 'updateCategory']);

  const props = defineProps<{
    category: ICategoryType | null;
  }>();

  const animateIconUpdate = () => {
    const tl = gsap.timeline({
      overwrite: true,
      force3D: true,
      onComplete: () => {
        isAnimating.value = false;
        tl.kill();
      }
    });

    tl.fromTo(
      '.main-wrapper .btn-wrapper .btn .icon',
      {
        scale: 1,
        rotate: 0
      },
      {
        scale: 0,
        rotate: 70,
        duration: 0.5,
        ease: 'power2.inOut'
      }
    );

    tl.fromTo(
      '.main-wrapper .btn-wrapper .btn .icon',
      {
        scale: 0,
        rotate: -70
      },
      {
        scale: 1,
        rotate: 0,
        duration: 0.65,
        ease: 'power2.inOut'
      },
      '-=0.125'
    );
  };

  const handleIconClick = async (e: MouseEvent) => {
    if (!props.category || !e.target || isAnimating.value) return;

    const target = e.target as HTMLElement;
    const iconName = target.children[0]?.getAttribute('data-icon');
    if (!iconName || iconName === props.category.iconName) return;
    events.trigger(ICustomEvents.updatedCustomCategoryIcon);
    animateIconUpdate();
    isAnimating.value = true;
    setTimeout(async () => {
      if (!props.category) return;
      await ChromeStorageHelper.getInstance().updateCategory(props.category.id, { iconName: iconName });
      events.trigger(ICustomEvents.updatedCustomCategory);
      emits('iconSelected', iconName);
      emits('updateCategory');
    }, 500);
  };
</script>

<style scoped lang="scss">
  .btn {
    position: relative;
    height: 31px;
    width: 31px;
    padding: 6px;
    border-radius: 7px;
    cursor: pointer;
    @include center;
    background: rgba($color-gray, 0.4);

    :deep(.icon) {
      height: 18px;
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

    .icon-wrapper {
      position: relative;
      height: 32px;
      width: 32px;
      border-radius: 7px;
      @include center;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.04);
      transition: background $transition-time $default-ease;

      @include has-hover {
        background: rgba(255, 255, 255, 0.1);
      }

      :deep(.icon) {
        height: 18px;
        width: auto;
        transform: scale(1);
        pointer-events: none;
        opacity: 0.8;
        transition:
          transform $transition-time $default-ease,
          opacity $transition-time $default-ease;
      }

      &.active {
        background: rgba(255, 255, 255, 0.25);

        :deep(.icon) {
          transform: scale(1.075);
          opacity: 1;
        }
      }
    }
  }
</style>
