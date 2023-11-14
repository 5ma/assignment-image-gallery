<template>
  <div class="grid" ref="wrapper">
    <div v-for="image in images" :key="image.id" class="grid__item" :data-id="image.id" ref="item" tabindex="0">
      <img
        :src="getImagePath(image.src)"
        :alt="image.alt"
        loading="lazy"
        class="grid__img"
        :class="{ 'is-hide': isHide }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { GalleryImageItem } from '@/data/gallery-images'
import { useImagePath } from '@/composables/use-image-path'
import { useQueryParam } from "@/composables/use-query-param";

export default defineComponent({
  setup() {
    const { getImagePath } = useImagePath()
    const { getQueryParam } = useQueryParam()
    return { getImagePath, getQueryParam }
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
  },
  methods: {
    scrollToQueryParamIndex() {
      // クエリパラメータでindexの指定があれば移動させる
      const indexParam = this.getQueryParam('index');
      if (indexParam == undefined) return

      const toNumIndexParam = parseInt(indexParam);
      const isValidIndex = 0 < toNumIndexParam && toNumIndexParam <= this.images.length
      if (!isValidIndex) return

      const itemElems = this.$refs.item as HTMLDivElement[];
      // クエリパラメータのindexは1スタートなので、-1する
      const targetElm = itemElems[toNumIndexParam - 1]
      this.scrollToTarget(targetElm)
      targetElm.focus()
    },
    scrollToTarget(target: HTMLElement) {
      // targetが見える位置までスクロールする
      target.scrollIntoView({
        behavior: 'smooth'
      })
    }
  },
  mounted() {
    window.addEventListener('load', this.scrollToQueryParamIndex)
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
  height: 100%;
  padding: 5px;
  overflow-y: auto;
  overscroll-behavior: contain;

  @include mq.pc {
    gap: 15px;
  }
}

.grid__item {
  &:focus {
    outline: 5px solid #007cf0;
  }
}

.grid__img {
  clip-path: polygon(0 0, 200% 0, 0 200%);
  transition: clip-path cubic-bezier(0.29, 0.09, 0.21, 0.98) 0.6s;
  &.is-hide {
    clip-path: polygon(0 0, 0 0, 0 0);
  }
}
</style>
