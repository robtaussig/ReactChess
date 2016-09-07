module.exports = {

  bishopMoves (selected, toX, toY) {
    let [x, y] = selected;
    let dx = toX - x;
    let dy = toY - y;
    return (Math.abs(dx) / Math.abs(dy) === 1);
  },

  rookMoves (selected, toX, toY) {
    let [x, y] = selected;
    let dx = toX - x;
    let dy = toY - y;
    return (dx === 0 && dy !== 0|| dy === 0 && dx !== 0);
  },

  queenMoves (selected, toX, toY) {
    let [x, y] = selected;
    let dx = toX - x;
    let dy = toY - y;
    return (Math.abs(dx) / Math.abs(dy) === 1) ||
    (dx === 0 && dy !== 0|| dy === 0 && dx !== 0);
  }
};
