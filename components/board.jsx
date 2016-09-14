import React, { Component, PropTypes } from 'react';
import { DragDropContext } from 'react-dnd';
import Square from './square';
import Knight from './pieces/knight';
import Bishop from './pieces/bishop';
import Pawn from './pieces/pawn';
import Rook from './pieces/rook';
import Queen from './pieces/queen';
import King from './pieces/king';
import BoardSquare from './board_square';
import { canMove, move } from '../logic/game';
const HTML5Backend = require('react-dnd-html5-backend');
const TouchBackend = require('react-dnd-touch-backend');
const Backend = isTouchScreen() ? TouchBackend : HTML5Backend;

function isTouchScreen () {
  return 'ontouchstart' in window;
}

class Board extends Component {
  renderSquare(i) {
    const x = i % 8;
    const y = Math.floor(i / 8);
    return (
      <div key={i}
           style={{ width: '12.5%', height: '12.5%' }}>
        <BoardSquare x={x}
                     y={y}>
          {this.renderPiece(x, y)}
        </BoardSquare>
      </div>
    );
  }

  parsePiece (x,y) {

    let piece, color;
    if (this.props.board) {
      if (this.props.board[y][x][0] !== 'n-l') {
        piece = this.props.board[y][x][0][2];
        color = this.props.board[y][x][0][0] === 'w' ? '#1057b7' : '#000';
      }

        if (piece === 'p') {
          return <Pawn color={color} pos={[x,y]} type='pawn'/>;
        } else if (piece === 'r') {
          return <Rook color={color} pos={[x,y]} type='rook'/>;
        } else if (piece === 'n') {
          return <Knight color={color} pos={[x,y]} type='knight'/>;
        } else if (piece === 'b') {
          return <Bishop color={color} pos={[x,y]} type='bishop'/>;
        } else if (piece === 'q') {
          return <Queen color={color} pos={[x,y]} type='queen'/>;
        } else if (piece === 'k') {
          return <King color={color} pos={[x,y]} type='king'/>;
        }
    }
  }

  renderPiece(x, y) {
    return this.parsePiece(x,y);
  }

  handleSquareClick(toX, toY) {
    if (canMove(toX, toY)) {
      move(toX, toY);
    }
  }

  render() {
    const squares = [];
    for (let i = 0; i < 64; i++) {
      squares.push(this.renderSquare(i));
    }

    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        borderRight: '2px solid #000',
        borderBottom: '2px solid #000',
        flexWrap: 'wrap'
      }}>
        {squares}
      </div>
    );
  }
}

export default DragDropContext(Backend)(Board);
