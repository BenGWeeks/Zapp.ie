/// <reference path="../types/global.d.ts" />

import { useEffect } from 'react';
import styles from './FeedList.module.css';
import React, { useState } from 'react';
import { getWallets, getWalletZapsSince } from '../services/lnbitsServiceLocal';
import ZapIcon from '../images/ZapIcon.svg';

interface FeedListProps {
  timestamp?: number | null;
}

const FeedList: React.FC<FeedListProps> = ({ timestamp }) => {
  const [zaps, setZaps] = useState<Zap[]>([]);

  // Calculate the timestamp for 7 days ago
  const sevenDaysAgo = Date.now() / 1000 - 7 * 24 * 60 * 60;

  // Use the provided timestamp or default to 7 days ago
  const paymentsSinceTimestamp =
    timestamp === null || timestamp === undefined || timestamp === 0
      ? sevenDaysAgo
      : timestamp;

  const fetchZaps = async () => {
    console.log('Fetching payments since: ', paymentsSinceTimestamp);

    const wallets = await getWallets('Private'); // We'll just look at the private wallets.
    let allZaps: Zap[] = [];

    // Loop through all the wallets
    if (wallets) {
      for (const wallet of wallets) {
        const zaps = await getWalletZapsSince(
          wallet.inkey,
          paymentsSinceTimestamp,
        );

        allZaps = allZaps.concat(zaps);
      }
    }
    //setZaps(zaps);
    setZaps(prevState => [...prevState, ...allZaps]);
    //setZaps(allZaps);
  };

  useEffect(() => {
    // Clear the zaps
    setZaps([]);
    fetchZaps();
  }, [timestamp]);

  return (
    <div className={styles.feedlist}>
      <div className={styles.headercell}>
        <div className={styles.headerContents}>
          <b className={styles.string}>Time</b>
          <b className={styles.string}>From</b>
          <b className={styles.string}>To</b>
          <b className={styles.string2}>Memo</b>
          <div className={styles.stringWrapper}>
            <b className={styles.string3}>Amount</b>
          </div>
        </div>
      </div>
      {zaps
        ?.sort((a, b) => b.time - a.time)
        .map((zap, index) => (
          <div key={zap.id || index} className={styles.bodycell}>
            <div className={styles.bodyContents}>
              <div className={styles.mainContentStack}>
                <div className={styles.personDetails}>
                  <div className={styles.userName}>
                    {new Date(zap.time * 1000).toLocaleDateString()}{' '}
                    {new Date(zap.time * 1000).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <div className={styles.personDetails}>
                  <img
                    className={styles.avatarIcon}
                    alt=""
                    src="avatar.png"
                    style={{ display: 'none' }}
                  />
                  <div className={styles.userName}>{zap.from}</div>
                </div>
                <div className={styles.personDetails}>
                  <img
                    className={styles.avatarIcon}
                    alt=""
                    src="avatar.png"
                    style={{ display: 'none' }}
                  />
                  <div className={styles.userName}>{zap.to}</div>
                </div>
                <div className={styles.userName}>{zap.memo}</div>
              </div>
              <div className={styles.transactionDetails}>
                <b className={styles.b}>{zap.amount}</b>
                <img className={styles.icon} alt="" src={ZapIcon} />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default FeedList;
