import React, { Component, PropTypes } from 'react';
import Board from './board';
import { observe } from '../logic/game';
const MoveActions = require('../actions/move_actions.js');
const MoveStore = require('../stores/move_store.js');


export default class Home extends Component {

  constructor(props) {
    super(props);
    this.unobserve = observe(this.handleChange.bind(this));
    // MoveStore.addEventListener(this.receiveMove);
  }

  handleChange(board,currentSide) {
    const nextState = board ;
    if (this.state) {
      this.setState(nextState);
    } else {
      this.state = nextState;
    }
    if (currentSide === 'b') {
      MoveActions.fetchMove(board,currentSide,3);
    }
  }

  receiveMove(from, to) {

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
