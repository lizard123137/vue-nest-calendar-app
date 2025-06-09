<script setup>
import { computed, ref, onMounted } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'

const now = dayjs()
const daysInMonth = now.daysInMonth()
const firstDay = now.startOf('month').day()

const startOfMonth = now.startOf('month').toISOString()
const endOfMonth = now.endOf('month').toISOString()

const tasks = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/tasks', {
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
</script>

<template>
  <div class="p-4">
    <p>Days in month: {{ daysInMonth }}</p>
    <p>First day of month: {{ firstDay }}</p>

    <div id="calendar" class="grid grid-cols-7 gap-2 mt-4 text-center">
      <div class="font-bold">Sun</div>
      <div class="font-bold">Mon</div>
      <div class="font-bold">Tue</div>
      <div class="font-bold">Wed</div>
      <div class="font-bold">Thu</div>
      <div class="font-bold">Fri</div>
      <div class="font-bold">Sat</div>

      <template v-for="(week, wIndex) in month" :key="wIndex">
        <div
          v-for="(day, dIndex) in week"
          :key="`${wIndex}-${dIndex}`"
          class="border h-16 flex items-center justify-center bg-gray-50"
        >
          <div class="font-semibold">{{ day.label }}</div>
          <div
            v-for="(task, tIndex) in day.tasks"
            :key="tIndex"
            class="mt-1 bg-blue-100 text-blue-800 px-1 rounded text-xs w-full truncate"
          >
            {{ task.title }}
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
