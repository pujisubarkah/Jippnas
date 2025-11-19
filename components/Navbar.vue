<template>
  <nav class="bg-[#C2E7F6] shadow-lg font-sans border-b-2 border-blue-600">
    <div class="container mx-auto px-4">
      <div class="flex flex-wrap justify-center items-center mt-2 py-4">
        <!-- Logo -->
        <div class="w-full md:w-1/4 text-left">
          <img
            src="https://jippnas.menpan.go.id/storage/images/about/logo_ds/1/W8NHqNH4si2HA7dfVmFU2PaVLBtqwUz2t850znX2.png"
            class="img img-responsive my-1 max-h-16 object-contain rounded-lg shadow-sm"
            alt="Logo"
          />
        </div>

        <!-- Search -->
        <div class="w-full md:w-5/12 text-center px-4">
          <form
            action="https://jippnas.menpan.go.id/searchs"
            class="form-group mt-1"
            id="filter_form"
            method="post"
            enctype="multipart/form-data"
          >
            <input type="hidden" name="_token" value="TOKEN_DIISI_SERVER" />
            <div class="relative">
              <input
                class="input input-bordered bg-white border-blue-600 w-full pl-10 pr-4 py-2 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="search"
                id="mySearch"
                name="search"
                placeholder="Cari Inovasi"
                aria-label="Search"
              />
              <svg
                class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </form>
        </div>

        <!-- Buttons -->
        <div class="w-full md:w-1/4 text-center">
          <div class="flex justify-center items-center my-1 space-x-2">
            <button
              class="btn bg-blue-700 text-white rounded-full px-6 py-2 shadow-md hover:bg-blue-800 transition duration-300"
              id="myBtnReg"
            >
              Daftar
            </button>
            <button
              class="btn border border-blue-600 rounded-full px-6 py-2 text-blue-700 bg-white shadow-md hover:bg-blue-50 transition duration-300"
              id="myBtnLog"
            >
              Masuk
            </button>
          </div>
        </div>

        <!-- Mobile Toggle -->
        <button
          class="btn btn-ghost lg:hidden mt-2 rounded-full text-blue-800 hover:bg-blue-50"
          type="button"
          @click="toggleMenu"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </button>

        <!-- Navigation Menu -->
        <div
          class="w-full lg:flex lg:justify-center lg:mt-4"
          :class="{ hidden: !menuOpen, block: menuOpen }"
          id="navbarSupportedContent"
        >
          <ul class="flex flex-wrap justify-center mt-4 mb-4 lg:mb-0 space-x-6">
            <NavItem icon="home" label="Beranda" href="/" active />
            <NavItem icon="folder" label="Etalase Inovasi" href="/etalase" />
            <NavItem icon="map" label="Inovasi Dekat Saya" href="/dekatsaya" />
            <NavItem icon="news" label="Berita" href="/berita" />

            <NavDropdown label="Tautan Terkait" :items="linksTerkait" />
            <NavItem icon="info" label="Tentang JIPPNAS" href="/tentang" />
            <NavDropdown label="Bantuan" :items="menuBantuan" />
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import NavItem from "./NavItem.vue";
import NavDropdown from "./NavDropdown.vue";

const menuOpen = ref(false);
const toggleMenu = () => (menuOpen.value = !menuOpen.value);

const linksTerkait = [
  { label: "web menpan testing", href: "#" },
  { label: "LAPOR!", href: "#" },
  { label: "testing web sinovik", href: "#" }
];

const menuBantuan = [
  { label: "MODEL INOVASI", href: "/model" },
  { label: "BUKU INOVASI", href: "/buku" },
  { label: "UNDUHAN", href: "/unduhan" },
  { label: "FAQ", href: "/faq" },
  { label: "HUBUNGI KAMI", href: "/kontak" }
];
</script>
