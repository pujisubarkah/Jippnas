<template>
  <ClientOnly>
    <div class="container-fluid bg-top relative">
      <div class="container mx-auto px-4">
        <div class="w-full pt-2">
          <div class="flex justify-center">
            <h2 class="relative text-4xl md:text-5xl font-extrabold text-white tracking-wide pb-3">
              Inovasi Terkini
              <span class="absolute left-1/2 -translate-x-1/2 -bottom-1 h-1 w-32 bg-linear-to-r from-amber-300 via-amber-400 to-amber-200 rounded-full"></span>
            </h2>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div class="lg:col-span-8">
              <div class="our-news">
                <swiper
                  :slides-per-view="1"
                  :space-between="30"
                  :navigation="true"
                  :pagination="{ clickable: true }"
                  :autoplay="{ delay: 3000 }"
                  :loop="true"
                  class="owl-news-item"
                >
                  <swiper-slide v-for="(item, index) in innovations" :key="index">
                    <div class="item relative" style="max-width:1000px; height:480px;">
                      <img :src="item.image" :alt="item.title" class="w-full h-full object-cover img_banner">
                      <div class="carousel-caption absolute inset-0 flex justify-start items-center p-4">
                        <div class="position-relative max-w-md">
                          <div class="position-absolute top-0 left-0 bg-white my-5 p-3 rounded-bl-3xl shadow-lg">
                            <h6 class="text-bold text-wrap text-truncate mb-2" style="max-height:70px; overflow: hidden;">
                              {{ item.title }}
                            </h6>
                            <p class="mb-2">{{ item.institution }}</p>
                            <div class="flex justify-end">
                              <a :href="item.link" target="_blank" class="btn btn-sm btn-primary">Selengkapnya</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </swiper-slide>
                </swiper>
              </div>
            </div>
            <div class="lg:col-span-4">
              <div style="height:480px;">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/BFewz4T-2nI?si=2CR7PZZascpuIvpI"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  style="border-top-right-radius:100px;"
                  allowfullscreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- ornament circles -->
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute -top-10 -left-10 w-56 h-56 rounded-full bg-linear-to-br from-amber-200/40 to-transparent blur-xl"></div>
        <div class="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-linear-to-tr from-blue-300/30 to-transparent blur-2xl"></div>
        <div class="absolute top-1/2 left-12 w-40 h-40 rounded-full bg-linear-to-tr from-sky-200/30 to-transparent blur-xl"></div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const innovations = [
  {
    title: 'Prolanis – One Stop Service Pengelolaan Hipertensi dan Diabetes Melitus di Puskesmas Talagabodas Kota Bandung',
    image: 'https://jippnas.menpan.go.id/storage/images/inovasi/2497/img_1.png',
    institution: 'Pemerintah Kota Bandung',
    link: 'https://jippnas.menpan.go.id/inovasi/2497'
  },
  {
    title: 'Pengembangan Klinik Konsultasi Agribisnis',
    image: 'https://jippnas.menpan.go.id/storage/images/inovasi/img_1/338/BVB2Tbw0vWsxlSRTkOiWYwsWtlrP1ESi9EqJS4Wn.jpg',
    institution: 'Pemerintah Kabupaten gunungkidul',
    link: 'https://jippnas.menpan.go.id/inovasi/338'
  },
  {
    title: 'Inovasi Pelayanan Prima Bandara',
    image: 'https://jippnas.menpan.go.id/storage/images/inovasi/2518/img_1.png',
    institution: 'PT Angkasa Pura I (Persero)',
    link: 'https://jippnas.menpan.go.id/inovasi/2518'
  },
  {
    title: '(IKAN DORI) Inovasi Pendidikan dan Pelatihan On site Diversifikasi Olahan Rumput Laut dan Ikan di daerah pesisir',
    image: 'https://jippnas.menpan.go.id/storage/images/inovasi/img_1/2697/naJI1uZbWCcg0iun2xiJesRmNZUbTHfvMPVhGlXb.png',
    institution: 'Kementerian Perindustrian',
    link: 'https://jippnas.menpan.go.id/inovasi/2697'
  },
  {
    title: 'Smart Cloud',
    image: 'https://jippnas.menpan.go.id/storage/images/inovasi/img_1/275/ROUhUaXxk0y8q6wtBjDPwXC69tLHwwgkFh0y8B1p.png',
    institution: 'Pemerintah Kota bima',
    link: 'https://jippnas.menpan.go.id/inovasi/275'
  }
];
</script>

<style scoped>
.bg-top {
  position: relative;
  overflow: hidden;
  background: url('/vektor.jpg') no-repeat top center / contain;
}
.bg-top::before,
.bg-top::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  mix-blend-mode: screen;
}
.bg-top::before {
  top: -80px;
  left: 20%;
  width: 260px;
  height: 260px;
  background: radial-gradient(circle at center, rgba(255, 200, 120, 0.35), transparent 70%);
  filter: blur(4px);
}
.bg-top::after {
  bottom: -100px;
  right: 10%;
  width: 320px;
  height: 320px;
  background: radial-gradient(circle at center, rgba(125, 200, 255, 0.35), transparent 70%);
  filter: blur(6px);
}
</style>