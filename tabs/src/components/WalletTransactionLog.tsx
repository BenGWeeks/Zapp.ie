import React, { useEffect, useState } from 'react';
import styles from './WalletTransactionLog.module.css';
import {
  getUsers,
  getWalletTransactionsSince,
} from '../services/lnbitsServiceLocal';
import ArrowIncoming from '../images/ArrowIncoming.svg';
import ArrowOutgoing from '../images/ArrowOutcoming.svg';
import moment from 'moment';
import { useMsal } from '@azure/msal-react';

interface WalletTransactionLogProps {
  activeTab?: string;
  activeWallet?: string;
  filterZaps?: (activeTab: string) => void;
}

const adminKey = process.env.REACT_APP_LNBITS_ADMINKEY as string;

const WalletTransactionLog: React.FC<WalletTransactionLogProps> = ({
  activeTab,
  activeWallet,
}) => {
  const [zaps, setZaps] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate the timestamp for 30 days ago
  const sevenDaysAgo = Date.now() / 1000 - 30 * 24 * 60 * 60;

  // Use the provided timestamp or default to 7 days ago
  const paymentsSinceTimestamp = sevenDaysAgo;
  const activeTabForData =
    activeTab === null || activeTab === undefined || activeTab === ''
      ? 'all'
      : activeTab;
  console.log('activeTabForData: ', activeTabForData);

  console.log('activeWalletTabName: ', activeWallet);

  const getAllUsers = async () => {
    const users = await getUsers(adminKey, {});
    if (users) {
      setUsers(users);
    }
    console.log('Users: ', users);
  };

  const { accounts } = useMsal();
  const account = accounts[0];

  const fetchZaps = async () => {
    console.log('Fetching payments since: ', paymentsSinceTimestamp);
    setLoading(true);
    setError(null);

    let allZaps: Transaction[] = [];

    try {
      const currentUserLNbitDetails = await getUsers(adminKey, {
        aadObjectId: account.localAccountId,
      });

      console.log('Current user: ', currentUserLNbitDetails);

      if (currentUserLNbitDetails && currentUserLNbitDetails.length > 0) {
        let inkey: any = null;

        if (activeWallet === 'Private') {
          inkey = currentUserLNbitDetails[0].privateWallet?.inkey;
        } else {
          inkey = currentUserLNbitDetails[0].allowanceWallet?.inkey;
        }

        if (inkey) {
          const transactions = await getWalletTransactionsSince(
            inkey,
            paymentsSinceTimestamp,
            null, //{ tag: 'zap' }
          );

          let filteredTransactions: any = null;

          if (activeTab === 'sent')
            filteredTransactions = transactions.filter(f => f.amount < 0);
          else if (activeTab === 'received')
            filteredTransactions = transactions.filter(f => f.amount > 0);
          else filteredTransactions = transactions;

          for (const zap of filteredTransactions) {
            zap.extra.from = users.filter(
              u => u.id === zap.extra?.from?.user,
            )[0];
            zap.extra.to = users.filter(u => u.id === zap.extra?.to?.user)[0];
          }

          allZaps = allZaps.concat(filteredTransactions);
          console.log('Zaps: ', allZaps);
        }
      }
      setZaps(prevState => [...prevState, ...allZaps]);
    } catch (error) {
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

  useEffect(() => {
    setZaps([]);
    getAllUsers();
    fetchZaps();
  }, [activeTab, activeWallet]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.feedlist}>
      {zaps
        ?.sort((a, b) => b.time - a.time)
        .map((zap, index) => (
          <div key={zap.checking_id || index} className={styles.bodycell}>
            <div className={styles.bodyContents}>
              <div className={styles.mainContentStack}>
                <img
                  className={styles.avatarIcon}
                  alt=""
                  src={
                    (zap.amount as number) < 0 ? ArrowOutgoing : ArrowIncoming
                  }
                />

                <div className={styles.userName}>
                  <p className={styles.lightHelightInItems}>
                    {' '}
                    <b>Zap! </b>
                  </p>
                  <div className={styles.lightHelightInItems}>
                    {' '}
                    {moment(moment.now()).diff(zap.time * 1000, 'days')} days
                    ago from <b>{zap.extra?.from?.displayName ?? 'Unknown'} </b>
                  </div>
                  <p className={styles.lightHelightInItems}>{zap.memo}</p>
                </div>
              </div>
              <div
                className={styles.transactionDetailsAllowance}
                style={{
                  color: (zap.amount as number) < 0 ? '#E75858' : '#00A14B',
                }}
              >
                <div className={styles.lightHelightInItems}>
                  {' '}
                  <b className={styles.b}>
                    {zap.amount < 0
                      ? zap.amount / 1000
                      : '+' + zap.amount / 1000}
                  </b>{' '}
                  Sats{' '}
                </div>
                <div
                  style={{ display: 'none' }}
                  className={styles.lightHelightInItems}
                >
                  {' '}
                  about $0.11{' '}
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default WalletTransactionLog;
