import React, { useState } from 'react';
import styles from './SendPayment.module.css';
import qrCodeImage from '../images/QRCode.svg';

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
    const [invoice, setInvoice] = useState('');
    const [sendAnonymously, setSendAnonymously] = useState(false);
    const isSendDisabled = !inputValue || !invoice;

    const handleButtonClick = (value: string) => {
        setInputValue(value);
    };
    const handleCancelClick = () => {
        onClose();
    };

    const handleSendClick = () => {
        // Send payment logic here
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
                <p></p>
                <p className={styles.text}>Paste invoice</p>
                <textarea
                    value={invoice}
                    onChange={(e) => setInvoice(e.target.value)}
                    className={styles.textarea}
                    placeholder="Paste your invoice here"
                />
                <div className={styles.buttonContainer}>
                    <button className={styles.scanButton}>
                        <img src={qrCodeImage} alt="QR Code" className={styles.qrIcon} /> {/* Use the <img> tag */}
                        Scan QR code
                    </button>
                </div>
                <div className={styles.actionRow}>
                    <button onClick={handleCancelClick} className={styles.cancelButton}>Cancel</button>
                    <div className={styles.sendOptions}>
                        <div className={styles.checkboxContainer}>
                            <input
                                type="checkbox"
                                id="sendAnonymously"
                                checked={sendAnonymously}
                                onChange={(e) => setSendAnonymously(e.target.checked)}
                                className={styles.checkbox}
                            />
                            <label htmlFor="sendAnonymously" className={styles.checkboxLabel}>Send anonymously</label>
                        </div>
                        <button onClick={handleSendClick} className={styles.sendButton} disabled={isSendDisabled}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendPayment;