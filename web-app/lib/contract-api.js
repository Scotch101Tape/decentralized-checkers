import { ethers } from "ethers";
import { Board } from "./board"

const DECENTRALIZED_CHECKERS_ADDRESS = "0x874C1c696F62F71Aa76D2e4812776c0771956017"

export const PlayerEnum = {
  Me: 1,
  Other: 2,
}

export const PieceEnum = {
  None: 0,
  Black: 1,
  White: 2,
  BlackKing: 3,
  WhiteKing: 4
}

export class DecentralizedCheckersEnv {
  constructor(signer) {
    this.signer = signer
  }

  async joinGame() {

  }
}

export class CheckersEnv {
  constructor(signer, contract) {

  }

  async getStatus() {

  }

  async takeTurn(move) {

  }

  async proposeDraw() {

  }

  async cancelDraw() {

  }

  async resign() {

  }
}
