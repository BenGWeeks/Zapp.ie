// filepath: /c:/projects/ZapVibes/tabs/src/components/currencySetting.tsx
import React, { FunctionComponent, useState, useEffect } from 'react';
import styles from './setting.module.css';
import { getRewardName, updateRewardName } from '../apiService';

const CurrencySetting: FunctionComponent = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [currency, setCurrency] = useState(''); // Default value

  useEffect(() => {
    const fetchRewardName = async () => {
      try {
        const data = await getRewardName();
        setCurrency(data.rewardName);
      } catch (error) {
        console.error('Error fetching reward name:', error);
      }
    };

    fetchRewardName();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setIsEditing(false);
    try {
      const data = await updateRewardName(currency);
      console.log('Reward name saved:', data.rewardName);
    } catch (error) {
      console.error('Error updating reward name:', error);
    }
  };

  return (
    <div className={styles.currencySetting}>
      <label className={styles.label}>Reward Name</label>
      <div className={styles.inputGroup}>
        <input
          type="text"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          disabled={!isEditing}
          className={`${styles.textBox} ${isEditing ? styles.editing : ''}`}
          title="Reward name"
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