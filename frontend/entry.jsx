import React from 'react';
import ReactDOM from 'react-dom';
import Knight from './components/pieces/knight';
import Square from './components/square';
import Home from './components/home';
import Board from './components/board';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

const App = React.createClass({
  render() {
    return (
      <div id="app">
        {this.props.children}
      </div>
    );
  }
});

const router = (
 <Router history={browserHistory}>
   <Route path="/" component={App}>
     <IndexRoute component={Home}/>
   </Route>
 </Router>
);

document.addEventListener('DOMContentLoaded', ()=> {
  const root = document.querySelector('#content');
  ReactDOM.render(
    router,
    root
  );
});
