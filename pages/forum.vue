<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navbar -->
    <header class="bg-white shadow-sm sticky top-0 z-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <h1 class="text-xl font-bold text-blue-600">Forum Inovasi</h1>
        <div class="flex items-center space-x-4">
          <input type="text" placeholder="Cari thread..." class="px-3 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <button class="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Login</button>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Sidebar Kategori -->
      <aside class="lg:col-span-1">
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <h2 class="font-semibold mb-4">Kategori</h2>
          <ul class="space-y-2">
            <li v-for="category in categories" :key="category.id" class="p-2 rounded hover:bg-blue-50 cursor-pointer flex justify-between items-center">
              <span>{{ category.name }}</span>
              <span class="text-xs text-gray-500">{{ category.threads }}</span>
            </li>
          </ul>
        </div>
      </aside>

      <!-- Thread List -->
      <section class="lg:col-span-3 space-y-4">
        <!-- Tombol Mulai Diskusi -->
        <div class="flex justify-end mb-4">
          <button @click="showNewThread = true"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Mulai Diskusi Baru
          </button>
        </div>

        <div v-for="thread in threads" :key="thread.id" class="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition relative">
          <div class="flex items-start space-x-4">
            <div class="flex flex-col items-center text-gray-400 text-sm">
              <button class="hover:text-blue-600">▲</button>
              <span>{{ thread.votes }}</span>
              <button class="hover:text-red-500">▼</button>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                {{ thread.title }}
                <span v-if="thread.isSticky" class="ml-2 px-2 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded">📌 Sticky</span>
                <span v-if="thread.isLocked" class="ml-2 px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-800 rounded">🔒 Locked</span>
              </h3>
              <div class="text-sm text-gray-500 mt-1 flex space-x-4">
                <span>oleh {{ thread.author }}</span>
                <span>{{ thread.replies }} balasan</span>
                <span>{{ thread.views }} dilihat</span>
              </div>

              <!-- Replies Preview -->
              <div v-if="thread.replies && thread.replies.length" class="mt-3 pl-4 border-l border-gray-200 space-y-2">
                <div v-for="reply in thread.replies" :key="reply.id" class="text-gray-700 text-sm">
                  <strong>{{ reply.name }}:</strong> {{ reply.content }}
                </div>
              </div>

              <button @click="replyingTo = thread.id" class="mt-2 text-sm text-blue-600 hover:underline">Balas</button>

              <!-- Reply Form -->
              <div v-if="replyingTo === thread.id" class="mt-2">
                <input v-model="replyForm.content" placeholder="Tulis balasan..." class="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <button @click="addReply(thread.id)" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Kirim</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Modal Form Diskusi Baru -->
    <div v-if="showNewThread" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 class="text-xl font-bold mb-4">Buat Diskusi Baru</h2>
        <form @submit.prevent="addThread" class="flex flex-col gap-4">
          <input v-model="newThread.title" type="text" placeholder="Judul Diskusi" required
            class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <select v-model="newThread.category" required
            class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option disabled value="">Pilih Kategori</option>
            <option v-for="category in categories" :key="category.id" :value="category.name">{{ category.name }}</option>
          </select>
          <textarea v-model="newThread.content" placeholder="Isi diskusi..." required
            class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none min-h-[100px]"></textarea>
          <div class="flex justify-end gap-2">
            <button type="button" @click="showNewThread = false" class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Batal</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Buat Diskusi</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const categories = ref([
  { id: 1, name: 'Diskusi Umum', threads: 245 },
  { id: 2, name: 'Teknologi', threads: 189 },
  { id: 3, name: 'Pelayanan Publik', threads: 156 },
]);

const threads = ref([
  {
    id: 1,
    title: 'Ide aplikasi mobile untuk pelaporan masyarakat',
    author: 'Maya Sari',
    votes: 12,
    replies: [{ id: 1, name: 'Ahmad', content: 'Bagus sekali!' }],
    views: 456,
    isSticky: false,
    isLocked: false
  },
  {
    id: 2,
    title: 'Sistem antrian online di kantor pelayanan',
    author: 'Ahmad Rahman',
    votes: 34,
    replies: [],
    views: 892,
    isSticky: true,
    isLocked: false
  },
]);

const replyingTo = ref(null);
const replyForm = ref({ content: '' });

const showNewThread = ref(false);
const newThread = ref({ title: '', category: '', content: '' });

function addReply(threadId) {
  const thread = threads.value.find(t => t.id === threadId);
  if (thread) {
    thread.replies.push({ id: Date.now(), name: 'User', content: replyForm.value.content });
  }
  replyForm.value.content = '';
  replyingTo.value = null;
}

function addThread() {
  threads.value.unshift({
    id: Date.now(),
    title: newThread.value.title,
    author: 'User',
    votes: 0,
    replies: [],
    views: 0,
    isSticky: false,
    isLocked: false
  });
  newThread.value = { title: '', category: '', content: '' };
  showNewThread.value = false;
}
</script>
