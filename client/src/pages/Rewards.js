import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { DocumentCard, DocumentCardImage, DocumentCardTitle, DocumentCardDetails, PrimaryButton } from '@fluentui/react';

const Rewards = () => {
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/rewards`)
      .then(response => response.json())
      .then(data => setRewards(data));
  }, []);

  return (
    <Carousel>
      {rewards.map((reward, index) => (
        <div key={index}>
          <DocumentCard>
            <DocumentCardImage imageFit='cover' height={150} imageSrc={reward.image} />
            <DocumentCardDetails>
              <DocumentCardTitle title={reward.title} shouldTruncate />
              <p>{reward.description}</p>
              <p>Amount: {reward.amount}</p>
              <PrimaryButton text="Redeem" />
            </DocumentCardDetails>
          </DocumentCard>
        </div>
      ))}
    </Carousel>
  );
};

export default Rewards;
