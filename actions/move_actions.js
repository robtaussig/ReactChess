const AppDispatcher = require('../dispatcher/dispatcher.js');
const MoveConstants = require('../constants/move_constants.js');

module.exports = {
  fetchMove (board, specialMoves, depth) {
    let worker = new Worker('../logic/move_worker.js');
    let gameInfo = {
      board: board,
      specialMoves: specialMoves,
      depth: depth
    };
    let that = this;
    worker.addEventListener('message', function(e) {
      document.getElementById('result').textContent = "Move received!";
    }, false);
    worker.postMessage({data: gameInfo});
    worker.onmessage = function (e) {
      window.setTimeout(()=>{
        document.getElementById('result').textContent = "";
      },1000);
      if (e.data && e.data.checkmate) {
        that.receiveCheckmate(e.data.side);
      }
      worker.terminate();
    };
  },

  receiveCheckmate (side) {
    AppDispatcher.dispatch({
      actionType: MoveConstants.CHECKMATE_RECEIVED,
      data: side
    });
  },

  receiveMove (move) {

  }
};
