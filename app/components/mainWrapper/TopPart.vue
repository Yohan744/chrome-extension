<template>
  <div class="top-part">
    <div class="left-part">
      <h1 class="title">{{ dayOfTheWeek[actualDay] + ' ' + actualDate }}</h1>
      <div class="task-count">
        <p class="number">{{ taskNumber }}</p>
        <p class="text">task</p>
        <p class="plural" :class="{ show: taskNumber > 1 }">s</p>
      </div>
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
        font-size: 24px;
        font-variation-settings: 'wght' 800;
        color: $color-white;
      }

      .task-count {
        position: relative;
        margin-left: 1px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        font-size: 13px;
        font-variation-settings: 'wght' 500;
        color: rgba($color-white, 0.55);

        .number {
          position: relative;
          min-width: 8px;
        }

        .text {
          position: relative;
          margin-left: 4px;
          width: 28px;
        }

        .plural {
          position: relative;
          margin-left: 0;
          width: 7px;
          opacity: 0;
          transform: translate3d(0, 4px, 0);
          transition:
            opacity $transition-time $default-ease,
            transform $transition-time $default-ease;

          &.show {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
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
        height: 35px;
        width: 45px;
        border-radius: 7px;
        @include center;
        cursor: pointer;
        background: rgba($color-gray, 0.9);
        transition: background $transition-time $default-ease;

        @include has-hover {
          background: rgba($color-gray, 0.6);
        }

        svg {
          position: relative;
          height: auto;
          width: 20px;
          color: $color-white;
        }
      }

      .add {
        position: relative;
        height: 35px;
        width: 45px;
        border-radius: 7px;
        background: linear-gradient(120deg, $color-blue-violet 0%, $color-magenta 50%);
        @include center;
        cursor: pointer;
        opacity: 1;
        transition: opacity $transition-time $default-ease;

        @include has-hover {
          opacity: 0.7;
        }

        svg {
          position: relative;
          height: auto;
          width: 20px;
          color: $color-white;
        }
      }
    }
  }
</style>
