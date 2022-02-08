import React from "react"
import Board from "./board.jsx"
import Move from "../lib/move.js"

// PlayerBoard(board, team, onValidMove)
export default class PlayerBoard extends React.Component {
  constructor(props) {
    super(props)

    this._board = this.props.team == "white" 
    ? this.props.board.map((l, x) => l.map((_, y) => this.props.board[y][7 - x])) 
    : this.props.board.map((l, x) => l.map((_, y) => this.props.board[7 - y][x]))

    this.state = {
      move: new Move()
    }
  }

  render() {
    // This transforms the given board so the oppenent is up and the player is down,
    // this makes game logic simpler and shows the player the board from thier perspective
    const board = this._board

    const onClick = this._onClick.bind(this)

    return <Board onClick = {onClick} board = {board} altColors = {true}/>
  }

  _onClick(x, y) {
    console.log(x, y)
    // Yo do the vaild move function or somehing
  }

  _moveIsValid() {
    // Checks whether the current move is valid
  }
}