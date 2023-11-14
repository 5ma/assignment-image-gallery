<template>
  <div class="gallery-switcher">
    <div class="gallery-switcher__contents">
      <div class="gallery-switcher__gallery">
        <ImageGrid :images="images" />
      </div>
      <div class="gallery-switcher__slider">
        <ImageSlider
          :images="images"
          ref="slider"
          @onUpdateLastStatus="checkIsLast"
          @omUpdateFirstStatus="checkIsFirst"
          />
      </div>
    </div>
  </div>
  <div class="controls">
    <button type="button" class="controls__switcher">View</button>
    <button
      class="controls__slide-nav controls__slide-nav--prev"
      type="button"
      @click="slideToPrev"
      :disabled="isFirstSlide"
      v-show="viewMode === 'slider'"
    >
      Prev
    </button>
    <button
      class="controls__slide-nav controls__slide-nav--next"
      type="button"
      @click="slideToNext"
      :disabled="isLastSlide"
      v-show="viewMode === 'slider'"
    >
      Next
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ImageSlider from '@/components/ImageSlider.vue'
import ImageGrid from '@/components/ImageGrid.vue'
import { galleryImages, type GalleryImageItem } from '@/data/gallery-images'

export default defineComponent({
  components: {
    ImageSlider,
    ImageGrid
  },
  data(): {
    images: GalleryImageItem[],
    viewMode: 'gallery' | 'slider',
    isFirstSlide: boolean,
    isLastSlide: boolean
  } {
    return {
      images: galleryImages,
      viewMode: 'slider',
      isFirstSlide: true,
      isLastSlide: false,
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
    checkIsLast(value: boolean) {
      this.isLastSlide = value
    },
    checkIsFirst(value: boolean) {
      this.isFirstSlide = value
    },
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
  width: 94%;
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  visibility: hidden;
  opacity: 0;
  translate: -50% 0;

  @include mq.pc {
    width: 90%;
  }
}

.gallery-switcher__slider {
  position: relative;
  width: 88%;
  margin-inline: auto;

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
  border: 1px solid #007CF0;
  border-radius: 5px;
  transition: .3s ease;
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
    background: linear-gradient(to right, #007CF0, #00DFD8);
    background-size: 100% 100%;
    border-radius: 5px;
    transition: .3s ease;
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
      color: #007CF0;
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
  transition: .3s ease;
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
</style>
