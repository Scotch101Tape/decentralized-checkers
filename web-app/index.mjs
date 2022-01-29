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
  const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  const account = accounts[0];
  let wallet = new Wallet(account, provider);
  let walletAddress = await wallet.address;

  // Connect to the contract
  decentralizedCheckersContract = new Contract(DECENTRALIZED_CHECKERS_ADDRESS, DecentralizedCheckersAbi, wallet);

  // Listen to events
  decentralizedCheckersContract.on("gameStarted", async (game, player1, player2) => {
    if (player1 == signerAddress || player2 == signerAddress) {
      decentralizedCheckersContract.removeAllListeners();

      let checkersContract = new Contract(game, CheckersAbi, signer);
      document.getElementById("join-game-section").remove()

      (new CheckersGame).play();
    }
  });
}

document.getElementById("join-public-game-button").onclick = async () => {
  await decentralizedCheckersContract.joinPublicGame({
    gasLimit: 99999
  });
}
