<template>
  <div class="stats-section">
    <v-container fluid class="pa-0">
      <v-row justify="center" class="py-16">
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

          <v-row justify="center" class="mb-12">
            <v-col cols="12" md="10" lg="8">
              <v-row class="justify-center" dense>
                <!-- Instansi -->
                <v-col cols="12" sm="4" class="d-flex justify-center">
                  <div class="stat-circle elevation-4 gradient-blue">
                    <div class="stat-content">
                      <v-icon size="36" color="white" class="mb-3">mdi-office-building</v-icon>
                      <div class="counter-number">{{ formatNumber(animatedNumbers.instansi) }}</div>
                      <div class="stat-label">Instansi</div>
                    </div>
                  </div>
                </v-col>

                <!-- Inovasi -->
                <v-col cols="12" sm="4" class="d-flex justify-center">
                  <div class="stat-circle elevation-4 gradient-sky">
                    <div class="stat-content">
                      <v-icon size="36" color="white" class="mb-3">mdi-lightbulb</v-icon>
                      <div class="counter-number">{{ formatNumber(animatedNumbers.inovasi) }}</div>
                      <div class="stat-label">Inovasi</div>
                    </div>
                  </div>
                </v-col>

                <!-- Replikasi -->
                <v-col cols="12" sm="4" class="d-flex justify-center">
                  <div class="stat-circle elevation-4 gradient-indigo">
                    <div class="stat-content">
                      <v-icon size="36" color="white" class="mb-3">mdi-content-copy</v-icon>
                      <div class="counter-number">{{ formatNumber(animatedNumbers.replikasi) }}</div>
                      <div class="stat-label">Replikasi</div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-col cols="12" md="8" lg="6">
              <v-divider class="my-6 border-amber-300"></v-divider>
              <v-btn
                to="/etalase"
                size="x-large"
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

const animatedNumbers = ref({
  instansi: 0,
  inovasi: 0,
  replikasi: 0
})

const stats = [
  { id: 'instansi', target: 320 },
  { id: 'inovasi', target: 2928 },
  { id: 'replikasi', target: 20940 }
]

onMounted(() => {
  stats.forEach(stat => animateCounter(stat.id, stat.target))
})

const animateCounter = (id, target) => {
  const duration = 2000
  const steps = 60
  const increment = target / steps
  let current = 0
  const timer = setInterval(() => {
    current += increment
    animatedNumbers.value[id] = current >= target ? target : Math.floor(current)
    if (current >= target) clearInterval(timer)
  }, duration / steps)
}

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
  min-height: 80vh;
  display: flex;
  align-items: center;
}

/* Circular stat cards */
.stat-circle {
  width: 240px;
  height: 240px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  margin: 1.5rem auto;
  cursor: default;
  overflow: hidden;
}

.stat-circle::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: inherit;
  z-index: -1;
}

.stat-circle:hover {
  transform: scale(1.05) translateY(-8px);
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.12),
    inset 0 0 0 2px rgba(255, 255, 255, 0.2);
}

.stat-content {
  text-align: center;
  z-index: 2;
  color: white;
  padding: 0 16px;
}

.counter-number {
  font-size: 2.5rem;
  font-weight: 900;
  line-height: 1.1;
  margin: 0.5rem 0;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.stat-label {
  font-size: 1.125rem;
  font-weight: 600;
  opacity: 0.95;
}

/* Gradients */
.gradient-blue {
  background: linear-gradient(135deg, #1d4ed8, #3b82f6);
}

.gradient-sky {
  background: linear-gradient(135deg, #0284c7, #0ea5e9);
}

.gradient-indigo {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
}

/* Background ornaments (same animation, but adjusted size/position) */
.ornaments {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.ornament-1 {
  position: absolute;
  top: -60px;
  left: -60px;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.15), transparent 70%);
  filter: blur(40px);
  animation: float 8s ease-in-out infinite;
}

.ornament-2 {
  position: absolute;
  bottom: -80px;
  right: -80px;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba(245, 158, 11, 0.1), transparent 70%);
  filter: blur(50px);
  animation: float 10s ease-in-out infinite reverse;
}

.ornament-3 {
  position: absolute;
  top: 55%;
  left: 5%;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba(99, 102, 241, 0.08), transparent 70%);
  filter: blur(28px);
  animation: float 9s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-25px) rotate(180deg);
  }
}

/* Mobile adjustments */
@media (max-width: 600px) {
  .stat-circle {
    width: 200px;
    height: 200px;
  }
  .counter-number {
    font-size: 2rem;
  }
  .stat-label {
    font-size: 1rem;
  }

  .ornament-1,
  .ornament-2,
  .ornament-3 {
    display: none;
  }
}
</style>