<template>
  <div class="icon" :style="iconStyle"></div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    iconName: string | undefined;
    color?: string;
  }>();

  const runtimeConfig = useRuntimeConfig();
  const baseURL = runtimeConfig.app?.baseURL || '/';
  const iconSrc = computed(() => {
    const name = props.iconName || 'ellipsis';
    return `${baseURL}app-icons/${name}.svg`;
  });

  const iconStyle = computed(() => ({
    maskImage: `url(${iconSrc.value})`,
    backgroundColor: props.color || '#ffffff'
  }));
</script>

<style scoped lang="scss">
  .icon {
    position: relative;
    height: 20px;
    aspect-ratio: 1;
    mask-size: 100%;
    background-repeat: no-repeat;
    will-change: background-color, mask-image;
    transition:
      background $transition-time $default-ease,
      mask-image $transition-time $default-ease;
  }
</style>
