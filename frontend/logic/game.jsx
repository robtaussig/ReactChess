import { queenMoves, bishopMoves, rookMoves } from './sliding_pieces.js';
import { knightMoves, kingMoves } from './stepping_pieces.js';

let board = {
  pieces: [
    [['b-r'],['b-n'],['b-b'],['b-q'],['b-k'],['b-b'],['b-n'],['b-r']],
    [['b-p'],['b-p'],['b-p'],['b-p'],['b-p'],['b-p'],['b-p'],['b-p']],
    [['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l']],
    [['b-q'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['w-q']],
    [['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l']],
    [['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l']],
    [['w-p'],['w-p'],['w-p'],['w-p'],['w-p'],['w-p'],['w-p'],['w-p']],
    [['w-r'],['w-n'],['w-b'],['w-q'],['w-k'],['w-b'],['w-n'],['w-r']],
  ],
  selectedSquare: []
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
  board.selectedSquare = piece.pos;
}

export function canMove(toX, toY, pieces = board.pieces, from = board.selectedSquare) {
  if (notInCheck(toX, toY, from)) {
    if (checkMove(toX, toY, pieces, from)) return true;
  }
  return false;
}

function checkPawnCaptures (toX, toY) {
  const [x, y] = board.selectedSquare;
  const color = board.pieces[y][x][0][0];
  const dX = toX - x;
  const dY = toY - y;
  if (color === 'w' && dY > 0 || color === 'b' && dY< 0) {
    return false;
  } else if (Math.abs(dX) === 1 && Math.abs(dY) === 1 &&
    board.pieces[toY][toX][0][0] !== color &&
    board.pieces[toY][toX][0][0] !== 'n') {
      return true;
    }
  return false;
}

function notInCheck (toX, toY, from = board.selectedSquare) {
  let color = board.pieces[from[1]][from[0]][0][0];
  let testBoard = dupe(board.pieces);
  let afterMove = testMove(testBoard, from, [toX, toY]);
  let king = findKing(afterMove,color);
  if (findAttackers(king,afterMove,color==='w'?'b':'w')) {
    return false;
  } else {
    return true;
  }
}

function findAttackers (king, testBoard, enemyColor) {
  for (let i=0;i<testBoard.length;i++) {
    for (let j=0;j<testBoard[i].length;j++) {
      let piece = testBoard[j][i][0];
      if (piece[0] === enemyColor && king && piece[2] !== 'p' && piece[2] !== 'n') {
        if(checkObstruction(king[1], king[0], [i, j], testBoard)) {
          if (i === king[1] || j === king[0]) {
            if (piece[2] === 'q' || piece[2] === 'r') {
              return true;
            } else {
              return false;
            }
          } else {
            if (piece[2] === 'q' || piece[2] === 'b') {
              return true;
            } else {
              return false;
            }
          }
        }
      }
    }
  }
  return false;
}

function threatenedKing (moves, king) {
  for (let i=0; i<moves.length;i++) {
    if (JSON.stringify(moves[i]) === JSON.stringify(king)) return true;
  }
  return false;
}

function testMove (testBoard, from, to) {
  let selected = from;
  let start = testBoard[selected[1]][selected[0]][0];
  testBoard[to[1]][to[0]][0] = start;
  testBoard[selected[1]][selected[0]][0] = 'nil';
  return testBoard;
}

function dupe (array) {
  const duped = [[],[],[],[],[],[],[],[]];
  for (let i=0;i<array.length;i++) {
    for (let j=0;j<array[i].length;j++) {
      let piece = `${array[i][j][0][0]}-${array[i][j][0][2]}`;
      duped[i].push([piece]);
    }
  }
  return duped;
}

function findKing (afterMove,color) {
  const target = `${color}-k`;
  for (let i=0; i<=7;i++) {
    for (let j=0; j<=7;j++) {
      if (afterMove[i][j][0] === target) {
        return [i, j];
      }
    }
  }
}

function findAllPieces (afterMove,color) {
  const allPieces = [];
  for (let i=0; i<=7;i++) {
    for (let j=0; j<=7;j++) {
      if (afterMove[i][j][0][0] === color) {
        allPieces.push([j, i]);
      }
    }
  }
  return allPieces;
}

function findLegalMoves (afterMove, pieces) {
  const legalMoves = [];
  pieces.forEach(piece => {
    legalMovesByPiece(afterMove,piece).forEach(el=>legalMoves.push(el));
  });
  return legalMoves;
}

function legalMovesByPiece (afterMove,piece) {
  const legalPieceMoves = [];
  for (let i=0; i<=7;i++) {
    for (let j=0; j<=7;j++) {
      if (checkMove(j, i, afterMove, piece)) {
        legalPieceMoves.push([j, i]);
      }
    }
  }
  return legalPieceMoves;
}

function checkMove (toX, toY, afterMove, from) {
  let pos = from;
  let piece = afterMove[pos[1]][pos[0]][0];
  let color = afterMove[pos[1]][pos[0]][0][0];
  if (piece[2] === 'n') {
    if (afterMove[toY][toX][0][0] !== color) {
      return knightMoves(pos,toX, toY);
    }
  } else if (piece[2] === 'b') {
    if (checkObstruction(toX, toY)) {
      return bishopMoves(pos,toX, toY);
    }
  } else if (piece[2] === 'r') {
    if (checkObstruction(toX, toY)) {
      return rookMoves(pos,toX, toY);
    }
  } else if (piece[2] === 'q') {
    if (checkObstruction(toX, toY)) {
      return queenMoves(pos,toX, toY);
    }
  } else if (piece[2] === 'k') {
    if (checkObstruction(toX, toY)) {
      return kingMoves(pos,toX, toY);
    }
  } else if (piece[2] === 'p') {
    if (checkPawnCaptures(toX, toY)) {
      return true;
    } else if (checkPawnObstruction(toX, toY)) {
      return pawnMoves(toX, toY);
    }
  }
}

function checkPawnObstruction (toX, toY) {
  if (board.pieces[toY][toX][0][0] !== 'n') {
    return false;
  }
  return true;
}

function checkObstruction (toX, toY, from = board.selectedSquare, pieces = board.pieces) {
  const [x, y] = from;
  const color = pieces[y][x][0][0];
  const dX = toX - x;
  const dY = toY - y;
  const xStep = dX / Math.abs(dX);
  const yStep = dY / Math.abs(dY);
  if (dX === 0 && dY !== 0) {
    for (let i = 1; i <= Math.abs(dY);i++) {
      if (pieces[y+(yStep*i)][x][0][0] === color ||
        (pieces[y+(yStep*i)][x][0][0] !== 'n' && i < Math.abs(dY))) {
        return false;
      }
    }
    return true;
  } else if (dY === 0  && dX !== 0) {
    for (let i = 1; i <= Math.abs(dX);i++) {
      if (pieces[y][x+(xStep*i)][0][0] === color ||
        (pieces[y][x+(xStep*i)][0][0] !== 'n' && i < Math.abs(dY))) {
        return false;
      }
    }
    return true;
  } else if (Math.abs(dX) / Math.abs(dY) === 1) {
    for (let i = 1; i <= Math.abs(dX);i++) {
      if (pieces[y+(yStep*i)][x+(xStep*i)][0][0] === color ||
        (pieces[y+(yStep*i)][x+(xStep*i)][0][0] !== 'n' && i < Math.abs(dX))) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}

function pawnMoves (toX, toY) {
  const [x, y] = board.selectedSquare;
  const color = board.pieces[y][x][0][0];
  const dx = color === 'w' ? toX - x : x - toX;
  const dy = color === 'w' ? toY - y : y - toY;
  return (
    (dx === 0 && dy === -1) ||
    (y === 6 && dy === -2 && dx === 0) ||
    (y === 1 && dy === -2 && dx === 0)
  );
}

export function move(toX, toY) {
  let selected = board.selectedSquare;
  let start = board.pieces[selected[1]][selected[0]][0];
  board.pieces[toY][toX][0] = start;
  board.pieces[selected[1]][selected[0]][0] = 'nil';

  emitChange();
}
