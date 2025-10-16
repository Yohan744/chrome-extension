<template>
  <label class="todo-checkbox">
    <input type="checkbox" />
    <svg width="25" height="25">
      <polyline points="16 3 7 15 2 10" />
    </svg>
  </label>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
  .todo-checkbox {
    cursor: pointer;
    transform: scale(0.8);

    &:hover svg {
      background: $color-magenta;
      border: 3px solid $color-magenta;
    }

    input {
      width: 0;
      height: 0;
      opacity: 0;
      display: none;

      &:checked + svg {
        background: $color-magenta;
        border: 3px solid $color-magenta;
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
      border-radius: 4px;
      fill: none;
      background: transparent;
      transition:
        border calc($transition-time * 0.85) $easePower2Out,
        background calc($transition-time * 0.85) $easePower2Out,
        stroke-dashoffset calc($transition-time * 0.85) $easePower2Out;

      polyline {
        transform: scale(0.775) translate(2px, 1px);
      }
    }
  }
</style>
