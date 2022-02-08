import React from "react"
import Image from "next/image"

// Square(color, piece, onClick, x, y)
export default class Square extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const style = {
      display: "flex",
      justifyContent: "center",
      background: `var(--${this.props.color}-square)`
    }

    const onClick = this.props.onClick !== undefined ? this._onClick.bind(this) : undefined
    const src = this.getPieceImage();

    return (<div style={style} onClick = {onClick}>
      {this.props.piece != 0 && src != "" && <Image src={src} width={30} height={30}/>}
    </div>);
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
  
  _onClick() {
    this.props.onClick(this.props.x, this.props.y)
  }
}