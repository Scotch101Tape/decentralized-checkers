import { SimpleMove, JumpMove } from "./move"
import { PieceEnum } from "./contract-api"

// Re-export of PieceEnum
export const PieceEnum = PieceEnum

export const BoardTypeEnum = {
  White: 0,
  Black: 1,
  Spectator: 2
}

export const MeAndOtherEnum = {
  Me: 0,
  MeKing: 1,
  Other: 2,
  None: 3
}

export class Board {
  constructor(rawBoard, boardType) {
    this._rawBoard = rawBoard

    this.rawBoard = boardType == BoardTypeEnum.White
    ? rawBoard.map((l, x) => l.map((_, y) => this.props.board[y][7 - x]))
    : rawBoard.map((l, x) => l.map((_, y) => this.props.board[7 - y][x]))

    this.boardType = boardType
  }

  asRaw() {
    return this.rawBoard
  }

  asMeAndOther() {
    console.assert(
      this.boardType != BoardTypeEnum.Spectator
    )

    const mePiece = this.boardType.White
    ? PieceEnum.White
    : PieceEnum.Black
    const meKingPiece = this.boardType.White
    ? PieceEnum.WhiteKing
    : PieceEnum.BlackKing

    return this.rawBoard.map((l) => l.map((piece) => {
      switch (piece) {
        case mePiece:
          return MeAndOtherEnum.Me
        case meKingPiece:
          return MeAndOtherEnum.MeKing
        case PieceEnum.None:
          return MeAndOtherEnum.None
        default:
          return MeAndOtherEnum.Other
      }
    }))
  }

  fromOpposite() {
    console.assert(
      this.boardType != BoardTypeEnum.Spectator
    )

    return new Board(this._rawBoard, this.boardType == BoardTypeEnum.White ? BoardTypeEnum.Black : BoardTypeEnum.White)
  }

  doMove(move) {
    const startPiece = move.start.pieceFromRawBoard(this.asRaw())

    if (move instanceof SimpleMove) {
      this.rawBoard[move.start.x][move.start.y] = PieceEnum.None
      this.rawBoard[move.end.x][move.end.y] = startPiece
    } else if (move instanceof JumpMove) {
      this.rawBoard[move.start.x][move.start.y] = PieceEnum.None
      this.rawBoard[move.jump.x][move.jump.y] = PieceEnum.None
      this.rawBoard[move.end.x][move.end.y] = startPiece
    }
  }
}