import React from 'react';
import ReactDOM from 'react-dom';
import Knight from './components/knight';
import Square from './components/square';
import App from './components/app';
import Board from './components/board';
import { observe } from './logic/game';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

document.addEventListener('DOMContentLoaded', ()=> {
  const root = document.querySelector('#content');
  observe(knightPosition =>
    ReactDOM.render(
      <Board knightPosition={knightPosition} />,
      root
    )
  );
});
