<template>
  <div>
    <h1 class="text-2xl font-bold mb-6 text-primary">
      Dashboard {{ isAdmin ? 'Admin' : userInstansi }}
    </h1>
    
    <!-- Admin Dashboard -->
    <div v-if="isAdmin">
      <v-card class="mb-6">
        <v-card-text>
          <v-container fluid>
          <v-row justify="center" class="py-4">
            <v-col lg="3" cols="8" class="ma-2">
              <v-card color="primary" variant="outlined" class="text-center">
                <v-card-text>
                  <a href="#" data-toggle="modal" data-target="#inovasiMod" class="text-decoration-none">
                    <p class="text-primary font-weight-bold">Total Inovasi</p>
                    <h2 class="text-primary font-weight-bold">2929</h2>
                  </a>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col lg="3" cols="8" class="ma-2">
              <v-card color="primary" variant="outlined" class="text-center">
                <v-card-text>
                  <a href="#" data-toggle="modal" data-target="#uppMod" class="text-decoration-none">
                    <p class="text-primary font-weight-bold">Total Upp</p>
                    <h2 class="text-primary font-weight-bold">1787</h2>
                  </a>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col lg="3" cols="8" class="ma-2">
              <v-card color="primary" variant="outlined" class="text-center">
                <v-card-text>
                  <p class="text-primary font-weight-bold">Total Dilihat</p>
                  <h2 class="text-primary font-weight-bold">46824</h2>
                  <p class="text-primary text-caption">Jawa Barat</p>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col lg="3" cols="8" class="ma-2">
              <v-card color="primary" variant="outlined" class="text-center">
                <v-card-text>
                  <a href="#" data-toggle="modal" data-target="#InovatorMod" class="text-decoration-none">
                    <p class="text-primary font-weight-bold">Top Inovator</p>
                    <p class="text-primary text-caption">JIPPNAS</p>
                    <p class="text-primary text-caption">Suratno cs - Pemerintah Kabupaten banyuwangi</p>
                    <v-row align="center">
                      <v-col>
                        <h2 class="text-primary font-weight-bold">21</h2>
                      </v-col>
                      <v-col>
                        <v-icon color="primary" size="large">mdi-account</v-icon>
                      </v-col>
                    </v-row>
                  </a>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col lg="3" cols="8" class="ma-2">
              <v-card color="primary" variant="outlined" class="text-center">
                <v-card-text>
                  <a href="#" data-toggle="modal" data-target="#maxInovMod" class="text-decoration-none">
                    <p class="text-primary font-weight-bold">Top Instansi</p>
                    <p class="text-primary text-caption">Pemerintah Kabupaten banyuwangi</p>
                    <v-row align="center">
                      <v-col>
                        <h2 class="text-primary font-weight-bold">161</h2>
                      </v-col>
                      <v-col>
                        <v-icon color="primary" size="large">mdi-lightbulb</v-icon>
                      </v-col>
                    </v-row>
                  </a>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col lg="3" cols="8" class="ma-2">
              <v-card color="primary" variant="outlined" class="text-center">
                <v-card-text>
                  <a href="#" data-toggle="modal" data-target="#sdgsMod" class="text-decoration-none">
                    <p class="text-primary font-weight-bold">Kategori Inovasi SDG's Terbanyak</p>
                    <p class="text-primary">Kehidupan Sehat dan Sejahtera</p>
                    <v-row align="center">
                      <v-col>
                        <h2 class="text-primary font-weight-bold">678</h2>
                      </v-col>
                      <v-col>
                        <v-img src="/sdgs/3.png" width="80" height="80" style="opacity: 0.5;"></v-img>
                      </v-col>
                    </v-row>
                  </a>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row justify="center" class="py-4">
            <v-col lg="8" md="8" class="ma-2">
              <v-card color="primary" variant="outlined" class="text-center">
                <v-card-text>
                  <p class="text-primary font-weight-bold">Total pengunjung profile inovasi keseluruhan</p>
                  <h2 class="text-primary font-weight-bold">1151000</h2>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row justify="center" class="py-4">
            <v-col lg="8" md="8" class="ma-2">
              <v-card color="primary" variant="outlined" class="text-center">
                <v-card-text>
                  <p class="text-primary font-weight-bold">Total inovasi sudah memiliki gambar</p>
                  <h2 class="text-primary font-weight-bold">2062</h2>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col lg="8" md="8" class="ma-2">
              <v-card color="primary" variant="outlined" class="text-center">
                <v-card-text>
                  <p class="text-primary font-weight-bold">Total inovasi dengan ringkasan yang masih kosong atau #N/A</p>
                  <h2 class="text-primary font-weight-bold">9</h2>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row justify="center" class="py-4">
            <v-col cols="12">
              <v-card color="primary" variant="outlined">
                <v-card-text>
                  <p class="text-primary font-weight-bold mb-4">Jumlah Inovasi Terkini</p>
                  <v-form @submit.prevent="submitForm" class="mb-4">
                    <v-row justify="center" align="center" class="pl-4">
                      <v-col md="4" cols="12">
                        <v-text-field
                          v-model="startDate"
                          label="Start Date"
                          type="date"
                          variant="outlined"
                          color="primary"
                        ></v-text-field>
                      </v-col>
                      <v-col md="4" cols="12">
                        <v-text-field
                          v-model="endDate"
                          label="End Date"
                          type="date"
                          variant="outlined"
                          color="primary"
                        ></v-text-field>
                      </v-col>
                      <v-col md="2" cols="12" class="text-center">
                        <v-btn type="submit" color="primary" variant="flat">Submit</v-btn>
                      </v-col>
                    </v-row>
                  </v-form>
                  <client-only>
                    <canvas id="myChart5" style="max-height: 400px;"></canvas>
                  </client-only>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row justify="center" class="px-4 py-4">
            <v-col cols="12">
              <v-card color="primary" variant="outlined">
                <v-card-text>
                  <div class="d-flex justify-center mb-3">
                    <div style="background: white; width: 33%; height: 50px; border: 1px solid #1976D2;"></div>
                    <div style="background: #1976D2; width: 33%; height: 50px; opacity: 0.5;"></div>
                    <div style="background: #1976D2; width: 34%; height: 50px;"></div>
                  </div>
                  <div class="d-flex justify-center">
                    <div class="text-primary font-weight-bold text-center" style="width: 33%;">0</div>
                    <div class="text-primary font-weight-bold text-center" style="width: 33%;">&lt; 30</div>
                    <div class="text-primary font-weight-bold text-center" style="width: 33%;">&gt; 30</div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card color="primary" variant="outlined">
                <v-card-text>
                  <client-only>
                    <div id="map" style="height: 500px; width: 100%;"></div>
                  </client-only>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
    </div>

    <!-- User Dashboard -->
    <div v-else>
      <v-card class="mb-6">
        <v-card-text>
          <v-alert type="info" variant="tonal" class="mb-6">
            <strong>Selamat datang!</strong> Ini adalah dashboard untuk {{ userInstansi }}
          </v-alert>
          
          <v-container fluid>
            <v-row justify="center" class="py-4">
              <v-col lg="4" cols="12" class="ma-2">
                <v-card color="primary" variant="outlined" class="text-center">
                  <v-card-text>
                    <p class="text-primary font-weight-bold">Inovasi Saya</p>
                    <h2 class="text-primary font-weight-bold">{{ userStats.totalInnovations }}</h2>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col lg="4" cols="12" class="ma-2">
                <v-card color="success" variant="outlined" class="text-center">
                  <v-card-text>
                    <p class="text-success font-weight-bold">Survey Terisi</p>
                    <h2 class="text-success font-weight-bold">{{ userStats.surveysCompleted }}</h2>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col lg="4" cols="12" class="ma-2">
                <v-card color="warning" variant="outlined" class="text-center">
                  <v-card-text>
                    <p class="text-warning font-weight-bold">Dalam Proses</p>
                    <h2 class="text-warning font-weight-bold">{{ userStats.inProgress }}</h2>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-row justify="center" class="py-4">
              <v-col cols="12">
                <v-card color="primary" variant="outlined">
                  <v-card-title class="text-primary">Quick Actions</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-btn block color="primary" size="large" :to="`/${role}/inovasi`">
                          <v-icon start>mdi-lightbulb</v-icon>
                          Kelola Inovasi
                        </v-btn>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-btn block color="primary" size="large" :to="`/${role}/survey-hub-inovasi`">
                          <v-icon start>mdi-clipboard-text</v-icon>
                          Isi Survey
                        </v-btn>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-btn block color="primary" size="large" :to="`/${role}/inovasi/forms`">
                          <v-icon start>mdi-plus</v-icon>
                          Tambah Inovasi
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-row justify="center" class="py-4">
              <v-col cols="12">
                <v-card color="primary" variant="outlined">
                  <v-card-title class="text-primary">Aktivitas Terbaru</v-card-title>
                  <v-card-text>
                    <v-list>
                      <v-list-item v-for="(activity, index) in recentActivities" :key="index">
                        <template v-slot:prepend>
                          <v-icon :color="activity.color">{{ activity.icon }}</v-icon>
                        </template>
                        <v-list-item-title>{{ activity.title }}</v-list-item-title>
                        <v-list-item-subtitle>{{ activity.date }}</v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

definePageMeta({ 
  layout: 'sidebar'
})

const route = useRoute()
const { user } = useAuth()

const role = computed(() => route.params.role || 'user')
const isAdmin = computed(() => user.value?.id_peran === 2)
const userInstansi = ref('')

// User statistics (untuk user biasa)
const userStats = ref({
  totalInnovations: 0,
  surveysCompleted: 0,
  inProgress: 0
})

// Recent activities (untuk user biasa)
const recentActivities = ref([
  {
    title: 'Inovasi baru ditambahkan',
    date: '2 hari yang lalu',
    icon: 'mdi-lightbulb',
    color: 'success'
  },
  {
    title: 'Survey Hub Inovasi terisi',
    date: '5 hari yang lalu',
    icon: 'mdi-clipboard-check',
    color: 'primary'
  },
  {
    title: 'Inovasi diverifikasi',
    date: '1 minggu yang lalu',
    icon: 'mdi-check-circle',
    color: 'success'
  }
])

const startDate = ref('2024-12-01')
const endDate = ref('2025-12-25')

const submitForm = () => {
  // Handle form submission
  console.log('Start Date:', startDate.value)
  console.log('End Date:', endDate.value)
}

onMounted(async () => {
  // Get user data from localStorage
  if (process.client) {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      userInstansi.value = parsedUser.nm_instansi || 'Tidak Diketahui'
    }
  }

  // Load user stats if not admin
  if (!isAdmin.value) {
    // TODO: Fetch user stats from API
    // const response = await $fetch(`/api/user-stats?instansi=${userInstansi.value}`)
    // userStats.value = response.data
    
    // Sample data
    userStats.value = {
      totalInnovations: 5,
      surveysCompleted: 2,
      inProgress: 1
    }
    return
  }

  // Admin dashboard - load charts and map
  // Chart
  const ctx = document.getElementById('myChart5')?.getContext('2d')
  if (ctx) {
    const { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } = await import('chart.js')
    Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Inovasi Terkini',
          data: [12, 19, 3, 5, 2, 3],
          borderColor: 'rgb(25, 118, 210)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Jumlah Inovasi Terkini'
          }
        }
      }
    })
  }

  // Leaflet Map
  if (process.client) {
    const L = await import('leaflet')
    const map = L.default.map('map').setView([-2.5, 118], 5)
    
    L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map)

    // Add sample marker
    L.default.marker([-6.2, 106.8]).addTo(map)
      .bindPopup('Jakarta')
  }
})
</script>

<style scoped>
.text-warning {
  color: #fb8c00 !important;
}
</style>
