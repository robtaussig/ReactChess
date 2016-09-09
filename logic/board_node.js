self.importScripts('./ai.js');

function findBestMove (board,specMoves,depth) {
  let moves = parseMoveClusters(
                findAllPieces(board,specMoves.currentSide)
                .map(piece=> findAllLegalMovesByPiece(piece,board,specMoves))
              );

  if (moves.length === 0) return {checkmate: true, side: specMoves.currentSide};

  let bestMove = null;
  moves.forEach(move => {
    let currentNode = new BoardNode(move,board,specMoves,depth);
    console.log(currentNode.score);
    bestMove = bestMove ?
      (currentNode.score > bestMove.score ?
        currentNode : bestMove) : currentNode;
  });
  console.log(bestMove.score);
  return {move: bestMove.move};
}

function findAllPieces (board,color) {
  let returnPieces = [];
  board.forEach((row,i)=>{
    row.forEach((square,j)=>{
      let testSquare = parseSquare(board,i,j);
      if (testSquare.side === color) {
        returnPieces.push(testSquare);
      }
    });
  });
  return returnPieces;
}

function findAllLegalMovesByPiece (piece,board,specMoves) {
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
    side: pieces[y][x][0][0],
    type: pieces[y][x][0][2],
    pos: [x,y],
    defended: false
  };
  return pieceInfo;
}

const PIECE_VALUES = {
  'p': 100,
  'r': 500,
  'b': 300,
  'n': 300,
  'q': 900,
  'k': 10000
};

class BoardNode {
  constructor(move,pieces,specialMoves,depth) {
    this.move = move;
    this.board = testMove(dupe(pieces),move[0],move[1]);
    this.specialMoves = specialMoves;
    this.side = specialMoves.currentSide;
    this.score = this.alphaBetaMax(-1/0, 1/0, depth, this.board, this.side);
  }

  // beginEval () {
  //
    // let ownPieces = findAllPieces(this.newBoard,this.side);
    // let otherPieces = findAllPieces(this.newBoard,this.side === 'w' ? 'b' : 'w');
    // let materialScore = this.evalMaterial(this.newBoard, ownPieces, otherPieces);
    // let positionalScore = this.evalPosition(this.newBoard, ownPieces);
    // this.score += materialScore + positionalScore;
  // }

  evaluate (board, side) {
    let ownPieces = findAllPieces(board,side);
    let otherPieces = findAllPieces(board,side === 'w' ? 'b' : 'w');
    let materialScore = this.evalMaterial(board, ownPieces, otherPieces);
    let positionalScore = this.evalPosition(board, ownPieces);
    return materialScore + positionalScore;
  }

  alphaBetaMax(alpha, beta, depthLeft, board, side ) {
    if ( depthLeft === 0 ) {
      return this.evaluate(board, side);
    }

    let moves = parseMoveClusters(
                findAllPieces(board,side)
                .map(piece=> findAllLegalMovesByPiece(piece,board,this.specialMoves))
              );

    for (let move of moves) {
      this.nodes += 1;
      let newBoard = testMove(dupe(board),move[0],move[1]);
      let score = this.alphaBetaMin(
        alpha, beta, depthLeft - 1, newBoard, side === 'w' ? 'b' : 'w'
      );
      if ( score >= beta ) {
        return beta;   // fail hard beta-cutoff
      }
      if ( score > alpha ) {
        alpha = score; // alpha acts like max in MiniMax
      }
    }
    return alpha;
  }

  alphaBetaMin( alpha, beta, depthLeft, board, side ) {
     if ( depthLeft === 0 ) {
       return -this.evaluate(board, side);
     }

     let moves = parseMoveClusters(
                 findAllPieces(board,side)
                 .map(piece=> findAllLegalMovesByPiece(piece,board,this.specialMoves))
               );

     for ( let move of moves) {
       let newBoard = testMove(dupe(board),move[0],move[1]);
       let score = this.alphaBetaMax(
         alpha, beta, depthLeft - 1, newBoard, side === 'w' ? 'b' : 'w'
       );
       if ( score <= alpha ) {
         return alpha; // fail hard alpha-cutoff
       }
       if( score < beta ) {
         beta = score; // beta acts like min in MiniMax
       }
     }
     return beta;
  }

  // negaMax (depth) {
  //   if (depth === 0) {
  //     return this.evaluate(this.pieces);
  //   }
  //   let max = -1/0;
  //
  // }

  createTree () {
    let responseNodes =
      parseMoveClusters(
        findAllPieces(this.newBoard,this.specialMoves.currentSide)
          .map(piece => {
            return findAllLegalMovesByPiece(piece,this.newBoard,this.specialMoves);
      })).map(response => {
            return new BoardNode(response,
              this.newBoard,
              this.specialMoves,
              this.depth,
              -this.score,
              this,
              this.memo
            );
          });
  }

  evalMaterial (board, ownPieces, otherPieces) {
    let ownScore =  ownPieces
                    .map(piece => PIECE_VALUES[piece.type])
                    .reduce((sum,el) => sum + el);

    let otherScore = otherPieces
                      .map(piece => PIECE_VALUES[piece.type])
                      .reduce((sum,el) => sum + el);

    return ownScore - otherScore;
  }

  evalPosition (board, ownPieces) {
    let ownScore = ownPieces
                    .map(piece=> this.evalPiecePositionalValue(piece,board))
                    .reduce((sum,el) => sum + el);
    // console.log(ownScore,otherScore);
    return ownScore;
  }

  evalPiecePositionalValue (piece,board) {
    let value = 0;
    switch (piece.type) {
      case 'p':
        value = this.pawnPositionalValue(piece,board);
        break;
      case 'r':
        value = this.rookPositionalValue(piece,board);
        break;
      case 'n':
        value = this.knightPositionalValue(piece,board);
        break;
      case 'b':
        value = this.bishopPositionalValue(piece,board);
        break;
      case 'q':
        value = this.queenPositionalValue(piece,board);
        break;
      case 'k':
        value = this.kingPositionalValue(piece,board);
        break;
      default:

    }
    return value;
  }

  pawnPositionalValue (pawn,board) {
    let posX = pawn.pos[0],
      posY = pawn.pos[1],
      value = 0;

    value += (
      20 * (0.25 / (Math.abs(3.5 - posY) * (Math.abs(3.5 - posX))))
    );
    return value;
  }

  rookPositionalValue (rook,board) {
    let moves = findAllLegalMovesByPiece (rook,board,this.specialMoves);
    return moves.length * 10;
  }

  knightPositionalValue (knight,board) {
    let value = 0;
    let moves = findAllLegalMovesByPiece (knight,board,this.specialMoves);
    moves.forEach(move => {
      value += (
        10 * (0.25 / Math.abs(3.5 - move[1][1]) * (Math.abs(3.5 - move[1][0])))
      );
    });
    return value;
  }

  bishopPositionalValue (bishop,board) {
    let value = 0;
    let moves = findAllLegalMovesByPiece (bishop,board,this.specialMoves);

    return moves.length * 10;
  }

  queenPositionalValue (queen,board) {
    let value = 0;
    let moves = findAllLegalMovesByPiece (queen,board,this.specialMoves);

    return moves.length * 5;
  }

  kingPositionalValue (king,board) {
    let posX = king.pos[0],
      posY = king.pos[1],
      value = 0,
      left = posX === 0 ? null : (posX - 1),
      right = posX === 7 ? null : (posX + 1),
      yDir = king.side === 'w' ?
      (posY === 0 ? null : (posY - 1)) : (posY === 7 ? null : (posY + 1));
    [left, posX, right].filter(el=>el).forEach(xCoord => {
      let testSquare = board[yDir][xCoord][0];
      if (testSquare[0] === king.side) {
        if (testSquare[2] === 'p') {
          value += 30;
        } else {
          value += 20;
        }
      }
    });
    if ((king.pos[0] === 6) || (king.pos[0] === 2)) {
      value += 100;
    }
    return value;
  }
}
