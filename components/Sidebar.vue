<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="!sidebarOpen"
    :permanent="!isMobile"
    :temporary="isMobile"
    :rail-width="56"
    class="sidebar-elegant"
    elevation="0"
    app
  >
    <!-- Header Logo with gradient background -->
    <div v-if="sidebarOpen" class="sidebar-header">
      <NuxtLink to="/" class="logo-link">
        <div class="logo-content">
          <h1 class="logo-text">
            <span class="logo-jipp">JIPP</span><span class="logo-nas">NAS</span>
          </h1>
          <p class="logo-subtitle">
            Jaringan Inovasi Pelayanan Publik Nasional
          </p>
        </div>
      </NuxtLink>
      <div class="header-divider"></div>
    </div>

    <!-- Compact Logo for rail mode -->
    <div v-else class="sidebar-header-compact">
      <NuxtLink to="/" class="logo-compact">
        <span class="logo-compact-text">J</span>
      </NuxtLink>
    </div>

    <v-list density="compact" class="sidebar-menu" :class="{ 'menu-open': sidebarOpen, 'menu-rail': !sidebarOpen }">
      <v-list-item
        v-if="!role"
        class="loading-item"
        disabled
      >
        <template v-slot:prepend>
          <v-progress-circular indeterminate size="20" width="2" color="primary"></v-progress-circular>
        </template>
        <v-list-item-title>Memuat data user...</v-list-item-title>
      </v-list-item>

      <v-list-item
        v-else-if="menu.length === 0"
        class="empty-menu-item"
        disabled
      >
        <v-list-item-title>Menu tidak tersedia</v-list-item-title>
      </v-list-item>

      <template v-for="item in menu" :key="item.label">
        <v-tooltip v-if="item.children" :disabled="sidebarOpen" location="end">
          <template v-slot:activator="{ props: tooltipProps }">
            <v-list-group :value="item.label" class="menu-group">
              <template v-slot:activator="{ props }">
                <v-list-item 
                  v-bind="{ ...props, ...tooltipProps }" 
                  :active="isActive(item.to)" 
                  class="menu-item"
                  :class="{ 'active-parent': isActive(item.to) }"
                >
                  <template v-slot:prepend>
                    <v-list-item-icon class="menu-icon" v-html="item.iconSvg" />
                  </template>
                  <v-list-item-title class="menu-title">{{ item.label }}</v-list-item-title>
                </v-list-item>
              </template>

              <v-tooltip v-for="child in item.children" :key="child.label" :disabled="sidebarOpen" location="end">
                <template v-slot:activator="{ props: childTooltipProps }">
                  <v-list-item
                    v-bind="childTooltipProps"
                    :to="child.to"
                    :active="isActive(child.to)"
                    class="menu-item menu-child"
                    :class="{ 'active-child': isActive(child.to) }"
                  >
                    <template v-slot:prepend>
                      <div class="child-indicator"></div>
                    </template>
                    <v-list-item-title class="menu-title">{{ child.label }}</v-list-item-title>
                  </v-list-item>
                </template>
                <span>{{ child.label }}</span>
              </v-tooltip>
            </v-list-group>
          </template>
          <span>{{ item.label }}</span>
        </v-tooltip>

        <v-tooltip v-else :disabled="sidebarOpen" location="end">
          <template v-slot:activator="{ props: tooltipProps }">
            <v-list-item
              v-bind="tooltipProps"
              :to="item.to"
              :active="isActive(item.to)"
              class="menu-item"
              :class="{ 'active-single': isActive(item.to) }"
            >
              <template v-slot:prepend>
                <v-list-item-icon class="menu-icon" v-html="item.iconSvg" />
              </template>
              <v-list-item-title class="menu-title">{{ item.label }}</v-list-item-title>
            </v-list-item>
          </template>
          <span>{{ item.label }}</span>
        </v-tooltip>
      </template>
    </v-list>

    <!-- Footer Decoration -->
    <div v-if="sidebarOpen" class="sidebar-footer">
      <div class="footer-decoration"></div>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
  role: {
    type: String,
    default: 'user'
  },
  sidebarOpen: {
    type: Boolean,
    default: true
  }
})

const { user, checkAuth } = useAuth()
const role = computed(() => props.role || user.value?.role || 'user')

// Reactive states for drawer and mobile detection
const drawer = ref(true)
const isMobile = ref(false)

// Check if current route is active
const isActive = (path) => {
  if (typeof window !== 'undefined') {
    return window.location.pathname === path
  }
  return false
}

// Icon SVG strings from Lucide
const iconSvgs = {
  Home: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-primary"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9,22 9,12 15,12 15,22"></polyline></svg>',
  Users: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
  Video: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-primary"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect width="15" height="14" x="1" y="5" rx="2" ry="2"></rect></svg>',
  Newspaper: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-primary"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h16"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>',
  Lightbulb: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-primary"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.4 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path></svg>',
  Plus: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-primary"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>',
  FileText: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-primary"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>',
  Copy: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-primary"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>',
  Eye: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-primary"><path d="M2.5 12.5a10 10 0 0 1 19 0"></path><path d="M1 10a10 10 0 0 1 19 0"></path><path d="M10 16a4 4 0 0 1 0-8 4 4 0 0 0 0 8Z"></path><path d="M10 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"></path></svg>',
  Settings: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-primary"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
  HelpCircle: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-primary"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>',
  ClipboardList: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-primary"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path></svg>'
}

// Check screen size for responsive behavior
const checkScreenSize = () => {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 1024
    // Auto-close drawer on mobile
    if (isMobile.value) {
      drawer.value = false
    } else {
      drawer.value = true
    }
  }
}

// Ensure auth is checked on mount
onMounted(() => {
  checkAuth()
  checkScreenSize()

  // Add resize listener
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', checkScreenSize)
  }
})

// Watch for user changes to update menu
watch(user, (newUser) => {
  // console.log('User updated in Sidebar:', newUser)
}, { immediate: true })

// Universal menu config with slug and i18n keys
const menuConfig = [
  // Admin menu
  {
    labelKey: 'sidebar.dashboard',
    slug: 'dashboard',
    icon: 'Home',
    roles: ['admin'],
    children: [
      {
        labelKey: 'sidebar.dashboard',
        slug: 'dashboard',
        roles: ['admin']
      }
    ]
  },
  {
    labelKey: 'sidebar.contentManagement',
    slug: 'konten-inovasi',
    icon: 'FileText',
    roles: ['admin'],
    children: [
      {
        labelKey: 'sidebar.listIdeaInnovation',
        slug: 'list-ide-inovasi',
        roles: ['admin']
      },
      {
        labelKey: 'sidebar.listInnovation',
        slug: 'list-inovasi',
        roles: ['admin']
      },
      {
        labelKey: 'sidebar.listHubInnovation',
        slug: 'list-hub-inovasi',
        roles: ['admin']
      }
    ]
  },
  {
    labelKey: 'sidebar.replicationManagement',
    slug: 'replikasi',
    icon: 'Copy',
    roles: ['admin'],
    children: [
      {
        labelKey: 'sidebar.replication',
        slug: 'manajemen-replikasi',
        roles: ['admin']
      },
      {
        labelKey: 'sidebar.interestSummary',
        slug: 'rekap-minat',
        roles: ['admin']
      },
      {
        labelKey: 'sidebar.agreementSummary',
        slug: 'rekap-kesepakatan',
        roles: ['admin']
      },
      {
        labelKey: 'sidebar.implementationSummary',
        slug: 'rekap-implementasi',
        roles: ['admin']
      }
    ]
  },
  {
    labelKey: 'sidebar.readerManagement',
    slug: 'pembaca',
    icon: 'Eye',
    roles: ['admin'],
    children: [
      {
        labelKey: 'sidebar.readingList',
        slug: 'daftar-bacaan',
        roles: ['admin']
      }
    ]
  },
  {
    labelKey: 'sidebar.userManagement',
    slug: 'manajemen-pengguna',
    icon: 'Users',
    roles: ['admin'],
    children: [
      {
        labelKey: 'sidebar.userList',
        slug: 'daftar-pengguna',
        roles: ['admin']
      },
      {
        labelKey: 'sidebar.userRoles',
        slug: 'role-pengguna',
        roles: ['admin']
      }
    ]
  },
  {
    labelKey: 'sidebar.newsManagement',
    slug: 'manajemen-berita',
    icon: 'Newspaper',
    roles: ['admin'],
    children: [
      {
        labelKey: 'sidebar.newsList',
        slug: 'list-berita',
        roles: ['admin']
      },
      {
        labelKey: 'sidebar.topNewsSettings',
        slug: 'pengaturan-top-berita',
        roles: ['admin']
      }
    ]
  },
  {
    labelKey: 'sidebar.helpManagement',
    slug: 'manajemen-bantuan',
    icon: 'HelpCircle',
    roles: ['admin'],
    children: [
      {
        labelKey: 'sidebar.helpCenterList',
        slug: 'list-pusat-bantuan',
        roles: ['admin']
      }
    ]
  },
  {
    labelKey: 'sidebar.settings',
    slug: 'pengaturan',
    icon: 'Settings',
    roles: ['admin'],
    children: [
      {
        labelKey: 'sidebar.aboutUs',
        slug: 'tentang-kami',
        roles: ['admin']
      },
      {
        labelKey: 'sidebar.innovationModel',
        slug: 'model-inovasi',
        roles: ['admin']
      },
      {
        labelKey: 'sidebar.events',
        slug: 'acara-events',
        roles: ['admin']
      },
      {
        labelKey: 'sidebar.innovationBook',
        slug: 'buku-inovasi',
        roles: ['admin']
      },
      {
        labelKey: 'sidebar.downloads',
        slug: 'unduhan',
        roles: ['admin']
      },
      {
        labelKey: 'sidebar.faq',
        slug: 'faq',
        roles: ['admin']
      },
      {
        labelKey: 'sidebar.relatedPages',
        slug: 'halaman-terkait',
        roles: ['admin']
      },
      {
        labelKey: 'sidebar.sdgsCategories',
        slug: 'kategori-sdgs',
        roles: ['admin']
      },
      {
        labelKey: 'sidebar.generalCategories',
        slug: 'kategori-umum',
        roles: ['admin']
      },
      {
        labelKey: 'sidebar.competitionCategories',
        slug: 'kategori-kompetisi',
        roles: ['admin']
      },
      {
        labelKey: 'sidebar.thematicRbCategories',
        slug: 'kategori-rb-tematik',
        roles: ['admin']
      },
      {
        labelKey: 'sidebar.oecdCategories',
        slug: 'kategori-oecd',
        roles: ['admin']
      },
      {
        labelKey: 'sidebar.categoryTypes',
        slug: 'jenis-kategori',
        roles: ['admin']
      },
      {
        labelKey: 'sidebar.institutions',
        slug: 'instansi',
        roles: ['admin']
      },
      {
        labelKey: 'sidebar.innovationHub',
        slug: 'hub-inovasi',
        roles: ['admin']
      },
      {
        labelKey: 'sidebar.innovationHubDetail',
        slug: 'detail-hub-inovasi',
        roles: ['admin']
      },
      {
        labelKey: 'sidebar.upp',
        slug: 'upp',
        roles: ['admin']
      },
      {
        labelKey: 'sidebar.awards',
        slug: 'penghargaan',
        roles: ['admin']
      },
      {
        labelKey: 'sidebar.regions',
        slug: 'wilayah',
        roles: ['admin']
      },
      {
        labelKey: 'sidebar.dataCollaboration',
        slug: 'kolaborasi-data',
        roles: ['admin']
      }
    ]
  },
  // User menu
  {
    labelKey: 'sidebar.dashboard',
    slug: 'dashboard',
    icon: 'Home',
    roles: ['user']
  },
  {
    labelKey: 'sidebar.innovationManagement',
    slug: 'manajemen-inovasi',
    icon: 'Lightbulb',
    roles: ['user'],
    children: [
      {
        labelKey: 'sidebar.innovationList',
        slug: 'inovasi',
        roles: ['user']
      }
    ]
  },
  {
    labelKey: 'sidebar.innovationHubSurvey',
    slug: 'survey-hub-inovasi',
    icon: 'ClipboardList',
    roles: ['user']
  }
]

const menu = computed(() => {
  if (!role.value) return []

  const userIdPeran = user.value?.id_peran
  const isAdmin = userIdPeran === 2
  const targetRole = isAdmin ? 'admin' : 'user'

  return menuConfig
    .filter(item => item.roles.includes(targetRole))
    .map(item => {
      const menuItem = {
        ...item,
        label: t(item.labelKey),
        to: `/${role.value}/${item.slug}`,
        iconSvg: iconSvgs[item.icon]
      }

      if (item.children) {
        menuItem.children = item.children.map(child => ({
          ...child,
          label: t(child.labelKey),
          to: `/${role.value}/${child.slug}`
        }))
      }

      return menuItem
    })
})
</script>
<style scoped>
/* Import Poppins Font */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

/* Elegant Sidebar Styling */
.sidebar-elegant {
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%) !important;
  border-right: 1px solid #e2e8f0 !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03) !important;
  font-family: 'Poppins', sans-serif;
}

/* Header Styling */
.sidebar-header {
  padding: 24px 16px 16px;
  background: white;
  position: relative;
  overflow: hidden;
  border-bottom: 2px solid #e2e8f0;
}

.sidebar-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 1;
}

.logo-link {
  display: block;
  text-decoration: none;
  position: relative;
  z-index: 1;
}

.logo-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  padding: 0 16px;
}

.logo-text {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
  margin: 0;
  letter-spacing: -1px;
  font-family: 'Poppins', sans-serif;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.logo-jipp {
  color: #dc2626;
}

.logo-nas {
  color: #1e293b;
}

.logo-subtitle {
  font-size: 0.75rem;
  color: #475569;
  margin: 6px 0 0 0;
  line-height: 1.3;
  text-align: center;
  font-weight: 500;
  font-family: 'Poppons', sans-serif;
  letter-spacing: 0.02em;
}

.logo-link:hover .logo-text {
  transform: scale(1.05);
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

.header-divider {
  height: 3px;
  background: linear-gradient(90deg, transparent 0%, #3b82f6 50%, transparent 100%);
  border-radius: 2px;
  position: relative;
  z-index: 1;
}

/* Compact Header for Rail Mode */
.sidebar-header-compact {
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  border-bottom: 2px solid #e2e8f0;
}

.logo-compact {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  text-decoration: none;
  border: 2px solid rgba(220, 38, 38, 0.2);
}

.logo-compact-text {
  font-size: 1.75rem;
  font-weight: 800;
  color: white;
  font-family: 'Poppins', sans-serif;
  line-height: 1;
}

.logo-compact:hover {
  transform: scale(1.1);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
  background: #f8fafc;
  border-color: rgba(255, 255, 255, 0.5);
}

.logo-compact:hover .logo-compact-text {
  color: #dc2626;
}

/* Menu Styling */
.sidebar-menu {
  padding: 16px 8px !important;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-menu::-webkit-scrollbar {
  width: 4px;
}

.sidebar-menu::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-menu::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.sidebar-menu::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.menu-open {
  padding: 16px 12px !important;
}

.menu-rail {
  padding: 16px 0 !important;
  overflow: visible !important;
}

/* Stronger selectors to override Vuetify defaults in rail mode */
.sidebar-elegant .menu-rail .v-list-item {
  display: flex !important;
  align-items: center !important;
}

.sidebar-elegant .menu-rail .v-list-item__prepend {
  flex: 0 0 auto !important;
  min-width: 40px !important;
}

.sidebar-elegant .menu-rail .v-list-item__content {
  flex: 0 0 0 !important;
  width: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden !important;
}

/* Menu Items */
.menu-item {
  margin-bottom: 4px;
  border-radius: 12px !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: visible !important;
  min-height: 44px !important;
  height: auto !important;
  padding: 8px 12px !important;
  align-items: flex-start !important;
}

/* Adjust menu items in rail mode */
.menu-rail .menu-item {
  justify-content: center !important;
  align-items: center !important;
  padding: 8px !important;
  min-height: 40px !important;
  height: 40px !important;
  margin: 8px auto !important;
  width: 56px !important;
  display: flex !important;
  opacity: 1 !important;
  visibility: visible !important;
  overflow: visible !important;
  position: relative !important;
  z-index: 1 !important;
}

.menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 12px;
  width: 0;
  height: calc(100% - 24px);
  min-height: 20px;
  background: linear-gradient(90deg, #3b82f6 0%, transparent 100%);
  border-radius: 0 4px 4px 0;
  transition: width 0.3s ease;
}

/* In rail mode, remove left indicator bar entirely */
.menu-rail .menu-item::before {
  display: none !important;
}

.menu-item:hover {
  background: linear-gradient(90deg, #eff6ff 0%, #dbeafe 100%) !important;
  transform: translateX(4px);
}

.menu-item:hover::before {
  width: 4px;
}

/* Active States */
.active-single,
.active-parent,
.active-child {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
  color: white !important;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3), 0 2px 4px -1px rgba(59, 130, 246, 0.2);
  font-weight: 600;
}

.active-single::before,
.active-parent::before,
.active-child::before {
  width: 4px;
  background: white;
}

.active-single:hover,
.active-parent:hover,
.active-child:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%) !important;
  transform: translateX(2px);
}

.active-single .menu-icon svg,
.active-parent .menu-icon svg,
.active-child .menu-icon svg {
  stroke: white !important;
}

.active-single .menu-title,
.active-parent .menu-title,
.active-child .menu-title {
  color: white !important;
}

/* Menu Icon */
.menu-icon {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 24px !important;
  height: 24px !important;
  flex-shrink: 0 !important;
  transition: transform 0.2s ease;
  opacity: 1 !important;
  visibility: visible !important;
}

/* Center icons in rail mode */
.menu-rail .menu-icon {
  margin: 0 !important;
  opacity: 1 !important;
  visibility: visible !important;
}

.menu-item:hover .menu-icon {
  transform: scale(1.1);
}

.menu-icon svg {
  stroke: #475569 !important;
  transition: stroke 0.2s ease;
  width: 20px !important;
  height: 20px !important;
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
}

.menu-item:hover .menu-icon svg {
  stroke: #1e40af !important;
}

/* Menu Title */
.menu-title {
  font-size: 14px !important;
  font-weight: 500;
  color: #334155 !important;
  letter-spacing: 0.01em;
  transition: color 0.2s ease;
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: unset !important;
  word-wrap: break-word;
  line-height: 1.4;
  padding: 2px 0;
}

/* Hide titles in rail mode */
.menu-rail .menu-title {
  display: none !important;
}

/* Collapse content area in rail so only icons remain */
.menu-rail .v-list-item__content {
  display: block !important;
  flex: 0 0 0 !important;
  width: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: hidden !important;
}

/* Ensure prepend stays visible */
.menu-rail .v-list-item__prepend {
  display: flex !important;
  opacity: 1 !important;
  visibility: visible !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  margin-inline-end: 0 !important;
  padding: 0 8px 0 0 !important;
  justify-content: flex-end !important;
  align-items: center !important;
  position: relative !important;
  z-index: 2 !important;
}

.menu-item:hover .menu-title {
  color: #1e40af !important;
  font-weight: 600;
}

/* Menu Group */
.menu-group {
  margin-bottom: 8px;
}

/* Hide dropdown arrow in rail mode */
.menu-rail .v-list-group__header .v-list-item__append {
  display: none !important;
  width: 0 !important;
  opacity: 0 !important;
  visibility: hidden !important;
}

.menu-rail .v-list-item__append {
  display: none !important;
  width: 0 !important;
  opacity: 0 !important;
  visibility: hidden !important;
}

/* Ensure group icons show in rail mode */
.menu-rail .menu-group .v-list-group__items {
  display: none !important;
}

/* Center v-list-group header in rail mode */
.menu-rail .v-list-group__header {
  justify-content: center !important;
  padding: 0 !important;
}

.menu-rail .v-list-group__header .v-list-item {
  justify-content: center !important;
  padding: 8px !important;
  min-height: 40px !important;
  height: 40px !important;
  margin: 8px auto !important;
  width: 56px !important;
  overflow: visible !important;
}

/* Child Menu Items */
.menu-child {
  margin-left: 16px;
  padding-left: 32px !important;
  padding-top: 10px !important;
  padding-bottom: 10px !important;
  font-size: 13px;
}

/* Adjust child items in rail mode */
.menu-rail .menu-child {
  margin-left: 0;
  padding-left: 12px !important;
}

.child-indicator {
  width: 6px;
  height: 6px;
  background: #cbd5e1;
  border-radius: 50%;
  margin-right: 12px;
  margin-top: 6px;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

/* Hide child indicators in rail mode */
.menu-rail .child-indicator {
  display: none;
}

.menu-child:hover .child-indicator {
  background: #3b82f6;
  transform: scale(1.3);
}

.active-child .child-indicator {
  background: white;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
}

/* Loading & Empty States */
.loading-item,
.empty-menu-item {
  opacity: 0.7;
  font-style: italic;
  color: #64748b !important;
}

/* Hide text in loading/empty states for rail mode */
.menu-rail .loading-item .v-list-item-title,
.menu-rail .empty-menu-item .v-list-item-title {
  display: none;
}

/* Footer Decoration */
.sidebar-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: linear-gradient(0deg, #f1f5f9 0%, transparent 100%);
}

.footer-decoration {
  height: 4px;
  background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #3b82f6 100%);
  background-size: 200% 100%;
  border-radius: 2px;
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .sidebar-header {
    padding: 20px 12px 12px;
  }
  
  .logo-sidebar {
    width: 180px;
  }
}
</style>
