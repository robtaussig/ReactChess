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

const central = (pos) => {
  let centralVert = pos % 10;
  let centralHor = Math.floor( pos / 10 );
  let vertDist = (1 / (Math.abs(4.5 - centralVert) * 2));
  let horDist = (1 / (Math.abs(4.5 - centralHor) * 2));
  return (vertDist + horDist) / 2;
};

const pawnPosition = (pos, board) => {
  return central(pos);
};

const rookPosition = (pos, board) => {

};

const knightPosition = (pos, board) => {

};

const bishopPosition = (pos, board) => {

};

const queenPosition = (pos, board) => {

};

const kingPosition = (pos, board) => {

};

const piecePosition = (pos, board) => {
  let color;
  if (/[a-z]/.test(board[pos])) {
    color = 1;
  } else {
    color = -1;
  }
  switch (board[pos].toLowerCase()) {
    case 'p':
      return pawnPosition(pos, board) * color * 50;
    default:
      return 0;
  }
};

export default class BoardEval {
  constructor (ai, move, depth) {
    this.ai = ai;
    this.specialMoves = ai.specialMoves;
    this.depth = depth;
    this.checkmate = false;
    this.score = this.evaluateMove(ai.board, move, depth);
  }

  evaluateMove (board, move, depth) {
    let newBoard = this.ai.makeMove(move,board);
    let score = this.evaluateBoard(newBoard,'b');
  }

  evaluateBoard (board,color) {
    let materialScore = 0;
    let positionalScore = 0;
    for (let i = 0, n = board.length; i < n; i++) {
      let piece = board[i];
      materialScore += (color === 'w' ? MATERIAL[piece] : -MATERIAL[piece]);
      positionalScore += piecePosition(i,board);
    }
    debugger
    return materialScore;
  }

  materialScore (board, color) {
    let score = board.split('').reduce((sum,piece) => {
      return (sum += MATERIAL[piece]);
    },0);

    return color === 'w' ? score : -score;
  }
}
