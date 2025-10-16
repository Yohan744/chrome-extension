<template>
  <div class="single-todo">
    <TodoCheckbox />
    <div class="right-part">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non, quisquam!</div>
  </div>
</template>

<script setup lang="ts">
  import TodoCheckbox from '~/components/mainWrapper/TodoCheckbox.vue';
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
      padding: 20px;
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 10px;
      border-radius: 10px;
      font-size: 14px;
      background: rgba($color-gray, 0.4);
    }
  }
</style>
