import Ai from './ai_new.js';
import BoardEval from './board_eval.js';

module.exports = {

  findBestMove (board, specMoves, depth) {
    let ai = new Ai(board, specMoves);
    let moves = ai.allLegalMoves(
      ai.findAllPieces('b'), 'b'
    );
    if (moves.length === 0) return {checkmate: true, side: specMoves.currentSide};
    let bestMove = null;
    for (let i = 0; i < moves.length; i++) {
      let currentNode = new BoardEval(ai, moves[i], depth);
      if (currentNode.checkmate) {
        return {move: currentNode.move, checkmate: true};
      } else {
        bestMove = bestMove ? (currentNode.score < bestMove.score ?
          currentNode : bestMove) : currentNode;
      }
    }
    return {move: this.convert(bestMove.move)};
  },

  convert (move) {
    let from = [(move[0] % 10) - 1, Math.floor(move[0] / 10) - 1];
    let to = [(move[1] % 10) - 1, Math.floor(move[1] / 10) - 1];
    return [from,to];
  }
};
