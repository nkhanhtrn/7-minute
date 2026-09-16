<script setup>
import { ref, computed, watch } from 'vue'
import { EXERCISES, WORK_SECONDS, REST_SECONDS } from '../workout'
import { useHistory, toISO } from '../history'
import { user, syncState, syncError, fetchWorkoutDetails, signOutUser } from '../sync'

const props = defineProps({
  date: { type: String, required: true },
})

const history = useHistory()
const details = ref(null)

const defaultDuration = EXERCISES.length * WORK_SECONDS + (EXERCISES.length - 1) * REST_SECONDS
const todayISO = toISO(new Date())

const dayLabel = computed(() => {
  const [y, m, d] = props.date.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
})

const done = computed(() => history.value.has(props.date))
const isFuture = computed(() => props.date > todayISO)

const completedAt = computed(() => {
  const at = details.value?.at
  const d = at?.toDate?.()
  return d ? d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : null
})

const durationSec = computed(() => details.value?.durationSec ?? defaultDuration)
const durationLabel = computed(() => `${Math.floor(durationSec.value / 60)}m ${durationSec.value % 60}s`)

const statusText = computed(() => {
  if (syncState.value === 'syncing') return 'Syncing…'
  if (syncState.value === 'synced') return '✓ Synced'
  if (syncState.value === 'error') return `Sync failed (${syncError.value})`
  return ''
})

async function load() {
  details.value = null
  details.value = await fetchWorkoutDetails(props.date)
}

watch(() => props.date, load, { immediate: true })
watch(user, load)
watch(syncState, (s) => {
  if (s === 'synced') load()
})
</script>

<template>
  <section class="details card">
    <header>
      <h2>{{ dayLabel }}</h2>
      <span class="badge" :class="done ? 'ok' : 'off'">
        {{ done ? '✓ Completed' : isFuture ? 'Upcoming' : 'Rest day' }}
      </span>
    </header>

    <ul v-if="done" class="facts">
      <li v-if="completedAt">
        <span class="k">Finished at</span>
        <span class="v">{{ completedAt }}</span>
      </li>
      <li>
        <span class="k">Exercises</span>
        <span class="v">{{ details?.exercises ?? EXERCISES.length }}</span>
      </li>
      <li>
        <span class="k">Duration</span>
        <span class="v">{{ durationLabel }}</span>
      </li>
      <li>
        <span class="k">Pace</span>
        <span class="v">{{ WORK_SECONDS }}s work / {{ REST_SECONDS }}s rest</span>
      </li>
    </ul>
    <p v-else class="empty">
      {{ isFuture ? 'This day hasn\'t happened yet.' : 'No workout recorded for this day.' }}
    </p>

    <footer class="acct">
      <span class="email" :title="user.email">
        {{ user.email }}
        <em v-if="statusText" :class="{ err: syncState === 'error' }"> · {{ statusText }}</em>
      </span>
      <button class="btn ghost" @click="signOutUser">Sign out</button>
    </footer>
  </section>
</template>

<style scoped>
.details {
  padding: 24px;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

h2 {
  margin: 0;
  font-size: 1.15rem;
}

.badge {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  border-radius: 999px;
  padding: 5px 12px;
}

.badge.ok {
  background: var(--done);
  color: #052e1b;
}

.badge.off {
  background: var(--panel-2);
  color: var(--muted);
}

.facts {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 6px;
}

.facts li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(51, 65, 85, 0.35);
}

.facts .k {
  color: var(--muted);
  font-size: 0.85rem;
}

.facts .v {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.empty {
  margin: 0;
  color: var(--muted);
  line-height: 1.6;
}

.acct {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid rgba(148, 163, 184, 0.15);
}

.email {
  color: var(--muted);
  font-size: 0.85rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.email em {
  font-style: normal;
  font-size: 0.8rem;
}

.email em.err {
  color: var(--accent-2);
}

.acct .btn {
  padding: 8px 16px;
  font-size: 0.85rem;
}
</style>
