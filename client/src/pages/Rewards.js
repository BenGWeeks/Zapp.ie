import React, { useEffect, useState } from 'react';
import { DocumentCard, DocumentCardImage, DocumentCardTitle, DocumentCardDetails, PrimaryButton } from '@fluentui/react';

const Rewards = () => {
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/rewards`)
      .then(response => response.json())
      .then(data => setRewards(data));
  }, []);

  return (
    <div style={{ display: 'flex', overflowX: 'auto', gap: '1rem' }}>
      {rewards.map((reward, index) => (
        <DocumentCard key={index}>
          <DocumentCardImage imageFit='cover' height={150} imageSrc={reward.image} />
          <DocumentCardDetails>
            <DocumentCardTitle title={reward.title} shouldTruncate />
            <p>{reward.description}</p>
            <p>Amount: {reward.amount}</p>
            <PrimaryButton text="Redeem" />
          </DocumentCardDetails>
        </DocumentCard>
      ))}
    </div>
  );
};

export default Rewards;
