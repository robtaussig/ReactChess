export default class BoardEval {
  constructor (ai, move, specialMoves, depth) {
    this.ai = ai;
    this.specialMoves = ai.specialMoves;
    this.depth = depth;
    this.checkmate = false;
    debugger
    this.score = this.evaluateMove(ai.board, move, depth);
  }
}
