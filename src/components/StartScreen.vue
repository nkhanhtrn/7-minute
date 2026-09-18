<script setup>
import { ref } from 'vue'
import { EXERCISES, WORK_SECONDS, REST_SECONDS } from '../workout'
import { toISO } from '../history'
import { user } from '../sync'
import CalendarView from './CalendarView.vue'
import AccountCard from './AccountCard.vue'
import DayDetailsCard from './DayDetailsCard.vue'

const selectedDate = ref(toISO(new Date()))

defineProps({
  hasSession: { type: Boolean, default: false },
})

defineEmits(['start', 'continue'])
</script>

<template>
  <div class="start">
    <header class="hero">
      <div class="badge">HICT · Scientific 7-Minute Workout</div>
      <h1><span class="seven">7</span> Minute Workout</h1>
      <p class="tagline">
        {{ EXERCISES.length }} exercises, {{ WORK_SECONDS }} seconds each, with {{ REST_SECONDS }} seconds of rest.
        All you need is a wall and a chair.
      </p>
      <div class="stats">
        <div class="stat"><span class="v">{{ EXERCISES.length }}</span><span class="k">Exercises</span></div>
        <div class="stat"><span class="v">30s</span><span class="k">Per Exercise</span></div>
        <div class="stat"><span class="v">10s</span><span class="k">Rest</span></div>
      </div>
      <div class="actions">
        <button class="btn start-btn" @click="$emit('start')">
          {{ hasSession ? '↻ Restart' : '▶ Start Workout' }}
        </button>
        <button v-if="hasSession" class="btn ghost continue-btn" @click="$emit('continue')">
          ▶ Continue
        </button>
      </div>
      <p class="hint">Space bar pauses mid-workout</p>
    </header>

    <div class="start-grid">
      <section class="list card">
        <h2>The Circuit</h2>
        <ol>
          <li v-for="(ex, i) in EXERCISES" :key="ex.name">
            <img class="pose" :src="ex.img" :alt="ex.name" loading="lazy" />
            <span class="name">{{ ex.name }}</span>
            <span class="step">{{ i + 1 }} / {{ EXERCISES.length }}</span>
          </li>
        </ol>
      </section>

      <div class="right-col">
        <CalendarView :selected="selectedDate" :selectable="!!user" @select="selectedDate = $event" />
        <DayDetailsCard v-if="user" :date="selectedDate" />
        <AccountCard v-else />
      </div>
    </div>
  </div>
</template>

<style scoped>
.start {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px 60px;
}

.start-grid {
  margin-top: 40px;
  display: grid;
  gap: 20px;
}

@media (min-width: 880px) {
  .start-grid {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
}

.hero {
  text-align: center;
}

.badge {
  display: inline-block;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent-2);
  border: 1px solid rgba(251, 113, 133, 0.35);
  border-radius: 999px;
  padding: 6px 14px;
}

h1 {
  font-size: clamp(2.4rem, 8vw, 3.6rem);
  margin: 18px 0 10px;
  letter-spacing: -0.02em;
}

.seven {
  color: var(--accent);
}

.tagline {
  color: var(--muted);
  max-width: 44ch;
  margin: 0 auto 26px;
  line-height: 1.6;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin-bottom: 30px;
}

.stat {
  background: var(--panel);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 16px;
  padding: 12px 20px;
  display: grid;
  gap: 2px;
}

.stat .v {
  font-size: 1.5rem;
  font-weight: 800;
}

.stat .k {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
}

.actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.start-btn {
  font-size: 1.2rem;
  padding: 16px 44px;
  border-radius: 999px;
}

.continue-btn {
  font-size: 1.2rem;
  padding: 16px 36px;
  border-radius: 999px;
}

.hint {
  color: var(--muted);
  font-size: 0.8rem;
  margin-top: 14px;
}

.right-col {
  display: grid;
  gap: 20px;
}

.list {
  padding: 24px;
}

.list h2 {
  margin: 0 0 14px;
  font-size: 1.1rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

ol {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 6px;
}

li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(51, 65, 85, 0.35);
}

.pose {
  width: 44px;
  height: 44px;
  object-fit: contain;
  flex-shrink: 0;
}

.name {
  font-weight: 600;
  flex: 1;
}

.step {
  font-size: 0.75rem;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}
</style>
