import {DECENTRALIZED_CHECKERS_ADDRESS} from "./config.mjs";
import {CheckersAbi, DecentralizedCheckersAbi} from "./modules/abi.mjs";
import {Contract, ethers, Wallet} from "./libraries/ethers.mjs";
import {CheckersGame} from "./modules/checkers-game.mjs"

const providerURL = "https://rpc.api.moonbase.moonbeam.network";
let provider, signer, decentralizedCheckersContract;

window.onload = async () => {
  // Connect Metamask
  provider = new ethers.providers.StaticJsonRpcProvider(providerURL, {
    chainId: 1287,
    name: "moonbase-alphanet"
  });  
  signer = (new ethers.providers.Web3Provider(window.ethereum)).getSigner()
  let signerAddress = await signer.getAddress();

  // Connect to the contract
  decentralizedCheckersContract = new Contract(DECENTRALIZED_CHECKERS_ADDRESS, DecentralizedCheckersAbi, signer);

  // Listen to events
  decentralizedCheckersContract.on("gameStarted", async (game, player1, player2) => {
    if (player1 == signerAddress || player2 == signerAddress) {
      decentralizedCheckersContract.removeAllListeners();

      let checkersContract = new Contract(game, CheckersAbi, signer);
      document.getElementById("join-game-section").remove();

      (new CheckersGame(checkersContract, signerAddress, player1 == signerAddress)).play();
    }
  });
}

document.getElementById("join-public-game-button").onclick = async () => {
  await decentralizedCheckersContract.joinPublicGame();
}

/* Tests */
let checkerBoardImage
window.preload = function() {
  checkerBoardImage = loadImage("assets/checker-board.png")
}

window.setup = function() {
  createCanvas(400, 400);
  image(checkerBoardImage, 0, 0, 400, 400);
}

window.mouseClicked = function() {
  rect(mouseX - (mouseX % 50), mouseY - (mouseY % 50), 50, 50)
}



