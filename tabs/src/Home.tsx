import React from 'react';
import FeedComponent from './components/FeedComponent';
import Leaderboard from './components/Leaderboard';
import styles from './components/Leaderboard.module.css';

const Home: React.FC = () => {
  return (
    <div className={styles.feedcomponent}>

      <div className={styles.horizontalContainer}>
        {/* <ZapsSentComponent /> */}
        {/* <ZapChartComponent /> */}
      </div>
      <div style={{ margin: '7px 0', height: '20%' }} />
      <FeedComponent />
      <Leaderboard />
    </div>
  );
};

export default Home;
