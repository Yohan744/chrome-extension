<template>
  <div class="debug">
    <div @click="handleAdd">add</div>
    <div @click="handleAddOld">add old</div>
    <div @click="handleMigrate">migrate</div>
    <div @click="handleGet">get</div>
    <div @click="handleClear">clear</div>
  </div>
</template>

<script setup lang="ts">
  import ChromeStorageHelper from '~/composables/ChromeStorageHelper';

  const handleAdd = async () => {
    const storage = ChromeStorageHelper.getInstance();
    await storage.addTodo({
      id: crypto.randomUUID(),
      task: 'test',
      categoryId: '0010f75f-a962-4084-9680-06e9d18a7707',
      order: 1
    });
    console.log('Added a test todo');
  };

  const handleAddOld = async () => {
    const storage = ChromeStorageHelper.getInstance();
    await storage.addOldTodo({
      category: 'workout',
      color: '#e79131',
      task: 'test'
    });

    await storage.addOldTodo({
      category: 'other',
      color: '#2abfd0',
      task: 'vdhzvdzhd'
    });

    await storage.addOldTodo({
      category: 'work',
      color: '#6254f4',
      task: 'dzndzdazjbdzdzdzzdz'
    });

    console.log('Added an old type todo');
  };

  const handleMigrate = async () => {
    const storage = ChromeStorageHelper.getInstance();
    await storage.migrateOldTodos();
  };

  const handleGet = async () => {
    const storage = ChromeStorageHelper.getInstance();
    const data = await storage.getAllStorage();
    console.log('Current data:', data);
  };

  const handleClear = async () => {
    const storage = ChromeStorageHelper.getInstance();
    await storage.clearAllStorage();
    console.log('Cleared all storage');
  };
</script>

<style scoped lang="scss">
  .debug {
    position: absolute;
    top: 0;
    left: 0;
    height: 50px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    background: $color-indigo;
    z-index: 1;
    opacity: 0.075;

    div {
      position: relative;
      height: 30px;
      width: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 10px;
      border-radius: 6px;
      cursor: pointer;
      background: $color-magenta;
    }
  }
</style>
