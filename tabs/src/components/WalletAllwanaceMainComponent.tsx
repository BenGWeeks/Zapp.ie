import { FunctionComponent, useState } from 'react';
import styles from './WalletAllowanceMainComponent.module.css';
import WalletYourWalletInfoCard from './WalletYourWalletInfoCard';
import WalletTransactionHistory from './WalletTransactionHistory';
import WalletAllowanceCard from './WalletAllowanceCard';

const WalletAllwanaceMainComponent: FunctionComponent = () => {
  const [timestamp, setTimestamp] = useState(
    Math.floor(Date.now() / 1000 - 7 * 24 * 60 * 60),
  );
  const [activePeriod, setActivePeriod] = useState(7); // Set default to 7-days
  const [showYourWalletTab, setshowYourWalletTab] = useState(true);

  const handleYourWalletTab = () => {
    setshowYourWalletTab(true);
  };

  const handleAllowanceTab = () => {
    setshowYourWalletTab(false);
  };

  const handlePeriodClick = (days: number) => {
    setTimestamp(Math.floor(Date.now() / 1000 - days * 24 * 60 * 60));
    setActivePeriod(days);
  };

  return (
    <div className={styles.feedcomponent}>
      <div className={styles.tabs}>
        <div className={styles.tab}>
          <div className={styles.base}>
            <div className={styles.stringBadgeIconStack}>
              <div
                className={`${styles.stringTabTitle} ${
                  showYourWalletTab ? styles.active : ''
                }`}
                onClick={handleYourWalletTab}
              >
                Your wallet
              </div>
            </div>
          </div>
        </div>
        <div className={styles.tab1}>
          <div className={styles.base1}>
            <div className={styles.stringBadgeIconStack}>
              <div
                className={`${styles.stringTabTitle} ${
                  !showYourWalletTab ? styles.active : ''
                }`}
                onClick={handleAllowanceTab}
              >
                Allowance
              </div>
            </div>
          </div>
        </div>
      </div>
      {showYourWalletTab ? (
        <div>
          <WalletYourWalletInfoCard />
          <WalletTransactionHistory />
        </div>
      ) : (
        <div>
          <WalletAllowanceCard
            availableSats={2000000}
            availableAmountUSD={74.2}
            remainingSats={90000}
            spentSats={20000}
          />
          <WalletTransactionHistory />
        </div>
      )}
    </div>
  );
};

export default WalletAllwanaceMainComponent;
