export default class Ai {
  constructor (board) {
    this.specialMoves = {};
    this.board = this.convertBoard(board);
  }

  //RNBQKBNRPPPPPPPP----------------
  //----------------pppppppprnbqkbnr
  convertBoard (board) {
    let boardString = '----------';
    for (let i = 0, n = board.length; i < n; i++) {
      boardString += '-';
      for (let j = 0, m = board[i].length; j < m; j++) {
        let piece = board[i][j][0];
        let type = piece.split('-')[1];
        if (type === 'l') {
          boardString += '-';
        } else if (piece.split('-')[0] === 'b') {
          boardString += type.toUpperCase();
        } else {
          boardString += type;
        }
      }
      boardString += '-';
    }
    boardString += '----------';
    return boardString;
  }

  color (piece) {
    if (/[a-z]/.test(piece)) {
      return 'w';
    } else {
      return 'b';
    }
  }

  findAllPieces (color, board = this.board) {
    let positions = [];
    for (let i = 0, n = board.length; i < n; i++) {
      let piece = board[i];
      if (piece !== '-' && this.color(piece) === color) {
        positions.push(i);
      }
    }
    return positions;
  }

  allLegalMoves (positions, board = this.board) {
    let moves = [];
    for (let i = 0; i < positions.length; i++) {
      moves.concat(this.findAllLegalMovesByPiece(positions[i],board));
    }
    return moves;
  }

  findAllLegalMovesByPiece (position, board = this.board) {
    let allMoves;
    switch (board[position].toLowerCase()) {
      case 'p':
        allMoves = this.pawnMoves(position, board);
        break;
      case 'r':
        allMoves = this.rookMoves(position, board);
        break;
      case 'n':
        allMoves = this.knightMoves(position, board);
        break;
      case 'b':
        allMoves = this.bishopMoves(position, board);
        break;
      case 'k':
        allMoves = this.kingMoves(position, board);
        break;
      case 'q':
        allMoves = this.queenMoves(position, board);
        break;
      default:
        allMoves = [];
    }
    return allMoves;
  }

  inBounds (pos) {
    return (pos > 9 && pos < 90 && pos % 10 !== 0 && pos % 10 !== 9);
  }

  checkObstruction (pos, board = this.board) {
    return board[pos] === '-' && this.inBounds(pos);
  }

  canTake (color, pos) {
    return this.color(pos) !== color;
  }

  pawnMoves (position, board = this.board) {

  }

  rookMoves (position, board = this.board) {
    let allMoves = [];
    let legalDirs = [-1,1,-10,10];
    let color = this.color(board[position]);
    for (let i = 0; i < 4; i++) {
      let currentPos = position + legalDirs[i];
      while (this.checkObstruction(currentPos)) {
        allMoves.push(currentPos);
        currentPos += legalDirs[i];
      }
      if (this.inBounds(currentPos) && this.canTake(color, currentPos)) {
        allMoves.push(currentPos);
      }
    }
    return allMoves;
  }

  knightMoves (position, board = this.board) {

  }

  bishopMoves (position, board = this.board) {

  }

  kingMoves (position, board = this.board) {

  }

  QueenMoves (position, board = this.board) {

  }

}
