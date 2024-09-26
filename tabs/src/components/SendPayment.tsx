import React, { useState } from 'react';
import styles from './SendPayment.module.css';
import qrCodeImage from '../images/QRCode.svg';
import checkmarkIcon from '../images/CheckmarkCircleGreen.svg';
import dismissIcon from '../images/DismissCircleRed.svg';

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
    const [isSendPopupVisible, setIsSendPopupVisible] = useState(false); 
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false); // need to add logic to check if payment was successful
    const [isSuccessFailurePopupVisible, setIsSuccessFailurePopupVisible] = useState(false);
    const isSendDisabled = !inputValue || !invoice;

    const handleButtonClick = (value: string) => {
        setInputValue(value);
    };

    const handleCancelClick = () => {
        onClose();
    };

    const handleSendClick = () => {
        setIsSuccessFailurePopupVisible(true); 
        setIsSendPopupVisible(true);
        setIsPaymentSuccess(true); // Show the success OR failure popup
    };

    const handleChangeAmountClick = () => {
        setIsSuccessFailurePopupVisible(false);
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.popup}>
                <p className={styles.title}>Send some zaps</p>
                <p className={styles.text}>Show gratitude, thanks, and recognizing awesomeness to others in your team</p>
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
                        <img src={qrCodeImage} alt="QR Code" className={styles.qrIcon} />
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
                        <button
                            onClick={handleSendClick}
                            className={isSendDisabled ? styles.sendButton : styles.sendButtonEnabled}
                            disabled={isSendDisabled}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
            {/* Success or failure popup, only visible based on isSuccessFailurePopupVisible */}
            {isSuccessFailurePopupVisible && isPaymentSuccess && (
                <div className={styles.overlay} onClick={handleOverlayClick}>
                    <div className={styles.sendPopupSuccess}>
                        <div className={styles.sendPopupHeader}>
                            <img src={checkmarkIcon} alt="Checkmark" className={styles.checkmarkIcon} />
                            <div className={styles.sendPopupText}>Zaps sent successfully!</div>
                        </div>
                    </div>
                </div>
            )}
            {isSuccessFailurePopupVisible && !isPaymentSuccess && (
                <div className={styles.overlay} onClick={handleOverlayClick}>
                    <div className={styles.sendPopupFailed}>
                        <div className={styles.sendPopupHeader}>
                            <img src={dismissIcon} alt="Dismiss" className={styles.checkmarkIcon} />
                            <div className={styles.sendPopupText}>Zaps cannot be sent</div>
                        </div>
                        <div className={styles.sendPopupSubText}>You do not have enough Sats on your wallet</div>
                        <div className={styles.buttonContainerSmallPopup}>
                            <button className={styles.cancelButton} onClick={handleCancelClick}>Cancel</button>
                            <button className={styles.changeAmountButton} onClick={handleChangeAmountClick}>Change amount</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SendPayment;
