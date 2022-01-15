// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Checkers {
    address player1;
    address player2;

    constructor (address _player1, address _player2) {
        player1 = _player1;
        player2 = _player2;
    }
}