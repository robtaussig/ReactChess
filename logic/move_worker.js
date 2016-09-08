self.importScripts('./board_node.js');

self.onmessage = function (e) {
  let specMoves = e.data.data.specialMoves;
  let testBoard = dupe(e.data.data.board.pieces);
  let depth = e.data.data.depth;
  let bestMove = findBestMove(testBoard,specMoves,depth);
  let workerResult = 'Message received!';
  postMessage(bestMove);
};
