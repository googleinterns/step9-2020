import './App.css';

import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';

import PageNav from './components/PageNav/PageNav';
import React from 'react';
import Search from './components/Search/Search';
import SentimentAnalysis from './components/SentimentAnalysis/SentimentAnalysis';
import Visualization from './components/Visualization/Visualization';

const App = () => (
  <Router>
    <div>
      <PageNav />
      <Switch>
        <Route path="/visualization" component={Visualization} />
        <Route path="/analysis" component={SentimentAnalysis} />
        <Route path="/search" component={Search} />
        <Redirect exact from="/" to="search" />
      </Switch>
    </div>
  </Router>
);

export default App;
