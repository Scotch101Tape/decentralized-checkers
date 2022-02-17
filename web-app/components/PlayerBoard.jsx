import React from "react"
import Board from "./board.jsx"
import Move from "../lib/move.js"
import Square from "./Square"
import { PieceEnum } from "../lib/contract-api.js"

// PlayerBoard(board, team, onValidMove)
export default class PlayerBoard extends React.Component {
  constructor(props) {
    super(props)

    // Rotate board
    // Open spaces are 0
    // opponents are -1
    this.board = this.props.team == "white" 
    ? this.props.board.map((l, x) => l.map((_, y) => this.props.board[y][7 - x])) 
    : this.props.board.map((l, x) => l.map((_, y) => this.props.board[7 - y][x]))

    this.handleSquareClick = this.handleSquareClick.bind(this)

    this.refs = []

    this.state = {
      move: new Move(),
      validMoves: [this.hashPosition(1, 2)],
    }
  }

  pieceInTeam(piece) {
    if (this.props.team == "black") {
      return piece == PieceEnum.Black || piece == PieceEnum.BlackKing
    } else {
      return piece == PieceEnum.White || piece == PieceEnum.WhiteKing
    }
  }

  handleSquareClick(x, y) {
    if (!this.state.move.hasStart()) {
      const piece = this.board[x][y]
      if (this.pieceInTeam(piece)) {
        this.setState({
          move: this.state.move.setStart(x, y)
        })

        this.updateValidMoves()
      }
    } else {

    }
  }

  boardPpc(x, y) {
  
  }

  updateValidMoves() {
    const checks = [[1, 1], [1, -1] [-1, 1], [-1, -1]]
  
    for (let i = 0; i < checks.length; i++) {
      if (i >= 2 && )
    }
  }

  moveIsValid() {
    // Checks whether the current move is valid
    
  }

  hashPosition(x, y) {
    return x * 8 + y
  }

  componentDidMount() {
    for (let i  = 0; i < this.refs.length; i++) {
      const ref = this.refs[i]
      ref.current.onclick = () => {
        this.handleSquareClick(Math.floor(i / 8), i % 8)
      }
    }
  }

  render() {
    // This transforms the given board so the oppenent is up and the player is down,
    // this makes game logic simpler and shows the player the board from thier perspective
    this.refs = []


    return (<Board>
      {this.board.map((l, x) => 
        l.map((value, y) => {
          const ref = React.createRef()
          this.refs.push(ref)

          return <Square 
            ref = {ref}
            color = {(x + y) % 2 == 0 ? "white" : "black"} 
            piece = {value} 
            dotted = {this.state.validMoves.includes(this.hashPosition(x, y))}
            highlighted = {this.state.move.x1 == x && this.state.move.y1 == y}
            key={this.hashPosition(x, y)}
          />
        })
      )}
    </Board>)
  }
}