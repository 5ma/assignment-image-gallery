<template>
  <div>
    <ImageGrid :images="images" />
    <ImageSlider :images="images" />
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

<style lang="scss" scoped></style>
