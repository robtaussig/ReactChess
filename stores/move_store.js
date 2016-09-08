const Store = require('flux/utils').Store;
const AppDispatcher = require('../dispatcher/dispatcher.js');
const MoveConstants = require('../constants/move_constants.js');
const MoveStore = new Store(AppDispatcher);

let _currentData = {
  move: [],
  castle: false,
  enPassant: false,
  checkMate: false
};

function _resetMove (move) {
  _currentData.move = move;
  _currentData.castle = false;
  _currentData.enPassant = false;
}

function _setCastle (move) {
  _currentData.move = move;
  _currentData.castle = true;
  _currentData.enPassant = false;
}

function _endGame (side) {
  _currentData.checkmate = true;
}

function _setEnPassant (move) {
  _currentData.move = move;
  _currentData.enPassant = true;
  _currentData.castle = false;
}

MoveStore.fetchMove = function () {
  return _currentData;
};

MoveStore.__onDispatch = (payload) => {
  switch (payload.actionType) {
    case MoveConstants.MOVE_RECEIVED:
      _resetMove(payload.data);
    break;
    case MoveConstants.CHECKMATE_RECEIVED:
      _endGame(payload.data);
    break;
    case MoveConstants.CASTLE_RECEIVED:
      _setCastle(payload.data);
    break;
    case MoveConstants.EN_PASSANT_RECEIVED:
      _setEnPassant(payload.data);
    break;
  }
  MoveStore.__emitChange();
};

module.exports = MoveStore;
