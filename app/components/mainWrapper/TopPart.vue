<template>
  <div class="top-part">
    <div class="left-part">
      <h1 ref="titleRef" class="title">{{ dayOfTheWeek[actualDay] + ' ' + actualDate }}</h1>
      <div class="task-count">
        <div class="number" :style="{ width: numberWidthCh }" :class="{ 'no-width-transition': !initialized }">
          <Transition :name="transitionName">
            <span :key="taskNumber" class="digit">{{ taskNumber }}</span>
          </Transition>
        </div>
        <p class="text">task</p>
        <p class="plural" :class="{ show: taskNumber > 1 }">s</p>
      </div>
    </div>

    <div class="right-part">
      <button ref="settingsButtonRef" class="settings" @click="switchBetweenSections('settings')">
        <SettingsIcon />
      </button>

      <button ref="addButtonRef" class="add" @click="switchBetweenSections('add')">
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
  import gsap from 'gsap';
  import { SplitText } from 'gsap/SplitText';

  const taskNumber = ref<number>(0);
  const transitionName = ref<string>('none');
  const initialized = ref<boolean>(false);
  const numberWidthCh = computed(() => `${Math.max(1, String(taskNumber.value).length)}ch`);
  const events = useGlobalEvents();
  const settingsButtonRef = ref<HTMLElement | null>(null);
  const addButtonRef = ref<HTMLElement | null>(null);
  const titleRef = ref<HTMLElement | null>(null);

  const actualDay: number = new Date().getDay();
  const actualDate: number = new Date().getDate();
  const dayOfTheWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  onMounted(async () => {
    await updateTaskNumber();
    await nextTick();
    animateOnInit();

    events.on(ICustomEvents.animationEventForTaskCreated, async () => {
      await updateTaskNumber();
    });

    events.on(ICustomEvents.animationEventForTaskDeleted, async () => {
      await updateTaskNumber();
    });
  });

  const updateTaskNumber = async () => {
    const newCount = (await ChromeStorageHelper.getInstance().getTodos()).length;

    if (!initialized.value) {
      transitionName.value = 'none';
    } else if (newCount > taskNumber.value) {
      transitionName.value = 'count-up';
    } else if (newCount < taskNumber.value) {
      transitionName.value = 'count-down';
    } else {
      transitionName.value = 'none';
    }

    taskNumber.value = newCount;
    initialized.value = true;
  };

  const animateOnInit = async () => {
    if (!settingsButtonRef.value || !addButtonRef.value) return;

    if (typeof window !== 'undefined') {
      gsap.registerPlugin(SplitText);
    }

    try {
      if (document?.fonts?.ready) {
        await document.fonts.ready;
      } else {
        await new Promise(res => setTimeout(res, 1));
      }
    } catch (e) {
      console.log(e);
    }

    const text = new SplitText(titleRef.value, { type: 'chars' });

    gsap.fromTo(
      text.chars,
      {
        opacity: 0,
        scale: 0,
        y: '23px'
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        stagger: 0.04,
        delay: 0.1,
        duration: 0.8,
        force3D: true,
        ease: 'back.out(1.65)',
        onComplete: () => {
          text.revert();
        }
      }
    );

    gsap.set(titleRef.value, {
      opacity: 1
    });

    ///////////////////////////////////////////////////////////////////////////////////

    const computedStyle = window.getComputedStyle(addButtonRef.value);
    const transition = computedStyle.getPropertyValue('transition');

    gsap.set(addButtonRef.value, {
      transition: 'none'
    });

    gsap.fromTo(
      [settingsButtonRef.value, addButtonRef.value],
      {
        opacity: 0,
        scale: 0
      },
      {
        opacity: 1,
        scale: 1,
        delay: 0.35,
        stagger: 0.1625,
        duration: 1.2,
        force3D: true,
        ease: 'back.inOut(2.5)',
        onComplete: () => {
          gsap.set(addButtonRef.value, {
            transition: transition
          });
        }
      }
    );
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
        opacity: 0;
        transform-origin: center bottom;
      }

      .task-count {
        position: relative;
        margin-left: 0;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        font-size: 13px;
        font-variation-settings: 'wght' 500;
        color: rgba($color-white, 0.55);
        font-variant-numeric: tabular-nums;
        font-feature-settings: 'tnum' 1;
        opacity: 0;

        .number {
          position: relative;
          overflow: hidden;
          display: inline-block;
          text-align: left;
          white-space: nowrap;
          transition: width $transition-time $default-ease;
          will-change: width;

          &.no-width-transition {
            transition: none;
          }

          .digit {
            display: block;
          }
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
        @include light-border;
        cursor: pointer;
        opacity: 0;
        background: rgba($color-gray, 0.9);
        transition:
          background $transition-time $default-ease,
          border $transition-time $default-ease;

        @include has-hover {
          background: rgba($color-gray, 0.6);
          border: 1px solid rgba($color-border, 0.2);
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
        opacity: 0;
        transition: opacity $transition-time $default-ease;

        @include has-hover {
          opacity: 0.75 !important;
        }

        svg {
          position: relative;
          height: auto;
          width: 20px;
          color: $color-white;
        }
      }
    }

    .count-up-enter-active,
    .count-up-leave-active,
    .count-down-enter-active,
    .count-down-leave-active {
      transition:
        transform calc($transition-time * 1.25) $default-ease,
        opacity calc($transition-time * 1.25) $default-ease;
      will-change: transform, opacity;
    }

    .count-up-enter-from {
      transform: translate3d(0, 115%, 0);
      opacity: 0;
    }
    .count-up-enter-to {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
    .count-up-leave-from {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
    .count-up-leave-to {
      transform: translate3d(0, -115%, 0);
      opacity: 0;
    }

    .count-down-enter-from {
      transform: translate3d(0, -115%, 0);
      opacity: 0;
    }
    .count-down-enter-to {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
    .count-down-leave-from {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
    .count-down-leave-to {
      transform: translate3d(0, 115%, 0);
      opacity: 0;
    }

    .count-up-leave-active,
    .count-down-leave-active {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }

    .none-enter-active,
    .none-leave-active {
      transition: none;
    }
  }
</style>
