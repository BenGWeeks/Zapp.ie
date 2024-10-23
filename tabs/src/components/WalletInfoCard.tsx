import React, { useEffect, useState } from 'react';
import './WalletInfoCard.css';
import ArrowClockwise from '../images/ArrowClockwise.svg';
import { getUsers } from '../services/lnbitsServiceLocal';
import { useMsal } from '@azure/msal-react';
import SendPayment from './SendPayment';
import ReceivePayment from './ReceivePayment';

const adminKey = process.env.REACT_APP_LNBITS_ADMINKEY as string;

const WalletYourWalletInfoCard: React.FC = () => {
  const [balance, setBalance] = useState<number>();

  const [isReceivePopupOpen, setIsReceivePopupOpen] = useState(false);
  const [isSendPopupOpen, setIsSendPopupOpen] = useState(false);
  const { accounts } = useMsal();
  const account = accounts[0];
  const [myLNbitDetails, setMyLNbitDetails] = useState<User>();

  const fetchAmountReceived = async () => {
    console.log('Fetching your wallet ...');
    
    const currentUserLNbitDetails = await getUsers(adminKey, {
      aadObjectId: account.localAccountId,
    });

    if (currentUserLNbitDetails && currentUserLNbitDetails.length > 0) {
      setMyLNbitDetails(currentUserLNbitDetails[0]);
      if (currentUserLNbitDetails && currentUserLNbitDetails.length > 0) {
        const bal =
          (currentUserLNbitDetails[0].privateWallet?.balance_msat ?? 0) / 1000;
        setBalance(bal);
      }
    }
  };

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

  // Buttons should be disabled if balance is undefined (still loading)
  const isLoading = false; // balance === undefined;

  return (
    <div className="wallet-info">
      <h4>Your wallet</h4>
      <p>Amount received from other users:</p>
      <div className="horizontal-container">
        <div className="item">
          {' '}
          <h1>{balance?.toLocaleString() ?? '0'}</h1>
        </div>
        <div className="item">Sats</div>
        <div
          className="col-md-1 item"
          style={{ paddingTop: '30px', paddingLeft: '10px' }}
        >
          <button style={{ display: 'none' }} className="refreshImageIcon">
            <img
              src={ArrowClockwise}
              alt="icon"
              style={{ width: 30, height: 30 }}
            />
          </button>
        </div>
      </div>
      <div className="wallet-buttons">
        <div>
          {' '}
          <button
            onClick={handleOpenReceivePopup}
            className="receive-btn"
            disabled={isLoading}
          >
            Receive
          </button>
        </div>
        <div>
          <button
            onClick={handleOpenSendPopup}
            className="send-btn"
            disabled={isLoading}
          >
            Send
          </button>
        </div>
        {isReceivePopupOpen && (
          <div className="overlay" onClick={handleCloseReceivePopup}>
            <div className="popup" onClick={e => e.stopPropagation()}>
              <ReceivePayment
                onClose={handleCloseReceivePopup}
                currentUserLNbitDetails={myLNbitDetails!}
              />
            </div>
          </div>
        )}

        {isSendPopupOpen && (
          <div className="overlay" onClick={handleCloseSendPopup}>
            <div className="popup" onClick={e => e.stopPropagation()}>
              <SendPayment
                onClose={handleCloseSendPopup}
                currentUserLNbitDetails={myLNbitDetails!}
              />
            </div>
          </div>
        )}
        <div className="col-md-6">
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default WalletYourWalletInfoCard;
