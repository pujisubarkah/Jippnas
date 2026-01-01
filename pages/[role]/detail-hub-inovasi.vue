<template>
  <div>
    <div class="d-flex align-center mb-6">
      <v-btn icon size="small" @click="$router.back()" class="mr-3">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h1 class="text-2xl font-bold">Rekap Kuesioner - {{ surveyTitle }}</h1>
    </div>

    <v-card v-if="loading" class="mb-6">
      <v-card-text class="text-center py-8">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="mt-4 text-grey">Memuat data responden...</p>
      </v-card-text>
    </v-card>

    <template v-else>
      <v-card class="mb-6">
        <v-card-text>
          <div class="d-flex justify-space-between align-center">
            <div>
              <h3 class="text-h6 mb-2">Statistik Responden</h3>
              <p class="text-body-2 text-grey">Total: {{ responses.length }} Instansi</p>
            </div>
            <div class="d-flex gap-2">
              <v-chip color="green" variant="flat">
                {{ verifiedCount }} Terverifikasi
              </v-chip>
              <v-chip color="orange" variant="flat">
                {{ pendingCount }} Pending
              </v-chip>
              <v-chip color="red" variant="flat">
                {{ rejectedCount }} Ditolak
              </v-chip>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <v-card>
        <v-card-header>
          <div class="d-flex justify-space-between align-center w-100">
            <h2 class="text-h6">Daftar Responden</h2>
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Cari Instansi"
              variant="outlined"
              density="compact"
              hide-details
              style="max-width: 300px;"
            ></v-text-field>
          </div>
        </v-card-header>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="filteredResponses"
            :items-per-page="10"
            :loading="loading"
            class="elevation-1"
          >
            <template v-slot:item.totalScore="{ item }">
              <v-chip color="blue" size="small">
                {{ item.totalScore }} poin
              </v-chip>
            </template>

            <template v-slot:item.verificationStatus="{ item }">
              <v-chip 
                :color="getStatusColor(item.verificationStatus)" 
                size="small"
              >
                {{ getStatusText(item.verificationStatus) }}
              </v-chip>
            </template>

            <template v-slot:item.submittedAt="{ item }">
              {{ formatDate(item.submittedAt) }}
            </template>

            <template v-slot:item.aksi="{ item }">
              <v-btn 
                icon 
                small 
                color="primary" 
                @click="viewDetail(item)" 
                title="Lihat Detail"
              >
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </template>

    <!-- Detail & Verification Modal -->
    <v-dialog v-model="showDetailModal" max-width="1200px" scrollable>
      <v-card class="pa-6">
        <v-card-title class="pa-0 mb-4 d-flex justify-space-between align-center">
          <div>
            <h2 class="text-h5">Detail Jawaban</h2>
            <p class="text-body-2 text-grey mt-1">{{ selectedResponse?.instansi }}</p>
          </div>
          <v-btn icon size="small" @click="showDetailModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-0" style="max-height: 70vh;">
          <div v-if="loadingDetail" class="text-center py-8">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <p class="mt-4 text-grey">Memuat detail jawaban...</p>
          </div>

          <div v-else-if="selectedResponse">
            <!-- Response Info -->
            <v-card class="mb-4" elevation="0" color="grey-lighten-4">
              <v-card-text>
                <div class="d-flex justify-space-between">
                  <div>
                    <p class="text-caption text-grey">Tanggal Pengisian</p>
                    <p class="font-weight-medium">{{ formatDate(selectedResponse.submittedAt) }}</p>
                  </div>
                  <div>
                    <p class="text-caption text-grey">Total Skor</p>
                    <div class="d-flex align-center gap-2">
                      <div class="text-center">
                        <p class="text-caption text-grey">Responden</p>
                        <v-chip size="small" color="blue">
                          {{ selectedResponse.originalTotalScore }} poin
                        </v-chip>
                      </div>
                      <v-icon>mdi-arrow-right</v-icon>
                      <div class="text-center">
                        <p class="text-caption text-grey">Verifikator</p>
                        <v-chip 
                          size="small" 
                          :color="selectedResponse.originalTotalScore !== selectedResponse.verifiedTotalScore ? 'orange' : 'green'"
                        >
                          {{ selectedResponse.verifiedTotalScore }} poin
                        </v-chip>
                      </div>
                      <v-chip 
                        v-if="hasAnyScoreChanged(selectedResponse)"
                        size="x-small" 
                        color="warning"
                        class="ml-2"
                      >
                        <v-icon size="small">mdi-alert-circle</v-icon>
                        Skor Diubah
                      </v-chip>
                    </div>
                  </div>
                  <div>
                    <p class="text-caption text-grey">Status</p>
                    <v-chip 
                      :color="getStatusColor(selectedResponse.verificationStatus)" 
                      size="small"
                    >
                      {{ getStatusText(selectedResponse.verificationStatus) }}
                    </v-chip>
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <!-- Answers by Aspect -->
            <div
              v-for="(aspect, aIndex) in selectedResponse.answers"
              :key="aIndex"
              class="mb-6"
            >
              <v-card elevation="2">
                <v-card-title class="bg-primary text-white">
                  {{ aspect.aspectName }}
                  <v-chip size="small" class="ml-2" color="white" text-color="primary">
                    {{ calculateAspectScore(aspect).toFixed(2) }} poin
                  </v-chip>
                  <v-chip 
                    v-if="hasAspectScoreChanged(aspect)"
                    size="x-small" 
                    color="warning" 
                    class="ml-2"
                  >
                    Diubah
                  </v-chip>
                </v-card-title>
                <v-card-text class="pa-4">
                  <div
                    v-for="(question, qIndex) in aspect.questions"
                    :key="qIndex"
                    class="mb-6"
                  >
                    <v-card elevation="1" color="grey-lighten-5" class="pa-4">
                      <!-- Question -->
                      <h4 class="text-subtitle-1 font-weight-bold mb-3">
                        {{ qIndex + 1 }}. {{ question.questionText }}
                        <v-chip v-if="question.questionWeight && question.questionWeight !== '1.00'" size="x-small" color="info" variant="tonal" class="ml-2">
                          Bobot: {{ question.questionWeight }}
                        </v-chip>
                      </h4>

                      <!-- Answer -->
                      <div class="mb-3">
                        <p class="text-caption text-grey mb-1">Jawaban Responden:</p>
                        <v-chip 
                          v-for="(answer, idx) in question.selectedAnswers" 
                          :key="idx"
                          color="grey" 
                          variant="outlined"
                          class="mr-2 mb-2"
                        >
                          {{ answer.text }}
                          <v-icon right size="small" class="ml-1">mdi-star</v-icon>
                          {{ answer.score }} poin
                        </v-chip>
                      </div>

                      <!-- Evidence -->
                      <div v-if="question.evidence" class="mb-3">
                        <p class="text-caption text-grey mb-1">Bukti Dukung:</p>
                        <v-card elevation="0" class="pa-3 bg-blue-lighten-5">
                          <p class="text-body-2">{{ question.evidence }}</p>
                        </v-card>
                      </div>

                      <!-- Verification -->
                      <v-divider class="my-3"></v-divider>
                      
                      <!-- Verifikator Answer Selection -->
                      <div class="mb-3">
                        <p class="text-caption text-grey mb-2">
                          <v-icon size="small" class="mr-1">mdi-account-check</v-icon>
                          Pilihan Verifikator:
                        </p>
                        
                        <v-radio-group 
                          v-if="question.questionType === 'single'"
                          v-model="question.verifiedAnswer"
                          hide-details
                          density="compact"
                        >
                          <v-radio
                            v-for="(option, oIdx) in question.availableOptions"
                            :key="oIdx"
                            :value="option.value"
                            color="success"
                          >
                            <template v-slot:label>
                              <div class="d-flex align-center">
                                <span>{{ option.text }}</span>
                                <v-chip size="x-small" color="success" class="ml-2">
                                  {{ option.score }} poin
                                </v-chip>
                                <v-icon 
                                  v-if="isOriginalAnswer(question, option)"
                                  size="small" 
                                  color="grey" 
                                  class="ml-2"
                                >
                                  mdi-account
                                </v-icon>
                              </div>
                            </template>
                          </v-radio>
                        </v-radio-group>

                        <div v-else>
                          <v-checkbox
                            v-for="(option, oIdx) in question.availableOptions"
                            :key="oIdx"
                            v-model="question.verifiedAnswers"
                            :value="option.value"
                            color="success"
                            hide-details
                            density="compact"
                          >
                            <template v-slot:label>
                              <div class="d-flex align-center">
                                <span>{{ option.text }}</span>
                                <v-chip size="x-small" color="success" class="ml-2">
                                  {{ option.score }} poin
                                </v-chip>
                                <v-icon 
                                  v-if="isOriginalAnswer(question, option)"
                                  size="small" 
                                  color="grey" 
                                  class="ml-2"
                                >
                                  mdi-account
                                </v-icon>
                              </div>
                            </template>
                          </v-checkbox>
                        </div>

                        <!-- Score Comparison -->
                        <v-alert 
                          v-if="hasScoreChanged(question)"
                          type="info" 
                          density="compact" 
                          class="mt-3"
                          variant="tonal"
                        >
                          <div class="d-flex align-center justify-space-between">
                            <span class="text-caption">
                              Skor diubah: 
                              <span class="text-decoration-line-through">{{ getOriginalScore(question).toFixed(2) }} poin</span>
                              →
                              <span class="font-weight-bold">{{ getVerifiedScore(question).toFixed(2) }} poin</span>
                            </span>
                            <v-chip 
                              :color="getScoreDiff(question) > 0 ? 'success' : 'error'" 
                              size="x-small"
                            >
                              {{ getScoreDiff(question) > 0 ? '+' : '' }}{{ getScoreDiff(question).toFixed(2) }}
                            </v-chip>
                          </div>
                        </v-alert>
                      </div>

                      <v-divider class="my-3"></v-divider>

                      <div class="d-flex align-center justify-space-between">
                        <div class="grow mr-3">
                          <v-select
                            v-model="question.verificationStatus"
                            :items="verificationOptions"
                            label="Status Verifikasi"
                            variant="outlined"
                            density="compact"
                            hide-details
                          ></v-select>
                        </div>
                        <div class="grow">
                          <v-text-field
                            v-model="question.verificationNote"
                            label="Catatan Verifikasi"
                            variant="outlined"
                            density="compact"
                            placeholder="Opsional"
                            hide-details
                          ></v-text-field>
                        </div>
                      </div>
                    </v-card>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="pa-0 mt-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showDetailModal = false">Tutup</v-btn>
          <v-btn color="primary" @click="saveVerification" :loading="saving">
            Simpan Verifikasi
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import { useRoute } from 'vue-router'

definePageMeta({
  layout: 'sidebar'
})

const route = useRoute()
const instrumentId = computed(() => route.query.instrumentId)

// State
const surveyTitle = ref('Kuesioner Evaluasi Inovasi Daerah')
const search = ref('')
const showDetailModal = ref(false)
const selectedResponse = ref(null)
const loading = ref(true)
const loadingDetail = ref(false)
const saving = ref(false)
const responses = ref([])

// Table headers
const headers = [
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Instansi', key: 'instansi' },
  { title: 'Total Skor', key: 'totalScore', width: '150px' },
  { title: 'Status', key: 'verificationStatus', width: '150px' },
  { title: 'Tanggal', key: 'submittedAt', width: '180px' },
  { title: 'Aksi', key: 'aksi', sortable: false, width: '100px' }
]

// Verification options
const verificationOptions = [
  { title: 'Pending', value: 'pending' },
  { title: 'Terverifikasi', value: 'verified' },
  { title: 'Ditolak', value: 'rejected' }
]

// Fetch responses from API
const fetchResponses = async () => {
  loading.value = true
  try {
    const response = await $fetch('/api/instrument-responses')
    if (response.success) {
      let data = response.data
      
      // Filter by instrumentId if provided
      if (instrumentId.value) {
        data = data.filter(r => r.instrumentId === parseInt(instrumentId.value))
      }
      
      responses.value = data
    }
  } catch (error) {
    console.error('Error fetching responses:', error)
    toast.error('Gagal memuat data responden')
  } finally {
    loading.value = false
  }
}

// Fetch detail response
const viewDetail = async (response) => {
  loadingDetail.value = true
  showDetailModal.value = true
  
  try {
    const detail = await $fetch(`/api/instrument-responses/${response.id}/detail`)
    if (detail.success) {
      // Transform data untuk modal
      selectedResponse.value = {
        id: detail.data.id,
        instansi: detail.data.instansi,
        originalTotalScore: detail.data.originalTotalScore,
        verifiedTotalScore: detail.data.verifiedTotalScore,
        verificationStatus: detail.data.verificationStatus,
        submittedAt: detail.data.submittedAt,
        verifiedAt: detail.data.verifiedAt,
        answers: detail.data.answers.map(aspect => ({
          aspectName: aspect.aspectName,
          questions: aspect.questions.map(q => ({
            answerId: q.answerId,
            questionText: q.questionText,
            questionType: q.questionType,
            questionWeight: q.questionWeight,
            selectedAnswers: q.selectedOption ? [{
              text: q.selectedOption.text,
              score: q.selectedOption.score,
              value: q.selectedOption.value
            }] : [],
            verifiedAnswer: q.selectedOption?.value || null,
            verifiedAnswers: q.selectedOption ? [q.selectedOption.value] : [],
            availableOptions: q.availableOptions,
            evidence: q.evidence,
            originalScore: q.originalScore,
            verifiedScore: q.verifiedScore,
            verificationStatus: 'pending',
            verificationNote: ''
          }))
        }))
      }
    }
  } catch (error) {
    console.error('Error fetching response detail:', error)
    toast.error('Gagal memuat detail responden')
    showDetailModal.value = false
  } finally {
    loadingDetail.value = false
  }
}

// Save verification
const saveVerification = async () => {
  if (!selectedResponse.value) return

  saving.value = true
  try {
    // Recalculate total score based on verified answers
    selectedResponse.value.verifiedTotalScore = calculateTotalScore(selectedResponse.value)

    // Update verification status
    const allVerified = selectedResponse.value.answers.every(aspect =>
      aspect.questions.every(q => q.verificationStatus === 'verified')
    )
    const anyRejected = selectedResponse.value.answers.some(aspect =>
      aspect.questions.some(q => q.verificationStatus === 'rejected')
    )

    if (allVerified) {
      selectedResponse.value.verificationStatus = 'verified'
    } else if (anyRejected) {
      selectedResponse.value.verificationStatus = 'rejected'
    } else {
      selectedResponse.value.verificationStatus = 'pending'
    }

    // Update in main responses array
    const index = responses.value.findIndex(r => r.id === selectedResponse.value.id)
    if (index !== -1) {
      responses.value[index].totalScore = selectedResponse.value.verifiedTotalScore
      responses.value[index].verificationStatus = selectedResponse.value.verificationStatus
    }

    toast.success('Verifikasi berhasil disimpan')
    showDetailModal.value = false
  } catch (error) {
    console.error('Error saving verification:', error)
    toast.error('Gagal menyimpan verifikasi')
  } finally {
    saving.value = false
  }
}

// Computed
const filteredResponses = computed(() => {
  if (!search.value) return responses.value
  return responses.value.filter(r => 
    r.instansi.toLowerCase().includes(search.value.toLowerCase())
  )
})

const verifiedCount = computed(() => 
  responses.value.filter(r => r.verificationStatus === 'verified').length
)

const pendingCount = computed(() => 
  responses.value.filter(r => r.verificationStatus === 'pending').length
)

const rejectedCount = computed(() => 
  responses.value.filter(r => r.verificationStatus === 'rejected').length
)

// Methods
const getStatusColor = (status) => {
  const colors = {
    verified: 'green',
    pending: 'orange',
    rejected: 'red'
  }
  return colors[status] || 'grey'
}

const getStatusText = (status) => {
  const texts = {
    verified: 'Terverifikasi',
    pending: 'Pending',
    rejected: 'Ditolak'
  }
  return texts[status] || status
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Helper functions for verification
const isOriginalAnswer = (question, option) => {
  return question.selectedAnswers.some(a => a.value === option.value)
}

const getOriginalScore = (question) => {
  return question.originalScore || 0
}

const getVerifiedScore = (question) => {
  if (question.questionType === 'single') {
    const option = question.availableOptions.find(o => o.value === question.verifiedAnswer)
    const score = option ? option.score : 0
    const weight = parseFloat(question.questionWeight || '1')
    return score * weight
  } else {
    return question.verifiedAnswers.reduce((sum, val) => {
      const option = question.availableOptions.find(o => o.value === val)
      const score = option ? option.score : 0
      const weight = parseFloat(question.questionWeight || '1')
      return sum + (score * weight)
    }, 0)
  }
}

const hasScoreChanged = (question) => {
  return Math.abs(getOriginalScore(question) - getVerifiedScore(question)) > 0.01
}

const getScoreDiff = (question) => {
  return getVerifiedScore(question) - getOriginalScore(question)
}

const calculateAspectScore = (aspect) => {
  return aspect.questions.reduce((sum, q) => sum + getVerifiedScore(q), 0)
}

const hasAspectScoreChanged = (aspect) => {
  const originalScore = aspect.questions.reduce((sum, q) => sum + getOriginalScore(q), 0)
  const verifiedScore = calculateAspectScore(aspect)
  return Math.abs(originalScore - verifiedScore) > 0.01
}

const calculateTotalScore = (response) => {
  if (!response || !response.answers) return 0
  return response.answers.reduce((total, aspect) => {
    return total + calculateAspectScore(aspect)
  }, 0)
}

const hasAnyScoreChanged = (response) => {
  if (!response || !response.answers) return false
  return response.answers.some(aspect => hasAspectScoreChanged(aspect))
}

onMounted(() => {
  fetchResponses()
})
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}

.bg-primary {
  background-color: #1976D2 !important;
}

.text-white {
  color: white !important;
}
</style>
