import React from "react"
import Board from "./board.jsx"

// SpectatorBoard(board)
export default class SpectatorBoard extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <Board board={this.props.board} altColors = {false}/>
  }
}