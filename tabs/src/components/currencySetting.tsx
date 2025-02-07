import React, { FunctionComponent, useState } from 'react';
import styles from './setting.module.css';

const CurrencySetting: FunctionComponent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [currency, setCurrency] = useState('sats'); // Default value

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    // Add your save logic here
    console.log('Currency saved:', currency);
  };

  return (
    <div className={styles.currencySetting}>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Currency</label>
        <input
          type="text"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          disabled={!isEditing}
          className={styles.textBox}
          title="Currency Input"
          placeholder="Enter currency"
        />
        {!isEditing ? (
          <button onClick={handleEditClick} className={styles.editButton}>
            Edit
          </button>
        ) : (
          <button onClick={handleSaveClick} className={styles.saveButton}>
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default CurrencySetting;