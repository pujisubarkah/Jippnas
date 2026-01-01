<template>
  <div>
    <h1 class="text-2xl font-bold mb-6 text-primary">Survey Hub Inovasi</h1>
    
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

                    <v-file-input
                      v-if="question.requireEvidence && answers[`${aIndex}-${qIndex}`] !== undefined"
                      v-model="evidences[`${aIndex}-${qIndex}`]"
                      label="Upload Bukti (opsional)"
                      prepend-icon="mdi-paperclip"
                      variant="outlined"
                      density="compact"
                      class="mt-3"
                      accept="image/*,.pdf,.doc,.docx"
                    ></v-file-input>

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

const loading = ref(true)
const error = ref(null)
const activeSurvey = ref(null)
const answers = ref({})
const evidences = ref({})
const submitting = ref(false)
const currentStep = ref(1)
const aspectForms = ref([])

const fetchSurveys = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await $fetch('/api/survey-instruments')
    
    if (response.success && response.data.length > 0) {
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
    // TODO: Submit ke API
    console.log('Survey answers:', answers.value)
    console.log('Survey evidences:', evidences.value)
    
    // Simulasi submit
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    alert('Survey berhasil dikirim!')
    resetForm()
  } catch (e) {
    console.error('Error submitting survey:', e)
    alert('Gagal mengirim survey')
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
</style>
