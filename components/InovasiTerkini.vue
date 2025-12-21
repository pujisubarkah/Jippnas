<template>
  <ClientOnly>
    <div class="bg-top relative">
      <v-container fluid class="pa-4">
        <!-- Section Header -->
        <div class="text-center pt-12 pb-6">
          <h2 class="text-h3 text-md-h2 font-weight-black text-white mb-4">
            Inovasi Terkini
            <v-divider
              class="mx-auto mt-3"
              color="amber"
              width="128"
              thickness="4"
              rounded
            />
          </h2>
        </div>

        <!-- Main Content Grid -->
        <v-row class="align-stretch">
          <!-- Carousel Section -->
          <v-col cols="12" lg="8" class="pb-6">
            <v-carousel
              v-model="currentSlide"
              height="480"
              hide-delimiter-background
              show-arrows="hover"
              :show-arrows-on-hover="true"
              :cycle="true"
              :interval="3000"
              class="rounded-lg elevation-4"
              aria-label="Carousel inovasi terkini"
            >
              <v-carousel-item
                v-for="(item, index) in innovations"
                :key="index"
                :aria-label="`Slide ${index + 1}: ${item.title}`"
              >
                <v-img
                  :src="item.image"
                  :alt="item.title"
                  height="480"
                  cover
                  :lazy-src="item.lazyImage"
                  @error="onImageError"
                  class="carousel-image"
                >
                  <v-card
                    class="mx-4 my-12 pa-4 elevation-8"
                    max-width="400"
                    color="white"
                    rounded="xl"
                  >
                    <v-card-title class="text-h6 font-weight-bold text-truncate-2">
                      {{ item.title }}
                    </v-card-title>
                    <v-card-subtitle class="text-body-2 mb-2">
                      {{ item.institution }}
                    </v-card-subtitle>
                    <v-card-actions class="pa-0">
                      <v-spacer />
                      <v-btn
                        color="primary"
                        size="small"
                        :href="item.link"
                        target="_blank"
                        rel="noopener"
                        aria-label="Baca selengkapnya tentang inovasi ini"
                      >
                        Selengkapnya
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-img>
              </v-carousel-item>
            </v-carousel>
          </v-col>

          <!-- Video Section -->
          <v-col cols="12" lg="4">
            <v-card height="480" class="rounded-tl-0 elevation-4">
              <v-responsive :aspect-ratio="16/9">
                <iframe
                  v-if="videoLoaded"
                  :src="videoSrc"
                  title="Video inovasi terkini"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                  class="w-full h-full"
                  @load="onVideoLoad"
                  @error="onVideoError"
                />
                <v-skeleton-loader
                  v-else
                  type="image"
                  height="100%"
                  class="rounded-tl-0"
                />
              </v-responsive>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Background Ornaments -->
      <div class="ornaments pointer-events-none">
        <div class="ornament-1" />
        <div class="ornament-2" />
        <div class="ornament-3" />
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// =============================================
// REACTIVE STATE
// =============================================

/** Current slide index for carousel */
const currentSlide = ref(0)

/** Video loading state */
const videoLoaded = ref(false)

/** Video source URL */
const videoSrc = ref('https://www.youtube.com/embed/BFewz4T-2nI?si=2CR7PZZascpuIvpI')

// =============================================
// DATA
// =============================================

/** Default lazy loading placeholder */
const DEFAULT_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Mb2FkaW5nLi4uPC90ZXh0Pjwvc3ZnPg=='

/** Innovations data array */
const innovations = ref([
  {
    title: 'Prolanis – One Stop Service Pengelolaan Hipertensi dan Diabetes Melitus di Puskesmas Talagabodas Kota Bandung',
    image: 'https://jippnas.menpan.go.id/storage/images/inovasi/2497/img_1.png',
    lazyImage: DEFAULT_PLACEHOLDER,
    institution: 'Pemerintah Kota Bandung',
    link: 'https://jippnas.menpan.go.id/inovasi/2497'
  },
  {
    title: 'Pengembangan Klinik Konsultasi Agribisnis',
    image: 'https://jippnas.menpan.go.id/storage/images/inovasi/img_1/338/BVB2Tbw0vWsxlSRTkOiWYwsWtlrP1ESi9EqJS4Wn.jpg',
    lazyImage: DEFAULT_PLACEHOLDER,
    institution: 'Pemerintah Kabupaten Gunungkidul',
    link: 'https://jippnas.menpan.go.id/inovasi/338'
  },
  {
    title: 'Inovasi Pelayanan Prima Bandara',
    image: 'https://jippnas.menpan.go.id/storage/images/inovasi/2518/img_1.png',
    lazyImage: DEFAULT_PLACEHOLDER,
    institution: 'PT Angkasa Pura I (Persero)',
    link: 'https://jippnas.menpan.go.id/inovasi/2518'
  },
  {
    title: '(IKAN DORI) Inovasi Pendidikan dan Pelatihan On site Diversifikasi Olahan Rumput Laut dan Ikan di daerah pesisir',
    image: 'https://jippnas.menpan.go.id/storage/images/inovasi/img_1/2697/naJI1uZbWCcg0iun2xiJesRmNZUbTHfvMPVhGlXb.png',
    lazyImage: DEFAULT_PLACEHOLDER,
    institution: 'Kementerian Perindustrian',
    link: 'https://jippnas.menpan.go.id/inovasi/2697'
  },
  {
    title: 'Smart Cloud',
    image: 'https://jippnas.menpan.go.id/storage/images/inovasi/img_1/275/ROUhUaXxk0y8q6wtBjDPwXC69tLHwwgkFh0y8B1p.png',
    lazyImage: DEFAULT_PLACEHOLDER,
    institution: 'Pemerintah Kota Bima',
    link: 'https://jippnas.menpan.go.id/inovasi/275'
  }
])

// =============================================
// EVENT HANDLERS
// =============================================

/**
 * Handle image loading error
 * @param {Event} event - Error event
 */
const onImageError = (event) => {
  console.warn('Image failed to load:', event.target.src)
}

/**
 * Handle video load success
 */
const onVideoLoad = () => {
  videoLoaded.value = true
}

/**
 * Handle video loading error
 */
const onVideoError = () => {
  console.error('Video failed to load')
}

// =============================================
// LIFECYCLE HOOKS
// =============================================

/**
 * Component mount hook - lazy load video for performance
 */
onMounted(() => {
  setTimeout(() => {
    videoLoaded.value = true
  }, 1000)
})
</script>

<style scoped>
/* =============================================
   MAIN CONTAINER STYLES
   ============================================= */

.bg-top {
  position: relative;
  overflow: hidden;
  background: url('/vektor.jpg') no-repeat center 0%;
  background-size: 100% auto;
  min-height: calc(80vh - 80px);
  padding-top: 2rem;
}

/* =============================================
   BACKGROUND ORNAMENTS
   ============================================= */

.ornaments {
  position: absolute;
  inset: 0;
}

.ornament-1 {
  position: absolute;
  top: -40px;
  left: -40px;
  width: 224px;
  height: 224px;
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba(255, 200, 120, 0.2), transparent 70%);
  filter: blur(16px);
}

.ornament-2 {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 288px;
  height: 288px;
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba(125, 200, 255, 0.15), transparent 70%);
  filter: blur(24px);
}

.ornament-3 {
  position: absolute;
  top: 50%;
  left: 48px;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba(135, 206, 235, 0.15), transparent 70%);
  filter: blur(16px);
}

/* =============================================
   CAROUSEL STYLES
   ============================================= */

.carousel-image {
  border-radius: 8px;
}

/* =============================================
   TEXT UTILITIES
   ============================================= */

/* Custom text truncation for title - limits to 2 lines */
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>