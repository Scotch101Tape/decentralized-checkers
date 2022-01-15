// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./checkers.sol";

contract DecentralizedCheckers {
  // Events
  event gameStarted(address game, address player1, address player2);

  // Variables
  bool someoneWaiting;
  address someone;

  // Connstructor
  constructor () {
    someoneWaiting = false;  
  }

  // Public
  function joinPublicGame() public {
    if (someoneWaiting) {
      Checkers game = new Checkers(someone, msg.sender);
      emit gameStarted(address(game), someone, msg.sender);
    } else {
      someoneWaiting = true;
      someone = msg.sender;
    }
  }

  // Private
}