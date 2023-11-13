<template>
  <div class="container">
    <GallerySwitcherVue />
  </div>
</template>

<script lang="ts">
import GallerySwitcherVue from '@/components/GallerySwitcher.vue'

export default {
  components: {
    GallerySwitcherVue
  }
}
</script>

<style>
.container {
  display: grid;
  place-content: center;
  place-items: center;
  min-height: 100svh;
  padding-block: 5vh;
}

img {
  width: 100%;
  max-width: 100%;
  height: auto;
}
</style>
