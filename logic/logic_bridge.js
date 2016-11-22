// const Ai = require('./ai.js');
import Ai from './ai_new.js';
import BoardEval from './board_eval.js';

// const BoardNode = require('./board_node.js');

module.exports = {

  findBestMove (board, specMoves, depth) {
    let ai = new Ai(board, specMoves);
    let moves = ai.allLegalMoves(
      ai.findAllPieces('b')
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

  // findBestMove (board,specMoves,depth) {
  //   let moves = Ai.parseMoveClusters(
  //                 Ai.findAllPieces(board,specMoves.currentSide)
  //                 .map(piece=> Ai.findAllLegalMovesByPiece(piece,board,specMoves))
  //               );
  //   if (moves.length === 0) return {checkmate: true, side: specMoves.currentSide};
  //   debugger
  //   let bestMove = null;
  //   moves.forEach(move => {
  //     let currentNode = new BoardNode(move,board,specMoves,depth);
  //     if (currentNode.checkmate) {
  //       return {move: currentNode.move, checkmate: true};
  //     }
  //     bestMove = bestMove ?
  //       (currentNode.score > bestMove.score ?
  //         currentNode : bestMove) : currentNode;
  //   });
  //   return {move: bestMove.move};
  // }
};
