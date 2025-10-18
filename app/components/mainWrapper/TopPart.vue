<template>
  <div class="top-part">
    <div class="left-part">
      <h1 class="title">{{ dayOfTheWeek[actualDay] + ' ' + actualDate }}</h1>
      <p class="month">{{ monthOfTheYear[actualMonth] }}</p>
    </div>

    <h4 class="task-count">0 tasks</h4>
  </div>
</template>

<script setup lang="ts">
  const actualDay: number = new Date().getDay();
  const actualDate: number = new Date().getDate();
  const actualMonth: number = new Date().getMonth();
  const dayOfTheWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthOfTheYear: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
</script>

<style scoped lang="scss">
  .top-part {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
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
        font-size: 23px;
        font-variation-settings: 'wght' 800;
        color: $color-white;
      }

      .month {
        position: relative;
        margin-left: 3px;
        font-size: 13px;
        font-variation-settings: 'wght' 500;
        color: rgba($color-white, 0.55);
      }
    }

    .task-count {
      position: relative;
      margin-top: 3px;
      font-size: 16px;
      font-variation-settings: 'wght' 500;
      color: rgba($color-white, 0.85);
    }
  }
</style>
