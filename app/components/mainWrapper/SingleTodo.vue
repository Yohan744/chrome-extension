<template>
  <div class="single-todo" :data-id="props.todoItem.id">
    <TodoCheckbox :color="primaryColor" @checked="handleCheckboxClick" />
    <div class="right-part" :style="{ '--selection-bg': primaryColor }">
      <div class="icon-wrapper" :style="wrapperStyle">
        <Icon :icon-name="category?.iconName" :color="primaryColor" />
      </div>

      <div class="task-wrapper">
        <p class="task">{{ props.todoItem.task }}</p>
      </div>

      <div class="indicator" :style="{ background: category?.color || '#eeeeee' }" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import TodoCheckbox from '~/components/mainWrapper/TodoCheckbox.vue';
  import type { ITodoType } from '~/types/ITodoType';
  import type { ICategoryType } from '~/types/ICategoryType';
  import { useGlobalEvents } from '~/composables/GlobalEvents';
  import { ICustomEvents } from '~/constants/ICustomEvents';
  import ChromeStorageHelper from '~/composables/ChromeStorageHelper';
  import Icon from '~/components/Icon.vue';

  const props = defineProps<{
    todoItem: ITodoType;
    isForCustomCategory?: boolean;
  }>();

  const events = useGlobalEvents();

  const category = ref<ICategoryType | null>(
    await ChromeStorageHelper.getInstance().getCategoryById(props.todoItem.categoryId)
  );

  const primaryColor = computed(() => category.value?.color || '#eeeeee');
  const darkerBg = computed(() => `color-mix(in hsl, ${primaryColor.value} 40%, black)`);
  const wrapperStyle = computed(() => ({ background: darkerBg.value }));

  const handleCheckboxClick = async (target: HTMLElement) => {
    if (!target) return;
    const todoId = target.closest('.single-todo')?.getAttribute('data-id');
    if (!todoId || todoId === 'x') return;
    await ChromeStorageHelper.getInstance().deleteTodo(todoId);
    events.trigger(ICustomEvents.taskDeleted);
  };

  onMounted(async () => {
    if (!props.isForCustomCategory) return;

    events.on(ICustomEvents.storageInitiated, async () => {
      category.value = await ChromeStorageHelper.getInstance().getCategoryById(props.todoItem.categoryId);
    });

    events.on(ICustomEvents.customCategoryNewColor, async () => {
      category.value = await ChromeStorageHelper.getInstance().getCategoryById(props.todoItem.categoryId);
    });
  });
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
        transition: background $transition-time $default-ease;
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
        transition: background $transition-time $default-ease;
      }
    }
  }
</style>
