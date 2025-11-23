<template>
  <div class="max-w-6xl mx-auto px-4 py-6">
    <h2 class="text-2xl font-bold mb-6 text-blue-700">Penjadwalan Event</h2>

    <!-- Header tanpa tombol tambah -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold">Kalender & Daftar Event</h3>
      <p class="text-sm text-gray-500">
        Klik <strong>tanggal</strong> untuk tambah event, atau klik <strong>event</strong> yang sudah ada untuk edit.
      </p>

    <!-- Section Kalender -->
    <div class="bg-white rounded-xl shadow p-6 mb-8">
      <div class="rounded-lg overflow-hidden border">
        <ClientOnly>
          <FullCalendar :options="calendarOptions" />
        </ClientOnly>
      </div>
      <p class="mt-3 text-xs text-gray-500 italic">
        💡 Klik tanggal untuk tambah event, atau klik event untuk detail.
      </p>
    </div>

    <!-- Section Daftar Event -->
    <div class="bg-white rounded-xl shadow p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Event Mendatang (30 hari)</h3>
        <span class="text-sm text-gray-500">{{ upcomingEvents?.length || 0 }} event</span>
      </div>

      <div v-if="upcomingEvents.length === 0" class="text-center py-8 text-gray-500">
        <CalendarDaysIcon class="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p>Tidak ada event dalam 30 hari ke depan.</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="event in upcomingEvents"
          :key="event.id"
          class="border-l-4 border-blue-500 pl-4 py-3 bg-linear-to-r from-blue-50 to-white rounded-lg"
        >
          <div class="flex flex-wrap justify-between items-start gap-2">
            <h4 class="font-semibold text-gray-800">{{ event.title }}</h4>
            <span
              class="text-xs font-medium px-2 py-1 rounded-full"
              :class="eventTypeClass(event.type)"
            >
              {{ formatEventType(event.type) }}
            </span>
          </div>
          <div class="mt-1 flex items-center text-sm text-gray-600">
            <CalendarIcon class="w-4 h-4 mr-1" />
            {{ formatDate(event.date) }}, {{ event.time }}
          </div>
          <p v-if="event.description" class="mt-2 text-sm text-gray-700 line-clamp-2">
            {{ event.description }}
          </p>
          <a
            v-if="event.link"
            :href="event.link"
            target="_blank"
            class="mt-2 inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Buka Event
            <ExternalLinkIcon class="w-3 h-3 ml-1" />
          </a>
        </div>
      </div>
    </div>

    <!-- Modal Tambah/Edit Event -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-transparent-100 bg-opacity-30"
      @click="closeModal"
    >
        <div
          class="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 relative"
          @click.stop
        >
          <button
            @click="closeModal"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <XIcon class="w-5 h-5" />
          </button>
          <h3 class="text-xl font-bold text-gray-800 mb-1">
            {{ editingEvent ? 'Edit Event' : 'Tambah Event Baru' }}
          </h3>
          <p v-if="!editingEvent" class="text-sm text-gray-500 mb-1">
            Tanggal: <span class="font-medium">{{ formatDate(eventForm.date) }}</span>
          </p>
          <p class="text-sm text-gray-500 mb-5">
            Isi detail event yang akan dijadwalkan.
          </p>

          <form @submit.prevent="submitEvent" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Judul Event</label>
              <input
                v-model="eventForm.title"
                type="text"
                required
                maxlength="100"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Contoh: Webinar Transformasi Digital"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <textarea
                v-model="eventForm.description"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Opsional. Jelaskan tujuan atau topik event."
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                <input
                  v-model="eventForm.date"
                  type="date"
                  required
                  :min="minDateString"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Waktu</label>
                <input
                  v-model="eventForm.time"
                  type="time"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipe Event</label>
              <select
                v-model="eventForm.type"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="webinar">Webinar</option>
                <option value="podcast">Podcast</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Link Event (Opsional)</label>
              <input
                v-model="eventForm.link"
                type="url"
                placeholder="https://zoom.us/j/123456"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
              >
                <CheckIcon class="w-4 h-4 mr-1" />
                {{ editingEvent ? 'Perbarui' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

// Icons
import {
  XIcon,
  CalendarIcon,
  CalendarDaysIcon,
  ExternalLinkIcon,
  CheckIcon
} from 'lucide-vue-next'

definePageMeta({
  layout: 'sidebar'
})

// === STATE ===
const showModal = ref(false)
const showDate = ref(new Date())
const editingEvent = ref(null)

const eventForm = ref({
  id: null,
  title: '',
  description: '',
  date: '',
  time: '09:00',
  type: 'webinar',
  link: ''
})

// Dummy data
const events = useState('events', () => [
  {
    id: 1,
    title: 'Webinar Inisiatif Digital Pemerintah',
    description: 'Strategi penerapan e-government di daerah.',
    date: '2025-11-23',
    time: '10:00',
    type: 'webinar',
    link: 'https://zoom.us/j/1234567890'
  },
  {
    id: 2,
    title: 'Workshop Analisis Data Publik',
    description: 'Pelatihan dasar Python & visualisasi untuk ASN.',
    date: '2025-11-26',
    time: '13:30',
    type: 'workshop',
    link: ''
  },
  {
    id: 3,
    title: 'Podcast: Partisipasi Warga & Teknologi',
    description: 'Diskusi Civic Tech dengan komunitas lokal.',
    date: '2025-12-02',
    time: '16:00',
    type: 'podcast',
    link: 'https://anchor.fm/civic-tech/ep1'
  }
])

// === COMPUTED ===
const minDate = new Date(2025, 0, 1)
const maxDate = new Date(2026, 11, 31)
const minDateString = minDate.toISOString().split('T')[0]

const computedEvents = computed(() =>
  events.value.map(event => {
    const start = new Date(`${event.date}T${event.time}`)
    const end = new Date(start.getTime() + 90 * 60 * 1000)
    return {
      id: event.id,
      start,
      end,
      title: event.title,
      classes: [`event-${event.type}`],
      data: event
    }
  })
)

const calendarOptions = computed(() => process.client ? {
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  events: computedEvents.value,
  dateClick: handleDateClick,
  eventClick: handleEventClick,
  headerToolbar: {
    left: 'prev,next',
    center: 'title',
    right: ''
  },
  height: 'auto',
  dayMaxEvents: true,
  moreLinkClick: 'popover'
} : {})

const upcomingEvents = useState('upcomingEvents', () => [])

// === METHODS ===
function openAddEventModal(date = null) {
  editingEvent.value = null
  eventForm.value = {
    id: null,
    title: '',
    description: '',
    date: date ? date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    time: '09:00',
    type: 'webinar',
    link: ''
  }
  showModal.value = true
}

function handleDateClick(info) {
  openAddEventModal(info.date)
}

function handleEventClick(info) {
  const eventData = info.event.extendedProps.data
  if (!eventData) return

  editingEvent.value = eventData
  eventForm.value = { ...eventData }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingEvent.value = null
}

function submitEvent() {
  if (editingEvent.value?.id) {
    const idx = events.value.findIndex(e => e.id === editingEvent.value.id)
    if (idx !== -1) events.value[idx] = { ...eventForm.value }
  } else {
    events.value.push({
      id: Date.now(),
      ...eventForm.value
    })
  }
  // Update upcoming events
  const now = new Date()
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() + 30)
  upcomingEvents.value = events.value
    .map(e => ({ ...e, dateObj: new Date(e.date) }))
    .filter(e => e.dateObj >= now && e.dateObj <= cutoff)
    .sort((a, b) => a.dateObj - b.dateObj)
  closeModal()
}

// === HELPERS ===
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function formatEventType(type) {
  return ({ webinar: 'Webinar', podcast: 'Podcast', workshop: 'Workshop', seminar: 'Seminar', lainnya: 'Lainnya' })[type] || type
}

function eventTypeClass(type) {
  return {
    webinar: 'bg-blue-100 text-blue-800',
    podcast: 'bg-purple-100 text-purple-800',
    workshop: 'bg-amber-100 text-amber-800',
    seminar: 'bg-emerald-100 text-emerald-800',
    lainnya: 'bg-gray-100 text-gray-800'
  }[type] || 'bg-gray-100 text-gray-800'
}

onMounted(() => {
  showDate.value = new Date()
  // Calculate upcoming events
  const now = new Date()
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() + 30)
  upcomingEvents.value = events.value
    .map(e => ({ ...e, dateObj: new Date(e.date) }))
    .filter(e => e.dateObj >= now && e.dateObj <= cutoff)
    .sort((a, b) => a.dateObj - b.dateObj)
})
</script>

<style scoped>
/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Calendar styling */
.fc-header-toolbar {
  margin-bottom: 1rem;
}
.fc-button {
  background: #3b82f6 !important;
  border: none !important;
}
.fc-button:hover {
  background: #2563eb !important;
}
.fc-daygrid-day:hover {
  background: #f0f9ff;
}
.fc-event {
  cursor: pointer;
}
</style>