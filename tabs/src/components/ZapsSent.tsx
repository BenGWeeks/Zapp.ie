import { FunctionComponent, useCallback, useState, useEffect } from 'react';
import styles from './ZapsSent.module.css';
import { Feed, Leaderboard, ZapSent } from '../interfaces/DataModel';
//import lnbitsService from '../services/lnbitsServiceLocal'; 
/// <reference path = "../global.d.ts" />
import { getWallets, getPaymentsSince } from '../services/lnbitsServiceLocal';
import { getUserName } from '../utils/walletUtilities';


const SentComponent: FunctionComponent = () => {
    const [timestamp, setTimestamp] = useState<number>(0);
    const [activePeriod, setActivePeriod] = useState<number | null>(null);
    const [zaps, setZaps] = useState<Zap[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [averagePerDay, setAveragePerDay] = useState<number>(0); // State for average per day
    const [biggestZap, setBiggestZap] = useState<number>(0); // State for biggest zap
    const [averagePerUser, setAveragePerUser] = useState<number>(0); // State for average per user

    const fetchZaps = async () => {
        console.log('Fetching all payments');

        const wallets = await getWallets('Sending'); // We'll just look at the receiving wallets.
        let allZaps: Zap[] = [];

        // Loop through all the wallets
        if (wallets) {
            for (const wallet of wallets) {
                const payments = await getPaymentsSince(wallet.inkey, 0); // Fetch all payments

                // Loop through all the payments for the current wallet
                for (const payment of payments) {
                    const zap: Zap = {
                        id: payment.checking_id,
                        bolt11: payment.bolt11,
                        from: getUserName(payment.extra?.from),
                        to: getUserName(payment.extra?.to),
                        memo: payment.memo,
                        amount: payment.amount / 1000,
                        wallet_id: payment.wallet_id,
                        time: payment.time,
                    };

                    allZaps.push(zap);
                }
            }
        }

        setZaps(allZaps);
    }

    const zapSent: ZapSent = {
        TotalZapSent: totalAmount,
        AveragePerUser: averagePerUser,
        AveragePerDay: averagePerDay,
        BiggestZap: biggestZap,
        ZapsFromCopilots: 0,
        ZapsToCopilots: 0
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
        setTotalAmount(Math.abs(total)); // Convert to positive

        // Calculate the number of days since the first zap
        const currentTime = Date.now() / 1000;
        const firstZapTime = zaps.length > 0 ? Math.min(...zaps.map(zap => zap.time)) : currentTime;
        const numberOfDays = (currentTime - firstZapTime) / (24 * 60 * 60);

        // Calculate the average per day
        const average = total / numberOfDays;
        setAveragePerDay(Math.abs(average)); // Convert to positive

        // Calculate the biggest zap considering only negative values
        const negativeZaps = zaps.filter(zap => zap.amount < 0);
        const maxZap = negativeZaps.length > 0 ? Math.max(...negativeZaps.map(zap => Math.abs(zap.amount))) : 0;
        setBiggestZap(maxZap); // Already positive
    }, [zaps]);

    function debounce(func: (...args: any[]) => void, wait: number) {
        let timeout: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    return (
        <div className={styles.sentcomponent}>
            {/* Total Zaps Section */}
            <div className={styles.zapStats}>
                <p className={styles.title}>Total zaps sent</p>
                <div className={styles.zapsSentContainer}>
                    <span className={styles.bigNumber}>{zapSent.TotalZapSent.toLocaleString()}</span>
                    <span className={`${styles.sats} ${styles.satsBig}`}> Sats</span>
                </div>
                <div className={styles.zapStats}>
                    <table className={`${styles.statsTable} `}>
                        <tbody>
                            <tr>
                                <td className={styles.tdWidth}>Average per user</td>
                                <td className={`${styles.statValue}`}><span className={`${styles.zapValues}`}>{zapSent.AveragePerUser.toLocaleString()}</span> Sats</td>
                            </tr>
                            <tr>
                                <td>Average per day</td>
                                <td className={`${styles.statValue}`}><span className={`${styles.zapValues}`}>{zapSent.AveragePerDay.toLocaleString()}</span> Sats</td>
                            </tr>
                            <tr>
                                <td>Biggest zap</td>
                                <td className={`${styles.statValue}`}><span className={`${styles.zapValues}`}>{zapSent.BiggestZap.toLocaleString()}</span> Sats</td>
                            </tr>
                            <tr>
                                <td>Zaps from copilots</td>
                                <td className={`${styles.statValue}`}><span className={`${styles.zapValues}`}>{zapSent.ZapsFromCopilots.toLocaleString()}</span> Sats</td>
                            </tr>
                            <tr>
                                <td>Zaps to copilots</td>
                                <td className={`${styles.statValue}`}><span className={`${styles.zapValues}`}>{zapSent.ZapsToCopilots.toLocaleString()}</span> Sats</td>
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