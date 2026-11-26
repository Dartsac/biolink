import { createPlaylist } from './playlist.js'
import { PREVIEW_BASE_URL, tracks } from './tracks.js'

const ARTIST = 'Tyree'
const ARTWORK = [
  { src: 'artist/profile.jpg', sizes: '480x480', type: 'image/jpeg' },
]
// Long titles scroll like a music app: rest, glide one lap, rest again.
const MARQUEE_SPEED = 30 // px per second
const MARQUEE_REST = 2000 // ms spent at the start of every lap

const audio = document.getElementById('audio')
const toggle = document.querySelector('.toggle-sound')
const player = document.querySelector('.player')
const title = player.querySelector('.player__title')
const titleTrack = title.querySelector('.player__title-track')
const titleText = title.querySelector('.player__title-text')
const nextButton = player.querySelector('.player__next')
const video = document.querySelector('.background-video')
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

// Second copy of the title so the marquee can loop seamlessly. Hidden from
// assistive tech, and only filled in while scrolling, so the title is
// announced exactly once.
const titleClone = titleText.cloneNode()
titleClone.setAttribute('aria-hidden', 'true')
titleTrack.append(titleClone)

const playlist = createPlaylist(tracks)
// Only resume after errors/track changes if the visitor actually asked for music.
let wantsPlayback = false
let consecutiveErrors = 0
let marquee = null

function stopMarquee() {
  if (marquee) marquee.cancel()
  marquee = null
  title.classList.remove('is-scrolling')
  titleClone.textContent = ''
}

/** Show the title in full if it fits; otherwise scroll it (or ellipsize it
    for visitors who prefer reduced motion). Safe to call at any time. */
function fitTitle() {
  const available =
    title.getBoundingClientRect().width -
    parseFloat(getComputedStyle(title).paddingLeft)
  const needed = titleText.getBoundingClientRect().width
  const overflows = needed - available > 0.5

  if (!overflows || reducedMotion.matches || !titleTrack.animate) {
    stopMarquee()
    return
  }
  if (marquee) return // already scrolling this title; let it run

  titleClone.textContent = titleText.textContent
  title.classList.add('is-scrolling')
  // The track is now two copies wide, so -50% is exactly one lap.
  const lap = titleTrack.getBoundingClientRect().width / 2
  const travel = (lap / MARQUEE_SPEED) * 1000
  const duration = MARQUEE_REST + travel
  marquee = titleTrack.animate(
    [
      { transform: 'translateX(0)' },
      { transform: 'translateX(0)', offset: MARQUEE_REST / duration },
      { transform: 'translateX(-50%)' },
    ],
    { duration, iterations: Infinity },
  )
}

function load(track) {
  audio.src = PREVIEW_BASE_URL + track.path
  stopMarquee()
  titleText.textContent = track.title
  fitTitle()
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: ARTIST,
      artwork: ARTWORK,
    })
  }
}

function play() {
  wantsPlayback = true
  audio.play().catch(() => {
    // Autoplay policies or network errors; the UI stays in the paused state.
  })
}

function pause() {
  wantsPlayback = false
  audio.pause()
}

function next() {
  load(playlist.next())
  if (wantsPlayback) play()
}

function syncState() {
  const playing = !audio.paused
  toggle.classList.toggle('sound-mute', !playing)
  toggle.setAttribute('aria-label', playing ? 'Pause music' : 'Play music')
}

toggle.addEventListener('click', () => (audio.paused ? play() : pause()))
nextButton.addEventListener('click', () => {
  wantsPlayback = true
  next()
})

audio.addEventListener('play', syncState)
audio.addEventListener('pause', syncState)
audio.addEventListener('playing', () => (consecutiveErrors = 0))
audio.addEventListener('ended', next)
audio.addEventListener('error', () => {
  consecutiveErrors++
  if (consecutiveErrors < tracks.length) {
    next()
  } else {
    // Every preview failed (e.g. Apple moved them); hide the player.
    player.hidden = true
  }
})

if ('mediaSession' in navigator) {
  navigator.mediaSession.setActionHandler('play', play)
  navigator.mediaSession.setActionHandler('pause', pause)
  navigator.mediaSession.setActionHandler('nexttrack', () => {
    wantsPlayback = true
    next()
  })
}

/******************************************
/* BACKGROUND VIDEO
/*******************************************/
// The background should always be moving unless the visitor prefers reduced
// motion. Browsers (Safari especially) pause muted video behind our back:
// Low Power Mode, audio-session interruptions, backgrounding the tab, or a
// failed loop. Nothing else restarts it, so we do, on every relevant signal.
function syncBackground() {
  if (reducedMotion.matches) {
    video.pause()
    return
  }
  if (document.hidden || (!video.paused && !video.ended)) return
  video.play().catch(() => {
    // Autoplay blocked (e.g. iOS Low Power Mode). The next tap retries.
  })
}

// Deferred so we never fight the browser in a tight pause/play loop.
video.addEventListener('pause', () => setTimeout(syncBackground, 250))
video.addEventListener('ended', syncBackground)
document.addEventListener('visibilitychange', syncBackground)
window.addEventListener('pageshow', syncBackground)
// Any tap is a user gesture, which unblocks playback where autoplay is denied.
document.addEventListener('click', syncBackground)
document.addEventListener('touchend', syncBackground, { passive: true })

reducedMotion.addEventListener('change', () => {
  syncBackground()
  fitTitle()
})
window.addEventListener('resize', fitTitle)

syncBackground()
// Unhide before loading: the title can only be measured once it is rendered.
player.hidden = false
load(playlist.current)
