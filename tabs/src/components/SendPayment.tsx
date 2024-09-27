import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import styles from './SendReceivePayment.module.css';
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
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
    const [isSuccessFailurePopupVisible, setIsSuccessFailurePopupVisible] = useState(false);
    const [isScanning, setIsScanning] = useState(false); // State to track scanning
    const [isQrScanTriggered, setIsQrScanTriggered] = useState(false); // State for handling the popup size and hiding textarea
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
        setIsPaymentSuccess(false); // true false based on the payment success
    };

    const handleChangeAmountClick = () => {
        setIsSuccessFailurePopupVisible(false);
    };

    const handleScanButtonClick = () => {
        setIsQrScanTriggered(true); // Set the state to true when scan button is clicked
        setIsScanning(true);
    };

    const handlePasteInvoiceClick = () => {
        const scannedData = "Scanned QR Code Data"; // Replace with actual scanned data
        setInvoice(scannedData);
        setIsScanning(false);
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div
                className={styles.popup}
                style={{ height: isQrScanTriggered ? '520px' : '400px' }} // Dynamically change popup height
            >
                <p className={styles.title}>Send some zaps</p>
                <p className={styles.text}>Show gratitude, thanks, and recognizing awesomeness to others in your team</p>


                {!isQrScanTriggered && ( // Hide this when QR scan is triggered
                    <>
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
                        <p className={styles.text}>Paste invoice</p>
                        <textarea
                            value={invoice}
                            onChange={(e) => setInvoice(e.target.value)}
                            className={styles.textarea}
                            placeholder="Paste your invoice here"
                        />
                        <div className={styles.buttonContainer}>
                            <button onClick={handleScanButtonClick} className={styles.scanButton}>
                                <img src={qrCodeImage} alt="QR Code" className={styles.qrIcon} />
                                Scan QR code
                            </button>
                        </div>
                    </>
                )}

                {isQrScanTriggered && ( // Show this when QR scan is triggered
                    <React.Fragment>
                        <p className={styles.text}>Scan QR code</p>
                        <div className={styles.qrReaderForm}>

                            <div className={styles.qrReaderContainer}>
                                <QrReader
                                    constraints={{ facingMode: 'user' }}  // Switch between 'user' (front) or 'environment' (back) camera
                                    scanDelay={300}                        // Add a slight delay between scans
                                    onResult={(result, error) => {
                                        if (result) {
                                            // Log the result for debugging
                                            console.log(result);
                                            setInvoice(result.getText() || "");  // Depending on the result, you may have to use result.getText() or result.getData()
                                            setIsQrScanTriggered(false);    // Hide the QR reader after scanning
                                        }

                                        if (error) {
                                            console.error('QR Scan Error:', error);  // Log errors for debugging
                                        }
                                    }}
                                    containerStyle={{ width: '100%' }}  // Ensure the QR reader takes full width
                                />


                            </div>

                        </div>
                        <button type="button" className={styles.scanButton} onClick={handlePasteInvoiceClick}>
                            Paste invoice
                        </button>
                    </React.Fragment>
                )}



                <div className={styles.actionRow}>
                    <button onClick={handleCancelClick} className={styles.cancelButton}>
                        Cancel
                    </button>
                    <div className={styles.sendOptions}>
                        <div className={styles.checkboxContainer}>
                            <input
                                type="checkbox"
                                id="sendAnonymously"
                                checked={sendAnonymously}
                                onChange={(e) => setSendAnonymously(e.target.checked)}
                                className={styles.checkbox}
                            />
                            <label htmlFor="sendAnonymously" className={styles.checkboxLabel}>
                                Send anonymously
                            </label>
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
                        <div className={styles.sendPopupSubText}>
                            You do not have enough Sats on your wallet
                        </div>
                        <div className={styles.buttonContainerSmallPopup}>
                            <button className={styles.cancelButton} onClick={handleCancelClick}>
                                Cancel
                            </button>
                            <button
                                className={styles.changeAmountButton}
                                onClick={handleChangeAmountClick}
                            >
                                Change amount
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SendPayment;
