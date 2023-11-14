<template>
  <div class="grid">
    <div v-for="image in images" :key="image.id" class="grid__item">
      <img :src="getImagePath(image.src)" :alt="image.alt" loading="lazy" class="grid__img" :class="{'is-hide': isHide}" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { GalleryImageItem } from '@/data/gallery-images'
import { useImagePath } from '@/composables/use-image-path'

export default defineComponent({
  setup() {
    const { getImagePath } = useImagePath()
    return { getImagePath }
  },
  props: {
    images: {
      type: Array as PropType<GalleryImageItem[]>,
      required: true
    },
    isHide: {
      type: Boolean,
      default: false
    },
    id: Number
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/global/media-query' as mq;

.grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  @include mq.pc {
    gap: 15px;
  }
}

.grid__img {
  clip-path: polygon(0 0, 200% 0, 0 200%);
  transition: clip-path cubic-bezier(0.29, 0.09, 0.21, 0.98) .6s;
  &.is-hide {
    clip-path: polygon(0 0, 0 0, 0 0);
  }
}
</style>
