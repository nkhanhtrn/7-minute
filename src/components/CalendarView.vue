<script setup>
import { ref, computed } from 'vue'
import { getHistory, currentStreak, toISO } from '../history'

const history = getHistory()
const streak = currentStreak()
const todayISO = toISO(new Date())

const now = new Date()
const view = ref({ year: now.getFullYear(), month: now.getMonth() })

const monthLabel = computed(() =>
  new Date(view.value.year, view.value.month, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' }),
)

const isCurrentMonth = computed(
  () => view.value.year === now.getFullYear() && view.value.month === now.getMonth(),
)

const cells = computed(() => {
  const { year, month } = view.value
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const offset = (new Date(year, month, 1).getDay() + 6) % 7 // Monday-first
  const list = []
  for (let i = 0; i < offset; i++) list.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    list.push({
      day: d,
      iso,
      done: history.has(iso),
      isToday: iso === todayISO,
      isFuture: iso > todayISO,
    })
  }
  return list
})

const monthCount = computed(() => cells.value.filter((c) => c?.done).length)

function shift(delta) {
  const d = new Date(view.value.year, view.value.month + delta, 1)
  view.value = { year: d.getFullYear(), month: d.getMonth() }
}
</script>

<template>
  <section class="calendar card">
    <header>
      <button class="nav" @click="shift(-1)">‹</button>
      <h2>{{ monthLabel }}</h2>
      <button class="nav" :disabled="isCurrentMonth" @click="shift(1)">›</button>
    </header>

    <div class="weekdays">
      <span v-for="w in ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']" :key="w">{{ w }}</span>
    </div>

    <div class="grid">
      <div v-for="(cell, i) in cells" :key="i" class="cell-wrap">
        <div
          v-if="cell"
          class="cell"
          :class="{ done: cell.done, today: cell.isToday, future: cell.isFuture }"
          :title="cell.done ? 'Workout completed' : ''"
        >
          {{ cell.day }}
        </div>
      </div>
    </div>

    <footer class="summary">
      <span>🔥 {{ streak }} day streak</span>
      <span>{{ monthCount }} workout{{ monthCount === 1 ? '' : 's' }} this month</span>
    </footer>
  </section>
</template>

<style scoped>
.calendar {
  padding: 24px;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

h2 {
  margin: 0;
  font-size: 1.15rem;
}

.nav {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--panel-2);
  color: var(--text);
  font-size: 1.2rem;
  line-height: 1;
}

.nav:disabled {
  opacity: 0.35;
  cursor: default;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 0.72rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.cell-wrap {
  aspect-ratio: 1;
}

.cell {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: rgba(51, 65, 85, 0.35);
  font-variant-numeric: tabular-nums;
  font-size: 0.85rem;
}

.cell.done {
  background: var(--done);
  color: #052e1b;
  font-weight: 800;
}

.cell.today:not(.done) {
  box-shadow: inset 0 0 0 2px var(--accent);
}

.cell.done.today {
  box-shadow: inset 0 0 0 2px #fff;
}

.cell.future {
  opacity: 0.3;
}

.summary {
  display: flex;
  justify-content: space-between;
  margin-top: 14px;
  color: var(--muted);
  font-size: 0.85rem;
}
</style>
