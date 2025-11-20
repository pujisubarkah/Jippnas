<template>
  <nav class="bg-gradient-to-r from-blue-50 via-sky-50 to-amber-50/50 backdrop-blur-sm shadow-[0_4px_16px_-4px_rgba(30,64,175,0.25)] font-sans border-b border-blue-300/70 relative">
    <!-- decorative gold line -->
    <div class="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-amber-300/60 to-transparent pointer-events-none"></div>
    <div class="container mx-auto px-4">
      <div class="flex flex-wrap justify-center items-center mt-2 py-4">
        <!-- Logo (underline if home active) -->
        <div class="w-full md:w-1/4 text-left relative">
          <img
            src="https://jippnas.menpan.go.id/storage/images/about/logo_ds/1/W8NHqNH4si2HA7dfVmFU2PaVLBtqwUz2t850znX2.png"
            class="my-1 max-h-16 object-contain rounded-lg transition hover:opacity-90"
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
                class="input input-bordered bg-white text-blue-800 caret-blue-600 border border-blue-300 w-full pl-11 pr-4 py-2.5 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 hover:shadow-md transition-colors duration-200 placeholder:text-blue-600/80 placeholder:font-medium"
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
          <div class="flex justify-center items-center my-1 space-x-3">
            <button
              class="btn bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white rounded-full px-6 py-2.5 shadow-lg hover:shadow-xl hover:from-blue-600 hover:via-blue-600 hover:to-blue-800 transition-all duration-300 font-medium border border-amber-300/60 flex items-center gap-2 group"
              id="myBtnReg"
            >
              <svg class="h-5 w-5 transition duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
              </svg>
              <span class="tracking-wide">Daftar</span>
            </button>
            <button
              class="btn border-2 border-amber-400 rounded-full px-6 py-2.5 text-blue-700 bg-gradient-to-r from-white to-amber-50/40 shadow-md hover:shadow-lg hover:from-amber-50 hover:to-amber-100 transition-all duration-300 font-medium flex items-center gap-2 group"
              id="myBtnLog"
            >
              <svg class="h-5 w-5 text-blue-600 transition duration-300 group-hover:text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
              </svg>
              <span class="tracking-wide">Masuk</span>
            </button>
          </div>
        </div>

        <!-- Mobile Toggle -->
        <button
          class="btn btn-ghost lg:hidden mt-2 rounded-full text-blue-700 hover:bg-blue-100/70 hover:ring-1 hover:ring-amber-300/60 transition-all"
          type="button"
          @click="toggleMenu"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16"/>
          </svg>
        </button>

        <!-- Navigation Menu -->
        <div
          class="w-full lg:flex lg:justify-center lg:mt-4"
          :class="{ hidden: !menuOpen, block: menuOpen }"
          id="navbarSupportedContent"
        >
          <ul class="flex flex-wrap justify-center mt-4 mb-4 lg:mb-0 space-x-6 text-blue-700 font-medium tracking-wide">
            <!-- dynamic NavItems with underline -->
            <li
              v-for="item in navItems"
              :key="item.href"
              class="relative px-1"
            >
              <NavItem
                :icon="item.icon"
                :label="item.label"
                :href="item.href"
                :active="isActive(item.href)"
              />
              <span
                class="absolute left-0 right-0 -bottom-2 mx-auto h-[3px] bg-gradient-to-r from-amber-300 to-amber-400 rounded-full transition-all duration-300"
                :class="isActive(item.href) ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'"
              ></span>
            </li>

            <!-- dropdowns (tanpa underline khusus) -->
            <NavDropdown label="Tautan Terkait" :items="linksTerkait" />
            <NavItem icon="info" label="Tentang JIPPNAS" href="/tentang" :active="isActive('/tentang')" />
            <NavDropdown label="Bantuan" :items="menuBantuan" />
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
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

const navItems = [
  { icon: "home", label: "Beranda", href: "/" },
  { icon: "folder", label: "Etalase Inovasi", href: "/etalase" },
  { icon: "map", label: "Inovasi Dekat Saya", href: "/dekatsaya" },
  { icon: "news", label: "Berita", href: "/berita" }
];

// SSR-safe route handling
const route = useRoute();
const normalize = (p) => (p ? p.replace(/\/+$/, "") : "");
const currentPath = computed(() => normalize(route?.path || ""));
const isActive = (href) => currentPath.value === normalize(href);
</script>
