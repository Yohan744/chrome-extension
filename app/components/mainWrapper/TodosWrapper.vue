<template>
  <div ref="wrapperRef" class="todos-wrapper">
    <SingleTodo
      v-for="todo in sortedTodos"
      :key="todo.id"
      :todo-item="todo"
      :class="{ 'is-dragging': dragState.draggingId === todo.id }"
      @drag-start="onDragStart"
      @drag-move="onDragMove"
      @drag-end="onDragEnd"
      @delete-todo="handleTodoDeletion"
    />
  </div>
</template>

<script setup lang="ts">
  import SingleTodo from '~/components/mainWrapper/SingleTodo.vue';
  import ChromeStorageHelper from '~/composables/ChromeStorageHelper';
  import type { ITodoType } from '~/types/ITodoType';
  import { useGlobalEvents } from '~/composables/GlobalEvents';
  import { ICustomEvents } from '~/constants/ICustomEvents';
  import gsap from 'gsap';
  import { Flip } from 'gsap/Flip';
  import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

  gsap.registerPlugin(Flip, ScrollToPlugin);

  const events = useGlobalEvents();
  const todos = ref<ITodoType[]>(await ChromeStorageHelper.getInstance().getTodos());
  const wrapperRef = ref<HTMLElement | null>(null);
  const lastDeletedTodoId = ref<string | null>(null);
  let creationTl: gsap.core.Timeline | null = null;

  const dragState = reactive({
    draggingId: null as string | null,
    startY: 0,
    lastY: 0,
    lastDirection: null as -1 | 1 | null,
    canDrag: true as boolean
  });

  const sortedTodos = computed(() => {
    return [...todos.value].sort((a, b) => a.order - b.order);
  });

  const getTodoElements = () => wrapperRef.value?.querySelectorAll('[data-id]') ?? [];

  const getTodoElementById = (id: string): HTMLElement | null => {
    return wrapperRef.value?.querySelector(`[data-id="${id}"]`) ?? null;
  };

  onMounted(async () => {
    events.on(ICustomEvents.taskCreated, async taskId => {
      await updateTodos();
      await nextTick();
      gsap.delayedCall(0, () => {
        animateTodoApparition(getTodoElementById(taskId as string) as HTMLElement);
      });
    });

    events.on(ICustomEvents.taskDeleted, async todoId => {
      await updateTodos();
      if (lastDeletedTodoId.value === todoId) lastDeletedTodoId.value = null;
    });

    events.on(ICustomEvents.storageInitiated, async () => {
      await updateTodos();
    });

    events.on(ICustomEvents.migrationDone, async () => {
      await updateTodos();
    });
  });

  const scrollToTodo = (id: string, direction: -1 | 1 = 1, todoSwapHeight: number) => {
    const wrapper = wrapperRef.value;
    const todoEl = getTodoElementById(id);

    if (!wrapper || !todoEl || wrapper.scrollHeight <= wrapper.clientHeight) return;

    const todoOffsetTop = todoEl.getBoundingClientRect().top || 0;
    const wrapperHeight = wrapper.clientHeight;
    const todoHeight = todoEl.clientHeight;
    const finalOffsetTop =
      todoOffsetTop +
      wrapper.scrollTop -
      (wrapperHeight / 2 + (todoHeight + 30) / 2) +
      (todoSwapHeight + todoHeight) * direction;

    gsap.to(wrapper, {
      scrollTo: { y: finalOffsetTop, autoKill: false },
      overwrite: false,
      duration: 0.65,
      ease: 'linear'
    });
  };

  const onDragStart = (id: string, startY: number) => {
    if (lastDeletedTodoId.value !== null) return;
    dragState.draggingId = id;
    dragState.startY = startY;
    dragState.lastY = startY;
    document.querySelector('body')?.classList.add('grabbing-cursor');
  };

  const onDragMove = async (id: string, currentY: number) => {
    if (dragState.draggingId !== id) return;

    const deltaY = currentY - dragState.lastY;
    const threshold = 60;

    if (Math.abs(deltaY) < threshold || !dragState.canDrag) return;

    const currentIndex = todos.value.findIndex(t => t.id === id);
    if (currentIndex === -1) return;

    const direction = deltaY > 0 ? 1 : -1;
    const targetIndex = currentIndex + direction;

    if (
      targetIndex < 0 ||
      targetIndex >= todos.value.length ||
      lastDeletedTodoId.value !== null ||
      (direction !== dragState.lastDirection && dragState.lastDirection !== null)
    )
      return;

    const state = Flip.getState(getTodoElements());

    const newTodos = [...todos.value];
    const temp = newTodos[targetIndex];
    if (!temp || !newTodos[currentIndex]) return;
    newTodos[targetIndex] = newTodos[currentIndex];
    newTodos[currentIndex] = temp;

    const todoTempElementId = temp.id;
    const todoTempElement = getTodoElementById(todoTempElementId);

    if (!todoTempElement) return;

    newTodos.forEach((todo, index) => {
      todo.order = index;
    });

    todos.value = newTodos;
    dragState.lastY = currentY;
    dragState.canDrag = false;

    await nextTick();

    gsap.delayedCall(0, () => {
      Flip.from(state, {
        duration: 0.7,
        absolute: false,
        absoluteOnLeave: true,
        scale: true,
        simple: true,
        prune: true,
        overwrite: false,
        ease: 'power2.out',
        onStart: () => {
          dragState.lastDirection = direction;
          scrollToTodo(id, direction, todoTempElement.clientHeight);
        },
        onUpdate: function () {
          if (this.progress() >= 0.75 && !dragState.canDrag) {
            dragState.lastY = currentY;
            dragState.canDrag = true;
          }
        },
        onComplete: () => {
          dragState.lastDirection = null;
        }
      });
    });
  };

  const onDragEnd = async (id: string) => {
    if (dragState.draggingId !== id) return;
    dragState.draggingId = null;
    dragState.startY = 0;
    dragState.lastY = 0;
    document.querySelector('body')?.classList.remove('grabbing-cursor');
    await ChromeStorageHelper.getInstance().updateTodosOrder(todos.value);
  };

  const updateTodos = async () => {
    todos.value = await ChromeStorageHelper.getInstance().getTodos();
  };

  const animateTodoApparition = (todoElement: HTMLElement) => {
    if (!todoElement) return;

    const wrapper = wrapperRef.value;
    const hasEnoughSpaceToScroll = wrapper ? wrapper.scrollHeight > wrapper.clientHeight - 75 : false;

    if (creationTl) {
      creationTl.kill();
      creationTl = null;
      gsap.set(wrapper, { scrollTo: { y: 0 } });
      wrapper?.scrollTo(0, 0);
    }

    if (wrapper) gsap.killTweensOf(wrapper);
    gsap.killTweensOf(todoElement);

    if (hasEnoughSpaceToScroll && wrapper) {
      gsap.set(wrapper, { scrollTo: { y: 'max' } });
    }

    creationTl = gsap.timeline({
      force3D: true,
      overwrite: true,
      onComplete: () => {
        creationTl?.kill();
        creationTl = null;
      }
    });

    creationTl.set(todoElement, {
      opacity: 0,
      scale: 0
    });

    creationTl.to(todoElement, {
      opacity: 1,
      scale: 1,
      delay: 1.3,
      duration: 1.05,
      ease: 'power3.out',
      onStart: () => {
        events.trigger(ICustomEvents.animationEventForTaskCreated);
      }
    });

    const duration = Math.min(Math.max(todos.value.length * 0.125, 1), 2.15);

    if (hasEnoughSpaceToScroll && wrapper) {
      creationTl.to(wrapper, {
        scrollTo: { y: 0, autoKill: false },
        delay: 0.1,
        duration: duration,
        ease: 'power3.inOut',
        overwrite: true
      });
    }
  };

  const handleTodoDeletion = (todoId: string) => {
    lastDeletedTodoId.value = todoId;
  };
</script>

<style scoped lang="scss">
  .todos-wrapper {
    position: relative;
    height: auto;
    width: 100%;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 15px;
    overflow-y: scroll;
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  :deep(.single-todo) {
    &.is-dragging {
      transition: opacity $transition-time $default-ease;
    }
  }

  :deep(.is-dragging) {
    z-index: 10;
    opacity: 0.35 !important;
  }
</style>
