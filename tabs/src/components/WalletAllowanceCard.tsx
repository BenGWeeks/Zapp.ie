import React, { useEffect, useState } from 'react';
import './WalletAllowanceCard.css'; // Assuming you'll use CSS for styling
import BatteryImageDisplay from './BatteryImageDisplay';
import ArrowClockwise from '../images/ArrowClockwise.svg';
import Calendar from '../images/Calendar.svg';
import { getUserWallets } from '../services/lnbitsServiceLocal';

interface AllowanceCardProps {
  availableSats: number;
  availableAmountUSD: number;
  remainingSats: number;
  spentSats: number;
  timestamp?: number | null;
}

const adminKey = process.env.REACT_APP_LNBITS_ADMINKEY as string;

const WalletAllowanceCard: React.FC<AllowanceCardProps> = ({
  spentSats,
  timestamp
}) => {

  const [batteryPercentage, setBatteryPercentage] = useState<number>(0);
  const [balance, setBalance] = useState<number>();

  // Calculate the timestamp for 7 days ago
  const sevenDaysAgo = Date.now() / 1000 - 7 * 24 * 60 * 60;

  // Use the provided timestamp or default to 7 days ago
  const paymentsSinceTimestamp =
    timestamp === null || timestamp === undefined || timestamp === 0
      ? sevenDaysAgo
      : timestamp;

  const fetchAmountReceived = async () => {
    console.log('Fetching your wallet ...');
    const walletForUser = await getUserWallets(adminKey, '2984e3ac627e4fea9fd6dde9c4df83b5');

    console.log('Wallets: ', walletForUser);

    if (walletForUser && walletForUser.length > 0) {
      const bal = walletForUser.filter((wallet: { name: string; }) => wallet.name === 'Allowance')[0].balance_msat / 1000;
      setBalance(bal);
      setBatteryPercentage((spentSats / bal) * 100);
    }
  }

  useEffect(() => {
    fetchAmountReceived();
  });

  return (
    <div className="wallet-container">
      <div className="wallet-header">
        <h2>Allowance</h2>
        <p>Amount available to send to your teammates:</p>
      </div>
      <div className='mainContent'>
        <div className="row" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
          <div className="col-md-4">
            <div className='amountDisplayContainer'>
              <div className='amountDisplay'>{balance?.toLocaleString() ?? '0'}</div>
              <div >Sats</div>
              <div style={{ width: 12, height: 12, position: 'relative' }}>
                <div style={{ width: 10, height: 10, left: 1, top: 1, position: 'absolute', background: '#5B5FC7' }}></div>
              </div>
            </div>
          </div>
          <div className="col-md-1" style={{ paddingTop: '20px' }}>
            <button className='refreshImageIcon'>
              <img src={ArrowClockwise} alt="icon" style={{ width: 30, height: 30 }} />
            </button>
          </div>
          <div className="col-md-2" >
          </div>
          <div className="col-md-3">
            <BatteryImageDisplay value={batteryPercentage} />
          </div>
        </div>
        <div className="row" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
          <div className="col-md-7">
            <div className='nextAllwanceContainer'>
              <img src={Calendar} alt="" />
              <div className="remaining smallTextFont">
                Next allowance
              </div>
              <div className="remaining smallTextFont">
                25,000 <span>Sats</span>
              </div>
              <div className="remaining smallTextFont">
                <div>Mon,  September 23</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="remaining smallTextFont">
              <span className="color-box remaining-color "></span>Remaining this week:
            </div>
            <div className="spent smallTextFont">
              <span className="color-box spent-color"></span>Spent this week:
            </div>
          </div>
          <div className="col-md-2">
            <div className="spent smallTextFont">
              <b>{balance?.toLocaleString() ?? '0'}</b> Sats
            </div>
            <div className="spent smallTextFont">
              <b>{spentSats.toLocaleString()}</b> Sats
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletAllowanceCard;
