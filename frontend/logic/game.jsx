import { queenMoves, bishopMoves, rookMoves } from './sliding_pieces.js';
import { knightMoves, kingMoves } from './stepping_pieces.js';

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
  let color = board.pieces[pos[1]][pos[0]][0][0];
  console.log(piece);
  if (piece[2] === 'n') {
    if (board.pieces[toY][toX][0][0] !== color) {
      return knightMoves(pos,toX, toY);
    }
  } else if (piece[2] === 'b') {
    if (checkObstruction(toX, toY)) {
      return bishopMoves(pos,toX, toY);
    }
  } else if (piece[2] === 'r') {
    if (checkObstruction(toX, toY)) {
      return rookMoves(pos,toX, toY);
    }
  } else if (piece[2] === 'q') {
    if (checkObstruction(toX, toY)) {
      return queenMoves(pos,toX, toY);
    }
  } else if (piece[2] === 'k') {
    if (checkObstruction(toX, toY)) {
      return kingMoves(pos,toX, toY);
    }
  } else if (piece[2] === 'p') {
    if (checkPawnCaptures(toX, toY)) {
      return true;
    } else if (checkPawnObstruction(toX, toY)) {
      return pawnMoves(toX, toY);
    }
  }
  return false;
}

function checkPawnCaptures (toX, toY) {
  const [x, y] = board.selectedSquare;
  const color = board.pieces[y][x][0][0];
  const dX = toX - x;
  const dY = toY - y;
  if (color === 'w' && dY > 0 || color === 'b' && dY< 0) {
    return false;
  } else if (Math.abs(dX) === 1 && Math.abs(dY) === 1 &&
    board.pieces[toY][toX][0][0] !== color &&
    board.pieces[toY][toX][0][0] !== 'n') {
      return true;
    }
  return false;
}

function checkPawnObstruction (toX, toY) {
  if (board.pieces[toY][toX][0][0] !== 'n') {
    return false;
  }
  return true;
}

function checkObstruction (toX, toY) {
  const [x, y] = board.selectedSquare;
  const color = board.pieces[y][x][0][0];
  const dX = toX - x;
  const dY = toY - y;
  const xStep = dX / Math.abs(dX);
  const yStep = dY / Math.abs(dY);
  if (dX === 0 && dY !== 0) {
    for (let i = 1; i <= Math.abs(dY);i++) {
      if (board.pieces[y+(yStep*i)][x][0][0] === color ||
        (board.pieces[y+(yStep*i)][x][0][0] !== 'n' && i < Math.abs(dY))) {
        return false;
      }
    }
    return true;
  } else if (dY === 0  && dX !== 0) {
    for (let i = 1; i <= Math.abs(dX);i++) {
      if (board.pieces[y][x+(xStep*i)][0][0] === color ||
        (board.pieces[y][x+(xStep*i)][0][0] !== 'n' && i < Math.abs(dY))) {
        return false;
      }
    }
    return true;
  } else if (Math.abs(dX) / Math.abs(dY) === 1) {
    for (let i = 1; i <= Math.abs(dX);i++) {
      if (board.pieces[y+(yStep*i)][x+(xStep*i)][0][0] === color ||
        (board.pieces[y+(yStep*i)][x+(xStep*i)][0][0] !== 'n' && i < Math.abs(dX))) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}

function pawnMoves (toX, toY) {
  const [x, y] = board.selectedSquare;
  const color = board.pieces[y][x][0][0];
  const dx = color === 'w' ? toX - x : x - toX;
  const dy = color === 'w' ? toY - y : y - toY;
  return (
    (dx === 0 && dy === -1) ||
    (y === 6 && dy === -2 && dx === 0) ||
    (y === 1 && dy === -2 && dx === 0)
  );

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
