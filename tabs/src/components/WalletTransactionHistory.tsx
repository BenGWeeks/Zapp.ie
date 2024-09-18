import React, { useCallback, useState } from 'react';
//import './WalletTransactionHistory.css';
import styles from './WalletTransactionHistory.module.css';

const WalletTransactionHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Received');

  const onHistoryTabClick = (tabName: string) =>  {
    // Add your code here

  alert(`Tab clicked: ${tabName}`);
    
  };

  
  return (
    <div className={styles.feedcomponent}>
      <div className={styles.tabs}>
        <div className={styles.tab} onClick={() => onHistoryTabClick('all')}>
          <div className={styles.base}>
            <div className={styles.stringBadgeIconStack}>
              <b className={styles.stringTabTitle}>All</b>
            </div>
            <div className={styles.borderPaddingStack}>
              <div className={styles.borderBottom} />
            </div>
          </div>
        </div>
        <div className={styles.tab1} onClick={() => onHistoryTabClick('sent')}>
          <div className={styles.base1}>
            <div className={styles.stringBadgeIconStack}>
              <div className={styles.stringTabTitle} >Sent</div>
            </div>
          </div>
        </div>

        <div className={styles.tab1} onClick={() => onHistoryTabClick('received')}>
          <div className={styles.base1}>
            <div className={styles.stringBadgeIconStack}>
              <div className={styles.stringTabTitle}>Received</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletTransactionHistory;
