import { FunctionComponent, useEffect } from 'react';
import styles from './FeedList.module.css';
import React, { useState } from 'react';
import lnbitsService from '../services/lnbitsServiceLocal'; // Symbolic link

interface FeedListProps {
  timestamp?: number | null;
}

const FeedList: React.FC<FeedListProps> = ({ timestamp }) => {
  const [payments, setPayments] = useState([]);

  // Calculate the timestamp for 7 days ago
  const sevenDaysAgo = Date.now() / 1000 - 7 * 24 * 60 * 60;

  // Use the provided timestamp or default to 7 days ago
  const paymentsSinceTimestamp =
    timestamp === null || timestamp === undefined || timestamp === 0
      ? sevenDaysAgo
      : timestamp;

  const fetchZaps = async () => {
    console.log('Fetching transactions ...');
    const wallets = await lnbitsService.getWallets();
    for (const wallet of wallets) {
      const walletInKey = wallet.inkey;
      //const zaps = await lnbitsService.getPayments(walletInKey);
      const payments = await lnbitsService.getPaymentsSince(
        walletInKey,
        paymentsSinceTimestamp,
      );
      console.log('Payments: ', payments.length);
      setPayments(payments);
    }
    //if (walletInKey) {
    // else {
    //  console.error('WalletInKey is null');
    //}
  };

  useEffect(() => {
    fetchZaps();
  }, [timestamp]);

  return (
    <div className={styles.feedlist}>
      <div className={styles.headercell}>
        <div className={styles.headerContents}>
          <b className={styles.string}>From</b>
          <b className={styles.string}>To</b>
          <b className={styles.string2}>Reason</b>
          <div className={styles.stringWrapper}>
            <b className={styles.string3}>Zap amount</b>
          </div>
          <div className={styles.buttonsStack}>
            <div className={styles.iconbutton}>
              <div className={styles.base}>
                <div className={styles.buttonsStack}>
                  <img
                    className={styles.iconContent}
                    alt=""
                    src="Icon-content.svg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {payments?.map((payment, index) => (
        <div className={styles.bodycell}>
          <div className={styles.bodyContents}>
            <div className={styles.mainContentStack}>
              <div className={styles.personDetails}>
                <img className={styles.avatarIcon} alt="" src="avatar.png" />
                <div className={styles.userName}>Ben Weeks</div>
              </div>
              <div className={styles.personDetails}>
                <img className={styles.avatarIcon} alt="" src="avatar.png" />
                <div className={styles.userName}>Ben Weeks</div>
              </div>
              <div className={styles.userName}>
                For being happy to show the same demo second time when the end
                user joined the call
              </div>
            </div>
            <div className={styles.transactionDetails}>
              <b className={styles.b}>241,000</b>
              <img className={styles.icon} alt="" src="Icon.svg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedList;
