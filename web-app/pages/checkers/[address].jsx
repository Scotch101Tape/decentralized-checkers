import { useRouter } from "next/router"
import React from "react"
import Image from "next/image"

class Square extends React.Component {
  constructor(props) {
    super(props)
  }

  getPieceImage() {
    return "" // TODO: add in piece image
  }

  render() {
    const style = {
      "background": this.props.color,
      "display": "flex",
      "justify-content": "center"
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
    const style = {
      "display": "grid",
      "grid-template-columns": "50px 50px 50px 50px 50px 50px 50px 50px",
      "grid-template-rows": "50px 50px 50px 50px 50px 50px 50px 50px",
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
      {this.state.board.map((l, x) => 
        l.map((value, y) => <Square color = {(x + y) % 2 == 0 ? "black" : "white"} piece = {value} key={x * 8 + y}/>)
      )}
    </div>
    
  }
}

function Checkers() {
  const router = useRouter()
  const { address } = router.query

  return <Board address={address} team="black"/>
}

export default Checkers