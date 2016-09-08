const AppDispatcher = require('../dispatcher/dispatcher.js');
const MoveApi = require('../utils/move_api.js');
const MoveConstants = require('../constants/move_constants.js');

module.exports = {
  fetchMove (board, color, depth) {
    MoveApi.getBestMove(board,color,depth,this.receiveMove);
  },

  receiveMove (move) {
    
  }
};
