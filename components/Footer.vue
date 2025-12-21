<template>
  <footer class="bg-primary text-on-primary w-full border-t-4 border-yellow-600 shadow-lg backdrop-blur-md font-poppins relative overflow-hidden text-base md:text-lg">
    <!-- ornaments -->
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute -top-10 -left-10 w-56 h-56 rounded-full bg-blue-200/30 blur-2xl"></div>
      <div class="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-amber-200/30 blur-3xl"></div>
    </div>
    <div class="w-full px-4">
      <div class="flex flex-col lg:flex-row">
        <!-- Logo Section -->
        <div class="w-full lg:w-1/4 p-4 flex justify-start items-center lg:pr-6">
          <img
            src="https://jippnas.menpan.go.id/storage/images/about/logo_ds/1/W8NHqNH4si2HA7dfVmFU2PaVLBtqwUz2t850znX2.png"
            alt="Logo"
            class="max-w-[220px] max-h-20 hidden md:block object-contain md:ml-4 lg:ml-6"
            width="220"
            height="80"
          />
        </div>

        <!-- Main Content -->
        <div class="w-full lg:w-3/4 p-4">
          <h5 class="text-center font-extrabold text-3xl md:text-4xl my-4 text-on-primary relative">
            Pemangku Kepentingan JIPPNAS
            <span class="block mx-auto mt-2 h-1 w-32 bg-linear-to-r from-amber-300 via-amber-400 to-amber-300 rounded-full"></span>
          </h5>

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

          <hr class="border-t border-amber-300/60 my-6 w-full">

          <!-- Links Section -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
            <!-- Tentang Kami -->
            <div class="rounded-2xl bg-surface/70 backdrop-blur p-4 shadow-sm hover:shadow-md transition border border-amber-300/60">
              <h4 class="font-bold text-on-primary mb-2 text-lg md:text-xl">Tentang Kami</h4>
              <div class="flex flex-col text-sm md:text-base font-normal">
                <a href="https://www.kemendagri.go.id" target="_blank" class="text-on-primary mb-2 hover:text-amber-300 hover:underline underline-offset-4">Kementerian Dalam Negeri</a>
                <a href="https://menpan.go.id" target="_blank" class="text-on-primary mb-2 hover:text-amber-300 hover:underline underline-offset-4">Kementerian Pendayagunaan Aparatur Negara</a>
                <a href="https://lan.go.id" target="_blank" class="text-on-primary mb-2 hover:text-amber-300 hover:underline underline-offset-4">Lembaga Administrasi Negara</a>
              </div>
            </div>

            <!-- Jelajahi -->
            <div class="rounded-2xl bg-surface/70 backdrop-blur p-4 shadow-sm hover:shadow-md transition border border-amber-300/60">
              <h4 class="font-bold text-on-primary mb-2 text-lg md:text-xl">Jelajahi</h4>
              <div class="flex flex-col text-sm md:text-base font-normal">
                <NuxtLink to="/" class="text-on-primary mb-2 hover:text-amber-300 hover:underline underline-offset-4">Beranda</NuxtLink>
                <NuxtLink to="/etalase" class="text-on-primary mb-2 hover:text-amber-300 hover:underline underline-offset-4">Etalase Inovasi</NuxtLink>
                <NuxtLink to="/berita" class="text-on-primary mb-2 hover:text-amber-300 hover:underline underline-offset-4">Berita</NuxtLink>
              </div>
            </div>

            <!-- Hubungi Kami -->
            <div class="rounded-2xl bg-surface/70 backdrop-blur p-4 shadow-sm hover:shadow-md transition border border-amber-300/60">
              <h4 class="font-bold text-on-primary mb-2 text-lg md:text-xl">Hubungi Kami</h4>
              <div class="flex flex-col text-sm md:text-base">
                <a href="tel:+6221739838189" class="text-on-primary mb-2 hover:text-amber-300 hover:underline underline-offset-4">
                  <i class="fas fa-phone mr-2"></i>(+6221) 7398381 - 89
                </a>
                <a href="mailto:halomenpan@menpan.go.id" target="_blank" class="text-on-primary mb-2 hover:text-amber-300 hover:underline underline-offset-4">
                  <i class="fas fa-envelope mr-2"></i>halomenpan@menpan.go.id
                </a>
                <a href="https://g.co/kgs/hc7VCVY" target="_blank" class="text-on-primary mb-2 hover:text-amber-300 hover:underline underline-offset-4">
                  <i class="fas fa-map-marker-alt mr-2"></i>Jl. Jend. Sudirman Kav. 69 Jakarta Selatan - 12190
                </a>
              </div>
            </div>

            <!-- Ikuti Kami -->
            <div class="rounded-2xl bg-surface/70 backdrop-blur p-4 shadow-sm hover:shadow-md transition border border-amber-300/60">
              <h4 class="font-bold text-on-primary mb-2 text-lg md:text-xl">Ikuti Kami</h4>
              <div class="text-sm md:text-base">
                <a href="https://www.youtube.com/@sinovikkementerianpanrb4983" target="_blank" class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface/80 backdrop-blur ring-1 ring-amber-300/60 hover:ring-amber-400 transition shadow-sm">
                  <i class="fab fa-youtube text-red-500 text-2xl"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full bg-linear-to-r from-blue-700 to-blue-800">
      <div class="max-w-7xl mx-auto">
        <div class="flex">
          <div class="w-full text-center lg:text-left pt-2 pb-2 mb-2 lg:mb-0">
            <p class="m-0 text-center text-white text-base md:text-lg">Hak Cipta(C)2022 - 2025 Etalase Pelayanan Publik dari Seluruh Daerah di Indonesia | Privacy Policy</p>
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