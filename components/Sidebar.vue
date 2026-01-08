<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="!sidebarOpen"
    :permanent="!isMobile"
    :temporary="isMobile"
    color="white"
    elevation="4"
    app
  >
    <!-- Header Logo - hanya tampil saat open -->
    <div v-if="sidebarOpen" class="pa-4">
      <div class="d-flex justify-center align-center mb-4">
        <img
          src="https://jippnas.menpan.go.id/storage/images/about/logo_ds/1/W8NHqNH4si2HA7dfVmFU2PaVLBtqwUz2t850znX2.png"
          alt="Logo Jippnas"
          class="logo-sidebar"
          width="220"
          height="80"
        />
      </div>
      <v-divider color="primary" thickness="2" class="mb-2"></v-divider>
    </div>

    <v-list density="comfortable" :class="sidebarOpen ? 'px-2' : 'px-0'">
      <v-list-item
        v-if="!role"
        class="text-primary"
        disabled
      >
        <v-list-item-title>Memuat data user...</v-list-item-title>
      </v-list-item>

      <v-list-item
        v-else-if="menu.length === 0"
        class="text-primary"
        disabled
      >
        <v-list-item-title>Menu tidak tersedia untuk role ini.</v-list-item-title>
      </v-list-item>

      <template v-for="item in menu" :key="item.label">
        <v-list-group v-if="item.children" :value="item.label">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :active="isActive(item.to)" active-class="sidebar-active">
              <template v-slot:prepend>
                <div v-html="item.iconSvg"></div>
              </template>
              <v-list-item-title>{{ item.label }}</v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item
            v-for="child in item.children"
            :key="child.label"
            :to="child.to"
            :active="isActive(child.to)"
            active-class="sidebar-active"
            class="pl-12"
          >
            <v-list-item-title>{{ child.label }}</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-item
          v-else
          :to="item.to"
          :active="isActive(item.to)"
          active-class="sidebar-active"
        >
          <template v-slot:prepend>
            <div v-html="item.iconSvg"></div>
          </template>
          <v-list-item-title>{{ item.label }}</v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
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
