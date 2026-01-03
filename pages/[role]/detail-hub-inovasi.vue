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
        <v-card-title>
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
        </v-card-title>
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
              <div class="d-flex gap-1">
                <v-btn 
                  icon 
                  small 
                  color="primary" 
                  @click="viewAnswerDetail(item)" 
                  title="Lihat Jawaban Detail"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </template>

    <!-- Detail & Verification Modal -->
    <v-dialog v-model="showDetailModal" max-width="1200px" scrollable>
      <v-card>
        <v-card-title class="bg-primary text-white d-flex justify-space-between align-center">
          <div>
            <h2 class="text-h5">Jawaban Survey - {{ selectedResponse?.instansi }}</h2>
            <p class="text-body-2 mt-1">{{ surveyTitle }}</p>
          </div>
          <v-btn icon size="small" @click="showDetailModal = false" color="white">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-6" style="max-height: 70vh;">
          <div v-if="loadingDetail" class="text-center py-8">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <p class="mt-4 text-grey">Memuat detail jawaban...</p>
          </div>

          <div v-else-if="!selectedResponse" class="text-center py-8">
            <v-icon size="64" color="grey">mdi-alert-circle-outline</v-icon>
            <p class="mt-4 text-grey">Data tidak ditemukan</p>
          </div>

          <div v-else-if="!selectedResponse.answers || selectedResponse.answers.length === 0" class="text-center py-8">
            <v-icon size="64" color="grey">mdi-file-document-outline</v-icon>
            <p class="mt-4 text-grey">Belum ada jawaban untuk survey ini</p>
          </div>

          <div v-else>
            <!-- Response Info Banner -->
            <v-card class="mb-4" elevation="2" color="blue-lighten-5">
              <v-card-text>
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <p class="text-caption text-grey">Tanggal Pengisian</p>
                    <p class="font-weight-medium">{{ formatDate(selectedResponse.submittedAt) }}</p>
                  </div>
                  <div>
                    <p class="text-caption text-grey">Total Skor</p>
                    <v-chip color="primary" size="large">
                      {{ selectedResponse.originalTotalScore }} poin
                    </v-chip>
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

            <!-- Stepper untuk navigasi antar aspek -->
            <v-stepper v-model="currentStep" alt-labels class="mb-6">
              <v-stepper-header>
                <template v-for="(aspect, index) in selectedResponse.answers" :key="index">
                  <v-stepper-item
                    :value="index + 1"
                    :complete="currentStep > index + 1"
                    :title="aspect.aspectName"
                    :subtitle="`${aspect.questions.length} Pertanyaan`"
                  ></v-stepper-item>
                  <v-divider v-if="index < selectedResponse.answers.length - 1"></v-divider>
                </template>
              </v-stepper-header>

              <v-stepper-window>
                <v-stepper-window-item
                  v-for="(aspect, aIndex) in selectedResponse.answers"
                  :key="aIndex"
                  :value="aIndex + 1"
                >
                  <h2 class="text-h6 font-weight-bold text-primary mb-4">{{ aspect.aspectName }}</h2>

                  <div v-for="(question, qIndex) in aspect.questions" :key="qIndex" class="mb-6">
                    <p class="text-body-1 font-weight-medium mb-3">
                      {{ qIndex + 1 }}. {{ question.questionText }}
                      <v-chip v-if="question.questionWeight && question.questionWeight !== '1.00'" size="x-small" color="info" variant="tonal" class="ml-2">
                        Bobot: {{ question.questionWeight }}
                      </v-chip>
                    </p>

                    <!-- Radio buttons untuk single choice -->
                    <v-radio-group 
                      v-if="question.questionType === 'single'"
                      v-model="question.verifiedAnswer"
                      readonly
                      hide-details
                    >
                      <v-radio
                        v-for="(option, oIndex) in question.availableOptions"
                        :key="oIndex"
                        :value="option.value"
                        color="primary"
                        readonly
                      >
                        <template v-slot:label>
                          <div class="d-flex align-center">
                            <span>{{ option.text }}</span>
                            <v-chip 
                              v-if="isOriginalAnswer(question, option)"
                              size="x-small" 
                              color="primary"
                              class="ml-2"
                            >
                              {{ option.score }} poin
                            </v-chip>
                          </div>
                        </template>
                      </v-radio>
                    </v-radio-group>

                    <!-- Checkboxes untuk multiple choice -->
                    <div v-else>
                      <v-checkbox
                        v-for="(option, oIndex) in question.availableOptions"
                        :key="oIndex"
                        v-model="question.verifiedAnswers"
                        :value="option.value"
                        color="primary"
                        :disabled="!verificationMode"
                        :readonly="!verificationMode"
                        hide-details
                        @update:model-value="updateVerifiedScore(aIndex, qIndex, $event)"
                      >
                        <template v-slot:label>
                          <div class="d-flex align-center">
                            <span>{{ option.text }}</span>
                            <v-chip 
                              size="x-small" 
                              :color="isOriginalAnswer(question, option) ? 'success' : 'grey'"
                              variant="tonal"
                              class="ml-2"
                            >
                              {{ option.score }} poin
                            </v-chip>
                            <v-chip 
                              v-if="isOriginalAnswer(question, option)"
                              size="x-small" 
                              color="success"
                              variant="flat"
                              class="ml-1"
                            >
                              Jawaban User
                            </v-chip>
                          </div>
                        </template>
                      </v-checkbox>
                    </div>

                    <!-- Evidence/Bukti -->
                    <v-text-field
                      v-if="question.evidence"
                      v-model="question.evidence"
                      label="Link Bukti"
                      prepend-icon="mdi-link"
                      variant="outlined"
                      density="compact"
                      class="mt-3"
                      disabled
                    ></v-text-field>

                    <!-- Score Information -->
                    <v-card class="mt-3" variant="outlined" color="blue-lighten-5">
                      <v-card-text class="py-2">
                        <div class="d-flex gap-4 align-center">
                          <div>
                            <p class="text-caption text-grey">Skor User</p>
                            <v-chip size="small" color="blue" variant="flat">
                              {{ question.originalScore || 0 }} poin
                            </v-chip>
                          </div>
                          <v-icon>mdi-arrow-right</v-icon>
                          <div>
                            <p class="text-caption text-grey">Skor Verifikasi</p>
                            <v-chip size="small" :color="verificationMode ? 'warning' : 'success'" variant="flat">
                              {{ question.verifiedScore || question.originalScore || 0 }} poin
                            </v-chip>
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>

                    <v-divider v-if="qIndex < aspect.questions.length - 1" class="mt-4"></v-divider>
                  </div>
                </v-stepper-window-item>
              </v-stepper-window>

              <v-stepper-actions
                @click:prev="prevStep"
                @click:next="nextStep"
                :next-text="currentStep === selectedResponse.answers.length ? 'Selesai' : 'Selanjutnya'"
                :prev-text="'Sebelumnya'"
              ></v-stepper-actions>
            </v-stepper>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0 bg-grey-lighten-4">
          <div v-if="selectedResponse" class="d-flex align-center gap-2">
            <v-chip color="blue" variant="flat">
              Total Skor User: {{ selectedResponse.originalTotalScore }} poin
            </v-chip>
            <v-icon>mdi-arrow-right</v-icon>
            <v-chip :color="verificationMode ? 'warning' : 'success'" variant="flat">
              Total Skor Verifikasi: {{ calculateVerifiedTotal() }} poin
            </v-chip>
          </div>
          <v-spacer></v-spacer>
          <v-btn 
            v-if="!verificationMode" 
            color="warning" 
            variant="flat"
            prepend-icon="mdi-pencil"
            @click="enableVerificationMode"
          >
            Mode Verifikasi
          </v-btn>
          <v-btn 
            v-if="verificationMode" 
            color="grey" 
            variant="text"
            @click="cancelVerification"
          >
            Batal
          </v-btn>
          <v-btn 
            v-if="verificationMode" 
            color="success" 
            variant="flat"
            prepend-icon="mdi-check"
            :loading="saving"
            @click="saveVerification"
          >
            Simpan Verifikasi
          </v-btn>
          <v-btn 
            v-if="!verificationMode"
            variant="text" 
            @click="showDetailModal = false"
          >
            Tutup
          </v-btn>
        </v-card-actions>
        </v-card>
      </v-dialog>

    <!-- Structure Modal -->
    <v-dialog v-model="showStructureModal" max-width="1200px" scrollable>
      <v-card>
        <v-card-title class="bg-primary text-white d-flex justify-space-between align-center">
          <div>
            <h2 class="text-h5">Struktur Survey - {{ surveyTitle }}</h2>
            <p class="text-body-2 mt-1">Detail pertanyaan dan opsi jawaban</p>
          </div>
          <v-btn icon size="small" @click="showStructureModal = false" color="white">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-6" style="max-height: 70vh;">
          <div v-if="loadingStructure" class="text-center py-8">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <p class="mt-4 text-grey">Memuat struktur survey...</p>
          </div>

          <div v-else-if="!selectedStructure" class="text-center py-8">
            <v-icon size="64" color="grey">mdi-alert-circle-outline</v-icon>
            <p class="mt-4 text-grey">Data tidak ditemukan</p>
          </div>

          <div v-else-if="!selectedStructure.aspects || selectedStructure.aspects.length === 0" class="text-center py-8">
            <v-icon size="64" color="grey">mdi-file-document-outline</v-icon>
            <p class="mt-4 text-grey">Belum ada aspek untuk survey ini</p>
          </div>

          <div v-else>
            <v-stepper v-model="structureStep" alt-labels class="mb-6">
              <v-stepper-header>
                <template v-for="(aspect, index) in selectedStructure.aspects" :key="index">
                  <v-stepper-item
                    :value="index + 1"
                    :complete="structureStep > index + 1"
                    :title="aspect.name"
                    :subtitle="`${aspect.questions.length} Pertanyaan`"
                  ></v-stepper-item>
                  <v-divider v-if="index < selectedStructure.aspects.length - 1"></v-divider>
                </template>
              </v-stepper-header>

              <v-stepper-window>
                <v-stepper-window-item
                  v-for="(aspect, aIndex) in selectedStructure.aspects"
                  :key="aIndex"
                  :value="aIndex + 1"
                >
                  <h2 class="text-h6 font-weight-bold text-primary mb-4">{{ aspect.name }}</h2>

                  <div v-for="(question, qIndex) in aspect.questions" :key="qIndex" class="mb-6">
                    <p class="text-body-1 font-weight-medium mb-3">
                      {{ qIndex + 1 }}. {{ question.text }}
                      <v-chip v-if="question.weight && question.weight !== '1.00'" size="x-small" color="info" variant="tonal" class="ml-2">
                        Bobot: {{ question.weight }}
                      </v-chip>
                    </p>

                    <v-radio-group v-if="question.type === 'single'" disabled hide-details>
                      <v-radio
                        v-for="(option, oIndex) in question.options"
                        :key="oIndex"
                        :value="option.text"
                        color="primary"
                      >
                        <template v-slot:label>
                          <div class="d-flex align-center">
                            <span>{{ option.text }}</span>
                            <v-chip size="x-small" color="primary" class="ml-2">
                              {{ option.score }} poin
                            </v-chip>
                          </div>
                        </template>
                      </v-radio>
                    </v-radio-group>

                    <div v-else-if="question.type === 'multiple'">
                      <v-checkbox
                        v-for="(option, oIndex) in question.options"
                        :key="oIndex"
                        :value="option.text"
                        color="primary"
                        disabled
                        hide-details
                      >
                        <template v-slot:label>
                          <div class="d-flex align-center">
                            <span>{{ option.text }}</span>
                            <v-chip size="x-small" color="primary" class="ml-2">
                              {{ option.score }} poin
                            </v-chip>
                          </div>
                        </template>
                      </v-checkbox>
                    </div>

                    <div v-if="question.requireEvidence" class="mt-3">
                      <v-text-field
                        label="Link Bukti"
                        prepend-icon="mdi-link"
                        variant="outlined"
                        density="compact"
                        disabled
                        :placeholder="question.evidenceLabel || 'Masukkan link bukti'"
                      ></v-text-field>
                    </div>

                    <v-divider v-if="qIndex < aspect.questions.length - 1" class="mt-4"></v-divider>
                  </div>
                </v-stepper-window-item>
              </v-stepper-window>

              <v-stepper-actions
                @click:prev="prevStructureStep"
                @click:next="nextStructureStep"
                :next-text="structureStep === selectedStructure.aspects.length ? 'Selesai' : 'Selanjutnya'"
                :prev-text="'Sebelumnya'"
              ></v-stepper-actions>
            </v-stepper>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showStructureModal = false">Tutup</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Answer Detail Modal (VERIFIKASI MODAL) -->
    <v-dialog v-model="showAnswerModal" max-width="1200px" scrollable>
      <v-card>
        <v-card-title class="bg-primary text-white d-flex justify-space-between align-center">
          <div>
            <h2 class="text-h5">Verifikasi Jawaban Survey - {{ selectedAnswer?.instansi }}</h2>
            <p class="text-body-2 mt-1">{{ surveyTitle }}</p>
          </div>
          <v-btn icon size="small" @click="showAnswerModal = false" color="white">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-6" style="max-height: 70vh;">
          <div v-if="loadingAnswer" class="text-center py-8">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <p class="mt-4 text-grey">Memuat detail jawaban...</p>
          </div>

          <div v-else-if="!selectedAnswer" class="text-center py-8">
            <v-icon size="64" color="grey">mdi-alert-circle-outline</v-icon>
            <p class="mt-4 text-grey">Data tidak ditemukan</p>
          </div>

          <div v-else-if="!selectedAnswer.answers || selectedAnswer.answers.length === 0" class="text-center py-8">
            <v-icon size="64" color="grey">mdi-file-document-outline</v-icon>
            <p class="mt-4 text-grey">Belum ada jawaban untuk survey ini</p>
          </div>

          <div v-else>
            <!-- Response Info Banner -->
            <v-card class="mb-4" elevation="2" color="blue-lighten-5">
              <v-card-text>
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <p class="text-caption text-grey">Tanggal Pengisian</p>
                    <p class="font-weight-medium">{{ formatDate(selectedAnswer.submittedAt) }}</p>
                  </div>
                  <div>
                    <p class="text-caption text-grey">Skor User</p>
                    <v-chip color="blue" size="large">
                      {{ selectedAnswer.originalTotalScore }} poin
                    </v-chip>
                  </div>
                  <div>
                    <p class="text-caption text-grey">Skor Verifikasi</p>
                    <v-chip color="success" size="large">
                      {{ calculateAnswerVerifiedTotal() }} poin
                    </v-chip>
                  </div>
                  <div>
                    <p class="text-caption text-grey">Status</p>
                    <v-chip 
                      :color="getStatusColor(selectedAnswer.verificationStatus)" 
                      size="small"
                    >
                      {{ getStatusText(selectedAnswer.verificationStatus) }}
                    </v-chip>
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <!-- Stepper untuk navigasi antar aspek -->
            <v-stepper v-model="answerStep" alt-labels class="mb-6">
              <v-stepper-header>
                <template v-for="(aspect, index) in selectedAnswer.answers" :key="index">
                  <v-stepper-item
                    :value="index + 1"
                    :complete="answerStep > index + 1"
                    :title="aspect.aspectName"
                    :subtitle="`${aspect.questions.length} Pertanyaan`"
                  ></v-stepper-item>
                  <v-divider v-if="index < selectedAnswer.answers.length - 1"></v-divider>
                </template>
              </v-stepper-header>

              <v-stepper-window>
                <v-stepper-window-item
                  v-for="(aspect, aIndex) in selectedAnswer.answers"
                  :key="aIndex"
                  :value="aIndex + 1"
                >
                  <h2 class="text-h6 font-weight-bold text-primary mb-4">{{ aspect.aspectName }}</h2>

                  <div v-for="(question, qIndex) in aspect.questions" :key="qIndex" class="mb-6">
                    <p class="text-body-1 font-weight-medium mb-3">
                      {{ qIndex + 1 }}. {{ question.questionText }}
                      <v-chip v-if="question.questionWeight && question.questionWeight !== '1.00'" size="x-small" color="info" variant="tonal" class="ml-2">
                        Bobot: {{ question.questionWeight }}
                      </v-chip>
                    </p>

                    <!-- Radio buttons untuk single choice -->
                    <v-radio-group 
                      v-if="question.questionType === 'single'"
                      v-model="question.verifiedAnswer"
                      hide-details
                      @update:model-value="updateAnswerVerifiedScore(aIndex, qIndex, $event)"
                    >
                      <v-radio
                        v-for="(option, oIndex) in question.availableOptions"
                        :key="oIndex"
                        :value="option.value"
                        color="primary"
                      >
                        <template v-slot:label>
                          <div class="d-flex align-center">
                            <span>{{ option.text }}</span>
                          </div>
                        </template>
                      </v-radio>
                    </v-radio-group>

                    <!-- Checkboxes untuk multiple choice -->
                    <div v-else>
                      <v-checkbox
                        v-for="(option, oIndex) in question.availableOptions"
                        :key="oIndex"
                        v-model="question.verifiedAnswers"
                        :value="option.text"
                        color="primary"
                        hide-details
                        @update:model-value="updateAnswerVerifiedScore(aIndex, qIndex, $event)"
                      >
                        <template v-slot:label>
                          <div class="d-flex align-center">
                            <span>{{ option.text }}</span>
                          </div>
                        </template>
                      </v-checkbox>
                    </div>

                    <!-- Evidence/Bukti -->
                    <v-text-field
                      v-if="question.evidence"
                      v-model="question.evidence"
                      label="Link Bukti"
                      prepend-icon="mdi-link"
                      variant="outlined"
                      density="compact"
                      class="mt-3"
                      readonly
                    ></v-text-field>

                    <!-- Score Information -->
                    <v-card class="mt-3" variant="outlined" color="blue-lighten-5">
                      <v-card-text class="py-2">
                        <div class="d-flex gap-4 align-center">
                          <div>
                            <p class="text-caption text-grey">Skor User</p>
                            <v-chip size="small" color="blue" variant="flat">
                              {{ question.originalScore || 0 }} poin
                            </v-chip>
                          </div>
                          <v-icon>mdi-arrow-right</v-icon>
                          <div>
                            <p class="text-caption text-grey">Skor Verifikasi</p>
                            <v-chip size="small" color="success" variant="flat">
                              {{ question.verifiedScore || 0 }} poin
                            </v-chip>
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>

                    <v-divider v-if="qIndex < aspect.questions.length - 1" class="mt-4"></v-divider>
                  </div>
                </v-stepper-window-item>
              </v-stepper-window>

              <v-stepper-actions
                @click:prev="prevAnswerStep"
                @click:next="nextAnswerStep"
                :next-text="answerStep === selectedAnswer.answers.length ? 'Selesai' : 'Selanjutnya'"
                :prev-text="'Sebelumnya'"
              ></v-stepper-actions>
            </v-stepper>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0 bg-grey-lighten-4">
          <div v-if="selectedAnswer" class="d-flex align-center gap-2">
            <v-chip color="blue" variant="flat">
              Total Skor User: {{ selectedAnswer.originalTotalScore }} poin
            </v-chip>
            <v-icon>mdi-arrow-right</v-icon>
            <v-chip color="success" variant="flat">
              Total Skor Verifikasi: {{ calculateAnswerVerifiedTotal() }} poin
            </v-chip>
          </div>
          <v-spacer></v-spacer>
          <v-btn 
            variant="text" 
            @click="showAnswerModal = false"
          >
            Batal
          </v-btn>
          <v-btn 
            color="success" 
            variant="flat"
            prepend-icon="mdi-check"
            :loading="saving"
            @click="saveAnswerVerification"
          >
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
const showStructureModal = ref(false)
const showAnswerModal = ref(false)
const selectedResponse = ref(null)
const loading = ref(true)
const loadingDetail = ref(false)
const saving = ref(false)
const responses = ref([])
const currentStep = ref(1)
const selectedStructure = ref(null)
const selectedAnswer = ref(null)
const loadingStructure = ref(false)
const loadingAnswer = ref(false)
const structureStep = ref(1)
const answerStep = ref(1)
const verificationMode = ref(false)
const verifiedScores = ref({})

// Table headers
const headers = [
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Instansi', key: 'instansi' },
  { title: 'Total Skor', key: 'totalScore', width: '150px' },
  { title: 'Status', key: 'verificationStatus', width: '150px' },
  { title: 'Tanggal', key: 'submittedAt', width: '180px' },
  { title: 'Aksi', key: 'aksi', sortable: false, width: '100px' }
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
  currentStep.value = 1
  
  try {
    const detail = await $fetch(`/api/instrument-responses/${response.id}/detail`)
    
    if (detail.success) {
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
          questions: aspect.questions.map(q => {
            const isMultiple = q.questionType === 'multiple'
            const selectedAnswers = isMultiple 
              ? (q.selectedOptions || [])
              : (q.selectedOption ? [q.selectedOption] : [])
            
            const verifiedAnswer = isMultiple 
              ? null 
              : (q.selectedOption?.value || null)
            
            const verifiedAnswers = isMultiple
              ? (q.selectedOptions?.map(opt => opt.value) || [])
              : (q.selectedOption ? [q.selectedOption.value] : [])

            return {
              answerId: q.answerId,
              questionText: q.questionText,
              questionType: q.questionType,
              questionWeight: q.questionWeight,
              selectedAnswers: selectedAnswers,
              verifiedAnswer: verifiedAnswer,
              verifiedAnswers: verifiedAnswers,
              availableOptions: q.availableOptions,
              evidence: q.evidence,
              originalScore: q.originalScore,
              verifiedScore: q.verifiedScore,
              verificationStatus: 'pending',
              verificationNote: ''
            }
          })
        }))
      }
    }
  } catch (error) {
    console.error('❌ Error fetching response detail:', error)
    toast.error('Gagal memuat detail responden')
    showDetailModal.value = false
  } finally {
    loadingDetail.value = false
  }
}

// Fetch structure survey
const viewStructure = async () => {
  loadingStructure.value = true
  showStructureModal.value = true
  structureStep.value = 1
  
  try {
    const detail = await $fetch('/api/survey-instruments')
    
    if (detail.success && detail.data.length > 0) {
      const instrument = instrumentId.value 
        ? detail.data.find(inst => inst.id === parseInt(instrumentId.value))
        : detail.data[0]
      
      if (instrument) {
        selectedStructure.value = {
          id: instrument.id,
          title: instrument.title,
          description: instrument.description,
          aspects: instrument.aspects
        }
      } else {
        throw new Error('Instrument not found')
      }
    } else {
      throw new Error('No survey instruments found')
    }
  } catch (error) {
    console.error('❌ Error fetching survey structure:', error)
    toast.error('Gagal memuat struktur survey')
    showStructureModal.value = false
  } finally {
    loadingStructure.value = false
  }
}

// Fetch detail answer
const viewAnswerDetail = async (response) => {
  loadingAnswer.value = true
  showAnswerModal.value = true
  answerStep.value = 1
  
  try {
    const detail = await $fetch(`/api/instrument-responses/${response.id}/detail`)
    
    if (detail.success) {
      selectedAnswer.value = {
        id: detail.data.id,
        instansi: detail.data.instansi,
        originalTotalScore: detail.data.originalTotalScore,
        verifiedTotalScore: detail.data.verifiedTotalScore,
        verificationStatus: detail.data.verificationStatus,
        submittedAt: detail.data.submittedAt,
        verifiedAt: detail.data.verifiedAt,
        answers: detail.data.answers.map(aspect => ({
          aspectName: aspect.aspectName,
          questions: aspect.questions.map(q => {
            const isMultiple = q.questionType === 'multiple'
            
            // Untuk menyimpan jawaban asli user (untuk "Jawaban User" chip)
            // Untuk multiple choice, cek selectedOptions dulu, kalau kosong pakai selectedOption
            const selectedAnswers = isMultiple 
              ? (q.selectedOptions && q.selectedOptions.length > 0 ? q.selectedOptions : (q.selectedOption ? [q.selectedOption] : []))
              : (q.selectedOption ? [q.selectedOption] : [])
            
            // Untuk single choice, ambil value dari selectedOption
            const verifiedAnswer = isMultiple 
              ? null 
              : (q.selectedOption?.value !== undefined ? q.selectedOption.value : null)
            
            // Untuk multiple choice, ambil array of values
            // PENTING: Gunakan text sebagai identifier karena value bisa null
            const verifiedAnswers = isMultiple
              ? (q.selectedOptions && q.selectedOptions.length > 0 
                  ? q.selectedOptions.map(opt => opt.text) 
                  : (q.selectedOption ? [q.selectedOption.text] : []))
              : []

            console.log('=== Final Data ===')
            console.log('Question:', q.questionText)
            console.log('Type:', q.questionType)
            console.log('Selected Answers:', selectedAnswers)
            console.log('Verified Answers (for v-model):', verifiedAnswers)
            console.log('==================')

            return {
              answerId: q.answerId,
              questionText: q.questionText,
              questionType: q.questionType,
              questionWeight: q.questionWeight,
              selectedAnswers: selectedAnswers, // Untuk display "Jawaban User" chip
              verifiedAnswer: verifiedAnswer, // Untuk single choice v-model
              verifiedAnswers: verifiedAnswers, // Untuk multiple choice v-model
              availableOptions: q.availableOptions,
              evidence: q.evidence,
              originalScore: q.originalScore,
              verifiedScore: q.verifiedScore || q.originalScore,
            }
          })
        }))
      }
    }
  } catch (error) {
    console.error('❌ Error fetching response detail:', error)
    toast.error('Gagal memuat detail responden')
    showAnswerModal.value = false
  } finally {
    loadingAnswer.value = false
  }
}

// Stepper navigation
const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const nextStep = () => {
  if (!selectedResponse.value) return
  
  if (currentStep.value < selectedResponse.value.answers.length) {
    currentStep.value++
  } else {
    showDetailModal.value = false
  }
}

// Stepper navigation for structure
const prevStructureStep = () => {
  if (structureStep.value > 1) structureStep.value--
}

const nextStructureStep = () => {
  if (!selectedStructure.value) return
  if (structureStep.value < selectedStructure.value.aspects.length) {
    structureStep.value++
  } else {
    showStructureModal.value = false
  }
}

// Stepper navigation for answer
const prevAnswerStep = () => {
  if (answerStep.value > 1) answerStep.value--
}

const nextAnswerStep = () => {
  if (!selectedAnswer.value) return
  if (answerStep.value < selectedAnswer.value.answers.length) {
    answerStep.value++
  } else {
    showAnswerModal.value = false
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
  // Untuk single choice
  if (question.questionType === 'single') {
    // Cek di selectedAnswers (jawaban asli user)
    if (question.selectedAnswers && question.selectedAnswers.length > 0) {
      // Cek by value atau by text
      return question.selectedAnswers[0].value === option.value || 
             question.selectedAnswers[0].text === option.text
    }
    return question.verifiedAnswer === option.value
  }
  
  // Untuk multiple choice
  if (question.questionType === 'multiple') {
    // Cek di selectedAnswers (jawaban asli user)
    if (question.selectedAnswers && question.selectedAnswers.length > 0) {
      // Cek by value atau by text
      return question.selectedAnswers.some(a => a.value === option.value || a.text === option.text)
    }
    // Fallback ke verifiedAnswers jika selectedAnswers tidak ada
    // Sekarang verifiedAnswers berisi text, bukan value
    return question.verifiedAnswers && question.verifiedAnswers.includes(option.text)
  }
  
  return false
}

// Verification Mode Functions
const enableVerificationMode = () => {
  verificationMode.value = true
  toast.info('Mode verifikasi diaktifkan. Anda dapat mengubah jawaban.')
}

const cancelVerification = async () => {
  verificationMode.value = false
  if (selectedResponse.value) {
    const currentId = selectedResponse.value.id
    const currentInstansi = selectedResponse.value.instansi
    await viewDetail({ id: currentId, instansi: currentInstansi })
  }
  toast.info('Perubahan dibatalkan')
}

const updateVerifiedScore = (aspectIndex, questionIndex, newValue) => {
  if (!selectedResponse.value || !verificationMode.value) return
  
  const question = selectedResponse.value.answers[aspectIndex].questions[questionIndex]
  
  let newScore = 0
  
  if (question.questionType === 'single') {
    const selectedOption = question.availableOptions.find(opt => opt.value === newValue)
    if (selectedOption) {
      newScore = parseFloat(selectedOption.score) * parseFloat(question.questionWeight || 1)
    }
  } else {
    const selectedValues = question.verifiedAnswers || []
    selectedValues.forEach(value => {
      const option = question.availableOptions.find(opt => opt.value === value)
      if (option) {
        newScore += parseFloat(option.score) * parseFloat(question.questionWeight || 1)
      }
    })
  }
  
  question.verifiedScore = newScore
}

const calculateVerifiedTotal = () => {
  if (!selectedResponse.value) return 0
  
  let total = 0
  selectedResponse.value.answers.forEach(aspect => {
    aspect.questions.forEach(question => {
      total += question.verifiedScore || question.originalScore || 0
    })
  })
  
  return Math.round(total * 100) / 100
}

const saveVerification = async () => {
  if (!selectedResponse.value) return
  
  saving.value = true
  
  try {
    const verificationData = {
      verifiedTotalScore: calculateVerifiedTotal(),
      verificationStatus: 'verified',
      answers: []
    }
    
    selectedResponse.value.answers.forEach(aspect => {
      aspect.questions.forEach(question => {
        verificationData.answers.push({
          answerId: question.answerId,
          verifiedScore: question.verifiedScore || question.originalScore,
          verifiedAnswer: question.verifiedAnswer,
          verifiedAnswers: question.verifiedAnswers
        })
      })
    })
    
    const response = await $fetch(`/api/instrument-responses/${selectedResponse.value.id}/verify`, {
      method: 'POST',
      body: verificationData
    })
    
    if (response.success) {
      toast.success('Verifikasi berhasil disimpan!')
      verificationMode.value = false
      showDetailModal.value = false
      
      await fetchResponses()
    } else {
      throw new Error(response.message || 'Failed to save verification')
    }
  } catch (error) {
    console.error('❌ Error saving verification:', error)
    toast.error('Gagal menyimpan verifikasi')
  } finally {
    saving.value = false
  }
}

// Function untuk update verified score di answer modal
const updateAnswerVerifiedScore = (aspectIndex, questionIndex, newValue) => {
  if (!selectedAnswer.value) return
  
  const question = selectedAnswer.value.answers[aspectIndex].questions[questionIndex]
  
  let newScore = 0
  
  if (question.questionType === 'single') {
    const selectedOption = question.availableOptions.find(opt => opt.value === newValue)
    if (selectedOption) {
      newScore = parseFloat(selectedOption.score) * parseFloat(question.questionWeight || 1)
    }
  } else {
    // PERBAIKAN: Sekarang verifiedAnswers berisi text, bukan value
    const selectedValues = question.verifiedAnswers || []
    selectedValues.forEach(textValue => {
      // Cari berdasarkan text, bukan value
      const option = question.availableOptions.find(opt => opt.text === textValue)
      if (option) {
        newScore += parseFloat(option.score) * parseFloat(question.questionWeight || 1)
      }
    })
  }
  
  question.verifiedScore = newScore
}

const calculateAnswerVerifiedTotal = () => {
  if (!selectedAnswer.value) return 0
  
  let total = 0
  selectedAnswer.value.answers.forEach(aspect => {
    aspect.questions.forEach(question => {
      total += question.verifiedScore || 0
    })
  })
  
  return Math.round(total * 100) / 100
}

const saveAnswerVerification = async () => {
  if (!selectedAnswer.value) return
  
  saving.value = true
  
  try {
    const verificationData = {
      verifiedTotalScore: calculateAnswerVerifiedTotal(),
      verificationStatus: 'verified',
      answers: []
    }
    
    selectedAnswer.value.answers.forEach(aspect => {
      aspect.questions.forEach(question => {
        verificationData.answers.push({
          answerId: question.answerId,
          verifiedScore: question.verifiedScore || question.originalScore,
          verifiedAnswer: question.verifiedAnswer,
          verifiedAnswers: question.verifiedAnswers
        })
      })
    })
    
    const response = await $fetch(`/api/instrument-responses/${selectedAnswer.value.id}/verify`, {
      method: 'POST',
      body: verificationData
    })
    
    if (response.success) {
      toast.success('Verifikasi berhasil disimpan!')
      showAnswerModal.value = false
      
      await fetchResponses()
    } else {
      throw new Error(response.message || 'Failed to save verification')
    }
  } catch (error) {
    console.error('❌ Error saving verification:', error)
    toast.error('Gagal menyimpan verifikasi')
  } finally {
    saving.value = false
  }
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

.text-primary {
  color: #1976D2 !important;
}
</style>
