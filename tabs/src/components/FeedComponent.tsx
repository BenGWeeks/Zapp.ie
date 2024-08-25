import { FunctionComponent, useCallback, useState } from 'react';
import styles from './FeedComponent.module.css';
import FeedList from './FeedList';
import React from 'react';

const FeedComponent: FunctionComponent = () => {
  const [timestamp, setTimestamp] = useState<number>(0);
  const [activePeriod, setActivePeriod] = useState<number | null>(null);

  const onTabContainerClick = useCallback(() => {
    // Add your code here
  }, []);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = today.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  const handlePeriodClick = (days: number) => {
    const currentDate = new Date();
    const futureDate = new Date(
      currentDate.getTime() + days * 24 * 60 * 60 * 1000,
    ); // Corrected to milliseconds
    const futureTimestamp = Math.floor(futureDate.getTime() / 1000); // Convert to seconds
    setTimestamp(futureTimestamp);
    console.log(`handlePeriodClick: futureTimestamp: ${futureTimestamp}`);
  };

  return (
    <div className={styles.feedcomponent}>
      <div className={styles.tabs}>
        <div className={styles.tab}>
          <div className={styles.base}>
            <div className={styles.stringBadgeIconStack}>
              <b className={styles.stringTabTitle}>Feed</b>
            </div>
            <div className={styles.borderPaddingStack}>
              <div className={styles.borderBottom} />
            </div>
          </div>
        </div>
        <div className={styles.tab1} onClick={onTabContainerClick}>
          <div className={styles.base1}>
            <div className={styles.stringBadgeIconStack}>
              <div className={styles.stringTabTitle}>Leaderboard</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.infoStrip}>
        <b className={styles.jan12020}>Jan 1, 2020 - Jan 30, 2020</b>
        <div className={styles.dateRange}>Date range:</div>
        <div className={styles.div}>|</div>
        <b className={styles.all}>All</b>
        <div className={styles.groups}>
          <span>Groups:</span>
        </div>
        <div className={styles.div1}>|</div>
        <b className={styles.all1}>All</b>
        <div className={styles.location}>Location:</div>
        <div className={styles.div2}>|</div>
        <div className={styles.amPt}>{formattedTime} (Local Time)</div>
        <div className={styles.dateContainer}>
          <b>{formattedDate}</b>
        </div>
      </div>
      <div className={styles.pivotPointsdoubleFull60}>
        <div
          className={styles.daysCopy}
          onClick={() => handlePeriodClick(60)}
          style={{ fontWeight: activePeriod === 60 ? 'bold' : 'normal' }}
        >
          60 days
        </div>
        <div
          className={styles.daysCopy3}
          onClick={() => handlePeriodClick(30)}
          style={{ fontWeight: activePeriod === 30 ? 'bold' : 'normal' }}
        >
          30 days
        </div>
        <div
          className={styles.daysCopy1}
          onClick={() => handlePeriodClick(7)}
          style={{ fontWeight: activePeriod === 7 ? 'bold' : 'normal' }}
        >
          7 days
        </div>
      </div>
      <FeedList timestamp={timestamp} />
    </div>
  );
};

export default FeedComponent;
