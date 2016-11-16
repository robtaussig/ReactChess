export default class Ai {
  constructor (board) {
    this.specialMoves = {};
    this.board = this.convertBoard(board);
  }

  //RNBQKBNRPPPPPPPP----------------
  //----------------pppppppprnbqkbnr
  convertBoard (board) {
    let boardString = "";
    for (let i = 0, n = board.length; i < n; i++) {
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
    }
    return boardString;
  }

  color (piece, color) {
    if (color === 'w') {
      return (/[a-z]/.test(piece));
    } else if (color === 'b') {
      return (/[A-Z]/.test(piece));
    }
    return false;
  }

  findAllPieces (board, color) {
    let positions = [];
    for (let i = 0, n = board.length; i < n; i++) {
      let piece = board[i];
      if (piece !== '-' && this.color(piece,color)) {
        positions.push(i);
      }
    }
    return positions;
  }

  allLegalMoves (board,positions) {
    let moves = [];
    for (let i = 0; i < positions.length; i++) {
      moves.concat(this.findAllLegalMovesByPiece(board,positions[i]));
    }
    return moves;
  }

  findAllLegalMovesByPiece (board,position) {
    let allMoves;
    switch (board[position]) {
      case 'P':
        allMoves = this.pawnMoves(board,position,'b');
        break;
      case 'p':
        allMoves = this.pawnMoves(board,position,'w');
        break;
      case 'R':
        allMoves = this.rookMoves(board,position,'b');
        break;
      case 'r':
        allMoves = this.rookMoves(board,position,'w');
        break;
      case 'N':
        allMoves = this.knightMoves(board,position,'b');
        break;
      case 'n':
        allMoves = this.knightMoves(board,position,'w');
        break;
      case 'B':
        allMoves = this.bishopMoves(board,position,'b');
        break;
      case 'b':
        allMoves = this.bishopMoves(board,position,'w');
        break;
      case 'K':
        allMoves = this.kingMoves(board,position,'b');
        break;
      case 'k':
        allMoves = this.kingMoves(board,position,'w');
        break;
      case 'Q':
        allMoves = this.queenMoves(board,position,'b');
        break;
      case 'q':
        allMoves = this.queenMoves(board,position,'w');
        break;
      default:
        allMoves = [];
    }
    return allMoves;
  }

  pawnMoves (board, position, color) {

  }

  rookMoves (board, position, color) {

  }

  knightMoves (board, position, color) {

  }

  bishopMoves (board, position, color) {

  }

  kingMoves (board, position, color) {

  }

  QueenMoves (board, position, color) {

  }

}
