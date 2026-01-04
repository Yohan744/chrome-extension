<template>
  <div class="single-todo" :data-id="props.todoItem.id">
    <TodoCheckbox ref="todoCheckboxRef" :color="primaryColor" :text-color="textColor" @checked="handleCheckboxClick" />
    <div class="right-part-todo" :style="{ '--selection-bg': primaryColor }">
      <div class="icon-wrapper" :style="wrapperStyle">
        <Icon :icon-name="category?.iconName" :color="primaryColor" />
      </div>

      <div class="task-wrapper">
        <p class="category-name" :style="{ background: primaryColor, color: textColor }">
          {{ category?.name || 'Other' }}
        </p>
        <p class="task">{{ props.todoItem.task }}</p>
      </div>

      <div class="drag-handle" @mousedown="onDragStart">
        <GrabHandleIcon />
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
  import GrabHandleIcon from '~/assets/icons/grab-handle.svg?component';
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

  const primaryColor = computed(() => category.value?.color.hex || '#ffffff');
  const textColor = computed(() => category.value?.color.textColor || '#07060f');
  const darkerBg = computed(() => `color-mix(in hsl, ${primaryColor.value} 40%, black)`);
  const wrapperStyle = computed(() => ({ background: darkerBg.value }));

  const handleCheckboxClick = async (target: HTMLElement) => {
    if (!target || isAnimating.value) return;
    const todoElement = target.closest('.single-todo') as HTMLElement;
    const todoId = todoElement?.getAttribute('data-id');
    if (!todoId || !todoElement || todoId === 'custom-category') return;

    const todoElementHeight = todoElement.offsetHeight;

    if (!todoElementHeight) return;

    const todoOrderNumber = await ChromeStorageHelper.getInstance().getTodoOrderById(todoId);
    const biggestTodoOrder = await ChromeStorageHelper.getInstance().getBiggestOrderNumberInTodos();
    const isLastTodo = todoOrderNumber === biggestTodoOrder;
    const parentElement = todoElement.parentElement;
    const hasEnoughSpaceToScroll = parentElement ? parentElement.scrollHeight > parentElement.clientHeight + 75 : false;

    await ChromeStorageHelper.getInstance().deleteTodo(todoId);
    isAnimating.value = true;
    emit('delete-todo', todoId);

    gsap.set(todoElement, {
      scale: 1,
      opacity: 1,
      transition: 'none'
    });

    const tl = gsap.timeline({
      delay: 0.6,
      overwrite: true,
      force3D: true,
      onComplete: () => {
        tl.kill();
        todoElement.remove();
        events.trigger(ICustomEvents.taskDeleted, todoId);
        isAnimating.value = false;
      }
    });

    tl.to(todoElement, {
      scale: 0.65,
      opacity: 0,
      duration: 1,
      ease: 'power2.inOut'
    });

    const vars = {
      margin: isLastTodo
        ? hasEnoughSpaceToScroll
          ? `-${todoElementHeight + 15}px 0 0`
          : `0 0 -${todoElementHeight + 15}px`
        : `0 0 -${todoElementHeight + 15}px`,
      scaleY: 0,
      duration: 1.25,
      ease: 'power4.out'
    };

    tl.to(todoElement, vars, '-=0.35');
  };

  const emit = defineEmits(['drag-start', 'drag-move', 'drag-end', 'delete-todo']);

  const onDragStart = (event: MouseEvent) => {
    event.preventDefault();
    emit('drag-start', props.todoItem.id, event.clientY);

    const onMouseMove = (e: MouseEvent) => {
      emit('drag-move', props.todoItem.id, e.clientY);
    };

    const onMouseUp = () => {
      emit('drag-end', props.todoItem.id);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
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
    opacity: 1;
    will-change: margin, transform, opacity;
    transition: opacity calc($transition-time * 2) $default-ease;

    .right-part-todo {
      position: relative;
      padding: 15px;
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: normal;
      gap: 11px;
      border-radius: 7px;
      background: rgba($color-gray, 0.4);

      .icon-wrapper {
        position: relative;
        padding: 6px 9px;
        @include center;
        border-radius: 4px;
        transition: background $transition-time $default-ease;
      }

      .task-wrapper {
        position: relative;
        height: 100%;
        width: 100%;
        max-width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        flex-grow: 1;
        gap: 5px;

        .category-name {
          position: relative;
          padding: 3px 5px;
          border-radius: 4px;
          font-size: 8px;
          font-variation-settings: 'wght' 480;
          user-select: none;
        }

        .task {
          position: relative;
          width: 90%;
          word-break: break-word;
          font-size: 16px;
          line-height: 1.35;
          font-variation-settings: 'wght' 530;

          &::selection {
            background: var(--selection-bg);
            color: $color-white;
          }
        }
      }

      .drag-handle {
        position: absolute;
        padding: 2px;
        bottom: 7px;
        right: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: grab;
        opacity: 0.6;
        transition: opacity $transition-time $default-ease;

        @include has-hover {
          opacity: 0.15;
        }

        &:active {
          cursor: grabbing;
        }

        svg {
          position: relative;
          height: 12px;
          width: auto;
          color: $color-gray;
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
