export const DecentralizedCheckersAbi = [
  "event gameStarted(address game, address player1, address player2)",

  "constructor()",

  "function joinPublicGame()"
]

export const CheckersAbi = [
  "event newTurn(address player)",
  "event gameWon(address winner)",
  "event drawProposal(address from)",
  "event drawCanceled(address from)",

  "constructor(address _player1, address _player2)",

  "function takeTurn(uint x1, uint y1, uint x2, uint y2)",
  "function resign()",
  "function getWinner() view returns (address winner)",
  "function proposeDraw()",
  "function cancelDraw()",
  "function getBoard() view returns(uint[8][8] board)",
  "function isLocked() view return(bool locked)",
]