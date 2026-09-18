<script setup>
import TimerRing from './TimerRing.vue'

const props = defineProps({
  exercise: { type: Object, required: true },
  nextExercise: { type: Object, default: null },
  index: { type: Number, required: true },
  total: { type: Number, required: true },
  phase: { type: String, required: true },
  remaining: { type: Number, required: true },
  phaseDuration: { type: Number, required: true },
  paused: { type: Boolean, required: true },
  progress: { type: Number, required: true },
})

defineEmits(['toggle-pause', 'skip', 'quit'])

const PHASES = {
  ready: { label: 'Get Ready', color: '#a78bfa' },
  work: { label: 'Work', color: 'var(--work)' },
  rest: { label: 'Rest', color: 'var(--rest)' },
}
</script>

<template>
  <div class="workout" :data-phase="phase">
    <div class="top">
      <span class="counter">Step {{ index + 1 }} / {{ total }}</span>
    </div>

    <div class="bar">
      <div class="fill" :style="{ width: `${Math.round(progress * 100)}%` }" />
    </div>

    <div class="phase-badge">{{ paused ? 'Paused' : PHASES[phase].label }}</div>

    <TimerRing :remaining="remaining" :total="phaseDuration" :color="PHASES[phase].color" />

    <div class="exercise">
      <img class="pose" :src="(phase === 'rest' && nextExercise ? nextExercise : exercise).img" :alt="(phase === 'rest' && nextExercise ? nextExercise : exercise).name" />
      <h2 v-if="phase !== 'rest'">{{ exercise.name }}</h2>
      <template v-else>
        <h2 v-if="nextExercise">Up next: {{ nextExercise.name }}</h2>
      </template>
      <p class="tip">
        {{ phase === 'rest' && nextExercise ? nextExercise.tip : exercise.tip }}
      </p>
    </div>

    <div class="dots">
      <span
        v-for="i in total"
        :key="i"
        :class="['dot', { done: i - 1 < index, current: i - 1 === index }]"
      />
    </div>

    <div class="controls">
      <button class="btn ghost" @click="$emit('toggle-pause')">{{ paused ? '▶ Resume' : '⏸ Pause' }}</button>
      <button class="btn ghost" @click="$emit('quit')">🏠 Home</button>
      <button class="btn ghost" @click="$emit('skip')">⏭ Skip</button>
    </div>
  </div>
</template>

<style scoped>
.workout {
  max-width: 560px;
  margin: 0 auto;
  padding: 24px 20px 48px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.top {
  display: flex;
  justify-content: center;
}

.counter {
  color: var(--muted);
  font-variant-numeric: tabular-nums;
  font-size: 0.9rem;
}

.bar {
  height: 8px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.15);
  overflow: hidden;
}

.fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  transition: width 0.3s linear;
}

.phase-badge {
  justify-self: center;
  margin-top: 6px;
  padding: 6px 18px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  background: var(--panel-2);
}

.workout[data-phase='work'] .phase-badge {
  color: var(--work);
}

.workout[data-phase='rest'] .phase-badge {
  color: var(--rest);
}

.workout[data-phase='ready'] .phase-badge {
  color: #a78bfa;
}

.pose {
  width: clamp(96px, 18vw, 160px);
  height: clamp(96px, 18vw, 160px);
  object-fit: contain;
  margin: 0 auto;
}

h2 {
  text-align: center;
  margin: 8px 0 0;
  font-size: clamp(1.5rem, 5vw, 2rem);
}

.tip {
  text-align: center;
  color: var(--muted);
  margin: 6px auto 0;
  max-width: 40ch;
  line-height: 1.5;
}

.dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(148, 163, 184, 0.25);
}

.dot.done {
  background: var(--done);
}

.dot.current {
  background: var(--accent);
  box-shadow: 0 0 0 4px rgba(244, 63, 94, 0.25);
}

.controls {
  display: flex;
  justify-content: center;
  gap: 12px;
}
</style>
