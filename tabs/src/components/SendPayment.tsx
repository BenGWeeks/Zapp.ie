import React, { useState, useEffect, useRef } from 'react';
import { QrReader } from 'react-qr-reader';
import styles from './SendReceivePayment.module.css';
import qrCodeImage from '../images/QRCode.svg';
import checkmarkIcon from '../images/CheckmarkCircleGreen.svg';
import dismissIcon from '../images/DismissCircleRed.svg';
import pasteInvoice from '../images/PasteInvoice.svg';
import bolt11 from 'bolt11';
import {
  payInvoice,
  getWalletPayments,
  getWalletBalance,
  getInvoicePayment,
} from '../services/lnbitsServiceLocal';

interface SendPopupProps {
  onClose: () => void;
  currentUserLNbitDetails: User;
}

interface QrResult {
  getText: () => string;
}

const SendPayment: React.FC<SendPopupProps> = ({
  onClose,
  currentUserLNbitDetails,
}) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  const [inputValue, setInputValue] = useState('');
  const [invoice, setInvoice] = useState('');
  const [invoiceDetails, setInvoiceDetails] = useState<any>();
  const [error, setError] = useState<string | null>(null);
  const [sendAnonymously, setSendAnonymously] = useState(false);
  const [isSendPopupVisible, setIsSendPopupVisible] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [isSuccessFailurePopupVisible, setIsSuccessFailurePopupVisible] =
    useState(false);
  const myLNbitDetails = currentUserLNbitDetails;
  const [isScanning, setIsScanning] = useState(false); // State to track scanning
  const [isQrScanTriggered, setIsQrScanTriggered] = useState(false); // State for handling the popup size and hiding textarea
  const isSendDisabled = !inputValue || !invoice;
  const [qrData, setQRData] = useState('No QR code detected');
  const [isValidQRCode, setIsValidQRCode] = useState(false);
  const [paymentReceived, setPaymentReceived] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  const lnKey = '4be8d48ae93247daad21c4c2363829bb'; // Replace with actual lnKey
  const recipientWalletId = '668e09b5743c47729c902c94890cbc04'; // Replace with actual recipient wallet ID

  const intervalId = useRef<NodeJS.Timeout | null>(null);

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

  const handleCancelClick = () => {
    onClose();
  };

  const handleSendClick = () => {
    setIsSuccessFailurePopupVisible(true);
    setIsSendPopupVisible(true);
    setIsPaymentSuccess(true); // true false based on the payment success
    const memo = sendAnonymously ? 'Anonymous Payment' : 'Payment'; // Adjust memo based on user selection
    console.log('Text Natalia3', invoice);
  
    if (myLNbitDetails && myLNbitDetails.privateWallet && myLNbitDetails.privateWallet.balance_msat >= parseInt(inputValue)) {
      payInvoice(
        myLNbitDetails.privateWallet?.adminkey || '',
        inputValue ? inputValue.split('lightning:').pop() || '' : '',
      )
        .then(invoice => {
          console.log(invoice);
          setInvoice(invoice);
          console.log('test invoice NATALIA5: ', invoice, parseInt(inputValue));
  
          // Record the current timestamp
          const timestamp = Math.floor(Date.now() / 1000);
  
          // Start polling for payment
          intervalId.current = setInterval(() => {
            getWalletPayments(myLNbitDetails.privateWallet?.inkey || '').then(
              payments => {
                if (payments.length > 0) {
                  console.log('Payment sent', 'natalia6');
                  setPaymentReceived(true);
                  if (intervalId.current !== null) {
                    window.clearInterval(intervalId.current);
                  }
  
                  console.log(
                    'Update the wallet balance in the context balance',
                  );
                  // Update the wallet balance in the context balance
                  getWalletBalance(
                    myLNbitDetails.privateWallet?.inkey || '',
                  ).then(balance => {
                    console.log('getWalletBalance:', balance);
                    // Use the new function to set the balance
                    if (balance !== null) {
                      console.log('setWalletBalance to ', balance);
                      setWalletBalance(balance);
                    } else {
                      // Handle the case when balance is null
                      // For example, set a default value or show an error message
                      setWalletBalance(0);
                    }
                  });
                }
              },
            );
          }, 5000); // Check every 5 seconds
        })
        .catch(error => {
          console.error('Error paying invoice:', error);
        });
    } else {
      console.error('Wallet inkey is not defined yet or balance is not enough');
      console.log("You do not have enough coins to send");
      setIsPaymentSuccess(false);
    }
  
    getInvoicePayment(myLNbitDetails.privateWallet?.inkey || '', invoice)
    .then(payment => {
      if (payment) {
        console.log('Natalia 4', payment);
        setPaymentReceived(true);
      }
    })
    .catch(error => {
      console.error('Error getting invoice payment:', error);
      setIsPaymentSuccess(false);
    });
  
    // Check if the user manually entered an amount
    if (inputValue) {
      const amount = parseFloat(inputValue); // Parse the input value as amount
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
        <p className={styles.title}>Send payment</p>
        <p className={styles.text}>
          Show gratitude, thanks, and recognizing awesomeness to others in your
          team
        </p>

        {!isQrScanTriggered && ( // Hide this when QR scan is triggered
          <>
            <div className={styles.container}>
              <div className={styles.inputRow}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  className={styles.inputField}
                  placeholder="Specify amount"
                />
              </div>
            </div>
            <p className={styles.text}>Paste invoice</p>
            <textarea
              value={invoice}
              onChange={e => {
                const inputValue = e.target.value;
                const processedValue = inputValue
                  ? inputValue.split('lightning:').pop()
                  : '';
                console.log('QRCode changed Natalia1', processedValue);
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
                      console.log('QRCode scanned Natalia2', processedInvoice);
                      if (processedInvoice) {
                        try {
                          //TODO this code should give us amount from invoice, but for now is breaking the app
                          // const decoded = bolt11.decode(invoice);  
                          // console.log('QRCode decoded Natalia3', decoded);
                          // setInvoiceDetails(decoded);
                          setError(null);
                        } catch (err) {
                          setError('Invalid invoice');
                          setInvoiceDetails(null);
                        }
                      }

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
            <div className={styles.checkboxContainer}>
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

      {/* Success or failure popup, only visible based on isSuccessFailurePopupVisible */}
      {isSuccessFailurePopupVisible && isPaymentSuccess && (
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
      {isSuccessFailurePopupVisible && !isPaymentSuccess && (
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
            <div className={styles.sendPopupSubText}>
              You do not have enough Sats on your wallet or the link is expired
            </div>
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
