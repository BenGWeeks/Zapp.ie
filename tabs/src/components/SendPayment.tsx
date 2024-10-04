import React, { useState, useEffect, useRef } from 'react';
//import { QrReader } from 'react-qr-reader';
import { Scanner } from '@yudiel/react-qr-scanner'; // New scanner than 'react-qr-scanner' and looks to be maintained here: https://github.com/yudielcurbelo/react-qr-scanner
import { IDetectedBarcode } from '@yudiel/react-qr-scanner'; // Import the type if needed
import styles from './SendReceivePayment.module.css';
import qrCodeImage from '../images/QRCode.svg';
import checkmarkIcon from '../images/CheckmarkCircleGreen.svg';
import dismissIcon from '../images/DismissCircleRed.svg';
import pasteInvoice from '../images/PasteInvoice.svg';
import loaderGif from '../images/Loader.gif';
//import { decodePaymentRequest } from 'ln-service';
//import bolt11 from 'bolt11';
import { decode } from 'light-bolt11-decoder'; // Lightweight decoder for bolt11 invoices from fiatjaf
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
  const isSendDisabled = !inputValue || !invoice;
  const [qrData, setQRData] = useState('No QR code detected');
  const [isValidQRCode, setIsValidQRCode] = useState(false);
  const [paymentReceived, setPaymentReceived] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [failureMessage, setFailureMessage] = useState('');
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const [decodedInvoice, setDecodedInvoice] = useState<any>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const isMounted = useRef<boolean>(true);
  const [invoiceAmount, setInvoiceAmount] = useState<number>();
  const [isAmountReadOnly, setIsAmountReadOnly] = useState<boolean>(false);

  useEffect(() => {
    isMounted.current = true;

    // Return cleanup function to handle component unmounting
    return () => {
      isMounted.current = false;
    };
  }, []);

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

  /*
  useEffect(() => {
    setIsValidQRCode(validateQRCode(qrData));
  }, [qrData]);
  */

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
    setIsScanning(true);
  };

  const handlePasteInvoiceClick = () => {
    setIsScanning(false);
  };

  const handleScan = async (detectedCodes: IDetectedBarcode[]) => {
    if (!isMounted.current) return; // Ensure component is mounted

    if (detectedCodes.length > 0) {
      const data = detectedCodes[0].rawValue; // Assuming you want to process the first detected code
      const processedInvoice = data.split('lightning:').pop() || '';
      console.log('QRCode scanned', processedInvoice);
      if (processedInvoice) {
        try {
          const decodedInvoice = decode(processedInvoice);
          console.log('QRCode decoded', decodedInvoice);

          const amountSection = decodedInvoice.sections.find(
            (section: any) => section.name === 'amount',
          ) as { name: string; value: string };

          // Access the amount value safely
          const amountValue = parseInt(amountSection?.value ?? null);

          console.log('Invoice amount (milliSats): ', amountValue); // Outputs: '181537000'

          // Only set state if the component is still mounted
          if (isMounted.current) {
            setDecodedInvoice(decodedInvoice);
            if (decodedInvoice && amountValue) {
              setInvoiceAmount(amountValue / 1000);
              setIsAmountReadOnly(true);
            }
          }
        } catch (err) {
          console.error('Error decoding invoice:', err);
          if (isMounted.current) {
            setDecodedInvoice(null);
          }
        }
      }

      if (isMounted.current) {
        setInvoice(processedInvoice || '');
        setIsScanning(false);
      }
    }
  };

  const handleError = (error: any) => {
    console.error('QR Scan Error:', error);
  };

  const setInvoiceDetails = (decoded: any) => {};

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div
        className={styles.popup}
        style={{ height: isScanning ? '604px' : '420px' }} // Dynamically change popup height
      >
        <p className={styles.title}>Send payment</p>
        <p className={styles.text}>
          Show gratitude, thanks, and recognizing awesomeness to others in your
          team
        </p>

        {!isScanning && ( // Hide this when QR scan is triggered
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
                  value={invoiceAmount}
                  readOnly={isAmountReadOnly}
                  onChange={e => setInputValue(e.target.value)}
                  className={styles.inputField}
                  placeholder="Specify amount"
                />
              </div>
            </div>
          </>
        )}

        {isScanning && ( // Show this when QR scan is triggered
          <React.Fragment>
            <p className={styles.text}>Scan QR code</p>
            <div className={styles.qrReaderForm}>
              <div className={styles.qrReaderContainer}>
                <Scanner
                  //constraints={{ facingMode: 'user' }}
                  scanDelay={100} //scanDelay={300} // Add a slight delay between scans
                  onError={handleError} // Log errors for debugging
                  components={{ finder: false }} // Disable the red finder box
                  paused={!isMounted.current || !isScanning} // Pause scanning when unmounted or when scanning is not active
                  //onResult={(result, error) => {
                  onScan={handleScan} // Handle the scan result
                  styles={{
                    video: {
                      objectFit: 'cover', // Make the video fill the parent container
                      width: '100%',
                      height: '100%',
                    },
                  }}
                  //containerStyle={{ width: '100%' }} // Ensure the QR reader takes full width
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
