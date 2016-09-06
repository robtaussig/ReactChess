import React, { Component, PropTypes } from 'react';
import { ItemTypes } from '../../constants/item_types';
import { DragSource } from 'react-dnd';

const pawnSource = {
  beginDrag(props) {
    return {pieceId: props.id};
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

class Pawn extends Component {

  render() {
    const { connectDragSource, isDragging } = this.props;
    return connectDragSource(
      <div style={{
        opacity: isDragging ? 0.5 : 1,
        fontSize: '9vmin',
        textAlign: 'center',
        lineHeight: '10vmin',
        backgroundColor: 'transparent',
        fontWeight: 'bold',
        cursor: 'pointer'
      }}>
        {this.props.color === 'white' ? '♙' : '♟'}
      </div>
    );
  }
}

Pawn.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
};

export default DragSource(ItemTypes.PAWN, pawnSource, collect)(Pawn);
