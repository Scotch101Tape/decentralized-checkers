import {expect, use} from 'chai';
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

  it("Create game", async () => {
    expect(await decentralizedCheckers.joinPublicGame(player1).joinPublicGame(player2))
      .to.emit(decentralizedCheckers, "gameStarted");
  });
})