export class CircularQueue {
  constructor(arr) {
    this.element = arr
    this.size = arr.length + 1
    this.length = arr.length
    this.front = 0
    this.back = -1
    this.restart = arr.length
  }
  isEmpty() {
    return this.length == 0
  }
  enqueue(element) {
    this.back++
    this.element[this.back % this.size] = element
    this.length++
  }
  dequeue() {
    if (this.isEmpty()) {
      this.length = this.restart
      this.front = 0
    }
    const value = this.getFront()
    this.element[this.front % this.size] = value
    this.front++
    this.length--
    return value
  }
  getFront() {
    return this.element[this.front % this.size]
  }
}

export function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
