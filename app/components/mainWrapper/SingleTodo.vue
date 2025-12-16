<template>
  <div class="single-todo" :data-id="props.todoItem.id">
    <TodoCheckbox ref="todoCheckboxRef" :color="primaryColor" @checked="handleCheckboxClick" />
    <div class="right-part" :style="{ '--selection-bg': primaryColor }">
      <div class="icon-wrapper" :style="wrapperStyle">
        <Icon :icon-name="category?.iconName" :color="primaryColor" />
      </div>

      <div class="task-wrapper">
        <p class="category-name" :style="{ background: primaryColor, color: category?.color.textColor }">
          {{ category?.name }}
        </p>
        <p class="task">{{ props.todoItem.task }}</p>
      </div>

      <div class="indicator" :style="{ background: primaryColor }" />
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
  import gsap from 'gsap';

  const props = defineProps<{
    todoItem: ITodoType;
    isForCustomCategory?: boolean;
  }>();

  const events = useGlobalEvents();
  const isAnimating = ref<boolean>(false);
  const todoCheckboxRef = ref<InstanceType<typeof TodoCheckbox> | null>(null);

  const category = ref<ICategoryType | null>(
    await ChromeStorageHelper.getInstance().getCategoryById(props.todoItem.categoryId)
  );

  const primaryColor = computed(() => category.value?.color.hex || '#eeeeee');
  const darkerBg = computed(() => `color-mix(in hsl, ${primaryColor.value} 40%, black)`);
  const wrapperStyle = computed(() => ({ background: darkerBg.value }));

  const handleCheckboxClick = async (target: HTMLElement) => {
    if (!target || isAnimating.value) return;
    const todoElement = target.closest('.single-todo') as HTMLElement;
    const todoId = todoElement?.getAttribute('data-id');
    if (!todoId || !todoElement || todoId === 'custom-category') return;

    const todoElementHeight = todoElement.offsetHeight;

    if (!todoElementHeight) return;

    await ChromeStorageHelper.getInstance().deleteTodo(todoId);
    isAnimating.value = true;

    const tl = gsap.timeline({
      delay: 0.525,
      force3D: true,
      onComplete: () => {
        tl.kill();
        events.trigger(ICustomEvents.taskDeleted);
        isAnimating.value = false;
      }
    });

    tl.to(todoElement, {
      scale: 0.5,
      opacity: 0,
      duration: 1,
      ease: 'power2.inOut'
    });

    tl.to(
      todoElement,
      {
        marginBottom: `-${todoElementHeight + 15}px`,
        duration: 0.75,
        ease: 'power2.out'
      },
      '-=0.45'
    );
  };

  onMounted(async () => {
    if (!props.isForCustomCategory) return;

    events.on(ICustomEvents.storageInitiated, async () => {
      category.value = await ChromeStorageHelper.getInstance().getCategoryById(props.todoItem.categoryId);
    });

    events.on(ICustomEvents.updatedCustomCategory, async () => {
      category.value = await ChromeStorageHelper.getInstance().getCategoryById(props.todoItem.categoryId);
    });

    events.on(ICustomEvents.cleanCustomCategoryTodo, () => {
      todoCheckboxRef.value?.uncheck();
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
    will-change: margin-bottom, transform, opacity;

    .right-part {
      position: relative;
      padding: 15px;
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      gap: 15px;
      border-radius: 7px;
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
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        flex-grow: 1;

        .category-name {
          position: relative;
          padding: 3px;
          border-radius: 7px;
          font-size: 12px;
        }

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
        border-radius: 0 7px 7px 0;
        transition: background $transition-time $default-ease;
      }
    }
  }
</style>
