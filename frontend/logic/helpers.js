// function findAllPieces (afterMove,color) {
//   const allPieces = [];
//   for (let i=0; i<=7;i++) {
//     for (let j=0; j<=7;j++) {
//       if (afterMove[i][j][0][0] === color) {
//         allPieces.push([j, i]);
//       }
//     }
//   }
//   return allPieces;
// }

// function findLegalMoves (afterMove, pieces) {
//   const legalMoves = [];
//   pieces.forEach(piece => {
//     legalMovesByPiece(afterMove,piece).forEach(el=>legalMoves.push(el));
//   });
//   return legalMoves;
// }

// function threatenedKing (moves, king) {
//   for (let i=0; i<moves.length;i++) {
//     if (JSON.stringify(moves[i]) === JSON.stringify(king)) return true;
//   }
//   return false;
// }

// function legalMovesByPiece (afterMove,piece) {
//   const legalPieceMoves = [];
//   for (let i=0; i<=7;i++) {
//     for (let j=0; j<=7;j++) {
//       if (checkMove(j, i, afterMove, piece)) {
//         legalPieceMoves.push([j, i]);
//       }
//     }
//   }
//   return legalPieceMoves;
// }
