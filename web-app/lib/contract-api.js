import { ethers } from "ethers";

const DECENTRALIZED_CHECKERS_ADDRESS = "0x874C1c696F62F71Aa76D2e4812776c0771956017"

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
