import React, { Component, PropTypes } from 'react';
import { ItemTypes } from '../../constants/item_types';
import { DragSource } from 'react-dnd';

const rookSource = {
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

class Rook extends Component {

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
        {this.props.color === 'white' ? '♖' : '♜'}
      </div>
    );
  }
}

Rook.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
};

export default DragSource(ItemTypes.KNIGHT, rookSource, collect)(Rook);
