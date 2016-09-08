const SpecialMoves = require('./special_moves');
const MoveRules = require('./move_rules');

let board = {
  pieces: [
    [['b-r'],['b-n'],['b-b'],['b-q'],['b-k'],['b-b'],['b-n'],['b-r']],
    [['b-p'],['b-p'],['b-p'],['b-p'],['b-p'],['b-p'],['b-p'],['b-p']],
    [['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l']],
    [['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l']],
    [['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l']],
    [['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l']],
    [['w-p'],['w-p'],['w-p'],['w-p'],['w-p'],['w-p'],['w-p'],['w-p']],
    [['w-r'],['w-n'],['w-b'],['w-q'],['w-k'],['w-b'],['w-n'],['w-r']],
  ],
  selectedSquare: []
};

let observer = null;

function emitChange() {
  observer(board,SpecialMoves.currentSide);
}

export function observe(o) {
  if (observer) {
    throw new Error('Multiple observers not implemented.');
  }
  observer = o;
  emitChange();
}

export function setSelected(piece) {
  board.selectedSquare = piece.pos;
}

export function canMove(toX, toY, pieces = board.pieces, from = board.selectedSquare) {
  if (MoveRules.notInCheck(toX, toY, from, pieces) && pieces[from[1]][from[0]][0][0] === SpecialMoves.currentSide) {
    if (MoveRules.checkMove(toX, toY, pieces, from)) return true;
  }
  return false;
}

export function move(toX, toY, from = board.selectedSquare, pieces = board.pieces) {
  let selected = from;
  let start = pieces[selected[1]][selected[0]][0];
  let enPassant = SpecialMoves[start[0]].enPassant;
  if (start[2] === 'p' && Math.abs(selected[1] - toY) === 2) {
    MoveRules.checkEnPassant(toX, toY, selected, pieces);
  } else if (start[2] === 'k') {
    if (Math.abs(toX - selected[0]) === 2) {
      MoveRules.castleRook(toX > selected[0] ? 5 : 3, selected[1],pieces);
    }
    SpecialMoves[start[0]].castleKingSideStatus = false;
    SpecialMoves[start[0]].castleQueenSideStatus = false;
  } else if (start[2] === 'r') {
    if (selected[0] === 0) {
      SpecialMoves[start[0]].castleQueenSideStatus = false;
    } else if (selected[0] === 7) {
      SpecialMoves[start[0]].castleKingSideStatus = false;
    }
  } else if (enPassant.status && selected[0] === enPassant.pos[0] &&
      selected[1] === enPassant.pos[1] && toX === selected[0] + enPassant.pos[2] &&
      Math.abs(toY - selected[1]) === 1){
    MoveRules.captureEnPassant(toX, selected[1],pieces);
  }
  SpecialMoves.currentSide = SpecialMoves.currentSide === 'w' ? 'b' : 'w';
  SpecialMoves[start[0]].enPassant = {status: false, pos: []};
  if (start === 'w-p' && toY === 0) {
    start = 'w-q';
  } else if (start === 'b-p' && toY === 7) {
    start = 'b-q';
  }
  pieces[toY][toX][0] = start;
  pieces[selected[1]][selected[0]][0] = 'nil';

  emitChange();
}
