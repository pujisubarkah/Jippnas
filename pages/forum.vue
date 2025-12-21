<template>
  <div class="min-h-screen bg-gray-50 font-poppins">
    <!-- Page Header with Gradient -->
    <div class="bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-white flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              Forum Inovasi
            </h1>
            <p class="text-blue-100 mt-2 text-sm">Diskusikan ide inovasi dan berbagi pengetahuan bersama komunitas</p>
          </div>

          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Search -->
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari diskusi..."
                class="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xl transition-all"
              />
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>

            <!-- Create Thread Button -->
            <button
              @click="showNewThread = true"
              class="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-semibold shadow-md hover:shadow-lg hover:scale-105 transform"
            >
              <svg class="inline-block w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Mulai Diskusi
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">

        <!-- Sidebar Kategori -->
        <aside class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-md border border-gray-200 p-6 sticky top-24 hover:shadow-lg transition-all duration-300">
            <h2 class="text-lg font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-5 flex items-center">
              <div class="p-2 bg-linear-to-br from-blue-100 to-purple-100 rounded-xl mr-3">
                <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
              </div>
              <span class="text-gray-900">Kategori</span>
            </h2>
            <ul class="space-y-2">
              <li
                v-for="category in categories"
                :key="category.id"
                @click="selectedCategory = category.id"
                :class="[
                  'p-3 rounded-xl cursor-pointer transition-all duration-300 flex justify-between items-center group hover:scale-105 transform',
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'hover:bg-blue-50 text-gray-700 hover:shadow-sm'
                ]"
              >
                <span :class="selectedCategory === category.id ? 'font-bold' : 'font-medium'">{{ category.name }}</span>
                <span :class="[
                  'text-xs px-2.5 py-1 rounded-full font-semibold',
                  selectedCategory === category.id
                    ? 'bg-white/20 text-white'
                    : 'bg-linear-to-r from-blue-100 to-purple-100 text-blue-700'
                ]">{{ category.threads }}</span>
              </li>
            </ul>

            <!-- Stats -->
            <div class="mt-6 pt-5 border-t border-gray-200">
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-blue-50 p-4 rounded-xl text-center hover:scale-105 transition-transform cursor-pointer">
                  <div class="text-3xl font-bold text-blue-600">{{ totalThreads }}</div>
                  <div class="text-xs text-gray-600 font-medium mt-1">Total Diskusi</div>
                </div>
                <div class="bg-green-50 p-4 rounded-xl text-center hover:scale-105 transition-transform cursor-pointer">
                  <div class="text-3xl font-bold text-green-600">{{ totalReplies }}</div>
                  <div class="text-xs text-gray-600 font-medium mt-1">Total Balasan</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Thread List -->
        <section class="lg:col-span-3 space-y-6">

          <!-- Thread Cards -->
          <div
            v-for="thread in filteredThreads"
            :key="thread.id"
            class="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 hover:border-blue-300 group"
          >
            <div class="flex items-start space-x-4">

              <!-- Votes -->
              <div class="flex flex-col items-center space-y-1 bg-gray-50 rounded-xl p-3 min-w-[70px]">
                <button
                  @click="voteThread(thread.id, 'up')"
                  :class="[
                    'hover:text-blue-600 transition-all duration-200 transform hover:scale-125',
                    userVotes[thread.id] === 'up' ? 'text-blue-600' : 'text-gray-400'
                  ]"
                >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 14l5-5 5 5z"/>
                  </svg>
                </button>
                <span class="text-base font-bold text-gray-700">{{ thread.votes }}</span>
                <button
                  @click="voteThread(thread.id, 'down')"
                  :class="[
                    'hover:text-red-500 transition-all duration-200 transform hover:scale-125',
                    userVotes[thread.id] === 'down' ? 'text-red-500' : 'text-gray-400'
                  ]"
                >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </button>
              </div>

              <!-- Thread Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between">
                  <h3 class="text-lg font-bold text-gray-900 hover:bg-linear-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text hover:text-transparent cursor-pointer line-clamp-2 transition-all duration-300 group-hover:scale-[1.01]">
                    {{ thread.title }}
                  </h3>
                  <div class="flex gap-2 ml-4 shrink-0">
                    <span v-if="thread.isSticky" class="px-3 py-1 text-xs font-bold bg-linear-to-r from-yellow-400 to-orange-500 text-white rounded-full shadow-md animate-pulse">📌 Sticky</span>
                    <span v-if="thread.isLocked" class="px-3 py-1 text-xs font-bold bg-linear-to-r from-red-500 to-pink-600 text-white rounded-full shadow-md">🔒 Locked</span>
                  </div>
                </div>

                <div class="flex items-center text-sm text-gray-500 mt-2 space-x-4">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    {{ thread.author }}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                    {{ thread.replies.length }} balasan
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    {{ thread.views }} dilihat
                  </span>
                </div>

                <!-- Latest Reply Preview -->
                <div v-if="thread.replies.length > 0" class="mt-4 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                  <div class="text-sm flex items-center gap-2">
                    <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      {{ thread.replies[thread.replies.length - 1].name.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <span class="font-bold text-gray-900">{{ thread.replies[thread.replies.length - 1].name }}</span>
                      <span class="text-gray-500 ml-2 text-xs">{{ formatTimeAgo(thread.replies[thread.replies.length - 1].timestamp) }}</span>
                    </div>
                  </div>
                  <p class="text-gray-700 mt-2 line-clamp-2">{{ thread.replies[thread.replies.length - 1].content }}</p>
                </div>

                <!-- Actions -->
                <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div class="flex items-center space-x-4">
                    <button
                      @click="toggleReply(thread.id)"
                      class="text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 hover:gap-2 transition-all group"
                    >
                      <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
                      </svg>
                      Balas
                    </button>
                    <button class="text-sm text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1 hover:gap-2 transition-all group">
                      <svg class="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                      </svg>
                      Bagikan
                    </button>
                  </div>

                  <div class="flex items-center space-x-2">
                    <button
                      @click="likeThread(thread.id)"
                      :class="[
                        'flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-colors',
                        userVotes[thread.id] === 'like'
                          ? 'bg-green-100 text-green-800'
                          : 'text-gray-500 hover:bg-green-50 hover:text-green-700'
                      ]"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
                      </svg>
                      <span>{{ thread.likes || 0 }}</span>
                    </button>
                    <button
                      @click="dislikeThread(thread.id)"
                      :class="[
                        'flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-colors',
                        userVotes[thread.id] === 'dislike'
                          ? 'bg-red-100 text-red-800'
                          : 'text-gray-500 hover:bg-red-50 hover:text-red-700'
                      ]"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.737 3h4.017c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m6-10h-2"/>
                      </svg>
                      <span>{{ thread.dislikes || 0 }}</span>
                    </button>
                  </div>
                </div>

                <!-- Reply Form -->
                <div v-if="replyingTo === thread.id" class="mt-4 p-5 bg-gray-50 rounded-xl border-2 border-blue-200">
                  <textarea
                    v-model="replyForm.content"
                    placeholder="Tulis balasan Anda..."
                    class="w-full p-4 border-2 border-gray-300 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none shadow-sm"
                    rows="3"
                  ></textarea>
                  <div class="flex justify-end space-x-3 mt-4">
                    <button
                      @click="cancelReply"
                      class="px-5 py-2 text-gray-600 hover:text-gray-800 font-semibold hover:bg-gray-100 rounded-lg transition-all"
                    >
                      Batal
                    </button>
                    <button
                      @click="addReply(thread.id)"
                      class="px-5 py-2 bg-green-600 text-gray-900 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                    >
                      Kirim Balasan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredThreads.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Belum ada diskusi</h3>
            <p class="mt-1 text-sm text-gray-500">Mulai diskusi pertama di kategori ini.</p>
          </div>
        </section>
      </div>
    </main>

    <!-- Modal New Thread -->
    <div v-if="showNewThread" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative transform animate-scaleIn">
        <div class="bg-blue-600 p-6 rounded-t-2xl">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
              <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
              </div>
              Buat Diskusi Baru
            </h2>
            <button
              @click="showNewThread = false"
              class="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all transform hover:scale-110"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6">
          <form @submit.prevent="addThread" class="space-y-5">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Judul Diskusi</label>
              <input
                v-model="newThread.title"
                type="text"
                placeholder="Masukkan judul diskusi..."
                required
                class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
              <select
                v-model="newThread.category"
                required
                class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
              >
                <option disabled value="">Pilih kategori</option>
                <option v-for="category in categories" :key="category.id" :value="category.name">{{ category.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">Isi Diskusi</label>
              <textarea
                v-model="newThread.content"
                placeholder="Jelaskan diskusi Anda..."
                required
                rows="4"
                class="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none font-medium"
              ></textarea>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="showNewThread = false"
                class="px-6 py-2.5 text-gray-700 hover:text-gray-900 font-semibold hover:bg-gray-100 rounded-lg transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Buat Diskusi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

/* ================================
   DATA
================================= */
const categories = ref([
  { id: 1, name: 'Diskusi Umum', threads: 245 },
  { id: 2, name: 'Teknologi', threads: 189 },
  { id: 3, name: 'Pelayanan Publik', threads: 156 },
  { id: 4, name: 'Inovasi Digital', threads: 98 },
  { id: 5, name: 'Pengembangan SDM', threads: 76 }
])

const threads = ref([
  {
    id: 1,
    title: 'Ide aplikasi mobile untuk pelaporan masyarakat yang lebih efektif',
    author: 'Maya Sari',
    votes: 12,
    replies: [
      {
        id: 1,
        name: 'Ahmad Rahman',
        content: 'Ide yang bagus! Bagaimana dengan integrasi dengan sistem existing?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        id: 2,
        name: 'Siti Nurhaliza',
        content: 'Setuju, perlu ada fitur tracking progress laporan juga.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
      }
    ],
    views: 456,
    likes: 8,
    dislikes: 1,
    isSticky: false,
    isLocked: false,
    category: 'Teknologi'
  },
  {
    id: 2,
    title: 'Sistem antrian online di kantor pelayanan - pengalaman implementasi',
    author: 'Ahmad Rahman',
    votes: 34,
    replies: [
      {
        id: 3,
        name: 'Dewi Kartika',
        content: 'Di kantor kami sudah berhasil mengurangi waktu tunggu hingga 60%.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
      }
    ],
    views: 892,
    likes: 15,
    dislikes: 0,
    isSticky: true,
    isLocked: false,
    category: 'Pelayanan Publik'
  },
  {
    id: 3,
    title: 'Pelatihan digital untuk pegawai di era pandemi',
    author: 'Budi Santoso',
    votes: 8,
    replies: [],
    views: 234,
    likes: 5,
    dislikes: 0,
    isSticky: false,
    isLocked: false,
    category: 'Pengembangan SDM'
  }
])

/* ================================
   STATE MANAGEMENT
================================= */
const searchQuery = ref('')
const selectedCategory = ref(null)
const replyingTo = ref(null)
const showNewThread = ref(false)

/* ================================
   COMPUTED PROPERTIES
================================= */
const filteredThreads = computed(() => {
  let filtered = threads.value

  // Filter by category
  if (selectedCategory.value) {
    filtered = filtered.filter(thread => {
      const category = categories.value.find(cat => cat.id === selectedCategory.value)
      return thread.category === category?.name
    })
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(thread =>
      thread.title.toLowerCase().includes(query) ||
      thread.author.toLowerCase().includes(query) ||
      thread.content?.toLowerCase().includes(query)
    )
  }

  return filtered
})

const totalThreads = computed(() => threads.value.length)
const totalReplies = computed(() => threads.value.reduce((sum, thread) => sum + thread.replies.length, 0))

/* ================================
   USER INTERACTIONS
================================= */
const userVotes = ref({}) // { threadId: 'up' | 'down' }

const voteThread = (threadId, direction) => {
  const thread = threads.value.find(t => t.id === threadId)
  if (!thread) return

  const currentVote = userVotes.value[threadId]

  // Remove previous vote
  if (currentVote === 'up') thread.votes--
  if (currentVote === 'down') thread.votes++

  // Apply new vote
  if (currentVote === direction) {
    // Remove vote if clicking same button
    delete userVotes.value[threadId]
  } else {
    userVotes.value[threadId] = direction
    if (direction === 'up') thread.votes++
    else thread.votes--
  }
}

/* ================================
   REPLY SYSTEM
=================================== */
const replyForm = ref({ content: '' })

const toggleReply = (threadId) => {
  replyingTo.value = replyingTo.value === threadId ? null : threadId
  replyForm.value.content = ''
}

const cancelReply = () => {
  replyingTo.value = null
  replyForm.value.content = ''
}

const addReply = (threadId) => {
  const thread = threads.value.find(t => t.id === threadId)
  if (thread && replyForm.value.content.trim()) {
    thread.replies.push({
      id: Date.now(),
      name: 'Anda', // In real app, get from auth
      content: replyForm.value.content.trim(),
      timestamp: new Date()
    })
    replyForm.value.content = ''
    replyingTo.value = null
  }
}

/* ================================
   LIKE/DISLIKE SYSTEM
=================================== */
const likeThread = (threadId) => {
  const thread = threads.value.find(t => t.id === threadId)
  if (!thread) return

  if (userVotes.value[`like_${threadId}`]) {
    thread.likes--
    delete userVotes.value[`like_${threadId}`]
  } else {
    thread.likes++
    userVotes.value[`like_${threadId}`] = true

    // Remove dislike if exists
    if (userVotes.value[`dislike_${threadId}`]) {
      thread.dislikes--
      delete userVotes.value[`dislike_${threadId}`]
    }
  }
}

const dislikeThread = (threadId) => {
  const thread = threads.value.find(t => t.id === threadId)
  if (!thread) return

  if (userVotes.value[`dislike_${threadId}`]) {
    thread.dislikes--
    delete userVotes.value[`dislike_${threadId}`]
  } else {
    thread.dislikes++
    userVotes.value[`dislike_${threadId}`] = true

    // Remove like if exists
    if (userVotes.value[`like_${threadId}`]) {
      thread.likes--
      delete userVotes.value[`like_${threadId}`]
    }
  }
}

/* ================================
   NEW THREAD
=================================== */
const newThread = ref({ title: '', category: '', content: '' })

const addThread = () => {
  if (newThread.value.title.trim() && newThread.value.category && newThread.value.content.trim()) {
    threads.value.unshift({
      id: Date.now(),
      title: newThread.value.title.trim(),
      author: 'Anda', // In real app, get from auth
      content: newThread.value.content.trim(),
      replies: [],
      views: 0,
      votes: 0,
      likes: 0,
      dislikes: 0,
      isSticky: false,
      isLocked: false,
      category: newThread.value.category
    })

    newThread.value = { title: '', category: '', content: '' }
    showNewThread.value = false
  }
}

/* ================================
   UTILITIES
=================================== */
const formatTimeAgo = (timestamp) => {
  if (!timestamp) return ''

  const now = new Date()
  const diff = now - new Date(timestamp)
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return 'Baru saja'
  if (minutes < 60) return `${minutes} menit lalu`
  if (hours < 24) return `${hours} jam lalu`
  return `${days} hari lalu`
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.font-poppins {
  font-family: 'Poppins', sans-serif;
}

/* Line clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: linear-gradient(to bottom, #f1f5f9, #e2e8f0);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
  border-radius: 10px;
  transition: all 0.3s;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2563eb, #7c3aed);
}

/* Smooth transitions */
* {
  scroll-behavior: smooth;
}

/* Focus styles */
button:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 3px solid #3b82f6;
  outline-offset: 2px;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

.animate-scaleIn {
  animation: scaleIn 0.3s ease-out;
}

/* Pulse animation */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

/* Button ripple effect */
button {
  position: relative;
  overflow: hidden;
}
</style>
