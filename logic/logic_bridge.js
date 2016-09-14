const Ai = require('./ai.js');
const BoardNode = require('./board_node.js');

module.exports = {
  findBestMove (board,specMoves,depth) {
    let moves = Ai.parseMoveClusters(
                  Ai.findAllPieces(board,specMoves.currentSide)
                  .map(piece=> Ai.findAllLegalMovesByPiece(piece,board,specMoves))
                );
    if (moves.length === 0) return {checkmate: true, side: specMoves.currentSide};

    let bestMove = null;
    moves.forEach(move => {
      let currentNode = new BoardNode(move,board,specMoves,depth);
      if (currentNode.checkmate) {
        return {move: currentNode.move, checkmate: true};
      }
      bestMove = bestMove ?
        (currentNode.score > bestMove.score ?
          currentNode : bestMove) : currentNode;
    });
    return {move: bestMove.move};
  }
};
