<template>
  <div class="top-part">
    <div class="left-part">
      <h1 class="title">{{ dayOfTheWeek[actualDay] + ' ' + actualDate }}</h1>
      <p class="description">0 tasks</p>
    </div>

    <div class="add-todo-button" @click="switchBetweenSections('add')"></div>
  </div>
</template>

<script setup lang="ts">
  import switchBetweenSections from '~/composables/switchBetweenSections';

  const actualDay: number = new Date().getDay();
  const actualDate: number = new Date().getDate();
  const dayOfTheWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
</script>

<style scoped lang="scss">
  .top-part {
    position: relative;
    padding-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    width: 100%;

    .left-part {
      position: relative;
      gap: 6px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-content: flex-start;

      .title {
        position: relative;
        font-size: 30px;
        font-variation-settings: 'wght' 700;
        color: $color-white;
      }

      .description {
        position: relative;
        margin-left: 5px;
        font-size: 15px;
        font-variation-settings: 'wght' 500;
        color: rgba($color-white, 0.6);
      }
    }

    .add-todo-button {
      position: relative;
      height: 40px;
      width: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      opacity: 1;
      border-radius: 7px;
      transition: opacity $transition-time $default-ease;
      background: linear-gradient(50deg, $color-blue-violet 0%, $color-magenta 70%);

      @include has-hover {
        &:hover {
          opacity: 0.75;
        }
      }
    }
  }
</style>
