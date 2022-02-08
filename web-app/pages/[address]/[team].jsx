import React from "react"
import PlayerBoard from "../../components/PlayerBoard.jsx"
import SpectatorBoard from "../../components/SpectatorBoard.jsx"

function player() {
  const board = [
    [0, 2, 0, 0, 0, 1, 0, 1],
    [2, 0, 1, 0, 0, 0, 1, 0],
    [0, 2, 0, 0, 0, 0, 0, 1],
    [3, 0, 2, 0, 0, 0, 2, 0],
    [0, 0, 0, 2, 0, 1, 0, 1],
    [2, 0, 0, 0, 0, 0, 1, 0],
    [0, 2, 0, 0, 0, 0, 0, 1],
    [2, 0, 2, 0, 0, 0, 1, 0]
  ]

  const onValidMove = () => {
    console.log("HI")
  }

  return <div>
    <PlayerBoard board = {board} onValidMove = {onValidMove} team="white"/>
    <SpectatorBoard board = {board}/>
    <PlayerBoard board = {board} onValidMove = {onValidMove} team="black"/>
  </div>
}

export default player