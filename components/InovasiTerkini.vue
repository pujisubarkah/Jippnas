<template>
  <ClientOnly>
    <div class="container-fluid bg-top py-8">
      <div class="container mx-auto px-4">
        <div class="w-full pt-2">
          <div class="flex justify-center">
            <h3 class="text-white text-bold py-3 font-bold">Inovasi Terkini</h3>
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
  background: linear-gradient(to bottom, #1e3a8a, #3b82f6);
}
</style>