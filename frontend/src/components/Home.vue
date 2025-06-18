<template>
    <div class="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 to-blue-300 p-6">
        <h1 class="text-4xl font-extrabold mb-8 text-blue-900 text-center">
            Calendar App
        </h1>

        <div class="flex gap-6">
            <router-link to="/login"
                class="px-8 py-3 rounded-md bg-blue-700 text-white font-semibold hover:bg-blue-800 transition text-center">
                Login
            </router-link>

            <router-link to="/register"
                class="px-8 py-3 rounded-md border-2 border-blue-700 text-blue-700 font-semibold hover:bg-blue-700 hover:text-white transition text-center">
                Register
            </router-link>
        </div>
    </div>
</template>
