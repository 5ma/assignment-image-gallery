<template>
  <div class="slide" :class="{ 'is-current': isCurrent }" :data-slide-id="id">
    <img :src="getImagePath(image.src)" :alt="image.alt" />
  </div>
</template>

<script lang="ts">
import { type PropType, defineComponent } from 'vue'
import { useImagePath } from '@/composables/use-image-path'

type Image = {
  src: string
  alt: string
}

export default defineComponent({
  setup() {
    const { getImagePath } = useImagePath()
    return { getImagePath }
  },
  props: {
    image: {
      type: Object as PropType<Image>,
      required: true
    },
    id: {
      type: Number,
      required: true
    },
    isCurrent: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style lang="scss" scoped>
.slide {
  flex-shrink: 0;
  width: 100%;
}
</style>
