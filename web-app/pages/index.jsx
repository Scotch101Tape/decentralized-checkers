import {} from "../lib/contract-api.js"
import Square from "../components/Square"

function HomePage() {
  return (
    <div>
      <div className="centered">Hello, and welcome to decentralized checkers.</div>
      <a href="/checkers/0x0">Click Me</a>
      <Square color = "black"  piece = {0}  highlighted = {false} dotted = {true}/>
    </div>
  );
}

export default HomePage