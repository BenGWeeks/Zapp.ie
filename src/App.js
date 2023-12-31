import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Home from './pages/admin/Home';
import Bounties from './pages/Bounties';
import Feed from './pages/Feed';
import Leaderboard from './pages/Leaderboard';
import Rewards from './pages/Rewards';
import ZapLog from './pages/ZapLog';

const App = () => {
  return (
    <Router>
      <div>
        <h1>Hello, world!</h1>
        <nav>
          <Link to="/admin">Admin</Link>
          <Link to="/bounties">Bounties</Link>
          <Link to="/feed">Feed</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/rewards">Rewards</Link>
          <Link to="/zaplog">ZapLog</Link>
        </nav>
        <Route path="/admin" component={Home} />
        <Route path="/bounties" component={Bounties} />
        <Route path="/feed" component={Feed} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route path="/rewards" component={Rewards} />
        <Route path="/zaplog" component={ZapLog} />
      </div>
    </Router>
  );
};

export default App;
