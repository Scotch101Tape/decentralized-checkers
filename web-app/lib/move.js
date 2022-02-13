import { PieceEnum, MeAndOtherEnum } from "./board"

export class BoardPosition {
  constructor(x, y) {
    console.assert(
      0 <= x && x < 8 &&
      0 <= y && y < 8
    )

    this.x = x
    this.y = y
  }

  pieceFromRawBoard(rawBoard) {
    return rawBoard[this.x][this.y]
  }
}

class Move {
  asRaw() {
    return [this.start.x, this.start.y, this.end.x, this.end.y]
  }

  static fromStartAndEnd(start, end) {
    if (Math.abs(start.x - end.x) == 1) {
      return SimpleMove(start, end)
    } else {
      return JumpMove(start, end)
    }
  }
}

export class SimpleMove extends Move {
  constructor(start, end) {
    this.start = start
    this.end = end
  }

  isValidFromBoard(board) {
    const isValidPosition = (() => {
      const isKing = this.start.pieceFromRawBoard(board.asMeAndOther()) == MeAndOtherEnum.MeKing

      const isBackward = this.start.x - this.end.x == -1

      if (isBackward && !isKing) {
        return false
      }

      return this.start.x - this.end.x == 1 &&
      Math.abs(this.start.y - this.end.y) == 1
    })()

    // shortcut out
    if (!isValidPosition) {
      return false
    }

    const isValidPieces = (() => {
      const startPiece = this.start.pieceFromRawBoard(board.asMeAndOther())
      const endPiece = this.end.pieceFromRawBoard(board.asMeAndOther())

      return (startPiece == MeAndOtherEnum.Me ||
      startPiece == MeAndOtherEnum.MeKing) &&
      endPiece == MeAndOtherEnum.None
    })()

    return isValidPieces && isValidPosition
  }
}

export class JumpMove extends Move {
  constructor(start, end) {
    this.start = start
    this.end = end
    this.jump = new BoardPosition((start.x - end.x) / 2 + this.start.x, (start.y - end.y) / 2 + this.start.y)
  }

  isValidFromBoard(board) {
    const isValidPosition = (() => {
      const isKing = this.start.pieceFromRawBoard(board.asMeAndOther()) == MeAndOtherEnum.MeKing

      const isBackward = this.start.x - this.end.x == -2

      if (isBackward && !isKing) {
        return false
      }

      return this.start.x - this.end.x == 2 &&
      Math.abs(this.start.y - this.end.y) == 2
    })()

    // shortcut out
    if (!isValidPosition) {
      return false
    }

    const isValidPieces = (() => {
      const isValidJump = Number.isInteger(this.jump.x) && Number.isInteger(this.jump.y)

      if (!isValidJump) {
        return false
      }

      const startPiece = this.start.pieceFromRawBoard(board.asMeAndOther())
      const endPiece = this.end.pieceFromRawBoard(board.asMeAndOther())
      const jumpPiece = this.jump.pieceFromRawBoard(baord.asMeAndOther())
      
      return (startPiece == MeAndOtherEnum.Me ||
      startPiece == MeAndOtherEnum.MeKing) &&
      endPiece == MeAndOtherEnum.None &&
      jumpPiece == MeAndOtherEnum.Other
    })()

    return isValidPieces && isValidPosition
  }
}