import React, { useEffect, useState } from 'react';
import styles from './WalletTransactionLog.module.css';
import {
  getUsers,
  getWallets,
  getUserWallets,
  getWalletZapsSince,
} from '../services/lnbitsServiceLocal';
import ArrowIncoming from '../images/ArrowIncoming.svg';
import moment from 'moment';

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
    console.log('Fetching payments since Akash: ', paymentsSinceTimestamp);

    let allZaps: Zap[] = [];
        
        const wallets = await getUserWallets(adminKey, '2984e3ac627e4fea9fd6dde9c4df83b5'); // We'll just look at the private wallets.

        // Loop through all the wallets
        if (wallets) {
          const allowanceWallets = wallets.filter(
            wallet => wallet.name === 'Private',
          );

          // for (const wallet of allowanceWallets) {
          //   const zaps = await getWalletZapsSince(
          //     wallet.inkey,
          //     paymentsSinceTimestamp,
          //   );
          for (const wallet of wallets) {
            const zaps = await getWalletZapsSince(
              wallet.inkey,
              paymentsSinceTimestamp,
            );

            allZaps = allZaps.concat(zaps);

            console.log('Zaps Akash: ', allZaps);
          }
        }

    setZaps(prevState => [...prevState, ...allZaps]);

    console.log('Zaps Akash123: ', zaps);

  };

  
function getDate() {
  return new Date();

}

  useEffect(() => {
    setZaps([]);
    fetchZaps();
  },[timestamp]);
  
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

      {zaps
        ?.sort((a, b) => b.time - a.time)
        .map((zap, index) => (

          <div key={zap.id || index} className={styles.bodycell}>
          <div className={styles.bodyContents}>
            <div className={styles.mainContentStack}>
                <img className={styles.avatarIcon} alt="" src={ArrowIncoming} />
              
              <div className={styles.userName}>
                <p className={styles.lightHelightInItems}> <b>Zap! </b></p>
                <div className={styles.lightHelightInItems}> { moment(moment.now()).diff(zap.time * 1000,'days')  } days ago from {zap.from} </div>
                <p className={styles.lightHelightInItems}>{zap.memo}</p>
                
              </div>
            </div>
            <div className={styles.transactionDetailsAllowance}>
              
              <div className={styles.lightHelightInItems}> <b className={styles.b}>+ {zap.amount/1000}</b> Sats </div>
              <div className={styles.lightHelightInItems}> about $0.11 </div>
        

            </div>
          </div>
        </div>

          
          //   <div className={styles.bodyContents}>
          //     <div className={styles.mainContentStack}>
          //       <div className={styles.personDetails}>
          //         <div className={styles.userName}>
          //           {new Date(zap.time * 1000).toLocaleDateString()}{' '}
          //           {new Date(zap.time * 1000).toLocaleTimeString([], {
          //             hour: '2-digit',
          //             minute: '2-digit',
          //           })}
          //         </div>
          //       </div>
          //       <div className={styles.personDetails}>
          //         <img
          //           className={styles.avatarIcon}
          //           alt=""
          //           src="avatar.png"
          //           style={{ display: 'none' }}
          //         />
                  
          //       </div>
          //       <div className={styles.personDetails}>
          //         <img
          //           className={styles.avatarIcon}
          //           alt=""
          //           src="avatar.png"
          //           style={{ display: 'none' }}
          //         />
                
          //       </div>
          //       <div className={styles.userName}>{zap.memo}</div>
          //     </div>
          //     <div className={styles.transactionDetails}>
          //       <b className={styles.b}>{zap.amount}</b>
          //     </div>
          //   </div>
          // </div>
        ))}

      {/* {zaps?.map((payment, index) => (
        <div className={styles.bodycell}>
          <div className={styles.bodyContents}>
            <div className={styles.mainContentStack}>
                <img className={styles.avatarIcon} alt="" src={ArrowIncoming} />
              
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
      ))} */}
    </div>
    );
};

export default WalletTransactionLog;
