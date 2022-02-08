import { assert } from "chai"
import React from "react"
import Square from "./square.jsx"

// Board(board, onClick, altColors)
export default class Board extends React.Component {
  constructor(props) {
    super(props)  
  }
  
  render() {
    const style = {
      display: "grid",
      gridTemplateColumns: "repeat(8, 50px)",
      gridTemplateRows: "repeat(8, 50px)",
      borderStyle: "solid",
      borderWidth: "4px",
      width: "401px",
      height: "401px",
      borderRadius: "5px",
      padding: "2px",
      background: "black",
      borderColor: "black"
    }

    const onClick = this.props.onClick !== undefined ? this._onClick.bind(this) : undefined

    return <div className = "grid" style={style}>
      {this.props.board.map((l, x) => 
        l.map((value, y) => <Square color = {(x + y + (this.props.altColors ? 1 : 0)) % 2 == 0 ? "black" : "white"} piece = {value} key={x * 8 + y} onClick = {onClick} x = {x} y = {y}/>)
      )}
    </div>
    
  }

  _onClick(x, y) {
    this.props.onClick(x, y)
  }
}