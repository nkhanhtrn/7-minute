import { ref } from 'vue'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { getFirestore, collection, doc, getDocs, setDoc, serverTimestamp, writeBatch } from 'firebase/firestore'
import { app } from './firebase'
import { getHistoryList, setHistory, toISO } from './history'

const auth = getAuth(app)
const db = getFirestore(app)

export const user = ref(null)
export const syncState = ref('idle') // idle | syncing | synced | error
export const syncError = ref('')

export function onAuthChange() {
  return onAuthStateChanged(auth, (u) => {
    user.value = u
    if (u) syncHistory()
  })
}

export async function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email.trim(), password)
}

export async function signOutUser() {
  syncState.value = 'idle'
  syncError.value = ''
  return signOut(auth)
}

export async function syncHistory() {
  if (!user.value) return
  syncState.value = 'syncing'
  syncError.value = ''
  try {
    const snap = await getDocs(collection(db, 'users', user.value.uid, 'workouts'))
    const remote = new Set()
    snap.forEach((d) => {
      const date = d.data()?.date ?? d.id
      if (date) remote.add(date)
    })
    const local = new Set(getHistoryList())
    const merged = new Set([...remote, ...local])
    const missing = [...merged].filter((d) => !remote.has(d))
    if (missing.length) {
      const batch = writeBatch(db)
      for (const d of missing) {
        batch.set(doc(db, 'users', user.value.uid, 'workouts', d), { date: d, at: serverTimestamp() }, { merge: true })
      }
      await batch.commit()
    }
    if (merged.size !== local.size) setHistory(merged)
    syncState.value = 'synced'
  } catch (e) {
    syncState.value = 'error'
    syncError.value = e.code ?? String(e)
  }
}

export async function recordWorkoutRemote(date = new Date()) {
  if (!user.value) return
  const iso = toISO(date)
  try {
    await setDoc(doc(db, 'users', user.value.uid, 'workouts', iso), { date: iso, at: serverTimestamp() }, { merge: true })
    syncState.value = 'synced'
  } catch (e) {
    syncState.value = 'error'
    syncError.value = e.code ?? String(e)
  }
}
