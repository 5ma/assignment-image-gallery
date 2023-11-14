<template>
  <div class="gallery-switcher">
    <div class="gallery-switcher__contents">
      <div class="gallery-switcher__gallery" :aria-hidden="!isGalleryMode">
        <ImageGrid :images="images" :isHide="!isGalleryMode" />
      </div>
      <div class="gallery-switcher__slider" :aria-hidden="isGalleryMode">
        <ImageSlider
          :images="images"
          :isHide="isGalleryMode"
          ref="slider"
          @onUpdateLastStatus="checkIsLast"
          @omUpdateFirstStatus="checkIsFirst"
        />
      </div>
    </div>
  </div>
  <div class="controls">
    <button type="button" class="controls__switcher" @click="toggleViewMode">View</button>
    <Transition name="fade">
      <button
        class="controls__slide-nav controls__slide-nav--prev"
        type="button"
        @click="slideToPrev"
        :disabled="isFirstSlide"
        v-show="viewMode === 'slider'"
      >
        Prev
      </button>
    </Transition>
    <Transition name="fade">
      <button
        class="controls__slide-nav controls__slide-nav--next"
        type="button"
        @click="slideToNext"
        :disabled="isLastSlide"
        v-show="viewMode === 'slider'"
      >
        Next
      </button>
    </Transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ImageSlider from '@/components/ImageSlider.vue'
import ImageGrid from '@/components/ImageGrid.vue'
import { galleryImages, type GalleryImageItem } from '@/data/gallery-images'
import { useQueryParam } from "@/composables/use-query-param";

export default defineComponent({
  setup() {
    const { setQueryParam, getQueryParam } = useQueryParam()
    return { setQueryParam, getQueryParam }
  },
  components: {
    ImageSlider,
    ImageGrid
  },
  data(): {
    images: GalleryImageItem[]
    viewMode: 'gallery' | 'slider'
    isFirstSlide: boolean
    isLastSlide: boolean
  } {
    return {
      images: galleryImages,
      viewMode: 'slider',
      isFirstSlide: true,
      isLastSlide: false
    }
  },
  computed: {
    isGalleryMode() {
      return this.viewMode === 'gallery'
    }
  },
  watch: {
    viewMode() {
      this.setQueryParam('mode', this.viewMode)
    }
  },
  methods: {
    slideToPrev() {
      const slider = this.$refs.slider as InstanceType<typeof ImageSlider>
      slider.slideToPrev()
    },
    slideToNext() {
      const slider = this.$refs.slider as InstanceType<typeof ImageSlider>
      slider.slideToNext()
    },
    toggleViewMode() {
      this.viewMode = this.viewMode === 'gallery' ? 'slider' : 'gallery'
    },
    checkIsLast(value: boolean) {
      // 子コンポーネントから値を受け取る
      this.isLastSlide = value
    },
    checkIsFirst(value: boolean) {
      // 子コンポーネントから値を受け取る
      this.isFirstSlide = value
    }
  },
  created() {
    // クエリパラメータでmodeの指定があればviewModeを切り替える
    const viewModeParam = this.getQueryParam('mode');
    if (viewModeParam === 'gallery' || viewModeParam === 'slider') {
      this.viewMode = viewModeParam
    }
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/global/media-query' as mq;
@use '@/styles/global/functions' as func;

.gallery-switcher {
  position: relative;
  width: 100%;
  max-width: 1200px;
  overflow: hidden;
}

.gallery-switcher__contents {
  position: relative;
}

.gallery-switcher__gallery {
  position: absolute;
  top: 0;
  left: 50%;
  width: 100%;
  height: 100%;
  translate: -50% 0;
  transition: 0s 0s;

  &[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition-delay: 0.6s;
  }
}

.gallery-switcher__slider {
  position: relative;
  width: 88%;
  margin-inline: auto;
  transition: 0s 0s;

  &[aria-hidden='true'] {
    visibility: hidden;
    opacity: 0;
    transition-delay: 0.6s;
  }

  @include mq.pc {
    width: 85%;
  }
}

.controls {
  display: grid;
  grid-template-columns: max-content 1fr 1fr;
  gap: 5px 15px;
  width: 95%;
  align-items: center;
  margin-top: 19px;
  line-height: 1.5;

  @include mq.pc {
    width: 80%;
    gap: 5px 20px;
    margin-top: 30px;
  }
}

.controls__switcher {
  position: relative;
  z-index: 1;
  width: 100px;
  padding: 5px 20px;
  color: white;
  text-align: center;
  border: 1px solid #007cf0;
  border-radius: 5px;
  transition: 0.3s ease;
  transition-property: color;

  &::before {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    content: '';
    background: linear-gradient(to right, #007cf0, #00dfd8);
    background-size: 100% 100%;
    border-radius: 5px;
    transition: 0.3s ease;
    transition-property: opacity, background-size;
  }
  @include mq.sp {
    font-size: func.px-to-rem(14);
  }
  @include mq.pc {
    padding: 10px 25px;
  }
  @include mq.hover {
    &:hover {
      color: #007cf0;
      &::before {
        background-size: 200% 100%;
        opacity: 0;
      }
    }
  }
  &:not(:disabled) {
    cursor: pointer;
  }
}

.controls__slide-nav {
  padding: 5px 20px;
  color: white;
  text-align: center;
  background: black;
  border: 1px solid black;
  border-radius: 5px;
  transition: 0.3s ease;
  transition-property: color, background-color;
  @include mq.sp {
    font-size: func.px-to-rem(14);
  }
  @include mq.pc {
    padding: 10px 25px;
  }
  @include mq.hover {
    &:hover {
      color: black;
      background-color: white;
    }
  }
  &:disabled {
    background-color: #cccccc;
    border-color: #cccccc;
    pointer-events: none;
  }
  &:not(:disabled) {
    cursor: pointer;
  }
}

.fade-enter-active {
  transition: opacity 0.5s ease;
}
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
