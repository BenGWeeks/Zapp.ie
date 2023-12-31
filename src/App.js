import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
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
        <Routes>
          <Route path="/admin" element={<Home />} />
          <Route path="/bounties" element={<Bounties />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/zaplog" element={<ZapLog />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
