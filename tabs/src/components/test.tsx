import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import styles from './FeedComponent.module.css';
import FeedList from './FeedList';
import React from 'react';
import { getWallets, getTotalSentAmount } from '../services/lnbitsServiceLocal';

const FeedComponent: FunctionComponent = () => {
  const [timestamp, setTimestamp] = useState<number>(0);
  const [activePeriod, setActivePeriod] = useState<number | null>(7); // Set default to 7-days
  const [totalSentAmount, setTotalSentAmount] = useState<number>(0);

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
    const futureTimestamp = Date.now() / 1000 - days * 24 * 60 * 60;
    setTimestamp(futureTimestamp);
    setActivePeriod(days);
    console.log(`handlePeriodClick: futureTimestamp: ${futureTimestamp}`);
  };

  useEffect(() => {
    const fetchTotalSentAmount = async () => {
      try {
        const wallets = await getWallets();
        let totalAmount = 0;

        if (wallets) {
          for (const wallet of wallets) {
            const amount = await getTotalSentAmount(wallet.inkey);
            totalAmount += amount;
          }
        }

        setTotalSentAmount(totalAmount);
      } catch (error) {
        console.error('Error fetching total sent amount:', error);
      }
    };

    fetchTotalSentAmount();
  }, []);

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
      <div className={styles.infoStrip} style={{ display: 'none' }}>
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
          className={
            activePeriod === 7 ? styles.daysActive : styles.daysInactive
          }
          onClick={() => handlePeriodClick(7)}
          style={{ fontWeight: activePeriod === 7 ? 'bold' : 'normal' }}
        >
          7 days
        </div>
        <div
          className={
            activePeriod === 30 ? styles.daysActive : styles.daysInactive
          }
          onClick={() => handlePeriodClick(30)}
          style={{ fontWeight: activePeriod === 30 ? 'bold' : 'normal' }}
        >
          30 days
        </div>
        <div
          className={
            activePeriod === 60 ? styles.daysActive : styles.daysInactive
          }
          onClick={() => handlePeriodClick(60)}
          style={{ fontWeight: activePeriod === 60 ? 'bold' : 'normal' }}
        >
          60 days
        </div>
      </div>
      <div>Total Sent Amount: {totalSentAmount} Sats</div>
      <FeedList timestamp={timestamp} />
    </div>
  );
};

export default FeedComponent;