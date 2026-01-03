<template>
  <div>
    <h1 class="text-2xl font-bold mb-6 text-primary">Survey Hub Inovasi</h1>
    
    <!-- Loading Overlay saat Submit -->
    <v-overlay v-model="submitting" class="align-center justify-center" persistent>
      <v-card class="pa-8 text-center">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="mt-4 text-h6">{{ editMode ? 'Memperbarui Survey...' : 'Mengirim Survey...' }}</p>
        <p class="text-caption text-grey">Mohon tunggu sebentar</p>
      </v-card>
    </v-overlay>

    <!-- Success Dialog -->
    <v-dialog v-model="showSuccessDialog" max-width="500">
      <v-card>
        <v-card-title class="bg-success text-white">
          <v-icon start>mdi-check-circle</v-icon>
          Survey Berhasil {{ editMode ? 'Diperbarui' : 'Dikirim' }}!
        </v-card-title>
        <v-card-text class="pa-6">
          <div class="text-center mb-4">
            <v-icon size="80" color="success">mdi-checkbox-marked-circle</v-icon>
          </div>
          <div class="text-body-1">
            <p class="mb-2"><strong>Total Skor:</strong> {{ submittedScore }}</p>
            <p class="mb-2"><strong>Status:</strong> Menunggu Verifikasi</p>
            <p class="text-caption text-grey mt-4">
              Terima kasih telah {{ editMode ? 'memperbarui' : 'mengisi' }} survey. Tim kami akan memverifikasi jawaban Anda.
            </p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showSuccessDialog = false">Tutup</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <v-card v-if="loading" class="mb-6">
      <v-card-text class="text-center py-8">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="mt-4 text-grey">Memuat data survey...</p>
      </v-card-text>
    </v-card>

    <v-card v-else-if="error" class="mb-6">
      <v-card-text>
        <v-alert type="error" variant="tonal">
          <strong>Error:</strong> {{ error }}
        </v-alert>
      </v-card-text>
    </v-card>

    <!-- Tampilkan hasil jika sudah pernah mengisi (Read Mode) -->
    <div v-else-if="existingResponse && !editMode">
      <v-card class="mb-6">
        <v-card-title class="text-h5 font-weight-bold bg-info text-white d-flex justify-space-between align-center">
          <div>
            <v-icon start>mdi-clipboard-check</v-icon>
            Anda Sudah Mengisi Survey Ini
          </div>
          <v-btn 
            color="white" 
            variant="outlined" 
            @click="enableEditMode"
            prepend-icon="mdi-pencil"
          >
            Edit Jawaban
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-6">
          <v-alert type="info" variant="tonal" class="mb-6">
            <strong>Info:</strong> Anda sudah mengisi survey "{{ activeSurvey.title }}" pada {{ formatDate(existingResponse.submittedAt) }}
          </v-alert>

          <div class="mb-6">
            <h3 class="text-h6 font-weight-bold mb-3">Ringkasan</h3>
            <v-row>
              <v-col cols="12" md="4">
                <v-card variant="outlined">
                  <v-card-text class="text-center">
                    <p class="text-caption text-grey">Total Skor</p>
                    <p class="text-h4 font-weight-bold text-primary">{{ existingResponse.totalScore }}</p>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <v-card variant="outlined">
                  <v-card-text class="text-center">
                    <p class="text-caption text-grey">Status</p>
                    <v-chip :color="getStatusColor(existingResponse.verificationStatus)" variant="flat">
                      {{ getStatusText(existingResponse.verificationStatus) }}
                    </v-chip>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <v-card variant="outlined">
                  <v-card-text class="text-center">
                    <p class="text-caption text-grey">Tanggal Submit</p>
                    <p class="text-body-1 font-weight-medium">{{ formatDate(existingResponse.submittedAt) }}</p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <h3 class="text-h6 font-weight-bold mb-3">Detail Jawaban</h3>
          <div v-for="aspect in groupedAnswers" :key="aspect.aspectId" class="mb-6">
            <v-card variant="outlined">
              <v-card-title class="bg-grey-lighten-4">
                {{ aspect.aspectName }}
              </v-card-title>
              <v-card-text>
                <div v-for="(answer, idx) in aspect.answers" :key="idx" class="mb-4">
                  <p class="text-body-2 font-weight-medium mb-2">
                    {{ idx + 1 }}. {{ answer.questionText }}
                    <v-chip v-if="answer.questionWeight && answer.questionWeight !== '1.00'" size="x-small" color="info" variant="tonal" class="ml-2">
                      Bobot: {{ answer.questionWeight }}
                    </v-chip>
                  </p>
                  <p class="text-body-2 ml-4">
                    <v-icon size="small" color="primary">mdi-check-circle</v-icon>
                    <strong>Jawaban:</strong> {{ answer.optionText }}
                    <v-chip size="small" color="success" variant="tonal" class="ml-2">
                      Skor: {{ answer.optionScore }}
                    </v-chip>
                  </p>
                  <p v-if="answer.evidence" class="text-body-2 ml-4 text-grey">
                    <v-icon size="small">mdi-link</v-icon>
                    <strong>Bukti:</strong> <a :href="answer.evidence" target="_blank" class="text-primary">{{ answer.evidence }}</a>
                  </p>
                  <v-divider v-if="idx < aspect.answers.length - 1" class="mt-3"></v-divider>
                </div>
              </v-card-text>
            </v-card>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- Form untuk mengisi/edit survey -->
    <div v-else-if="activeSurvey">
      <v-card class="mb-6">
        <v-card-title class="text-h5 font-weight-bold text-white d-flex justify-space-between align-center" :class="editMode ? 'bg-warning' : 'bg-primary'">
          <div>
            <v-icon v-if="editMode" start>mdi-pencil</v-icon>
            {{ editMode ? 'Edit Survey: ' : '' }}{{ activeSurvey.title }}
          </div>
          <v-btn 
            v-if="editMode"
            color="white" 
            variant="text"
            @click="cancelEdit"
            prepend-icon="mdi-close"
          >
            Batal
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-6">
          <v-alert v-if="editMode" type="warning" variant="tonal" class="mb-4">
            <strong>Mode Edit:</strong> Anda sedang mengedit jawaban survey yang sudah pernah dikirim. Perubahan akan menggantikan jawaban sebelumnya.
            <div class="mt-2">
              <small><strong>Debug Info:</strong> {{ Object.keys(answers).length }} jawaban ter-load</small>
            </div>
          </v-alert>
          
          <p class="text-body-1 mb-6">{{ activeSurvey.description }}</p>

          <!-- Stepper -->
          <v-stepper v-model="currentStep" alt-labels class="mb-6" :key="editMode ? 'edit-mode' : 'new-mode'">
            <v-stepper-header>
              <template v-for="(aspect, index) in activeSurvey.aspects" :key="index">
                <v-stepper-item
                  :value="index + 1"
                  :complete="currentStep > index + 1"
                  :title="aspect.name"
                  :subtitle="`${aspect.questions.length} Pertanyaan`"
                ></v-stepper-item>
                <v-divider v-if="index < activeSurvey.aspects.length - 1"></v-divider>
              </template>
            </v-stepper-header>

            <v-stepper-window>
              <v-stepper-window-item
                v-for="(aspect, aIndex) in activeSurvey.aspects"
                :key="aIndex"
                :value="aIndex + 1"
              >
                <v-form ref="aspectForms">
                  <h2 class="text-h6 font-weight-bold text-primary mb-4">{{ aspect.name }}</h2>

                  <div v-for="(question, qIndex) in aspect.questions" :key="qIndex" class="mb-6">
                    <p class="text-body-1 font-weight-medium mb-3">
                      {{ qIndex + 1 }}. {{ question.text }}
                      <span v-if="question.required" class="text-error">*</span>
                      <v-chip v-if="question.weight && question.weight !== '1'" size="x-small" color="info" variant="tonal" class="ml-2">
                        Bobot: {{ question.weight }}
                      </v-chip>
                      <v-chip v-if="editMode && answers[`${aIndex}-${qIndex}`] !== undefined" size="x-small" color="success" variant="tonal" class="ml-2">
                        ✓ Terjawab (index: {{ answers[`${aIndex}-${qIndex}`] }})
                      </v-chip>
                    </p>

                    <v-radio-group 
                      v-model="answers[`${aIndex}-${qIndex}`]"
                      :rules="question.required ? [v => v !== undefined && v !== null || 'Pertanyaan ini wajib dijawab'] : []"
                    >
                      <v-radio
                        v-for="(option, oIndex) in question.options"
                        :key="oIndex"
                        :value="oIndex"
                        color="primary"
                      >
                        <template v-slot:label>
                          <span class="text-body-2">
                            {{ option.text }}
                            <small v-if="editMode" class="text-grey ml-2">[idx:{{ oIndex }}, id:{{ option.id }}]</small>
                          </span>
                        </template>
                      </v-radio>
                    </v-radio-group>

                    <v-text-field
                      v-if="question.requireEvidence && answers[`${aIndex}-${qIndex}`] !== undefined"
                      v-model="evidences[`${aIndex}-${qIndex}`]"
                      label="Link Bukti (opsional)"
                      prepend-icon="mdi-link"
                      variant="outlined"
                      density="compact"
                      class="mt-3"
                      placeholder="https://..."
                      hint="Masukkan link/URL bukti pendukung"
                      persistent-hint
                    ></v-text-field>

                    <v-divider v-if="qIndex < aspect.questions.length - 1" class="mt-4"></v-divider>
                  </div>
                </v-form>
              </v-stepper-window-item>
            </v-stepper-window>

            <v-stepper-actions
              :disabled="submitting"
              @click:prev="prevStep"
              @click:next="nextStep"
              :next-text="currentStep === activeSurvey.aspects.length ? (editMode ? 'Perbarui' : 'Kirim') : 'Selanjutnya'"
              :prev-text="'Sebelumnya'"
            ></v-stepper-actions>
          </v-stepper>

          <div class="d-flex justify-space-between mt-4">
            <v-btn v-if="editMode" color="grey" variant="text" @click="cancelEdit" prepend-icon="mdi-close">
              Batal Edit
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="grey" variant="outlined" @click="resetForm">
              Reset Semua
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <v-card v-else class="mb-6">
      <v-card-text class="text-center py-8">
        <v-icon size="80" color="grey-lighten-1">mdi-clipboard-text-outline</v-icon>
        <p class="text-h6 text-grey mt-4">Belum ada survey aktif</p>
        <p class="text-body-2 text-grey">Survey akan muncul di sini ketika sudah tersedia</p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'

definePageMeta({ 
  layout: 'sidebar'
})

const { user } = useAuth()
const loading = ref(true)
const error = ref(null)
const activeSurvey = ref(null)
const existingResponse = ref(null)
const existingAnswers = ref([])
const answers = ref({})
const evidences = ref({})
const submitting = ref(false)
const currentStep = ref(1)
const aspectForms = ref([])
const showSuccessDialog = ref(false)
const submittedScore = ref(0)
const editMode = ref(false)

const groupedAnswers = computed(() => {
  if (!existingAnswers.value || existingAnswers.value.length === 0) return []
  
  const grouped = {}
  existingAnswers.value.forEach(answer => {
    if (!grouped[answer.aspectId]) {
      grouped[answer.aspectId] = {
        aspectId: answer.aspectId,
        aspectName: answer.aspectName,
        answers: []
      }
    }
    grouped[answer.aspectId].answers.push(answer)
  })
  
  return Object.values(grouped)
})

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusColor = (status) => {
  const colors = {
    'pending': 'warning',
    'approved': 'success',
    'rejected': 'error'
  }
  return colors[status] || 'grey'
}

const getStatusText = (status) => {
  const texts = {
    'pending': 'Menunggu Verifikasi',
    'approved': 'Disetujui',
    'rejected': 'Ditolak'
  }
  return texts[status] || status
}

const enableEditMode = async () => {
  editMode.value = true
  
  // Buat object baru untuk answers dan evidences
  const newAnswers = {}
  const newEvidences = {}
  
  // Populate answers dari existingAnswers
  existingAnswers.value.forEach(answer => {
    // Cari question di survey untuk mendapatkan aspect & question index
    activeSurvey.value.aspects.forEach((aspect, aIndex) => {
      aspect.questions.forEach((question, qIndex) => {
        if (question.id === answer.questionId) {
          // Cari option index berdasarkan selectedOptionId
          const optionIndex = question.options.findIndex(opt => opt.id === answer.selectedOptionId)
          
          const answerKey = `${aIndex}-${qIndex}`
          
          if (optionIndex !== -1) {
            newAnswers[answerKey] = optionIndex
          }
          
          // Set evidence jika ada
          if (answer.evidence) {
            newEvidences[answerKey] = answer.evidence
          }
        }
      })
    })
  })
  
  // Replace seluruh object sekaligus untuk trigger reaktivitas
  answers.value = newAnswers
  evidences.value = newEvidences
  
  currentStep.value = 1
  
  // Tunggu DOM update
  await nextTick()
}

const cancelEdit = () => {
  editMode.value = false
  resetForm()
  currentStep.value = 1
}


const checkExistingResponse = async () => {
  if (!activeSurvey.value || !user.value?.nm_instansi) return
  
  try {
    const response = await $fetch('/api/instrument-responses/check', {
      params: {
        instrumentId: activeSurvey.value.id,
        instansi: user.value.nm_instansi
      }
    })
    
    if (response.success && response.exists) {
      existingResponse.value = response.data.response
      existingAnswers.value = response.data.answers || []
    } else {
      existingResponse.value = null
      existingAnswers.value = []
    }
  } catch (e) {
    console.error('Error checking existing response:', e)
    existingResponse.value = null
    existingAnswers.value = []
  }
}

const fetchSurveys = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await $fetch('/api/survey-instruments')
    
    if (response.success && response.data.length > 0) {
      // Normalisasi bobot per aspek agar total bobot = 1
      response.data.forEach(survey => {
        survey.aspects.forEach(aspect => {
          const totalWeight = aspect.questions.reduce((sum, q) => sum + parseFloat(q.weight || '1'), 0)
          if (totalWeight > 0) {
            aspect.questions.forEach(q => {
              q.weight = (parseFloat(q.weight || '1') / totalWeight).toFixed(2)
            })
          }
        })
      })
      
      // Ambil survey pertama yang aktif
      activeSurvey.value = response.data.find(s => s.isActive) || response.data[0]
      
      // Cek apakah user sudah pernah mengisi
      await checkExistingResponse()
    }
  } catch (e) {
    error.value = e.message || 'Gagal memuat data survey'
    console.error('Error fetching surveys:', e)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  answers.value = {}
  evidences.value = {}
  currentStep.value = 1
  if (aspectForms.value) {
    aspectForms.value.forEach(form => form?.reset())
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const nextStep = async () => {
  // Validasi form aspek saat ini
  const currentForm = aspectForms.value[currentStep.value - 1]
  if (currentForm) {
    const { valid } = await currentForm.validate()
    if (!valid) {
      return
    }
  }

  if (currentStep.value < activeSurvey.value.aspects.length) {
    currentStep.value++
  } else {
    // Submit survey jika sudah di step terakhir
    await submitSurvey()
  }
}

const submitSurvey = async () => {
  submitting.value = true

  try {
    // Siapkan data jawaban dengan questionId dan optionId yang benar
    const surveyAnswers = {}
    const surveyEvidences = {}
    
    let calculatedTotalScore = 0
    
    // Loop through answers dan mapping ke question/option ID
    for (const [key, optionIndex] of Object.entries(answers.value)) {
      const [aspectIndex, questionIndex] = key.split('-').map(Number)
      const aspect = activeSurvey.value.aspects[aspectIndex]
      const question = aspect.questions[questionIndex]
      const selectedOption = question.options[optionIndex]
      
      const optionScore = selectedOption.score || 0
      const questionWeight = parseFloat(question.weight || '1')
      const finalScore = optionScore * questionWeight
      
      calculatedTotalScore += finalScore
      
      surveyAnswers[key] = {
        questionId: question.id,
        optionId: selectedOption.id,
        optionIndex: optionIndex,
        score: optionScore,
        weight: questionWeight,
        finalScore: finalScore
      }
      
      // Tambahkan evidence link jika ada
      if (evidences.value[key]) {
        surveyEvidences[key] = evidences.value[key]
      }
    }
    
    // Submit ke API
    const response = await $fetch('/api/instrument-responses/submit', {
      method: 'POST',
      body: {
        instrumentId: activeSurvey.value.id,
        instansi: user.value?.nm_instansi || 'Tidak Diketahui',
        answers: surveyAnswers,
        evidences: surveyEvidences,
        isUpdate: editMode.value,
        responseId: existingResponse.value?.id
      }
    })
    
    if (response.success) {
      submittedScore.value = response.data.totalScore || 0
      showSuccessDialog.value = true
      editMode.value = false
      resetForm()
      
      // Refresh untuk menampilkan hasil
      await fetchSurveys()
    }
  } catch (e) {
    console.error('❌ Error submitting survey:', e)
    alert('Gagal mengirim survey: ' + (e.message || 'Terjadi kesalahan'))
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchSurveys()
})
</script>

<style scoped>
.text-primary {
  color: #1976D2 !important;
}

.text-success {
  color: #4CAF50 !important;
}

.bg-primary {
  background-color: #1976D2 !important;
}

.bg-success {
  background-color: #4CAF50 !important;
}

.bg-info {
  background-color: #2196F3 !important;
}

.bg-warning {
  background-color: #FB8C00 !important;
}
</style>
