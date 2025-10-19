<template>
  <section id="add-wrapper">
    <h1 class="title">
      Create new
      <br />
      task
    </h1>

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

    <AddWrapperCategories @category-is-selected="handleCategorySelected" />

    <button class="create-task-button" @click="handleTaskCreation">Create task</button>
  </section>
</template>

<script setup lang="ts">
  import AddWrapperCategories from '~/components/addWrapper/Categories.vue';
  import DOMPurify from 'dompurify';
  import ChromeStorageHelper from '~/composables/ChromeStorageHelper';
  import type { ICategoryType } from '~/types/ICategoryType';

  const storage = ChromeStorageHelper.getInstance();

  const taskInputRef = ref<HTMLInputElement | null>(null);
  const task = ref<string | null>(null);
  const actualCategory = ref<string | null>(null);

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const inputValue = target.value;

    task.value = DOMPurify.sanitize(inputValue)
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ');
  };

  const handleCategorySelected = (categoryName: string) => {
    actualCategory.value = categoryName;
  };

  const handleTaskCreation = async () => {
    if (!actualCategory.value || !task.value || task.value === '') return;

    const category: ICategoryType | null = await storage.getCategoryByName(actualCategory.value);
    const order = await storage.getBiggestOrderNumberInTodos();

    if (!category || !order) return;

    await storage.addTodo({
      id: crypto.randomUUID(),
      task: task.value,
      categoryId: category.id,
      order: order
    });

    console.log(category.id, order);
  };
</script>

<style scoped lang="scss">
  #add-wrapper {
    position: absolute;
    padding: 30px 20px calc($footer-height + 20px);
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
      font-size: 28px;
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
      border: none;
      background: rgba($color-gray, 0.44);
      font-size: 14px;
      font-variation-settings: 'wght' 475;

      &:focus {
        border: none;
        outline: none;
      }

      &::placeholder {
        color: rgba($color-white, 0.35);
      }
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
      font-variation-settings: 'wght' 500;
      color: $color-white;
      opacity: 1;
      transition: opacity $transition-time $default-ease;

      &:hover {
        opacity: 0.75;
      }
    }
  }
</style>
