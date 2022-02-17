import React from "react"
import Image from "next/image"
import { PieceEnum } from "../lib/contract-api"

// Square (color, piece, highlighted, dotted)
const Square = React.forwardRef((props, ref) => {
  const divStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: props.highlighted ? "var(--highlighted-square)" : `var(--${props.color}-square)`
  }

  const dotStyle = {
    width: "20px",
    height: "20px",
    background: "DimGray",
    opacity: "0.75",
    borderRadius: "50%"
  }

  let pieceSrc = ""
  switch(props.piece) {
    case PieceEnum.Black:
      pieceSrc = "/black-piece.svg"
      break
    case PieceEnum.White:
      pieceSrc = "/white-piece.svg"
      break
    case PieceEnum.BlackKing: 
      pieceSrc = "/black-king.svg"
      break
    case PieceEnum.WhiteKing:
      pieceSrc = "/white-king.svg"
      break
  }

  console.assert(!(props.piece != 0 && props.dotted))

  return <div style = {divStyle} ref = {ref}>
    {props.piece != PieceEnum.None && pieceSrc != "" && <Image src = {pieceSrc} width = {40} height = {40}/>}
    {props.dotted && <div style = {dotStyle}/>}
  </div>
})

export default Square