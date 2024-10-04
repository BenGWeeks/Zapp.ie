import React, { useState, useEffect, useRef } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { IDetectedBarcode } from '@yudiel/react-qr-scanner';
import styles from './SendReceivePayment.module.css';
import qrCodeImage from '../images/QRCode.svg';
import checkmarkIcon from '../images/CheckmarkCircleGreen.svg';
import dismissIcon from '../images/DismissCircleRed.svg';
import pasteInvoice from '../images/PasteInvoice.svg';
import loaderGif from '../images/Loader.gif';
import { decode } from 'light-bolt11-decoder';
import {
  payInvoice,
  getWalletPayments,
  getWalletBalance,
} from '../services/lnbitsServiceLocal';

interface SendPopupProps {
  onClose: () => void;
  currentUserLNbitDetails: User;
}

const SendPayment: React.FC<SendPopupProps> = ({
  onClose,
  currentUserLNbitDetails,
}) => {
  const [invoice, setInvoice] = useState('');
  const [isSendPopupVisible, setIsSendPopupVisible] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [isPaymentFailed, setIsPaymentFailed] = useState(false);
  const [isSuccessFailurePopupVisible, setIsSuccessFailurePopupVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const myLNbitDetails = currentUserLNbitDetails;
  const isSendDisabled = !invoice;
  const [paymentReceived, setPaymentReceived] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [failureMessage, setFailureMessage] = useState('');
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const isMounted = useRef<boolean>(true);
  const [invoiceAmount, setInvoiceAmount] = useState<number | null>();
  const [invoiceMemo, setInvoiceMemo] = useState<string | null>();
  const [isAmountReadOnly, setIsAmountReadOnly] = useState<boolean>(true);
  const [scannerPaused, setScannerPaused] = useState(true); // Make sure scanner starts paused
  const [qrError, setQrError] = useState<string | null>(null);


  // Effect for controlling scanner state
  useEffect(() => {
    return () => {
      isMounted.current = false;
      setScannerPaused(true); // Pause the scanner when the component unmounts
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
  };

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
    const memo = 'Payment'; // Static memo (no anonymous option in this version) //TODO

    if (!myLNbitDetails || !myLNbitDetails.privateWallet) {
      handlePaymentFailure('Something wrong with your wallet');
    } else {
      payInvoice(myLNbitDetails.privateWallet?.adminkey || '', invoice)
        .then(invoice => {
          setInvoice(invoice);
          setIsPaymentSuccess(true);
          setIsPaymentFailed(false);
          setIsSendPopupVisible(true);
          setIsSuccessFailurePopupVisible(true); // Show the success popup
          setIsLoading(false);
          startPollingPayments(); // Start polling for payments
        })
        .catch(error => {
          handlePaymentFailure(
            'Error paying invoice. The link might be expired or you do not have enough Sats on your wallet',
          );
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
        setWalletBalance(balance !== null ? balance : 0);
      },
    );
  };

  const handleScanButtonClick = () => {
    setIsScanning(true);
    setScannerPaused(false); // Activate scanner when scanning starts
  };

  const handlePasteInvoiceClick = () => {
    setIsScanning(false);
    setScannerPaused(true); // Ensure scanner is paused when pasting the invoice manually
  };

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const decodeAndSetInvoice = async (processedInvoice: string) => {
    try {
      const decodedInvoice = decode(processedInvoice);
      const amountSection = decodedInvoice.sections.find(
        (section: any) => section.name === 'amount',
      ) as { name: string; value: string } | undefined;

      const amountValue = amountSection ? parseInt(amountSection.value) : null;
      const invoiceAmountInSatoshis = amountValue ? amountValue / 1000 : undefined;

      const memoSection = decodedInvoice.sections.find(
        (section: any) => section.name === 'description',
      ) as { name: string; value: string } | undefined;
      const memoValue = memoSection ? String(memoSection.value) : undefined;

      setInvoiceAmount(invoiceAmountInSatoshis);
      setInvoiceMemo(memoValue);
      setInvoice(processedInvoice);
      setIsAmountReadOnly(true); // Make input read-only if needed
    } catch (err) {
      console.error('Error decoding invoice:', err);
      setInvoiceAmount(null);
      setInvoiceMemo(null);
    }
  };

  const handleScan = debounce(async (detectedCodes: IDetectedBarcode[]) => {
    if (!isMounted.current) return;

    if (detectedCodes.length > 0) {
      const data = detectedCodes[0].rawValue;
      const processedInvoice = data.split('lightning:').pop() || '';

      if (processedInvoice) {
        await decodeAndSetInvoice(processedInvoice);
        setIsScanning(false);
        setScannerPaused(true);
      }
    }
  }, 500);

  const handleError = (error: any) => {
    // Suppress the error to prevent it from throwing an uncaught runtime error
    try {
      console.error('QR Scan Error:', error);
      if (error.name === 'NotAllowedError') {
        setQrError('Camera access was denied. Please enable camera permissions in your browser settings.');
      } else {
        setQrError('An error occurred while accessing the camera. Please try again.');
      }
    } catch (err) {
      // If any other unexpected error occurs, log it but do not throw it to the console
      console.warn('Suppressed error:', err);
      setQrError('An unexpected error occurred. Please try again.');
    }
  };

  window.addEventListener('unhandledrejection', function (event) {
    if (event.reason.message.includes('Permission denied')) {
      // Prevent the error from being logged as uncaught
      event.preventDefault();
    }
  });

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div
        className={styles.popup}
        style={{ height: isScanning ? '604px' : '420px' }}
      >
        <p className={styles.title}>Send payment</p>
        <p className={styles.text}>
          Show gratitude, thanks, and recognizing awesomeness to others in your
          team
        </p>

        {!isScanning && (
          <>
            <p className={styles.text}>Paste invoice</p>
            <textarea
              value={invoice}
              onChange={async e => {
                const inputValue = e.target.value;
                const processedValue = inputValue
                  ? inputValue.split('lightning:').pop()
                  : '';
                setInvoice(processedValue || '');

                if (processedValue) {
                  await decodeAndSetInvoice(processedValue);
                }
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
                  type="text"
                  value={`${invoiceAmount !== undefined ? invoiceAmount : ''} Sats ${
                    invoiceMemo ? `Note: ${invoiceMemo}` : ''
                  }`}
                  readOnly={isAmountReadOnly}
                  className={styles.inputField}
                  placeholder="Specify amount"
                />
              </div>
            </div>
          </>
        )}

        {isScanning && (
          <React.Fragment>
            <p className={styles.text}>Scan QR code</p>
            <div className={styles.qrReaderForm}>
              <div className={styles.qrReaderContainer}>
                <Scanner
                  constraints={{ facingMode: 'user' }}
                  scanDelay={300}
                  onError={handleError}
                  components={{ finder: false }}
                  paused={scannerPaused} // Ensure scanner is only active when scanning
                  onScan={handleScan}
                  styles={{
                    video: {
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%',
                    },
                  }}
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
              <div className={styles.sendPopupText}>
                Payment cannot be sent
              </div>
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
                onClick={handlePasteInvoiceClick}
              >
                Change amount
              </button>
            </div>
          </div>
        </div>
      )}
      {qrError && (
  <div className={styles.overlay} onClick={handleOverlayClick}>
    <div className={styles.errorPopup}>
      <div className={styles.sendPopupHeader}>
        <img src={dismissIcon} alt="Error" className={styles.checkmarkIcon} />
        <div className={styles.sendPopupText}>
          {qrError}
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default SendPayment;
