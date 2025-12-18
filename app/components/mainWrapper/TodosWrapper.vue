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

  const dragState = reactive({
    draggingId: null as string | null,
    startY: 0,
    lastY: 0
  });

  const sortedTodos = computed(() => {
    return [...todos.value].sort((a, b) => a.order - b.order);
  });

  const getTodoElements = () => wrapperRef.value?.querySelectorAll('[data-id]') ?? [];

  const getTodoElementById = (id: string): HTMLElement | null => {
    return wrapperRef.value?.querySelector(`[data-id="${id}"]`) ?? null;
  };

  const scrollToTodo = (id: string, direction: -1 | 1 = 1) => {
    const wrapper = wrapperRef.value;
    const todoEl = getTodoElementById(id);

    if (!wrapper || !todoEl || wrapper.scrollHeight <= wrapper.clientHeight) return;

    const todoOffsetTop = todoEl.getBoundingClientRect().top || 0;
    const wrapperHeight = wrapper.clientHeight;
    const todoHeight = todoEl.clientHeight;
    const finalOffsetTop =
      todoOffsetTop + wrapper.scrollTop - (wrapperHeight / 2 + (todoHeight + 30) / 2) + (todoHeight + 30) * direction;

    gsap.to(wrapper, {
      scrollTo: { y: finalOffsetTop, autoKill: false },
      overwrite: false,
      duration: 0.65,
      ease: 'linear'
    });
  };

  const onDragStart = (id: string, startY: number) => {
    dragState.draggingId = id;
    dragState.startY = startY;
    dragState.lastY = startY;
    document.querySelector('body')?.classList.add('grabbing-cursor');
  };

  const onDragMove = (id: string, currentY: number) => {
    if (dragState.draggingId !== id) return;

    const deltaY = currentY - dragState.lastY;
    const threshold = 55;

    if (Math.abs(deltaY) < threshold) return;

    const currentIndex = todos.value.findIndex(t => t.id === id);
    if (currentIndex === -1) return;

    const direction = deltaY > 0 ? 1 : -1;
    const targetIndex = currentIndex + direction;

    if (targetIndex < 0 || targetIndex >= todos.value.length) return;

    const state = Flip.getState(getTodoElements());

    const newTodos = [...todos.value];
    const temp = newTodos[targetIndex];
    if (!temp || !newTodos[currentIndex]) return;
    newTodos[targetIndex] = newTodos[currentIndex];
    newTodos[currentIndex] = temp;

    newTodos.forEach((todo, index) => {
      todo.order = index;
    });

    todos.value = newTodos;
    dragState.lastY = currentY;

    nextTick(() => {
      Flip.from(state, {
        absolute: true,
        duration: 0.65,
        ease: 'power2.out',
        onStart: () => {
          scrollToTodo(id, direction);
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

  onMounted(async () => {
    events.on(ICustomEvents.taskCreated, async () => {
      await updateTodos();
    });

    events.on(ICustomEvents.taskDeleted, async () => {
      await updateTodos();
    });

    events.on(ICustomEvents.storageInitiated, async () => {
      await updateTodos();
    });

    events.on(ICustomEvents.migrationDone, async () => {
      await updateTodos();
    });
  });

  const updateTodos = async () => {
    todos.value = await ChromeStorageHelper.getInstance().getTodos();
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
    will-change: transform;
    opacity: 1;
    transition: opacity calc($transition-time * 2) $default-ease;

    &.is-dragging {
      transition: opacity $transition-time $default-ease;
    }
  }

  :deep(.is-dragging) {
    z-index: 10;
    opacity: 0.35 !important;
  }
</style>
