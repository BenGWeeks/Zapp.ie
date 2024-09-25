import React, { useEffect } from 'react';
import styles from './PurchasePopup.module.css';

interface PurchasePopupProps {
    onClose: () => void;
    wallet: Wallet; // Accept wallet as a prop
    hasEnoughSats: boolean; // Accept hasEnoughSats as a prop
}

const PurchasePopup: React.FC<PurchasePopupProps> = ({ onClose, wallet, hasEnoughSats }) => {
    const message = hasEnoughSats
        ? 'You have enough Sats to redeem this reward'
        : 'You do not have enough Sats to redeem this reward';

    const handleOverlayClick = () => {
        onClose();
    };

    const handlePopupClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    // Log wallet ID and balance to the console
    useEffect(() => {
        console.log('Wallet ID:', wallet.id);
        console.log('Balance:', wallet.balance_msat / 1000, 'Sats');
    }, [wallet]);

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.popup} onClick={handlePopupClick}>
                <p className={styles.title}>Buy the reward</p>
                <p className={styles.message}>{message}</p> {/* Display the message based on the boolean value */}
                <div className={styles.qrContainer}>
                    {/* QR code or content goes here */}
                </div>
                <div className={styles.buttonContainer}>
                    <button className={styles.closeButton} onClick={onClose}>Close</button>
                    <button className={hasEnoughSats ? styles.buyButton : styles.buyButtonDisabled}>Buy</button>
                </div>
            </div>
        </div>
    );
};

export default PurchasePopup;