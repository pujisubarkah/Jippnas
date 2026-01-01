<template>
  <div>
    <h1 class="text-2xl font-bold mb-6 text-primary">Survey Hub Inovasi</h1>
    
    <!-- Loading Overlay saat Submit -->
    <v-overlay v-model="submitting" class="align-center justify-center" persistent>
      <v-card class="pa-8 text-center">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="mt-4 text-h6">Mengirim Survey...</p>
        <p class="text-caption text-grey">Mohon tunggu sebentar</p>
      </v-card>
    </v-overlay>

    <!-- Success Dialog -->
    <v-dialog v-model="showSuccessDialog" max-width="500">
      <v-card>
        <v-card-title class="bg-success text-white">
          <v-icon start>mdi-check-circle</v-icon>
          Survey Berhasil Dikirim!
        </v-card-title>
        <v-card-text class="pa-6">
          <div class="text-center mb-4">
            <v-icon size="80" color="success">mdi-checkbox-marked-circle</v-icon>
          </div>
          <div class="text-body-1">
            <p class="mb-2"><strong>Total Skor:</strong> {{ submittedScore }}</p>
            <p class="mb-2"><strong>Status:</strong> Menunggu Verifikasi</p>
            <p class="text-caption text-grey mt-4">
              Terima kasih telah mengisi survey. Tim kami akan memverifikasi jawaban Anda.
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

    <div v-else-if="activeSurvey">
      <v-card class="mb-6">
        <v-card-title class="text-h5 font-weight-bold bg-primary text-white">
          {{ activeSurvey.title }}
        </v-card-title>
        <v-card-text class="pa-6">
          <p class="text-body-1 mb-6">{{ activeSurvey.description }}</p>

          <!-- Stepper -->
          <v-stepper v-model="currentStep" alt-labels class="mb-6">
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
                    </p>

                    <v-radio-group 
                      v-model="answers[`${aIndex}-${qIndex}`]"
                      :rules="question.required ? [v => !!v || 'Pertanyaan ini wajib dijawab'] : []"
                    >
                      <v-radio
                        v-for="(option, oIndex) in question.options"
                        :key="oIndex"
                        :value="oIndex"
                        color="primary"
                      >
                        <template v-slot:label>
                          <span class="text-body-2">{{ option.text }}</span>
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
              :next-text="currentStep === activeSurvey.aspects.length ? 'Kirim' : 'Selanjutnya'"
              :prev-text="'Sebelumnya'"
            ></v-stepper-actions>
          </v-stepper>

          <div class="d-flex justify-end mt-4">
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
import { ref, onMounted } from 'vue'

definePageMeta({ 
  layout: 'sidebar'
})

const { user } = useAuth()
const loading = ref(true)
const error = ref(null)
const activeSurvey = ref(null)
const answers = ref({})
const evidences = ref({})
const submitting = ref(false)
const currentStep = ref(1)
const aspectForms = ref([])
const showSuccessDialog = ref(false)
const submittedScore = ref(0)

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
    
    console.log('📊 Preparing survey submission...')
    
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
    
    console.log('📤 Submitting survey with', Object.keys(surveyAnswers).length, 'answers')
    console.log('💯 Calculated Total Score:', calculatedTotalScore)
    
    // Submit ke API
    const response = await $fetch('/api/instrument-responses/submit', {
      method: 'POST',
      body: {
        instrumentId: activeSurvey.value.id,
        instansi: user.value?.nm_instansi || 'Tidak Diketahui',
        answers: surveyAnswers,
        evidences: surveyEvidences
      }
    })
    
    if (response.success) {
      console.log('✅ Survey submitted successfully!', response.data)
      submittedScore.value = response.data.totalScore || 0
      showSuccessDialog.value = true
      resetForm()
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
</style>
