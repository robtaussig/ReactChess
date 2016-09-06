let board = {
  knightPosition: [4,4]
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

export function canMoveKnight(toX, toY) {
  const [x, y] = board.knightPosition;
  const dx = toX - x;
  const dy = toY - y;

  return (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
         (Math.abs(dx) === 1 && Math.abs(dy) === 2);
}

export function moveKnight(toX, toY) {
  board.knightPosition = [toX, toY];
  emitChange();
}
