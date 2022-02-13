import { Game, GameState } from "./game-state"
import { CheckersEnv, PlayerEnum, PieceEnum } from "./contract-api"
import { JumpMove, Move } from "./move"

// The states the game can be in
export const ClientCheckersState = new GameState({
  Uninit = {
  },
  Won = {
  },
  OnGoing = {
    MyTurn = {
      ChoosingMove = {
      },
      BroadcastingMove = {
      }
    },
    OtherTurn = {
    }
  }
})

// Mutable!!
// Also, this is a test to see if this type of paradigm for programming games is useful
export class ClientCheckersGame extends Game {
  constructor(checkersEnv) {
    super(ClientCheckersState.Uninit)

    this.checkersEnv = checkersEnv
  }

  getBoard() {
    return this.status.board
  }

  getWinner() {
    // State asserations
    console.assert(
      this.isInState(ClientCheckersState.Won)
    )

    return this.status.winner
  }

  getOtherDrawProposing() {
    // State asserations
    console.assert(
      this.isInState(ClientCheckersState.Won)
    )

    return this.status.otherDrawProposing
  }

  getMeDrawProposing() {
    // State asserations
    console.assert(
      this.isInState(ClientCheckersState.Won)
    )

    return this.status.meDrawProposing
  }

  async init() {
    this.status = await checkersEnv.getStatus();

    // Set state
    if (this.status.won) {
      super(ClientCheckersState.Won)
    } else {
      if (this.status.turn == PlayerEnum.Me) {
        super(ClientCheckersState.OnGoing.MyTurn.ChoosingMove)
      } else {
        super(ClientCheckersState.OnGoing.OtherTurn)
      }
    }

    this.checkersEnv.onMove(this.handleMove.bind(this))
    this.checkersEnv.onDrawCancel(this.handleDrawCancel.bind(this))
    this.checkersEnv.onDrawProposal(this.handleDrawProposal.bind(this))
    this.checkersEnv.onWinner(this.handleWinner.bind(this))
  }

  async doMove(move) {
    // State asserations
    console.assert(
      this.isInState(ClientCheckersState.OnGoing.MyTurn.ChoosingMove) &&
      move.isValidFromBoard(this.getBoard())
    )

    let movePromise = this.checkersEnv.doMove(move)

    this.setState(ClientCheckersState.OnGoing.MyTurn.BroadcastingMove)

    await movePromise

    // Make the move ourselves. It will eventually come to us in an event, but this is less latent (?)
    this.setState(ClientCheckersState.OnGoing.OtherTurn)

    this.handleMove(move)
  }

  async proposeDraw() {
    // State asserations
    console.assert(
      this.isInState(ClientCheckersState.OnGoing)
    )

    await this.checkersEnv.proposeDraw()
  }

  async cancelDraw() {
    // State asserations
    console.assert(
      this.isInState(ClientCheckersState.OnGoing)
    )

    this.checkersEnv.cancelDraw()
  }

  async resign() {
    // State asserations
    console.assert(
      this.isInState(ClientCheckersState.OnGoing)
    )

    this.checkersEnv.resign()
  }

  handleMove(player, move) {
    // Check whether the move has already happened,
    // if it happened, do nothing, the move has been handled.
    const board = player == PlayerEnum.Me
    ? this.getBoard()
    : this.getBoard().fromOpposite()

    if (move.isValidFromBoard(board)) {
      this.getBoard().doMove(move)
    }

    if (player == PlayerEnum.Me && move instanceof JumpMove) {
      this.status.otherPieces -= 1
      if (this.status.otherPieces == 0) {
        // TODO: use right enum if tie
        this.handleWinner(PlayerEnum.Me)
      }
    } else if (player == PlayerEnum.Other && move instanceof JumpMove) {
      this.status.mePieces -= 1
      if (this.status.mePieces == 0) {
        // TODO: use right enum if tie
        this.handleWinner(PlayerEnum.Other)
      }
    }
  }

  handleDrawProposal(player) {
    if (player == PlayerEnum.Me) {
      this.status.meDrawProposing = true
    } else if (player == PlayerEnum.Other) {
      this.status.otherDrawProposing = true
    }
  }

  handleDrawCancel(player) {
    if (player == PlayerEnum.Me) {
      this.status.meDrawProposing = false
    } else if (player == PlayerEnum.Other) {
      this.status.otherDrawProposing = false
    }
  }

  handleWinner(player) {
    // TODO, use right enum if tie
    this.status.winner = player

    this.setState(ClientCheckersState.Won)
  } 
}

