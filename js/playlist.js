/** Fisher–Yates shuffle. Returns a new array; the input is left untouched. */
export function shuffle(items) {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * An endless shuffled playlist. Every track plays once per cycle, and each new
 * cycle is reshuffled without repeating the track that just played.
 */
export function createPlaylist(tracks) {
  let order = shuffle(tracks)
  let index = 0

  return {
    get current() {
      return order[index]
    },
    next() {
      index++
      if (index >= order.length) {
        const last = order[order.length - 1]
        order = shuffle(tracks)
        if (order.length > 1 && order[0] === last) {
          ;[order[0], order[1]] = [order[1], order[0]]
        }
        index = 0
      }
      return order[index]
    },
  }
}
