import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createPlaylist, shuffle } from '../js/playlist.js'

const tracks = ['a', 'b', 'c', 'd', 'e']

test('shuffle returns a permutation without mutating the input', () => {
  const input = [...tracks]
  const result = shuffle(input)
  assert.deepEqual(input, tracks)
  assert.deepEqual([...result].sort(), tracks)
})

test('every track plays exactly once per cycle', () => {
  const playlist = createPlaylist(tracks)
  for (let cycle = 0; cycle < 50; cycle++) {
    const seen = [playlist.current]
    for (let i = 1; i < tracks.length; i++) seen.push(playlist.next())
    assert.deepEqual([...seen].sort(), tracks)
    playlist.next()
  }
})

test('never repeats a track back-to-back across cycles', () => {
  const playlist = createPlaylist(tracks)
  let previous = playlist.current
  for (let i = 0; i < 1000; i++) {
    const current = playlist.next()
    assert.notEqual(current, previous)
    previous = current
  }
})

test('handles a single-track playlist', () => {
  const playlist = createPlaylist(['solo'])
  assert.equal(playlist.current, 'solo')
  assert.equal(playlist.next(), 'solo')
})
