<template>
  <label class="todo-checkbox" :style="{ '--todo-color': props.color }">
    <input ref="inputRef" type="checkbox" @click="e => handleClick(e)" />
    <svg width="25" height="25">
      <polyline points="16 3 7 15 2 10" />
    </svg>
  </label>
</template>

<script setup lang="ts">
  const emit = defineEmits(['checked']);

  const props = defineProps<{
    color: string;
  }>();

  const inputRef = ref<HTMLInputElement | null>(null);

  const handleClick = (e: MouseEvent) => {
    if (!inputRef.value || !inputRef.value.checked || !e.target) return;
    emit('checked', e.target);
  };

  const uncheck = () => {
    if (!inputRef.value) return;
    inputRef.value.checked = false;
  };

  defineExpose({ uncheck });
</script>

<style scoped lang="scss">
  .todo-checkbox {
    cursor: pointer;
    transform: scale(0.8);

    @include has-hover {
      svg {
        background: var(--todo-color);
        border: 3px solid var(--todo-color);
      }
    }

    input {
      width: 0;
      height: 0;
      opacity: 0;
      display: none;

      &:checked + svg {
        background: var(--todo-color);
        border: 3px solid var(--todo-color);
        stroke-dashoffset: -45;
      }
    }

    svg {
      border: 3px solid $color-light-gray;
      stroke: white;
      stroke-dasharray: 23;
      stroke-dashoffset: -69;
      stroke-linecap: round;
      stroke-width: 3px;
      border-radius: 6px;
      fill: none;
      background: transparent;
      transition:
        border $transition-time $easePower4Out,
        background $transition-time $easePower4Out,
        stroke-dashoffset $transition-time $easePower4Out;

      polyline {
        transform: scale(0.775) translate(2px, 1px);
      }
    }
  }
</style>
