import React, { useState } from 'react';
import styles from './SendPayment.module.css';

interface SendPopupProps {
  onClose: () => void;
}

const SendPayment: React.FC<SendPopupProps> = ({ onClose }) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  const [inputValue, setInputValue] = useState('');

  const handleButtonClick = (value: string) => {
    setInputValue(value);
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.popup}>
        <p className={styles.title}>Send some zaps</p>
        <p className={styles.text}>Show gratitude, thanks and recognising awesomeness to others in your team</p>
        <div className={styles.container}>
      <div className={styles.inputRow}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={styles.inputField}
          placeholder="Specify amount" 
        />
        <button onClick={() => handleButtonClick('5000')} className={styles.button}>5,000</button>
        <button onClick={() => handleButtonClick('10000')} className={styles.button}>10,000</button>
        <button onClick={() => handleButtonClick('25000')} className={styles.button}>25,000</button>
      </div>
    </div>
    <br />
    <p className={styles.text}>Paste invoice</p>
      </div>
    </div>
  );
};

export default SendPayment;