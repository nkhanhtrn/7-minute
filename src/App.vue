<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import StartScreen from './components/StartScreen.vue'
import WorkoutScreen from './components/WorkoutScreen.vue'
import DoneScreen from './components/DoneScreen.vue'
import { EXERCISES, WORK_SECONDS, REST_SECONDS } from './workout'
import { recordWorkout } from './history'
import { initAudio, cues } from './audio'

const READY_SECONDS = 10
const TOTAL_STEPS = EXERCISES.length
const TOTAL_SECONDS = TOTAL_STEPS * WORK_SECONDS + (TOTAL_STEPS - 1) * REST_SECONDS

const screen = ref('start')
const index = ref(0)
const phase = ref('ready')
const paused = ref(false)
const remaining = ref(READY_SECONDS)
const doneSeconds = ref(0)
const sessionActive = ref(false)

let endAt = 0
let timer = null

const exercise = computed(() => EXERCISES[index.value])
const nextExercise = computed(() => EXERCISES[index.value + 1] ?? null)
const isLast = computed(() => index.value === TOTAL_STEPS - 1)
const phaseDuration = computed(() =>
  phase.value === 'work' ? WORK_SECONDS : phase.value === 'rest' ? REST_SECONDS : READY_SECONDS,
)
const progress = computed(() =>
  Math.min(1, Math.max(0, (doneSeconds.value + (phaseDuration.value - remaining.value)) / TOTAL_SECONDS)),
)

function run() {
  stopTimer()
  timer = setInterval(tick, 100)
  endAt = Date.now() + remaining.value * 1000
}

function stopTimer() {
  if (timer) clearInterval(timer)
  timer = null
}

function tick() {
  remaining.value = Math.max(0, (endAt - Date.now()) / 1000)
  cues.countdown(remaining.value)
  if (remaining.value <= 0) advance()
}

function advance() {
  cues.phase(phase.value)
  doneSeconds.value += phaseDuration.value - remaining.value
  if (phase.value === 'ready') {
    phase.value = 'work'
  } else if (phase.value === 'work') {
    if (isLast.value) {
      finish()
      return
    }
    phase.value = 'rest'
  } else {
    index.value++
    phase.value = 'work'
  }
  remaining.value = phaseDuration.value
  run()
}

function finish() {
  stopTimer()
  cues.finish()
  recordWorkout()
  sessionActive.value = false
  screen.value = 'done'
}

function start() {
  initAudio()
  reset()
  sessionActive.value = true
  screen.value = 'workout'
  run()
}

function reset() {
  stopTimer()
  index.value = 0
  phase.value = 'ready'
  paused.value = false
  remaining.value = READY_SECONDS
  doneSeconds.value = 0
  sessionActive.value = false
  cues.reset()
}

function continueWorkout() {
  initAudio()
  paused.value = false
  screen.value = 'workout'
  run()
}

function togglePause() {
  if (screen.value !== 'workout') return
  paused.value = !paused.value
  if (paused.value) {
    stopTimer()
  } else {
    run()
  }
}

function skip() {
  if (screen.value !== 'workout') return
  if (paused.value) paused.value = false
  advance()
}

function quit() {
  if (screen.value === 'workout') {
    stopTimer()
    paused.value = true
    sessionActive.value = true
  } else {
    reset()
  }
  screen.value = 'start'
}

function onKey(e) {
  if (e.code === 'Space' && screen.value === 'workout') {
    e.preventDefault()
    togglePause()
  }
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  stopTimer()
})
</script>

<template>
  <main>
    <StartScreen v-if="screen === 'start'" :has-session="sessionActive" @start="start" @continue="continueWorkout" />
    <WorkoutScreen
      v-else-if="screen === 'workout'"
      :exercise="exercise"
      :next-exercise="nextExercise"
      :index="index"
      :total="TOTAL_STEPS"
      :phase="phase"
      :remaining="remaining"
      :phase-duration="phaseDuration"
      :paused="paused"
      :progress="progress"
      @toggle-pause="togglePause"
      @skip="skip"
      @quit="quit"
    />
    <DoneScreen v-else @restart="start" @home="quit" />
  </main>
</template>
