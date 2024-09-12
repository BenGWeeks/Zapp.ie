/// <reference path="../types/global.d.ts" />

import { useEffect, useState, useCallback } from 'react';
import styles from './FeedList.module.css';
import { getWallets, getPaymentsSince } from '../services/lnbitsServiceLocal';
import { getUserName } from '../utils/walletUtilities';
import ZapIcon from '../images/ZapIcon.svg';
import { debounce } from 'lodash';

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

    const wallets = await getWallets('Receiving'); // We'll just look at the receiving wallets.
    let allZaps: Zap[] = [];

    // Loop through all the wallets
    if (wallets) {
      for (const wallet of wallets) {
        const payments = await getPaymentsSince(
          wallet.inkey,
          paymentsSinceTimestamp,
        );

        // Loop through all the payments for the current wallet
        for (const payment of payments) {
          const zap: Zap = {
            id: payment.checking_id,
            bolt11: payment.bolt11,
            from: getUserName(payment.extra?.from),
            to: getUserName(payment.extra?.to),
            memo: payment.memo,
            amount: payment.amount / 1000,
            wallet_id: payment.wallet_id,
            time: payment.time,
          };

          allZaps.push(zap);
        }
      }
    }

    setZaps(allZaps);
  };

  // Debounce the fetchZaps function
  const debouncedFetchZaps = useCallback(debounce(fetchZaps, 300), [fetchZaps]);

  useEffect(() => {
    debouncedFetchZaps();
    return () => {
      debouncedFetchZaps.cancel();
    };
  }, [debouncedFetchZaps]);

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