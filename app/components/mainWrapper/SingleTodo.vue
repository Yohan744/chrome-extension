<template>
  <div class="single-todo">
    <TodoCheckbox @checked="handleCheckboxClick" />
    <div class="right-part" :style="{ '--selection-bg': primaryColor }">
      <div class="icon-wrapper" :style="wrapperStyle">
        <div class="icon" :style="iconStyle"></div>
      </div>

      <div class="task-wrapper">
        <p class="task">{{ props.todoItem.task }}</p>
      </div>

      <div class="indicator" :style="{ background: category?.color }" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import TodoCheckbox from '~/components/mainWrapper/TodoCheckbox.vue';
  import type { ITodoType } from '~/types/ITodoType';
  import type { ICategoryType } from '~/types/ICategoryType';

  const props = defineProps<{
    todoItem: ITodoType;
  }>();

  const category = ref<ICategoryType | null>(
    await ChromeStorageHelper.getInstance().getCategoryById(props.todoItem.categoryId)
  );

  const runtimeConfig = useRuntimeConfig();
  const baseURL = runtimeConfig.app?.baseURL || '/';
  const iconSrc = computed(() => {
    const name = category.value?.iconName || 'ellipsis';
    return `${baseURL}app-icons/${name}.svg`;
  });

  const primaryColor = computed(() => category.value?.color || '#9aa0a6');
  const darkerBg = computed(() => `color-mix(in hsl, ${primaryColor.value} 40%, black)`);
  const wrapperStyle = computed(() => ({ background: darkerBg.value }));

  const iconStyle = computed(() => ({
    maskImage: `url(${iconSrc.value})`,
    backgroundColor: primaryColor.value
  }));

  const handleCheckboxClick = () => {
    console.log('Checkbox checked!');
  };
</script>

<style scoped lang="scss">
  .single-todo {
    position: relative;
    height: auto;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;

    .right-part {
      position: relative;
      padding: 15px;
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      gap: 15px;
      border-radius: 10px;
      background: rgba($color-gray, 0.4);

      .icon-wrapper {
        position: relative;
        padding: 6px;
        @include center;
        border-radius: 7px;

        .icon {
          position: relative;
          height: 20px;
          aspect-ratio: 1;
          mask-size: 100%;
          background-repeat: no-repeat;
        }
      }

      .task-wrapper {
        position: relative;
        height: 100%;
        width: 100%;
        display: flex;
        flex-grow: 1;

        .task {
          position: relative;
          font-size: 16px;
          line-height: 1.45;
          font-variation-settings: 'wght' 500;

          &::selection {
            background: var(--selection-bg);
            color: $color-white;
          }
        }
      }

      .indicator {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        width: 8px;
        border-radius: 0 10px 10px 0;
      }
    }
  }
</style>
