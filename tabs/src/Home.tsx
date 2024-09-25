import React, { useState } from 'react';
import FeedComponent from './components/FeedComponent';
import ZapActivityChartComponent from './components/ZapActivityChartComponent';
import Leaderboard from './components/Leaderboard';
import styles from './components/Leaderboard.module.css';

const Home: React.FC = () => {
  const inKey = 'a77d1194b4f348b1a61e4e2938b5762f'; // TODO: Hardcoded to Ben's Allowance wallet for now.
  const [timestamp] = useState(() => {
    return Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 365 * (8.5 / 12); // Last 8.5 months
  });

  return (
    <div>
      <ZapActivityChartComponent lnKey={inKey} timestamp={timestamp} />
      <br />
      <FeedComponent />
    </div>
  );
};

export default Home;
