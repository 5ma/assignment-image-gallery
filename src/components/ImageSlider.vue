<template>
  <div>ImageSlider.vue</div>
</template>

<script lang="ts">
import { type PropType, defineComponent } from 'vue'
import type { GalleryImageItem } from '@/data/gallery-images'

export default defineComponent({
  props: {
    images: {
      type: Array as PropType<GalleryImageItem[]>,
      required: true
    },
    id: Number
  }
})
</script>

<style lang="scss" scoped></style>
