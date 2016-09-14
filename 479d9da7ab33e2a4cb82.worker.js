/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var BoardNode = __webpack_require__(1);
	var Ai = __webpack_require__(2);
	
	self.onmessage = function (e) {
	  var specMoves = e.data.data.specialMoves;
	  var testBoard = Ai.dupe(e.data.data.board.pieces);
	  var depth = e.data.data.depth;
	  var bestMove = BoardNode.findBestMove(testBoard, specMoves, depth);
	  var workerResult = 'Message received!';
	  var moveData = Object.assign({ move: [], checkmate: false, enPassant: false, castle: false }, bestMove);
	  postMessage(moveData);
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Ai = __webpack_require__(2);
	
	module.exports = {
	  findBestMove: function findBestMove(board, specMoves, depth) {
	    var moves = parseMoveClusters(findAllPieces(board, specMoves.currentSide).map(function (piece) {
	      return findAllLegalMovesByPiece(piece, board, specMoves);
	    }));
	    if (moves.length === 0) return { checkmate: true, side: specMoves.currentSide };
	
	    var bestMove = null;
	    moves.forEach(function (move) {
	      var currentNode = new BoardNode(move, board, specMoves, depth);
	      if (currentNode.checkmate) {
	        return { move: currentNode.move, checkmate: true };
	      }
	      bestMove = bestMove ? currentNode.score > bestMove.score ? currentNode : bestMove : currentNode;
	    });
	    return { move: bestMove.move };
	  },
	  findAllPieces: function findAllPieces(board, color) {
	    var returnPieces = [];
	    board.forEach(function (row, i) {
	      row.forEach(function (square, j) {
	        var testSquare = parseSquare(board, i, j);
	        if (testSquare.side === color) {
	          returnPieces.push(testSquare);
	        }
	      });
	    });
	    return returnPieces;
	  },
	  findAllLegalMovesByPiece: function findAllLegalMovesByPiece(piece, board, specMoves) {
	    var allSquares = [];
	    var allMoves = void 0;
	    for (var i = 0; i < 8; i++) {
	      for (var j = 0; j < 8; j++) {
	        allSquares.push([j, i]);
	      }
	    }
	    if (piece.type === 'r') {
	      allMoves = allSquares.filter(function (square) {
	        return rookMoves(piece.pos, square[0], square[1]);
	      }).filter(function (square) {
	        return canMove(square[0], square[1], board, piece.pos, specMoves);
	      }).map(function (move) {
	        return [piece.pos, move];
	      });
	    }
	
	    if (piece.type === 'n') {
	      allMoves = allSquares.filter(function (square) {
	        return knightMoves(piece.pos, square[0], square[1]);
	      }).filter(function (square) {
	        return canMove(square[0], square[1], board, piece.pos, specMoves);
	      }).map(function (move) {
	        return [piece.pos, move];
	      });
	    }
	
	    if (piece.type === 'b') {
	      allMoves = allSquares.filter(function (square) {
	        return bishopMoves(piece.pos, square[0], square[1]);
	      }).filter(function (square) {
	        return canMove(square[0], square[1], board, piece.pos, specMoves);
	      }).map(function (move) {
	        return [piece.pos, move];
	      });
	    }
	
	    if (piece.type === 'q') {
	      allMoves = allSquares.filter(function (square) {
	        return queenMoves(piece.pos, square[0], square[1]);
	      }).filter(function (square) {
	        return canMove(square[0], square[1], board, piece.pos, specMoves);
	      }).map(function (move) {
	        return [piece.pos, move];
	      });
	    }
	
	    if (piece.type === 'p') {
	      allMoves = allSquares.filter(function (square) {
	        return pawnMoves(square[0], square[1], piece.pos, board);
	      }).filter(function (square) {
	        return canMove(square[0], square[1], board, piece.pos, specMoves);
	      }).map(function (move) {
	        return [piece.pos, move];
	      });
	    }
	
	    if (piece.type === 'k') {
	      allMoves = allSquares.filter(function (square) {
	        return kingMoves(piece.pos, square[0], square[1]);
	      }).filter(function (square) {
	        return canMove(square[0], square[1], board, piece.pos, specMoves);
	      }).map(function (move) {
	        return [piece.pos, move];
	      });
	    }
	    return allMoves;
	  },
	  parseMoveClusters: function parseMoveClusters(array) {
	    var result = [];
	    array.forEach(function (subArray) {
	      subArray.forEach(function (move) {
	        result.push(move);
	      });
	    });
	    return result;
	  },
	  parseSquare: function parseSquare(pieces, y, x) {
	    var pieceInfo = {
	      side: pieces[y][x][0][0],
	      type: pieces[y][x][0][2],
	      pos: [x, y],
	      defended: false
	    };
	    return pieceInfo;
	  },
	
	
	  PIECE_VALUES: {
	    'p': 100,
	    'r': 500,
	    'b': 300,
	    'n': 300,
	    'q': 900,
	    'k': 10000
	  }
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	module.exports = {
	  specialMoves: {},
	
	  canMove: function canMove(toX, toY, pieces, from, specMoves) {
	    specialMoves = specMoves;
	    // if (from[0] === 4 && from[1] === 0 && toX === 5 && toY === 1) debugger
	    if (notInCheck(toX, toY, from, pieces)) {
	      if (checkMove(toX, toY, pieces, from)) return true;
	    }
	    return false;
	  },
	  bishopMoves: function bishopMoves(selected, toX, toY) {
	    var _selected = _slicedToArray(selected, 2);
	
	    var x = _selected[0];
	    var y = _selected[1];
	
	    var dx = toX - x;
	    var dy = toY - y;
	    return Math.abs(dx) / Math.abs(dy) === 1;
	  },
	  rookMoves: function rookMoves(selected, toX, toY) {
	    var _selected2 = _slicedToArray(selected, 2);
	
	    var x = _selected2[0];
	    var y = _selected2[1];
	
	    var dx = toX - x;
	    var dy = toY - y;
	    return dx === 0 && dy !== 0 || dy === 0 && dx !== 0;
	  },
	  queenMoves: function queenMoves(selected, toX, toY) {
	    var _selected3 = _slicedToArray(selected, 2);
	
	    var x = _selected3[0];
	    var y = _selected3[1];
	
	    var dx = toX - x;
	    var dy = toY - y;
	    return Math.abs(dx) / Math.abs(dy) === 1 || dx === 0 && dy !== 0 || dy === 0 && dx !== 0;
	  },
	  knightMoves: function knightMoves(selected, toX, toY) {
	    var _selected4 = _slicedToArray(selected, 2);
	
	    var x = _selected4[0];
	    var y = _selected4[1];
	
	    var dx = toX - x;
	    var dy = toY - y;
	    return Math.abs(dx) === 2 && Math.abs(dy) === 1 || Math.abs(dx) === 1 && Math.abs(dy) === 2;
	  },
	  kingMoves: function kingMoves(selected, toX, toY) {
	    var _selected5 = _slicedToArray(selected, 2);
	
	    var x = _selected5[0];
	    var y = _selected5[1];
	
	    var dx = toX - x;
	    var dy = toY - y;
	    return Math.abs(dx) <= 1 && Math.abs(dy) <= 1 && Math.abs(dx) + Math.abs(dy) > 0;
	  },
	  checkPawnCaptures: function checkPawnCaptures(toX, toY, pawn, pieces) {
	    var _pawn = _slicedToArray(pawn, 2);
	
	    var x = _pawn[0];
	    var y = _pawn[1];
	
	    var color = pieces[y][x][0][0];
	    var oppColor = color === 'w' ? 'b' : 'w';
	    var dX = toX - x;
	    var dY = toY - y;
	    var enPassant = specialMoves[color].enPassant;
	    if (color === 'w' && dY > 0 || color === 'b' && dY < 0) {
	      return false;
	    } else if (Math.abs(dX) === 1 && Math.abs(dY) === 1 && pieces[toY][toX][0][0] !== color && pieces[toY][toX][0][0] !== 'n') {
	      return true;
	    } else if (enPassant.status) {
	      if (pawn[0] === enPassant.pos[0] && pawn[1] === enPassant.pos[1] && toX === x + enPassant.pos[2] && Math.abs(dY) === 1) {
	        return true;
	      }
	    }
	    return false;
	  },
	  notInCheck: function notInCheck(toX, toY, from, pieces) {
	    var color = pieces[from[1]][from[0]][0][0];
	    var testBoard = dupe(pieces);
	    var afterMove = testMove(testBoard, from, [toX, toY]);
	    var king = findKing(afterMove, color); //[y,x];
	    if (findAttackers(king, afterMove, color === 'w' ? 'b' : 'w', false).length > 0) {
	      return false;
	    } else {
	      return true;
	    }
	  },
	  findAttackers: function findAttackers(piece, board, colorToCheck, sameSide) {
	    if (!piece) return false;
	    var yDir = colorToCheck === 'w' ? piece[1] + 1 : piece[1] - 1;
	    var left = piece[0] - 1;
	    var right = piece[0] + 1;
	    var returnResult = [];
	    //test for pawns
	    if (left >= 0 && left <= 7 && yDir >= 0 && yDir <= 7 && board[yDir][left][0] === colorToCheck + '-p') {
	      returnResult.push([true, 'p']);
	    } else if (right >= 0 && right <= 7 && yDir >= 0 && yDir <= 7 && board[yDir][right][0] === colorToCheck + '-p') {
	      returnResult.push([true, 'p']);
	    }
	    //test for knights
	    [[1, 2], [1, -2], [-1, 2], [-1, -2], [2, 1], [2, -1], [-2, 1], [-2, -1]].forEach(function (coord) {
	      var x = piece[0] + coord[0];
	      var y = piece[1] + coord[1];
	      if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
	        if (board[y][x][0] === colorToCheck + '-n') {
	          returnResult.push([true, 'n']);
	        }
	      }
	    });
	    //test for bishops/queens
	    [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function (step) {
	      var x = piece[0] + step[0],
	          y = piece[1] + step[1];
	      while (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
	        if (board[y][x][0] === colorToCheck + '-b' && checkObstruction(x, y, piece, board, sameSide)) {
	          returnResult.push([true, 'b']);
	        } else if (board[y][x][0] === colorToCheck + '-q' && checkObstruction(x, y, piece, board, sameSide)) {
	          returnResult.push([true, 'q']);
	        }
	        x += step[0];
	        y += step[1];
	      }
	    });
	    //test for rooks/queens
	    [[0, 1], [0, -1], [-1, 0], [1, 0]].forEach(function (step) {
	      var x = piece[0] + step[0],
	          y = piece[1] + step[1];
	      while (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
	        if (board[y][x][0] === colorToCheck + '-r' && checkObstruction(x, y, piece, board, sameSide)) {
	          returnResult.push([true, 'r']);
	        } else if (board[y][x][0] === colorToCheck + '-q' && checkObstruction(x, y, piece, board, sameSide)) {
	          returnResult.push([true, 'q']);
	        }
	        x += step[0];
	        y += step[1];
	      }
	    });
	
	    //test for king
	    [[0, 1], [0, -1], [-1, 0], [1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function (coord) {
	      var x = piece[0] + coord[0];
	      var y = piece[1] + coord[1];
	      if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
	        if (board[y][x][0] === colorToCheck + '-k') {
	          returnResult.push([true, 'k']);
	        }
	      }
	    });
	    return returnResult;
	  },
	  testMove: function testMove(testBoard, from, to) {
	    var selected = from;
	    var start = testBoard[selected[1]][selected[0]][0];
	    var color = start[0];
	    if (testBoard[to[1]][to[0]][0][0] !== color) {
	      testBoard[to[1]][to[0]][0] = start;
	      testBoard[selected[1]][selected[0]][0] = 'n-l';
	    }
	    return testBoard;
	  },
	  dupe: function dupe(array) {
	    var duped = [[], [], [], [], [], [], [], []];
	    for (var i = 0; i < array.length; i++) {
	      for (var j = 0; j < array[i].length; j++) {
	        var piece = array[i][j][0][0] + '-' + array[i][j][0][2];
	        duped[i].push([piece]);
	      }
	    }
	    return duped;
	  },
	  findKing: function findKing(pieces, color) {
	    var target = color + '-k';
	    for (var i = 0; i <= 7; i++) {
	      for (var j = 0; j <= 7; j++) {
	        if (pieces[i][j][0] === target) {
	          return [j, i];
	        }
	      }
	    }
	  },
	  checkMove: function checkMove(toX, toY, pieces, from) {
	    var pos = from;
	    var piece = pieces[pos[1]][pos[0]][0];
	    var color = pieces[pos[1]][pos[0]][0][0];
	    if (piece[2] === 'n') {
	      if (pieces[toY][toX][0][0] !== color) {
	        return knightMoves(pos, toX, toY);
	      }
	    } else if (piece[2] === 'b') {
	      if (checkObstruction(toX, toY, pos, pieces)) {
	        return bishopMoves(pos, toX, toY);
	      }
	    } else if (piece[2] === 'r') {
	      if (checkObstruction(toX, toY, pos, pieces)) {
	        return rookMoves(pos, toX, toY);
	      }
	    } else if (piece[2] === 'q') {
	      if (checkObstruction(toX, toY, pos, pieces)) {
	        return queenMoves(pos, toX, toY);
	      }
	    } else if (piece[2] === 'k') {
	      if (checkObstruction(toX, toY, pos, pieces)) {
	        if (checkCastle(pos, toX, toY, pieces)) {
	          return true;
	        } else {
	          return kingMoves(pos, toX, toY);
	        }
	      }
	    } else if (piece[2] === 'p') {
	      if (checkPawnCaptures(toX, toY, pos, pieces)) {
	        return true;
	      } else if (checkPawnObstruction(toX, toY, pieces)) {
	        return pawnMoves(toX, toY, pos, pieces);
	      }
	    }
	  },
	  checkPawnObstruction: function checkPawnObstruction(toX, toY, pieces) {
	    if (pieces[toY][toX][0][0] !== 'n') {
	      return false;
	    }
	    return true;
	  },
	  checkCastle: function checkCastle(pos, toX, toY, pieces) {
	    var king = [pos[1], pos[0]];
	    var color = pieces[pos[1]][pos[0]][0][0];
	    if (toX === 2 && toY === pos[1] && checkObstruction(toX - 1, toY, pos, pieces) && notInCheck(toX + 1, toY, pos, pieces) && findAttackers(king, pieces, color === 'w' ? 'b' : 'w', false).length === 0) {
	      return specialMoves[color].castleQueenSideStatus;
	    } else if (toX === 6 && toY === pos[1] && checkObstruction(toX, toY, pos, pieces) && notInCheck(toX - 1, toY, pos, pieces) && findAttackers(king, pieces, color === 'w' ? 'b' : 'w', false).length === 0) {
	      return specialMoves[color].castleKingSideStatus;
	    }
	  },
	  checkObstruction: function checkObstruction(toX, toY, from, pieces) {
	    var sameSide = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];
	
	    var _from = _slicedToArray(from, 2);
	
	    var x = _from[0];
	    var y = _from[1];
	
	    var color = pieces[y][x][0][0];
	    var dX = toX - x;
	    var dY = toY - y;
	    var xStep = dX / Math.abs(dX) || 0;
	    var yStep = dY / Math.abs(dY) || 0;
	    if (dX === 0 && dY !== 0) {
	      for (var i = 1; i <= Math.abs(dY); i++) {
	        if (pieces[y + yStep * i][x][0][0] === color && !sameSide || pieces[y + yStep * i][x][0][0] !== 'n' && i < Math.abs(dY)) {
	          return false;
	        }
	      }
	      return true;
	    } else if (dY === 0 && dX !== 0) {
	      for (var _i = 1; _i <= Math.abs(dX); _i++) {
	        if (pieces[y][x + xStep * _i][0][0] === color && !sameSide || pieces[y][x + xStep * _i][0][0] !== 'n' && _i < Math.abs(dX)) {
	          return false;
	        }
	      }
	      return true;
	    } else if (Math.abs(dX) / Math.abs(dY) === 1) {
	      for (var _i2 = 1; _i2 <= Math.abs(dX); _i2++) {
	        if (pieces[y + yStep * _i2][x + xStep * _i2][0][0] === color && !sameSide || pieces[y + yStep * _i2][x + xStep * _i2][0][0] !== 'n' && _i2 < Math.abs(dX)) {
	          return false;
	        }
	      }
	
	      return true;
	    } else {
	      return false;
	    }
	  },
	  castleRook: function castleRook(toX, toY, pieces) {
	    var start = toX > 4 ? [7, toY] : [0, toY];
	    var piece = pieces[start[1]][start[0]][0];
	    pieces[toY][toX][0] = piece;
	    pieces[start[1]][start[0]][0] = 'n-l';
	  },
	  checkEnPassant: function checkEnPassant(toX, toY, from, pieces) {
	    var _from2 = _slicedToArray(from, 2);
	
	    var x = _from2[0];
	    var y = _from2[1];
	
	    var color = pieces[y][x][0][0];
	    var oppColor = color === 'w' ? 'b' : 'w';
	    var rightSide = toX < 7 ? pieces[toY][toX + 1][0] : ['n-l'];
	    var leftSide = toX > 0 ? pieces[toY][toX - 1][0] : ['n-l'];
	    specialMoves[oppColor].enPassant = { status: false, pos: [] };
	    if (leftSide[2] === 'p' && leftSide[0] === oppColor) {
	      specialMoves[oppColor].enPassant = { status: true, pos: [toX - 1, toY, 1] };
	    } else if (rightSide[2] === 'p' && rightSide[0] === oppColor) {
	      specialMoves[oppColor].enPassant = { status: true, pos: [toX + 1, toY, -1] };
	    }
	  },
	  captureEnPassant: function captureEnPassant(x, y, pieces) {
	    pieces[y][x][0] = 'n-l';
	  },
	  pawnMoves: function pawnMoves(toX, toY, from, pieces) {
	    var _from3 = _slicedToArray(from, 2);
	
	    var x = _from3[0];
	    var y = _from3[1];
	
	    var color = pieces[y][x][0][0];
	    var dx = color === 'w' ? toX - x : x - toX;
	    var dy = color === 'w' ? toY - y : y - toY;
	    return dx === 0 && dy === -1 || y === 6 && dy === -2 && dx === 0 && pieces[5][x][0][0] === 'n' || y === 1 && dy === -2 && dx === 0 && pieces[2][x][0][0] === 'n' || checkPawnCaptures(toX, toY, from, pieces);
	  }
	};

/***/ }
/******/ ]);
//# sourceMappingURL=479d9da7ab33e2a4cb82.worker.js.map