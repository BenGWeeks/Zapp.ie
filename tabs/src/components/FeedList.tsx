import React, { useEffect, useState, useRef } from 'react';
import styles from './FeedList.module.css';
import {
  getAllWallets,
  getUser,
  getUsers,
  getUserWallets,
  getWalletTransactionsSince,
} from '../services/lnbitsServiceLocal';
import ZapIcon from '../images/ZapIcon.svg';
import { useCache } from '../utils/CacheContext';
interface FeedListProps {
  timestamp?: number | null;
  allZaps: Transaction[];
  allUsers: User[];
}
interface ZapTransaction {
  from: User | null;
  to: User | null;
  transaction: Transaction;
}
const adminKey = process.env.REACT_APP_LNBITS_ADMINKEY as string;
const FeedList: React.FC<FeedListProps> = ({ timestamp, allZaps, allUsers  }) => {
  const [zaps, setZaps] = useState<ZapTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialRender = useRef(true);
  const { cache, setCache } = useCache();
  
  useEffect(() => {

    console.log('FEED PARAMETER:', allZaps);
    //setZaps(allZaps);
    if (cache['allZaps']) {
    console.log('FEED cache:', cache['allZaps']);
    }
    const paymentsSinceTimestamp =
      timestamp === null || timestamp === undefined || timestamp === 0
        ? 0
        : timestamp;
    const fetchZaps = async () => {
      setLoading(true);
      setError(null);

      try {
        const paymentsSinceTimestamp =
          timestamp === null || timestamp === undefined || timestamp === 0
            ? 0
            : timestamp;



        // const [allwallets, transactions, users] = await Promise.all([
        //   getAllWallets(adminKey),
        //   getWalletTransactionsSince(adminKey, paymentsSinceTimestamp, {
        //     tag: 'zap',
        //   }),
        //   getUsers(adminKey, {}),
        // ]);

        let loadZaps: ZapTransaction[] = [];

        // if (allwallets) {
        //   const allowanceWallets = allwallets.filter(
        //     wallet => wallet.name === 'Allowance',
        //   );
        //   console.log('allowanceWallets', allowanceWallets);

          const allowanceTransactions = allZaps;

          const allowanceZaps = allowanceTransactions
            .flat()
            .map(transaction => ({
              from: null, // user,
              to: null,//allUsers?.find(f => f.aadObjectId === transaction.extra?.to?.user) as User,
              transaction: transaction,
            }));

            loadZaps = loadZaps.concat(allowanceZaps);
        //}

        // const zaps = await Promise.all(
        //   transactions.map(async transaction => ({
        //     from: null,//users.
        //     to: users?.find(f => f.aadObjectId === transaction.extra?.to?.user) as User,
        //      //await getUser(adminKey, transaction.extra?.to?.user),
        //     transaction: transaction,
        //   })),
        // );

        //allZaps = allZaps.concat(loadZaps);

        //setZaps(allZaps);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'An unknown error occurred',
        );
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (initialRender.current) {
      initialRender.current = false;
      // Clear the zaps
      setZaps([]);
      fetchZaps();
    } else {
      console.log(`Timestamp updated: ${timestamp}`);
      fetchZaps();
    }
  }, [timestamp,allZaps,allUsers]);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
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
        ?.sort((a, b) => b.transaction.time - a.transaction.time)
        .map((zap, index) => (
          <div
            key={zap.transaction.checking_id || index}
            className={styles.bodycell}
          >
            <div className={styles.bodyContents}>
              <div className={styles.mainContentStack}>
                <div className={styles.personDetails}>
                  <div className={styles.userName}>
                    {new Date(zap.transaction.time * 1000).toLocaleDateString()}{' '}
                    {new Date(zap.transaction.time * 1000).toLocaleTimeString(
                      [],
                      {
                        hour: '2-digit',
                        minute: '2-digit',
                      },
                    )}
                  </div>
                </div>
                <div className={styles.personDetails}>
                  <img
                    className={styles.avatarIcon}
                    alt=""
                    src="avatar.png"
                    style={{ display: 'none' }}
                  />
                  <div className={styles.userName}>{zap.from?.displayName}</div>
                </div>
                <div className={styles.personDetails}>
                  <img
                    className={styles.avatarIcon}
                    alt=""
                    src="avatar.png"
                    style={{ display: 'none' }}
                  />
                  <div className={styles.userName}>{zap.to?.displayName}</div>
                </div>
                <div className={styles.userName} title={zap.transaction.memo}>
                  {zap.transaction.memo}
                </div>
              </div>
              <div className={styles.transactionDetails}>
                <b className={styles.b}>
                  {Math.abs(
                    Math.floor(zap.transaction.amount / 1000),
                  ).toLocaleString()}
                </b>
                <img className={styles.icon} alt="" src={ZapIcon} />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};
export default FeedList;
