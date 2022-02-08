export default class Move {
  constructor() {
    this.x1 = null
    this.y1 = null

    this.x2 = null
    this.y2 = null
  }

  get completed() {
    return this.x1 !== null && this.y1 !== null && this.x2 !== null && this.y2 !== null
  }

  get start() {
    return [this.x1, this.y1]
  }

  get end() {
    return [this.x2, this.y2]
  }
}