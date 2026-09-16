let ctx = null
let lastBeep = -1

export function initAudio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (AC) ctx = new AC()
  }
  if (ctx && ctx.state === 'suspended') ctx.resume()
}

function tone(freq, dur = 0.15, gain = 0.18) {
  if (!ctx) return
  const osc = ctx.createOscillator()
  const vol = ctx.createGain()
  osc.frequency.value = freq
  osc.type = 'sine'
  vol.gain.setValueAtTime(gain, ctx.currentTime)
  vol.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
  osc.connect(vol).connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + dur)
}

export const cues = {
  reset() {
    lastBeep = -1
  },
  countdown(remaining) {
    const s = Math.ceil(remaining)
    if (s <= 3 && s > 0 && s !== lastBeep) {
      lastBeep = s
      tone(880, 0.12)
    }
  },
  phase(endedPhase) {
    lastBeep = -1
    if (endedPhase === 'ready' || endedPhase === 'rest') tone(1318, 0.5, 0.22)
    else tone(659, 0.4, 0.2)
  },
  finish() {
    if (!ctx) return
      ;[523, 659, 784, 1047].forEach((f, i) => {
        setTimeout(() => tone(f, 0.25, 0.2), i * 180)
      })
  },
}
