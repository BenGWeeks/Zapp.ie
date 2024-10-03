import React, { useState, useEffect, useRef } from 'react';
import { QrReader } from 'react-qr-reader';
import styles from './SendReceivePayment.module.css';
import qrCodeImage from '../images/QRCode.svg';
import checkmarkIcon from '../images/CheckmarkCircleGreen.svg';
import dismissIcon from '../images/DismissCircleRed.svg';
import pasteInvoice from '../images/PasteInvoice.svg';
import loaderGif from '../images/Loader.gif';
// import bolt11 from 'bolt11';
import {
  payInvoice,
  getWalletPayments,
  getWalletBalance,
} from '../services/lnbitsServiceLocal';

interface SendPopupProps {
  onClose: () => void;
  currentUserLNbitDetails: User;
}

// interface QrResult {
//   getText: () => string;
// }

const SendPayment: React.FC<SendPopupProps> = ({
  onClose,
  currentUserLNbitDetails,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [invoice, setInvoice] = useState('');
  const [sendAnonymously, setSendAnonymously] = useState(false);
  const [isSendPopupVisible, setIsSendPopupVisible] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [isPaymentFailed, setIsPaymentFailed] = useState(false);
  const [isSuccessFailurePopupVisible, setIsSuccessFailurePopupVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const myLNbitDetails = currentUserLNbitDetails;
  const [isScanning, setIsScanning] = useState(false); // State to track scanning
  const [isQrScanTriggered, setIsQrScanTriggered] = useState(false); // State for handling the popup size and hiding textarea
  const isSendDisabled = !inputValue || !invoice;
  const [qrData, setQRData] = useState('No QR code detected');
  const [isValidQRCode, setIsValidQRCode] = useState(false);
  const [paymentReceived, setPaymentReceived] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [failureMessage, setFailureMessage] = useState('');
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePaymentFailure = (message: string) => {
    setFailureMessage(message);
    setIsPaymentSuccess(false);
    setIsPaymentFailed(true);
    setIsSuccessFailurePopupVisible(true);
    setIsLoading(false);
    console.log(message);
  };

  const validateQRCode = (code: string) => {
    return code.startsWith('lightning');
  };

  useEffect(() => {
    setIsValidQRCode(validateQRCode(qrData));
  }, [qrData]);

  const handleCancelClick = () => {
    setIsLoading(true);
    setIsPaymentSuccess(false);
    setIsPaymentFailed(false);
    setIsSendPopupVisible(false);
    setIsSuccessFailurePopupVisible(false);
    onClose();
  };

  const handleSendClick = () => {
    setIsLoading(true);
    const memo = sendAnonymously ? 'Anonymous Payment' : 'Payment'; // Adjust memo based on user selection
    console.log('handleSendClick. Start. Invoice link: ', invoice);

    if (!myLNbitDetails) {
      handlePaymentFailure('Something wrong with your wallet');
    } else if (!myLNbitDetails.privateWallet) {
      handlePaymentFailure('Something wrong with your Private wallet');
    } else if (
      myLNbitDetails.privateWallet.balance_msat < parseInt(inputValue)
    ) {
      handlePaymentFailure('You do not have enough Sats on your wallet');
    } else {
      payInvoice(myLNbitDetails.privateWallet?.adminkey || '', invoice)
        .then(invoice => {
          console.log(invoice);
          setInvoice(invoice);
          setIsPaymentSuccess(true);
          setIsPaymentFailed(false);
          setIsSendPopupVisible(true);
          setIsSuccessFailurePopupVisible(true); // Show the success popup
          setIsLoading(false);
          startPollingPayments(); // Start polling for payments
        })
        .catch(error => {
          console.error('Error paying invoice:', error);
          handlePaymentFailure(
            'Error paying invoice. The link might be expired or you do not have enough Sats on your wallet',
          ); // Condition 4
        });
    }
  };

  const startPollingPayments = () => {
    intervalId.current = setInterval(() => {
      getWalletPayments(myLNbitDetails.privateWallet?.inkey || '').then(
        payments => {
          if (payments.length > 0) {
            setPaymentReceived(true);
            if (intervalId.current !== null) {
              window.clearInterval(intervalId.current);
            }
            updateWalletBalance();
          }
        },
      );
    }, 5000); // Poll every 5 seconds
  };

  const updateWalletBalance = () => {
    getWalletBalance(myLNbitDetails.privateWallet?.inkey || '').then(
      balance => {
        if (balance !== null) {
          setWalletBalance(balance);
        } else {
          setWalletBalance(0); // Handle the case when balance is null
        }
      },
    );
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
        style={{ height: isQrScanTriggered ? '520px' : '420px' }} // Dynamically change popup height
      >
        <p className={styles.title}>Send payment</p>
        <p className={styles.text}>
          Show gratitude, thanks, and recognizing awesomeness to others in your
          team
        </p>

        {!isQrScanTriggered && ( // Hide this when QR scan is triggered
          <>
            <p className={styles.text}>Paste invoice</p>
            <textarea
              value={invoice}
              onChange={e => {
                const inputValue = e.target.value;
                const processedValue = inputValue
                  ? inputValue.split('lightning:').pop()
                  : '';
                setInvoice(processedValue || '');
              }}
              className={styles.textarea}
              placeholder="Paste your invoice here"
            />
            <div className={styles.buttonContainer}>
              <button
                onClick={handleScanButtonClick}
                className={styles.scanButton}
              >
                <img
                  src={qrCodeImage}
                  alt="QR Code"
                  className={styles.qrIcon}
                />
                Scan QR code
              </button>
            </div>
            <div className={styles.container}>
              <div className={styles.inputRow}>
                <input
                  type="number"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  className={styles.inputField}
                  placeholder="Specify amount"
                />
              </div>
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
                  scanDelay={300} // Add a slight delay between scans
                  onResult={(result, error) => {
                    if (result) {
                      // Log the result for debugging
                      console.log(result); // Remove "lightning:" prefix from the scanned QR code result
                      const processedInvoice = result.getText()
                        ? result.getText().split('lightning:').pop() // Remove "lightning:" prefix
                        : '';
                      console.log('QRCode scanned', processedInvoice);
                      //TODO this code should give us amount from invoice (before paying), but for now is breaking the app
                      /*if (processedInvoice) {
                        try {
                          // const decoded = bolt11.decode(invoice);
                          // console.log('QRCode decoded Natalia3', decoded);
                          // setInvoiceDetails(decoded);
                          setError(null);
                        } catch (err) {
                          setError('Invalid invoice');
                          setInvoiceDetails(null);
                        }
                      }*/

                      setInvoice(processedInvoice || '');
                      setIsQrScanTriggered(false); // Hide the QR reader after scanning
                    }

                    if (error) {
                      console.error('QR Scan Error:', error); // Log errors for debugging
                    }
                  }}
                  containerStyle={{ width: '100%' }} // Ensure the QR reader takes full width
                />
              </div>
            </div>
            <button
              type="button"
              className={styles.scanButton}
              onClick={handlePasteInvoiceClick}
            >
              <img
                src={pasteInvoice}
                alt="paste invoice"
                className={styles.qrIcon}
              />
              Paste invoice
            </button>
          </React.Fragment>
        )}

        <div className={styles.actionRow}>
          <button onClick={handleCancelClick} className={styles.cancelButton}>
            Cancel
          </button>
          <div className={styles.sendOptions}>
            <div
              className={styles.checkboxContainer}
              style={{ display: 'none' }}
            >
              <input
                type="checkbox"
                id="sendAnonymously"
                checked={sendAnonymously}
                onChange={e => setSendAnonymously(e.target.checked)}
                className={styles.checkbox}
              />
              <label htmlFor="sendAnonymously" className={styles.checkboxLabel}>
                Send anonymously
              </label>
            </div>
            <button
              onClick={handleSendClick}
              className={
                isSendDisabled ? styles.sendButton : styles.sendButtonEnabled
              }
              disabled={isSendDisabled}
            >
              Send
            </button>
          </div>
        </div>
      </div>
      {isLoading && (
        <div className={styles.loaderOverlay}>
          <img src={loaderGif} alt="Loading..." className={styles.loaderIcon} />
          <p>Processing payment...</p>
        </div>
      )}
      {/* Success or failure popup, only visible based on isSuccessFailurePopupVisible */}
      {!isLoading && isSuccessFailurePopupVisible && isPaymentSuccess && (
        <div className={styles.overlay} onClick={handleOverlayClick}>
          <div className={styles.sendPopupSuccess}>
            <div className={styles.sendPopupHeader}>
              <img
                src={checkmarkIcon}
                alt="Checkmark"
                className={styles.checkmarkIcon}
              />
              <div className={styles.sendPopupText}>
                Payment sent successfully!
              </div>
            </div>
          </div>
        </div>
      )}
      {!isLoading && isSuccessFailurePopupVisible && !isPaymentSuccess && (
        <div className={styles.overlay} onClick={handleOverlayClick}>
          <div className={styles.sendPopupFailed}>
            <div className={styles.sendPopupHeader}>
              <img
                src={dismissIcon}
                alt="Dismiss"
                className={styles.checkmarkIcon}
              />
              <div className={styles.sendPopupText}>Payment cannot be sent</div>
            </div>
            <div className={styles.sendPopupSubText}>{failureMessage}</div>
            <div className={styles.buttonContainerSmallPopup}>
              <button
                className={styles.cancelButton}
                onClick={handleCancelClick}
              >
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
