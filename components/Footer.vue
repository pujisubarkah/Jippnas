<template>
  <footer class="bg-[#C2E7F6] border-t-2 border-blue-600 text-blue-800 w-full">
    <div class="w-full px-4">
      <div class="flex flex-col lg:flex-row">
        <!-- Logo Section -->
        <div class="w-full lg:w-1/4 p-4 flex justify-start items-center lg:pr-6">
          <img
            src="https://jippnas.menpan.go.id/storage/images/about/logo_ds/1/W8NHqNH4si2HA7dfVmFU2PaVLBtqwUz2t850znX2.png"
            alt="Logo"
            class="max-w-[220px] max-h-20 hidden md:block object-contain"
            width="220"
            height="80"
          />
        </div>

        <!-- Main Content -->
        <div class="w-full lg:w-3/4 p-4">
          <h5 class="text-center font-bold text-xl my-4 text-blue-800">Pemangku Kepentingan JIPPNAS 2025</h5>

          <!-- Swiper for logos -->
          <div class="flex justify-center mb-4">
            <ClientOnly>
              <swiper
                :slides-per-view="3"
                :space-between="0"
                :autoplay="{ delay: 3000 }"
                :pagination="{ clickable: true }"
                class="w-full max-w-md"
              >
              <swiper-slide>
                <img
                  src="https://jippnas.menpan.go.id/storage/images/about/logo_pk/1/348262/5wWanmehg7HkxlRVZC7kGMSCXZA3zhJri269WmM7.png"
                  alt="Kementerian PANRB"
                  class="h-20 w-auto rounded mx-auto object-contain"
                />
              </swiper-slide>
              <swiper-slide>
                <img
                  src="https://jippnas.menpan.go.id/storage/images/about/logo_pk/1/841371/fiuy9phJzYfw4fdhcnBMNlKwkiS2Vr8Wv1ClqvRQ.png"
                  alt="Kemendagri"
                  class="h-20 w-auto rounded mx-auto object-contain"
                />
              </swiper-slide>
              <swiper-slide>
                <img
                  src="/lanri.png"
                  alt="LAN RI"
                  class="h-20 w-auto rounded mx-auto object-contain"
                />
              </swiper-slide>
              </swiper>
            </ClientOnly>
            <!-- Removed static fallback images to prevent duplicate logos on large screens; Swiper will display logos on client only -->
          </div>

          <hr class="border-t-2 border-blue-600 my-4 w-full">

          <!-- Links Section -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
            <!-- Tentang Kami -->
            <div>
              <h4 class="font-bold text-blue-800 mb-2">Tentang Kami</h4>
              <div class="flex flex-col text-xs font-normal">
                <a href="https://www.kemendagri.go.id" target="_blank" class="text-blue-800 mb-2 hover:text-blue-700">Kementerian Dalam Negeri</a>
                <a href="https://menpan.go.id" target="_blank" class="text-blue-800 mb-2 hover:text-blue-700">Kementerian Pendayagunaan Aparatur Negara</a>
                <a href="https://lan.go.id" target="_blank" class="text-blue-800 mb-2 hover:text-blue-700">Lembaga Administrasi Negara</a>
              </div>
            </div>

            <!-- Jelajahi -->
            <div>
              <h4 class="font-bold text-blue-800 mb-2">Jelajahi</h4>
              <div class="flex flex-col text-xs font-normal">
                <NuxtLink to="/" class="text-blue-800 mb-2 hover:text-blue-700">Beranda</NuxtLink>
                <NuxtLink to="/etalase" class="text-blue-800 mb-2 hover:text-blue-700">Etalase Inovasi</NuxtLink>
                <NuxtLink to="/berita" class="text-blue-800 mb-2 hover:text-blue-700">Berita</NuxtLink>
              </div>
            </div>

            <!-- Hubungi Kami -->
            <div>
              <h4 class="font-bold text-blue-800 mb-2">Hubungi Kami</h4>
              <div class="flex flex-col text-xs">
                <a href="tel:+6221739838189" class="text-blue-800 mb-2 hover:text-blue-700">
                  <i class="fas fa-phone mr-2"></i>(+6221) 7398381 - 89
                </a>
                <a href="mailto:halomenpan@menpan.go.id" target="_blank" class="text-blue-800 mb-2 hover:text-blue-700">
                  <i class="fas fa-envelope mr-2"></i>halomenpan@menpan.go.id
                </a>
                <a href="https://g.co/kgs/hc7VCVY" target="_blank" class="text-blue-800 mb-2 hover:text-blue-700">
                  <i class="fas fa-map-marker-alt mr-2"></i>Jl. Jend. Sudirman Kav. 69 Jakarta Selatan - 12190
                </a>
              </div>
            </div>

            <!-- Ikuti Kami -->
            <div>
              <h4 class="font-bold text-blue-800 mb-2">Ikuti Kami</h4>
              <div class="text-xs">
                <a href="https://www.youtube.com/@sinovikkementerianpanrb4983" target="_blank" class="text-blue-800 inline-block mx-1 pt-2">
                  <i class="fab fa-youtube text-blue-600 text-3xl"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full bg-blue-800">
      <div class="max-w-7xl mx-auto">
        <div class="flex">
          <div class="w-full text-center lg:text-left pt-2 pb-2 mb-2 lg:mb-0">
            <p class="m-0 text-center text-white">Hak Cipta(C)2022 - 2025 Etalase Pelayanan Publik dari Seluruh Daerah di Indonesia | Privacy Policy</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'
</script>