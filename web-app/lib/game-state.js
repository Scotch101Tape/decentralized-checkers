export class GameState {
  constructor(hierarchy, _parent) {
    this.parent = _parent
    this.ref = hierarchy

    for (const key in hierarchy) {
      this[key] = new GameState(hierarchy[key], this)
    }
  }

  isPartOf(gameState) {
    if (this.ref == gameState.ref) {
      return true
    } else if (this.parent != undefined) {
      return this.parent.isPartOf(gameState)
    }

    return false
  }
}

export class Game {
  constructor(gameState) {
    this.gameState = gameState
  }

  isInState(gameState) {
    return this.gameState.isPartOf(gameState)
  }

  setState(state) {
    this.state = state
  }
}