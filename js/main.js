import { createPlaylist } from './playlist.js'
import { PREVIEW_BASE_URL, tracks } from './tracks.js'

const ARTIST = 'Tyree'
const ARTWORK = [
  { src: 'artist/profile.jpg', sizes: '480x480', type: 'image/jpeg' },
]

const audio = document.getElementById('audio')
const toggle = document.querySelector('.toggle-sound')
const player = document.querySelector('.player')
const title = player.querySelector('.player__title')
const nextButton = player.querySelector('.player__next')
const video = document.querySelector('.background-video')

const playlist = createPlaylist(tracks)
// Only resume after errors/track changes if the visitor actually asked for music.
let wantsPlayback = false
let consecutiveErrors = 0

function load(track) {
  audio.src = PREVIEW_BASE_URL + track.path
  title.textContent = track.title
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
  player.classList.toggle('is-playing', playing)
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
    // Every preview failed (e.g. Apple moved them); hide the player entirely.
    toggle.hidden = true
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

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
function syncBackground() {
  if (reducedMotion.matches) {
    video.pause()
  } else {
    video.play().catch(() => {})
  }
}
reducedMotion.addEventListener('change', syncBackground)
syncBackground()

load(playlist.current)
player.hidden = false
