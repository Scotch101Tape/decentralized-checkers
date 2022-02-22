import {assert, expect, use} from 'chai';
import {Contract} from 'ethers';
import {deployContract, MockProvider, solidity} from 'ethereum-waffle';
import DecentralizedCheckers from "../../build/DecentralizedCheckers.json";
import {Player} from "../../contracts/checkers.constants.mjs"

use(solidity);

describe("decentralized-checkers", () => {
  const provider = new MockProvider();
  const [deployer, player1, player2] = provider.getWallets();

  let decentralizedCheckers;

  beforeEach(async () => {
    decentralizedCheckers = await deployContract(deployer, DecentralizedCheckers, []);
  });

  it("Emits OnGameStart", async () => {
    let player1Contract = await decentralizedCheckers.connect(player1);
    let player2Contract = await decentralizedCheckers.connect(player2);
    await player1Contract.joinGame()
    expect(await player2Contract.joinGame()).to.emit(decentralizedCheckers, "OnGameStart")
  });

  it("Allows cancelation", async () => {
    let player1Contract = await decentralizedCheckers.connect(player1);
    await player1Contract.joinGame();
    await player1Contract.cancelJoinGame();
  })
})