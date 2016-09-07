import { queenMoves, bishopMoves, rookMoves } from './sliding_pieces.js';
import { knightMoves, pawnMoves, kingMoves } from './stepping_pieces.js';

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
  observer(board);
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

export function canMove(toX, toY) {
  let pos = board.selectedSquare;
  let piece = board.pieces[pos[1]][pos[0]][0];
  console.log(piece);
  if (piece[2] === 'n') {
    return knightMoves(pos,toX, toY);
  } else if (piece[2] === 'b') {
    return bishopMoves(pos,toX, toY);
  } else if (piece[2] === 'r') {
    return rookMoves(toX, toY);
  } else if (piece[2] === 'q') {
    return queenMoves(toX, toY);
  } else if (piece[2] === 'k') {
    return kingMoves(toX, toY);
  } else if (piece[2] === 'p') {
    return pawnMoves(toX, toY);
  }
}

export function move(toX, toY) {
  let selected = board.selectedSquare;
  console.log(selected);
  let start = board.pieces[selected[1]][selected[0]][0];
  console.log(start);
  board.pieces[toY][toX][0] = start;
  board.pieces[selected[1]][selected[0]][0] = 'nil';

  emitChange();
}
