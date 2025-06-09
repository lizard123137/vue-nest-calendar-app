<template>
  <Login />
  <!-- <Calendar /> -->
</template>

<script>
import Calendar from './components/Calendar.vue'
import Login from './components/Login.vue';

export default {
  name: 'App',
  components: {
    Calendar,
    Login
  }
}
</script>