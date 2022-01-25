import {DECENTRALIZED_CHECKERS_ADDRESS} from "./config.mjs";
import {ethers} from "./libraries/ethers.mjs";

const providerURL = "https://rpc.api.moonbase.moonbeam.network";
let provider, signer;

window.onload = () => {
    console.log("noob")

    provider = new ethers.providers.StaticJsonRpcProvider(providerURL, {
        chainId: 1287,
        name: "moonbase-alphanet"
    });
    signer = provider.getSigner();

    console.log("noob2")
}

document.getElementById("join-public-game-button").onclick = () => {
    
}