import {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import styles from './CopilotListComponent.module.css';
import { getCopilots, getApplications } from '../services/automationService';

const adminKey = process.env.REACT_APP_LNBITS_ADMINKEY as string;

const CopilotListComponent: FunctionComponent = () => {
  const onBodyContentsContainerClick = useCallback(() => {
    // Add your code here
  }, []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copilots, setCopilots] = useState<Copilot[]>([]);
  const fetchCalled = useRef(false); // Ref to track if fetchUsers has been called

  console.log('CopilotListComponent ...');

  const fetchCopilots = async () => {
    console.log('fetchCopilots ...');
    setLoading(true);
    setError(null);

    try {
      const copilots = await getApplications();

      if (copilots) {
        setCopilots(prevState => [...prevState, ...copilots]);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(`Failed to fetch copilots: ${error.message}`);
      } else {
        setError('An unknown error occurred while fetching copilots');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!fetchCalled.current) {
      fetchCalled.current = true;
      fetchCopilots();
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.userslist}>
      <b className={styles.users}>Copilots</b>
      <div className={styles.tabs}>
        <div className={styles.tab}>
          <div className={styles.base}>
            <div className={styles.stringBadgeIconStack}>
              <b className={styles.stringTabTitle}>All</b>
            </div>
            <div className={styles.borderPaddingStack}>
              <div className={styles.borderBottom} />
            </div>
          </div>
        </div>
        <div className={styles.tab} style={{ display: 'none' }}>
          <div className={styles.base1}>
            <div className={styles.stringBadgeIconStack}>
              <div className={styles.stringTabTitle}>Teammates</div>
            </div>
          </div>
        </div>
        <div className={styles.tab} style={{ display: 'none' }}>
          <div className={styles.base1}>
            <div className={styles.stringBadgeIconStack}>
              <div className={styles.stringTabTitle}>Copilots</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.list}>
        <div className={styles.headercell}>
          <div className={styles.headerContents}>
            <div className={styles.stringParent}>
              <b className={styles.string}>Copilot</b>
              <b className={styles.string1}>User type</b>
              <b className={styles.string2}>Balance</b>
              <b className={styles.string3}>Allowance remaining</b>
            </div>
          </div>
        </div>
        {copilots
          ?.sort((a, b) => a.displayName.localeCompare(b.displayName))
          .map(copilot => (
            <div key={copilot.id} className={styles.bodycell}>
              <div className={styles.bodyContents}>
                <div className={styles.mainContentStack}>
                  <div className={styles.personDetails}>
                    <img
                      className={styles.avatarIcon}
                      alt=""
                      src={
                        copilot.profileImg ? copilot.profileImg : 'profile.png'
                      }
                    />
                    <div className={styles.userName}>{copilot.displayName}</div>
                  </div>
                  <div className={styles.totalBalance}>Copilot</div>
                  <b className={styles.totalBalance1}>
                    {copilot.privateWallet
                      ? `${Math.floor(
                          copilot.privateWallet.balance_msat / 1000,
                        )} Sats`
                      : 'N/A'}
                  </b>
                  <b className={styles.totalBalance2}>
                    {copilot.allowanceWallet
                      ? `${Math.floor(
                          copilot.allowanceWallet.balance_msat / 1000,
                        )} Sats`
                      : 'N/A'}
                  </b>
                </div>
                <div className={styles.actions} />
              </div>
            </div>
          ))}
      </div>
      <div className={styles.poweredby}>
        <div className={styles.poweredBy}>
          <b className={styles.poweredBy1}>Powered by</b>
          <img className={styles.logo1Icon} alt="" src="LNbits.png" />
        </div>
      </div>
    </div>
  );
};

export default CopilotListComponent;
