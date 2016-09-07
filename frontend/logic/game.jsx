import { queenMoves, bishopMoves, rookMoves } from './sliding_pieces.js';
import { knightMoves, kingMoves } from './stepping_pieces.js';
const SpecialMoves = require('./special_moves');

let board = {
  pieces: [
    [['b-r'],['b-n'],['b-b'],['b-q'],['b-k'],['b-b'],['b-n'],['b-r']],
    [['b-p'],['b-p'],['b-p'],['b-p'],['b-p'],['b-p'],['b-p'],['b-p']],
    [['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l']],
    [['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l']],
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
  if (notInCheck(toX, toY, from) && pieces[from[1]][from[0]][0][0] === SpecialMoves.currentSide) {
    if (checkMove(toX, toY, pieces, from)) return true;
  }
  return false;
}

function checkPawnCaptures (toX, toY, pawn = board.selectedSquare, pieces = board.pieces) {
  const [x, y] = pawn;
  const color = pieces[y][x][0][0];
  const oppColor = color === 'w' ? 'b' : 'w';
  const dX = toX - x;
  const dY = toY - y;
  const enPassant = SpecialMoves[color].enPassant;
  if (color === 'w' && dY > 0 || color === 'b' && dY< 0) {
    return false;
  } else if (Math.abs(dX) === 1 && Math.abs(dY) === 1 &&
    pieces[toY][toX][0][0] !== color &&
    pieces[toY][toX][0][0] !== 'n') {
      return true;
    } else if (enPassant.status) {
      if (pawn[0] === enPassant.pos[0] && pawn[1] === enPassant.pos[1] &&
        toX === x + enPassant.pos[2] && Math.abs(dY) === 1) {
          return true;
      }
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
       else if (piece[2] === 'p' && king && Math.abs(j - king[0]) === 1 &&
          Math.abs(i - king[1]) === 1 && piece[0] === enemyColor) {
        return true;
      } else if (piece[2] === 'n' && king && piece[0] === enemyColor &&
          knightMoves([i, j],king[1], king[0])) {
        return true;
      }
    }
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
      if (checkCastle(pos, toX, toY)) {
        return true;
      } else {
        return kingMoves(pos,toX, toY);
      }
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

function checkCastle (pos, toX, toY) {
  let king = [pos[1],pos[0]];
  let color = board.pieces[pos[1]][pos[0]][0][0];
  if (toX === 2 && toY === pos[1] && checkObstruction(toX - 1, toY) &&
      notInCheck(toX + 1, toY, pos) &&
      !findAttackers(king, board.pieces, color === 'w' ? 'b' : 'w')) {
    return SpecialMoves[color].castleQueenSideStatus;
  } else if (toX === 6 && toY === pos[1] && checkObstruction(toX, toY) &&
      notInCheck(toX - 1, toY, pos) &&
      !findAttackers(king, board.pieces, color === 'w' ? 'b' : 'w')) {
    return SpecialMoves[color].castleKingSideStatus;
  }
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

function castleRook (toX, toY) {
  move(toX, toY, toX > 4 ? [7, toY] : [0, toY]);
  SpecialMoves.currentSide = SpecialMoves.currentSide === 'w' ? 'b' : 'w';
}

function checkEnPassant (toX, toY, from) {
  const [x, y] = board.selectedSquare;
  const color = board.pieces[y][x][0][0];
  const oppColor = color === 'w' ? 'b' : 'w';
  const rightSide = toX < 7 ? board.pieces[toY][toX + 1][0] : ['n-l'];
  const leftSide = toX > 0 ? board.pieces[toY][toX - 1][0] : ['n-l'];
  SpecialMoves[oppColor].enPassant = {status: false, pos: []};
  if (leftSide[2] === 'p' && leftSide[0] === oppColor) {
    SpecialMoves[oppColor].enPassant = {status: true, pos: [toX - 1, toY, 1]};
  } else if (rightSide[2] === 'p' && rightSide[0] === oppColor) {
    SpecialMoves[oppColor].enPassant = {status: true, pos: [toX + 1, toY, -1]};
  }
}

function captureEnPassant (x, y) {
  board.pieces[y][x][0] = 'nil';
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

export function move(toX, toY, from = board.selectedSquare) {
  let selected = from;
  let start = board.pieces[selected[1]][selected[0]][0];
  let enPassant = SpecialMoves[start[0]].enPassant;
  if (start[2] === 'p' && Math.abs(selected[1] - toY) === 2) {
    checkEnPassant(toX, toY, selected);
  } else if (start[2] === 'k') {
    if (Math.abs(toX - selected[0]) === 2) {
      castleRook(toX > selected[0] ? 5 : 3, selected[1]);
    }
    SpecialMoves[start[0]].castleKingSideStatus = false;
    SpecialMoves[start[0]].castleQueenSideStatus = false;
  } else if (start[2] === 'r') {
    if (selected[0] === 0) {
      SpecialMoves[start[0]].castleQueenSideStatus = false;
    } else if (selected[0] === 7) {
      SpecialMoves[start[0]].castleKingSideStatus = false;
    }
  } else if (enPassant.status && selected[0] === enPassant.pos[0] &&
      selected[1] === enPassant.pos[1] && toX === selected[0] + enPassant.pos[2] &&
      Math.abs(toY - selected[1]) === 1){
    captureEnPassant(toX, selected[1]);
  }
  SpecialMoves.currentSide = SpecialMoves.currentSide === 'w' ? 'b' : 'w';
  SpecialMoves[start[0]].enPassant = {status: false, pos: []};
  board.pieces[toY][toX][0] = start;
  board.pieces[selected[1]][selected[0]][0] = 'nil';

  emitChange();
}
