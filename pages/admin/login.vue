<script setup lang="ts">
definePageMeta({
  layout: false,
})

const { login } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  const res = await login(email.value, password.value)
  loading.value = false

  if (res.success) {
    router.push('/admin')
  } else {
    errorMessage.value = res.error || 'Authentication failed'
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-100">
    <div class="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
      <div class="text-center space-y-2">
        <h1 class="font-bold text-2xl text-white tracking-wider uppercase">WHITEEYES CMS</h1>
        <p class="text-xs text-slate-400 font-mono">ENTER ADMIN CREDENTIALS</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">EMAIL ADDRESS</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="admin@whiteeyes.metal"
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-xs font-medium text-slate-300 mb-1">PASSWORD</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div v-if="errorMessage" class="bg-red-950/60 border border-red-800 text-red-300 text-xs p-3 rounded-lg">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-3 rounded-lg text-sm transition-colors shadow-lg"
        >
          <span v-if="loading">AUTHENTICATING...</span>
          <span v-else>SIGN IN TO CMS</span>
        </button>
      </form>

      <div class="pt-4 border-t border-slate-800 text-center text-xs text-slate-500 font-mono">
        DEMO SEED LOGIN: <br />
        <span class="text-slate-300">admin@whiteeyes.metal</span> / <span class="text-slate-300">Whiteeyes2026!</span>
      </div>
    </div>
  </div>
</template>
