import {assert, expect, use} from 'chai';
import {Contract} from 'ethers';
import {deployContract, MockProvider, solidity} from 'ethereum-waffle';
import DecentralizedCheckers from "../../build/DecentralizedCheckers.json";

use(solidity);

describe("decentralized-checkers", () => {
  const provider = new MockProvider();
  const [deployer, player1, player2] = provider.getWallets();

  let decentralizedCheckers;

  beforeEach(async () => {
    decentralizedCheckers = await deployContract(deployer, DecentralizedCheckers, []);
  });

  /*it("Create a game", async () => {
    let player1Contract = await decentralizedCheckers.connect(player1);
    let player2Contract = await decentralizedCheckers.connect(player2);
    await player1Contract.joinPublicGame();
    expect(await player2Contract.joinPublicGame()).to.emit(decentralizedCheckers, "gameStarted")
  });*/
})