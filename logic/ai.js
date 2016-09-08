let specialMoves;

//pieces = Array(8); specMoves = {currentSide,w:castleQueenSideStatus,castleKingSideStatus,enPassant,b:}

// pieces: [
//   [['b-r'],['b-n'],['b-b'],['b-q'],['b-k'],['b-b'],['b-n'],['b-r']],
//   [['b-p'],['b-p'],['b-p'],['b-p'],['b-p'],['b-p'],['b-p'],['b-p']],
//   [['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l']],
//   [['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l']],
//   [['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l']],
//   [['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l'],['n-l']],
//   [['w-p'],['w-p'],['w-p'],['w-p'],['w-p'],['w-p'],['w-p'],['w-p']],
//   [['w-r'],['w-n'],['w-b'],['w-q'],['w-k'],['w-b'],['w-n'],['w-r']],
// ]

function canMove(toX, toY, pieces, from,specMoves) {
  specialMoves = specMoves;
  if (notInCheck(toX, toY, from, pieces)) {
    if (checkMove(toX, toY, pieces, from)) return true;
  }
  return false;
}

function bishopMoves (selected, toX, toY) {
  let [x, y] = selected;
  let dx = toX - x;
  let dy = toY - y;
  return (Math.abs(dx) / Math.abs(dy) === 1);
}

function rookMoves (selected, toX, toY) {
  let [x, y] = selected;
  let dx = toX - x;
  let dy = toY - y;
  return (dx === 0 && dy !== 0|| dy === 0 && dx !== 0);
}

function queenMoves (selected, toX, toY) {
  let [x, y] = selected;
  let dx = toX - x;
  let dy = toY - y;
  return (Math.abs(dx) / Math.abs(dy) === 1) ||
  (dx === 0 && dy !== 0|| dy === 0 && dx !== 0);
}

function knightMoves (selected,toX, toY) {
  const [x, y] = selected;
  const dx = toX - x;
  const dy = toY - y;
  return (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
         (Math.abs(dx) === 1 && Math.abs(dy) === 2);
}

function kingMoves (selected, toX, toY) {
  const [x, y] = selected;
  const dx = toX - x;
  const dy = toY - y;
  return (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) &&
         (Math.abs(dx) + Math.abs(dy) > 0);
}

function checkPawnCaptures (toX, toY, pawn, pieces) {
  const [x, y] = pawn;
  const color = pieces[y][x][0][0];
  const oppColor = color === 'w' ? 'b' : 'w';
  const dX = toX - x;
  const dY = toY - y;
  const enPassant = specialMoves[color].enPassant;
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

function notInCheck (toX, toY, from, pieces) {
  let color = pieces[from[1]][from[0]][0][0];
  let testBoard = dupe(pieces);
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
  testBoard[selected[1]][selected[0]][0] = 'n-l';
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

function findKing (pieces,color) {
  const target = `${color}-k`;
  for (let i=0; i<=7;i++) {
    for (let j=0; j<=7;j++) {
      if (pieces[i][j][0] === target) {
        return [i, j];
      }
    }
  }
}

function checkMove (toX, toY, pieces, from) {
  let pos = from;
  let piece = pieces[pos[1]][pos[0]][0];
  let color = pieces[pos[1]][pos[0]][0][0];
  if (piece[2] === 'n') {
    if (pieces[toY][toX][0][0] !== color) {
      return knightMoves(pos,toX, toY);
    }
  } else if (piece[2] === 'b') {
    if (checkObstruction(toX, toY, pos, pieces)) {
      return bishopMoves(pos,toX, toY);
    }
  } else if (piece[2] === 'r') {
    if (checkObstruction(toX, toY, pos, pieces)) {
      return rookMoves(pos,toX, toY);
    }
  } else if (piece[2] === 'q') {
    if (checkObstruction(toX, toY, pos, pieces)) {
      return queenMoves(pos,toX, toY);
    }
  } else if (piece[2] === 'k') {
    if (checkObstruction(toX, toY, pos, pieces)) {
      if (checkCastle(pos, toX, toY, pieces)) {
        return true;
      } else {
        return kingMoves(pos,toX, toY);
      }
    }
  } else if (piece[2] === 'p') {
    if (checkPawnCaptures(toX, toY, pos, pieces)) {
      return true;
    } else if (checkPawnObstruction(toX, toY, pieces)) {
      return pawnMoves(toX, toY, pos, pieces);
    }
  }
}

function checkPawnObstruction (toX, toY, pieces) {
  if (pieces[toY][toX][0][0] !== 'n') {
    return false;
  }
  return true;
}

function checkCastle (pos, toX, toY, pieces) {
  let king = [pos[1],pos[0]];
  let color = pieces[pos[1]][pos[0]][0][0];
  if (toX === 2 && toY === pos[1] && checkObstruction(toX - 1, toY, pos, pieces) &&
      notInCheck(toX + 1, toY, pos, pieces) &&
      !findAttackers(king, pieces, color === 'w' ? 'b' : 'w')) {
    return specialMoves[color].castleQueenSideStatus;
  } else if (toX === 6 && toY === pos[1] && checkObstruction(toX, toY, pos, pieces) &&
      notInCheck(toX - 1, toY, pos, pieces) &&
      !findAttackers(king, pieces, color === 'w' ? 'b' : 'w')) {
    return specialMoves[color].castleKingSideStatus;
  }
}

function checkObstruction (toX, toY, from, pieces) {
  const [x, y] = from;
  const color = pieces[y][x][0][0];
  const dX = toX - x;
  const dY = toY - y;
  const xStep = dX / Math.abs(dX) || 0;
  const yStep = dY / Math.abs(dY) || 0;
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
        (pieces[y][x+(xStep*i)][0][0] !== 'n' && i < Math.abs(dX))) {
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

function castleRook (toX, toY, pieces) {
  let start = toX > 4 ? [7, toY] : [0, toY];
  let piece = pieces[start[1]][start[0]][0];
  pieces[toY][toX][0] = piece;
  pieces[start[1]][start[0]][0] = 'n-l';
}

function checkEnPassant (toX, toY, from, pieces) {
  const [x, y] = from;
  const color = pieces[y][x][0][0];
  const oppColor = color === 'w' ? 'b' : 'w';
  const rightSide = toX < 7 ? pieces[toY][toX + 1][0] : ['n-l'];
  const leftSide = toX > 0 ? pieces[toY][toX - 1][0] : ['n-l'];
  specialMoves[oppColor].enPassant = {status: false, pos: []};
  if (leftSide[2] === 'p' && leftSide[0] === oppColor) {
    specialMoves[oppColor].enPassant = {status: true, pos: [toX - 1, toY, 1]};
  } else if (rightSide[2] === 'p' && rightSide[0] === oppColor) {
    specialMoves[oppColor].enPassant = {status: true, pos: [toX + 1, toY, -1]};
  }
}

function captureEnPassant (x, y, pieces) {
  pieces[y][x][0] = 'n-l';
}

function pawnMoves (toX, toY, from, pieces) {
  const [x, y] = from;
  const color = pieces[y][x][0][0];
  const dx = color === 'w' ? toX - x : x - toX;
  const dy = color === 'w' ? toY - y : y - toY;
  return (
    (dx === 0 && dy === -1) ||
    (y === 6 && dy === -2 && dx === 0) ||
    (y === 1 && dy === -2 && dx === 0)
  );
}
