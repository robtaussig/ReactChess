const MATERIAL = {
  r: 500,
  R: -500,
  n: 300,
  N: -300,
  b: 300,
  B: -300,
  q: 900,
  Q: -900,
  k: 1000,
  K: -1000,
  p: 100,
  P: -100,
  '-': 0
};

export default class BoardEval {
  constructor (ai, move, depth) {
    this.ai = ai;
    this.specialMoves = ai.specialMoves;
    this.move = move;
    this.depth = depth;
    this.checkmate = false;
    this.color = ai.color(move[0], ai.board);
    this.score = this.evaluateMove(ai.board, move, depth);
  }

  evaluateMove (board, move, depth) {
    let newBoard = this.ai.makeMove(move,board);
    return this.evaluateBoard(newBoard,this.color);
  }

  evaluateBoard (board,color) {
    let materialScore = 0;
    let positionalScore = 0;
    for (let i = 0, n = board.length; i < n; i++) {
      let piece = board[i];
      materialScore += (color === 'w' ? MATERIAL[piece] : -MATERIAL[piece]);
      positionalScore += this.piecePosition(i,board) * (color === 'w' ? 1 : -1);
    }
    return materialScore + positionalScore;
  }

  materialScore (board, color) {
    let score = board.split('').reduce((sum,piece) => {
      return (sum += MATERIAL[piece]);
    },0);

    return color === 'w' ? score : -score;
  }

  central (pos) {
    let centralVert = pos % 10;
    let centralHor = Math.floor( pos / 10 );
    let vertDist = (1 / (Math.abs(4.5 - centralVert) * 2));
    let horDist = (1 / (Math.abs(4.5 - centralHor) * 2));
    return (vertDist + horDist) / 2;
  }

  pawnPosition (pos, board) {
    return this.central(pos) * MATERIAL[board[pos]];
  }

  rookPosition (pos, board) {
    return this.ai.rookMoves(pos, board).length * MATERIAL[board[pos]] * 0.02;
  }

  inBounds (pos) {
    return (pos > 9 && pos < 90 && pos % 10 !== 0 && pos % 10 !== 9);
  }

  knightPosition (pos, board) {
    return this.central(pos) * MATERIAL[board[pos]];
  }

  bishopPosition (pos, board) {
    return this.ai.bishopMoves(pos, board).length * MATERIAL[board[pos]] * 0.02;
  }

  queenPosition (pos, board) {
    return this.ai.queenMoves(pos, board).length * MATERIAL[board[pos]] * 0.02;
  }

  kingPosition (pos, board) {
    return 0;
  }

  piecePosition (pos, board) {
    switch (board[pos].toLowerCase()) {
      case 'p':
        return this.pawnPosition(pos, board);
      case 'n':
        return this.knightPosition(pos, board);
      case 'r':
        return this.rookPosition(pos, board);
      case 'b':
        return this.bishopPosition(pos, board);
      case 'q':
        return this.queenPosition(pos, board);
      case 'k':
        return this.kingPosition(pos, board);
      default:
        return 0;
    }
  }
}
