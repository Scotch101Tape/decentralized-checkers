import {} from "../lib/contract-api.js"
import Square from "../components/Square"
import SpectatorBoard from "../components/SpectatorBoard.jsx";
import PlayerBoard from "../components/PlayerBoard"

function HomePage() {
  const board = [
    [0, 2, 0, 0, 0, 1, 0, 1],
    [2, 0, 1, 0, 0, 0, 1, 0],
    [0, 2, 0, 0, 0, 0, 0, 1],
    [3, 0, 2, 0, 0, 0, 2, 0],
    [0, 0, 0, 2, 0, 1, 0, 1],
    [2, 0, 0, 0, 0, 0, 1, 0],
    [0, 2, 0, 0, 0, 0, 0, 1],
    [2, 0, 2, 0, 0, 0, 1, 0]
  ]

  return (
    <div>
      <div className="centered">Hello, and welcome to decentralized checkers.</div>
      <a href="/checkers/0x0">Click Me</a>
      <Square color = "black"  piece = {0}  highlighted = {false} dotted = {true}/>
      <SpectatorBoard board={board}/>
      <PlayerBoard board={board} team="white"/>
    </div>
  );
}

export default HomePage