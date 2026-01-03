<template>
  <div>
    <!-- Summary Cards -->
    <v-row class="mb-6">
      <v-col cols="12" md="4">
        <v-card variant="outlined" color="primary">
          <v-card-text class="text-center">
            <v-icon size="40" color="primary">mdi-star</v-icon>
            <p class="text-caption text-grey mt-2">Total Skor</p>
            <p class="text-h4 font-weight-bold text-primary">{{ totalScore.toFixed(2) }}</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card variant="outlined" color="success">
          <v-card-text class="text-center">
            <v-icon size="40" color="success">mdi-format-list-bulleted</v-icon>
            <p class="text-caption text-grey mt-2">Jumlah Aspek</p>
            <p class="text-h4 font-weight-bold text-success">{{ aspectScores.length }}</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card variant="outlined" color="info">
          <v-card-text class="text-center">
            <v-icon size="40" color="info">mdi-percent</v-icon>
            <p class="text-caption text-grey mt-2">Rata-rata</p>
            <p class="text-h4 font-weight-bold text-info">{{ averageScore.toFixed(2) }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Radar Chart with ApexCharts -->
    <v-card variant="outlined" class="mb-4">
      <v-card-title class="text-subtitle-1">
        <v-icon start>mdi-chart-box</v-icon>
        Spider Chart - Skor per Aspek
      </v-card-title>
      <v-card-text>
        <ClientOnly>
          <apexchart
            type="radar"
            height="450"
            :options="chartOptions"
            :series="chartSeries"
          />
        </ClientOnly>
      </v-card-text>
    </v-card>

    <!-- Detailed Breakdown -->
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title>
          <v-icon start>mdi-table</v-icon>
          Detail Tabel Skor
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-table density="compact">
            <thead>
              <tr>
                <th>No</th>
                <th>Aspek</th>
                <th class="text-center">Skor</th>
                <th class="text-center">Persentase</th>
                <th class="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(aspect, idx) in aspectScores" :key="idx">
                <td>{{ idx + 1 }}</td>
                <td>{{ aspect.aspectName }}</td>
                <td class="text-center">
                  <v-chip size="small" color="primary" variant="tonal">
                    {{ parseFloat(aspect.score || 0).toFixed(2) }}
                  </v-chip>
                </td>
                <td class="text-center">{{ getPercentage(aspect.score).toFixed(1) }}%</td>
                <td class="text-center">
                  <v-chip size="small" :color="getStatusColor(aspect.score)" variant="flat">
                    {{ getStatusText(aspect.score) }}
                  </v-chip>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="font-weight-bold">
                <td colspan="2" class="text-right">Total:</td>
                <td class="text-center">
                  <v-chip color="primary">{{ totalScore.toFixed(2) }}</v-chip>
                </td>
                <td class="text-center">100%</td>
                <td></td>
              </tr>
            </tfoot>
          </v-table>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  aspectScores: {
    type: Array,
    default: () => []
  },
  totalScore: {
    type: Number,
    default: 0
  }
})

const averageScore = computed(() => {
  if (props.aspectScores.length === 0) return 0
  return props.totalScore / props.aspectScores.length
})

const maxScore = computed(() => {
  if (props.aspectScores.length === 0) return 5
  return Math.max(...props.aspectScores.map(a => parseFloat(a.score || 0)), 5)
})

// ApexCharts configuration
const chartSeries = computed(() => [{
  name: 'Skor',
  data: props.aspectScores.map(aspect => parseFloat(aspect.score || 0))
}])

const chartOptions = computed(() => ({
  chart: {
    type: 'radar',
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: false
      }
    },
    dropShadow: {
      enabled: true,
      blur: 1,
      left: 1,
      top: 1
    }
  },
  colors: ['#1976D2'],
  stroke: {
    width: 2
  },
  fill: {
    opacity: 0.3
  },
  markers: {
    size: 5,
    colors: ['#fff'],
    strokeColors: '#1976D2',
    strokeWidth: 2,
    hover: {
      size: 7
    }
  },
  xaxis: {
    categories: props.aspectScores.map(aspect => aspect.aspectName),
    labels: {
      style: {
        colors: props.aspectScores.map(() => '#1976D2'),
        fontSize: '12px',
        fontWeight: 600
      }
    }
  },
  yaxis: {
    show: true,
    min: 0,
    max: Math.ceil(maxScore.value),
    tickAmount: 5,
    labels: {
      formatter: (val) => val.toFixed(1)
    }
  },
  dataLabels: {
    enabled: true,
    background: {
      enabled: true,
      borderRadius: 2,
      padding: 4,
      opacity: 0.9,
      borderColor: '#1976D2'
    },
    style: {
      fontSize: '11px',
      fontWeight: 'bold',
      colors: ['#1976D2']
    },
    formatter: (val) => val.toFixed(2)
  },
  plotOptions: {
    radar: {
      size: 180,
      polygons: {
        strokeColors: '#e0e0e0',
        strokeWidth: 1,
        connectorColors: '#e0e0e0',
        fill: {
          colors: ['#f8f8f8', '#fff']
        }
      }
    }
  },
  legend: {
    show: false
  },
  tooltip: {
    enabled: true,
    y: {
      formatter: (val) => val.toFixed(2) + ' poin'
    }
  }
}))

const getPercentage = (score) => {
  const numScore = parseFloat(score || 0)
  if (maxScore.value === 0) return 0
  return (numScore / maxScore.value) * 100
}

const getStatusColor = (score) => {
  const numScore = parseFloat(score || 0)
  if (numScore >= 4) return 'success'
  if (numScore >= 2.5) return 'warning'
  return 'error'
}

const getStatusText = (score) => {
  const numScore = parseFloat(score || 0)
  if (numScore >= 4) return 'Baik'
  if (numScore >= 2.5) return 'Cukup'
  return 'Perlu Perbaikan'
}
</script>

<style scoped>
/* Custom styling if needed */
</style>
