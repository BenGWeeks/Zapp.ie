import React, { useState } from 'react';
import FeedComponent from './components/FeedComponent';
import ZapActivityChartComponent from './components/ZapActivityChartComponent';

const Home: React.FC = () => {
  const inKey = 'ca04dc4dbc114b298f6d121b1d4ffc8e'; // Hardcoded to my wallet for now.
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
