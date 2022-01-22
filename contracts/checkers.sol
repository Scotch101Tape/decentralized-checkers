// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

enum Piece {
  None,
  Black,
  White,
  BlackKing,
  WhiteKing
}

enum Team {
  White,
  Black
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

  // The number of pieces captured
  // A player wins when they get all 12
  uint player1Score;
  uint player2Score;

  // Modifiers
  modifier lockable() {
    require(!locked, "Game is locked");
    _;
  }

  modifier playerOnly() {
    require(msg.sender == player1 || msg.sender == player2, "Not a player");
    _;
  }
  
  modifier playersTurnOnly() {
    require(msg.sender == currentTurn, "Not players turn");
    _;
  }

  // Constructor

  // Constructs the game with the two players
  constructor (address _player1, address _player2) {
    winner = address(0);

    player1 = _player1;
    player2 = _player2;

    locked = false;
    currentTurn = player1;

    player1Draw = false;
    player2Draw = false;

    /* Populate the board */

    // I could do this with a for loop and some modulo, but I think its more correct to simply
    // "place" each piece
    board[1][0] = Piece.White;
    board[3][0] = Piece.White;
    board[5][0] = Piece.White;
    board[7][0] = Piece.White;
    board[1][2] = Piece.White;
    board[3][2] = Piece.White;
    board[5][2] = Piece.White;
    board[7][2] = Piece.White;
    board[0][1] = Piece.White;
    board[2][1] = Piece.White;
    board[4][1] = Piece.White;
    board[6][1] = Piece.White;

    board[1][6] = Piece.Black;
    board[3][6] = Piece.Black;
    board[5][6] = Piece.Black;
    board[7][6] = Piece.Black;
    board[0][7] = Piece.Black;
    board[2][7] = Piece.Black;
    board[4][7] = Piece.Black;
    board[6][7] = Piece.Black;
    board[0][5] = Piece.Black;
    board[2][5] = Piece.Black;
    board[4][5] = Piece.Black;
    board[6][5] = Piece.Black;

    emit newTurn(currentTurn);
  }

  // Public

  // Moves a peice from (x1, y1) to (x2, y2)
  // Requires the move is valid
  function takeTurn(uint x1, uint y1, uint x2, uint y2) public lockable playersTurnOnly {
    Team team = playersTeam(msg.sender);

    // Make sure its in bounds
    require(x1 >= 0 && x1 < 8 && y1 >= 0 && y1 < 8 && x2 >= 0 && x2 < 8 && y2 >= 0 && y2 < 8, "Out of bounds");

    Piece fromPiece = board[x1][y1];
    Piece toPiece = board[x2][y2];

    // Make sure the (x1, y1) points to a peice of the team
    // and that (x2, y2) points to an empty space
    require(pieceInTeam(team, fromPiece) && toPiece == Piece.None, "Piece types incorrect");

    // Find out if its a king only move (going negitive y when white; going positive y when black)
    bool kingOnly = team == Team.White 
      ? (int(y2) - int(y1)) < 0
      : (int(y2) - int(y1)) > 0;
    
    // Make sure the piece is a king if kingOnly
    if (kingOnly) {
      require(fromPiece == Piece.BlackKing || fromPiece == Piece.WhiteKing, "Piece is not King");
    }

    // Make sure that the jump is either

    // A simple move
    // X   X
    //   .  
    // X   X

    // or a jump
    // X       X
    //   O   O
    //     .
    //   O   O
    // X       X

    if (abs(int(x1) - int(x2)) == 1 && abs(int(y1) - int(y2)) == 1) {
      // Its a simple move

      // Update the board
      board[x1][y1] = Piece.None;
      board[x2][y2] = fromPiece;
    } else if (abs(int(x1) - int(x2)) == 2 && abs(int(y1) - int(y2)) == 2) {
      // Its a jump

      // Make sure the piece being jumped is the others teams piece
      Piece jumped = board[(x1 + x2) / 2][(y1 + y2) / 2];
      require(pieceInTeam(otherTeam(team), jumped), "Trying to jump an invalid piece");

      // Update the board
      board[x1][y1] = Piece.None;
      board[(x1 + x2) / 2][(y1 + y2) / 2] = Piece.None;
      board[x2][y2] = fromPiece;

      //Update the score
      if (msg.sender == player1) {
        player1Score += 1;
      } else {
        player2Score += 1;
      }
    } else {
      revert("Move is not correct");
    }
    
    // Check for win
    if (playersScore(msg.sender) >= 12) {
      setWinner(msg.sender);
    }

    // Add kings
    if (fromPiece == Piece.White) {
      if (y2 == 7) {
        board[x2][y2] = Piece.WhiteKing;
      }
    } else if (fromPiece == Piece.Black) {
      if (y2 == 0) {
        board[x2][y2] = Piece.BlackKing;
      }
    }

    // Change whos turn it is
    nextTurn();

    // TODO: implement double jump
  }

  // Allows a player to resign
  function resign() public lockable playerOnly {
    setWinner(otherPlayer(msg.sender));
  }

  // Gets the address that won
  // Requires game is locked
  function getWinner() public view returns (address) {
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

  // Get the board
  function getBoard() public view returns(Piece[8][8] memory) {
    return board;
  }

  function isLocked() public view returns(bool) {
    return locked;
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

  function playersTeam(address player) private view returns(Team) {
    if (player == player1) {
      return Team.White;
    } else {
      return Team.Black;
    }
  }

  function pieceInTeam(Team team, Piece piece) private pure returns(bool) {
    return (team == Team.White && (piece == Piece.White || piece == Piece.WhiteKing)) || (team == Team.Black && (piece == Piece.Black || piece == Piece.BlackKing));
  }

  function otherTeam(Team team) private pure returns(Team) {
    if (team == Team.Black) {
      return Team.White;
    } else {
      return Team.Black;
    }
  }

  function abs(int x) private pure returns (uint) {
    if (x >= 0) {
      return uint(x);
    } else {
      return uint(-x);
    }
  }

  function playersScore(address player) private view returns (uint) {
    if (player == player1) {
      return player1Score;
    } else {
      return player2Score;
    }
  }
}