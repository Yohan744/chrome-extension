<template>
  <label class="todo-checkbox" :style="{ '--todo-color': props.color }">
    <input ref="inputRef" type="checkbox" :disabled="isChecked" @click="e => handleClick(e)" />
    <svg width="25" height="25" :style="{ stroke: props.textColor }">
      <polyline points="16 3 7 15 2 10" />
    </svg>
  </label>
</template>

<script setup lang="ts">
  const emit = defineEmits(['checked']);

  const props = defineProps<{
    color: string;
    textColor: string;
    isDisabled?: boolean;
  }>();

  const inputRef = ref<HTMLInputElement | null>(null);
  const isChecked = ref<boolean>(false);

  const handleClick = (e: MouseEvent) => {
    if (!inputRef.value || !inputRef.value.checked || !e.target || props.isDisabled) return;
    emit('checked', e.target);
    isChecked.value = true;
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
      position: relative;
      min-width: 23px;
      min-height: 23px;
      aspect-ratio: 1;
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
        stroke-dashoffset calc($transition-time * 1.25) $easePower4Out;

      polyline {
        transform: scale(0.775) translate(2px, 1px);
      }
    }
  }
</style>
