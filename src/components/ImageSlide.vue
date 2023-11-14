<template>
  <div class="slide" :class="{ 'is-current': isCurrent }" :data-slide-id="id">
    <img
      class="slide__img"
      :src="getImagePath(image.src)"
      :alt="image.alt"
      :class="{ 'is-hide': isHide }"
    />
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
    },
    isHide: {
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

.slide__img {
  clip-path: polygon(-100% 100%, 100% -100%, 100% 100%);
  transition: clip-path cubic-bezier(0.29, 0.09, 0.21, 0.98) 0.6s;

  &.is-hide {
    clip-path: polygon(100% 100%, 100% 100%, 100% 100%);
  }
}
</style>
