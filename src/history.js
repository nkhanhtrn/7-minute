import { ref } from 'vue'

const KEY = 'seven-minute-history'

export function toISO(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function load() {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'))
  } catch {
    return new Set()
  }
}

const history = ref(load())

export function useHistory() {
  return history
}

export function getHistory() {
  return history.value
}

export function getHistoryList() {
  return [...history.value]
}

function persist(set) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...set]))
  } catch {
    /* storage unavailable */
  }
}

export function setHistory(set) {
  history.value = new Set([...set])
  persist(history.value)
}

export function recordWorkout(date = new Date()) {
  setHistory(new Set([...history.value, toISO(date)]))
}

export function currentStreak() {
  const set = getHistory()
  if (set.size === 0) return 0
  const cursor = new Date()
  if (!set.has(toISO(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
    if (!set.has(toISO(cursor))) return 0
  }
  let streak = 0
  while (set.has(toISO(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}
