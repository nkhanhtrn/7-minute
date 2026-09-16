<script setup>
import { ref, computed } from 'vue'
import { user, syncState, syncError, signIn, signOutUser } from '../sync'

const email = ref('')
const password = ref('')
const busy = ref(false)
const error = ref('')

const statusText = computed(() => {
  if (syncState.value === 'syncing') return 'Syncing…'
  if (syncState.value === 'synced') return '✓ Synced'
  if (syncState.value === 'error') return `Sync failed (${syncError.value})`
  return ''
})

async function submit() {
  if (!email.value || !password.value || busy.value) return
  busy.value = true
  error.value = ''
  try {
    await signIn(email.value, password.value)
    password.value = ''
  } catch (e) {
    const code = e?.code ?? ''
    error.value =
      code === 'auth/invalid-credential' || code === 'INVALID_LOGIN_CREDENTIALS'
        ? 'Invalid email or password'
        : code === 'auth/network-request-failed'
          ? 'Network error — check your connection'
          : code || 'Sign-in failed'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <section class="account card">
    <template v-if="user">
      <div class="who">
        <span class="email" :title="user.email">{{ user.email }}</span>
        <button class="btn ghost" @click="signOutUser">Sign out</button>
      </div>
      <p v-if="statusText" class="status" :class="{ err: syncState === 'error' }">{{ statusText }}</p>
    </template>
    <template v-else>
      <h2>Sync your history</h2>
      <form @submit.prevent="submit">
        <input v-model="email" type="email" placeholder="Email" autocomplete="email" required />
        <input v-model="password" type="password" placeholder="Password" autocomplete="current-password" required />
        <button class="btn" type="submit" :disabled="busy">{{ busy ? 'Signing in…' : 'Sign in' }}</button>
      </form>
      <p v-if="error" class="status err">{{ error }}</p>
      <p v-else class="hint">Use your existing account. History stays on this device until you sign in.</p>
    </template>
  </section>
</template>

<style scoped>
.account {
  padding: 24px;
}

h2 {
  margin: 0 0 14px;
  font-size: 1.1rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

form {
  display: grid;
  gap: 10px;
}

input {
  font: inherit;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: var(--panel-2);
  color: var(--text);
  outline: none;
}

input:focus {
  border-color: var(--accent-2);
}

form .btn {
  padding: 12px;
  font-size: 1rem;
}

form .btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.who {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.email {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
}

.who .btn {
  padding: 10px 20px;
  font-size: 0.9rem;
}

.status {
  margin: 12px 0 0;
  font-size: 0.85rem;
  color: var(--muted);
}

.status.err {
  color: var(--accent-2);
}

.hint {
  margin: 12px 0 0;
  font-size: 0.8rem;
  color: var(--muted);
}
</style>
