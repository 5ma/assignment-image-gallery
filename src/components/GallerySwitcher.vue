<template>
  <div class="gallery-switcher">
    <ImageGrid :images="images" />
    <div class="parent-slider">
      <ImageSlider :images="images" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ImageSlider from '@/components/ImageSlider.vue'
import ImageGrid from '@/components/ImageGrid.vue'
import { galleryImages } from '@/data/gallery-images'

export default defineComponent({
  components: {
    ImageSlider,
    ImageGrid
  },
  data() {
    return {
      images: galleryImages
    }
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/global/media-query' as mq;

.gallery-switcher {
  overflow: hidden;
}

.parent-slider {
  width: 88%;
  margin-inline: auto;

  @include mq.pc {
    width: 85%;
  }
}
</style>
