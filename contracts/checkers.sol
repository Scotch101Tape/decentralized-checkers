// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

enum Player {
  White,
  Black
}

contract Checkers {
  // Enums 
  enum Piece {
    None,
    Black,
    White,
    BlackKing,
    WhiteKing
  }

  enum Winner {
    Tie,
    White,
    Black
  }

  // Structs
  struct BoardPoint {
    uint x;
    uint y;
  }

  struct Move {
    BoardPoint start;
    BoardPoint end;
  }

  struct Status {
    bool won;
    Winner winner;

    Player turnPlayer;

    Piece[8][8] board;

    // Whether each player wants a draw
    bool whiteDraw;
    bool blackDraw;

    // The number of pieces captured
    // A player wins when they get all 12
    uint whiteScore;
    uint blackScore;
  }

  // Events
  event OnMove(Move);
  event OnWinner(Winner);
  event OnDrawProposal(Player);
  event OnDrawCancel(Player);

  // State Variables
  address whitePlayer;
  address blackPlayer;

  Status status;

  // Modifiers
  modifier afterWon() {
    require(status.won, "Game is not won");
    _;
  }

  modifier beforeWon() {
    require(!status.won, "Game is won");
    _;
  }

  modifier playerOnly() {
    require(msg.sender == whitePlayer || msg.sender == blackPlayer, "Not a player");
    _;
  }

  modifier onTurnOnly() {
    require(msg.sender == addressFromPlayer(status.turnPlayer), "Not players turn");
    _;
  }

  // Constructor

  // Constructs the game with the two players
  constructor (address _whitePlayer, address _blackPlayer) {
    whitePlayer = _whitePlayer;
    blackPlayer = _blackPlayer;

    status.won = false;
    status.turnPlayer = Player.White;

    status.whiteDraw = false;
    status.blackDraw = false;

    status.whiteScore = 12;
    status.blackScore = 12;

    /* Populate the board */

    // I could do this with a for loop and some modulo, but I think its more correct to simply
    // "place" each piece
    status.board[1][0] = Piece.White;
    status.board[3][0] = Piece.White;
    status.board[5][0] = Piece.White;
    status.board[7][0] = Piece.White;
    status.board[1][2] = Piece.White;
    status.board[3][2] = Piece.White;
    status.board[5][2] = Piece.White;
    status.board[7][2] = Piece.White;
    status.board[0][1] = Piece.White;
    status.board[2][1] = Piece.White;
    status.board[4][1] = Piece.White;
    status.board[6][1] = Piece.White;

    status.board[1][6] = Piece.Black;
    status.board[3][6] = Piece.Black;
    status.board[5][6] = Piece.Black;
    status.board[7][6] = Piece.Black;
    status.board[0][7] = Piece.Black;
    status.board[2][7] = Piece.Black;
    status.board[4][7] = Piece.Black;
    status.board[6][7] = Piece.Black;
    status.board[0][5] = Piece.Black;
    status.board[2][5] = Piece.Black;
    status.board[4][5] = Piece.Black;
    status.board[6][5] = Piece.Black;
  }

  // Public

  // Moves a peice from (x1, y1) to (x2, y2)
  // Requires the move is valid
  function doMove(Move calldata move) public beforeWon onTurnOnly {
    // Get the pieces at the points
    // This will check the points are in range
    Piece startPiece = pieceAtBoardPoint(move.start);
    Piece endPiece = pieceAtBoardPoint(move.end);

    // Make sure the (x1, y1) points to a peice of the team
    // and that (x2, y2) points to an empty space
    require(isPlayersPiece(status.turnPlayer, startPiece) && endPiece == Piece.None, "Piece types incorrect");

    // Find out if its a king only move (going negitive y when white; going positive y when black)
    bool kingOnly = status.turnPlayer == Player.White 
      ? (int(move.end.y) - int(move.start.y)) < 0
      : (int(move.end.y) - int(move.start.y)) > 0;
    
    // Make sure the piece is a king if kingOnly
    if (kingOnly) {
      require(startPiece == Piece.BlackKing || startPiece == Piece.WhiteKing, "Piece is not King");
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

    if (abs(int(move.start.x) - int(move.end.x)) == 1 && abs(int(move.start.y) - int(move.end.y)) == 1) {
      // Its a simple move

      // Update the board
      status.board[move.start.x][move.start.y] = Piece.None;
      status.board[move.end.x][move.end.y] = startPiece;
    } else if (abs(int(move.start.x) - int(move.end.x)) == 2 && abs(int(move.start.y) - int(move.end.y)) == 2) {
      // Its a jump

      // Make sure the piece being jumped is the others teams piece
      Piece jump = status.board[(move.start.x + move.end.x) / 2][(move.start.y + move.end.y) / 2];
      require(isPlayersPiece(otherPlayer(status.turnPlayer), jump), "Trying to jump an invalid piece");

      // Update the board
      status.board[move.start.x][move.start.y] = Piece.None;
      status.board[(move.start.x + move.end.x) / 2][(move.start.y + move.end.y) / 2] = Piece.None;
      status.board[move.end.x][move.end.y] = startPiece;

      //Update the score
      if (status.turnPlayer == Player.White) {
        status.blackScore -= 1;
        if (status.blackScore == 0) {
          setWinner(Winner.White);
        } 
      } else {
        status.whiteScore -= 1;
        if (status.whiteScore == 0) {
          setWinner(Winner.Black);
        }
      }
    } else {
      revert("Move is not correct");
    }

    // Add kings
    if (startPiece == Piece.White && move.end.y == 7) {
      status.board[move.end.x][move.end.y] = Piece.WhiteKing;
    } else if (startPiece == Piece.Black && move.end.y == 0) {
      status.board[move.end.x][move.end.y] = Piece.BlackKing;
    }

    status.turnPlayer = otherPlayer(status.turnPlayer);

    emit OnMove(move);
  }

  // Allows a player to resign
  function resign() public beforeWon playerOnly {
    setWinner(msg.sender == whitePlayer ? Winner.White : Winner.Black);
  }

  // Propose a draw
  // If both parties propose a draw, the game is locked and over
  function proposeDraw() public playerOnly beforeWon {
    Player player = playerFromAddress(msg.sender);

    if (player == Player.White) {
      status.whiteDraw = true;
    } else {
      status.blackDraw = true;
    }

    // Check if both have proprosed draws
    if (status.whiteDraw && status.blackDraw) {
      setWinner(Winner.Tie);
    }

    emit OnDrawProposal(player);
  }

  // Cancel a draw
  function cancelDraw() public playerOnly beforeWon {
    Player player = playerFromAddress(msg.sender);

    if (player == Player.White) {
      status.whiteDraw = false;
    } else {
      status.blackDraw = false;
    }

    emit OnDrawCancel(player);
  }

  function getStatus() public view returns (Status memory) {
    return status;
  }

  // Private

  // Sets the winner and locks the contract
  function setWinner(Winner _winner) private {
    status.won = true;
    status.winner = _winner;

    emit OnWinner(status.winner);
  }

  // get the other player from the player you have
  function otherPlayer(Player player) private pure returns (Player) {
    return player == Player.White ? Player.Black : Player.White;
  }

  function isPlayersPiece(Player player, Piece piece) private pure returns (bool) {
    if (piece == Piece.None) {
      return false;
    }

    if (player == Player.White) {
      return piece == Piece.White || piece == Piece.WhiteKing;
    } else {
      return piece == Piece.Black || piece == Piece.BlackKing;
    }
  }

  function pieceAtBoardPoint(BoardPoint calldata boardPoint) private view returns (Piece) {
    require(isValidBoardPoint(boardPoint), "BoardPoint out of range");
    return status.board[boardPoint.x][boardPoint.y];
  }

  function isValidBoardPoint(BoardPoint calldata boardPoint) private pure returns (bool) {
    return (boardPoint.x >= 0
      && boardPoint.x < 8
      && boardPoint.y >= 0
      && boardPoint.y < 8
    );
  }

  function addressFromPlayer(Player player) private view returns (address) {
    if (player == Player.White) {
      return whitePlayer;
    } else {
      return blackPlayer;
    }
  }

  function playerFromAddress(address playerAddress) private view returns (Player) {
    if (playerAddress == whitePlayer) {
      return Player.White;
    } else if (playerAddress == blackPlayer) {
      return Player.Black;
    } else {
      revert("Address not player");
    }
  }
}

function abs(int x) pure returns (uint) {
  if (x >= 0) {
    return uint(x);
  } else {
    return uint(-x);
  }
}