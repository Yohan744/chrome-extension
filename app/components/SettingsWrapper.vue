<template>
  <section id="settings-wrapper">
    <h1 class="title">Settings</h1>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
  #settings-wrapper {
    position: absolute;
    gap: 30px;
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

    .title {
      position: relative;
      font-size: 23px;
      font-variation-settings: 'wght' 800;
      color: $color-white;
    }
  }
</style>
