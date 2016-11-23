export default class Ai {
  constructor (board,specialMoves) {
    this.specialMoves = specialMoves;
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
      moves = moves.concat(this.findAllLegalMovesByPiece(positions[i],board));
    }
    return moves.filter(move => !this.inCheck(move,board));
  }

  inCheck (move, board = this.board, color = 'b') {
    let newBoard = this.makeMove(move, board);
    let kingPos = this.findPiece('k', color, newBoard)[0];
    return Boolean(this.hasAttackers(kingPos, newBoard, color));
  }

  findPiece (piece, color, board = this.board) {
    if (color === 'b') piece = piece.toUpperCase();
    let pos = [];
    for (let i = 0; i < 100; i++) {
      if (board[i] === piece) {
        if (piece === 'K' || piece === 'k' ||
          piece === 'Q' || piece === 'q') {
            return [i];
          }
        pos.push(i);
      }
    }
    return pos;
  }

  hasAttackers (position, board = this.board, color = 'b') {

    let queenCheck = false;

    let pawnChecks = [
      11 * (color === 'w' ? - 1 : 1),
      9 * (color === 'w' ? - 1 : 1)
    ];
    for (let i = 0; i < pawnChecks.length; i++) {
      let currentPos = position + pawnChecks[i];
      let piece = board[currentPos] ? board[currentPos].toLowerCase() : '-';
      if (this.inBounds(currentPos) && piece === 'p' &&
        this.color(currentPos,board) !== color) {
          return 100;
      }
    }

    let bishopsQueensCheck = [-11,-9,11,9];
    for (let i = 0; i < bishopsQueensCheck.length; i++) {
      let currentPos = position + bishopsQueensCheck[i];
      while (this.checkObstruction(currentPos, board)) {
        currentPos += bishopsQueensCheck[i];
      }
      let piece = board[currentPos] ? board[currentPos].toLowerCase() : '-';
      if (this.inBounds(currentPos) && (piece === 'b' || piece === 'q') &&
        this.color(currentPos,board) !== color) {
          if (piece === 'b') {
            return 300;
          } else {
            queenCheck = true;
          }
      }
    }

    let knightChecks = [-12,-21,-19,-8,12,21,19,8];
    for (let i = 0; i < knightChecks.length; i++) {
      let currentPos = position + knightChecks[i];
      let piece = board[currentPos] ? board[currentPos].toLowerCase() : '-';
      if (this.inBounds(currentPos) && piece === 'n' &&
        this.color(currentPos,board) !== color) {
          return 300;
      }
    }

    let rooksQueensCheck = [-1,1,-10,10];
    for (let i = 0; i < rooksQueensCheck.length; i++) {
      let currentPos = position + rooksQueensCheck[i];
      while (this.checkObstruction(currentPos, board)) {
        currentPos += rooksQueensCheck[i];
      }
      let piece = board[currentPos] ? board[currentPos].toLowerCase() : '-';
      if (this.inBounds(currentPos) && (piece === 'r' || piece === 'q') &&
        this.color(currentPos,board) !== color) {
          if (piece === 'r') {
            return 500;
          } else {
            queenCheck = true;
          }
      }
    }

    let kingChecks = [-1,-11,-10,-9,1,11,10,9];
    for (let i = 0; i < kingChecks.length; i++) {
      let currentPos = position + kingChecks[i];
      let piece = board[currentPos] ? board[currentPos].toLowerCase() : '-';
      if (this.inBounds(currentPos) && piece === 'k' &&
        this.color(currentPos,board) !== color) {
          return 1000;
      }
    }

    return queenCheck ? 900 : false;
  }

  testCastle(move, board) {
    let castle = {
      17: 18,
      13: 11,
      87: 88,
      83: 81
    };
    if (board[move[0]].toLowerCase() === 'k' && Math.abs(move[1] - move[0]) === 2) {
      return [
        (move[0] + move[1]) / 2,
        this.color(move[0],board) === 'w' ? 'r' : 'R',
        castle[move[1]]
      ];
    } else {
      return false;
    }
  }

  makeMove (move, board = this.board) {
    let newBoard = "";
    let castled = this.testCastle(move,board);
    for (let i = 0; i < 100; i++) {
      if (i === move[0]) {
        newBoard += '-';
      } else if (i === move[1]) {
        newBoard += board[move[0]];
      } else if (i === castled[0]) {
        newBoard += castled[1];
      } else if (i === castled[2]) {
        newBoard += '-';
      } else {
        newBoard += board[i];
      }
    }
    return newBoard;
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

  canTake (color, pos, board = this.board) {
    return this.inBounds(pos) && this.color(pos) !== color && board[pos] !== '-';
  }

  pawnMoves (position, board = this.board) {
    let allMoves = [];
    let color = this.color(position,board);
    let legalDirs = [
      10 * (color === 'w' ? - 1 : 1)
    ];
    if ((color === 'w' && position > 70) || (color === 'b' && position < 30)) {
      legalDirs.push(20 * (color === 'w' ? - 1 : 1));
    }
    for (let i = 0; i < legalDirs.length; i++) {
      let currentPos = position + legalDirs[i];
      if (this.checkObstruction(currentPos, board)) {
        allMoves.push([position,currentPos]);
      }
    }

    let captureDirs = [
      11 * (color === 'w' ? - 1 : 1),
      9 * (color === 'w' ? - 1 : 1)
    ];
    for (let i = 0; i < captureDirs.length; i++) {
      let capturePos = position + captureDirs[i];
      if (this.inBounds(capturePos) && this.canTake(color, capturePos, board)) {
        allMoves.push([position,capturePos]);
      }
    }
    // Remember to test again for en passant
    if (this.specialMoves.enPassant &&
      Math.abs(this.specialMoves - position) === 1) {
        allMoves.push([position,this.specialMoves.enPassant +
          (10 * color === 'w' ? -1 : 1)]);
    }
    return allMoves;
  }

  rookMoves (position, board = this.board) {
    let allMoves = [];
    let legalDirs = [-1,1,-10,10];
    let color = this.color(position,board);
    for (let i = 0; i < legalDirs.length; i++) {
      let currentPos = position + legalDirs[i];
      while (this.checkObstruction(currentPos, board)) {
        allMoves.push([position,currentPos]);
        currentPos += legalDirs[i];
      }
      if (this.inBounds(currentPos) && this.canTake(color, currentPos, board)) {
        allMoves.push([position,currentPos]);
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
      if (this.checkObstruction(currentPos, board) ||
        this.canTake(color, currentPos, board)) {
          allMoves.push([position,currentPos]);
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
      while (this.checkObstruction(currentPos, board)) {
        allMoves.push([position,currentPos]);
        currentPos += legalDirs[i];
      }
      if (this.inBounds(currentPos) && this.canTake(color, currentPos, board)) {
        allMoves.push([position,currentPos]);
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
      if (this.checkObstruction(currentPos, board) ||
        this.canTake(color, currentPos, board)) {
          allMoves.push([position,currentPos]);
      }
    }
    allMoves = allMoves.concat(this.checkCastle(board, position));
    return allMoves;
  }

  emptyBetween (board,from, to) {
    // Check horizontal line
    if (Math.floor(from / 10) === Math.floor(to / 10)) {
      for (let i = Math.min(from, to); i <= Math.max(from, to); i++) {
        if (board[i] !== '-') return false;
      }
      // Check vertical line
    } else if (from % 10 === to % 10) {
      for (let i = Math.min(from, to); i <= Math.max(from, to); i += 10) {
        if (board[i] !== '-') return false;
      }
    } else {
      // Check diagonal
      if (Math.abs(from - to) % 11 === 0) {
        for (let i = Math.min(from, to); i <= Math.max(from, to); i += 11) {
          if (board[i] !== '-') return false;
        }
      } else if (Math.abs(from - to) % 9 === 0) {
        for (let i = Math.min(from, to); i <= Math.max(from, to); i += 9) {
          if (board[i] !== '-') return false;
        }
      }
    }

    return true;
  }

  checkCastle (board, position) {
    let moves = [];
    let color = board[position] === 'K' ? 'b' : 'w';
    let specMoves = this.specialMoves[color];
    if (specMoves.castleQueenSideStatus) {
      if (this.emptyBetween(board, position - 1, 12) && color === 'b') {
        moves.push([position,13]);
      } else if (this.emptyBetween(board, position - 1, 82) && color === 'w'){
        moves.push([position, 83]);
      }
    }

    if (specMoves.castleKingSideStatus) {
      if (this.emptyBetween(board, position + 1, 17) && color === 'b') {
        moves.push([position,17]);
      } else if (this.emptyBetween(board, position + 1, 87) && color === 'w'){
        moves.push([position, 87]);
      }
    }
    return moves;
  }

  queenMoves (position, board = this.board) {
    let allMoves = [];
    let legalDirs = [-1,1,-10,10,-11,11,-9,9];
    let color = this.color(position,board);
    for (let i = 0; i < legalDirs.length; i++) {
      let currentPos = position + legalDirs[i];
      while (this.checkObstruction(currentPos, board)) {
        allMoves.push([position,currentPos]);
        currentPos += legalDirs[i];
      }
      if (this.inBounds(currentPos) && this.canTake(color, currentPos)) {
        allMoves.push([position,currentPos]);
      }
    }
    return allMoves;
  }

}
