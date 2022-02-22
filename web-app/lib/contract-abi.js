export const DECENTRALIZED_CHECKERS_ABI = [
  "event OnMove(((uint x, uint y) start, (uint x, uint y) end))",
  "event OnWinner(uint)",
  "event OnDrawProposal(uint)",
  "event OnDrawCancel(uint)",

  "constructor(address, address)",
  "doMove(((uint x, uint y) start, (uint x, uint y) end)) public",
  "resign() public",
  "proposeDraw() public",
  "cancelDraw() public",
  "getStatus() public view returns ((bool won, uint winner, uint turnPlayer, uint[8][8] board, bool whiteDraw, bool blackDraw, uint whiteScore, uint blackScore))"
]

export const CHECKERS_ABI = {
  
}