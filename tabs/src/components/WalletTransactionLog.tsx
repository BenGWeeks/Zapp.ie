import React, { useEffect, useState } from 'react';
import styles from './WalletTransactionLog.module.css';
import {
  getUserWallets,
  getWalletZapsSince,
} from '../services/lnbitsServiceLocal';
import ArrowIncoming from '../images/ArrowIncoming.svg';
import ArrowOutgoing from '../images/ArrowOutcoming.svg';
import moment from 'moment';

interface WalletTransactionLogProps {
  timestamp?: number | null;
  activeTab?: string;
}

const adminKey = process.env.REACT_APP_LNBITS_ADMINKEY as string;

const WalletTransactionLog: React.FC<WalletTransactionLogProps> = ({ timestamp, activeTab }) => {

  const [zaps, setZaps] = useState<Zap[]>([]);

  // Calculate the timestamp for 7 days ago
  const sevenDaysAgo = Date.now() / 1000 - 7 * 24 * 60 * 60;

  // Use the provided timestamp or default to 7 days ago
  const paymentsSinceTimestamp =
    timestamp === null || timestamp === undefined || timestamp === 0
      ? sevenDaysAgo
      : timestamp;
  const activeTabForData = activeTab === null || activeTab === undefined || activeTab === '' ? 'all' : activeTab;
  console.log('activeTabForData: ', activeTabForData);

  const fetchZaps = async () => {
    console.log('Fetching payments since: ', paymentsSinceTimestamp);

    let allZaps: Zap[] = [];

    const wallets = await getUserWallets(adminKey, '2984e3ac627e4fea9fd6dde9c4df83b5'); // We'll just look at the private wallets.

    // Loop through all the wallets
    if (wallets) {
      // const allowanceWallets = wallets.filter(
      //   wallet => wallet.name === 'Private',
      // );
      console.log('Wallets1');
      for (const wallet of wallets) {
        
        const zaps = await getWalletZapsSince(
          wallet.inkey,
          paymentsSinceTimestamp,
        );

        allZaps = allZaps.concat(zaps);
        console.log('Zaps: ', allZaps);
      }
    }
    setZaps(prevState => [...prevState, ...allZaps]);
  };

  useEffect(() => {
    setZaps([]);
    fetchZaps();
  }, [timestamp]);

  return (
    <div className={styles.feedlist}>
      {zaps
        ?.sort((a, b) => b.time - a.time)
        .map((zap, index) => (
          <div key={zap.id || index} className={styles.bodycell}>
            <div className={styles.bodyContents}>
              <div className={styles.mainContentStack}>
                <img className={styles.avatarIcon} alt="" src={ zap.extra && Object.keys(zap.extra).length > 0 ? ArrowOutgoing: ArrowIncoming } />
                <div className={styles.userName}>
                  <p className={styles.lightHelightInItems}> <b>Zap! </b></p>
                  <div className={styles.lightHelightInItems}> {moment(moment.now()).diff(zap.time * 1000, 'days')} days ago from {zap.from} </div>
                  <p className={styles.lightHelightInItems}>{zap.memo}</p>
                </div>
              </div>
              <div className={styles.transactionDetailsAllowance} style={{ color: zap.extra && Object.keys(zap.extra).length > 0 ? '#E75858': '#00A14B' }} >
                <div className={styles.lightHelightInItems}> <b className={styles.b}>{ zap.extra && Object.keys(zap.extra).length > 0 ? '-': '+' } {zap.amount / 1000}</b> Sats </div>
                <div className={styles.lightHelightInItems}> about $0.11 </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default WalletTransactionLog;
