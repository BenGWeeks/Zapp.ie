import React, { useEffect, useState } from 'react';
import './WalletYourWalletInfoCard.css';
import ArrowClockwise from '../images/ArrowClockwise.svg';
import { getUserWallets } from '../services/lnbitsServiceLocal';
import SendPayment from './SendPayment';
import ReceivePayment from './ReceivePayment';

// interface WalletYourWalletInfoCardProps {
//   totalSats: number;
// }

const adminKey = process.env.REACT_APP_LNBITS_ADMINKEY as string;

const WalletYourWalletInfoCard: React.FC = () => {

  const [balance, setBalance] = useState<number>();
  const [isReceivePopupOpen, setIsReceivePopupOpen] = useState(false);
  const [isSendPopupOpen, setIsSendPopupOpen] = useState(false);
  
  const fetchAmountReceived = async () => {
    console.log('Fetching your wallet ...');
    const walletForUser = await getUserWallets(adminKey,'2984e3ac627e4fea9fd6dde9c4df83b5');

    console.log('Wallets: ', walletForUser);

    if (walletForUser && walletForUser.length > 0) {
      setBalance((walletForUser.filter((wallet: { name: string; }) => wallet.name === 'Private')[0].balance_msat)/1000);
    }
  }

  useEffect(() => {
    fetchAmountReceived();
  });

  const handleOpenReceivePopup = () => {
    setIsReceivePopupOpen(true);
  };

  const handleCloseReceivePopup = () => {
    setIsReceivePopupOpen(false);
  };

  const handleOpenSendPopup = () => {
    setIsSendPopupOpen(true);
  };

  const handleCloseSendPopup = () => {
    setIsSendPopupOpen(false);
  };
  
  return (
    <div className="wallet-info">
      <h3>Your wallet</h3>
      <p>Amount received from other users:</p>
      <div className="horizontal-container">
        <div className="item"> <h1>{balance?.toLocaleString() ?? '0'}</h1>
        </div>
        <div className="item">Sats</div>
        <div className="col-md-1" style={{ paddingTop: '30px' }}>
            <button className='refreshImageIcon'>
              <img src={ArrowClockwise} alt="icon" style={{ width: 30, height: 30 }} />
            </button>
          </div>
      </div>
      <div className="row wallet-buttons">
          <div className="col-md-3"> <button onClick={handleOpenReceivePopup} className="receive-btn">Receive</button></div>
          <div className="col-md-3"><button onClick={handleOpenSendPopup} className="send-btn">Send</button></div>
          {isReceivePopupOpen && (
        <div className="overlay" onClick={handleCloseReceivePopup}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <ReceivePayment onClose={handleCloseReceivePopup} />
            <button className="close-btn" onClick={handleCloseReceivePopup}>Close</button>
          </div>
        </div>
      )}

      {isSendPopupOpen && (
        <div className="overlay" onClick={handleCloseSendPopup}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <SendPayment onClose={handleCloseSendPopup} />
            <button className="close-btn" onClick={handleCloseSendPopup}>Close</button>
          </div>
        </div>
      )}
          <div className="col-md-6"><span></span></div>
        </div>
       
    </div>
  );
};

export default WalletYourWalletInfoCard;
