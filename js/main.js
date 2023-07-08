import { CircularQueue, shuffle } from './CircleQueue.js'

let audio = document.getElementById('audio')
let clicked = false
let sound = document.querySelector('body > main > header > div')

const baseURL = 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview'

//I got the links from the audio tag in apple music preview
const album = [
  {
    song: 'Sonic Heroes',
    url: '115/v4/94/5d/0f/945d0f7f-4f75-34ac-cd66-6d0274d5f594/mzaf_10653277272440219643.plus.aac.ep.m4a',
  },
  {
    song: 'Cycles',
    url: '125/v4/1e/28/ea/1e28eae6-ad6b-d636-e05d-f14c4dec9506/mzaf_7684779148864293911.plus.aac.ep.m4a',
  },
  {
    song: 'Back by Now',
    url: '115/v4/40/52/e5/4052e5ef-acf1-535d-6f4a-aa2b92a84862/mzaf_8825934576247881917.plus.aac.ep.m4a',
  },
  {
    song: 'From the Beginning Til Now',
    url: '125/v4/a2/55/98/a25598df-c41c-d567-63ba-450c69b6da5f/mzaf_5512399793936208221.plus.aac.ep.m4a',
  },
  {
    song: 'Jupiter',
    url: '125/v4/ef/2b/4e/ef2b4e51-1ad6-c47b-7772-31d1bc583746/mzaf_304583199146327547.plus.aac.ep.m4a',
  },
  {
    song: 'Rotate',
    url: '125/v4/e5/93/4e/e5934ef8-cc5c-8b1e-10f3-cfeb19dccac6/mzaf_13334983935692768297.plus.aac.ep.m4a',
  },
  {
    song: 'Stephanie',
    url: '115/v4/61/20/2b/61202b7b-1d54-5c34-199f-d94dab093ddb/mzaf_14847972783641648138.plus.aac.ep.m4a',
  },
  {
    song: 'If You Want the Rainbow',
    url: '125/v4/d4/d7/b9/d4d7b9ab-219f-aad0-d547-debe73c9ebe4/mzaf_17538184322825033580.plus.aac.ep.m4a',
  },
  {
    song: 'The Binding of Isaac',
    url: '125/v4/a0/ec/d5/a0ecd5b4-b4ec-adb5-ae76-96f1ea8bb43f/mzaf_13268651908606029302.plus.aac.ep.m4a',
  },
]

let q = new CircularQueue(album)
q.element = shuffle(album)
let object = q.dequeue()
audio.src = baseURL + object.url

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

audio.addEventListener('ended', function () {
  let object = q.dequeue()
  audio.src = baseURL + object.url
  audio.play()
})
