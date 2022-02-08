import { useRouter } from "next/router"
import React from "react"


/*
class TurnBox extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const message = this.props.team == "black" ?
    "Black's Turn" :
    "White's Turn"

    const style = {
      "font-family": "Arial",
      "font-size": "25px",
      "color": "white",
      "background": "black",
      "padding": "10px",
      "border-style": "solid",
      "border-radius": "5px",
    }

    return <div style={style}>
      {message}
    </div>
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      board: [
        [0, 2, 0, 0, 0, 1, 0, 1],
        [2, 0, 1, 0, 0, 0, 1, 0],
        [0, 2, 0, 0, 0, 0, 0, 1],
        [3, 0, 2, 0, 0, 0, 2, 0],
        [0, 0, 0, 2, 0, 1, 0, 1],
        [2, 0, 0, 0, 0, 0, 1, 0],
        [0, 2, 0, 0, 0, 0, 0, 1],
        [2, 0, 2, 0, 0, 0, 1, 0]
      ]
    }
  }

  render() {
    const gridStyle = {
      "position": "absolute",
      "top": "0px",
      "right": "0px",
      "bottom": "0px",
      "left": "0px",
      "display": "grid",
      "grid-template-columns": "calc(50% - 206px) 412px",
      "grid-template-rows": "calc(50% - 206px) 412px"
    }

    const boardStyle = {
      "grid-column": "2 / span 1",
      "grid-row": "2 / span 1"
    }

    const turnStyle = {
      "grid-column": "3 / span 1",
      "grid-row": "2 / span 1",
      "display": "flex",
      "align-items": "center",
      "padding": "10px"
    }

    return <div style={gridStyle}>
      <div style={boardStyle}>
        <Board board={this.state.board} team={this.props.team}/>
      </div>

      <div style={turnStyle}>
        <TurnBox team={this.props.team}/>
      </div>
    </div>
  }
}

*/

function Checkers() {
  const router = useRouter()
  const { address } = router.query

  return <Game address={address} team="white"/>
}

export default Checkers