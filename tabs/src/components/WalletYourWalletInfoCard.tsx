import React from 'react';
import './WalletYourWalletInfoCard.css';
import ArrowClockwise from '../images/ArrowClockwise.svg';

interface WalletYourWalletInfoCardProps {
  totalSats: number;
}

const WalletYourWalletInfoCard: React.FC<WalletYourWalletInfoCardProps> = ({ totalSats }) => {
  return (
    <div className="wallet-info">
      <h3>Your wallet</h3>
      <p>Amount received from other users:</p>
      <div className="horizontal-container">
        <div className="item"> <h1>{totalSats.toLocaleString()}</h1>
        </div>
        <div className="item">Sats</div>

        <div className="col-md-1" style={{ paddingTop: '30px' }}>

            <button className='refreshImageIcon'>
              <img src={ArrowClockwise} alt="icon" style={{ width: 30, height: 30 }} />
            </button>
          </div>
      </div>

      <div className="row wallet-buttons">
          <div className="col-md-3"> <button className="receive-btn">Receive</button></div>
          <div className="col-md-3"><button className="send-btn">Send</button></div>
          <div className="col-md-6"><span></span></div>
        </div>
       
    </div>
  );
};

export default WalletYourWalletInfoCard;
