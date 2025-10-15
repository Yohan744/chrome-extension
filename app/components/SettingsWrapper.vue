<template>
  <section id="settings-wrapper">
    <h1>settings wrapper</h1>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
  #settings-wrapper {
    position: absolute;
    inset: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    background: linear-gradient($color-indigo 0, $color-rebecca-purple 0, $color-black 40%);
    pointer-events: none;
    opacity: 0;
  }
</style>
