<template>
  <div class="min-h-screen bg-primary">
    <!-- Hero Section -->
    <div class="bg-blue-800 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <div class="flex justify-center mb-6">
            <div class="p-4 bg-white/20 rounded-full backdrop-blur-sm">
              <svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ $t('pages.contact.title') }}</h1>
          <p class="text-xl text-blue-100 max-w-2xl mx-auto">{{ $t('pages.contact.subtitle') }}</p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Contact Form -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-lg p-8 border border-blue-200">
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-gray-800 mb-2">Kirim Pesan</h2>
              <p class="text-gray-600">Isi formulir di bawah ini dan tim kami akan segera merespons pertanyaan Anda</p>
            </div>

            <form @submit.prevent="submitForm" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="relative">
                  <label for="nama" class="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="nama"
                      v-model="form.nm_pengirim"
                      class="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  </div>
                </div>

                <div class="relative">
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      v-model="form.email_pengirim"
                      class="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                      placeholder="Masukkan alamat email"
                      required
                    />
                  </div>
                </div>
              </div>

              <div class="relative">
                <label for="judul" class="block text-sm font-medium text-gray-700 mb-2">Judul Pertanyaan</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="judul"
                    v-model="form.judul"
                    class="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                    placeholder="Masukkan judul pertanyaan"
                    required
                  />
                </div>
              </div>

              <div class="relative">
                <label for="jenis" class="block text-sm font-medium text-gray-700 mb-2">Jenis Pertanyaan</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                  </div>
                  <select
                    id="jenis"
                    v-model="form.jenis"
                    class="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Pilih Jenis Pertanyaan</option>
                    <option value="Teknis">Teknis</option>
                    <option value="Non Teknis">Non Teknis</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="relative">
                <label for="deskripsi" class="block text-sm font-medium text-gray-700 mb-2">Deskripsi Lengkap</label>
                <div class="relative">
                  <div class="absolute top-4 left-4 pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/>
                    </svg>
                  </div>
                  <textarea
                    id="deskripsi"
                    v-model="form.deskripsi"
                    rows="6"
                    class="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-vertical bg-gray-50/50 hover:bg-white"
                    placeholder="Jelaskan pertanyaan atau masalah Anda secara detail..."
                    required
                  ></textarea>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="bg-primary text-white px-8 py-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none inline-flex items-center justify-center gap-3"
                >
                  <svg v-if="isSubmitting" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                  </svg>
                  <span>{{ isSubmitting ? 'Mengirim...' : 'Kirim Pesan' }}</span>
                </button>

                <button
                  type="button"
                  @click="resetForm"
                  class="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-500/20 focus:ring-offset-2 transition-all duration-200 font-semibold hover:border-gray-400 inline-flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  Reset Form
                </button>
              </div>
            </form>

            <!-- Success Message -->
            <div v-if="submitSuccess" class="mt-6 p-6 bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl animate-fade-in">
              <div class="flex items-center">
                <div class="shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-green-800 font-semibold">Pesan Terkirim!</h3>
                  <p class="text-green-700 text-sm mt-1">Terima kasih atas pesan Anda. Tim kami akan segera menghubungi Anda dalam 1-2 hari kerja.</p>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="submitError" class="mt-6 p-6 bg-linear-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl animate-fade-in">
              <div class="flex items-center">
                <div class="shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-red-800 font-semibold">Terjadi Kesalahan</h3>
                  <p class="text-red-700 text-sm mt-1">{{ submitError }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="space-y-6">
          <!-- Contact Information Card -->
          <div class="bg-white rounded-2xl shadow-lg p-6 border border-blue-200">
            <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Informasi Kontak
            </h3>
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <div class="shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-800">Telepon</p>
                  <p class="text-gray-600 text-sm">+62 21 1234 5678</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-800">Email</p>
                  <p class="text-gray-600 text-sm">info@jippnas.go.id</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-800">Alamat</p>
                  <p class="text-gray-600 text-sm">Jl. Veteran No. 10, Jakarta Pusat</p>
                </div>
              </div>
            </div>
          </div>

          <!-- FAQ Link Card -->
          <div class="bg-white rounded-2xl p-6 border border-blue-200">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Pertanyaan Umum
            </h3>
            <p class="text-gray-600 text-sm mb-4">Temukan jawaban untuk pertanyaan yang sering ditanyakan di halaman FAQ kami.</p>
            <a
              href="/faq"
              class="inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium text-sm shadow-sm"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              Lihat FAQ
            </a>
          </div>

          <!-- Response Time Card -->
          <div class="bg-white rounded-2xl p-6 border border-blue-200">
            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Waktu Respon
            </h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Email</span>
                <span class="text-sm font-medium text-green-700">1-2 hari kerja</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Telepon</span>
                <span class="text-sm font-medium text-green-700">Segera</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Kompleks</span>
                <span class="text-sm font-medium text-green-700">3-5 hari kerja</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  nm_pengirim: '',
  email_pengirim: '',
  judul: '',
  jenis: '',
  deskripsi: ''
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')

const submitForm = async () => {
  isSubmitting.value = true
  submitError.value = ''
  submitSuccess.value = false

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // In real implementation, you would send the form data to your backend
    console.log('Form submitted:', form.value)

    submitSuccess.value = true
    resetForm()
  } catch (error) {
    submitError.value = 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.'
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  form.value = {
    nm_pengirim: '',
    email_pengirim: '',
    judul: '',
    jenis: '',
    deskripsi: ''
  }
  submitSuccess.value = false
  submitError.value = ''
}
</script>

<style scoped>
/* Hero background pattern */
.bg-primary {
  background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0);
  background-size: 20px 20px;
}

/* Custom animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Backdrop blur support */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Custom select arrow styling */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

/* Hover effects for form inputs */
input:hover, textarea:hover, select:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Focus effects */
input:focus, textarea:focus, select:focus {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
}

/* Button hover effects */
button:hover:not(:disabled) {
  transform: translateY(-2px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid-cols-1.lg\\:grid-cols-3 {
    grid-template-columns: 1fr;
  }

  .lg\\:col-span-2 {
    grid-column: span 1;
  }
}
</style>