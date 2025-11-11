<template>
  <section id="settings-wrapper">
    <GoBack :title="title" />
    <AddCustomCategory />
    <h4 class="delete-category-title">Delete category</h4>
    <Categories :can-delete-categories="true" />
    <div class="link-wrapper">
      <a
        class="link"
        href="mailto:hello@yohan-quinquis.me?subject=%20To%20do%20list%20extension%20feedback"
        target="_blank"
      >
        Feedback
      </a>
      <div class="separator" />
      <a class="link" href="https://buymeacoffee.com/yohan_qns" target="_blank">Support me</a>
    </div>
  </section>
</template>

<script setup lang="ts">
  import AddCustomCategory from './settingsWrapper/AddCustomCategory.vue';
  import Categories from '~/components/addWrapper/Categories.vue';
  import GoBack from '~/components/GoBack.vue';

  const title = 'Settings';
</script>

<style scoped lang="scss">
  #settings-wrapper {
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

    .delete-category-title {
      position: relative;
      margin-top: 15px;
      font-size: 17px;
      font-variation-settings: 'wght' 600;
    }

    .link-wrapper {
      position: relative;
      margin: auto auto 0;
      @include center;
      gap: 8px;

      .link {
        position: relative;
        font-size: 8px;
        color: rgba($color-white, 0.75);
        transition: color calc($transition-time * 0.8) $default-ease;

        &:before {
          position: absolute;
          content: '';
          bottom: -3px;
          left: 0;
          transform-origin: right;
          transform: scaleX(0);
          opacity: 0;
          height: 1px;
          width: 100%;
          background: rgba($color-white, 0.75);
          transition:
            transform calc($transition-time * 0.8) $default-ease,
            opacity calc($transition-time * 0.8) $default-ease,
            background calc($transition-time * 0.8) $default-ease;
        }

        @include has-hover {
          color: rgba($color-white, 1);

          &:before {
            opacity: 1;
            transform-origin: left;
            transform: scaleX(1);
            background: rgba($color-white, 1);
          }
        }
      }

      .separator {
        position: relative;
        height: 100%;
        width: 1px;
        background: rgba($color-gray, 0.2);
      }
    }
  }
</style>
