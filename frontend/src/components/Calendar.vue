<script setup>
import { computed, ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import api from '@/axios'

const showModal = ref(false)
const selectedDay = ref(null)
const showTaskForm = ref(false)
const newTaskTitle = ref('')

const now = dayjs()
const daysInMonth = now.daysInMonth()
const firstDay = now.startOf('month').day()

const startOfMonth = now.startOf('month').toISOString()
const endOfMonth = now.endOf('month').toISOString()

const tasks = ref([])

onMounted(async () => {
  try {
    const response = await api.get('/tasks', {
      params: {
        dateFrom: startOfMonth,
        dateTo: endOfMonth,
      }
    })
    tasks.value = response.data
  } catch (err) {
    console.error('Failed to fetch tasks:', err)
  }
})

const month = computed(() => {
  const days = []
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7

  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - firstDay + 1
    const date = dayNum > 0 && dayNum <= daysInMonth
      ? now.date(dayNum).format('YYYY-MM-DD')
      : null

    const dayTasks = date
      ? tasks.value.filter(task =>
        dayjs(task.date).format('YYYY-MM-DD') === date
      )
      : []

    days.push({
      label: dayNum > 0 && dayNum <= daysInMonth ? dayNum : '',
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
  <div class="p-4">
    <p>Days in month: {{ daysInMonth }}</p>
    <p>First day of month: {{ firstDay }}</p>

    <!-- Inline Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-96 relative shadow-lg">
        <button class="absolute top-2 right-3 text-gray-500 hover:text-black" @click="showModal = false">
          ✕
        </button>
        <h2 class="text-lg font-bold mb-2">
          Tasks for {{ selectedDay?.date }}
        </h2>

        <ul v-if="selectedDay?.tasks?.length">
          <li v-for="(task, index) in selectedDay.tasks" :key="index" class="mb-1">
            - {{ task.description }}
          </li>
        </ul>
        <p v-else>No tasks for this day.</p>

        <div class="mt-4">
          <button v-if="!showTaskForm" @click="showTaskForm = true" class="text-blue-600 hover:underline text-sm">
            + Add new task
          </button>

          <form v-else @submit.prevent="submitTask" class="mt-2 flex flex-col gap-2">
            <input v-model="newTaskTitle" type="text" placeholder="New task title" class="border px-2 py-1 rounded" />
            <button type="submit" class="bg-blue-600 text-white px-4 py-1 rounded">
              Add Task
            </button>
          </form>
        </div>
      </div>
    </div>

    <div id="calendar" class="grid grid-cols-7 gap-2 mt-4 text-center max-w-xl mx-auto">
      <div class="font-bold">Sun</div>
      <div class="font-bold">Mon</div>
      <div class="font-bold">Tue</div>
      <div class="font-bold">Wed</div>
      <div class="font-bold">Thu</div>
      <div class="font-bold">Fri</div>
      <div class="font-bold">Sat</div>

      <template v-for="(week, wIndex) in month" :key="wIndex">
        <div v-for="(day, dIndex) in week" :key="`${wIndex}-${dIndex}`" @click="openModal(day)"
          class="cursor-pointer border h-20 flex flex-col items-start justify-start bg-gray-50 p-1 hover:bg-gray-100">
          <div class="font-semibold">{{ day.label }}</div>
          <div v-for="(task, tIndex) in day.tasks" :key="tIndex"
            class="mt-1 bg-blue-100 text-blue-800 px-1 rounded text-xs w-full truncate">
            {{ task.description }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
#calendar {
  max-width: 500px;
}
</style>