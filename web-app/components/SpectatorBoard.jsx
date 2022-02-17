import React from "react"
import Board from "./board"
import Square from "./Square"

// SpectatorBoard(board)
export default class SpectatorBoard extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (<Board>
      {this.props.board.map((l, x) => 
        l.map((value, y) => 
          <Square 
            color = {(x + y) % 2 == 0 ? "black" : "white"} 
            piece = {value} 
            key={x * 8 + y}
          />
        )
      )}
    </Board>)
  }
}