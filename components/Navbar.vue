<template>
  <v-app-bar app elevation="1" color="white" class="navbar-custom font-poppins" height="80">
    <v-container fluid class="d-flex align-center pa-0 px-4">
      <!-- Logo -->
      <v-toolbar-title class="d-flex align-center">
        <v-img
          src="https://jippnas.menpan.go.id/storage/images/about/logo_ds/1/W8NHqNH4si2HA7dfVmFU2PaVLBtqwUz2t850znX2.png"
          max-width="200"
          max-height="65"
          contain
          class="logo-hover cursor-pointer"
          alt="JIPPNAS Logo"
        />
      </v-toolbar-title>

      <v-spacer />

      <!-- Navigation Menu for Desktop - Inline -->
      <div class="hidden-md-and-down d-flex align-center">
        <v-btn
          v-for="item in navItems"
          :key="item.href"
          :to="item.href"
          variant="text"
          :active="isActive(item.href)"
          class="nav-link"
          color="primary"
        >
          {{ item.label }}
        </v-btn>

        <v-menu offset-y>
          <template #activator="{ props }">
            <v-btn variant="text" v-bind="props" class="nav-link" color="primary">
              Knowledge Center
              <v-icon end size="small">mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="item in menuKnowledge"
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
            <v-btn variant="text" v-bind="props" class="nav-link" color="primary">
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
            <v-btn variant="text" v-bind="props" class="nav-link" color="primary">
              Bantuan
              <v-icon end size="small">mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="item in menuBantuan"
              :key="item.href"
              :href="item.href"
              target="_blank"
            >
              <v-list-item-title>{{ item.label }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-divider vertical class="mx-3" thickness="2" />

        <!-- Sidebar Toggle Button -->
        <v-btn
          icon
          variant="text"
          @click="$emit('toggle-sidebar')"
          class="mx-1"
          color="primary"
        >
          <v-icon>{{ props.sidebarOpen ? 'mdi-menu-open' : 'mdi-menu' }}</v-icon>
        </v-btn>

        <v-divider vertical class="mx-3" thickness="2" />

        <!-- Search Icon -->
        <v-btn icon variant="text" @click="searchDialog = true" class="mx-1">
          <v-icon color="primary">mdi-magnify</v-icon>
        </v-btn>

        <!-- Auth Buttons -->
        <template v-if="!isLoggedIn">
          <v-btn
            variant="outlined"
            color="primary"
            class="ml-2"
            @click="showLoginModal = true"
            size="small"
          >
            Masuk
          </v-btn>
          <v-btn
            variant="flat"
            color="primary"
            class="ml-2"
            @click="showRegisterModal = true"
            size="small"
          >
            Daftar
          </v-btn>
        </template>

        <!-- User Menu -->
        <v-menu v-else offset-y>
          <template #activator="{ props }">
            <v-btn icon v-bind="props" class="ml-2">
              <v-avatar color="primary" size="32">
                <span class="text-white">{{ user.name?.charAt(0).toUpperCase() }}</span>
              </v-avatar>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title>{{ user.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
            </v-list-item>
            <v-divider />
            <v-list-item @click="handleLogout">
              <template #prepend>
                <v-icon>mdi-logout</v-icon>
              </template>
              <v-list-item-title>Keluar</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <!-- Mobile Menu -->
      <v-app-bar-nav-icon
        class="hidden-lg-and-up"
        @click="drawer = !drawer"
        color="primary"
      />
    </v-container>

    <!-- Search Dialog -->
    <v-dialog v-model="searchDialog" max-width="600">
      <v-card>
        <v-card-text class="pa-4">
          <v-text-field
            v-model="searchQuery"
            placeholder="Cari Inovasi..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            autofocus
            @keyup.enter="handleSearch"
            hide-details
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Mobile Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      app
      width="300"
    >
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
            :href="item.href"
            target="_blank"
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
            :href="item.href"
            target="_blank"
            @click="drawer = false"
          >
            <v-list-item-title>{{ item.label }}</v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <!-- Login Modal -->
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
            <v-btn type="submit" color="primary" block class="mt-4">
              Masuk
            </v-btn>
          </v-form>
          <v-divider class="my-4">atau</v-divider>
          <v-btn
            variant="outlined"
            color="red"
            block
            prepend-icon="mdi-google"
            @click="handleGoogleLogin"
          >
            Masuk dengan Google
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Register Modal -->
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

const props = defineProps({
  sidebarOpen: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['toggle-sidebar']);

const menuOpen = ref(false);
const toggleMenu = () => (menuOpen.value = !menuOpen.value);

// New Vuetify variables
const drawer = ref(false);
const searchQuery = ref('');
const searchDialog = ref(false);

// Auth composable
const { isLoggedIn, user, logout } = useAuth();

import { watch, onMounted } from 'vue';

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

// Search handler
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('Searching for:', searchQuery.value);
    searchDialog.value = false;
    // router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`);
  }
};

// Login handlers
import { useRouter } from 'vue-router';
const router = useRouter();
import { useLogin } from '~/composables/useLogin';
const { handleLogin: apiLogin, user: apiUser, error: loginError, loading: loginLoading } = useLogin();
import { toast } from 'vue-sonner';

const handleLogin = async () => {
  if (loginForm.value.email && loginForm.value.password) {
    await apiLogin({ email: loginForm.value.email, password: loginForm.value.password });
    if (apiUser.value && apiUser.value.role) {
      // Use auth composable
      const { login } = useAuth();
      login(apiUser.value);
      showLoginModal.value = false;
      loginForm.value = { email: '', password: '' };
      toast.success('🎉 Login Berhasil!', {
        description: 'Selamat datang kembali!',
        duration: 4000
      });
      router.push(`/${apiUser.value.role}/dashboard`);
    } else {
      toast.error(loginError.value || 'Login gagal!', {
        position: 'top-right',
        timeout: 5000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.6,
        showCloseButtonOnHover: false,
        hideProgressBar: false,
        closeButton: 'button',
        icon: true,
        rtl: false
      });
    }
  } else {
    toast.warning('Harap isi semua field!', {
      position: 'top-right',
      timeout: 3000,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      draggable: true,
      draggablePercent: 0.6,
      showCloseButtonOnHover: false,
      hideProgressBar: false,
      closeButton: 'button',
      icon: true,
      rtl: false
    });
  }
};

const handleGoogleLogin = () => {
  // Handle Google login logic here
  if (window.google && window.google.accounts) {
    window.google.accounts.id.prompt();
  } else {
    console.error('Google Sign-In not loaded');
  }
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
    toast.success('Registrasi berhasil!', {
      position: 'top-right',
      timeout: 3000,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      draggable: true,
      draggablePercent: 0.6,
      showCloseButtonOnHover: false,
      hideProgressBar: false,
      closeButton: 'button',
      icon: true,
      rtl: false
    });
  } else {
    toast.warning('Harap isi semua field!', {
      position: 'top-right',
      timeout: 3000,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      draggable: true,
      draggablePercent: 0.6,
      showCloseButtonOnHover: false,
      hideProgressBar: false,
      closeButton: 'button',
      icon: true,
      rtl: false
    });
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
  toast.info('Anda telah logout!', {
    position: 'top-right',
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: 'button',
    icon: true,
    rtl: false
  });
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

// Initialize Google Sign-In
onMounted(() => {
  if (process.client && window.google && window.google.accounts) {
    window.google.accounts.id.initialize({
      client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your actual client ID
      callback: handleGoogleCallback
    });
  }
});

const handleGoogleCallback = async (response) => {
  try {
    const res = await $fetch('/api/google-login', {
      method: 'POST',
      body: { token: response.credential }
    });

    if (res.success) {
      const { login } = useAuth();
      login(res.user);
      showLoginModal.value = false;
      toast.success('🎉 Login dengan Google Berhasil!', {
        description: 'Selamat datang!',
        duration: 4000
      });
      router.push(`/${res.user.role}/dashboard`);
    } else {
      toast.error(res.error || 'Login gagal!');
    }
  } catch (error) {
    console.error('Google login error:', error);
    toast.error('Terjadi kesalahan saat login dengan Google');
  }
};
</script>

<style scoped>
.navbar-custom {
  border-bottom: 3px solid #1976D2;
}

.logo-hover {
  transition: transform 0.3s ease;
}

.logo-hover:hover {
  transform: scale(1.02);
}

.cursor-pointer {
  cursor: pointer;
}

.nav-link {
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-transform: none;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: #1976D2 !important;
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
</style>
