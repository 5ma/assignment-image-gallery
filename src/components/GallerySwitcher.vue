<template>
  <div class="gallery-switcher">
    <div class="gallery-switcher__contents">
      <div class="gallery-switcher__gallery">
        <ImageGrid :images="images" />
      </div>
      <div class="gallery-switcher__slider">
        <ImageSlider :images="images" ref="slider" />
      </div>
    </div>
  </div>
  <div class="controls">
    <button type="button" class="">View</button>
    <button
      class="controls__slide-nav controls__slide-nav--prev"
      type="button"
      @click="slideToPrev"
    >
      Prev
    </button>
    <button
      class="controls__slide-nav controls__slide-nav--next"
      type="button"
      @click="slideToNext"
    >
      Next
    </button>
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
  },
  methods: {
    slideToPrev() {
      const slider = this.$refs.slider as InstanceType<typeof ImageSlider>
      slider.slideToPrev()
    },
    slideToNext() {
      const slider = this.$refs.slider as InstanceType<typeof ImageSlider>
      slider.slideToNext()
    }
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/global/media-query' as mq;

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
  display: flex;
  flex-wrap: wrap;
  gap: 5px 15px;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  line-height: 1.5;
}

.controls__slide-nav {
  padding: 5px 10px;
  border: 1px solid black;
  &:not(:disabled) {
    cursor: pointer;
  }
}
</style>
