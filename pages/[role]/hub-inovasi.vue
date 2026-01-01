<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Hub Inovasi - Survey Management</h1>
    <v-card>
      <v-card-header>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openAddModal" :disabled="loading">
          Tambah Survey Baru
        </v-btn>
      </v-card-header>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="surveys"
          :items-per-page="10"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:item.isActive="{ item }">
            <v-chip :color="item.isActive ? 'green' : 'grey'" size="small">
              {{ item.isActive ? 'Aktif' : 'Tidak Aktif' }}
            </v-chip>
          </template>
          <template v-slot:item.aspects="{ item }">
            {{ item.aspects.length }} aspek
          </template>
          <template v-slot:item.aksi="{ item }">
            <div class="d-flex">
              <v-btn icon small color="primary" @click="viewSurvey(item)" title="Lihat">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn icon small color="primary" @click="editSurvey(item)" title="Edit">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small :color="item.isActive ? 'orange' : 'green'" @click="toggleSurveyStatus(item)" :title="item.isActive ? 'Nonaktifkan' : 'Aktifkan'">
                <v-icon>{{ item.isActive ? 'mdi-close-circle' : 'mdi-check-circle' }}</v-icon>
              </v-btn>
              <v-btn icon small color="red" @click="deleteSurvey(item)" title="Hapus">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Modal Tambah/Edit Survey -->
    <v-dialog v-model="showModal" max-width="1000px" persistent scrollable>
      <v-card class="pa-6">
        <v-card-title class="text-h5 pa-0 mb-4">
          {{ isEditing ? 'Edit Survey' : 'Tambah Survey Baru' }}
        </v-card-title>
        <v-card-text class="pa-0" style="max-height: 70vh;">
          <v-form @submit.prevent="saveSurvey" class="space-y-4">
            <v-text-field
              v-model="currentSurvey.title"
              label="Judul Survey *"
              required
              variant="outlined"
              placeholder="Masukkan judul survey"
            ></v-text-field>

            <v-textarea
              v-model="currentSurvey.description"
              label="Deskripsi Survey"
              rows="3"
              variant="outlined"
              placeholder="Masukkan deskripsi survey"
            ></v-textarea>

            <!-- Aspects Section -->
            <div class="mt-6">
              <div class="d-flex justify-space-between align-center mb-4">
                <h3 class="text-h6">Aspek Kuesioner</h3>
                <v-btn color="green" @click="addAspect" size="small">
                  <v-icon left>mdi-plus</v-icon>
                  Tambah Aspek
                </v-btn>
              </div>

              <div v-if="currentSurvey.aspects.length === 0" class="text-center py-8 border-dashed border-2 rounded">
                <v-icon size="48" color="grey">mdi-folder-outline</v-icon>
                <p class="text-grey mt-2">Belum ada aspek</p>
                <p class="text-grey text-caption">Klik tombol "Tambah Aspek" untuk mulai</p>
              </div>

              <!-- Aspect Cards -->
              <v-card
                v-for="(aspect, aIndex) in currentSurvey.aspects"
                :key="aIndex"
                class="mb-6 pa-4"
                elevation="3"
              >
                <!-- Aspect Header -->
                <div class="d-flex justify-space-between align-center mb-4">
                  <v-text-field
                    v-model="aspect.name"
                    :label="`Nama Aspek ${aIndex + 1} *`"
                    variant="outlined"
                    density="compact"
                    placeholder="Contoh: Kepuasan Pengguna, Kualitas Layanan"
                    class="grow mr-2"
                    hide-details
                  ></v-text-field>
                  <v-btn icon size="small" color="red" @click="removeAspect(aIndex)" title="Hapus Aspek">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>

                <!-- Questions in Aspect -->
                <div class="ml-4">
                  <div class="d-flex justify-space-between align-center mb-3">
                    <h4 class="text-subtitle-1">Pertanyaan</h4>
                    <v-btn color="primary" @click="addQuestion(aIndex)" size="x-small" variant="outlined">
                      <v-icon left size="small">mdi-plus</v-icon>
                      Tambah Pertanyaan
                    </v-btn>
                  </div>

                  <div v-if="aspect.questions.length === 0" class="text-center py-4 border-dashed border rounded mb-3">
                    <p class="text-grey text-caption">Belum ada pertanyaan dalam aspek ini</p>
                  </div>

                  <v-card
                    v-for="(question, qIndex) in aspect.questions"
                    :key="qIndex"
                    class="mb-3 pa-3"
                    elevation="1"
                    color="grey-lighten-5"
                  >
                    <div class="d-flex justify-space-between align-start mb-3">
                      <v-text-field
                        v-model="question.text"
                        :label="`Pertanyaan ${qIndex + 1} *`"
                        variant="outlined"
                        density="compact"
                        placeholder="Masukkan pertanyaan"
                        class="grow mr-2"
                        hide-details
                      ></v-text-field>
                      <v-btn icon size="x-small" color="red" @click="removeQuestion(aIndex, qIndex)">
                        <v-icon size="small">mdi-close</v-icon>
                      </v-btn>
                    </div>

                    <v-select
                      v-model="question.type"
                      :items="[
                        { title: 'Pilihan Tunggal', value: 'single' },
                        { title: 'Pilihan Ganda', value: 'multiple' }
                      ]"
                      label="Tipe Pertanyaan"
                      variant="outlined"
                      density="compact"
                      class="mb-3"
                      hide-details
                    ></v-select>

                    <v-text-field
                      v-model="question.weight"
                      label="Bobot Pertanyaan"
                      type="number"
                      step="0.01"
                      variant="outlined"
                      density="compact"
                      class="mb-3"
                      hide-details
                      placeholder="1.00"
                    ></v-text-field>

                    <div class="mb-3">
                      <label class="text-caption font-weight-medium">Pilihan Jawaban & Skor *</label>
                      <div
                        v-for="(option, oIndex) in question.options"
                        :key="oIndex"
                        class="d-flex align-center mb-2"
                      >
                        <span class="mr-2 text-caption" style="min-width: 20px;">{{ String.fromCharCode(65 + oIndex) }}.</span>
                        <v-text-field
                          v-model="option.text"
                          :placeholder="`Pilihan ${String.fromCharCode(65 + oIndex)}`"
                          variant="outlined"
                          density="compact"
                          hide-details
                          class="grow"
                        ></v-text-field>
                        <v-text-field
                          v-model.number="option.score"
                          type="number"
                          placeholder="Skor"
                          variant="outlined"
                          density="compact"
                          hide-details
                          class="ml-2"
                          style="max-width: 100px;"
                          min="0"
                        ></v-text-field>
                        <v-btn
                          v-if="question.options.length > 2"
                          icon
                          size="x-small"
                          color="red"
                          @click="removeOption(aIndex, qIndex, oIndex)"
                          class="ml-2"
                        >
                          <v-icon size="small">mdi-close</v-icon>
                        </v-btn>
                      </div>
                      <v-btn
                        @click="addOption(aIndex, qIndex)"
                        size="small"
                        variant="text"
                        color="blue"
                        class="mt-1"
                      >
                        <v-icon left size="small">mdi-plus</v-icon>
                        Tambah Pilihan
                      </v-btn>
                    </div>

                    <v-checkbox
                      v-model="question.required"
                      label="Wajib dijawab"
                      density="compact"
                      hide-details
                    ></v-checkbox>

                    <!-- Evidence Support Section -->
                    <v-divider class="my-3"></v-divider>
                    
                    <div class="mb-3">
                      <v-checkbox
                        v-model="question.requireEvidence"
                        label="Memerlukan Bukti Dukung"
                        density="compact"
                        hide-details
                        class="mb-2"
                      ></v-checkbox>

                      <v-text-field
                        v-if="question.requireEvidence"
                        v-model="question.evidenceLabel"
                        label="Label Bukti Dukung"
                        variant="outlined"
                        density="compact"
                        placeholder="Contoh: Jelaskan alasan Anda, Upload dokumen pendukung"
                        hint="Label yang akan ditampilkan untuk kolom bukti dukung"
                        persistent-hint
                      ></v-text-field>
                    </div>
                  </v-card>
                </div>
              </v-card>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-0 mt-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeModal" :disabled="loading">Batal</v-btn>
          <v-btn variant="outlined" color="primary" @click="previewSurvey" :disabled="loading">
            <v-icon left>mdi-eye</v-icon>
            Preview
          </v-btn>
          <v-btn color="primary" @click="saveSurvey" :loading="loading" :disabled="loading">
            {{ isEditing ? 'Update' : 'Simpan' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Preview Modal -->
    <v-dialog v-model="showPreview" max-width="800px" scrollable>
      <v-card class="pa-6">
        <v-card-title class="pa-0 mb-4 d-flex justify-space-between align-center">
          <h2 class="text-h5">Preview Survey</h2>
          <v-btn icon size="small" @click="showPreview = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-0" style="max-height: 70vh;">
          <div class="mb-6">
            <h3 class="text-h5 font-weight-bold mb-2">{{ currentSurvey.title }}</h3>
            <p class="text-body-2 text-grey-darken-1 mb-3">{{ currentSurvey.description }}</p>
            <div v-for="(aspect, aIndex) in currentSurvey.aspects" :key="aIndex" class="mb-6">
              <h4 class="text-h6 font-weight-bold mb-2">{{ aIndex + 1 }}. {{ aspect.name }}</h4>
              <div v-for="(question, qIndex) in aspect.questions" :key="qIndex" class="mb-4">
                <div class="mb-2">
                  <span class="font-weight-medium">{{ qIndex + 1 }}. {{ question.text }}</span>
                  <v-chip v-if="question.required" size="x-small" color="red" class="ml-2">Wajib</v-chip>
                </div>
                <div v-if="question.type === 'single'">
                  <v-radio-group>
                    <v-radio
                      v-for="(option, oIndex) in question.options"
                      :key="oIndex"
                      :value="oIndex"
                      disabled
                    >
                      <template v-slot:label>
                        <span>{{ String.fromCharCode(65 + oIndex) }}. {{ option.text }}</span>
                        <v-chip size="x-small" color="primary" class="ml-2">Skor: {{ option.score }}</v-chip>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </div>
                <div v-else>
                  <v-checkbox
                    v-for="(option, oIndex) in question.options"
                    :key="oIndex"
                    disabled
                    hide-details
                  >
                    <template v-slot:label>
                      <span>{{ String.fromCharCode(65 + oIndex) }}. {{ option.text }}</span>
                      <v-chip size="x-small" color="primary" class="ml-2">Skor: {{ option.score }}</v-chip>
                    </template>
                  </v-checkbox>
                </div>
                <!-- Evidence Support Preview -->
                <div v-if="question.requireEvidence" class="mt-3 pa-3 bg-blue-lighten-5 rounded">
                  <v-icon size="small" color="blue" class="mr-2">mdi-file-document-outline</v-icon>
                  <span class="text-caption font-weight-medium">{{ question.evidenceLabel || 'Bukti Dukung' }}</span>
                  <v-textarea
                    placeholder="Responden akan mengisi bukti dukung di sini..."
                    rows="2"
                    variant="outlined"
                    density="compact"
                    disabled
                    class="mt-2"
                  ></v-textarea>
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="pa-0 mt-6">
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showPreview = false">Tutup Preview</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

definePageMeta({
  layout: 'sidebar'
})

// State
const showModal = ref(false)
const showPreview = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const loading = ref(false)

// Data table headers
const headers = [
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Judul Survey', key: 'title' },
  { title: 'Deskripsi', key: 'description' },
  { title: 'Aspek', key: 'aspects', width: '100px' },
  { title: 'Status', key: 'isActive', width: '120px' },
  { title: 'Responden', key: 'responses', width: '100px' },
  { title: 'Aksi', key: 'aksi', sortable: false, width: '200px' }
]

// Survey List
const surveys = ref([])

// Current Survey Form
const currentSurvey = reactive({
  title: '',
  description: '',
  aspects: []
})

// Fetch surveys from API
const fetchSurveys = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/survey-instruments')
    if (response.success) {
      surveys.value = response.data.map(survey => ({
        ...survey,
        responses: 0, // TODO: count from responses table
        aspects: survey.aspects || []
      }))
    }
  } catch (error) {
    console.error('Error fetching surveys:', error)
    toast.error('Gagal memuat data survey')
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchSurveys()
})

// Methods
const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  currentSurvey.title = ''
  currentSurvey.description = ''
  currentSurvey.aspects = []
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const addAspect = () => {
  currentSurvey.aspects.push({
    name: '',
    questions: []
  })
}

const removeAspect = (aspectIndex) => {
  if (confirm('Hapus aspek ini beserta semua pertanyaannya?')) {
    currentSurvey.aspects.splice(aspectIndex, 1)
  }
}

const addQuestion = (aspectIndex) => {
  currentSurvey.aspects[aspectIndex].questions.push({
    text: '',
    type: 'single',
    required: true,
    requireEvidence: false,
    evidenceLabel: '',
    weight: '1.00',
    options: [
      { text: '', score: 0 },
      { text: '', score: 0 }
    ]
  })
}

const removeQuestion = (aspectIndex, questionIndex) => {
  if (confirm('Hapus pertanyaan ini?')) {
    currentSurvey.aspects[aspectIndex].questions.splice(questionIndex, 1)
  }
}

const addOption = (aspectIndex, questionIndex) => {
  currentSurvey.aspects[aspectIndex].questions[questionIndex].options.push({ 
    text: '', 
    score: 0 
  })
}

const removeOption = (aspectIndex, questionIndex, optionIndex) => {
  currentSurvey.aspects[aspectIndex].questions[questionIndex].options.splice(optionIndex, 1)
}

const saveSurvey = async () => {
  // Validation
  if (!currentSurvey.title.trim()) {
    toast.error('Judul survey harus diisi')
    return
  }

  if (currentSurvey.aspects.length === 0) {
    toast.error('Minimal harus ada 1 aspek')
    return
  }

  for (let i = 0; i < currentSurvey.aspects.length; i++) {
    const aspect = currentSurvey.aspects[i]
    if (!aspect.name.trim()) {
      toast.error(`Nama aspek ${i + 1} harus diisi`)
      return
    }
    if (aspect.questions.length === 0) {
      toast.error(`Aspek "${aspect.name}" minimal harus memiliki 1 pertanyaan`)
      return
    }

    for (let j = 0; j < aspect.questions.length; j++) {
      const q = aspect.questions[j]
      if (!q.text.trim()) {
        toast.error(`Aspek "${aspect.name}", Pertanyaan ${j + 1} harus diisi`)
        return
      }
      if (q.options.length < 2) {
        toast.error(`Aspek "${aspect.name}", Pertanyaan ${j + 1} minimal harus memiliki 2 pilihan`)
        return
      }
      for (let k = 0; k < q.options.length; k++) {
        if (!q.options[k].text.trim()) {
          toast.error(`Aspek "${aspect.name}", Pertanyaan ${j + 1}, Pilihan ${String.fromCharCode(65 + k)} harus diisi`)
          return
        }
        if (q.options[k].score === undefined || q.options[k].score === null || q.options[k].score === '') {
          toast.error(`Aspek "${aspect.name}", Pertanyaan ${j + 1}, Pilihan ${String.fromCharCode(65 + k)} skor harus diisi`)
          return
        }
      }
    }
  }

  loading.value = true
  try {
    const payload = {
      title: currentSurvey.title,
      description: currentSurvey.description,
      isActive: false,
      aspects: JSON.parse(JSON.stringify(currentSurvey.aspects))
    }

    if (isEditing.value) {
      // Update existing survey
      const response = await $fetch(`/api/survey-instruments/${editingId.value}`, {
        method: 'PUT',
        body: payload
      })
      
      if (response.success) {
        toast.success('Survey berhasil diupdate')
        await fetchSurveys()
      }
    } else {
      // Create new survey
      const response = await $fetch('/api/survey-instruments', {
        method: 'POST',
        body: payload
      })
      
      if (response.success) {
        toast.success('Survey berhasil dibuat')
        await fetchSurveys()
      }
    }

    closeModal()
  } catch (error) {
    console.error('Error saving survey:', error)
    toast.error('Gagal menyimpan survey')
  } finally {
    loading.value = false
  }
}

const editSurvey = (survey) => {
  isEditing.value = true
  editingId.value = survey.id
  currentSurvey.title = survey.title
  currentSurvey.description = survey.description
  currentSurvey.aspects = JSON.parse(JSON.stringify(survey.aspects))
  showModal.value = true
}

const viewSurvey = (survey) => {
  currentSurvey.title = survey.title
  currentSurvey.description = survey.description
  currentSurvey.aspects = JSON.parse(JSON.stringify(survey.aspects))
  showPreview.value = true
}

const deleteSurvey = async (survey) => {
  if (confirm(`Yakin ingin menghapus survey "${survey.title}"?`)) {
    loading.value = true
    try {
      const response = await $fetch(`/api/survey-instruments/${survey.id}`, {
        method: 'DELETE'
      })
      
      if (response.success) {
        toast.success('Survey berhasil dihapus')
        await fetchSurveys()
      }
    } catch (error) {
      console.error('Error deleting survey:', error)
      toast.error('Gagal menghapus survey')
    } finally {
      loading.value = false
    }
  }
}

const toggleSurveyStatus = async (survey) => {
  loading.value = true
  try {
    const response = await $fetch(`/api/survey-instruments/${survey.id}`, {
      method: 'PUT',
      body: {
        title: survey.title,
        description: survey.description,
        isActive: !survey.isActive,
        aspects: survey.aspects
      }
    })
    
    if (response.success) {
      toast.success(response.data.isActive ? 'Survey diaktifkan' : 'Survey dinonaktifkan')
      await fetchSurveys()
    }
  } catch (error) {
    console.error('Error toggling survey status:', error)
    toast.error('Gagal mengubah status survey')
  } finally {
    loading.value = false
  }
}

const previewSurvey = () => {
  if (!currentSurvey.title.trim()) {
    toast.error('Judul survey harus diisi')
    return
  }
  if (currentSurvey.aspects.length === 0) {
    toast.error('Minimal harus ada 1 aspek')
    return
  }
  showPreview.value = true
}

const cancelEdit = () => {
  if (confirm('Batalkan perubahan?')) {
    closeModal()
  }
}

const resetForm = () => {
  editMode.value = false
  editingId.value = null
  currentSurvey.title = ''
  currentSurvey.description = ''
  currentSurvey.aspects = []
}
</script>

<style scoped>
</style>
