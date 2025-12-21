<template>
  <div class="stats-section">
    <v-container fluid class="pa-0">
      <v-row justify="center" class="py-12">
        <v-col cols="12" class="text-center">
          <v-fade-transition appear>
            <h1 class="text-h3 text-md-h2 font-weight-black mb-2 bg-clip-text text-transparent bg-linear-to-r from-blue-700 to-blue-500">
              Inovasi Pelayanan Publik
            </h1>
          </v-fade-transition>
          <v-slide-y-transition appear>
            <p class="text-body-1 text-blue-600 italic mb-8">
              *sampai saat ini
            </p>
          </v-slide-y-transition>

          <v-row justify="center" class="mb-8">
            <v-col cols="12" md="10" lg="8">
              <v-row>
                <!-- Instansi Card -->
                <v-col cols="12" sm="6" lg="4" class="pa-2">
                  <v-card
                    class="stat-card elevation-8"
                    rounded="xl"
                    hover
                    :ripple="false"
                  >
                    <v-card-text class="text-center pa-6">
                      <v-avatar
                        size="80"
                        class="mb-4 gradient-blue"
                      >
                        <v-icon size="40" color="white">mdi-office-building</v-icon>
                      </v-avatar>
                      <div class="counter-wrapper mb-2">
                        <span class="counter-number">{{ formatNumber(animatedNumbers.instansi) }}</span>
                      </div>
                      <p class="text-h6 font-weight-medium text-blue-700 mb-0">
                        Instansi
                      </p>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- Inovasi Card -->
                <v-col cols="12" sm="6" lg="4" class="pa-2">
                  <v-card
                    class="stat-card elevation-8"
                    rounded="xl"
                    hover
                    :ripple="false"
                  >
                    <v-card-text class="text-center pa-6">
                      <v-avatar
                        size="80"
                        class="mb-4 gradient-sky"
                      >
                        <v-icon size="40" color="white">mdi-lightbulb</v-icon>
                      </v-avatar>
                      <div class="counter-wrapper mb-2">
                        <span class="counter-number">{{ formatNumber(animatedNumbers.inovasi) }}</span>
                      </div>
                      <p class="text-h6 font-weight-medium text-blue-700 mb-0">
                        Inovasi
                      </p>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- Replikasi Card -->
                <v-col cols="12" lg="4" class="pa-2">
                  <v-card
                    class="stat-card elevation-8"
                    rounded="xl"
                    hover
                    :ripple="false"
                  >
                    <v-card-text class="text-center pa-6">
                      <v-avatar
                        size="80"
                        class="mb-4 gradient-indigo"
                      >
                        <v-icon size="40" color="white">mdi-content-copy</v-icon>
                      </v-avatar>
                      <div class="counter-wrapper mb-2">
                        <span class="counter-number">{{ formatNumber(animatedNumbers.replikasi) }}</span>
                      </div>
                      <p class="text-h6 font-weight-medium text-blue-700 mb-0">
                        Replikasi Inovasi
                      </p>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-col cols="12" md="8" lg="6">
              <v-divider class="my-6 border-amber-300"></v-divider>
              <v-btn
                to="/etalase"
                size="large"
                rounded="pill"
                color="primary"
                variant="flat"
                class="px-8 py-3 font-weight-bold text-white shadow-lg hover:shadow-xl transition-all"
                prepend-icon="mdi-eye"
                aria-label="Lihat etalase inovasi lengkap"
              >
                Lihat Etalase Inovasi
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- Animated Background Ornaments -->
    <div class="ornaments">
      <div class="ornament-1"></div>
      <div class="ornament-2"></div>
      <div class="ornament-3"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Statistics data
const stats = ref([
  { id: 'instansi', icon: 'mdi-office-building', number: 320, label: 'Instansi', gradient: 'gradient-blue' },
  { id: 'inovasi', icon: 'mdi-lightbulb', number: 2928, label: 'Inovasi', gradient: 'gradient-sky' },
  { id: 'replikasi', icon: 'mdi-content-copy', number: 20940, label: 'Replikasi Inovasi', gradient: 'gradient-indigo' }
])

// Animated counters
const animatedNumbers = ref({
  instansi: 0,
  inovasi: 0,
  replikasi: 0
})

// Animate counters on mount
onMounted(() => {
  stats.value.forEach(stat => {
    animateCounter(stat.id, stat.number)
  })
})

const animateCounter = (id, target) => {
  const duration = 2000 // 2 seconds
  const steps = 60
  const increment = target / steps
  let current = 0
  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      animatedNumbers.value[id] = target
      clearInterval(timer)
    } else {
      animatedNumbers.value[id] = Math.floor(current)
    }
  }, duration / steps)
}

// Format number with commas
const formatNumber = (num) => {
  return num.toLocaleString('id-ID')
}
</script>

<style scoped>
.stats-section {
  position: relative;
  overflow: hidden;
  background-image: url('/vektor2.jpg');
  background-size: cover;
  background-position: center;
  min-height: 70vh;
  display: flex;
  align-items: center;
}

.stat-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.stat-card:hover::before {
  left: 100%;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.gradient-blue {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
}

.gradient-sky {
  background: linear-gradient(135deg, #0ea5e9, #38bdf8);
}

.gradient-indigo {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
}

.counter-wrapper {
  position: relative;
  display: inline-block;
}

.counter-number {
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  display: block;
  animation: countUp 2s ease-out;
}

@keyframes countUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.ornaments {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.ornament-1 {
  position: absolute;
  top: -40px;
  left: -40px;
  width: 224px;
  height: 224px;
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.15), transparent 70%);
  filter: blur(32px);
  animation: float 6s ease-in-out infinite;
}

.ornament-2 {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 288px;
  height: 288px;
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba(245, 158, 11, 0.15), transparent 70%);
  filter: blur(40px);
  animation: float 8s ease-in-out infinite reverse;
}

.ornament-3 {
  position: absolute;
  top: 50%;
  left: 10%;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba(99, 102, 241, 0.1), transparent 70%);
  filter: blur(24px);
  animation: float 7s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .counter-number {
    font-size: 2.5rem;
  }
  
  .ornament-1,
  .ornament-2,
  .ornament-3 {
    display: none;
  }
}
</style>