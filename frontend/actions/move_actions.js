const AppDispatcher = require('../dispatcher/dispatcher.js');
// const MoveWorker = require('../utils/move_worker.js');
const MoveConstants = require('../constants/move_constants.js');

module.exports = {
  fetchMove (board, color, depth) {
    let worker = new Worker('/assets/move_worker.js');
    let gameInfo = {
      board: board,
      color: color,
      depth: depth
    };
    worker.addEventListener('message', function(e) {
      document.getElementById('result').textContent = "Move received!";
    }, false);
    worker.postMessage({data: gameInfo});
    worker.onmessage = function (e) {
      window.setTimeout(()=>{
        document.getElementById('result').textContent = "";
      },1000);
      worker.terminate();
    };
  },

  receiveMove (move) {

  }
};
