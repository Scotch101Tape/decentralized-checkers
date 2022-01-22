import {expect, use} from 'chai';
import {deployContract, MockProvider, solidity} from 'ethereum-waffle';
import {BigNumber} from "ethers"
import Checkers from "../../build/Checkers.json";

use(solidity);

describe("checkers", () => {
  const provider = new MockProvider();
  const [deployer, player1, player2] = provider.getWallets();

  let checkers;

  beforeEach(async () => {
    checkers = await deployContract(deployer, Checkers, [player1.address, player2.address]);
  });

  it("Creates the board correctly", async () => {
    expect(await checkers.getBoard()).to.eql(
      [
        [0, 2, 0, 0, 0, 1, 0, 1],
        [2, 0, 2, 0, 0, 0, 1, 0],
        [0, 2, 0, 0, 0, 1, 0, 1],
        [2, 0, 2, 0, 0, 0, 1, 0],
        [0, 2, 0, 0, 0, 1, 0, 1],
        [2, 0, 2, 0, 0, 0, 1, 0],
        [0, 2, 0, 0, 0, 1, 0, 1],
        [2, 0, 2, 0, 0, 0, 1, 0]
      ]
    );
  });

  it("Allows resignation", async () => {
    expect(await checkers.getWinner()).to.equal("0x0000000000000000000000000000000000000000");
    await checkers.connect(player1).resign();
    expect(await checkers.getWinner()).to.equal(player2.address);
  });

  it("Allows draw", async () => {
    await checkers.connect(player1).proposeDraw();
    expect(await checkers.isLocked()).to.equal(false);
    await checkers.connect(player2).proposeDraw();
    expect(await checkers.isLocked()).to.equal(true);
  });

  it("Allows take back of draw", async () => {
    await checkers.connect(player1).proposeDraw();
    await checkers.connect(player1).cancelDraw();
    await checkers.connect(player2).proposeDraw();
    expect(await checkers.isLocked()).to.equal(false);
  });

  it("Emits newTurn", async () => {
    expect(await checkers.connect(player1).takeTurn(1, 2, 0, 3, {gasLimit: 999999})).to.emit(checkers, "newTurn");
  });

  it("Emits drawProposal", async () => {
    expect(await checkers.connect(player2).proposeDraw()).to.emit(checkers, "drawProposal");
  });

  it("Emits drawCanceled", async () => {
    await checkers.connect(player1).proposeDraw()
    expect(await checkers.connect(player1).cancelDraw()).to.emit(checkers, "drawCanceled");
  });

  it("Runs a few moves", async () => {
    let p1 = checkers.connect(player1);
    let p2 = checkers.connect(player2);

    let p1Turn = async (x1, y1, x2, y2) => {
      await p1.takeTurn(x1, y1, x2, y2, {
        gasLimit: 999999
      });
    }

    let p2Turn = async (x1, y1, x2, y2) => {
      await p2.takeTurn(x1, y1, x2, y2, {
        gasLimit: 999999
      });
    }

    await p1Turn(1, 2, 0, 3);
    await p2Turn(2, 5, 3, 4);
    await p1Turn(3, 2, 2, 3);
    await p2Turn(3, 4, 1, 2);
    expect(await checkers.getBoard()).to.eql([
      [0, 2, 0, 2, 0, 1, 0, 1],
      [2, 0, 1, 0, 0, 0, 1, 0],
      [0, 2, 0, 0, 0, 0, 0, 1],
      [2, 0, 0, 0, 0, 0, 1, 0],
      [0, 2, 0, 0, 0, 1, 0, 1],
      [2, 0, 2, 0, 0, 0, 1, 0],
      [0, 2, 0, 0, 0, 1, 0, 1],
      [2, 0, 2, 0, 0, 0, 1, 0]
    ]);
    await p1Turn(0, 3, 1, 4);
    await p2Turn(6, 5, 5, 4);
    await p1Turn(4, 1, 3, 2);
    await p2Turn(5, 4, 6, 3);
    await p1Turn(3, 0, 4, 1);
    await p2Turn(3, 6, 2, 5);
    await p1Turn(5, 2, 4, 3);
    await p2Turn(6, 3, 5, 2);
    await p1Turn(1, 4, 3, 6);
    await p2Turn(5, 2, 3, 0);
    expect(await checkers.getBoard()).to.eql([
      [0, 2, 0, 0, 0, 1, 0, 1],
      [2, 0, 1, 0, 0, 0, 1, 0],
      [0, 2, 0, 0, 0, 0, 0, 1],
      [3, 0, 2, 0, 0, 0, 2, 0],
      [0, 0, 0, 2, 0, 1, 0, 1],
      [2, 0, 0, 0, 0, 0, 1, 0],
      [0, 2, 0, 0, 0, 0, 0, 1],
      [2, 0, 2, 0, 0, 0, 1, 0]
    ]);
  })
});