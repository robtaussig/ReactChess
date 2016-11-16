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

  color (pos,board = this.board) {
    if (/[a-z]/.test(board[pos])) {
      return 'w';
    } else {
      return 'b';
    }
  }

  findAllPieces (color, board = this.board) {
    let positions = [];
    for (let i = 0, n = board.length; i < n; i++) {
      let piece = board[i];
      if (piece !== '-' && this.color(i) === color) {
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
    let color = this.color(position,board);
    for (let i = 0; i < legalDirs.length; i++) {
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
    let allMoves = [];
    let legalDirs = [-12,-21,-19,-8,12,21,19,8];
    let color = this.color(position,board);
    for (let i = 0; i < legalDirs.length; i++) {
      let currentPos = position + legalDirs[i];
      if (this.checkObstruction(currentPos) ||
        this.canTake(color, currentPos)) {
          allMoves.push(currentPos);
      }
    }
    return allMoves;
  }

  bishopMoves (position, board = this.board) {
    let allMoves = [];
    let legalDirs = [-11,11,-9,9];
    let color = this.color(position,board);
    for (let i = 0; i < legalDirs.length; i++) {
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

  kingMoves (position, board = this.board) {
    let allMoves = [];
    let legalDirs = [-1,-11,-10,-9,1,11,10,9];
    let color = this.color(position,board);
    for (let i = 0; i < legalDirs.length; i++) {
      let currentPos = position + legalDirs[i];
      if (this.checkObstruction(currentPos) ||
        this.canTake(color, currentPos)) {
          allMoves.push(currentPos);
      }
    }
    return allMoves;
  }

  queenMoves (position, board = this.board) {
    let allMoves = [];
    let legalDirs = [-1,1,-10,10,-11,11,-9,9];
    let color = this.color(position,board);
    for (let i = 0; i < legalDirs.length; i++) {
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

}
