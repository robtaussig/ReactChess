self.importScripts('./ai.js');

function findBestMove (board,specMoves,depth) {
  let moves = parseMoveClusters(
                findAllPieces(board,specMoves.currentSide)
                .map(piece=> findAllLegalMovesByPiece(piece,board,specMoves))
              );

  if (moves.length === 0) return {checkmate: true, side: specMoves.currentSide};

  let bestMove = null;
  moves.forEach(move => {
    let currentNode = new BoardNode(move,board,specMoves,depth,0,null,[]);
    // console.log(currentNode.score);
    bestMove = bestMove ?
      (currentNode.score > bestMove.score ?
        currentNode : bestMove) : currentNode;
  });
  debugger
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
  'p': 30,
  'r': 150,
  'b': 90,
  'n': 90,
  'q': 270,
  'k': 1000
};

class BoardNode {
  constructor(move,pieces,specialMoves,depth,score,parent = null, memo = []) {
    this.move = move;
    this.pieces = pieces;
    this.specialMoves = specialMoves;
    this.side = specialMoves.currentSide;
    this.depth = depth - 1;
    this.score = score;
    this.parent = parent;
    this.memo = memo;

    this.evaluateMove();
  }

  evaluateMove () {
    let newBoard = testMove(dupe(this.pieces),this.move[0],this.move[1]);
    let ownPieces = findAllPieces(newBoard,this.side);
    let otherPieces = findAllPieces(newBoard,this.side === 'w' ? 'b' : 'w');
    let materialScore = this.evalMaterial(newBoard, ownPieces, otherPieces);
    let positionalScore = this.evalPosition(newBoard, ownPieces, otherPieces);
    this.score = materialScore + positionalScore;
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

  evalPosition (board, ownPieces, otherPieces) {
    let ownScore = ownPieces
                    .map(piece=> this.evalPiecePositionalValue(piece,board))
                    .reduce((sum,el) => sum + el);
    let otherScore = otherPieces
                    .map(piece=> this.evalPiecePositionalValue(piece,board))
                    .reduce((sum,el) => sum + el);
    // console.log(ownScore,otherScore);
    return ownScore - otherScore;
  }

  evalPiecePositionalValue (piece,board) {
    let value;
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
      value = 0,
      left = posX === 0 ? null : (posX - 1),
      right = posX === 7 ? null : (posX + 1),
      yDir = pawn.side === 'w' ?
        (posY === 0 ? null : (posY - 1)) : (posY === 7 ? null : (posY + 1));

    if (left && yDir) {
      if (board[yDir][left][0][0] === pawn.side &&
        board[yDir][left][0][2] === 'p') {
        value += 15;
      }
    }
    if (right && yDir) {
      if (board[yDir][right][0][0] === pawn.side &&
        board[yDir][right][0][2] === 'p') {
        value += 15;
      }
    }
    value += (
      20 * (0.25 / Math.abs(3.5 - posY) * (Math.abs(3.5 - posX)))
    );
    return value;
  }

  rookPositionalValue (rook,board) {
    let moves = findAllLegalMovesByPiece (rook,board,this.specialMoves);
    return moves.length * 5;
  }

  knightPositionalValue (knight,board) {
    let value = 0;
    let moves = findAllLegalMovesByPiece (knight,board,this.specialMoves);
    moves.forEach(move => {
      value += (
        15 * (0.25 / Math.abs(3.5 - move[1][1]) * (Math.abs(3.5 - move[1][0])))
      );
    });
    return value + moves.length * 5;
  }

  bishopPositionalValue (bishop,board) {
    let value = 0;
    let moves = findAllLegalMovesByPiece (bishop,board,this.specialMoves);

    return moves.length * 5;
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

    [left, posX, right].forEach(xCoord => {
      let testSquare = board[yDir][xCoord][0];
      if (testSquare[0] === king.side) {
        if (testSquare[2] === 'p') {
          value += 30;
        } else {
          value += 20;
        }
      }
    });

    return value;
  }
}
