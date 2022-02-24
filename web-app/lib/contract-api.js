import { ethers, Contract } from "ethers";
import { DECENTRALIZED_CHECKERS_ABI, CHECKERS_ABI } from "./contract-abi";
import { Board } from "./board"
import { Player, Piece, Winner } from "../../contracts/checkers.constants"

const DECENTRALIZED_CHECKERS_ADDRESS = "0xBB36D3A71e086F8910eDBaEf31C0F530429437D6"

// Re-exporting the enums
export const Player = Player
export const Piece = Piece
export const Winner = Winner
export const MeAndOther = {
  Me: 0,
  Other: 1
}

export function CreateDecentralizedCheckersEnv() {
  const provider = new ethers.providers.StaticJsonRpcProvider(providerURL, {
    chainId: 1287,
    name: "moonbase-alphanet"
  });  

  const signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()

  return new DecentralizedCheckersEnv(signer)
}

export class DecentralizedCheckersEnv {
  constructor(signer) {
    this.signer = signer
    this.contract = new Contract(DECENTRALIZED_CHECKERS_ADDRESS, DECENTRALIZED_CHECKERS_ABI, signer)
  }

  async joinGame() {
    let gamePromise = new Promise((resolve, reject) => {
      this.contract.once("OnGameStart", (game, whitePlayer, blackPlayer) => {
        if (this.signer.address == whitePlayer || this.signer.address == blackPlayer) {
          resolve({
            game: game,
            player: this.signer.address == whitePlayer ? Player.White : Player.Black
          })
        }
      })
    })

    await this.contract.joinGame()
    let resolution = await gamePromise()

    let checkersContract = new Contract(resolution.game, CHECKERS_ABI, this.signer)

    return new CheckersEnv(this.signer, checkersContract, resolution.player)
  }
}

export class CheckersEnv {
  constructor(signer, contract, player) {
    this.signer = signer
    this.player = player
    this.contract = contract
  }

  async getStatus() {
    // The most important function in this class
    // What is returned here defines THE interface for information in this class


  }

  async doMove(move) {
    await this.contract.doMove(move)
  }

  async proposeDraw() {
    await this.contract.proposeDraw()
  }

  async cancelDraw() {
    await this.contract.cancelDraw()
  }

  async resign() {
    await this.contract.resign()
  }

  onWon(f) {
    this.contract.on("Won", f)
  }

  onMove(f) {
    // TODO
    this.contract.on("Move", (player) => {
      f()
    })
  }

  onDrawProposal(f) {
    this.contract.on("DrawProposal", f)
  }

  onDrawCancel(f) {
    this.contract.on("DrawCancel", f)
  }
}
