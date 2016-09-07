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
  selectedSquare: [],
  knightPosition: [3,7]
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
  board.selected = piece.pos;
  console.log(board.selected);
}

export function canMove(toX, toY) {
  let pos = board.selected;
  let piece = board.pieces[pos[1]][pos[0]][0];
  console.log(piece);
  if (piece[2] === 'n') {
    return knightMoves(toX, toY);
  }
}

function knightMoves(toX, toY) {
  const [x, y] = board.selected;
  const dx = toX - x;
  const dy = toY - y;
  return (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
         (Math.abs(dx) === 1 && Math.abs(dy) === 2);
}

export function move(toX, toY) {
  let selected = board.selected;
  console.log(selected);
  let start = board.pieces[selected[1]][selected[0]][0];
  console.log(start);
  board.pieces[toY][toX][0] = start;
  board.pieces[selected[1]][selected[0]][0] = 'nil';

  emitChange();
}
