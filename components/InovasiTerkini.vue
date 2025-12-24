<template>
  <ClientOnly>
    <div class="innovation-hero relative overflow-hidden">
      <!-- Background with primary blue color -->
      <div class="absolute inset-0 bg-primary z-0"></div>

      <v-container class="relative z-10 pt-12 pb-8">
        <!-- Hero Title -->
        <div class="text-center mb-10">
          <div class="d-flex justify-center mb-4">
            <v-icon icon="mdi-innovation" color="amber" size="x-large" class="mr-2" />
            <h2 class="text-h3 text-md-h2 font-weight-black text-white">
              Inovasi Terkini
            </h2>
          </div>
          <v-divider
            class="mx-auto mt-2"
            color="amber"
            width="80"
            thickness="3"
            rounded
          />
          <p class="text-body-2 text-blue-100 max-w-lg mx-auto mt-4">
            Terobosan nyata dari instansi pemerintah dan BUMN untuk pelayanan publik yang lebih cepat, cerdas, dan manusiawi.
          </p>
        </div>

        <!-- Main Grid -->
        <v-row class="align-stretch" dense>
          <!-- Carousel Section (Enhanced) -->
          <v-col cols="12" md="12" lg="8">
            <v-sheet
              rounded="xl"
              class="carousel-container overflow-hidden elevation-6"
              color="rgba(255, 255, 255, 0.04)"
              border
            >
              <v-carousel
                v-model="currentSlide"
                height="480"
                hide-delimiter-background
                :show-arrows="false"
                :cycle="true"
                :interval="4000"
                class="carousel-enhanced"
                :touch="{ left: 15, right: 15 }"
              >
                <v-carousel-item
                  v-for="(item, i) in innovations"
                  :key="i"
                  class="carousel-item relative"
                >
                  <!-- Parallax Background -->
                  <div
                    class="carousel-bg absolute inset-0 transition-transform duration-500"
                    :style="{
                      backgroundImage: `url(${item.image || DEFAULT_PLACEHOLDER})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transform: `scale(1.05) translateY(${(currentSlide === i ? 0 : 30)}px)`,
                      opacity: currentSlide === i ? 1 : 0.85
                    }"
                  />

                  <!-- Overlay -->
                  <div class="absolute inset-0 bg-linear-to-t from-blue-950/90 via-transparent to-transparent z-10"></div>

                  <!-- Content Card (Floating) -->
                  <div
                    class="absolute bottom-6 left-6 right-6 z-20"
                    :class="{ 'animate-fade-in-up': currentSlide === i }"
                  >
                    <v-card
                      class="pa-5"
                      color="white"
                      rounded="xl"
                      elevation="8"
                    >
                      <v-chip
                        size="small"
                        color="blue"
                        class="font-weight-medium mb-2"
                      >
                        {{ item.institution }}
                      </v-chip>
                      <v-card-title
                        class="text-h5 font-weight-bold text-blue-900 pt-0 pb-3 line-clamp-2"
                      >
                        {{ item.title }}
                      </v-card-title>
                      <v-card-actions class="pa-0 pt-2">
                        <v-spacer />
                        <v-btn
                          color="primary"
                          size="small"
                          variant="flat"
                          :href="item.link"
                          target="_blank"
                          rel="noopener"
                          prepend-icon="mdi-arrow-right"
                          class="text-none"
                        >
                          Selengkapnya
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </div>

                  <!-- Slide indicators (modern dots) -->
                  <div
                    v-if="i === currentSlide"
                    class="absolute top-4 right-4 flex space-x-1"
                  >
                    <v-btn
                      v-for="(_, idx) in innovations"
                      :key="idx"
                      size="x-small"
                      variant="text"
                      :class="[
                        idx === currentSlide
                          ? 'bg-amber-400'
                          : 'bg-white/30 hover:bg-white/50'
                      ]"
                      rounded="pill"
                      width="6"
                      height="6"
                      @click="currentSlide = idx"
                      :aria-label="`Pindah ke slide ${idx + 1}`"
                    />
                  </div>
                </v-carousel-item>
              </v-carousel>
            </v-sheet>
          </v-col>

          <!-- Video Section (Enhanced) -->
          <v-col cols="12" lg="4" class="pt-6 pt-lg-0">
            <v-sheet
              rounded="xl"
              class="video-card overflow-hidden elevation-6"
              color="rgba(255, 255, 255, 0.04)"
              border
            >
              <div class="relative h-full rounded-xl overflow-hidden">
                <div
                  v-if="!videoLoaded"
                  class="w-full h-full bg-blue-800/20 flex items-center justify-center"
                >
                  <v-skeleton-loader type="image" class="w-full h-full rounded-xl" />
                </div>

                <div
                  v-else
                  class="relative w-full h-full group"
                >
                  <iframe
                    :src="videoSrc + '&autoplay=0&modestbranding=1&rel=0'"
                    title="Video inovasi terkini"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    class="w-full h-full"
                    ref="videoIframe"
                  />

                  <!-- Play overlay (optional for branding) -->
                  <div
                    class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none"
                  >
                    <v-icon size="x-large" color="white" class="drop-shadow">mdi-play-circle-outline</v-icon>
                  </div>
                </div>

                <v-card
                  class="absolute bottom-0 left-0 right-0 pa-4 bg-linear-to-t from-blue-900/90 to-transparent text-white z-10"
                >
                  <v-card-title class="text-h6 font-weight-bold pb-1">
                    Cerita dari Lapangan
                  </v-card-title>
                  <v-card-subtitle class="text-body-2 opacity-80">
                    Simak bagaimana inovasi ini mengubah pelayanan publik
                  </v-card-subtitle>
                </v-card>
              </div>
            </v-sheet>
          </v-col>
        </v-row>

        <!-- CTA button (optional but recommended) -->
        <div class="text-center mt-8">
          <v-btn
            to="/etalase"
            size="large"
            rounded="pill"
            color="amber"
            variant="flat"
            class="px-8 font-weight-bold text-blue-900"
            prepend-icon="mdi-lightbulb-outline"
          >
            Jelajahi Semua Inovasi
          </v-btn>
        </div>
      </v-container>

      <!-- Animated Ornaments (enhanced colors & motion) -->
      <div class="ornaments pointer-events-none">
        <div class="ornament-gold" />
        <div class="ornament-blue" />
        <div class="ornament-indigo" />
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentSlide = ref(0)
const videoLoaded = ref(false)
const videoIframe = ref(null)

// —— Data ——
const DEFAULT_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5GamJvbCBGb3JtYXRpdmU8L3RleHQ+PC9zdmc+'

const innovations = ref([
  {
    title: 'Prolanis – One Stop Service Pengelolaan Hipertensi dan Diabetes Melitus',
    institution: 'Pemkot Bandung',
    image: 'https://jippnas.menpan.go.id/storage/images/inovasi/2497/img_1.png',
    link: 'https://jippnas.menpan.go.id/inovasi/2497'
  },
  {
    title: 'Klinik Konsultasi Agribisnis',
    institution: 'Pemkab Gunungkidul',
    image: 'https://jippnas.menpan.go.id/storage/images/inovasi/img_1/338/BVB2Tbw0vWsxlSRTkOiWYwsWtlrP1ESi9EqJS4Wn.jpg',
    link: 'https://jippnas.menpan.go.id/inovasi/338'
  },
  {
    title: 'Pelayanan Prima Bandara',
    institution: 'PT Angkasa Pura I',
    image: 'https://jippnas.menpan.go.id/storage/images/inovasi/2518/img_1.png',
    link: 'https://jippnas.menpan.go.id/inovasi/2518'
  },
  {
    title: 'IKAN DORI: Pelatihan Olahan Rumput Laut & Ikan',
    institution: 'Kemenperin',
    image: 'https://jippnas.menpan.go.id/storage/images/inovasi/img_1/2697/naJI1uZbWCcg0iun2xiJesRmNZUbTHfvMPVhGlXb.png',
    link: 'https://jippnas.menpan.go.id/inovasi/2697'
  },
  {
    title: 'Smart Cloud',
    institution: 'Pemkot Bima',
    image: 'https://jippnas.menpan.go.id/storage/images/inovasi/img_1/275/ROUhUaXxk0y8q6wtBjDPwXC69tLHwwgkFh0y8B1p.png',
    link: 'https://jippnas.menpan.go.id/inovasi/275'
  }
])

const videoSrc = ref('https://www.youtube.com/embed/BFewz4T-2nI?si=2CR7PZZascpuIvpI&enablejsapi=1')

// —— Lifecycle ——
onMounted(() => {
  // Delay load for smoother UX
  const timer = setTimeout(() => {
    videoLoaded.value = true
  }, 800)

  return () => clearTimeout(timer)
})

// —— Utils ——
const onImageError = (e) => {
  e.target.src = DEFAULT_PLACEHOLDER
}
</script>

<style scoped>
.innovation-hero {
  min-height: 80vh;
  padding-bottom: 4rem;
}

.carousel-container {
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
}

.carousel-enhanced ::v-deep(.v-carousel__controls) {
  display: none !important;
}

.carousel-bg {
  will-change: transform, opacity;
}

/* Fade-in + slide-up animation */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

/* Video card */
.video-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
}

/* Ornaments */
.ornaments {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.ornament-gold {
  position: absolute;
  top: 10%;
  right: 5%;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 200, 100, 0.12), transparent 70%);
  filter: blur(32px);
  animation: float 12s ease-in-out infinite;
}

.ornament-blue {
  position: absolute;
  bottom: 15%;
  left: 8%;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(100, 180, 255, 0.1), transparent 70%);
  filter: blur(28px);
  animation: float 10s ease-in-out infinite reverse;
}

.ornament-indigo {
  position: absolute;
  top: 60%;
  left: -40px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(120, 100, 255, 0.08), transparent 70%);
  filter: blur(20px);
  animation: float 14s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}

/* Responsive */
@media (max-width: 960px) {
  .carousel-container,
  .video-card {
    height: auto !important;
    min-height: 400px;
  }

  .carousel-enhanced {
    height: 400px !important;
  }

  .carousel-bg {
    transform: scale(1.03) !important;
  }
}

@media (max-width: 600px) {
  .innovation-hero {
    padding-top: 2rem;
  }

  .video-card {
    min-height: 300px;
  }

  .carousel-enhanced {
    height: 360px !important;
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
</style>