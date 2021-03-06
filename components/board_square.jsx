import React, { Component, PropTypes } from 'react';
import Square from './square';
import { canMove, move } from '../logic/game';
import { ItemTypes } from '../constants/item_types';
import { DropTarget } from 'react-dnd';

const squareTarget = {

  canDrop(props) {
    return canMove(props.x, props.y);
  },

  drop(props) {
    move(props.x, props.y);
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

class BoardSquare extends Component {
  renderOverlay(color) {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        zIndex: 1,
        opacity: 0.5,
        backgroundColor: color,
      }} />
    );
  }

  render() {
    const { x, y, connectDropTarget, isOver, canDrop } = this.props;
    const black = (x + y) % 2 === 1;
    return connectDropTarget(
      <div style={{ position: 'relative',
        width: '100%',
        height: '100%' }}>
        <Square black={black}>
          {this.props.children}
        </Square>
        {isOver && !canDrop && this.renderOverlay('red')}
        {!isOver && canDrop && this.renderOverlay('yellow')}
        {isOver && canDrop && this.renderOverlay('green')}
      </div>
    );
  }
}

export default DropTarget(ItemTypes.PIECES, squareTarget, collect)(BoardSquare);
