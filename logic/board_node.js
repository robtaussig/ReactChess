self.importScripts('./ai.js');

function findBestMove(board,specMoves,depth) {
  let moves = parseMoveClusters(
    findAllPieces(board,specMoves.currentSide)
      .map(piece=>{
        return findAllLegalMovesByPiece(piece,board,specMoves);
      }
    )
  );

  if (moves.length === 0) return {checkmate: true, side: specMoves.currentSide};
  let bestMove = null;
  moves.forEach(move => {
    let currentNode = new BoardNode(move,board,specMoves,depth,0,null,[]);
    bestMove = bestMove ?
      (currentNode.score > bestMove.score ?
        currentNode : bestMove) : currentNode;
  });
}

function findAllPieces(board,color) {
  let returnPieces = [];
  board.forEach((row,i)=>{
    row.forEach((square,j)=>{
      let testSquare = parseSquare(board,i,j);
      if (testSquare.color === color) {
        returnPieces.push(testSquare);
      }
    });
  });
  return returnPieces;
}

function findAllLegalMovesByPiece(piece,board,specMoves) {
  let allMoves = [];
  for (let i=0;i<8;i++) {
    for (let j=0;j<8;j++) {
      if (canMove(j,i,board,piece.pos,specMoves)){
        allMoves.push([[piece.pos[0],piece.pos[1]],[j,i]]);
      }
    }
  }
  return allMoves;
}

function parseMoveClusters (array) {
  let result = [];
  array.forEach(subArray => {
    subArray.forEach(move => {
      result.push(move);
    });
  });
  return result;
}

function parseSquare (pieces, y, x) {
  let pieceInfo = {
    color: pieces[y][x][0][0],
    type: pieces[y][x][0][2],
    pos: [x,y]
  };
  return pieceInfo;
}

class BoardNode {
  constructor(move,pieces,specialMoves,depth,score,parent = null, memo = []) {
    this.move = move;
    this.pieces = pieces;
    this.specialMoves = specialMoves;
    this.side = specialMoves.side;
    this.depth = depth - 1;
    this.score = score;
    this.parent = parent;
    this.memo = memo;

    this.evaluateMove();
  }

  evaluateMove () {
    // let newBoard = testMove(dupe(this.pieces),this.move[0],this.move[1]);
    // let materialScore = this.evalMaterial(newBoard);
    // let positionalScore = this.evalPosition(newBoard);
  }

  evalMaterial (newBoard) {

  }
}
