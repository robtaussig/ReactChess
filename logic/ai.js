module.exports = {
  specialMoves: {},

  findAllPieces (board,color) {
    let returnPieces = [];
    board.forEach((row,i)=>{
      row.forEach((square,j)=>{
        let testSquare = this.parseSquare(board,i,j);
        if (testSquare.side === color) {
          returnPieces.push(testSquare);
        }
      });
    });
    return returnPieces;
  },

  findAllLegalMovesByPiece (piece, board, specMoves) {
    let allSquares = [];
    let allMoves;
    for (let i=0;i<8;i++) {
      for (let j=0;j<8;j++) {
        allSquares.push([j,i]);
      }
    }
    if (piece.type === 'r') {
      allMoves = allSquares.filter(square=> {
        return this.rookMoves(piece.pos, square[0], square[1]);
      }).filter(square=> {
        return this.canMove(square[0], square[1], board, piece.pos,specMoves);
      }).map(move => [piece.pos,move]);
    }

    if (piece.type === 'n') {
      allMoves = allSquares.filter(square=> {
        return this.knightMoves(piece.pos, square[0], square[1]);
      }).filter(square=> {
        return this.canMove(square[0], square[1], board, piece.pos,specMoves);
      }).map(move => [piece.pos,move]);
    }

    if (piece.type === 'b') {
      allMoves = allSquares.filter(square=> {
        return this.bishopMoves(piece.pos, square[0], square[1]);
      }).filter(square=> {
        return this.canMove(square[0], square[1], board, piece.pos,specMoves);
      }).map(move => [piece.pos,move]);
    }

    if (piece.type === 'q') {
      allMoves = allSquares.filter(square=> {
        return this.queenMoves(piece.pos, square[0], square[1]);
      }).filter(square=> {
        return this.canMove(square[0], square[1], board, piece.pos,specMoves);
      }).map(move => [piece.pos,move]);
    }

    if (piece.type === 'p') {
      allMoves = allSquares.filter(square=> {
        return this.pawnMoves(square[0], square[1], piece.pos, board);
      }).filter(square=> {
        return this.canMove(square[0], square[1], board, piece.pos,specMoves);
      }).map(move => [piece.pos,move]);
    }

    if (piece.type === 'k') {
      allMoves = allSquares.filter(square=> {
        return this.kingMoves(piece.pos, square[0], square[1]);
      }).filter(square=> {
        return this.canMove(square[0], square[1], board, piece.pos,specMoves);
      }).map(move => [piece.pos,move]);
    }
    return allMoves;
  },

  parseMoveClusters (array) {
    let result = [];
    array.forEach(subArray => {
      subArray.forEach(move => {
        result.push(move);
      });
    });
    return result;
  },

  parseSquare (pieces, y, x) {
    let pieceInfo = {
      side: pieces[y][x][0][0],
      type: pieces[y][x][0][2],
      pos: [x,y],
      defended: false
    };
    return pieceInfo;
  },

  canMove(toX, toY, pieces, from,specMoves) {
    this.specialMoves = specMoves;
    // if (from[0] === 4 && from[1] === 0 && toX === 5 && toY === 1) debugger
    if (this.notInCheck(toX, toY, from, pieces)) {
      if (this.checkMove(toX, toY, pieces, from)) return true;
    }
    return false;
  },

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
  },

  knightMoves (selected,toX, toY) {
    const [x, y] = selected;
    const dx = toX - x;
    const dy = toY - y;
    return (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
           (Math.abs(dx) === 1 && Math.abs(dy) === 2);
  },

  kingMoves (selected, toX, toY) {
    const [x, y] = selected;
    const dx = toX - x;
    const dy = toY - y;
    return ((Math.abs(dx) <= 1 && Math.abs(dy) <= 1) &&
           (Math.abs(dx) + Math.abs(dy) > 0)) || (x === 4 && (toX === 6) || (toX === 2));
  },

  checkPawnCaptures (toX, toY, pawn, pieces) {
    const [x, y] = pawn;
    const color = pieces[y][x][0][0];
    const oppColor = color === 'w' ? 'b' : 'w';
    const dX = toX - x;
    const dY = toY - y;
    const enPassant = this.specialMoves[color].enPassant;
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
  },

  notInCheck (toX, toY, from, pieces) {
    let color = pieces[from[1]][from[0]][0][0];
    let testBoard = this.dupe(pieces);
    let afterMove = this.testMove(testBoard, from, [toX, toY]);
    let king = this.findKing(afterMove,color); //[y,x];
    if (this.findAttackers(king,afterMove,color==='w'?'b':'w',false).length > 0) {
      return false;
    } else {
      return true;
    }
  },

  findAttackers (piece, board, colorToCheck, sameSide) {
    if (!piece) return false;
    let yDir = colorToCheck === 'w' ? piece[1] + 1 : piece[1] - 1;
    let left = piece[0] - 1;
    let right = piece[0] + 1;
    let returnResult = [];
    //test for pawns
    if (left >= 0 && left <= 7 && yDir >= 0 && yDir <= 7 &&
      board[yDir][left][0] === `${colorToCheck}-p`) {
      returnResult.push([true,'p']);
    } else if (right >= 0 && right <= 7 && yDir >= 0 && yDir <= 7 &&
      board[yDir][right][0] === `${colorToCheck}-p`) {
      returnResult.push([true, 'p']);
    }
    //test for knights
    [[1,2],[1,-2],[-1,2],[-1,-2],[2,1],[2,-1],[-2,1],[-2,-1]].forEach(coord => {
      let x = piece[0] + coord[0];
      let y = piece[1] + coord[1];
      if (x >= 0 && x <=7 && y >= 0 && y <= 7) {
        if (board[y][x][0] === `${colorToCheck}-n`) {
          returnResult.push([true, 'n']);
        }
      }
    });
    //test for bishops/queens
    [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(step => {
      let x = piece[0] + step[0],
        y = piece[1] + step[1];
      while (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
        if (board[y][x][0] === `${colorToCheck}-b` &&
          this.checkObstruction(x,y,piece,board,sameSide)) {
          returnResult.push([true, 'b']);
        } else if (board[y][x][0] === `${colorToCheck}-q` &&
          this.checkObstruction(x,y,piece,board,sameSide)) {
          returnResult.push([true, 'q']);
        }
        x += step[0];
        y += step[1];
      }
    });
    //test for rooks/queens
    [[0,1],[0,-1],[-1,0],[1,0]].forEach(step => {
      let x = piece[0] + step[0],
        y = piece[1] + step[1];
      while (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
        if (board[y][x][0] === `${colorToCheck}-r` &&
          this.checkObstruction(x,y,piece,board,sameSide)) {
          returnResult.push([true, 'r']);
        } else if (board[y][x][0] === `${colorToCheck}-q` &&
          this.checkObstruction(x,y,piece,board,sameSide)) {
          returnResult.push([true,'q']);
        }
        x += step[0];
        y += step[1];
      }
    });

    //test for king
    [[0,1],[0,-1],[-1,0],[1,0],[1,1],[1,-1],[-1,1],[-1,-1]].forEach(coord => {
      let x = piece[0] + coord[0];
      let y = piece[1] + coord[1];
      if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
        if (board[y][x][0] === `${colorToCheck}-k`) {
          returnResult.push([true, 'k']);
        }
      }
    });
    return returnResult;
  },

  testMove (testBoard, from, to) {
    let selected = from;
    let start = testBoard[selected[1]][selected[0]][0];
    let color = start[0];
    if (testBoard[to[1]][to[0]][0][0] !== color) {
      testBoard[to[1]][to[0]][0] = start;
      testBoard[selected[1]][selected[0]][0] = 'n-l';
    }
    return testBoard;
  },

  dupe (array) {
    const duped = [[],[],[],[],[],[],[],[]];
    for (let i=0;i<array.length;i++) {
      for (let j=0;j<array[i].length;j++) {
        let piece = `${array[i][j][0][0]}-${array[i][j][0][2]}`;
        duped[i].push([piece]);
      }
    }
    return duped;
  },

  findKing (pieces,color) {
    const target = `${color}-k`;
    for (let i=0; i<=7;i++) {
      for (let j=0; j<=7;j++) {
        if (pieces[i][j][0] === target) {
          return [j, i];
        }
      }
    }
  },

  checkMove (toX, toY, pieces, from) {
    let pos = from;
    let piece = pieces[pos[1]][pos[0]][0];
    let color = pieces[pos[1]][pos[0]][0][0];
    if (piece[2] === 'n') {
      if (pieces[toY][toX][0][0] !== color) {
        return this.knightMoves(pos,toX, toY);
      }
    } else if (piece[2] === 'b') {
      if (this.checkObstruction(toX, toY, pos, pieces)) {
        return this.bishopMoves(pos,toX, toY);
      }
    } else if (piece[2] === 'r') {
      if (this.checkObstruction(toX, toY, pos, pieces)) {
        return this.rookMoves(pos,toX, toY);
      }
    } else if (piece[2] === 'q') {
      if (this.checkObstruction(toX, toY, pos, pieces)) {
        return this.queenMoves(pos,toX, toY);
      }
    } else if (piece[2] === 'k') {
      if (this.checkObstruction(toX, toY, pos, pieces)) {
        if (this.checkCastle(pos, toX, toY, pieces)) {
          return true;
        } else {
          return this.kingMoves(pos,toX, toY);
        }
      }
    } else if (piece[2] === 'p') {
      if (this.checkPawnCaptures(toX, toY, pos, pieces)) {
        return true;
      } else if (this.checkPawnObstruction(toX, toY, pieces)) {
        return this.pawnMoves(toX, toY, pos, pieces);
      }
    }
  },

  checkPawnObstruction (toX, toY, pieces) {
    if (pieces[toY][toX][0][0] !== 'n') {
      return false;
    }
    return true;
  },

  checkCastle (pos, toX, toY, pieces) {
    let king = [pos[1],pos[0]];
    let color = pieces[pos[1]][pos[0]][0][0];
    if (toX === 2 && toY === pos[1] && this.checkObstruction(toX - 1, toY, pos, pieces) &&
        this.notInCheck(toX + 1, toY, pos, pieces) &&
        this.findAttackers(king, pieces, color === 'w' ? 'b' : 'w',false).length === 0) {
      return this.specialMoves[color].castleQueenSideStatus;
    } else if (toX === 6 && toY === pos[1] && this.checkObstruction(toX, toY, pos, pieces) &&
        this.notInCheck(toX - 1, toY, pos, pieces) &&
        this.findAttackers(king, pieces, color === 'w' ? 'b' : 'w',false).length === 0) {
      return this.specialMoves[color].castleKingSideStatus;
    }
  },

  checkObstruction (toX, toY, from, pieces, sameSide = false) {
    const [x, y] = from;
    const color = pieces[y][x][0][0];
    const dX = toX - x;
    const dY = toY - y;
    const xStep = dX / Math.abs(dX) || 0;
    const yStep = dY / Math.abs(dY) || 0;
    if (dX === 0 && dY !== 0) {
      for (let i = 1; i <= Math.abs(dY);i++) {
        if (pieces[y+(yStep*i)][x][0][0] === color && !sameSide ||
          (pieces[y+(yStep*i)][x][0][0] !== 'n' && i < Math.abs(dY))) {
          return false;
        }
      }
      return true;
    } else if (dY === 0  && dX !== 0) {
      for (let i = 1; i <= Math.abs(dX);i++) {
        if (pieces[y][x+(xStep*i)][0][0] === color && !sameSide ||
          (pieces[y][x+(xStep*i)][0][0] !== 'n' && i < Math.abs(dX))) {
          return false;
        }
      }
      return true;
    } else if (Math.abs(dX) / Math.abs(dY) === 1) {
      for (let i = 1; i <= Math.abs(dX);i++) {
        if (pieces[y+(yStep*i)][x+(xStep*i)][0][0] === color && !sameSide ||
          (pieces[y+(yStep*i)][x+(xStep*i)][0][0] !== 'n' && i < Math.abs(dX))) {
          return false;
        }
      }

      return true;
    } else {
      return false;
    }
  },

  castleRook (toX, toY, pieces) {
    let start = toX > 4 ? [7, toY] : [0, toY];
    let piece = pieces[start[1]][start[0]][0];
    pieces[toY][toX][0] = piece;
    pieces[start[1]][start[0]][0] = 'n-l';
  },

  checkEnPassant (toX, toY, from, pieces) {
    const [x, y] = from;
    const color = pieces[y][x][0][0];
    const oppColor = color === 'w' ? 'b' : 'w';
    const rightSide = toX < 7 ? pieces[toY][toX + 1][0] : ['n-l'];
    const leftSide = toX > 0 ? pieces[toY][toX - 1][0] : ['n-l'];
    this.specialMoves[oppColor].enPassant = {status: false, pos: []};
    if (leftSide[2] === 'p' && leftSide[0] === oppColor) {
      this.specialMoves[oppColor].enPassant = {status: true, pos: [toX - 1, toY, 1]};
    } else if (rightSide[2] === 'p' && rightSide[0] === oppColor) {
      this.specialMoves[oppColor].enPassant = {status: true, pos: [toX + 1, toY, -1]};
    }
  },

  captureEnPassant (x, y, pieces) {
    pieces[y][x][0] = 'n-l';
  },

  pawnMoves (toX, toY, from, pieces) {
    const [x, y] = from;
    const color = pieces[y][x][0][0];
    const dx = color === 'w' ? toX - x : x - toX;
    const dy = color === 'w' ? toY - y : y - toY;
    return (
      (dx === 0 && dy === -1) ||
      (y === 6 && dy === -2 && dx === 0 && pieces[5][x][0][0] === 'n') ||
      (y === 1 && dy === -2 && dx === 0 && pieces[2][x][0][0] === 'n') ||
      this.checkPawnCaptures(toX, toY, from, pieces)
    );
  }
};
