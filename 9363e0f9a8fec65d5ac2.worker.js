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
	
	var LogicBridge = __webpack_require__(1);
	var Ai = __webpack_require__(4);
	
	self.onmessage = function (e) {
	  var specMoves = e.data.data.specialMoves;
	  var testBoard = Ai.dupe(e.data.data.board.pieces);
	  var depth = e.data.data.depth;
	  var bestMove = LogicBridge.findBestMove(testBoard, specMoves, depth);
	  var workerResult = 'Message received!';
	  var moveData = Object.assign({ move: [], checkmate: false, enPassant: false, castle: false }, bestMove);
	  postMessage(moveData);
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _ai_new = __webpack_require__(2);
	
	var _ai_new2 = _interopRequireDefault(_ai_new);
	
	var _board_eval = __webpack_require__(3);
	
	var _board_eval2 = _interopRequireDefault(_board_eval);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// const BoardNode = require('./board_node.js');
	
	// const Ai = require('./ai.js');
	module.exports = {
	  findBestMove: function findBestMove(board, specMoves, depth) {
	    var ai = new _ai_new2.default(board, specMoves);
	    var moves = ai.allLegalMoves(ai.findAllPieces('b'));
	    if (moves.length === 0) return { checkmate: true, side: specMoves.currentSide };
	    var bestMove = null;
	    for (var i = 0; i < moves.length; i++) {
	      var currentNode = new _board_eval2.default(ai, moves[i], depth);
	      if (currentNode.checkmate) {
	        return { move: currentNode.move, checkmate: true };
	      } else {
	        bestMove = bestMove ? currentNode.score > bestMove.score ? currentNode : bestMove : currentNode;
	      }
	    }
	
	    return { move: bestMove.move };
	  }
	
	  // findBestMove (board,specMoves,depth) {
	  //   let moves = Ai.parseMoveClusters(
	  //                 Ai.findAllPieces(board,specMoves.currentSide)
	  //                 .map(piece=> Ai.findAllLegalMovesByPiece(piece,board,specMoves))
	  //               );
	  //   if (moves.length === 0) return {checkmate: true, side: specMoves.currentSide};
	  //   debugger
	  //   let bestMove = null;
	  //   moves.forEach(move => {
	  //     let currentNode = new BoardNode(move,board,specMoves,depth);
	  //     if (currentNode.checkmate) {
	  //       return {move: currentNode.move, checkmate: true};
	  //     }
	  //     bestMove = bestMove ?
	  //       (currentNode.score > bestMove.score ?
	  //         currentNode : bestMove) : currentNode;
	  //   });
	  //   return {move: bestMove.move};
	  // }
	
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Ai = function () {
	  function Ai(board, specialMoves) {
	    _classCallCheck(this, Ai);
	
	    this.specialMoves = specialMoves;
	    this.board = this.convertBoard(board);
	  }
	
	  //RNBQKBNRPPPPPPPP----------------
	  //----------------pppppppprnbqkbnr
	
	
	  _createClass(Ai, [{
	    key: 'convertBoard',
	    value: function convertBoard(board) {
	      var boardString = '----------';
	      for (var i = 0, n = board.length; i < n; i++) {
	        boardString += '-';
	        for (var j = 0, m = board[i].length; j < m; j++) {
	          var piece = board[i][j][0];
	          var type = piece.split('-')[1];
	          if (type === 'l') {
	            boardString += '-';
	          } else if (piece.split('-')[0] === 'b') {
	            boardString += type.toUpperCase();
	          } else {
	            boardString += type;
	          }
	        }
	        boardString += '-';
	      }
	      boardString += '----------';
	      return boardString;
	    }
	  }, {
	    key: 'color',
	    value: function color(pos) {
	      var board = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.board;
	
	      if (/[a-z]/.test(board[pos])) {
	        return 'w';
	      } else {
	        return 'b';
	      }
	    }
	  }, {
	    key: 'findAllPieces',
	    value: function findAllPieces(color) {
	      var board = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.board;
	
	      var positions = [];
	      for (var i = 0, n = board.length; i < n; i++) {
	        var piece = board[i];
	        if (piece !== '-' && this.color(i) === color) {
	          positions.push(i);
	        }
	      }
	      return positions;
	    }
	  }, {
	    key: 'allLegalMoves',
	    value: function allLegalMoves(positions) {
	      var _this = this;
	
	      var board = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.board;
	
	      var moves = [];
	      for (var i = 0; i < positions.length; i++) {
	        moves = moves.concat(this.findAllLegalMovesByPiece(positions[i], board));
	      }
	      return moves.filter(function (move) {
	        return !_this.inCheck(move, board);
	      });
	    }
	  }, {
	    key: 'inCheck',
	    value: function inCheck(move) {
	      var board = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.board;
	      var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'b';
	
	      var newBoard = this.makeMove(move, board);
	      var kingPos = this.findPiece('k', color, board)[0];
	      return this.hasAttackers(kingPos, newBoard, color);
	    }
	  }, {
	    key: 'findPiece',
	    value: function findPiece(piece, color) {
	      var board = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.board;
	
	      if (color === 'b') piece = piece.toUpperCase();
	      var pos = [];
	      for (var i = 0; i < 100; i++) {
	        if (board[i] === piece) {
	          if (piece === 'K' || piece === 'k' || piece === 'Q' || piece === 'q') {
	            return [i];
	          }
	          pos.push(i);
	        }
	      }
	      return pos;
	    }
	  }, {
	    key: 'hasAttackers',
	    value: function hasAttackers(position) {
	      var board = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.board;
	      var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'b';
	
	      var bishopsQueensCheck = [-11, -9, 11, 9];
	      for (var i = 0; i < bishopsQueensCheck.length; i++) {
	        var currentPos = position + bishopsQueensCheck[i];
	        while (this.checkObstruction(currentPos, board)) {
	          currentPos += bishopsQueensCheck[i];
	        }
	        var piece = board[currentPos] ? board[currentPos].toLowerCase() : '-';
	        if (this.inBounds(currentPos) && (piece === 'b' || piece === 'q') && this.color(currentPos, board) !== color) {
	          return true;
	        }
	      }
	
	      var rooksQueensCheck = [-1, 1, -10, 10];
	      for (var _i = 0; _i < rooksQueensCheck.length; _i++) {
	        var _currentPos = position + rooksQueensCheck[_i];
	        while (this.checkObstruction(_currentPos, board)) {
	          _currentPos += rooksQueensCheck[_i];
	        }
	        var _piece = board[_currentPos] ? board[_currentPos].toLowerCase() : '-';
	        if (this.inBounds(_currentPos) && (_piece === 'r' || _piece === 'q') && this.color(_currentPos, board) !== color) {
	          return true;
	        }
	      }
	
	      var knightChecks = [-12, -21, -19, -8, 12, 21, 19, 8];
	      for (var _i2 = 0; _i2 < knightChecks.length; _i2++) {
	        var _currentPos2 = position + knightChecks[_i2];
	        var _piece2 = board[_currentPos2] ? board[_currentPos2].toLowerCase() : '-';
	        if (this.inBounds(_currentPos2) && _piece2 === 'n' && this.color(_currentPos2, board) !== color) {
	          return true;
	        }
	      }
	
	      var pawnChecks = [11 * (color === 'w' ? -1 : 1), 9 * (color === 'w' ? -1 : 1)];
	      for (var _i3 = 0; _i3 < pawnChecks.length; _i3++) {
	        var _currentPos3 = position + pawnChecks[_i3];
	        var _piece3 = board[_currentPos3] ? board[_currentPos3].toLowerCase() : '-';
	        if (this.inBounds(_currentPos3) && _piece3 === 'p' && this.color(_currentPos3, board) !== color) {
	          return true;
	        }
	      }
	
	      var kingChecks = [-1, -11, -10, -9, 1, 11, 10, 9];
	      for (var _i4 = 0; _i4 < kingChecks.length; _i4++) {
	        var _currentPos4 = position + kingChecks[_i4];
	        var _piece4 = board[_currentPos4] ? board[_currentPos4].toLowerCase() : '-';
	        if (this.inBounds(_currentPos4) && _piece4 === 'k' && this.color(_currentPos4, board) !== color) {
	          return true;
	        }
	      }
	
	      return false;
	    }
	  }, {
	    key: 'makeMove',
	    value: function makeMove(move) {
	      var board = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.board;
	
	      var newBoard = "";
	      for (var i = 0; i < 100; i++) {
	        if (i === move[0]) {
	          newBoard += '-';
	        } else if (i === move[1]) {
	          newBoard += board[move[0]];
	        } else {
	          newBoard += board[i];
	        }
	      }
	      return newBoard;
	    }
	  }, {
	    key: 'findAllLegalMovesByPiece',
	    value: function findAllLegalMovesByPiece(position) {
	      var board = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.board;
	
	      var allMoves = void 0;
	      switch (board[position].toLowerCase()) {
	        case 'p':
	          allMoves = this.pawnMoves(position, board);
	          break;
	        case 'r':
	          allMoves = this.rookMoves(position, board);
	          break;
	        case 'n':
	          allMoves = this.knightMoves(position, board);
	          break;
	        case 'b':
	          allMoves = this.bishopMoves(position, board);
	          break;
	        case 'k':
	          allMoves = this.kingMoves(position, board);
	          break;
	        case 'q':
	          allMoves = this.queenMoves(position, board);
	          break;
	        default:
	          allMoves = [];
	      }
	      return allMoves;
	    }
	  }, {
	    key: 'inBounds',
	    value: function inBounds(pos) {
	      return pos > 9 && pos < 90 && pos % 10 !== 0 && pos % 10 !== 9;
	    }
	  }, {
	    key: 'checkObstruction',
	    value: function checkObstruction(pos) {
	      var board = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.board;
	
	      return board[pos] === '-' && this.inBounds(pos);
	    }
	  }, {
	    key: 'canTake',
	    value: function canTake(color, pos) {
	      var board = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.board;
	
	      return this.inBounds(pos) && this.color(pos) !== color && board[pos] !== '-';
	    }
	  }, {
	    key: 'pawnMoves',
	    value: function pawnMoves(position) {
	      var board = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.board;
	
	      var allMoves = [];
	      var color = this.color(position, board);
	      var legalDirs = [10 * (color === 'w' ? -1 : 1)];
	      if (color === 'w' && position > 70 || color === 'b' && position < 30) {
	        legalDirs.push(20 * (color === 'w' ? -1 : 1));
	      }
	      for (var i = 0; i < legalDirs.length; i++) {
	        var currentPos = position + legalDirs[i];
	        if (this.checkObstruction(currentPos)) {
	          allMoves.push([position, currentPos]);
	        }
	      }
	
	      var captureDirs = [11 * (color === 'w' ? -1 : 1), 9 * (color === 'w' ? -1 : 1)];
	      for (var _i5 = 0; _i5 < captureDirs.length; _i5++) {
	        var capturePos = position + captureDirs[_i5];
	        if (this.inBounds(capturePos) && this.canTake(color, capturePos)) {
	          allMoves.push([position, capturePos]);
	        }
	      }
	      // Remember to test again for en passant
	      if (this.specialMoves.enPassant && Math.abs(this.specialMoves - position) === 1) {
	        allMoves.push([position, this.specialMoves.enPassant + (10 * color === 'w' ? -1 : 1)]);
	      }
	      return allMoves;
	    }
	  }, {
	    key: 'rookMoves',
	    value: function rookMoves(position) {
	      var board = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.board;
	
	      var allMoves = [];
	      var legalDirs = [-1, 1, -10, 10];
	      var color = this.color(position, board);
	      for (var i = 0; i < legalDirs.length; i++) {
	        var currentPos = position + legalDirs[i];
	        while (this.checkObstruction(currentPos)) {
	          allMoves.push([position, currentPos]);
	          currentPos += legalDirs[i];
	        }
	        if (this.inBounds(currentPos) && this.canTake(color, currentPos)) {
	          allMoves.push([position, currentPos]);
	        }
	      }
	      return allMoves;
	    }
	  }, {
	    key: 'knightMoves',
	    value: function knightMoves(position) {
	      var board = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.board;
	
	      var allMoves = [];
	      var legalDirs = [-12, -21, -19, -8, 12, 21, 19, 8];
	      var color = this.color(position, board);
	      for (var i = 0; i < legalDirs.length; i++) {
	        var currentPos = position + legalDirs[i];
	        if (this.checkObstruction(currentPos) || this.canTake(color, currentPos)) {
	          allMoves.push([position, currentPos]);
	        }
	      }
	      return allMoves;
	    }
	  }, {
	    key: 'bishopMoves',
	    value: function bishopMoves(position) {
	      var board = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.board;
	
	      var allMoves = [];
	      var legalDirs = [-11, 11, -9, 9];
	      var color = this.color(position, board);
	      for (var i = 0; i < legalDirs.length; i++) {
	        var currentPos = position + legalDirs[i];
	        while (this.checkObstruction(currentPos)) {
	          allMoves.push([position, currentPos]);
	          currentPos += legalDirs[i];
	        }
	        if (this.inBounds(currentPos) && this.canTake(color, currentPos)) {
	          allMoves.push([position, currentPos]);
	        }
	      }
	      return allMoves;
	    }
	  }, {
	    key: 'kingMoves',
	    value: function kingMoves(position) {
	      var board = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.board;
	
	      var allMoves = [];
	      var legalDirs = [-1, -11, -10, -9, 1, 11, 10, 9];
	      var color = this.color(position, board);
	      for (var i = 0; i < legalDirs.length; i++) {
	        var currentPos = position + legalDirs[i];
	        if (this.checkObstruction(currentPos) || this.canTake(color, currentPos)) {
	          allMoves.push([position, currentPos]);
	        }
	      }
	      allMoves = allMoves.concat(this.checkCastle(board, position));
	      return allMoves;
	    }
	  }, {
	    key: 'emptyBetween',
	    value: function emptyBetween(board, from, to) {
	      // Check horizontal line
	      if (Math.floor(from / 10) === Math.floor(to / 10)) {
	        for (var i = Math.min(from, to); i <= Math.max(from, to); i++) {
	          if (board[i] !== '-') return false;
	        }
	        // Check vertical line
	      } else if (from % 10 === to % 10) {
	        for (var _i6 = Math.min(from, to); _i6 <= Math.max(from, to); _i6 += 10) {
	          if (board[_i6] !== '-') return false;
	        }
	      } else {
	        // Check diagonal
	        if (Math.abs(from - to) % 11 === 0) {
	          for (var _i7 = Math.min(from, to); _i7 <= Math.max(from, to); _i7 += 11) {
	            if (board[_i7] !== '-') return false;
	          }
	        } else if (Math.abs(from - to) % 9 === 0) {
	          for (var _i8 = Math.min(from, to); _i8 <= Math.max(from, to); _i8 += 9) {
	            if (board[_i8] !== '-') return false;
	          }
	        }
	      }
	
	      return true;
	    }
	  }, {
	    key: 'checkCastle',
	    value: function checkCastle(board, position) {
	      var moves = [];
	      var color = this.board[position] === 15 ? 'b' : 'w';
	      if (this.specialMoves.queenSideCastle) {
	        if (this.emptyBetween(board, position - 1, 12) && color === 'b') {
	          moves.push([position, 13]);
	        } else if (this.emptyBetween(board, position - 1, 82)) {
	          moves.push([position, 83]);
	        }
	      }
	
	      if (this.specialMoves.kingSideCastle) {
	        if (this.emptyBetween(board, position + 1, 17) && color === 'b') {
	          moves.push([position, 17]);
	        } else if (this.emptyBetween(board, position + 1, 87)) {
	          moves.push([position, 87]);
	        }
	      }
	      return moves;
	    }
	  }, {
	    key: 'queenMoves',
	    value: function queenMoves(position) {
	      var board = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.board;
	
	      var allMoves = [];
	      var legalDirs = [-1, 1, -10, 10, -11, 11, -9, 9];
	      var color = this.color(position, board);
	      for (var i = 0; i < legalDirs.length; i++) {
	        var currentPos = position + legalDirs[i];
	        while (this.checkObstruction(currentPos)) {
	          allMoves.push([position, currentPos]);
	          currentPos += legalDirs[i];
	        }
	        if (this.inBounds(currentPos) && this.canTake(color, currentPos)) {
	          allMoves.push([position, currentPos]);
	        }
	      }
	      return allMoves;
	    }
	  }]);
	
	  return Ai;
	}();
	
	exports.default = Ai;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var MATERIAL = {
	  r: 500,
	  R: -500,
	  n: 300,
	  N: -300,
	  b: 300,
	  B: -300,
	  q: 900,
	  Q: -900,
	  k: 1000,
	  K: 1000,
	  p: 100,
	  P: -100,
	  '-': 0
	};
	
	var BoardEval = function () {
	  function BoardEval(ai, move, depth) {
	    _classCallCheck(this, BoardEval);
	
	    this.ai = ai;
	    this.specialMoves = ai.specialMoves;
	    this.depth = depth;
	    this.checkmate = false;
	    this.score = this.evaluateMove(ai.board, move, depth);
	  }
	
	  _createClass(BoardEval, [{
	    key: 'evaluateMove',
	    value: function evaluateMove(board, move, depth) {}
	  }, {
	    key: 'evaluateBoard',
	    value: function evaluateBoard(board, color) {
	      var materialScore = this.materialScore(board, color);
	    }
	  }, {
	    key: 'materialScore',
	    value: function materialScore(board, color) {
	      var score = board.split('').reduce(function (sum, piece) {
	        return sum += MATERIAL[piece];
	      });
	
	      return color === 'w' ? score : -score;
	    }
	  }]);
	
	  return BoardEval;
	}();
	
	exports.default = BoardEval;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _ai_new = __webpack_require__(2);
	
	var _ai_new2 = _interopRequireDefault(_ai_new);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	module.exports = {
	  specialMoves: {},
	
	  findAllPieces: function findAllPieces(board, color) {
	    var _this = this;
	
	    var converted = new _ai_new2.default(board, this.specialMoves);
	    var legalMoves = converted.allLegalMoves(converted.findAllPieces('b'));
	    var returnPieces = [];
	    board.forEach(function (row, i) {
	      row.forEach(function (square, j) {
	        var testSquare = _this.parseSquare(board, i, j);
	        if (testSquare.side === color) {
	          returnPieces.push(testSquare);
	        }
	      });
	    });
	    return returnPieces;
	  },
	  findAllLegalMovesByPiece: function findAllLegalMovesByPiece(piece, board, specMoves) {
	    var _this2 = this;
	
	    var allSquares = [];
	    var allMoves = void 0;
	    for (var i = 0; i < 8; i++) {
	      for (var j = 0; j < 8; j++) {
	        allSquares.push([j, i]);
	      }
	    }
	    if (piece.type === 'r') {
	      allMoves = allSquares.filter(function (square) {
	        return _this2.rookMoves(piece.pos, square[0], square[1]);
	      }).filter(function (square) {
	        return _this2.canMove(square[0], square[1], board, piece.pos, specMoves);
	      }).map(function (move) {
	        return [piece.pos, move];
	      });
	    }
	
	    if (piece.type === 'n') {
	      allMoves = allSquares.filter(function (square) {
	        return _this2.knightMoves(piece.pos, square[0], square[1]);
	      }).filter(function (square) {
	        return _this2.canMove(square[0], square[1], board, piece.pos, specMoves);
	      }).map(function (move) {
	        return [piece.pos, move];
	      });
	    }
	
	    if (piece.type === 'b') {
	      allMoves = allSquares.filter(function (square) {
	        return _this2.bishopMoves(piece.pos, square[0], square[1]);
	      }).filter(function (square) {
	        return _this2.canMove(square[0], square[1], board, piece.pos, specMoves);
	      }).map(function (move) {
	        return [piece.pos, move];
	      });
	    }
	
	    if (piece.type === 'q') {
	      allMoves = allSquares.filter(function (square) {
	        return _this2.queenMoves(piece.pos, square[0], square[1]);
	      }).filter(function (square) {
	        return _this2.canMove(square[0], square[1], board, piece.pos, specMoves);
	      }).map(function (move) {
	        return [piece.pos, move];
	      });
	    }
	
	    if (piece.type === 'p') {
	      allMoves = allSquares.filter(function (square) {
	        return _this2.pawnMoves(square[0], square[1], piece.pos, board);
	      }).filter(function (square) {
	        return _this2.canMove(square[0], square[1], board, piece.pos, specMoves);
	      }).map(function (move) {
	        return [piece.pos, move];
	      });
	    }
	
	    if (piece.type === 'k') {
	      allMoves = allSquares.filter(function (square) {
	        return _this2.kingMoves(piece.pos, square[0], square[1]);
	      }).filter(function (square) {
	        return _this2.canMove(square[0], square[1], board, piece.pos, specMoves);
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
	  canMove: function canMove(toX, toY, pieces, from, specMoves) {
	    this.specialMoves = specMoves;
	    // if (from[0] === 4 && from[1] === 0 && toX === 5 && toY === 1) debugger
	    if (this.notInCheck(toX, toY, from, pieces)) {
	      if (this.checkMove(toX, toY, pieces, from)) return true;
	    }
	    return false;
	  },
	  bishopMoves: function bishopMoves(selected, toX, toY) {
	    var _selected = _slicedToArray(selected, 2),
	        x = _selected[0],
	        y = _selected[1];
	
	    var dx = toX - x;
	    var dy = toY - y;
	    return Math.abs(dx) / Math.abs(dy) === 1;
	  },
	  rookMoves: function rookMoves(selected, toX, toY) {
	    var _selected2 = _slicedToArray(selected, 2),
	        x = _selected2[0],
	        y = _selected2[1];
	
	    var dx = toX - x;
	    var dy = toY - y;
	    return dx === 0 && dy !== 0 || dy === 0 && dx !== 0;
	  },
	  queenMoves: function queenMoves(selected, toX, toY) {
	    var _selected3 = _slicedToArray(selected, 2),
	        x = _selected3[0],
	        y = _selected3[1];
	
	    var dx = toX - x;
	    var dy = toY - y;
	    return Math.abs(dx) / Math.abs(dy) === 1 || dx === 0 && dy !== 0 || dy === 0 && dx !== 0;
	  },
	  knightMoves: function knightMoves(selected, toX, toY) {
	    var _selected4 = _slicedToArray(selected, 2),
	        x = _selected4[0],
	        y = _selected4[1];
	
	    var dx = toX - x;
	    var dy = toY - y;
	    return Math.abs(dx) === 2 && Math.abs(dy) === 1 || Math.abs(dx) === 1 && Math.abs(dy) === 2;
	  },
	  kingMoves: function kingMoves(selected, toX, toY) {
	    var _selected5 = _slicedToArray(selected, 2),
	        x = _selected5[0],
	        y = _selected5[1];
	
	    var dx = toX - x;
	    var dy = toY - y;
	    return Math.abs(dx) <= 1 && Math.abs(dy) <= 1 && Math.abs(dx) + Math.abs(dy) > 0 || x === 4 && y === 0 && (toX === 6 || toX === 2);
	  },
	  checkPawnCaptures: function checkPawnCaptures(toX, toY, pawn, pieces) {
	    var _pawn = _slicedToArray(pawn, 2),
	        x = _pawn[0],
	        y = _pawn[1];
	
	    var color = pieces[y][x][0][0];
	    var oppColor = color === 'w' ? 'b' : 'w';
	    var dX = toX - x;
	    var dY = toY - y;
	    var enPassant = this.specialMoves[color].enPassant;
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
	    var testBoard = this.dupe(pieces);
	    var afterMove = this.testMove(testBoard, from, [toX, toY]);
	    var king = this.findKing(afterMove, color); //[y,x];
	    if (this.findAttackers(king, afterMove, color === 'w' ? 'b' : 'w', false).length > 0) {
	      return false;
	    } else {
	      return true;
	    }
	  },
	  findAttackers: function findAttackers(piece, board, colorToCheck, sameSide) {
	    var _this3 = this;
	
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
	        if (board[y][x][0] === colorToCheck + '-b' && _this3.checkObstruction(x, y, piece, board, sameSide)) {
	          returnResult.push([true, 'b']);
	        } else if (board[y][x][0] === colorToCheck + '-q' && _this3.checkObstruction(x, y, piece, board, sameSide)) {
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
	        if (board[y][x][0] === colorToCheck + '-r' && _this3.checkObstruction(x, y, piece, board, sameSide)) {
	          returnResult.push([true, 'r']);
	        } else if (board[y][x][0] === colorToCheck + '-q' && _this3.checkObstruction(x, y, piece, board, sameSide)) {
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
	        return this.knightMoves(pos, toX, toY);
	      }
	    } else if (piece[2] === 'b') {
	      if (this.checkObstruction(toX, toY, pos, pieces)) {
	        return this.bishopMoves(pos, toX, toY);
	      }
	    } else if (piece[2] === 'r') {
	      if (this.checkObstruction(toX, toY, pos, pieces)) {
	        return this.rookMoves(pos, toX, toY);
	      }
	    } else if (piece[2] === 'q') {
	      if (this.checkObstruction(toX, toY, pos, pieces)) {
	        return this.queenMoves(pos, toX, toY);
	      }
	    } else if (piece[2] === 'k') {
	      if (this.checkObstruction(toX, toY, pos, pieces)) {
	        if (this.checkCastle(pos, toX, toY, pieces)) {
	          return true;
	        } else {
	          return this.kingMoves(pos, toX, toY);
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
	  checkPawnObstruction: function checkPawnObstruction(toX, toY, pieces) {
	    if (pieces[toY][toX][0][0] !== 'n') {
	      return false;
	    }
	    return true;
	  },
	  checkCastle: function checkCastle(pos, toX, toY, pieces) {
	    if (pos[0] !== 4) return false;
	
	    var king = [pos[1], pos[0]];
	    var color = pieces[pos[1]][pos[0]][0][0];
	    if (this.findAttackers(king, pieces, color === 'w' ? 'b' : 'w', false).length > 0) {
	      return false;
	    }
	    if (toX === 2 && toY === pos[1] && this.checkObstruction(toX - 1, toY, pos, pieces) && this.notInCheck(toX + 1, toY, pos, pieces) && this.findAttackers(king, pieces, color === 'w' ? 'b' : 'w', false).length === 0) {
	      return this.specialMoves[color].castleQueenSideStatus;
	    } else if (toX === 6 && toY === pos[1] && this.checkObstruction(toX, toY, pos, pieces) && this.notInCheck(toX - 1, toY, pos, pieces) && this.findAttackers(king, pieces, color === 'w' ? 'b' : 'w', false).length === 0) {
	      return this.specialMoves[color].castleKingSideStatus;
	    }
	  },
	  checkObstruction: function checkObstruction(toX, toY, from, pieces) {
	    var sameSide = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
	
	    var _from = _slicedToArray(from, 2),
	        x = _from[0],
	        y = _from[1];
	
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
	    var _from2 = _slicedToArray(from, 2),
	        x = _from2[0],
	        y = _from2[1];
	
	    var color = pieces[y][x][0][0];
	    var oppColor = color === 'w' ? 'b' : 'w';
	    var rightSide = toX < 7 ? pieces[toY][toX + 1][0] : ['n-l'];
	    var leftSide = toX > 0 ? pieces[toY][toX - 1][0] : ['n-l'];
	    this.specialMoves[oppColor].enPassant = { status: false, pos: [] };
	    if (leftSide[2] === 'p' && leftSide[0] === oppColor) {
	      this.specialMoves[oppColor].enPassant = { status: true, pos: [toX - 1, toY, 1] };
	    } else if (rightSide[2] === 'p' && rightSide[0] === oppColor) {
	      this.specialMoves[oppColor].enPassant = { status: true, pos: [toX + 1, toY, -1] };
	    }
	  },
	  captureEnPassant: function captureEnPassant(x, y, pieces) {
	    pieces[y][x][0] = 'n-l';
	  },
	  pawnMoves: function pawnMoves(toX, toY, from, pieces) {
	    var _from3 = _slicedToArray(from, 2),
	        x = _from3[0],
	        y = _from3[1];
	
	    var color = pieces[y][x][0][0];
	    var dx = color === 'w' ? toX - x : x - toX;
	    var dy = color === 'w' ? toY - y : y - toY;
	    return dx === 0 && dy === -1 || y === 6 && dy === -2 && dx === 0 && pieces[5][x][0][0] === 'n' || y === 1 && dy === -2 && dx === 0 && pieces[2][x][0][0] === 'n' || this.checkPawnCaptures(toX, toY, from, pieces);
	  }
	};

/***/ }
/******/ ]);
//# sourceMappingURL=9363e0f9a8fec65d5ac2.worker.js.map