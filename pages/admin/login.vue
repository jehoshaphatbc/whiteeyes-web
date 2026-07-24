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
  <div class="min-h-screen bg-void flex items-center justify-center p-4 font-sans text-offwhite relative overflow-hidden">
    <UiGrainOverlay />

    <div class="max-w-md w-full bg-void-charcoal border border-void-border p-8 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.9)] relative z-10 space-y-8">
      <div class="text-center space-y-2">
        <span class="font-mono text-[10px] text-blood tracking-widest uppercase">// SECURE ACCESS</span>
        <h1 class="font-display text-4xl text-white uppercase tracking-wider text-glitch">WHITEEYES CMS</h1>
        <p class="font-mono text-xs text-ash tracking-widest uppercase">ENTER ADMIN CREDENTIALS</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-2">EMAIL ADDRESS</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="admin@whiteeyes.metal"
            class="w-full bg-void border border-void-border px-4 py-3 text-sm text-offwhite focus:border-blood focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label class="block font-mono text-xs text-ash tracking-widest uppercase mb-2">PASSWORD</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full bg-void border border-void-border px-4 py-3 text-sm text-offwhite focus:border-blood focus:outline-none transition-colors"
          />
        </div>

        <div v-if="errorMessage" class="bg-blood-dark/50 border border-blood text-white font-mono text-xs p-3 uppercase tracking-wider">
          ⚠ {{ errorMessage }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="btn-brutal-primary w-full py-4 text-sm tracking-widest"
        >
          <span v-if="loading">AUTHENTICATING...</span>
          <span v-else>SIGN IN TO CMS ↗</span>
        </button>
      </form>
    </div>
  </div>
</template>
