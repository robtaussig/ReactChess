import React, { Component, PropTypes } from 'react';
import Board from './board';
import { observe } from '../logic/game';


export default class Home extends Component {

  constructor(props) {
    super(props);
    this.unobserve = observe(this.handleChange.bind(this));
  }

  handleChange(board) {
    const nextState = board ;
    if (this.state) {
      this.setState(nextState);
    } else {
      this.state = nextState;
    }
  }

  componentWillUnmount() {
    this.unobserve();
  }

  render() {
    const board = this.state.pieces;
    return (
      <div>
        <div style={{
            width: '80vmin',
            height: '80vmin',
            border: '1px solid gray'
          }}>
          <Board board={board} />
        </div>
      </div>
    );
  }
}
