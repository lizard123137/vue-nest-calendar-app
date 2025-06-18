<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import dayjs from 'dayjs'
import api from '@/axios'
import localeData from 'dayjs/plugin/localeData';
dayjs.extend(localeData);

const showModal = ref(false)
const selectedDay = ref(null)
const showTaskForm = ref(false)
const newTaskTitle = ref('')

const selectedYear = ref(dayjs().year())
const selectedMonth = ref(dayjs().month())  // 0-indexed: Jan=0, Dec=11

const monthNames = Array.from({ length: 12 }).map((_, i) =>
  dayjs().month(i).format('MMMM')
)


const now = computed(() => dayjs().year(selectedYear.value).month(selectedMonth.value))

const daysInMonth = computed(() => now.value.daysInMonth())
const firstDay = computed(() => now.value.startOf('month').day())

const startOfMonth = computed(() => now.value.startOf('month').toISOString())
const endOfMonth = computed(() => now.value.endOf('month').toISOString())

const tasks = ref([])

async function fetchTasks() {
  try {
    const response = await api.get('/tasks', {
      params: {
        dateFrom: startOfMonth.value,
        dateTo: endOfMonth.value,
      }
    })
    tasks.value = response.data
  } catch (err) {
    console.error('Failed to fetch tasks:', err)
  }
}

watch([selectedYear, selectedMonth], fetchTasks, { immediate: true })

const month = computed(() => {
  const days = []
  const totalCells = Math.ceil((firstDay.value + daysInMonth.value) / 7) * 7

  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - firstDay.value + 1
    const date = dayNum > 0 && dayNum <= daysInMonth.value
      ? now.value.date(dayNum).format('YYYY-MM-DD')
      : null

    const dayTasks = date
      ? tasks.value.filter(task =>
        dayjs(task.date).format('YYYY-MM-DD') === date
      )
      : []

    days.push({
      label: dayNum > 0 && dayNum <= daysInMonth.value ? dayNum : '',
      date,
      tasks: dayTasks
    })
  }

  const weeks = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  return weeks
})

function openModal(day) {
  if (!day.date) return
  selectedDay.value = day
  showModal.value = true
  showTaskForm.value = false
  newTaskTitle.value = ''
}

async function submitTask() {
  if (!newTaskTitle.value.trim()) return

  try {
    const response = await api.post('/tasks', {
      description: newTaskTitle.value,
      date: selectedDay.value.date,
    })

    tasks.value.push(response.data)
    selectedDay.value.tasks.push(response.data)

    newTaskTitle.value = ''
    showTaskForm.value = false
  } catch (err) {
    console.error('Failed to add task:', err)
  }
}
</script>

<template>
  <div class="p-4 max-w-lg mx-auto">

    <div class="flex justify-center items-center gap-4 mb-6">
      <select v-model="selectedYear" class="border rounded px-3 py-1">
        <option v-for="y in [2023, 2024, 2025, 2026]" :key="y" :value="y">{{ y }}</option>
      </select>

      <select v-model="selectedMonth" class="border rounded px-3 py-1">
        <option v-for="(name, index) in dayjs.months()" :key="name" :value="index">
          {{ name }}
        </option>
      </select>
    </div>

    <div id="calendar" class="grid grid-cols-7 gap-1 text-center select-none">
      <div class="font-semibold text-gray-700">Sun</div>
      <div class="font-semibold text-gray-700">Mon</div>
      <div class="font-semibold text-gray-700">Tue</div>
      <div class="font-semibold text-gray-700">Wed</div>
      <div class="font-semibold text-gray-700">Thu</div>
      <div class="font-semibold text-gray-700">Fri</div>
      <div class="font-semibold text-gray-700">Sat</div>

      <template v-for="(week, wIndex) in month" :key="wIndex">
        <div v-for="(day, dIndex) in week" :key="`${wIndex}-${dIndex}`" @click="openModal(day)" class="cursor-pointer border rounded h-20 flex flex-col p-1 transition-colors duration-150
                 hover:bg-blue-50
                 bg-white
                 ">
          <div class="font-semibold text-gray-800">{{ day.label }}</div>
          <div v-for="(task, tIndex) in day.tasks" :key="tIndex"
            class="mt-1 bg-blue-100 text-blue-900 px-1 rounded text-xs truncate" title="task.description">
            {{ task.description }}
          </div>
        </div>
      </template>
    </div>

    <!-- Inline Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50" @click.self="showModal = false">
      <div class="bg-white rounded-xl p-6 w-96 max-w-full relative shadow-lg" @click.stop>
        <button class="absolute top-2 right-3 text-gray-500 hover:text-black text-lg font-bold"
          @click="showModal = false" aria-label="Close modal">
          ✕
        </button>
        <h2 class="text-lg font-bold mb-3">
          Tasks for {{ selectedDay?.date }}
        </h2>

        <ul v-if="selectedDay?.tasks?.length" class="max-h-48 overflow-auto mb-4">
          <li v-for="(task, index) in selectedDay.tasks" :key="index" class="mb-1 border-b border-gray-200 pb-1">
            - {{ task.description }}
          </li>
        </ul>
        <p v-else class="mb-4 text-gray-600">No tasks for this day.</p>

        <div>
          <button v-if="!showTaskForm" @click="showTaskForm = true" class="text-blue-600 hover:underline text-sm">
            + Add new task
          </button>

          <form v-else @submit.prevent="submitTask" class="mt-2 flex flex-col gap-2">
            <input v-model="newTaskTitle" type="text" placeholder="New task title"
              class="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required autofocus />
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Add Task
            </button>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
#calendar {
  max-width: 100%;
}
</style>
