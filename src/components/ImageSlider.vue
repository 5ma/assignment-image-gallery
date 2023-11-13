<template>
  <div class="slider">
    <div class="slider__container">
      <div class="slider__wrapper" ref="wrapper">
        <div
          class="slider__item"
          v-for="image in images"
          :key="image.id"
          :style="gapStyle"
          ref="item"
        >
          <img :src="getImagePath(image.src)" :alt="image.alt" />
        </div>
      </div>
    </div>
    <div class="slider__controls">
      <button
        class="slider__navigation slider__navigation--prev"
        type="button"
        @click="slideToPrev"
      >
        prev
      </button>
      <button
        class="slider__navigation slider__navigation--next"
        type="button"
        @click="slideToNext"
      >
        next
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { type PropType, defineComponent } from 'vue'
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
    gap: {
      type: Number, // スライド間の余白
      default: 20
    },
    isLoop: {
      type: Boolean,
      default: false
    },
    id: Number
  },
  data() {
    return {
      activeIndex: 0, // 現在activeなスライドのindex南郷（start: 0）
      totalSlideLength: this.images.length, // スライド総数
      slideWidth: 0 // スライド一枚の横幅（px）
    }
  },
  computed: {
    gapStyle() {
      return {
        'margin-right': `${this.gap}px`
      }
    },
    isFirstSlide() {
      // 現在最初のスライドがactiveになっている場合はtrue
      return this.activeIndex === 0
    },
    isLastSlide() {
      // 現在最後のスライドがactiveになっている場合はtrue
      return this.activeIndex === this.totalSlideLength - 1
    }
  },
  methods: {
    slideToPrev() {
      console.log('slide to === PREV ===')
      // ループモードがfalseで、かつ最初のスライドの場合はこれ以上戻れないのでreturnする
      if (!this.isLoop && this.isFirstSlide) return
      this.slideToMove(this.activeIndex - 1)
    },
    slideToNext() {
      console.log('slide to === NEXT ===')
      // ループモードがfalseで、かつ最後のスライドの場合はこれ以上進めないのでreturnする
      if (!this.isLoop && this.isLastSlide) return
      this.slideToMove(this.activeIndex + 1)
    },
    slideToMove(index: number) {
      console.log(`slide to === ${index + 1} ===`)
      // index番号に不正な値が渡ってきていないかチェックする
      if (this.isValidIndexNumber(index) === false) return

      const wrapperElm = this.$refs.wrapper as HTMLDivElement
      if (!wrapperElm) return

      // update activeIndex
      this.activeIndex = index
      console.log('this.calculateTranslate(index)', this.calculateTranslate(index))
      wrapperElm.style.translate = `${this.calculateTranslate(index) * -1}px 0`
    },
    update() {
      // slideWidthをupdateした後に、正いtranslateを設定し直す
      this.updateSlideWidth()
      this.slideToMove(this.activeIndex)
    },
    updateSlideWidth() {
      const itemElms = this.$refs.item as HTMLDivElement[]
      if (itemElms && itemElms.length > 0) {
        // 最初のスライドの幅を取得
        this.slideWidth = itemElms[0].getBoundingClientRect().width
      }
      console.log('this.slideWidth', this.slideWidth)
    },
    calculateTranslate(index: number) {
      // スライドの移動距離を求める
      return Math.round(index * this.slideWidth + index * this.gap)
    },
    isValidIndexNumber(index: number) {
      return 0 <= index && index <= this.totalSlideLength - 1
    }
  },
  mounted() {
    console.log('mounted', this.$refs.item)
    this.$nextTick(() => {
      this.updateSlideWidth()
    })

    window.addEventListener('resize', () => {
      this.update()
    })

    window.addEventListener('load', () => {
      this.updateSlideWidth()
    })
  },
  unmounted() {
    console.log('unmounted')
    window.removeEventListener('resize', () => {
      this.update()
    })
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/global/media-query' as mq;

.slider {
  position: relative;
}

.slider__container {
  position: relative;
  width: 100%;
  &::after {
    position: absolute;
    z-index: 100;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background-color: red;
    content: '';
  }
}

.slider__wrapper {
  display: flex;
  width: 100%;
}

.slider__item {
  width: 100%;
  flex-shrink: 0;
}
</style>
