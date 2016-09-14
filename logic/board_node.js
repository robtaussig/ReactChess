const Ai = require('./ai.js');

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
    this.pieces = pieces;
    this.specialMoves = specialMoves;
    this.side = specialMoves.currentSide;
    this.depth = depth;
    this.checkmate = false;
    this.score = this.evaluateMove();
  }

  evaluateMove () {
    let newBoard = Ai.testMove(Ai.dupe(this.pieces),this.move[0],this.move[1]);
    let ownPieces = Ai.findAllPieces(newBoard,this.side);
    let otherPieces = Ai.findAllPieces(newBoard,this.side === 'w' ? 'b' : 'w');
    let materialScore = this.evalMaterial(newBoard, ownPieces, otherPieces);
    let positionalScore = this.evalPosition(newBoard, ownPieces);
    let tacticScore = this.evalTactics(newBoard, ownPieces, otherPieces);
    return materialScore + positionalScore + tacticScore;
  }

  evalTactics (ownPieces, otherPieces) {
    let tacticScore = 0;
    tacticScore += this.evalDoubleAttacks(this.pieces,otherPieces);
    this.evalCheckmate();
    return tacticScore;
  }

  evalCheckmate () {
    let moves = Ai.parseMoveClusters(
                  Ai.findAllPieces(this.pieces,this.side === 'w' ? 'b' : 'w')
                  .map(piece=> Ai.findAllLegalMovesByPiece(piece,this.pieces,this.specialMoves))
                );
    if (moves.length === 0) {
      this.checkmate = true;
    }
  }

  evalDoubleAttacks(board,otherPieces) {
    let attackedPieces = [];
    otherPieces.forEach(piece => {
      let lvA = this.leastValuableAttacker(board,piece);
      if (lvA > 0) {
        let defended = this.defended(board,piece);
        let score = PIECE_VALUES[piece.type];
          attackedPieces.push([score - lvA * defended]);
      }
    });
    let sorted = attackedPieces.sort((a,b)=>b-a);
    let secondBestAttack = sorted[1] || 0;
    return Math.max(secondBestAttack,0);
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
    return ownScore;
  }

  defended (board, piece) {
    //Can use the findAttacker method but with own side to check for defended status
    let defended = Ai.findAttackers(piece.pos, board, piece.side, true)[0];
    if (defended) {
      return 1;
    } else {
      return 0;
    }
  }

  leastValuableAttacker (board, piece) {
    let lvA = Ai.findAttackers (piece.pos, board, piece.side === 'w' ? 'b' : 'w', false);
    if (lvA[0] && lvA[0][0]) {
      return PIECE_VALUES[lvA[0][1]];
    } else {
      return 0;
    }
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
      30 * (0.25 / (Math.abs(3.5 - posY) * (Math.abs(3.5 - posX))))
    );
    let lvA = this.leastValuableAttacker (board, pawn);
    if (lvA > 0) {
      value -= Math.max(PIECE_VALUES[pawn.type] - lvA * (this.defended(board,pawn)),0);
    }

    return value;
  }

  rookPositionalValue (rook,board) {
    let moves = Ai.findAllLegalMovesByPiece (rook,board,this.specialMoves);
    let value = 0;

    let lvA = this.leastValuableAttacker (board, rook);
    if (lvA > 0) {
      value -= Math.max(PIECE_VALUES[rook.type] - lvA * (this.defended(board,rook)),0);
    }
    return moves.length * 5 + value;
  }

  knightPositionalValue (knight,board) {
    let value = 0;
    let moves = Ai.findAllLegalMovesByPiece (knight,board,this.specialMoves);
    moves.forEach(move => {
      value += (
        12 * (0.25 / Math.abs(3.5 - move[1][1]) * (Math.abs(3.5 - move[1][0])))
      );
    });
    let lvA = this.leastValuableAttacker (board, knight);
    if (lvA > 0) {
      value -= Math.max(PIECE_VALUES[knight.type] - lvA * (this.defended(board,knight)),0);
    }
    if (this.defended(board,knight)) {
      value += 25;
    }
    return value;
  }

  bishopPositionalValue (bishop,board) {
    let value = 0;
    let moves = Ai.findAllLegalMovesByPiece (bishop,board,this.specialMoves);
    let lvA = this.leastValuableAttacker (board, bishop);
    if (lvA > 0) {
      value -= Math.max(PIECE_VALUES[bishop.type] - lvA * (this.defended(board,bishop)),0);
    }
    if (this.defended(board,bishop)) {
      value += 25;
    }
    return moves.length * 8 + value;
  }

  queenPositionalValue (queen,board) {
    let value = 0;
    let moves = Ai.findAllLegalMovesByPiece (queen,board,this.specialMoves);
    let lvA = this.leastValuableAttacker (board, queen);
    if (lvA > 0) {
      value -= Math.max(PIECE_VALUES[queen.type] - lvA * (this.defended(board,queen)),0);
    }

    return moves.length * 2 + value;
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

module.exports = BoardNode;
