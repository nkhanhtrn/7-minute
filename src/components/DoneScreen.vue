<script setup>
import { EXERCISES } from '../workout'

defineEmits(['restart', 'home'])
</script>

<template>
  <div class="done">
    <div class="emoji">🏆</div>
    <h1>Workout Complete!</h1>
    <p class="sub">You crushed all {{ EXERCISES.length }} exercises. That's the full 7-minute circuit.</p>
    <div class="stats">
      <div class="stat"><span class="v">{{ EXERCISES.length }}</span><span class="k">Exercises</span></div>
      <div class="stat"><span class="v">~8</span><span class="k">Minutes</span></div>
      <div class="stat"><span class="v">100%</span><span class="k">Effort</span></div>
    </div>
    <div class="actions">
      <button class="btn" @click="$emit('restart')">↻ Do It Again</button>
      <button class="btn ghost" @click="$emit('home')">🏠 Home</button>
    </div>
  </div>
</template>

<style scoped>
.done {
  max-width: 480px;
  margin: 0 auto;
  padding: 64px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.emoji {
  font-size: 4rem;
  animation: pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes pop {
  from {
    transform: scale(0);
  }
}

h1 {
  margin: 8px 0 0;
}

.sub {
  color: var(--muted);
  line-height: 1.6;
  margin: 0 0 16px;
}

.stats {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.actions {
  display: flex;
  gap: 12px;
}

.stat {
  background: var(--panel);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 16px;
  padding: 12px 22px;
  display: grid;
  gap: 2px;
}

.stat .v {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--done);
}

.stat .k {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
}
</style>
