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
	var Ai = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./ai.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
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
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Ai = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./ai.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
	function findBestMove(board, specMoves, depth) {
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
	}
	
	function findAllPieces(board, color) {
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
	}
	
	function findAllLegalMovesByPiece(piece, board, specMoves) {
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
	}
	
	function parseMoveClusters(array) {
	  var result = [];
	  array.forEach(function (subArray) {
	    subArray.forEach(function (move) {
	      result.push(move);
	    });
	  });
	  return result;
	}
	
	function parseSquare(pieces, y, x) {
	  var pieceInfo = {
	    side: pieces[y][x][0][0],
	    type: pieces[y][x][0][2],
	    pos: [x, y],
	    defended: false
	  };
	  return pieceInfo;
	}
	
	var PIECE_VALUES = {
	  'p': 100,
	  'r': 500,
	  'b': 300,
	  'n': 300,
	  'q': 900,
	  'k': 10000
	};
	
	var BoardNode = function () {
	  function BoardNode(move, pieces, specialMoves, depth) {
	    _classCallCheck(this, BoardNode);
	
	    this.move = move;
	    this.pieces = pieces;
	    this.specialMoves = specialMoves;
	    this.side = specialMoves.currentSide;
	    this.depth = depth;
	    this.checkmate = false;
	    this.score = this.evaluateMove();
	  }
	
	  _createClass(BoardNode, [{
	    key: 'evaluateMove',
	    value: function evaluateMove() {
	      var newBoard = testMove(dupe(this.pieces), this.move[0], this.move[1]);
	      var ownPieces = findAllPieces(newBoard, this.side);
	      var otherPieces = findAllPieces(newBoard, this.side === 'w' ? 'b' : 'w');
	      var materialScore = this.evalMaterial(newBoard, ownPieces, otherPieces);
	      var positionalScore = this.evalPosition(newBoard, ownPieces);
	      var tacticScore = this.evalTactics(newBoard, ownPieces, otherPieces);
	      return materialScore + positionalScore + tacticScore;
	    }
	  }, {
	    key: 'evalTactics',
	    value: function evalTactics(ownPieces, otherPieces) {
	      var tacticScore = 0;
	      tacticScore += this.evalDoubleAttacks(this.pieces, otherPieces);
	      this.evalCheckmate();
	      return tacticScore;
	    }
	  }, {
	    key: 'evalCheckmate',
	    value: function evalCheckmate() {
	      var _this = this;
	
	      var moves = parseMoveClusters(findAllPieces(this.pieces, this.side === 'w' ? 'b' : 'w').map(function (piece) {
	        return findAllLegalMovesByPiece(piece, _this.pieces, _this.specialMoves);
	      }));
	      if (moves.length === 0) {
	        this.checkmate = true;
	      }
	    }
	  }, {
	    key: 'evalDoubleAttacks',
	    value: function evalDoubleAttacks(board, otherPieces) {
	      var _this2 = this;
	
	      var attackedPieces = [];
	      otherPieces.forEach(function (piece) {
	        var lvA = _this2.leastValuableAttacker(board, piece);
	        if (lvA > 0) {
	          var defended = _this2.defended(board, piece);
	          var score = PIECE_VALUES[piece.type];
	          attackedPieces.push([score - lvA * defended]);
	        }
	      });
	      var sorted = attackedPieces.sort(function (a, b) {
	        return b - a;
	      });
	      var secondBestAttack = sorted[1] || 0;
	      return Math.max(secondBestAttack, 0);
	    }
	  }, {
	    key: 'evalMaterial',
	    value: function evalMaterial(board, ownPieces, otherPieces) {
	      var ownScore = ownPieces.map(function (piece) {
	        return PIECE_VALUES[piece.type];
	      }).reduce(function (sum, el) {
	        return sum + el;
	      });
	
	      var otherScore = otherPieces.map(function (piece) {
	        return PIECE_VALUES[piece.type];
	      }).reduce(function (sum, el) {
	        return sum + el;
	      });
	
	      return ownScore - otherScore;
	    }
	  }, {
	    key: 'evalPosition',
	    value: function evalPosition(board, ownPieces) {
	      var _this3 = this;
	
	      var ownScore = ownPieces.map(function (piece) {
	        return _this3.evalPiecePositionalValue(piece, board);
	      }).reduce(function (sum, el) {
	        return sum + el;
	      });
	      return ownScore;
	    }
	  }, {
	    key: 'defended',
	    value: function defended(board, piece) {
	      //Can use the findAttacker method but with own side to check for defended status
	      var defended = findAttackers(piece.pos, board, piece.side, true)[0];
	      if (defended) {
	        return 1;
	      } else {
	        return 0;
	      }
	    }
	  }, {
	    key: 'leastValuableAttacker',
	    value: function leastValuableAttacker(board, piece) {
	      var lvA = findAttackers(piece.pos, board, piece.side === 'w' ? 'b' : 'w', false);
	      if (lvA[0] && lvA[0][0]) {
	        return PIECE_VALUES[lvA[0][1]];
	      } else {
	        return 0;
	      }
	    }
	  }, {
	    key: 'evalPiecePositionalValue',
	    value: function evalPiecePositionalValue(piece, board) {
	      var value = 0;
	      switch (piece.type) {
	        case 'p':
	          value = this.pawnPositionalValue(piece, board);
	          break;
	        case 'r':
	          value = this.rookPositionalValue(piece, board);
	          break;
	        case 'n':
	          value = this.knightPositionalValue(piece, board);
	          break;
	        case 'b':
	          value = this.bishopPositionalValue(piece, board);
	          break;
	        case 'q':
	          value = this.queenPositionalValue(piece, board);
	          break;
	        case 'k':
	          value = this.kingPositionalValue(piece, board);
	          break;
	        default:
	
	      }
	      return value;
	    }
	  }, {
	    key: 'pawnPositionalValue',
	    value: function pawnPositionalValue(pawn, board) {
	      var posX = pawn.pos[0],
	          posY = pawn.pos[1],
	          value = 0;
	
	      value += 30 * (0.25 / (Math.abs(3.5 - posY) * Math.abs(3.5 - posX)));
	      var lvA = this.leastValuableAttacker(board, pawn);
	      if (lvA > 0) {
	        value -= Math.max(PIECE_VALUES[pawn.type] - lvA * this.defended(board, pawn), 0);
	      }
	
	      return value;
	    }
	  }, {
	    key: 'rookPositionalValue',
	    value: function rookPositionalValue(rook, board) {
	      var moves = findAllLegalMovesByPiece(rook, board, this.specialMoves);
	      var value = 0;
	
	      var lvA = this.leastValuableAttacker(board, rook);
	      if (lvA > 0) {
	        value -= Math.max(PIECE_VALUES[rook.type] - lvA * this.defended(board, rook), 0);
	      }
	      return moves.length * 5 + value;
	    }
	  }, {
	    key: 'knightPositionalValue',
	    value: function knightPositionalValue(knight, board) {
	      var value = 0;
	      var moves = findAllLegalMovesByPiece(knight, board, this.specialMoves);
	      moves.forEach(function (move) {
	        value += 12 * (0.25 / Math.abs(3.5 - move[1][1]) * Math.abs(3.5 - move[1][0]));
	      });
	      var lvA = this.leastValuableAttacker(board, knight);
	      if (lvA > 0) {
	        value -= Math.max(PIECE_VALUES[knight.type] - lvA * this.defended(board, knight), 0);
	      }
	      if (this.defended(board, knight)) {
	        value += 25;
	      }
	      return value;
	    }
	  }, {
	    key: 'bishopPositionalValue',
	    value: function bishopPositionalValue(bishop, board) {
	      var value = 0;
	      var moves = findAllLegalMovesByPiece(bishop, board, this.specialMoves);
	      var lvA = this.leastValuableAttacker(board, bishop);
	      if (lvA > 0) {
	        value -= Math.max(PIECE_VALUES[bishop.type] - lvA * this.defended(board, bishop), 0);
	      }
	      if (this.defended(board, bishop)) {
	        value += 25;
	      }
	      return moves.length * 8 + value;
	    }
	  }, {
	    key: 'queenPositionalValue',
	    value: function queenPositionalValue(queen, board) {
	      var value = 0;
	      var moves = findAllLegalMovesByPiece(queen, board, this.specialMoves);
	      var lvA = this.leastValuableAttacker(board, queen);
	      if (lvA > 0) {
	        value -= Math.max(PIECE_VALUES[queen.type] - lvA * this.defended(board, queen), 0);
	      }
	
	      return moves.length * 2 + value;
	    }
	  }, {
	    key: 'kingPositionalValue',
	    value: function kingPositionalValue(king, board) {
	      var posX = king.pos[0],
	          posY = king.pos[1],
	          value = 0,
	          left = posX === 0 ? null : posX - 1,
	          right = posX === 7 ? null : posX + 1,
	          yDir = king.side === 'w' ? posY === 0 ? null : posY - 1 : posY === 7 ? null : posY + 1;
	      [left, posX, right].filter(function (el) {
	        return el;
	      }).forEach(function (xCoord) {
	        var testSquare = board[yDir][xCoord][0];
	        if (testSquare[0] === king.side) {
	          if (testSquare[2] === 'p') {
	            value += 30;
	          } else {
	            value += 20;
	          }
	        }
	      });
	      if (king.pos[0] === 6 || king.pos[0] === 2) {
	        value += 100;
	      }
	      return value;
	    }
	  }]);

	  return BoardNode;
	}();

/***/ }
/******/ ]);
//# sourceMappingURL=80da51fd052121e0d86f.worker.js.map