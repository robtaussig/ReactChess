module.exports = {

  bishopMoves (selected, toX, toY) {
    let fromX = selected[0];
    let fromY = selected[1];
    return Math.abs(toX - fromX) === Math.abs(toY - fromY);
  },

  rookMoves (selected, toX, toY) {

  },

  queenMoves (selected, toX, toY) {

  }
};
