// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

enum Piece {
  None,
  Black,
  White,
  BlackKing,
  WhiteKing
}

contract Checkers {
  // Events
  event newTurn(address player);
  event gameWon(address winner);
  event drawProposal(address from);
  event drawCanceled(address from);

  // Storage
  address player1;
  address player2;

  bool locked;
  address winner;

  address currentTurn;

  Piece[8][8] board;

  // Whether each player wants a draw
  bool player1Draw;
  bool player2Draw;

  // Modifiers
  modifier lockable() {
    require(!locked);
    _;
  }

  modifier playerOnly() {
    require(msg.sender == player1 || msg.sender == player2);
    _;
  }
  
  modifier playersTurnOnly() {
    require(msg.sender == currentTurn);
    _;
  }

  // Constructor

  // Constructs the game with the two players
  constructor (address _player1, address _player2) {
    player1 = _player1;
    player2 = _player2;

    locked = false;
    currentTurn = player1;

    player1Draw = false;
    player2Draw = false;

    emit newTurn(currentTurn);
  }

  // Public

  // Moves a peice from (x1, y1) to (x2, y2)
  // Requires the move is valid
  function takeTurn(uint x1, uint y1, uint x2, uint y2) public lockable playersTurnOnly {
    require(true, "Move is not valid"); // TODO update board and check if move is valid
    nextTurn();
  }

  // Allows a player to resign
  function resign() public lockable playerOnly {
    setWinner(otherPlayer(msg.sender));
  }

  // Gets the address that won
  // Requires game is locked
  function getWinner() public view returns (address) {
    require(locked, "Winner is undecided");
    return winner;
  }

  // Propose a draw
  // If both parties propose a draw, the game is locked and over
  function proposeDraw() public playerOnly lockable {
    if (msg.sender == player1) {
      player1Draw = true;
    } else {
      player2Draw = true;
    }

    // Check if both have proprosed draws
    if (player1Draw && player2Draw) {
      setWinner(address(0x0));
    }

    emit drawProposal(msg.sender);
  }

  // Cancel a draw
  function cancelDraw() public playerOnly lockable {
    if (msg.sender == player1) {
      player1Draw = false;
    } else {
      player2Draw = false;
    }

    emit drawCanceled(msg.sender);
  }

  // Private

  // Sets the winner and locks the contract
  function setWinner(address player) private {
    locked = true;
    winner = player;

    emit gameWon(winner);
  }

  // Moves the contract to the next turn
  function nextTurn() private {
    currentTurn = otherPlayer(currentTurn);

    emit newTurn(currentTurn);
  }

  // get the other player from the player you have
  function otherPlayer(address player) private view returns(address) {
    if (player == player1) {
      return player2;
    } else {
      return player1;
    }
  }
}