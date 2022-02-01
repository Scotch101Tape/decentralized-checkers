class Move {
  constructor() {
    this.x1 = null;
    this.y1 = null;
    this.x2 = null;
    this.y2 = null;
  }

  setStart(x, y) {
    this.x1 = x;
    this.y1 = y;
  }

  setEnd(x, y) {
    this.x2 = x;
    this.y2 = y;
  }

  isComplete() {
    return this.x1 !== null && this.y1 !== null && this.x2 !== null && this.y2 !== null;
  }
}

export class CheckersGame {
  constructor(contract, player, turn) {
    this.contract = contract;
    this.player = player;
    this.board = this.contract.getBoard();
    this.turn = turn;

    document.getElementById("play-game-section").innerHTML = "<button id='submit-move-button'>Submit move</button><p id='turn-html'></p>";
  }

  play() {
    let move = Move()

    this.updateTurnHtml();

    document.getElementById("submit-move-button").onclick = async () => {
      if (this.turn) {
        await this.contract.takeTurn()
      }
    };

    this.contract.on("newTurn", async (player) => {
      this.board = this.contract.getBoard();
      if (this.player == player) {

      }
    }) 

    window.preload = async function() {
      checkerBoardImage = loadImage("assets/checker-board.png")
    }

    window.setup = async function() {
      createCanvas(400, 400);
    }

    window.draw = async function() {
      fill(255, 255, 0);
      ellipse(10, 10, 10, 10);
    }

    window.mouseClicked = async function() {

    }
  }

  updateTurnHtml() {
    document.getElementById("turn-html").innerHTML = this.turn ? "Your turn" : "Opponents turn";
  }
}