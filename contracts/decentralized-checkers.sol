// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./checkers.sol";

contract DecentralizedCheckers {
  // Events
  event OnGameStart(address game, address whitePlayer, address blackPlayer);

  // State
  bool waiting;
  address waiter;

  // Modifiers
  modifier onlyWaiter() {
    require(msg.sender == waiter && waiting);
    _;
  }

  // Connstructor
  constructor () {
    waiting = false;  
  }

  // Public
  function joinGame() public {
    if (waiting) {
      Checkers game = new Checkers(waiter, msg.sender);
      emit OnGameStart(address(game), waiter, msg.sender);
    } else {
      waiting = true;
      waiter = msg.sender;
    }
  }

  function cancelJoinGame() public onlyWaiter {
    waiting = false;
    waiter = address(0);
  }
}