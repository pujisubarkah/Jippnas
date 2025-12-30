<template>
  <v-app class="dashboard-layout">
    <Sidebar :role="role" :sidebar-open="sidebarOpen" @toggle-sidebar="toggleSidebar" />

    <v-app-bar
      app
      elevation="1"
      color="white"
      height="80"
      class="header-custom"
    >
      <v-container fluid class="d-flex align-center pa-0 px-4">
        <!-- Hamburger Menu for Sidebar -->
        <v-btn
          icon
          variant="text"
          color="primary"
          class="mr-2"
          @click="toggleSidebar"
          :aria-label="'Toggle sidebar'"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>

        <!-- Logo/Title -->
        <v-toolbar-title class="d-flex align-center">
          <span class="text-h6 font-weight-bold text-primary mr-3">
            Jippnas Admin
          </span>
          <v-chip
            v-if="user?.role === 'admin'"
            color="primary"
            variant="flat"
            size="small"
            class="font-weight-medium"
          >
            Admin
          </v-chip>
          <v-chip
            v-else
            color="success"
            variant="flat"
            size="small"
            class="font-weight-medium"
          >
            User
          </v-chip>
        </v-toolbar-title>

        <v-spacer />

        <!-- Notification Icons -->
        <div class="d-flex align-center ga-2">
          <v-btn icon variant="text" color="grey-darken-1">
            <v-badge color="error" content="3" offset-x="-5" offset-y="5">
              <v-icon>mdi-bell-outline</v-icon>
            </v-badge>
          </v-btn>

          <v-btn icon variant="text" color="grey-darken-1">
            <v-icon>mdi-email-outline</v-icon>
          </v-btn>

          <!-- User Menu -->
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                class="ml-2"
                variant="text"
                color="primary"
              >
                <v-avatar size="36" color="primary" class="mr-2">
                  <span class="text-white text-subtitle-2">
                    {{ user?.username?.charAt(0).toUpperCase() || 'U' }}
                  </span>
                </v-avatar>
                <span class="text-body-2 font-weight-medium hidden-sm-and-down">
                  {{ user?.username || 'User' }}
                </span>
                <v-icon class="ml-1">mdi-chevron-down</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item>
                <v-list-item-title>Profile</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Settings</v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item @click="handleLogout">
                <v-list-item-title class="text-error">Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-container>
    </v-app-bar>

    <v-main class="main-content">
      <div class="full-content">
        <slot />
      </div>
    </v-main>

    <FooterSidebar />
  </v-app>
</template>

<script setup>
import Sidebar from '~/components/Sidebar.vue';
import FooterSidebar from '~/components/footer_sidebar.vue';
import { useAuth } from '~/composables/useAuth';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const { user, logout } = useAuth();
const router = useRouter();
const role = computed(() => user.value?.role || 'user');

// Sidebar state
const sidebarOpen = ref(true);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const handleLogout = () => {
  logout();
  router.push('/');
};
</script>

<style scoped>
.dashboard-layout {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
}

.header-custom {
  border-bottom: 2px solid rgba(25, 118, 210, 0.1) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
}

.main-content {
  margin-top: 80px;
  padding-top: 24px;
}

.full-content {
  width: 100%;
  min-height: calc(100vh - 104px);
  padding: 24px 48px;
  box-sizing: border-box;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 1023px) {
  .full-content {
    padding: 16px 24px;
  }
}
</style>
