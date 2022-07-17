// add a transition
setTimeout(() => {
  const main = document.querySelector('main')
  main.style.opacity = 1
  main.style.filter = 'blur(0px)'
}, 500)

let audio = document.getElementById('audio')
let clicked = false
let sound = document.querySelector('body > main > header > div')

sound.addEventListener('click', function () {
  let tog = document.querySelector('.toggle-sound')
  tog.classList.toggle('sound-mute')
  if (clicked) {
    if (audio.muted) {
      audio.muted = false
    } else {
      audio.muted = true
    }
  } else {
    if (audio.paused) {
      audio.play()
    }
    clicked = true
  }
})
