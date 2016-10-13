import React, { Component, PropTypes } from 'react';
import { ItemTypes } from '../../constants/item_types';
import { DragSource } from 'react-dnd';
import { setSelected } from '../../logic/game';
import { getEmptyImage } from 'react-dnd-html5-backend';

const pieceSource = {
  beginDrag(props) {
    setSelected(props);
    const piece = { piece: props };
    return piece;
  },

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return;
    }

    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
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
      <div id='dragging' class={isDragging ? 'dragging' : ''} style={{
        opacity: isDragging ? 0.5 : 1,
        fontSize: '9vmin',
        textAlign: 'center',
        lineHeight: '10vmin',
        color: this.props.color,
        backgroundColor: 'transparent',
        fontWeight: 'bold',
        cursor: 'pointer'
      }}>
        ♟
      </div>
    );
  }
}

Pawn.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
};

export default DragSource(ItemTypes.PAWN, pieceSource, collect)(Pawn);
