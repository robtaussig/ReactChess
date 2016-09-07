module.exports = {

  knightMoves (selected,toX, toY) {
    const [x, y] = selected;
    const dx = toX - x;
    const dy = toY - y;
    return (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
           (Math.abs(dx) === 1 && Math.abs(dy) === 2);
  },

  kingMoves (selected, toX, toY) {

  },

  pawnMoves (selected, toX, toY) {

  }

};
