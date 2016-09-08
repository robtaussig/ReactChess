const Store = require('flux/utils').Store;
const AppDispatcher = require('../dispatcher/dispatcher.js');
const MoveConstants = require('../constants/move_constants.js');
const MoveStore = new Store(AppDispatcher);

let _move = [];

let _castle = [];

let _enPassant = [];

function _resetMove () {

}

function _setCastle () {

}

function _setEnPassant () {

}

MoveStore.fetchMove = function () {

};

MoveStore.__onDispatch = (payload) => {
  switch (payload.actionType) {
    case MoveConstants.MOVE_RECEIVED:
      _resetMove(payload.data);
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
