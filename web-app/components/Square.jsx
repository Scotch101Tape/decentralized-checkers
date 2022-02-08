import React from "react"
import Image from "next/image"

// Square (color, piece, highlighted, dotted)
const Square = React.forwardRef((props, ref) => {
  const divStyle = {
    display: "flex",
    justifyContent: "center",
    background: props.highlighted ? "var(--highlighted-square)" : `var(--${props.color}-square)`
  }

  const dotStyle = {
    width: "10px",
    height: "10px",
    background: "red",
    borderRadius: "50%"
  }

  let pieceSrc = ""
  switch(props.piece) {
    case 1:
      pieceSrc = "/black-piece.svg"
    case 2:
      pieceSrc = "/white-piece.svg"
    case 3: 
      pieceSrc = "/black-king.svg"
    case 4:
      pieceSrc = "/white-king.svg"
  }

  console.assert(!(props.piece != 0 && props.dotted))

  return <div style = {divStyle} ref = {ref}>
    {props.piece != 0 && pieceSrc != "" && <Image src = {pieceSrc} width = {30} height = {30}/>}
    {props.dotted && <div style = {dotStyle}/>}
  </div>
})

export default Square