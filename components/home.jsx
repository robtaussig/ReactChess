import React, { Component, PropTypes } from 'react';
import Board from './board';
import { observe, makeComputerMove } from '../logic/game';
const MoveActions = require('../actions/move_actions.js');
const MoveStore = require('../stores/move_store.js');


export default class Home extends Component {

  constructor(props) {
    super(props);
    this.unobserve = observe(this.handleChange.bind(this));
    MoveStore.addListener(this.receiveMove.bind(this));
    this.checkmate = false;
  }

  handleChange(board,specialMoves) {
    const nextState = board ;
    if (this.state) {
      this.setState(nextState);
    } else {
      this.state = nextState;
    }
    if (specialMoves.currentSide === 'b') {
      MoveActions.fetchMove(board,specialMoves,1);
    }
  }

  setCheckmate() {
    this.setState({checkmate:true});
  }

  receiveMove() {
    let move = MoveStore.currentMove();
    switch (true) {
      case move.checkmate:
        this.setCheckmate();
        break;
      case move.castle:
        debugger
        break;
      case move.enPassant:
        debugger
        break;
      default:
        makeComputerMove(move.move);
    }
  }

  componentWillUnmount() {
    this.unobserve();
  }

  render() {
    let _display = "";
    if (this.state.checkmate) {
      _display = "Checkmate!";
    }
    const board = this.state.pieces;
    return (
      <div>
        <div>
          <div style={{
              width: '80vmin',
              height: '80vmin',
              border: '1px solid gray'
            }}>
            <Board board={board} />
          </div>
          {_display}
        </div>
      </div>
    );
  }
}
