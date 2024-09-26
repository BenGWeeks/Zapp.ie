import React, { useState } from 'react';
import styles from './SendReceivePayment.module.css';
import copyDoc from '../images/DocumentCopy.svg';
import copySuccess from '../images/CheckmarkCircleGreen.svg';

interface ReceivePopupProps {
    onClose: () => void;
}

const ReceivePayment: React.FC<ReceivePopupProps> = ({ onClose }) => {
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    const [inputValue, setInputValue] = useState('');
    const [textToCopy, setTextToCopy] = useState('');
    const [buttonText, setButtonText] = useState('Copy');
    const [isSuccessFailurePopupVisible, setIsSuccessFailurePopupVisible] = useState(false);
    const isSendDisabled = !inputValue;

    const handleButtonClick = (value: string) => {
        setInputValue(value);
    };

    const handleCancelClick = () => {
        onClose();
    };

    const handleSendClick = () => {
        setIsSuccessFailurePopupVisible(true);
    };

    const handleCopyClick = () => {
        // Logic to copy the text to clipboard
        const textToCopy = "lnbc1pjzw7k0pp54vsv2efpkg4xhp3gnf70uq0jst3380x5h3ljhscy2k2cpllv88jsdqu2askcmr9wssx7e3q2dshgmmndp5scqzpgxqyz5vqsp560g2pj806uqm9kv...";
        navigator.clipboard.writeText(textToCopy);
        console.log("Text copied to clipboard: ", textToCopy);
        setButtonText('Copied');
        console.log("Text copied to clipboard: ", setButtonText);
    };

    const handleCloseClick = () => {
        setTextToCopy('');
        onClose();
        console.log("Text copied to clipboard: ", textToCopy);
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.popupReceive}>
                <p className={styles.title}>Receive zaps</p>
                <p className={styles.text}>Create an invoice to allow others to send you some zaps</p>
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

                <div className={styles.actionRow}>
                    <button onClick={handleCancelClick} className={styles.cancelButton}>Cancel</button>
                    <div className={styles.sendOptions}>
                        <button
                            onClick={handleSendClick}
                            className={isSendDisabled ? styles.sendButton : styles.sendButtonEnabled}
                            disabled={isSendDisabled}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {isSuccessFailurePopupVisible && (
                <div className={styles.overlay} onClick={handleOverlayClick}>
                    <div className={styles.receivePopupWithQrCode}>
                        <p className={styles.title}>Receive zaps</p>
                        <p className={styles.text}>Create an invoice to allow others to send you some zaps</p>
                        <div className={styles.sendQrCodeContainer}>
                            <div className={styles.qrCode}>
                                {/* QR code content goes here */}
                            </div>
                            <div className={styles.txtContainer}>
                                <div className={styles.title}>Lightning invoice</div>
                                <div className={styles.txtContainer}>lnbc1pjzw7k0pp54vsv2efpkg4xhp3gnf70uq0jst3380x5h3ljhscy2k2cpllv88jsdqu2askcmr9wssx7e3q2dshgmmndp5scqzpgxqyz5vqsp560g2pj806uqm9kv...</div>
                                <div className={styles.receiveButtonContainer}>
                                    <button className={styles.copyButton} onClick={handleCopyClick}>
                                        <img
                                            src={buttonText === 'Copy' ? copyDoc : copySuccess}
                                            alt={buttonText === 'Copy' ? 'Copy Code' : 'Copy Success'}
                                            className={styles.copyIcon}
                                        />{buttonText}</button>
                                    <button className={styles.closeButton} onClick={handleCloseClick}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ReceivePayment;
