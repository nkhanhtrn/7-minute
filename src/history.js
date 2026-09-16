const KEY = 'seven-minute-history'

export function toISO(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function getHistory() {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'))
  } catch {
    return new Set()
  }
}

export function recordWorkout(date = new Date()) {
  const set = getHistory()
  set.add(toISO(date))
  try {
    localStorage.setItem(KEY, JSON.stringify([...set]))
  } catch {
    /* storage unavailable */
  }
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
