import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ZapLog from './pages/ZapLog';
import Leaderboard from './pages/Leaderboard';
import Feed from './pages/Feed';
import Rewards from './pages/Rewards';
import Bounties from './pages/Bounties';

function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route path="/zap-log">
            <ZapLog />
          </Route>
          <Route path="/leaderboard">
            <Leaderboard />
          </Route>
          <Route path="/feed">
            <Feed />
          </Route>
          <Route path="/rewards">
            <Rewards />
          </Route>
          <Route path="/bounties">
            <Bounties />
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;