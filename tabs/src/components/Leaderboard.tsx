/// <reference path="../types/global.d.ts" />

import { FunctionComponent, useEffect } from 'react';
import styles from './Leaderboard.module.css';
import React, { useState } from 'react';
import { getWallets, getPaymentsSince, getWalletBalance } from '../services/lnbitsServiceLocal';
import ZapIcon from '../images/ZapIcon.svg';
import circleFirstPlace from '../images/circleFirstPlace.svg';
import CircleSecondPlace from '../images/circleSecondPlace.svg';
import circleThirdPlace from '../images/circleThirdPlace.svg';
import circleDefaultPlace from '../images/circleDefaultPlace.svg';
import AscendingIcon from '../images/ascending.svg';
import DescendingIcon from '../images/descending.svg';

interface FeedListProps {
  timestamp?: number | null;
}

interface RankedWallet extends Wallet {
  rank: number;
  balance_msat: number;
}

const Leaderboard: React.FC<FeedListProps> = ({ timestamp }) => {
  const [zaps, setZaps] = useState<Zap[]>([]);
  const [uniqueWallets, setUniqueWallets] = useState<RankedWallet[]>([]);
  const paymentsSinceTimestamp = 0;
  const [isAscending, setIsAscending] = useState(true);

  const fetchZaps = async () => {
    console.log('Fetching payments since: ', paymentsSinceTimestamp);

    const wallets = await getWallets('Receiving'); // We'll just look at the receiving wallets.
    let allZaps: Zap[] = [];

    // Loop through all the wallets
    if (wallets) {
      // Extract unique wallets
      const uniqueWalletsMap = new Map();
      wallets.forEach(wallet => {
        if (!uniqueWalletsMap.has(wallet.id)) {
          uniqueWalletsMap.set(wallet.id, wallet);
        }
      });

      // Fetch balance for each wallet and sort by balance_msat
      const walletsWithBalance = await Promise.all(
        Array.from(uniqueWalletsMap.values()).map(async wallet => {
          const balance = await getWalletBalance(wallet.inkey);
          return { ...wallet, balance_msat: balance };
        })
      );

      // Sort unique wallets by balance_msat
      walletsWithBalance.sort((a, b) => b.balance_msat - a.balance_msat);

      // Create a new array with ranks
      const rankedWallets = walletsWithBalance.map((wallet, index) => ({
        ...wallet,
        rank: index + 1,
      }));

      setUniqueWallets(rankedWallets);
    }

    setZaps(allZaps);
  };

  useEffect(() => {
    // Clear the zaps
    setZaps([]);
    fetchZaps();
  }, [timestamp]);

  const handleSort = () => {
    const sortedWallets = [...uniqueWallets].sort((a, b) =>
      isAscending ? a.balance_msat - b.balance_msat : b.balance_msat - a.balance_msat
    );
    setUniqueWallets(sortedWallets);
    setIsAscending(!isAscending);
  };

  // Group zaps by user and sum the amounts
  const groupedZaps = zaps.reduce((acc: { [key: string]: Zap }, zap) => {
    if (!zap.from) return acc;
    if (!acc[zap.from]) {
      acc[zap.from] = { ...zap, amount: 0 };
    }
    acc[zap.from].amount += zap.amount;
    return acc;
  }, {});

  // Convert the grouped data to an array and sort by total zap amount
  const sortedZaps = Object.values(groupedZaps).sort((a, b) => b.amount - a.amount);

  return (
    <div className={styles.feedlist}>
      <div className={styles.headercell}>
        <div className={styles.headerContents}>
          <b className={styles.string}>Rank</b>
          <b className={styles.userName}>User</b>
          <div className={styles.stringWrapper} onClick={handleSort} style={{ cursor: 'pointer' }}>
            <b className={`${styles.string3} ${styles.b}`}>Zap amount</b>
            <img
              src={isAscending ? AscendingIcon : DescendingIcon}
              alt={isAscending ? 'Ascending' : 'Descending'}
              className={styles.sortIcon} // Add CSS class to style the icon
            />

          </div>
        </div>
      </div>
      <div className={`${styles.horizontalContainer} ${styles.table}`}>
        <ul>
          {uniqueWallets.map(wallet => (
            <li key={wallet.id} className={styles.bodyContents}>
              <div className={styles.mainContentStack}>
                <div className={styles.personDetails}>
                  <div className={styles.userName}>
                    {wallet.rank === 1 ? (
                      <div className={styles.firstPlace}>
                        <img src={circleFirstPlace} alt="First Place" className={styles.circleFirstPlace} />
                        <span className={`${styles.rankNumber} ${styles.blackRank}`}>{wallet.rank}</span>
                      </div>
                    ) : wallet.rank === 2 ? (
                      <div className={styles.secondPlace}>
                        <img src={CircleSecondPlace} alt="Second Place" className={styles.circleSecondPlace} />
                        <span className={`${styles.rankNumber} ${styles.blackRank}`}>{wallet.rank}</span>
                      </div>
                    ) : wallet.rank === 3 ? (
                      <div className={styles.thirdPlace}>
                        <img src={circleThirdPlace} alt="Third Place" className={styles.circleThirdPlace} />
                        <span className={`${styles.rankNumber} ${styles.blackRank}`}>{wallet.rank}</span>
                      </div>
                    ) : (
                      <div className={styles.defaultPlace}>
                        <img src={circleDefaultPlace} alt="Place" className={styles.circleDefaultPlace} />
                        <span className={`${styles.rankNumber}`}>{wallet.rank}</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.personDetails}>
                    <img
                      className={styles.avatarIcon}
                      alt=""
                      src="avatar.png"
                      style={{ display: 'none' }} // Optionally show avatar
                    />
                    <div className={styles.userName}>{wallet.name.split('-')[0]}</div>
                  </div>
                </div>
              </div>
              <b className={`${styles.b} ${wallet.rank <= 3 ? styles.yellowAmount : ''}`}>
                {wallet.balance_msat}
              </b>
              <img className={styles.icon} alt="" src={ZapIcon} />
            </li>
          ))}
        </ul>
      </div>


    </div>
  );
};

export default Leaderboard;

