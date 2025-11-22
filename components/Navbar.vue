<template>
  <nav class="fixed top-0 left-0 right-0 w-full flex justify-between items-center px-4 sm:px-10 py-3 bg-[#C2E7F6] shadow-lg backdrop-blur-md font-poppins z-9999999 border-b-4 border-yellow-600">
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
            <!-- Show login/register buttons when not logged in -->
            <template v-if="!isLoggedIn">
              <button
                class="btn bg-linear-to-r from-blue-600 via-blue-500 to-blue-700 text-white rounded-full px-6 py-2.5 shadow-lg hover:shadow-xl hover:from-blue-600 hover:via-blue-600 hover:to-blue-800 transition-all duration-300 font-medium border border-amber-300/60 flex items-center gap-2 group"
                id="myBtnReg"
                @click="showRegisterModal = true"
              >
                <svg class="h-5 w-5 transition duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                </svg>
                <span class="tracking-wide">Daftar</span>
              </button>
              <button
                class="btn border-2 border-amber-400 rounded-full px-6 py-2.5 text-blue-700 bg-linear-to-r from-white to-amber-50/40 shadow-md hover:shadow-lg hover:from-amber-50 hover:to-amber-100 transition-all duration-300 font-medium flex items-center gap-2 group"
                id="myBtnLog"
                @click="showLoginModal = true"
              >
                <svg class="h-5 w-5 text-blue-600 transition duration-300 group-hover:text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                </svg>
                <span class="tracking-wide">Masuk</span>
              </button>
            </template>

            <!-- Show user info and logout when logged in -->
            <template v-else>
              <div class="flex items-center gap-3">
                <div class="text-right">
                  <p class="text-sm font-medium text-blue-800">{{ user.name }}</p>
                  <p class="text-xs text-blue-600">{{ user.email }}</p>
                </div>
                <button
                  @click="handleLogout"
                  class="btn border-2 border-red-400 rounded-full px-4 py-2 text-red-700 bg-linear-to-r from-white to-red-50/40 shadow-md hover:shadow-lg hover:from-red-50 hover:to-red-100 transition-all duration-300 font-medium flex items-center gap-2"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  <span class="tracking-wide">Keluar</span>
                </button>
              </div>
            </template>
          </div>
        </div>

        <!-- Mobile Toggle -->
        <button
          class="btn btn-ghost lg:hidden mt-2 rounded-full text-blue-700 hover:bg-blue-100/70 hover:ring-1 hover:ring-amber-300/60 transition-all"
          type="button"
          @click="toggleMenu"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h8m-8 6h16'"/>
          </svg>
        </button>

        <!-- Navigation Menu -->
        <div
          class="w-full lg:flex lg:justify-center lg:mt-4"
          :class="{
            'hidden': !menuOpen,
            'block': menuOpen,
            'fixed inset-0 z-50 bg-white/95 backdrop-blur-sm lg:relative lg:inset-auto lg:bg-transparent lg:backdrop-blur-none': menuOpen && window.innerWidth < 1024
          }"
          id="navbarSupportedContent"
        >
          <div class="lg:hidden absolute top-4 right-4">
            <button
              v-if="menuOpen"
              class="btn btn-ghost rounded-full text-blue-700 hover:bg-blue-100/70"
              @click="toggleMenu"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <ul class="flex flex-col lg:flex-row lg:flex-wrap justify-center mt-12 lg:mt-4 mb-4 lg:mb-0 space-y-4 lg:space-y-0 lg:space-x-6 text-blue-700 font-medium tracking-wide px-4 lg:px-0 text-2xl">
            <!-- dynamic NavItems with underline -->
            <li
              v-for="item in navItems"
              :key="item.href"
              class="relative px-1 text-center lg:text-left"
            >
              <NavItem
                :icon="item.icon"
                :label="item.label"
                :href="item.href"
                :active="isActive(item.href)"
                @click="menuOpen = false"
              />
              <span
                class="absolute left-0 right-0 -bottom-2 mx-auto h-[3px] bg-linear-to-r from-amber-300 to-amber-400 rounded-full transition-all duration-300"
                :class="isActive(item.href) ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'"
              ></span>
            </li>

            <!-- dropdowns (tanpa underline khusus) -->
            <li class="text-center lg:text-left">
              <NavDropdown label="Knowledge Center" :items="menuKnowledge" />
            </li>
            <li class="text-center lg:text-left">
              <NavDropdown label="Tautan Terkait" :items="linksTerkait" />
            </li>
            <li class="text-center lg:text-left">
              <NavDropdown label="Bantuan" :items="menuBantuan" />
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Login Modal -->
    <div v-if="showLoginModal" class="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md relative transform transition-all duration-300 ease-out p-8">
        <!-- Close button -->
        <button
          @click="showLoginModal = false"
          class="absolute top-4 right-4 btn btn-ghost btn-sm rounded-full text-gray-400 hover:text-gray-600"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-blue-700 mb-2">Masuk ke Akun</h2>
          <p class="text-gray-600">Silakan masuk untuk melanjutkan</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email/Username Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email atau Username</label>
            <input
              v-model="loginForm.email"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Masukkan email atau username"
            />
          </div>

          <!-- Password Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Kata Sandi</label>
            <input
              v-model="loginForm.password"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Masukkan kata sandi"
            />
          </div>

          <!-- Forgot Password Link -->
          <div class="text-right">
            <a href="#" class="text-sm text-blue-600 hover:text-blue-800 hover:underline">
              Lupa Kata Sandi?
            </a>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Masuk
          </button>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">atau</span>
            </div>
          </div>

          <!-- Google Login Button -->
          <button
            type="button"
            @click="handleGoogleLogin"
            class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Masuk dengan Google
          </button>

          <!-- Back Button -->
          <button
            type="button"
            @click="showLoginModal = false"
            class="w-full mt-4 text-gray-600 hover:text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Kembali
          </button>
        </form>
      </div>
    </div>

    <!-- Register Modal -->
    <div v-if="showRegisterModal" class="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md relative transform transition-all duration-300 ease-out p-8">
        <!-- Close button -->
        <button
          @click="showRegisterModal = false"
          class="absolute top-4 right-4 btn btn-ghost btn-sm rounded-full text-gray-400 hover:text-gray-600"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-blue-700 mb-2">Buat Akun Baru</h2>
          <p class="text-gray-600">Bergabunglah dengan komunitas inovasi</p>
        </div>

        <!-- Register Form -->
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Name Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
            <input
              v-model="registerForm.name"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          <!-- Email Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              v-model="registerForm.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Masukkan alamat email"
            />
          </div>

          <!-- Password Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Kata Sandi</label>
            <input
              v-model="registerForm.password"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Masukkan kata sandi"
            />
          </div>

          <!-- Register Button -->
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Daftar
          </button>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">atau</span>
            </div>
          </div>

          <!-- Google Register Button -->
          <button
            type="button"
            @click="handleGoogleRegister"
            class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Daftar dengan Google
          </button>

          <!-- Back Button -->
          <button
            type="button"
            @click="showRegisterModal = false"
            class="w-full mt-4 text-gray-600 hover:text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Kembali
          </button>
        </form>
      </div>
    </div>
  </nav>
</template>

<script setup>

const menuOpen = ref(false);
const toggleMenu = () => (menuOpen.value = !menuOpen.value);

// Auth composable
const { isLoggedIn, user, logout } = useAuth();

import { watch } from 'vue';

// Watch login state and update UI immediately
watch(isLoggedIn, (val) => {
  if (val) {
    showLoginModal.value = false;
    loginForm.value = { email: '', password: '' };
  }
});

// Login modal state
const showLoginModal = ref(false);
const loginForm = ref({
  email: '',
  password: ''
});

// Register modal state
const showRegisterModal = ref(false);
const registerForm = ref({
  name: '',
  email: '',
  password: ''
});

// Login handlers
import { useRouter } from 'vue-router';
const router = useRouter();
import { useLogin } from '~/composables/useLogin';
const { handleLogin: apiLogin, user: apiUser, error: loginError, loading: loginLoading } = useLogin();

const handleLogin = async () => {
  if (loginForm.value.email && loginForm.value.password) {
    await apiLogin({ email: loginForm.value.email, password: loginForm.value.password });
    if (apiUser.value && apiUser.value.role) {
      // Use auth composable
      const { login } = useAuth();
      login(apiUser.value);
      showLoginModal.value = false;
      loginForm.value = { email: '', password: '' };
      alert('Login berhasil!');
      router.push(`/${apiUser.value.role}`);
    } else {
      alert(loginError.value || 'Login gagal!');
    }
  } else {
    alert('Harap isi semua field!');
  }
};

const handleGoogleLogin = () => {
  // Handle Google login logic here
  console.log('Google login attempt');
};

// Register handlers
const handleRegister = () => {
  // Handle register logic here
  console.log('Register attempt:', registerForm.value);

  // Mock registration - in real app, this would call an API
  if (registerForm.value.name && registerForm.value.email && registerForm.value.password) {
    const userData = {
      id: Date.now(), // Mock ID
      name: registerForm.value.name,
      email: registerForm.value.email
    };

    // Use auth composable
    const { login } = useAuth();
    login(userData);

    // Close modal and reset form
    showRegisterModal.value = false;
    registerForm.value = { name: '', email: '', password: '' };

    // Show success message
    alert('Registrasi berhasil!');
  } else {
    alert('Harap isi semua field!');
  }
};

const handleGoogleRegister = () => {
  // Handle Google register logic here
  console.log('Google register attempt');
};

// Logout handler
const handleLogout = () => {
  const { logout } = useAuth();
  logout();
  alert('Anda telah logout!');
};

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

const menuKnowledge = [
  { label: "LMS", href: "/course" },
  { label: "Forum Diskusi", href: "/forum" },
  { label: "Event/Webinar", href: "/event" }
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
