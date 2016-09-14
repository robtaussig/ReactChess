const LogicBridge = require('./logic_bridge.js');
const Ai = require('./ai.js');

self.onmessage = function (e) {
  let specMoves = e.data.data.specialMoves;
  let testBoard = Ai.dupe(e.data.data.board.pieces);
  let depth = e.data.data.depth;
  let bestMove = LogicBridge.findBestMove(testBoard,specMoves,depth);
  let workerResult = 'Message received!';
  let moveData = Object.assign({move: [], checkmate: false, enPassant: false, castle: false},bestMove);
  postMessage(moveData);
};
