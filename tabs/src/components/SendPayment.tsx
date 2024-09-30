import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import styles from './SendReceivePayment.module.css';
import qrCodeImage from '../images/QRCode.svg';
import checkmarkIcon from '../images/CheckmarkCircleGreen.svg';
import dismissIcon from '../images/DismissCircleRed.svg';
import pasteInvoice from '../images/PasteInvoice.svg';
import { createInvoice } from '../services/lnbitsServiceLocal';

interface SendPopupProps {
    onClose: () => void;
}

interface QrResult {
    getText: () => string;
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
    const [qrData, setQRData] = useState('No QR code detected');
    const [isValidQRCode, setIsValidQRCode] = useState(false);
    const [invoiceData, setInvoiceData] = useState<string | null>(null); // Store the invoice response
    const [loading, setLoading] = useState(false); // Loading state for invoice creation
    
    const lnKey = '4be8d48ae93247daad21c4c2363829bb'; // Replace with actual lnKey
    const recipientWalletId = '668e09b5743c47729c902c94890cbc04'; // Replace with actual recipient wallet ID

    const validateQRCode = (code: string) => {
        return code.startsWith('lightning');
      };
      
      useEffect(() => {
        if (qrData !== 'No QR code detected') {
          setIsValidQRCode(validateQRCode(qrData));
        } else {
          setIsValidQRCode(false);
        }
      }, [qrData]);

    const handleButtonClick = (value: string) => {
        setInputValue(value);
    };

    const handleCancelClick = () => {
        onClose();
    };

    // Refactor handleResult to be used by both QR scan and manual data entry
    const handleResult = async (amount: number, memo: string, extra: object = {}) => {
        setLoading(true); // Show loading while creating the invoice
        try {
            // Use your imported createInvoice function
            const paymentRequest = await createInvoice(lnKey, recipientWalletId, amount, memo, extra);
            setInvoiceData(paymentRequest); // Store the generated invoice/payment request
            setIsQrScanTriggered(false); // Close the QR scanner
            console.log('Invoice created:', paymentRequest);
        } catch (error) {
            console.error('Error creating invoice:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendClick = () => {
        setIsSuccessFailurePopupVisible(true);
        setIsSendPopupVisible(true);
        setIsPaymentSuccess(true); // true false based on the payment success// Adjust this based on actual payment success
        const memo = sendAnonymously ? 'Anonymous Payment' : 'Payment'; // Adjust memo based on user selection

        // Check if the user manually entered an amount
        if (inputValue) {
            const amount = parseFloat(inputValue); // Parse the input value as amount
            handleResult(amount, memo); // Create invoice using the manually entered amount
            console.log('Amount:', amount);
        }
    };

    const handleChangeAmountClick = () => {
        setIsSuccessFailurePopupVisible(false);
    };

    const handleScanButtonClick = () => {
        setIsQrScanTriggered(true); // Set the state to true when scan button is clicked
        setIsScanning(true);
    };

    const handlePasteInvoiceClick = () => {
        setIsScanning(false);
        setIsQrScanTriggered(false);
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
                        <p className={styles.text}>
                            Paste invoice</p>
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
                                    constraints={{ facingMode: 'user' }}
                                    scanDelay={300}                        // Add a slight delay between scans
                                    onResult={(result, error) => {
                                        if (result) {
                                            // Log the result for debugging
                                            console.log(result);
                                            setInvoice(result.getText() || "");
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
                            <img src={pasteInvoice} alt="paste invoice" className={styles.qrIcon} />
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

