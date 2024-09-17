import React, { useEffect, useState } from 'react';
import styles from './WalletTransactionLog.module.css';
import {
  getUsers,
  getWallets,
  getUserWallets,
  getWalletZapsSince,
} from '../services/lnbitsServiceLocal';
import ArrowIncoming from '../images/ArrowIncoming.svg';

interface WalletTransaction {
  description: string;
  amount: number;
  timestamp: string;
  from: string;
}

interface WalletTransactionLogProps {
    timestamp?: number | null;
  }

  const adminKey = process.env.REACT_APP_LNBITS_ADMINKEY as string;

const WalletTransactionLog: React.FC<WalletTransactionLogProps> = ({ timestamp }) =>  {
    
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

    let allZaps: Zap[] = [];

    const users = await getUsers(adminKey, {});

    if (users) {
      for (const user of users) {
        const wallets = await getUserWallets(adminKey, user.id); // We'll just look at the private wallets.

        // Loop through all the wallets
        if (wallets) {
          const allowanceWallets = wallets.filter(
            wallet => wallet.name === 'Allowance',
          );

          for (const wallet of allowanceWallets) {
            const zaps = await getWalletZapsSince(
              wallet.inkey,
              paymentsSinceTimestamp,
            );

            allZaps = allZaps.concat(zaps);
          }
        }
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
  
  //const [payments, setPayments] = useState([]);
  
  // Calculate the timestamp for 7 days ago
    // //const sevenDaysAgo = Date.now() / 1000 - 7 * 24 * 60 * 60;
    
    // // Use the provided timestamp or default to 7 days ago
    // const paymentsSinceTimestamp =
    //   timestamp === null || timestamp === undefined || timestamp === 0
    //     ? sevenDaysAgo
    //     : timestamp;
    
    // const fetchZaps = async () => {
      
    //   console.log('Fetching transactions ...');
    //   const wallets = await lnbitsService.getWallets();
    //   for (const wallet of wallets) {
    //     const walletInKey = wallet.inkey;
    //     //const zaps = await lnbitsService.getPayments(walletInKey);
    //     const payments = await lnbitsService.getPaymentsSince(
    //       walletInKey,
    //       paymentsSinceTimestamp,
    //     );
    //     console.log('Payments: ', payments.length);
    //     setPayments(payments);
    //   }
    //   //if (walletInKey) {
    //   // else {
    //   //  console.error('WalletInKey is null');
    //   //}
    // };
    
    // useEffect(() => {
    //   fetchZaps();
    // }, [timestamp]);
  
    return (
    <div className={styles.feedlist}>
      {/* <div className={styles.headercell}>
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
      </div> */}
      {zaps?.map((payment, index) => (
        <div className={styles.bodycell}>
          <div className={styles.bodyContents}>
            <div className={styles.mainContentStack}>
                <img className={styles.avatarIcon} alt="" src={ArrowIncoming} />
              {/* <div className={styles.personDetails}>
                <div className={styles.userName}>Ben Weeks</div>
              </div> */}
              <div className={styles.userName}>
                <p className={styles.lightHelightInItems}> <b>Zap!</b></p>
                <div className={styles.lightHelightInItems}>2 days ago from Ben Weeks </div>
                <p className={styles.lightHelightInItems}>For being happy to show the same demo second time when the end
                user joined the call</p>
                
              </div>
            </div>
            <div className={styles.transactionDetailsAllowance}>
              
              <div className={styles.lightHelightInItems}> <b className={styles.b}>+ 241,000</b> Sats </div>
              <div className={styles.lightHelightInItems}> about $0.11 </div>
        

            </div>
          </div>
        </div>
      ))}
    </div>
    );
};

export default WalletTransactionLog;
