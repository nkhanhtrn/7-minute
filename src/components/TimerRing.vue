<script setup>
import { computed } from 'vue'

const props = defineProps({
  remaining: { type: Number, required: true },
  total: { type: Number, required: true },
  color: { type: String, required: true },
})

const R = 120
const CIRC = 2 * Math.PI * R

const fraction = computed(() => (props.total > 0 ? Math.max(0, Math.min(1, props.remaining / props.total)) : 0))
const dash = computed(() => `${fraction.value * CIRC} ${CIRC}`)
const seconds = computed(() => Math.ceil(props.remaining))
</script>

<template>
  <div class="ring" :style="{ '--ring': color }">
    <svg viewBox="0 0 280 280">
      <circle class="track" cx="140" cy="140" :r="R" />
      <circle
        class="progress"
        cx="140"
        cy="140"
        :r="R"
        :stroke-dasharray="dash"
        :style="{ stroke: color }"
      />
    </svg>
    <div class="center">
      <div class="number" :class="{ urgent: remaining <= 3 }">{{ seconds }}</div>
      <div class="label">seconds</div>
    </div>
  </div>
</template>

<style scoped>
.ring {
  position: relative;
  width: min(64vw, 280px);
  aspect-ratio: 1;
  margin-inline: auto;
}

svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

circle {
  fill: none;
  stroke-width: 14;
  stroke-linecap: round;
}

.track {
  stroke: rgba(148, 163, 184, 0.15);
}

.progress {
  transition: stroke-dasharray 0.15s linear;
}

.center {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  text-align: center;
}

.number {
  font-size: 4.5rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.number.urgent {
  color: var(--ring);
  animation: pulse 1s infinite;
}

.label {
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.8rem;
  margin-top: 4px;
}

@keyframes pulse {
  50% {
    transform: scale(1.12);
  }
}
</style>
