<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')

const handleRegister = async () => {
    error.value = ''
    try {
        const response = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        })

        if (!response.ok) {
            const data = await response.json()
            throw new Error(data.message || 'Registration failed')
        }

        const result = await response.json()
        localStorage.setItem('access_token', result.access_token);
        router.push('/calendar')
    } catch (err) {
        error.value = err.message
    }
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded shadow-md w-full max-w-sm">
            <h2 class="text-2xl font-bold mb-6 text-center">Register</h2>
            <form @submit.prevent="handleRegister">
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-1">Email</label>
                    <input v-model="email" type="email" required
                        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500" />
                </div>
                <div class="mb-6">
                    <label class="block text-sm font-medium mb-1">Password</label>
                    <input v-model="password" type="password" required
                        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500" />
                </div>
                <button type="submit"
                    class="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">
                    Register
                </button>
            </form>
            <p v-if="error" class="text-red-500 text-sm mt-4 text-center">{{ error }}</p>
        </div>
    </div>
</template>
