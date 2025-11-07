<template>
  <div class="top-part">
    <div class="left-part">
      <h1 class="title">{{ dayOfTheWeek[actualDay] + ' ' + actualDate }}</h1>
      <p class="task-count">{{ taskNumber }} {{ taskNumber <= 1 ? 'task' : 'tasks' }}</p>
    </div>

    <div class="right-part">
      <button class="settings" @click="switchBetweenSections('settings')">
        <SettingsIcon />
      </button>

      <button class="add" @click="switchBetweenSections('add')">
        <PlusIcon />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import ChromeStorageHelper from '~/composables/ChromeStorageHelper';
  import { ICustomEvents } from '~/constants/ICustomEvents';
  import switchBetweenSections from '~/composables/SwitchBetweenSections';
  import PlusIcon from '~/assets/icons/plus.svg?component';
  import SettingsIcon from '~/assets/icons/settings.svg?component';

  const taskNumber = ref<number>(0);
  const events = useGlobalEvents();

  const actualDay: number = new Date().getDay();
  const actualDate: number = new Date().getDate();
  const dayOfTheWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  onMounted(async () => {
    await updateTaskNumber();

    events.on(ICustomEvents.taskCreated, async () => {
      await updateTaskNumber();
    });

    events.on(ICustomEvents.taskDeleted, async () => {
      await updateTaskNumber();
    });
  });

  const updateTaskNumber = async () => {
    taskNumber.value = (await ChromeStorageHelper.getInstance().getTodos()).length;
  };
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

      .task-count {
        position: relative;
        margin-left: 3px;
        font-size: 13px;
        font-variation-settings: 'wght' 500;
        color: rgba($color-white, 0.55);
      }
    }

    .right-part {
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 10px;

      .settings {
        position: relative;
        height: 50px;
        width: 50px;
        background: red;
      }

      .add {
        position: relative;
        height: 50px;
        width: 50px;
        background: blue;
      }
    }
  }
</style>
