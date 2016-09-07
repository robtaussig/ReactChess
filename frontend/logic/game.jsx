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
}

export function canMoveKnight(toX, toY) {
  const [x, y] = board.knightPosition;
  const dx = toX - x;
  const dy = toY - y;
  let pos = board.selected;
  let piece = board.pieces[pos[1]][pos[0]][0];

  return (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
         (Math.abs(dx) === 1 && Math.abs(dy) === 2);
}

export function moveKnight(toX, toY) {
  board.knightPosition = [toX, toY];
  emitChange();
}

export function move(toX, toY) {
  board.knightPosition = [toX, toY];
  emitChange();
}
