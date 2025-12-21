<template>
  <ClientOnly>
    <div class="innovations-section py-12">
      <v-container fluid class="px-4">
        <!-- Section Header -->
        <div class="text-center mb-8">
          <v-fade-transition appear>
            <h2 class="text-h4 text-md-h3 font-weight-bold text-blue-800 mb-2">
              Inovasi Unggulan
            </h2>
          </v-fade-transition>
          <v-divider
            class="mx-auto"
            color="blue"
            width="200"
            thickness="3"
            rounded
          />
        </div>

        <!-- Carousel Section -->
        <v-carousel
          v-model="currentSlide"
          height="auto"
          hide-delimiter-background
          show-arrows="hover"
          :show-arrows-on-hover="true"
          :cycle="true"
          :interval="4000"
          class="rounded-xl elevation-4"
          aria-label="Carousel inovasi unggulan"
        >
          <v-carousel-item
            v-for="(slide, slideIndex) in slides"
            :key="slideIndex"
            :aria-label="`Slide ${slideIndex + 1} dari ${slides.length}`"
          >
            <v-container>
              <v-row justify="center">
                <v-col
                  v-for="(innovation, idx) in slide"
                  :key="`${slideIndex}-${idx}`"
                  cols="12"
                  sm="6"
                  lg="4"
                  class="pa-2"
                >
                  <v-card
                    class="innovation-card elevation-6"
                    rounded="lg"
                    hover
                    :ripple="false"
                    height="100%"
                  >
                    <v-img
                      :src="innovation.image"
                      :alt="innovation.title"
                      height="200"
                      cover
                      :lazy-src="DEFAULT_PLACEHOLDER"
                      @error="onImageError"
                      class="card-image"
                    >
                      <template v-slot:placeholder>
                        <v-row
                          class="fill-height ma-0"
                          align="center"
                          justify="center"
                        >
                          <v-progress-circular
                            indeterminate
                            color="blue"
                          />
                        </v-row>
                      </template>
                    </v-img>

                    <v-card-title class="text-h6 font-weight-bold text-blue-800 pa-4 pb-2 line-clamp-2">
                      {{ innovation.title }}
                    </v-card-title>

                    <v-card-text class="pa-4 pt-0">
                      <p class="text-body-2 text-gray-700 line-clamp-3 mb-4">
                        {{ innovation.description }}
                      </p>
                      <v-btn
                        color="primary"
                        size="small"
                        :href="innovation.link"
                        target="_blank"
                        rel="noopener"
                        variant="outlined"
                        class="font-weight-medium"
                        aria-label="Baca selengkapnya tentang inovasi ini"
                      >
                        <v-icon left size="small">mdi-open-in-new</v-icon>
                        Selengkapnya
                      </v-btn>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-carousel-item>
        </v-carousel>

        <!-- Navigation Dots Indicator -->
        <div class="text-center mt-4">
          <v-item-group
            v-model="currentSlide"
            mandatory
            class="slide-indicators"
          >
            <v-item
              v-for="n in slides.length"
              :key="n"
              :value="n - 1"
              v-slot="{ isSelected, toggle }"
            >
              <v-btn
                :variant="isSelected ? 'flat' : 'text'"
                size="small"
                icon
                color="primary"
                @click="toggle"
                :aria-label="`Go to slide ${n}`"
              >
                <v-icon size="12">
                  {{ isSelected ? 'mdi-circle' : 'mdi-circle-outline' }}
                </v-icon>
              </v-btn>
            </v-item>
          </v-item-group>
        </div>
      </v-container>
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, computed } from 'vue'

// =============================================
// REACTIVE STATE
// =============================================

/** Current slide index for carousel */
const currentSlide = ref(0)

/** Number of items to display per slide (responsive) */
const itemsPerSlide = ref(3)

// =============================================
// DATA
// =============================================

/** Default lazy loading placeholder */
const DEFAULT_PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'200\' viewBox=\'0 0 400 200\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%23ddd\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' font-size=\'18\' fill=\'%23999\' text-anchor=\'middle\' dy=\'.3em\'%3ELoading...%3C/text%3E%3C/svg%3E'

/** Innovations data array */
const innovations = ref([
  {
    title: 'TIM BUSER (TIM BUNTING SERENTAK)',
    image: 'https://jippnas.menpan.go.id/fronts/assets/images/no-image.png',
    description: `Swasembada daging sapi merupakan target pemerintah yang belum tercapai. Kebutuhan daging sapi nasional pada tahun 2020 mencapai 717.150 ton...`,
    link: 'https://jippnas.menpan.go.id/inovasi/1304'
  },
  {
    title: 'Sistem Informasi Jabatan Provinsi Riau (SI-JABPRI)',
    image: 'https://jippnas.menpan.go.id/storage/images/inovasi/295/img_1.png',
    description: `Kementerian PANRB mendorong Pemda mewujudkan organisasi tepat fungsi, proses, dan ukuran...`,
    link: 'https://jippnas.menpan.go.id/inovasi/295'
  },
  {
    title: 'Pembangunan Pengelolaan Keuangan dengan Sistem Keuangan Desa (Siskeudes)',
    image: 'https://jippnas.menpan.go.id/storage/images/inovasi/img_1/14/4KuYNihN1vXiX66DjLOgy16i7uC9ELmxxGOwrStk.jpg',
    description: `Aplikasi Sistem Keuangan Desa (Siskeudes) dikembangkan sebagai inovasi dan kontribusi Badan Pengawasan Keuangan...`,
    link: 'https://jippnas.menpan.go.id/inovasi/14'
  },
  {
    title: 'BARIS DITEBAS ( BARISTA DISABILITAS TEROBOS STIGMA KETERBATASAN )',
    image: 'https://jippnas.menpan.go.id/storage/images/inovasi/img_1/2853/bPnh4Hhknuqgj6CqDejFElnkE4G4APkaIOqx6jDv.png',
    description: `BARIS DITEBAS (Barista Disabilitas Terobos Stigma Keterbatasan adalah inovasi pelayanan publik...`,
    link: 'https://jippnas.menpan.go.id/inovasi/2853'
  },
  {
    title: 'PINTER MELATIH ANAK KOBRA (Pendidikan Karakter melalui Terapi Psikososial bagi Anak Korban Radikalisme)',
    image: 'https://jippnas.menpan.go.id/storage/images/inovasi/img_1/2895/MP9i2zshtdOMWbPGUawOl6oNGfmqHgHkKkyjnk7Q.jpg',
    description: `Penanganan Anak Korban Radikalisme tentu memiliki kekhususan dan keunikannya masing-masing...`,
    link: 'https://jippnas.menpan.go.id/inovasi/2895'
  }
])

// =============================================
// COMPUTED PROPERTIES
// =============================================

/** Group innovations into slides based on itemsPerSlide */
const slides = computed(() => {
  const result = []
  for (let i = 0; i < innovations.value.length; i += itemsPerSlide.value) {
    result.push(innovations.value.slice(i, i + itemsPerSlide.value))
  }
  return result
})

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

// =============================================
// RESPONSIVE HANDLING
// =============================================

/**
 * Update items per slide based on screen size
 */
const updateItemsPerSlide = () => {
  if (typeof window !== 'undefined') {
    if (window.innerWidth < 600) {
      itemsPerSlide.value = 1
    } else if (window.innerWidth < 1024) {
      itemsPerSlide.value = 2
    } else {
      itemsPerSlide.value = 3
    }
  }
}

// =============================================
// LIFECYCLE HOOKS
// =============================================

/**
 * Initialize responsive behavior on mount
 */
if (typeof window !== 'undefined') {
  window.addEventListener('resize', updateItemsPerSlide)
  updateItemsPerSlide() // Initial call
}
</script>

<style scoped>
/* =============================================
   MAIN CONTAINER STYLES
   ============================================= */

.innovations-section {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  position: relative;
  overflow: hidden;
}

/* =============================================
   CARD STYLES
   ============================================= */

.innovation-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.innovation-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  transition: left 0.6s;
}

.innovation-card:hover::before {
  left: 100%;
}

.innovation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

/* =============================================
   IMAGE STYLES
   ============================================= */

.card-image {
  transition: transform 0.3s ease;
}

.innovation-card:hover .card-image {
  transform: scale(1.05);
}

/* =============================================
   TEXT UTILITIES
   ============================================= */

/* Limit text to 2 lines */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

/* Limit text to 3 lines */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

/* =============================================
   NAVIGATION STYLES
   ============================================= */

.slide-indicators {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
}

/* =============================================
   ANIMATIONS
   ============================================= */

.innovations-section::before {
  content: '';
  position: absolute;
  top: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.1), transparent);
  animation: float-bg 8s ease-in-out infinite;
}

.innovations-section::after {
  content: '';
  position: absolute;
  bottom: -30px;
  left: -30px;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(147, 197, 253, 0.1), transparent);
  animation: float-bg 6s ease-in-out infinite reverse;
}

@keyframes float-bg {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* =============================================
   RESPONSIVE ADJUSTMENTS
   ============================================= */

@media (max-width: 600px) {
  .innovation-card {
    margin-bottom: 16px;
  }

  .innovations-section::before,
  .innovations-section::after {
    display: none;
  }

  .slide-indicators {
    gap: 4px;
  }
}
</style>