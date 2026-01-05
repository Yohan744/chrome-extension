<template>
  <section id="add-wrapper">
    <GoBack :title="title" :is-add-wrapper="true" @go-back-clicked="cleanAddWrapper" />

    <label>
      <input
        ref="taskInputRef"
        class="task-input"
        type="text"
        autocomplete="off"
        placeholder="Task Title"
        @input="handleInput"
      />
    </label>

    <h4 class="category-title">Categories</h4>

    <Categories
      ref="addWrapperRef"
      :is-in-add-wrapper="true"
      @category-is-selected="handleCategorySelected"
      @add-category-clicked="switchSectionAndCleanUpAddWrapper('settings')"
    />

    <button class="create-task-button" :class="{ active: canCreateTask }" @click="handleTaskCreation">
      Create task
    </button>
  </section>
</template>

<script setup lang="ts">
  import Categories from '~/components/addWrapper/Categories.vue';
  import DOMPurify from 'dompurify';
  import ChromeStorageHelper from '~/composables/ChromeStorageHelper';
  import type { ICategoryType } from '~/types/ICategoryType';
  import switchBetweenSections from '~/composables/SwitchBetweenSections';
  import { useGlobalEvents } from '~/composables/GlobalEvents';
  import { ICustomEvents } from '~/constants/ICustomEvents';
  import GoBack from '~/components/GoBack.vue';

  const storage = ChromeStorageHelper.getInstance();
  const events = useGlobalEvents();

  const title = 'Create new <br/> task';

  const isTaskAlreadyCreated = ref<boolean>(false);
  const taskInputRef = ref<HTMLInputElement | null>(null);
  const addWrapperRef = ref<InstanceType<typeof Categories> | null>(null);
  const task = ref<string | null>(null);
  const actualCategory = ref<string | null>(null);
  const canCreateTask = computed(() => {
    return actualCategory.value !== null && task.value !== null && task.value !== '' && !isTaskAlreadyCreated.value;
  });

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const inputValue = target.value;

    task.value = DOMPurify.sanitize(inputValue)
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const handleCategorySelected = (categoryName: string | null) => {
    actualCategory.value = categoryName;
  };

  const handleTaskCreation = async () => {
    if (!actualCategory.value || !task.value || task.value === '' || isTaskAlreadyCreated.value) return;

    const category: ICategoryType | null = await storage.getCategoryByName(actualCategory.value);
    const order = (await storage.getBiggestOrderNumberInTodos()) + 1;

    if (!category) return;

    await storage.addTodo({
      id: crypto.randomUUID(),
      task: task.value,
      categoryId: category.id,
      order: order
    });

    events.trigger(ICustomEvents.taskCreated);
    isTaskAlreadyCreated.value = true;
    switchSectionAndCleanUpAddWrapper('main');
  };

  const switchSectionAndCleanUpAddWrapper = (sectionName: 'main' | 'settings') => {
    switchBetweenSections(sectionName, () => {
      cleanAddWrapper();
    });
  };

  const cleanAddWrapper = () => {
    isTaskAlreadyCreated.value = false;
    task.value = null;
    if (taskInputRef.value) taskInputRef.value.value = '';
    actualCategory.value = null;
    addWrapperRef.value?.cleanUpCategoriesSelection();
  };

  onMounted(async () => {
    events.on(ICustomEvents.switchSectionStart, async showSectionName => {
      if (showSectionName !== 'add') return;
      taskInputRef.value?.focus();
    });
  });
</script>

<style scoped lang="scss">
  #add-wrapper {
    position: absolute;
    padding: 30px 20px 20px;
    inset: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-content: flex-start;
    background: linear-gradient($color-indigo 0, $color-rebecca-purple 0, $color-black 40%);
    pointer-events: none;
    opacity: 0;
    color: $color-white;

    .title {
      position: relative;
      font-size: 27px;
      line-height: 1.25;
      font-variation-settings: 'wght' 800;
    }

    .task-input {
      position: relative;
      margin-top: 30px;
      padding: 15px;
      height: 50px;
      width: 100%;
      border-radius: 7px;
      border: 1px solid rgba($color-border, 0.065);
      background: rgba($color-gray, 0.35);
      font-size: 14px;
      font-variation-settings: 'wght' 475;
      transition: border $transition-time $default-ease;

      &:focus {
        outline: none;
      }

      @include has-hover {
        border: 1px solid rgba($color-border, 0.15);
      }

      &::placeholder {
        color: rgba($color-white, 0.35);
      }
    }

    .category-title {
      position: relative;
      margin-top: 30px;
      font-size: 17px;
      font-variation-settings: 'wght' 600;
    }

    .create-task-button {
      position: relative;
      margin-top: auto;
      width: 100%;
      padding: 14px;
      border: none;
      background: linear-gradient(30deg, $color-blue-violet 0%, $color-orchid 70%);
      border-radius: 7px;
      cursor: pointer;
      font-size: 16px;
      font-variation-settings: 'wght' 550;
      color: $color-white;
      opacity: 0.35;
      pointer-events: none;
      transition: opacity $transition-time $default-ease;

      &.active {
        opacity: 1;
        pointer-events: all;
      }

      @include has-hover {
        opacity: 0.75;
      }
    }
  }
</style>
