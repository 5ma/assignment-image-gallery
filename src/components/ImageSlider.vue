<template>
  <div
    class="slider"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @dragstart="handleDragStart"
    @drag="handleDrag"
    @dragend="handleDragEnd"
  >
    <div class="slider__container">
      <div class="slider__wrapper" ref="wrapper" :style="{ translate: `${animateTranslate}px 0` }">
        <ImageSlide
          v-for="(image, index) in images"
          :key="image.id"
          :style="gapStyle"
          :image="{ src: image.src, alt: image.alt }"
          :id="image.id"
          :isCurrent="activeIndex === index"
          :isHide="isHide"
          ref="item"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { type PropType, defineComponent } from 'vue'
import anime from 'animejs'
import type { GalleryImageItem } from '@/data/gallery-images'
import ImageSlide from '@/components/ImageSlide.vue'
import { useQueryParam } from "@/composables/use-query-param";

// この数値よりスワイプ or ドラッグ距離が短い場合、スライダーは動かない
const minimumDistance = 30

export default defineComponent({
  setup() {
    const { setQueryParam, getQueryParam } = useQueryParam()
    return { setQueryParam, getQueryParam }
  },
  components: {
    ImageSlide
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
    isHide: {
      type: Boolean,
      default: false
    },
    id: Number
  },
  data(): {
    activeIndex: number
    totalSlideLength: number
    slideWidth: number
    translate: number
    animateTranslate: number
    touchStartX: number | undefined
    touchEndX: number | undefined
    isDragging: boolean
    dragStartX: number | undefined
    dragEndX: number | undefined
    animeInstance: anime.AnimeInstance | undefined
  } {
    return {
      activeIndex: 0, // 現在activeなスライドのindex南郷（start: 0）
      totalSlideLength: this.images.length, // スライド総数
      slideWidth: 0, // スライド一枚の横幅（px）
      translate: 0,
      animateTranslate: 0, // アニメーション用translate
      touchStartX: undefined,
      touchEndX: undefined,
      isDragging: false,
      dragStartX: undefined,
      dragEndX: undefined,
      animeInstance: undefined
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
  watch: {
    translate(newVal) {
      // スライド移動アニメーション
      if (this.animeInstance) {
        this.animeInstance.pause()
      }

      if (this.isDragging) {
        // ドラッグ中はアニメーションせずに値を適用する
        this.animateTranslate = newVal
      } else {
        // オブジェクトの値に対してアニメーションさせる
        this.animeInstance = anime({
          targets: this,
          animateTranslate: newVal,
          duration: 700,
          easing: 'cubicBezier(0.25, 0.1, 0.25, 1.0)'
        })
      }
    },
    activeIndex(newVal: number) {
      // URLにindex=[number]クエリパラメータを追加
      this.setQueryParam('index', (newVal + 1).toString())
    },
    isFirstSlide(newVal) {
      this.$emit('omUpdateFirstStatus', newVal)
    },
    isLastSlide(newVal) {
      this.$emit('onUpdateLastStatus', newVal)
    }
  },
  methods: {
    slideToPrev() {
      this.$debug('=== slide to PREV ===')
      // this.$debug('slide to === PREV ===')
      // ループモードがfalseで、かつ最初のスライドの場合はこれ以上戻れないのでreturnする
      if (!this.isLoop && this.isFirstSlide) return
      this.slideToMove(this.activeIndex - 1)
    },
    slideToNext() {
      this.$debug('=== slide to NEXT ===')
      // ループモードがfalseで、かつ最後のスライドの場合はこれ以上進めないのでreturnする
      if (!this.isLoop && this.isLastSlide) return
      this.slideToMove(this.activeIndex + 1)
    },
    slideToMove(index: number) {
      this.$debug(`=== slide to ${index + 1} ===`)
      // index番号に不正な値が渡ってきていないかチェックする
      if (this.isValidIndexNumber(index) === false) return

      const wrapperElm = this.$refs.wrapper as HTMLDivElement
      if (!wrapperElm) return

      // update activeIndex
      this.activeIndex = index
      // スライドの移動距離を求める
      this.translate = this.calculateTranslate(index) * -1
    },
    update() {
      // slideWidthをupdateした後に、正いtranslateを設定し直す
      this.updateSlideWidth()
      this.slideToMove(this.activeIndex)
    },
    updateSlideWidth() {
      const itemInstance = this.$refs.item as InstanceType<typeof ImageSlide>[]
      if (itemInstance && itemInstance.length > 0) {
        // 最初のスライドの幅を取得
        this.slideWidth = itemInstance[0].$el.getBoundingClientRect().width
      }
    },
    calculateTranslate(index: number) {
      // スライドの移動距離を求める
      return Math.round(index * this.slideWidth + index * this.gap)
    },
    isValidIndexNumber(index: number) {
      return 0 <= index && index <= this.totalSlideLength - 1
    },
    handleTouchStart(event: TouchEvent) {
      event.preventDefault()

      this.touchStartX = event.touches[0].pageX
      this.$debug('this.touchStartX', this.touchStartX)
    },
    handleTouchMove(event: TouchEvent) {
      event.preventDefault()

      this.touchEndX = event.changedTouches[0].pageX
      this.$debug('this.touchEndX', this.touchEndX)
    },
    handleTouchEnd(event: TouchEvent) {
      event.preventDefault()

      if (!this.touchStartX || !this.touchEndX) return

      const distanceX = this.touchEndX - this.touchStartX
      // 移動距離がminimumDistance以下の場合はreturnする
      if (Math.abs(distanceX) <= minimumDistance) return

      if (distanceX > 0) {
        this.$debug('右スワイプ')
        this.slideToPrev()
      } else {
        this.$debug('左スワイプ')
        this.slideToNext()
      }
    },
    handleDragStart(event: DragEvent) {
      this.isDragging = true

      this.dragStartX = event.pageX
      this.$debug('handleDragStart', event, event.pageX)
    },
    handleDrag(event: DragEvent) {
      // dragEndイベント発火前に必ずpageXが0になるので、その場合は無視する
      if (!this.isDragging || event.pageX === 0) return
      this.dragEndX = event.pageX

      // translateにドラッグ移動距離分だけ値を追加
      const addTranslate = this.dragEndX - (this.dragStartX ?? 0)

      // translate再計算
      this.translate = this.calculateTranslate(this.activeIndex) * -1 + addTranslate
    },
    handleDragEnd() {
      if (!this.isDragging) return
      this.isDragging = false

      if (!this.dragStartX || !this.dragEndX) return

      const distanceX = this.dragEndX - this.dragStartX
      // 移動距離がminimumDistance以下の場合はreturnする
      if (Math.abs(distanceX) <= minimumDistance) return

      if (distanceX > 0) {
        this.$debug('右へドラッグ')
        this.slideToPrev()
      } else {
        this.$debug('左へドラッグ')
        this.slideToNext()
      }
    }
  },
  mounted() {
    this.$debug('mounted')
    this.$nextTick(() => {
      this.update()
    })

    window.addEventListener('resize', this.update)
    window.addEventListener('load', this.update)

    // クエリパラメータでindexの指定があればスライド移動させる
    const slideIndexParam = this.getQueryParam('index');
    if (slideIndexParam) {
      const toNumIndexParam = parseInt(slideIndexParam);
      if (this.isValidIndexNumber(toNumIndexParam - 1) === false) return
      this.slideToMove(toNumIndexParam - 1)
    }
  },
  unmounted() {
    window.removeEventListener('resize', this.update)
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
    /* background-color: red; */
    content: '';
  }
}

.slider__wrapper {
  display: flex;
  width: 100%;
  translate: 0;
}
</style>
