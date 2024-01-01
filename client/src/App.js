import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Home from './pages/admin/Home';
import Users from './pages/admin/Users';
import LightningWallet from './pages/admin/LightningWallet';
import Bounties from './pages/Bounties';
import Feed from './pages/Feed';
import Leaderboard from './pages/Leaderboard';
import Rewards from './pages/Rewards';
import ZapLog from './pages/ZapLog';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul style={{ listStyleType: 'none', display: 'flex', justifyContent: 'space-around' }}>
            <li><Link to="/admin">Admin</Link></li>
            <li><Link to="/bounties">Bounties</Link></li>
            <li><Link to="/feed">Feed</Link></li>
            <li><Link to="/reports">Reports</Link></li>
            <li><Link to="/rewards">Rewards</Link></li>
            <li><Link to="/zaplog">ZapLog</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/admin" element={<Home />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/lightningwallet" element={<LightningWallet />} />
          <Route path="/bounties" element={<Bounties />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/zaplog" element={<ZapLog />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
