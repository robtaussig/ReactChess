import React, { Component, PropTypes } from 'react';

export default class Square extends Component {
  render() {
    const { black } = this.props;
    const fill = black ? '#8f8fbf' : 'white';
    const stroke = black ? 'white' : 'black';

    return (
      <div style={{
        backgroundColor: fill,
        borderLeft: '2px solid #000',
        borderTop: '2px solid #000',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box'
      }}>
        {this.props.children}
      </div>
    );
  }
}
