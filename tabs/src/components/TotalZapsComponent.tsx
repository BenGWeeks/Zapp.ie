import { FunctionComponent, useCallback, useState, useEffect } from 'react';
import styles from './TotalZapsComponent.module.css';
//import lnbitsService from '../services/lnbitsServiceLocal';
/// <reference path = "../global.d.ts" />
import {
  getWallets,
  getUserWallets,
  getUsers,
  getWalletTransactionsSince,
} from '../services/lnbitsServiceLocal';
import { getUserName } from '../utils/walletUtilities';

export interface ZapSent {
  TotalZaps: number;
  AveragePerUser: number;
  AveragePerDay: number;
  BiggestZap: number;
  ZapsFromCopilots: number;
  ZapsToCopilots: number;
}

const adminKey = process.env.REACT_APP_LNBITS_ADMINKEY as string;

const SentComponent: FunctionComponent = () => {
  const [timestamp, setTimestamp] = useState<number>(0);
  const [activePeriod, setActivePeriod] = useState<number | null>(null);
  const [zaps, setZaps] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [totalZaps, setTotalZaps] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [averagePerDay, setAveragePerDay] = useState<number>(0); // State for average per day
  const [biggestZap, setBiggestZap] = useState<number>(0); // State for biggest zap
  const [averagePerUser, setAveragePerUser] = useState<number>(0); // State for average per user
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [zapsFromCopilots, setZapsFromCopilots] = useState<number>(0);
  const [zapsToCopilots, setZapsToCopilots] = useState<number>(0);

  const fetchZaps = async () => {
    setError(null);

    try {
      let allZaps: Transaction[] = [];

      const users = await getUsers(adminKey, {});

      if (users) {
        const totalUsers = users.length;
        setTotalUsers(totalUsers);

        let totalZaps = 0;
        let zapsFromCopilots = 0;

        for (const user of users) {
          const wallets = await getUserWallets(adminKey, user.id);

          if (wallets) {
            const allowanceWallets = wallets.filter(
              wallet => wallet.name === 'Allowance',
            );

            for (const wallet of allowanceWallets) {
              const transactions = await getWalletTransactionsSince(
                wallet.inkey,
                0, // all time
                { tag: 'zap' },
              );

              allZaps = allZaps.concat(transactions);
              console.log('Timestamp changed: ', transactions);
            }
          } else {
            console.log('No wallets found for user: ', user.id);
          }
        }
      }

      console.log('All zaps: ', allZaps);

      setZaps(prevState => [...prevState, ...allZaps]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(`Failed to fetch users: ${error.message}`);
      } else {
        setError('An unknown error occurred while fetching users');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const zapSent: ZapSent = {
    TotalZaps: totalZaps,
    AveragePerUser: averagePerUser,
    AveragePerDay: averagePerDay,
    BiggestZap: biggestZap,
    ZapsFromCopilots: 0,
    ZapsToCopilots: 0,
  };

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

  // Debounce the fetchZaps function
  const debouncedFetchZaps = useCallback(debounce(fetchZaps, 3000), []);

  useEffect(() => {
    debouncedFetchZaps();
  }, [debouncedFetchZaps]);

  useEffect(() => {
    // Calculate the total amount considering only negative values
    const total = zaps
      .filter(zap => zap.amount < 0)
      .reduce((sum, zap) => sum + zap.amount, 0);
    setTotalZaps(Math.floor(Math.abs(total))); // Convert to positive

    // Calculate the number of days since the first zap
    const currentTime = Date.now() / 1000;
    const firstZapTime =
      zaps.length > 0 ? Math.min(...zaps.map(zap => zap.time)) : currentTime;
    const numberOfDays = (currentTime - firstZapTime) / (24 * 60 * 60);

    // Calculate the average per day
    const average = total / numberOfDays;
    setAveragePerDay(Math.floor(Math.abs(average))); // Convert to positive

    // Calculate the biggest zap considering only negative values
    const negativeZaps = zaps.filter(zap => zap.amount < 0);
    const maxZap =
      negativeZaps.length > 0
        ? Math.max(...negativeZaps.map(zap => Math.abs(zap.amount)))
        : 0;
    setBiggestZap(Math.floor(maxZap)); // Already positive
  }, [zaps]);

  function debounce(func: (...args: any[]) => void, wait: number) {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  if (error) {
    return <div className={styles.sentcomponent}>{error}</div>;
  }

  return (
    <div className={styles.sentcomponent}>
      {/* Total Zaps Section */}
      <div className={styles.zapStats}>
        <p className={styles.title}>Total zaps sent</p>
        <div className={styles.zapsSentContainer}>
          <span className={styles.bigNumber}>
            {zapSent.TotalZaps.toLocaleString()}
          </span>
          <span className={`${styles.sats} ${styles.satsBig}`}> Sats</span>
        </div>
        <div className={styles.zapStats}>
          <table className={`${styles.statsTable} `}>
            <tbody>
              <tr>
                <td className={styles.tdWidth}>Average per user</td>
                <td className={`${styles.statValue}`}>
                  {loading ? (
                    'Loading ...'
                  ) : (
                    <>
                      <span className={`${styles.zapValues}`}>
                        {zapSent.AveragePerUser.toLocaleString()}
                      </span>{' '}
                      Sats
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td>Average per day</td>
                <td className={`${styles.statValue}`}>
                  {loading ? (
                    'Loading ...'
                  ) : (
                    <>
                      <span className={`${styles.zapValues}`}>
                        {zapSent.AveragePerDay.toLocaleString()}
                      </span>{' '}
                      Sats
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td>Biggest zap</td>
                <td className={`${styles.statValue}`}>
                  {loading ? (
                    'Loading ...'
                  ) : (
                    <>
                      <span className={`${styles.zapValues}`}>
                        {zapSent.BiggestZap.toLocaleString()}
                      </span>{' '}
                      Sats
                    </>
                  )}
                </td>
              </tr>
              <tr>
                <td>Zaps from copilots</td>
                <td className={`${styles.statValue}`}>
                  {loading ? (
                    'Loading ...'
                  ) : (
                    <span className={`${styles.zapValues}`}>
                      {zapSent.ZapsFromCopilots.toLocaleString()} Sats
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td>Zaps to copilots</td>
                <td className={`${styles.statValue}`}>
                  {loading ? (
                    'Loading ...'
                  ) : (
                    <span className={`${styles.zapValues}`}>
                      {zapSent.ZapsToCopilots.toLocaleString()} Sats
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// interface ZapsSentProps {
//     amountArray: number[];
// }

// const ZapsSent: React.FC<ZapsSentProps> = ({ amountArray }) => {
//     return (
//         <div className={styles.sentcomponent}>
//             {/* Total Zaps Section */}
//             <div className={styles.zapStats}>
//                 <p className={styles.title}>Total zaps sent</p>
//                 <div className={styles.zapsSentContainer}>
//                     {amountArray.map((amount, index) => (
//                         <div key={index} className={styles.amountItem}>
//                             <span className={styles.bigNumber}>{amount.toLocaleString()}</span>
//                             <span className={styles.sats}> Sats</span>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

export default SentComponent;
