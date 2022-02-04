import { useRouter } from "next/router"
import React from "react"
import Image from "next/image"

class Square extends React.Component {
  constructor(props) {
    super(props)
  }

  getPieceImage() {
    switch(this.props.piece) {
      case 1:
        return "/black-piece.svg"
      case 2:
        return "/white-piece.svg"
      case 3: 
        return "/black-king.svg"
      case 4:
        return "/white-king.svg"
    } 
  }

  render() {
    const style = {
      "display": "flex",
      "justify-content": "center",
      "background": `var(--${this.props.color}-square)`
    }

    const src = this.getPieceImage()

    return (<div style={style}>
      {this.props.piece == 0 || src == "" || <Image src={src} width={30} height={30}/>}
    </div>);
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props)  
  }
  
  render() {
    const style = {
      "display": "grid",
      "grid-template-columns": "repeat(8, 50px)",
      "grid-template-rows": "repeat(8, 50px)",
      "border-style": "solid",
      "border-width": "4px",
      "width": "401px",
      "height": "401px",
      "border-radius": "5px",
      "padding": "2px",
      "background": "black",
      "border-color": "black"
    }

    return <div className = "grid" style={style}>
      {this.props.board.map((l, x) => 
        l.map((value, y) => <Square color = {(x + y) % 2 == 0 ? "black" : "white"} piece = {value} key={x * 8 + y}/>)
      )}
    </div>
    
  }
}

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

function Checkers() {
  const router = useRouter()
  const { address } = router.query

  return <Game address={address} team="white"/>
}

export default Checkers