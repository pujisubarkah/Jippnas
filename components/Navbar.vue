<template>
  <!-- 🔑 Critical for height sync -->
  <v-app-bar
    app
    elevation="2"
    color="white"
    class="navbar-custom"
    height="auto"
    ref="navbarRef"
  >
    <v-container fluid class="pa-0">
      <!-- Top Row: Logo, Search, and Auth -->
      <div class="d-flex align-center justify-space-between px-6 py-3 top-section">
        <!-- Logo -->
        <NuxtLink to="/" class="logo-container shrink-0">
          <v-img
            src="https://jippnas.menpan.go.id/storage/images/about/logo_ds/1/W8NHqNH4si2HA7dfVmFU2PaVLBtqwUz2t850znX2.png"
            :width="200"
            :height="60"
            contain
            class="logo-img"
            alt="JIPPNAS Logo"
          />
        </NuxtLink>

        <!-- Search Bar (Desktop only) -->
        <div class="d-none d-lg-flex grow mx-6 search-container">
          <div class="relative w-full">
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              class="search-input w-full pl-12 pr-4 py-2.5 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:shadow-md transition-all duration-200"
              type="search"
              :placeholder="$t('search.placeholder')"
              :aria-label="$t('search.placeholder')"
            />
            <svg
              class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <!-- Auth Buttons -->
        <div class="d-flex align-center gap-2 shrink-0">
          <!-- Language Switcher -->
          <v-btn
            icon
            variant="text"
            color="primary"
            class="mx-1"
            @click="switchLanguage"
            :aria-label="'Switch Language'"
          >
            <v-icon>{{ locale === 'id' ? 'mdi-translate' : 'mdi-translate-off' }}</v-icon>
          </v-btn>

          <!-- Google Translate Widget -->
          <ClientOnly>
            <div id="google_translate_element" class="mr-2"></div>
          </ClientOnly>

          <template v-if="!isLoggedIn">
            <v-btn
              variant="outlined"
              color="primary"
              @click="showLoginModal = true"
              size="default"
              class="px-4 d-none d-md-flex"
            >
              <v-icon start>mdi-login</v-icon>
              {{ $t('auth.login') }}
            </v-btn>
            <v-btn
              variant="flat"
              color="primary"
              @click="showRegisterModal = true"
              size="default"
              class="px-4 d-none d-md-flex"
            >
              <v-icon start>mdi-account-plus</v-icon>
              {{ $t('auth.register') }}
            </v-btn>
          </template>

          <!-- User Menu -->
          <v-menu v-else offset-y>
            <template #activator="{ props }">
              <v-btn
                variant="outlined"
                v-bind="props"
                color="primary"
                size="default"
                class="px-3 d-none d-md-flex"
              >
                <v-icon start>mdi-account-circle</v-icon>
                {{ $t('auth.welcome') }} {{ user?.name || user?.username || $t('header.user') }}
                <v-icon end size="small">mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title class="font-weight-bold">{{ $t('auth.welcome') }} {{ user?.name || user?.username || $t('header.user') }}</v-list-item-title>
                <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
              </v-list-item>
              <v-divider />
              <v-list-item @click="handleLogout">
                <template #prepend>
                  <v-icon>mdi-logout</v-icon>
                </template>
                <v-list-item-title>{{ $t('auth.logout') }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <!-- Mobile Menu Toggle -->
          <v-app-bar-nav-icon
            class="d-lg-none ml-2"
            @click="drawer = !drawer"
            color="primary"
          />
        </div>
      </div>

      <!-- Mobile Search Bar -->
      <div class="d-lg-none px-6 py-3 search-section-mobile">
        <div class="relative">
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            class="search-input w-full pl-12 pr-4 py-2.5 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:shadow-md transition-all duration-200"
            type="search"
            placeholder="Cari Inovasi..."
            aria-label="Cari Inovasi"
          />
          <svg
            class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Bottom Row: Navigation Menu -->
      <div class="d-none d-lg-flex align-center justify-center px-4 py-2 nav-section">
        <v-btn
          v-for="item in navItems"
          :key="item.href"
          :to="item.href"
          variant="text"
          :active="isActive(item.href)"
          class="nav-link mx-1"
          color="primary"
          size="default"
        >
          {{ item.label }}
        </v-btn>

        <v-menu offset-y>
          <template #activator="{ props }">
            <v-btn variant="text" v-bind="props" class="nav-link mx-1" color="primary">
              Knowledge Center
              <v-icon end size="small">mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="item in menuKnowledge"
              :key="item.href"
              :to="item.href"
            >
              <v-list-item-title>{{ item.label }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-menu offset-y>
          <template #activator="{ props }">
            <v-btn variant="text" v-bind="props" class="nav-link mx-1" color="primary">
              Tautan Terkait
              <v-icon end size="small">mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="item in linksTerkait"
              :key="item.href"
              :href="item.href"
              target="_blank"
            >
              <v-list-item-title>{{ item.label }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-menu offset-y>
          <template #activator="{ props }">
            <v-btn variant="text" v-bind="props" class="nav-link mx-1" color="primary">
              Bantuan
              <v-icon end size="small">mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="item in menuBantuan"
              :key="item.href"
              :to="item.href"
            >
              <v-list-item-title>{{ item.label }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-divider vertical class="mx-3" />

        <v-btn
          icon
          variant="text"
          @click="$emit('toggle-sidebar')"
          class="mx-1"
          color="primary"
        >
          <v-icon>{{ props.sidebarOpen ? 'mdi-menu-open' : 'mdi-menu' }}</v-icon>
        </v-btn>
      </div>
    </v-container>

    <!-- Mobile Drawer -->
    <v-navigation-drawer v-model="drawer" temporary app width="300">
      <v-list>
        <v-list-item
          v-for="item in navItems"
          :key="item.href"
          :to="item.href"
          @click="drawer = false"
        >
          <template #prepend>
            <v-icon :icon="item.icon" />
          </template>
          <v-list-item-title>{{ item.label }}</v-list-item-title>
        </v-list-item>

        <v-divider />

        <v-list-group value="Knowledge Center">
          <template #activator="{ props }">
            <v-list-item v-bind="props">
              <template #prepend>
                <v-icon>mdi-book-open</v-icon>
              </template>
              <v-list-item-title>Knowledge Center</v-list-item-title>
            </v-list-item>
          </template>
          <v-list-item
            v-for="item in menuKnowledge"
            :key="item.href"
            :to="item.href"
            @click="drawer = false"
          >
            <v-list-item-title>{{ item.label }}</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-group value="Tautan Terkait">
          <template #activator="{ props }">
            <v-list-item v-bind="props">
              <template #prepend>
                <v-icon>mdi-link</v-icon>
              </template>
              <v-list-item-title>Tautan Terkait</v-list-item-title>
            </v-list-item>
          </template>
          <v-list-item
            v-for="item in linksTerkait"
            :key="item.href"
            :href="item.href"
            target="_blank"
            @click="drawer = false"
          >
            <v-list-item-title>{{ item.label }}</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-group value="Bantuan">
          <template #activator="{ props }">
            <v-list-item v-bind="props">
              <template #prepend>
                <v-icon>mdi-help-circle</v-icon>
              </template>
              <v-list-item-title>Bantuan</v-list-item-title>
            </v-list-item>
          </template>
          <v-list-item
            v-for="item in menuBantuan"
            :key="item.href"
            :to="item.href"
            @click="drawer = false"
          >
            <v-list-item-title>{{ item.label }}</v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <!-- Modals (unchanged structure, cleaned internals) -->
    <v-dialog v-model="showLoginModal" max-width="500">
      <v-card>
        <v-card-title class="text-h5">
          <v-icon start>mdi-login</v-icon>
          Masuk ke Akun
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="loginForm.email"
              label="Email atau Username"
              required
              prepend-icon="mdi-email"
            />
            <v-text-field
              v-model="loginForm.password"
              label="Kata Sandi"
              type="password"
              required
              prepend-icon="mdi-lock"
            />
            <v-btn type="submit" color="primary" block class="mt-4" :loading="loginLoading">
              Masuk
            </v-btn>
          </v-form>
          <v-divider class="my-4">atau</v-divider>
          <v-btn
            variant="outlined"
            color="red"
            block
            prepend-icon="mdi-google"
            :disabled="googleScriptLoading"
            @click="handleGoogleLogin"
          >
            Masuk dengan Google
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showRegisterModal" max-width="500">
      <v-card>
        <v-card-title class="text-h5">
          <v-icon start>mdi-account-plus</v-icon>
          Buat Akun Baru
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handleRegister">
            <v-text-field
              v-model="registerForm.name"
              label="Nama Lengkap"
              required
              prepend-icon="mdi-account"
            />
            <v-text-field
              v-model="registerForm.email"
              label="Email"
              type="email"
              required
              prepend-icon="mdi-email"
            />
            <v-text-field
              v-model="registerForm.password"
              label="Kata Sandi"
              type="password"
              required
              prepend-icon="mdi-lock"
            />
            <v-text-field
              v-model="registerForm.confirmPassword"
              label="Konfirmasi Kata Sandi"
              type="password"
              required
              prepend-icon="mdi-lock-check"
            />
            <v-btn type="submit" color="primary" block class="mt-4">
              Daftar
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app-bar>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useLogin } from '~/composables/useLogin'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'

// 🔑 Props & Emits (unchanged)
const props = defineProps({ sidebarOpen: { type: Boolean, default: true } })
const emit = defineEmits(['toggle-sidebar'])

// 🔑 Navbar ref — now used for height sync
const navbarRef = ref(null)

// Auth state
const { isLoggedIn, user, login, logout } = useAuth()
const { locale, t } = useI18n()

// Modals & Forms
const drawer = ref(false)
const showLoginModal = ref(false)
const showRegisterModal = ref(false)
const loginForm = ref({ email: '', password: '' })
const registerForm = ref({ name: '', email: '', password: '' })
const searchQuery = ref('')

// 🔑 Simplified toast helper (DRY)
const appToast = {
  success: (title, opts = {}) => toast.success(title, { position: 'top-right', duration: 4000, ...opts }),
  error: (msg, opts = {}) => toast.error(msg, { position: 'top-right', duration: 5000, ...opts }),
  warn: (msg, opts = {}) => toast.warning(msg, { position: 'top-right', duration: 3000, ...opts })
}

// 🔑 Login with API + toast cleanup
const { handleLogin: apiLogin, user: apiUser, error: loginError, loading: loginLoading } = useLogin()
const router = useRouter()

const handleLogin = async () => {
  const { email, password } = loginForm.value
  if (!email || !password) return appToast.warn('Harap isi semua field!')

  await apiLogin({ email, password })
  console.log('🔍 apiUser.value after login:', apiUser.value)
  console.log('🔍 redirectPath:', apiUser.value?.redirectPath)
  
  if (apiUser.value) {
    login(apiUser.value)
    showLoginModal.value = false
    loginForm.value = { email: '', password: '' }
    appToast.success('🎉 Login Berhasil!', { description: 'Selamat datang kembali!' })
    // Use navigateTo for better Nuxt routing
    const targetPath = apiUser.value.redirectPath || `/${apiUser.value.role}/dashboard`
    console.log('🚀 Navigating to:', targetPath)
    await navigateTo(targetPath)
  } else {
    appToast.error(loginError.value || 'Login gagal. Cek email & password.')
  }
}

// 🔑 Google Auth — SSR-safe
const googleScriptLoading = ref(false)
const loadGoogleScript = () => {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.google?.accounts) return Promise.resolve()

  return new Promise((resolve, reject) => {
    if (document.getElementById('google-client')) return resolve()

    googleScriptLoading.value = true
    const script = document.createElement('script')
    script.id = 'google-client'
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = () => {
      googleScriptLoading.value = false
      resolve()
    }
    script.onerror = () => {
      googleScriptLoading.value = false
      reject(new Error('Gagal muat Google Sign-In'))
    }
    document.head.appendChild(script)
  })
}

const handleGoogleLogin = async () => {
  try {
    await loadGoogleScript()
    if (window.google?.accounts?.id && !window.googleInitialized) {
      window.google.accounts.id.initialize({
        client_id: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
        callback: handleGoogleCallback
      })
      window.googleInitialized = true
    }
    window.google?.accounts?.id?.prompt?.()
  } catch (err) {
    console.error('Google login init failed:', err)
    appToast.error('Gagal memuat Google Sign-In')
  }
}

const handleGoogleCallback = async (response) => {
  try {
    if (!response?.credential) throw new Error('No credential')
    const res = await $fetch('/api/google-login', {
      method: 'POST',
      body: { token: response.credential }
    })
    if (res.success && res.user) {
      login(res.user)
      showLoginModal.value = false
      appToast.success('🎉 Login dengan Google Berhasil!')
      await navigateTo(`/${res.user.role}/dashboard`)
    } else throw new Error(res.error)
  } catch (err) {
    appToast.error(err.message || 'Login Google gagal')
  }
}

// 🔑 Register (mock → replace with API later)
const handleRegister = () => {
  const { name, email, password, confirmPassword } = registerForm.value
  if (!name || !email || !password) return appToast.warn('Harap isi semua field!')
  if (password !== confirmPassword) return appToast.warn('Kata sandi tidak cocok!')

  // ✅ Safe mock user
  login({ id: Date.now(), name, email })
  showRegisterModal.value = false
  registerForm.value = { name: '', email: '', password: '' }
  appToast.success('Registrasi berhasil!')
}

// 🔑 Switch Language
const switchLanguage = () => {
  locale.value = locale.value === 'id' ? 'en' : 'id'
  console.log('Language switched to:', locale.value)
  appToast.success(`Language changed to ${locale.value === 'id' ? 'Bahasa Indonesia' : 'English'}`)
}

// 🔑 Logout
const handleLogout = () => {
  logout()
  appToast.success('👋 Anda telah logout.')
}

// 🔑 Search — SPA-friendly
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value.trim() } })
  }
}

// 🔑 Nav data (moved to script for clarity)
const navItems = computed(() => [
  { icon: 'mdi-home', label: t('nav.home'), href: '/' },
  { icon: 'mdi-folder', label: t('nav.etalase'), href: '/etalase' },
  { icon: 'mdi-map-marker', label: t('nav.nearby'), href: '/dekatsaya' },
  { icon: 'mdi-newspaper', label: t('nav.berita'), href: '/berita' }
])

const menuKnowledge = computed(() => [
  { label: t('menu.knowledge.lms'), href: '/course' },
  { label: t('menu.knowledge.forum'), href: '/forum' },
  { label: t('menu.knowledge.event'), href: '/event' }
])

const linksTerkait = computed(() => [
  { label: t('menu.links.menpan'), href: 'https://menpan.go.id' },
  { label: t('menu.links.lapor'), href: 'https://lapor.go.id' },
  { label: t('menu.links.sinovik'), href: 'https://sinovik.menpan.go.id' }
])

const menuBantuan = computed(() => [
  { label: t('menu.help.model'), href: '/model' },
  { label: t('menu.help.book'), href: '/buku' },
  { label: t('menu.help.download'), href: '/unduhan' },
  { label: t('menu.help.faq'), href: '/faq' },
  { label: t('menu.help.contact'), href: '/kontak' }
])

// 🔑 Active link helper
const route = useRoute()
const normalize = (p) => p?.replace(/\/+$/, '') || ''
const currentPath = computed(() => normalize(route.path))
const isActive = (href) => currentPath.value === normalize(href)

// 🔑 🔥 HEIGHT SYNC — This is the fix for content cutoff
onMounted(() => {
  const updateHeight = () => {
    if (navbarRef.value?.$el) {
      const h = navbarRef.value.$el.offsetHeight
      document.documentElement.style.setProperty('--navbar-height', `${h}px`)
      console.log('Navbar height:', h) // Debug log
    }
  }

  // Debounced resize
  let t
  const debounced = () => {
    clearTimeout(t)
    t = setTimeout(updateHeight, 150)
  }

  // Initial update with delay to ensure DOM is ready
  setTimeout(updateHeight, 100)
  setTimeout(updateHeight, 500) // Secondary check
  
  updateHeight()
  window.addEventListener('resize', debounced)
  window.addEventListener('orientationchange', updateHeight)

  onBeforeUnmount(() => {
    window.removeEventListener('resize', debounced)
    window.removeEventListener('orientationchange', updateHeight)
  })
})
</script>

<style scoped>
/* ✅ Poppins is kept & scoped */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.navbar-custom {
  border-bottom: 3px solid #1976D2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  font-family: 'Poppins', sans-serif;
}

.logo-container {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-img {
  transition: transform 0.3s ease, opacity 0.3s ease;
  display: block;
}

.logo-img:hover {
  transform: scale(1.03);
  opacity: 0.9;
}

.top-section {
  border-bottom: 1px solid #e0e0e0;
}

.search-container {
  max-width: 600px;
}

.search-section-mobile {
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.search-input {
  border: 2px solid #e3f2fd;
  background: white;
  color: #1565c0;
  font-size: 0.9rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  caret-color: #1976D2;
}

.search-input::placeholder {
  color: #90a4ae;
  font-weight: 500;
  font-family: 'Poppins', sans-serif;
}

.search-input:focus {
  border-color: #1976D2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.nav-section {
  background: white;
}

.nav-link {
  font-family: 'Poppins', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: none;
  transition: all 0.2s ease;
  position: relative;
  padding: 8px 16px;
}

.nav-link:hover {
  background-color: rgba(25, 118, 210, 0.08);
}

.nav-link.v-btn--active {
  font-weight: 700;
}

.nav-link.v-btn--active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 3px;
  background-color: #1976D2;
  border-radius: 2px 2px 0 0;
}

@media (max-width: 1280px) {
  .search-container { max-width: 400px; }
}
@media (max-width: 960px) {
  .logo-img { width: 160px !important; height: 48px !important; }
}
@media (max-width: 600px) {
  .logo-img { width: 140px !important; height: 42px !important; }
}
.gap-2 { gap: 8px; }
</style>